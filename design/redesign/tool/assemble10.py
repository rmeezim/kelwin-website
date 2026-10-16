"""Package the round-10 review page: four proposals and the next steps, as decisions.

    python3 tool/assemble10.py [--data tool/review10.json] [--max-files 239]
        -> R/out10/ (index.html + files), R/out10-files.json, R/preview10.html

Reads tool/review10.json (the data) and tool/selector10.template.html (the page). In the data, a value starting
with TODO shows as a marked placeholder; a path ending _src is relative to R, or to the repository when it starts
with "REPO:". A source that isn't on disk yet is reported, not fatal: its part of the page shows "to come".

  · sitemap: the outline is parsed from SITEMAP.md's map (§3), and each row is matched to its card in
    sitemap.source (qa/r10/sitemap.json) for its route and status. The card's words (purpose, leads, perception,
    doors) come from SITEMAP.md itself, so the review card and the reading page always say the same thing.
  · documents: SITEMAP.md, BUSINESS-MODEL.md, VOICE.md and NEXT-STEPS.md become reading pages (sitemap.html,
    business-model.html, voice.html, next-steps.html); the Narrative Systems copy deck becomes narrative-systems.html
    with only the page's words and its notes for the founder (no build notes, no checklist).
  · films: each artifact film (and its phone version), each page-turn film (and its phone version), decoded end
    to end with ffmpeg first (a film that doesn't decode cleanly is reported and left out), then copied as
    films/<id>.mp4 with a poster (the given poster_src, else a frame at poster_at seconds, else a late frame) and
    its size and length. Every film used is listed in qa/r10/review/FILMS-USED.json, so a final film can be
    swapped in by path.
  · prototypes: an artifact's protos (each a fragment page, site/m-<section>-<slot>.html: the drawing alone, none
    of the round-9 page around it) are copied as proto-<id>[-n].html: links made inert, comments dropped, the
    1440 stage zoomed to the viewer as the stitched pages do, anything listed in "hide" taken out (the round-9
    head above a head drawing), and the "fix" wording corrected in the copy (reported, so the source gets fixed).
"""
import argparse
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

from assemble2 import publishable
from md10 import parse_tree, plain, render_deck, render_doc, slug

R = Path(__file__).resolve().parent.parent
REPO = Path("/home/user/kelwin-website")
SITE = R / "site"
OUT = R / "out10"
FF = R.parent / "ffenv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"


FILMS_USED = R / "qa" / "r10" / "review" / "FILMS-USED.json"


def todo(v) -> bool:
    return not v or (isinstance(v, str) and v.startswith("TODO"))


def src_path(v: str) -> Path:
    return REPO / v[5:] if v.startswith("REPO:") else R / v


def probe(mp4: Path) -> dict:
    r = subprocess.run([str(FF), "-hide_banner", "-i", str(mp4)], capture_output=True, text=True)
    d = re.search(r"Duration: (\d+):(\d+):([\d.]+)", r.stderr)
    s = re.search(r"Video: .*?, (\d{2,5})x(\d{2,5})", r.stderr)
    out = {}
    if d:
        out["seconds"] = round(int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3)), 2)
    if s:
        out["w"], out["h"] = int(s.group(1)), int(s.group(2))
    return out


def decodes(mp4: Path) -> str:
    """'' when ffmpeg reads every frame without an error, else the first error lines."""
    r = subprocess.run([str(FF), "-hide_banner", "-v", "error", "-i", str(mp4), "-f", "null", "-"], capture_output=True, text=True)
    err = (r.stderr or "").strip()
    return "" if r.returncode == 0 and not err else (err.splitlines() or ["exit %d" % r.returncode])[0][:200]


def poster_from(mp4: Path, dst: Path, at: float) -> bool:
    with tempfile.TemporaryDirectory() as td:
        png = Path(td) / "p.png"
        subprocess.run([str(FF), "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{max(0, at):.2f}", "-i", str(mp4), "-frames:v", "1", str(png)], capture_output=True)
        if not png.exists():
            return False
        Image.open(png).convert("RGB").save(dst, "WEBP", quality=80, method=6)
    return True


