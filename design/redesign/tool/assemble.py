"""Package the redesign selector for publishing.

    python3 tool/assemble.py            # writes R/out/

Reads sections.json, directions.json, site/frag/*/*.meta.json, site/shots/*.json,
and produces R/out/index.html (selector) plus every supporting file it references:
m-<sec>-<opt>.html (live mockups), shots/*.webp, today/*.webp, refs/*.webp.
"""
import json
import re
import shutil
from pathlib import Path

from PIL import Image

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
OUT = R / "out"
FONTS_LINK = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
              '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
              '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@75..125,200..900'
              '&family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap">')


BLURBS = {
    "nav": "The bar every page opens with, shown with the Capabilities menu open: your lockup, the five sections, and the Audit Request action.",
    "hero": "The first screen: the thesis over the frosted film, the two doors (System Audit and contact), and the fixed-scope note.",
    "reframe": "The turn from symptom to cause: most teams are fixing the wrong layer, and the three misdiagnoses behind it.",
    "evidence": "Four researched numbers that make the diagnosis, each with its source.",
    "stack": "The operating stack: the layers Kelwin installs, what each one does, and how they fit together.",
    "architecture": "The centrepiece diagram: narrative, channels, signals and intelligence closing into one loop.",
    "statechange": "The shift from resetting every quarter to a system that compounds.",
    "principle": "One principle stated large: in a noisy market, the clearest company wins. A pause between dense sections.",
    "method": "How the install runs, phase by phase, and what each phase leaves behind. On the live site it advances with scroll.",
    "fit": "Who Kelwin is for and who it declines: the qualification, stated plainly.",
    "assets": "What the client owns when the engagement ends: the system, documented, in their stack.",
    "beforeafter": "Six paired rows: the same team before and after the system.",
    "faq": "The objections, answered: agency comparison, the audit, install length, and working with the team.",
    "cta": "The closing decision: initiate the System Audit, or talk to the team.",
    "footer": "Sitemap, contact, colophon and legal links.",
    "interior": "How every inner page opens, shown on the Narrative Systems capability page: page header plus the first body section.",
}

SKINS = [
    {"id": "swiss", "name": "Swiss Systems", "spec": "MONA SANS 110% · JETBRAINS MONO · FLAT · 12-COL",
     "display": '"Mona Sans", "Helvetica Neue", Arial, sans-serif', "stretch": "110%", "dWeight": 430, "lWeight": 300,
     "monoLine": "01 — Thesis · KELWIN/OS",
     "swatches": [
         {"name": "Red", "hex": "#BF3A36", "text": "#FBFAF6"}, {"name": "Deep", "hex": "#8E2824", "text": "#FBFAF6"},
         {"name": "Graphite", "hex": "#141517", "text": "#B9BCC2"}, {"name": "Paper", "hex": "#FBFAF6", "text": "#110F0A"},
         {"name": "Ink", "hex": "#110F0A", "text": "#B9BCC2"}, {"name": "Blush", "hex": "#F2C9BF", "text": "#110F0A"},
         {"name": "Fog", "hex": "#B9BCC2", "text": "#110F0A"}, {"name": "Signal", "hex": "#E8564E", "text": "#110F0A"}]},
    {"id": "kelwin", "name": "Kelwin today", "spec": "INSTRUMENT SANS · INTER · JETBRAINS MONO",
     "display": '"Instrument Sans", "Helvetica Neue", Arial, sans-serif', "stretch": "100%", "dWeight": 400, "lWeight": 400,
     "monoLine": "KELWIN/OS · DIAGNOSTIC",
     "swatches": [
         {"name": "Charcoal", "hex": "#110F0A", "text": "#C7B49D"}, {"name": "Red", "hex": "#BF3A36", "text": "#FBFAF6"},
         {"name": "Sand", "hex": "#C7B49D", "text": "#110F0A"}, {"name": "Clay", "hex": "#A65A45", "text": "#FBFAF6"},
         {"name": "Patina", "hex": "#5E7D6C", "text": "#FBFAF6"}, {"name": "Steel", "hex": "#6E8091", "text": "#FBFAF6"},
         {"name": "Bone", "hex": "#ECE8DF", "text": "#110F0A"}, {"name": "Paper", "hex": "#FBFAF6", "text": "#110F0A"}]},
]


