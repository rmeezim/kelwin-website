"""Package the round-9 review page: the founder's answer to round 8.

    python3 tool/assemble9.py [--no-walk] [--max-files 239] [--data tool/review9.json]
        -> R/out9/ (index.html + files), R/out9-files.json, R/preview9.html

Reads tool/review9.json (the data; --data packages another copy, e.g. a draft with parts merged in), tool/selector9.template.html (the page), site/page-<name>.html (the
stitched mockups; a page not on disk yet is reported, not fatal), and the before/after images, films and
placement shots the data names (paths relative to R; a value starting with TODO means "not yet").

  · copies site/brand/, site/fonts/ and ONLY site/img/film-room.webp (never the v4 photographs), plus the
    lib/*.js a mockup loads (the homepage's GSAP; round 8's package lacked it)
  · stitches the homepage (tool/home.py --out page-home.html) and copies it with every listed page,
    rewiring internal links to the sibling mockups (round-8 routes + /projects, /projects/email-deliverability;
    queries dropped; /projects/<slug> without a mockup falls back to page-projects.html#<slug>)
  · walks each page with walk8.mjs at 1440 (frames -> walk/<name>-NN.webp, 960 wide) unless --no-walk,
    which keeps the walk frames of the previous run
  · packages the footer section's pictures (footer.r8_src and each option's shots[].img_src) as webp
  · keeps the package under --max-files (the artifact takes 255 files per publish): when the frames
    don't fit, every page is capped at the same number of frames, keeping its first and last, and
    the dropped frames are logged
"""
import argparse
import json
import re
import shutil
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

from assemble2 import publishable, webp

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
OUT = R / "out9"
KEEP = R / ".walk9-keep"

ROUTES = {"/": "page-home.html", "/audit": "page-audit.html", "/contact": "page-contact.html", "/about": "page-about.html",
          "/who-we-work-with": "page-who-we-work-with.html", "/careers": "page-careers.html", "/the-lab": "page-the-lab.html",
          "/insights": "page-insights.html", "/reports": "page-reports.html", "/privacy": "page-privacy.html", "/terms": "page-terms.html",
          "/capabilities/narrative-systems": "page-narrative-systems.html",
          "/capabilities/gtm-infrastructure": "page-gtm-infrastructure.html",
          "/capabilities/gtm-intelligence": "page-gtm-intelligence.html",
          "/insights/revenue-entropy": "page-revenue-entropy.html",
          "/insights/the-17-percent-window": "page-the-17-percent-window.html",
          "/insights/deliverability-is-infrastructure": "page-deliverability-is-infrastructure.html",
          "/projects": "page-projects.html",
          "/projects/email-deliverability": "page-email-deliverability.html",
          "/capabilities": "page-home.html#s-system"}  # the homepage mockup's plain nav; the System section is the one-page stack


def todo(v) -> bool:
    return not v or (isinstance(v, str) and v.startswith("TODO"))


def rewire(html: str, unknown: set, fallback: set) -> str:
    """href="/route?query#frag" -> href="page-route.html#frag" (queries can't reach an artifact page; dropped)."""
    def target(path: str, frag: str = ""):
        path = path.rstrip("/") or "/"
        if path in ROUTES:
            to = ROUTES[path]
            return to if "#" in to else to + frag
        m = re.match(r"^/projects/([a-z0-9-]+)$", path)
        if m:   # a project page that isn't a mockup yet: its row on the projects index
            fallback.add(path)
            return f"page-projects.html#{m.group(1)}"
        unknown.add(path)
        return None

    def sub(m):
        to = target(m.group(1) or "/", m.group(3) or "")
        return m.group(0) if to is None else f'href="{to}"'
    html = re.sub(r'href="(/[^"?#]*)(\?[^"#]*)?(#[^"]*)?"', sub, html)
    # links a script builds from data ({ href: "/capabilities/…" } in the audit gate)
    return re.sub(r'href: "(/[^"?#]*)"', lambda m: f'href: "{target(m.group(1)) or m.group(1)}"', html)


def page(src: Path, dst: Path, title: str, unknown: set, fallback: set):
    html = publishable(src.read_text())
    html = re.sub(r"<title>[^<]*</title>", f"<title>{title} · Kelwin mockup</title>", html, count=1)
    dst.write_text(rewire(html, unknown, fallback))


def walk(name: str):
    """walk8.mjs -> site/walk8/<name>-NN.png; returns (pngs, height, errors)."""
    r = subprocess.run(["node", str(R / "tool" / "walk8.mjs"), f"page-{name}.html", "900"], cwd=R, capture_output=True, text=True)
    m = re.search(r"height (\d+) errors (.*)", r.stdout)
    pngs = sorted((SITE / "walk8").glob(f"{name}-[0-9][0-9].png"))
    return pngs, (int(m.group(1)) if m else 0), (m.group(2) if m else (r.stderr or r.stdout)[-300:])