USED = []


def film(f: dict, key: str, fid: str, report: list, prefix: str = "", role: str = ""):
    """f[key] (a path) -> f[out] (packaged), with poster, size and length. key 'src' or 'phone_src'."""
    phone = key == "phone_src"
    outk = "phone" if phone else "src"
    pk = "phone_poster" if phone else "poster"
    v = f.get(key, "")
    if not phone:
        f["src_in"] = v
    f[outk], f[pk] = "", ""
    if todo(v):
        return
    src = R / v
    if not src.exists() or src.stat().st_size < 1024:
        report.append(f"MISSING film {v}" + (" (empty file)" if src.exists() else ""))
        return
    bad = decodes(src)
    if bad:
        report.append(f"INCOMPLETE film {v}: {bad} (left out)")
        return
    (OUT / "films").mkdir(exist_ok=True)
    name = f"{prefix}{fid}{'-phone' if phone else ''}"
    shutil.copy2(src, OUT / "films" / f"{name}.mp4")
    meta = probe(src)
    sfx = "phone_" if phone else ""
    f[outk] = f"films/{name}.mp4"
    f[f"{sfx}seconds"], f[f"{sfx}w"], f[f"{sfx}h"] = meta.get("seconds", 0), meta.get("w", 0), meta.get("h", 0)
    given = f.get("phone_poster_src" if phone else "poster_src", "")
    dst = OUT / "films" / f"{name}.webp"
    if not todo(given) and (R / given).exists():
        Image.open(R / given).convert("RGB").save(dst, "WEBP", quality=80, method=6)
        f[pk] = f"films/{name}.webp"
    elif poster_from(src, dst, f.get("poster_at") if (not phone and f.get("poster_at")) else meta.get("seconds", 1) * 0.92):
        f[pk] = f"films/{name}.webp"
    size = src.stat().st_size
    USED.append({"film": f"{prefix}{fid}", "drawing": role, "label": f.get("label") or f.get("name", ""), "size": "phone" if phone else "desktop",
                 "source": v, "packaged_as": f[outk], "poster": f[pk], "seconds": meta.get("seconds", 0), "frames": f"{meta.get('w', 0)}x{meta.get('h', 0)}",
                 "bytes": size, "decoded": "complete", "note": f.get("lead_note", "")})
    if size > 1.5 * 1024 * 1024:
        report.append(f"FILM over 1.5 MB: {v} ({size / 1e6:.2f} MB)")


FIELDS = ("Purpose", "Lead generation", "Perception", "Audience", "Doors", "How we'd know it works", "Waits on", "Notes")


def md_cards(md: str) -> dict:
    """SITEMAP.md §4: {card name: {field: text}}, markdown emphasis removed."""
    out = {}
    parts = re.split(r"^#### (.+)$", md, flags=re.M)
    alt = "|".join(re.escape(x) for x in FIELDS)
    for name, body in zip(parts[1::2], parts[2::2]):
        body = re.split(r"^(?:#{1,3} |---\s*$)", body, flags=re.M)[0]
        fields = {}
        for m in re.finditer(rf"^\*\*({alt})\.\*\*\s*(.*?)(?=^\*\*(?:{alt})\.\*\*|\Z)", body, flags=re.M | re.S):
            fields[m.group(1)] = re.sub(r"\*\*|`", "", m.group(2)).strip()
        doors = re.split(r"\.\s+(?=(?:Second|Onward):)", fields.get("Doors", ""), maxsplit=1)
        fields["primary"] = re.sub(r"^Main:\s*", "", doors[0]).rstrip(".")
        fields["secondary"] = re.sub(r"^Second:\s*", "", doors[1]).rstrip(".") if len(doors) > 1 else ""
        out[name.strip()] = fields
    return out


def strip_comments(html: str) -> str:
    """HTML comments out, outside <script> and <style> only."""
    parts = re.split(r"(<script\b.*?</script>|<style\b.*?</style>)", html, flags=re.S | re.I)
    return "".join(p if i % 2 else re.sub(r"<!--.*?-->", "", p, flags=re.S) for i, p in enumerate(parts))