def webp(src: Path, dst: Path, width: int = 1200, q: int = 80):
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(dst, "WEBP", quality=q, method=6)


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    sections = json.loads((R / "sections.json").read_text())
    dirs = json.loads((R / "directions.json").read_text())
    data = {"skins": SKINS, "directions": [], "sections": [], "notice": ""}
    for sub in ("brand", "fonts"):
        shutil.copytree(SITE / sub, OUT / sub)
    (OUT / "img").mkdir()
    shutil.copy(SITE / "img" / "film-room.webp", OUT / "img" / "film-room.webp")

    for d in dirs["directions"]:
        cover = Path(d["cover_ref"])
        cover = cover if cover.is_absolute() else R / cover
        rel = f"refs/dir-{d['id']}.webp"
        if cover.exists():
            webp(cover, OUT / rel, 900, 82)
        data["directions"].append({"id": d["id"], "name": d["name"], "oneLiner": d["one_liner"],
                                   "traits": d.get("traits", [])[:4], "cover": rel, "coverSite": d.get("cover_site", "")})

    missing = []
    for s in sections:
        sid = s["id"]
        today = SITE / "today" / f"{sid}.png"
        entry = {"id": sid, "name": s["name"], "job": BLURBS.get(sid, s["job"]), "today": f"today/{sid}.webp", "options": []}
        if today.exists():
            webp(today, OUT / entry["today"])
        for opt in "ABC":
            frag = SITE / "frag" / sid
            meta_p = frag / f"{opt}.meta.json"
            page = SITE / f"m-{sid}-{opt}.html"
            shot = SITE / "shots" / f"{sid}-{opt}.png"
            shot_k = SITE / "shots" / f"{sid}-{opt}.k.png"
            if not (meta_p.exists() and page.exists() and shot.exists()):
                missing.append(f"{sid}-{opt}")
                continue
            meta = json.loads(meta_p.read_text())
            lint = json.loads((SITE / "shots" / f"{sid}-{opt}.json").read_text())
            html = page.read_text()
            # Google Fonts first; the self-hosted faces stay as a named fallback ("… Local")
            for fam in ("Mona Sans", "Instrument Sans", "Inter", "JetBrains Mono"):
                html = html.replace(f'@font-face {{ font-family: "{fam}";', f'@font-face {{ font-family: "{fam} Local";')
                html = html.replace(f'"{fam}", ', f'"{fam}", "{fam} Local", ')
            html = html.replace("</title>", "</title>\n" + FONTS_LINK, 1)
            (OUT / f"m-{sid}-{opt}.html").write_text(html)
            webp(shot, OUT / f"shots/{sid}-{opt}.webp")
            webp(shot_k if shot_k.exists() else shot, OUT / f"shots/{sid}-{opt}.k.webp")
            ref = meta.get("reference", {}) or {}
            thumb = ""
            rf = ref.get("ref_file", "")
            rp = (R / rf) if rf and not Path(rf).is_absolute() else Path(rf) if rf else None
            if rp and rp.exists():
                thumb = f"refs/{sid}-{opt}.webp"
                webp(rp, OUT / thumb, 640, 80)
            entry["options"].append({
                "opt": opt, "title": meta.get("title", f"Option {opt}"), "direction": meta.get("direction", opt),
                "summary": meta.get("summary", ""), "motion": meta.get("motion", []),
                "reference": {"site": ref.get("site", ""), "url": ref.get("mobbin_url", ""), "thumb": thumb,
                              "borrowed": ref.get("borrowed", ""), "kelwin": ref.get("kelwin", "")},
                "shot": f"shots/{sid}-{opt}.webp", "shotK": f"shots/{sid}-{opt}.k.webp",
                "frame": f"m-{sid}-{opt}.html", "height": int(lint.get("height", 900)),
            })
        data["sections"].append(entry)

    notices = dirs.get("ai_usage_notices_all", [])
    if notices:
        data["notice"] = "".join(f"<p>{n}</p>" for n in notices)

    tpl = (R / "tool" / "selector.template.html").read_text()
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    page = tpl.replace("/*__DATA__*/null", blob, 1)
    (OUT / "index.html").write_text(page)
    # local preview = the publish skeleton around the page, so tests match production
    (R / "preview.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                    'content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>'
                                    + page + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out-files.json").write_text(json.dumps(files, indent=0))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"sections {len(data['sections'])} · options {sum(len(s['options']) for s in data['sections'])} · "
          f"files {len(files)} · {size / 1e6:.1f} MB · missing {missing or 'none'}")


if __name__ == "__main__":
    main()
