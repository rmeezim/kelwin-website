"""Package the round-2 review page.

    python3 tool/assemble2.py        -> R/out2/ (index.html + supporting files), R/out2-files.json

Reads sections.json, ROUND2-NOTES.md, system-ac.json, site/frag/*/{X,Y,Z}.meta.json,
site/shots/*, site/home.html.
"""
import json
import re
import shutil
from pathlib import Path

from PIL import Image

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
OUT = R / "out2"
FONTS_LINK = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
              '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
              '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@75..125,200..900'
              '&family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap">')
R1 = {"nav": "A", "hero": "A", "reframe": "A", "evidence": "A", "stack": "C", "architecture": "A", "statechange": "A",
      "principle": "C", "method": "A", "fit": "B", "assets": "A", "beforeafter": "A", "faq": "A", "cta": "A",
      "footer": "A", "interior": "A"}
LABELS = {"X": "Round 2", "Y": "Round 2 · alternative", "Z": "Round 2 · option 3"}
LABELS_BY_SEC = {"hero": {"X": "Your brief", "Y": "Alternative"},
                 "interior": {"X": "Option 1", "Y": "Option 2", "Z": "Option 3"}}
BLURBS = {
    "nav": "The bar every page opens with, shown with the Capabilities menu open.",
    "hero": "The first screen: the thesis over the frosted film, the two doors, and the fixed-scope note.",
    "reframe": "The turn from symptom to cause: most teams are fixing the wrong layer.",
    "evidence": "Four researched numbers that make the diagnosis, each with its source.",
    "stack": "The operating stack: the layers Kelwin installs and how they fit together.",
    "architecture": "The centrepiece diagram: one closed loop from narrative to intelligence and back.",
    "statechange": "The shift from resetting every quarter to a system that compounds.",
    "principle": "One principle stated large, as a pause between dense sections.",
    "method": "How the install runs, phase by phase, and what each phase leaves behind.",
    "fit": "Who Kelwin is for and who it declines.",
    "assets": "What the client owns when the engagement ends.",
    "beforeafter": "The same team, before and after the system.",
    "faq": "The objections, answered.",
    "cta": "The closing decision: the System Audit, or a conversation.",
    "footer": "Sitemap, contact, colophon and legal links.",
    "interior": "How every inner page opens, shown on the Narrative Systems capability page.",
}


def webp(src: Path, dst: Path, width: int = 1200, q: int = 80):
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(dst, "WEBP", quality=q, method=6)


def publishable(html: str) -> str:
    """Google Fonts first; the self-hosted faces stay as a named local fallback."""
    for fam in ("Mona Sans", "Instrument Sans", "Inter", "JetBrains Mono"):
        html = html.replace(f'@font-face {{ font-family: "{fam}";', f'@font-face {{ font-family: "{fam} Local";')
        html = html.replace(f'"{fam}", ', f'"{fam}", "{fam} Local", ')
    return html.replace("</title>", "</title>\n" + FONTS_LINK, 1)


def notes() -> dict:
    out = {}
    order = [s["id"] for s in json.loads((R / "sections.json").read_text())]
    for line in (R / "ROUND2-NOTES.md").read_text().splitlines():
        m = re.match(r"^(\d\d) [^:]+: [ABC] \([^)]*\)(?: — (.*))?$", line.strip())
        if m:
            note = (m.group(2) or "").strip()
            if note in ("no note.", ""):
                note = ""
            out[order[int(m.group(1)) - 1]] = note.strip('"')
    return out


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    shutil.copytree(SITE / "brand", OUT / "brand")
    shutil.copytree(SITE / "fonts", OUT / "fonts")
    shutil.copytree(SITE / "lib", OUT / "lib")
    (OUT / "img").mkdir()
    shutil.copy(SITE / "img" / "film-room.webp", OUT / "img" / "film-room.webp")
    sections = json.loads((R / "sections.json").read_text())
    system = json.loads((R / "system-ac.json").read_text())
    nts = notes()
    data = {"system": system, "home": "home.html", "sections": []}
    missing = []
    for s in sections:
        sid = s["id"]
        r1 = R1[sid]
        r1meta = json.loads((SITE / "frag" / sid / f"{r1}.meta.json").read_text())
        webp(SITE / "shots" / f"{sid}-{r1}.png", OUT / f"shots/r1-{sid}.webp")
        entry = {"id": sid, "name": s["name"], "blurb": BLURBS.get(sid, ""), "note": nts.get(sid, ""),
                 "r1": {"opt": r1, "title": r1meta.get("title", ""), "shot": f"shots/r1-{sid}.webp"}, "options": []}
        for slot in "XYZ":
            meta_p = SITE / "frag" / sid / f"{slot}.meta.json"
            page = SITE / f"m-{sid}-{slot}.html"
            shot = SITE / "shots" / f"{sid}-{slot}.png"
            if not meta_p.exists():
                continue
            if not (page.exists() and shot.exists()):
                missing.append(f"{sid}-{slot}")
                continue
            meta = json.loads(meta_p.read_text())
            lint = json.loads((SITE / "shots" / f"{sid}-{slot}.json").read_text())
            (OUT / f"m-{sid}-{slot}.html").write_text(publishable(page.read_text()))
            webp(shot, OUT / f"shots/{sid}-{slot}.webp")
            entry["options"].append({
                "slot": slot, "label": LABELS_BY_SEC.get(sid, {}).get(slot, LABELS[slot]),
                "title": meta.get("title", ""), "summary": meta.get("summary", ""), "motion": meta.get("motion", []),
                "addressed": meta.get("addressed", []), "shot": f"shots/{sid}-{slot}.webp",
                "frame": f"m-{sid}-{slot}.html", "height": int(lint.get("height", 900)),
            })
        if not entry["options"]:
            missing.append(f"{sid}: no round-2 option")
        data["sections"].append(entry)
    home = SITE / "home.html"
    if home.exists():
        (OUT / "home.html").write_text(publishable(home.read_text()))
    else:
        missing.append("home.html")
    tpl = (R / "tool" / "selector2.template.html").read_text()
    page = tpl.replace("/*__DATA__*/null", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"), 1)
    (OUT / "index.html").write_text(page)
    (R / "preview2.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                     'content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + page + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out2-files.json").write_text(json.dumps(files))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"sections {len(data['sections'])} · round-2 options {sum(len(x['options']) for x in data['sections'])} · "
          f"files {len(files)} · {size / 1e6:.1f} MB · missing {missing or 'none'}")


if __name__ == "__main__":
    main()