def proto_page(html: str, title: str, pr: dict, report: list, name: str) -> str:
    """A fragment page (the drawing alone, on a fixed 1440 stage) made to stand on its own in the package."""
    html = strip_comments(publishable(html))
    html = re.sub(r"<title>[^<]*</title>", f"<title>{title}</title>", html, count=1)
    html = re.sub(r'href="/[^"]*"', 'href="#"', html)
    for a, b in pr.get("fix", []):
        if a in html:
            report.append(f"{name}: the source still says “{a}”; the package says “{b}” (fix it in the drawing)")
            html = html.replace(a, b)
    html = re.sub(r'<meta name="viewport"[^>]*>', '<meta name="viewport" content="width=device-width, initial-scale=1">', html, count=1)
    hide = ", ".join(pr.get("hide", []))
    head = ('<style>body { width: 1440px; zoom: var(--page-zoom, 1); }'
            + (f" {hide} {{ display: none !important; }}" if hide else "") + "</style>"
            '<script>document.documentElement.classList.add("km-home");</script>')
    html = html.replace("</head>", head + "</head>", 1)
    fit = ('<script>(function () { function fit() { document.body.style.setProperty("--page-zoom", Math.min(1, window.innerWidth / 1440)); }'
           ' fit(); window.addEventListener("resize", fit); })();</script>')
    parts = re.split(r"(<script\b.*?</script>|<style\b.*?</style>)", html, flags=re.S | re.I)   # the real <body>, never one quoted in a comment
    for i in range(0, len(parts), 2):
        if re.search(r"<body\b[^>]*>", parts[i]):
            parts[i] = re.sub(r"(<body\b[^>]*>)", lambda m: m.group(1) + fit, parts[i], count=1)
            return "".join(parts)
    report.append(f"{name}: no <body> tag found; the stage isn't zoomed")
    return html