def keep_evenly(n: int, k: int) -> list:
    """k indices out of range(n), evenly spaced, always the first and the last."""
    if k >= n:
        return list(range(n))
    if k <= 1:
        return [0]
    return sorted({round(i * (n - 1) / (k - 1)) for i in range(k)})


def img(src_rel: str, dst: Path, width: int, report: list):
    """Copy an image named by the data into the package as webp; returns (rel path, w, h) or None."""
    if todo(src_rel):
        return None
    src = R / src_rel
    if not src.exists():
        report.append(f"MISSING image {src_rel}")
        return None
    webp(src, dst, width=width, q=84)
    with Image.open(dst) as im:
        return str(dst.relative_to(OUT)), im.width, im.height


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-walk", action="store_true")
    ap.add_argument("--max-files", type=int, default=239)
    ap.add_argument("--data", default=str(R / "tool" / "review9.json"), help="the data file (relative to R or absolute)")
    a = ap.parse_args()
    data_path = Path(a.data) if Path(a.data).is_absolute() else R / a.data

    keep_walk = a.no_walk and (OUT / "walk").exists()
    if KEEP.exists():
        shutil.rmtree(KEEP)
    if keep_walk:
        shutil.move(OUT / "walk", KEEP)
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for d in ("brand", "fonts"):
        shutil.copytree(SITE / d, OUT / d)
    (OUT / "img").mkdir()
    shutil.copy2(SITE / "img" / "film-room.webp", OUT / "img" / "film-room.webp")

    cfg = json.loads(data_path.read_text())
    report, unknown, fallback = [], set(), set()

    # ── the mockups ──
    subprocess.run(["python3", str(R / "tool" / "home.py"), "--out", "page-home.html"], cwd=R, check=True, capture_output=True)
    page(SITE / "page-home.html", OUT / "page-home.html", "Homepage", unknown, fallback)
    present = []
    for p in cfg["pages"]:
        src = SITE / f"page-{p['id']}.html"
        p["frames"], p["height"] = [], 0
        if not src.exists():
            p["file"] = ""
            report.append(f"MISSING page-{p['id']}.html (its card shows 'still being built')")
            continue
        page(src, OUT / f"page-{p['id']}.html", p["name"], unknown, fallback)
        p["file"] = f"page-{p['id']}.html"
        present.append(p)

    # ── scripts the mockups load from lib/ (the homepage's GSAP), copied as they are ──
    for f in OUT.glob("page-*.html"):
        for rel in set(re.findall(r'<script src="(lib/[^"]+\.js)"', f.read_text())):
            if (SITE / rel).exists() and not (OUT / rel).exists():
                (OUT / "lib").mkdir(exist_ok=True)
                shutil.copy2(SITE / rel, OUT / rel)

    # ── before / after images, films, placement shots ──
    for c in cfg["causes"]["items"]:
        for side in ("before", "after"):
            got = img(c.get(f"{side}_src", ""), OUT / "causes" / f"{c['id']}-{side}.webp", 1280, report)
            c[side], c[f"{side}_w"], c[f"{side}_h"] = (got if got else ("", 0, 0))
    for f in cfg["motion"]["films"]:
        f["src_in"], f["src"], f["poster"] = f.get("src", ""), "", ""
        if todo(f["src_in"]):
            continue
        src = R / f["src_in"]
        if not src.exists():
            report.append(f"MISSING film {f['src_in']}")
            continue
        (OUT / "films").mkdir(exist_ok=True)
        shutil.copy2(src, OUT / "films" / f"{f['id']}.mp4")
        f["src"] = f"films/{f['id']}.mp4"
        meta = src.with_suffix(".json")
        if meta.exists():
            m = json.loads(meta.read_text())
            f["seconds"], f["w"], f["h"] = m.get("seconds", 0), m.get("width", 1280), m.get("height", 800)
        poster = f.get("poster_src", "")
        if not todo(poster) and (R / poster).exists():
            shutil.copy2(R / poster, OUT / "films" / f"{f['id']}.webp")
            f["poster"] = f"films/{f['id']}.webp"
        elif not todo(poster):
            report.append(f"MISSING poster {poster}")
        size = src.stat().st_size
        if size > 1.5 * 1024 * 1024:
            report.append(f"FILM over 1.5 MB: {f['src_in']} ({size / 1e6:.2f} MB)")
    for x in cfg["projects"]["placement"]:
        got = img(x.get("img_src", ""), OUT / "shots" / f"projects-{x['id']}.webp", 1440, report)
        x["img"], x["img_w"], x["img_h"] = (got if got else ("", 0, 0))
    ft = cfg.get("footer")   # the footer section (his note during round 9); absent data hides the section
    if ft:
        got = img(ft.get("r8_src", ""), OUT / "footer" / "round-8.webp", 1440, report)
        ft["r8"], ft["r8_w"], ft["r8_h"] = (got if got else ("", 0, 0))
        for o in ft.get("options", []):
            for i, x in enumerate(o.get("shots", []), 1):
                got = img(x.get("img_src", ""), OUT / "footer" / f"{o['id']}-{i}.webp", 1440, report)
                x["img"], x["img_w"], x["img_h"] = (got if got else ("", 0, 0))

    # ── walk the pages (or keep the last run's frames) ──
    hfile = "heights.json"
    if a.no_walk:
        if keep_walk:
            shutil.move(KEEP, OUT / "walk")
        else:
            (OUT / "walk").mkdir()
            report.append("NO WALK: --no-walk and no frames from a previous run; the cards have no filmstrips")
        heights = json.loads((OUT / "walk" / hfile).read_text()) if (OUT / "walk" / hfile).exists() else {}
        names = {p["id"] for p in present}
        for f in (OUT / "walk").glob("*.webp"):     # frames of pages no longer in the data
            if f.name.rsplit("-", 1)[0] not in names:
                f.unlink()
        for p in present:
            p["frames"] = [f"walk/{f.name}" for f in sorted((OUT / "walk").glob(f"{p['id']}-[0-9][0-9].webp"))]
            p["height"] = heights.get(p["id"], 0)
            if not p["frames"]:
                report.append(f"NO FRAMES for {p['id']} (run without --no-walk)")
    else:
        (OUT / "walk").mkdir()
        with ThreadPoolExecutor(max_workers=3) as ex:
            walked = dict(zip([p["id"] for p in present], ex.map(walk, [p["id"] for p in present])))
        heights = {}
        # the budget: everything else is in place; the frames take what is left
        others = sum(1 for f in OUT.rglob("*") if f.is_file()) + 1   # + heights.json (index.html is not listed)
        budget = a.max_files - others
        total = sum(len(v[0]) for v in walked.values())
        cap = max(len(v[0]) for v in walked.values()) if walked else 0
        while cap > 1 and sum(min(len(v[0]), cap) for v in walked.values()) > budget:
            cap -= 1
        if total > budget:
            report.append(f"FRAMES capped at {cap} per page ({total} walked, {budget} fit under {a.max_files} files)")
        for p in present:
            pngs, h, errs = walked[p["id"]]
            keep = keep_evenly(len(pngs), cap)
            dropped = [i + 1 for i in range(len(pngs)) if i not in keep]
            if dropped:
                report.append(f"  {p['id']}: dropped frames {dropped} of {len(pngs)}")
            for j, i in enumerate(keep, 1):
                webp(pngs[i], OUT / "walk" / f"{p['id']}-{j:02d}.webp", width=960, q=76)
                p["frames"].append(f"walk/{p['id']}-{j:02d}.webp")
            p["height"] = heights[p["id"]] = h
            report.append(f"{p['id']}: {h}px, {len(pngs)} screens, {len(p['frames'])} kept, errors {errs}")
        (OUT / "walk" / hfile).write_text(json.dumps(heights))

    # ── relative assets the mockups ask for that the package doesn't carry (e.g. a v4 photograph) ──
    missing_assets = set()
    for f in OUT.glob("page-*.html"):
        for ref in re.findall(r'(?:src|href)="([^"#?:]+\.(?:webp|png|jpe?g|svg|woff2|js|css|mp4))"|url\(["\']?([^)"\'#?:]+)["\']?\)', f.read_text()):
            rel = ref[0] or ref[1]
            if rel and not rel.startswith(("/", "data", "%23")) and not (OUT / rel).exists():
                missing_assets.add(f"{f.name}: {rel}")

    # ── the page ──
    tpl = (R / "tool" / "selector9.template.html").read_text()
    out = tpl.replace("/*__DATA__*/null", json.dumps(cfg, ensure_ascii=False).replace("</", "<\\/"), 1)
    (OUT / "index.html").write_text(out)
    (R / "preview9.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                     'content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="out9/"></head><body>' + out + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out9-files.json").write_text(json.dumps(files))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    todos = len(re.findall(r'"TODO', json.dumps(json.loads(data_path.read_text()), ensure_ascii=False)))

    print("\n".join(report))
    print(f"unknown routes {sorted(unknown) or 'none'} · project routes sent to the index {sorted(fallback) or 'none'}")
    print(f"assets the package lacks {sorted(missing_assets) or 'none'}")
    print(f"TODO markers left in {data_path.name}: {todos}")
    print(f"files {len(files)} (+ index.html) · {size / 1e6:.1f} MB")
    if len(files) + 1 > 255:
        print("OVER the 255-file publish limit")


if __name__ == "__main__":
    main()