def cards(sm: dict, tree: list, report: list, words: dict = None) -> dict:
    """Match each outline row to its card in sitemap.json; returns {card id: card} and sets row['card']."""
    pages = json.loads(src_path(sm["source"]).read_text())["pages"]
    def base(route):
        r = route.split(" · ")[0].strip()
        return r if r.startswith("(") else r.split(" ")[0].rstrip(",")
    def lab(route):
        m = re.search(r"·\s*(?:screen|step):\s*(.+)$", route)
        return m.group(1).strip().lower() if m else ""
    out, used, ids = {}, set(), {}
    for p in pages:
        cid = slug(p["name"])
        while cid in ids.values():
            cid += "-x"
        ids[id(p)] = cid
    parents = []
    for row in tree:
        while parents and parents[-1][0] >= row["depth"]:
            parents.pop()
        r = row["route"]
        hit = None
        if r.startswith(("/", "(")):
            tok = r if r.startswith("(") else r.split(",")[0].split(" ")[0]
            hit = next((p for p in pages if id(p) not in used and base(p["route"]) == tok and not lab(p["route"])), None)
        elif r.startswith(("screen", "step")):
            name = row["name"].lower()
            par = parents[-1][1] if parents else ""
            cands = [p for p in pages if id(p) not in used and lab(p["route"]) and (name == lab(p["route"]) or name.startswith(lab(p["route"])))]
            hit = next((p for p in cands if base(p["route"]) == par), None) or (cands[0] if cands else None)
        if r.startswith("/"):
            parents.append((row["depth"], r.split(",")[0].split(" ")[0]))
        if hit:
            used.add(id(hit))
            cid = ids[id(hit)]
            row["card"] = cid
            w = (words or {}).get(hit["name"])
            if words is not None and not w:
                report.append(f"sitemap: no card in SITEMAP.md for {hit['name']}; its words come from sitemap.json")
            w = w or {"Purpose": hit.get("purpose", ""), "Lead generation": hit.get("lead_generation", ""), "Perception": hit.get("perception", ""),
                      "primary": hit.get("primary_cta", ""), "secondary": hit.get("secondary_cta", "")}
            out[cid] = {"name": hit["name"], "route": hit["route"], "status": hit["status"],
                        "purpose": plain(w.get("Purpose", "")), "leads": plain(w.get("Lead generation", "")), "perception": plain(w.get("Perception", "")),
                        "primary": plain(w.get("primary", "")), "secondary": plain(w.get("secondary", "")), "anchor": ""}
        elif not row["group"] and not r.startswith("/#s-"):
            report.append(f"sitemap: no card for the outline row {r} · {row['name']}")
    for p in pages:
        if id(p) not in used:
            report.append(f"sitemap: card not in the outline: {p['route']} · {p['name']}")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-files", type=int, default=239)
    ap.add_argument("--data", default=str(R / "tool" / "review10.json"))
    a = ap.parse_args()
    data_path = Path(a.data) if Path(a.data).is_absolute() else R / a.data
    cfg = json.loads(data_path.read_text())
    report = []

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    shutil.copytree(SITE / "brand", OUT / "brand")
    (OUT / "fonts").mkdir()
    for f in ("MonaSans.woff2", "JetBrainsMono.woff2"):
        shutil.copy2(SITE / "fonts" / f, OUT / "fonts" / f)

    # ── the sitemap: outline, cards, the full document ──
    sm = cfg["sitemap"]
    smd = src_path(sm["doc_src"])
    if smd.exists():
        md = smd.read_text()
        code = re.search(r"## 3 · The map.*?```\n(.*?)```", md, re.S)
        sm["tree"] = parse_tree(code.group(1)) if code else []
        if not code:
            report.append("sitemap: no outline found in SITEMAP.md §3")
        sm["cards"] = cards(sm, sm["tree"], report, md_cards(md)) if not todo(sm.get("source")) and src_path(sm["source"]).exists() else {}
        html, anchors = render_doc(md, "The sitemap", "Round 10 · a proposal for your yes",
                                   "Every page the site has, needs or should lose, with its purpose, its part in bringing leads and its part in how Kelwin is seen.",
                                   clean=lambda s: plain(s).replace("§", "section "))
        (OUT / "sitemap.html").write_text(html)
        sm["doc"] = "sitemap.html"
        for c in sm["cards"].values():
            c["anchor"] = anchors.get(c["name"], "")
            if not c["anchor"]:
                report.append(f"sitemap: no heading in SITEMAP.md for card {c['name']}")
    else:
        report.append(f"MISSING {sm['doc_src']}")
        sm["tree"], sm["cards"], sm["doc"] = [], {}, ""

    # ── the other documents ──
    docs = [("business", "doc_src", "business-model.html", "The business model", "Round 10 · a proposal for your yes",
             "Your packages, pilot and prices, researched, then read again by us the way a buyer and an operator and lawyer would read them. Figures as reported, to be re-checked before you quote them."),
            ("voice", "doc_src", "voice.html", "The Kelwin voice", "Round 10 · a draft for your yes",
             "How Kelwin writes, so the copy stops reading as AI-made: who is speaking, the rules and their tests, the words we never use, and 25 rewrites."),
            ("next", "src", "next-steps.html", "Next steps", "Round 10 · for your yes", "")]
    for sec, key, name, title, kicker, lede in docs:
        part = cfg.get(sec, {})
        p = src_path(part.get(key, "TODO")) if not todo(part.get(key)) else None
        outkey = "doc"
        if p and p.exists():
            html, _ = render_doc(p.read_text(), title, kicker, lede, clean=plain)
            (OUT / name).write_text(html)
            part[outkey] = name
        else:
            part[outkey] = ""
            report.append(f"MISSING document for {sec}: {part.get(key)}")
    vo = cfg["voice"]
    nsp = src_path(vo.get("ns_src", "TODO")) if not todo(vo.get("ns_src")) else None
    if nsp and nsp.exists():
        html = render_deck(plain(nsp.read_text()), "Narrative Systems, rewritten", "Round 10 · the page's words, for your yes",
                           "The whole page rewritten in the Kelwin voice, top to bottom: the exact words for each section, with a note on the drawing each one needs.",
                           keep=["What you said", "The page, top to bottom", "1 ·", "2 ·", "3 ·", "4 ·", "5 ·", "6 ·", "Page title", "Numbers and promises", "Decisions for you"],
                           folded_h2=("Numbers and promises",))
        (OUT / "narrative-systems.html").write_text(html)
        vo["ns_doc"] = "narrative-systems.html"
    else:
        vo["ns_doc"] = ""
        report.append(f"MISSING the copy deck {vo.get('ns_src')}")

    # ── films and prototypes ──
    ar = cfg["artifacts"]
    proto_fonts = False
    for it in ar["items"]:
        for f in it.get("films", []):
            film(f, "src", f["id"], report, role=it.get("page", ""))
            film(f, "phone_src", f["id"], report, role=it.get("page", ""))
        it["protos"] = []
        for n, pr in enumerate(it.get("protos_src", [])):
            ps = pr.get("src", "")
            if todo(ps):
                continue
            src = R / ps
            if not src.exists():
                report.append(f"MISSING prototype {ps}")
                continue
            name = f"proto-{it['id']}{'' if n == 0 else '-' + str(n + 1)}.html"
            (OUT / name).write_text(proto_page(src.read_text(), f"{it['page']} · {pr.get('label', 'drawing')} · Kelwin prototype", pr, report, name))
            it["protos"].append({"href": name, "label": pr.get("label", "Try the drawing")})
            USED.append({"prototype": name, "drawing": it.get("page", ""), "source": ps})
            proto_fonts = True
    tu = ar["turn"]
    for o in tu["options"]:
        film(o, "src", o["id"], report, prefix="turn-", role="page turn")
        film(o, "phone_src", o["id"], report, prefix="turn-", role="page turn")
    if proto_fonts:
        for f in ("InstrumentSans.woff2", "Inter.woff2"):
            shutil.copy2(SITE / "fonts" / f, OUT / "fonts" / f)
        (OUT / "img").mkdir(exist_ok=True)      # the frosted film stand-in only, never the v4 photographs
        shutil.copy2(SITE / "img" / "film-room.webp", OUT / "img" / "film-room.webp")
        for f in OUT.glob("proto-*.html"):
            for ref in re.findall(r'(?:src|href)="([^"#?:]+\.(?:webp|png|jpe?g|svg|woff2|js|css|mp4))"|url\(["\']?([^)"\'#?:]+)["\']?\)', f.read_text()):
                rel = ref[0] or ref[1]
                if rel and not rel.startswith(("/", "data", "%23")) and not (OUT / rel).exists():
                    if (SITE / rel).is_file():          # a library the drawing loads (GSAP), copied from the mockup site
                        (OUT / rel).parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(SITE / rel, OUT / rel)
                    else:
                        report.append(f"{f.name} asks for {rel}, which the package lacks")
    FILMS_USED.write_text(json.dumps({"_about": "Every film and prototype the round-10 review page packages, by source path. To swap in a final film, "
                                      "point the matching src / phone_src in tool/review10.json at it and run python3 tool/assemble10.py.",
                                      "items": USED}, ensure_ascii=False, indent=1))

    # ── the page ──
    tpl = (R / "tool" / "selector10.template.html").read_text()
    out = tpl.replace("/*__DATA__*/null", json.dumps(cfg, ensure_ascii=False).replace("</", "<\\/"), 1)
    (OUT / "index.html").write_text(out)
    (R / "preview10.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                      'content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="out10/"></head><body>' + out + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out10-files.json").write_text(json.dumps(files))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    raw = json.dumps(json.loads(data_path.read_text()), ensure_ascii=False)
    todos = re.findall(r'"(?:[a-z_]+)": "(TODO[^"]*)"', raw)

    print("\n".join(report) or "nothing missing")
    print(f"outline rows {len(sm.get('tree', []))} · cards {len(sm.get('cards', {}))}")
    print(f"TODO markers left in {data_path.name}: {len(todos)}")
    print(f"files {len(files)} (+ index.html) · {size / 1e6:.1f} MB")
    if len(files) + 1 > a.max_files:
        print(f"OVER the {a.max_files}-file budget")


if __name__ == "__main__":
    main()
