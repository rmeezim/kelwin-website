"""Package the round-8 review page: every interior page as a clickable mockup, one review card per page,
the round-7 calls as applied, and the eight founder questions.

    python3 tool/assemble8.py [--no-walk]   -> R/out8/ (index.html + files), R/out8-files.json, R/preview8.html

Reads the repo's design/redesign/interior-plan.json, tool/review8.json (the cards: copy, flags, questions),
site/page-<name>.html (stitched by ipage.py) and the round-7 shots in <scratchpad>/out8/shots. Every internal
link in the mockups is rewired to the sibling mockup, so the founder can click through the site.
"""
import argparse
import json
import re
import shutil
import subprocess
from pathlib import Path

from assemble2 import publishable, webp

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
OUT = R / "out8"
SHOTS7 = R.parent / "out8" / "shots"
PLAN = Path("/home/user/kelwin-website/design/redesign/interior-plan.json")

ROUTES = {"/": "page-home.html", "/audit": "page-audit.html", "/contact": "page-contact.html", "/about": "page-about.html",
          "/who-we-work-with": "page-who-we-work-with.html", "/careers": "page-careers.html", "/the-lab": "page-the-lab.html",
          "/insights": "page-insights.html", "/reports": "page-reports.html", "/privacy": "page-privacy.html", "/terms": "page-terms.html",
          "/capabilities/narrative-systems": "page-narrative-systems.html",
          "/capabilities/gtm-infrastructure": "page-gtm-infrastructure.html",
          "/capabilities/gtm-intelligence": "page-gtm-intelligence.html",
          "/insights/revenue-entropy": "page-revenue-entropy.html",
          "/insights/the-17-percent-window": "page-the-17-percent-window.html",
          "/insights/deliverability-is-infrastructure": "page-deliverability-is-infrastructure.html",
          "/capabilities": "page-home.html#s-system"}  # the homepage mockup's plain nav; the System section is the one-page stack


def rewire(html: str, unknown: set) -> str:
    """href="/route?query#frag" -> href="page-route.html#frag" (queries can't reach an artifact page; dropped)."""
    def sub(m):
        path, frag = m.group(1) or "/", m.group(3) or ""
        path = path.rstrip("/") or "/"
        if path not in ROUTES:
            unknown.add(path)
            return m.group(0)
        to = ROUTES[path]
        return f'href="{to if "#" in to else to + frag}"'
    # same-page "#frag" links have no path and stay as they are
    html = re.sub(r'href="(/[^"?#]*)(\?[^"#]*)?(#[^"]*)?"', sub, html)
    # links a script builds from data ({ href: "/capabilities/…" } in the audit gate)
    return re.sub(r'href: "(/[^"?#]*)"', lambda m: f'href: "{ROUTES.get(m.group(1).rstrip("/") or "/", m.group(1))}"', html)


def page(src: Path, dst: Path, title: str, unknown: set):
    html = publishable(src.read_text())
    html = re.sub(r"<title>[^<]*</title>", f"<title>{title} · Kelwin mockup</title>", html, count=1)
    dst.write_text(rewire(html, unknown))


def walk(name: str, frames: list):
    r = subprocess.run(["node", str(R / "tool" / "walk8.mjs"), f"page-{name}.html", "900"], cwd=R, capture_output=True, text=True)
    m = re.search(r"height (\d+) errors (.*)", r.stdout)
    shots = sorted((SITE / "walk8").glob(f"{name}-[0-9][0-9].png"))
    for i, p in enumerate(shots, 1):
        webp(p, OUT / "walk" / f"{name}-{i:02d}.webp", width=960, q=76)
        frames.append(f"walk/{name}-{i:02d}.webp")
    return int(m.group(1)) if m else 0, (m.group(2) if m else r.stderr[-300:])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-walk", action="store_true")
    a = ap.parse_args()
    keep_walk = a.no_walk and (OUT / "walk").exists()
    if keep_walk:
        shutil.move(OUT / "walk", R / ".walk-keep")
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    if keep_walk:
        shutil.move(R / ".walk-keep", OUT / "walk")
    for d in ("brand", "fonts"):
        shutil.copytree(SITE / d, OUT / d)
    (OUT / "shots").mkdir()
    for p in sorted(SHOTS7.glob("*.png")):
        webp(p, OUT / "shots" / (p.stem + ".webp"), width=1440, q=82)
    ba = R / "qa" / "r7-principle" / "before-after-390.png"
    if ba.exists():
        webp(ba, OUT / "shots" / "r7-principle.webp", width=816, q=86)

    cfg = json.loads((R / "tool" / "review8.json").read_text())
    plan = {p["file"]: p for p in json.loads(PLAN.read_text())["pages"]}
    unknown, report = set(), []
    hfile = OUT / "walk" / "heights.json"
    heights = json.loads(hfile.read_text()) if keep_walk and hfile.exists() else {}
    subprocess.run(["python3", str(R / "tool" / "home.py"), "--out", "page-home.html"], check=True, capture_output=True)
    page(SITE / "page-home.html", OUT / "page-home.html", "Homepage", unknown)
    for card in cfg["pages"]:
        for inst in card["instances"]:
            name = inst["name"]
            src = SITE / f"page-{name}.html"
            if not src.exists():
                report.append(f"MISSING {name}")
                continue
            page(src, OUT / f"page-{name}.html", inst["label"], unknown)
            inst["file"] = f"page-{name}.html"
            inst["frames"] = []
            if keep_walk:
                inst["frames"] = [f"walk/{p.name}" for p in sorted((OUT / "walk").glob(f"{name}-[0-9][0-9].webp"))]
                inst["height"] = heights.get(name, 0)
            else:
                h, errs = walk(name, inst["frames"])
                inst["height"] = heights[name] = h
                report.append(f"{name}: {h}px, {len(inst['frames'])} frames, errors {errs}")
    (OUT / "walk").mkdir(exist_ok=True)
    hfile.write_text(json.dumps(heights))
    cfg["plan"] = {k: {"question": v.get("question", ""), "title": v.get("title", "")} for k, v in plan.items()}
    tpl = (R / "tool" / "selector8.template.html").read_text()
    out = tpl.replace("/*__DATA__*/null", json.dumps(cfg, ensure_ascii=False).replace("</", "<\\/"), 1)
    (OUT / "index.html").write_text(out)
    (R / "preview8.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                     'content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="out8/"></head><body>' + out + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out8-files.json").write_text(json.dumps(files))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print("\n".join(report))
    print(f"files {len(files)} · {size / 1e6:.1f} MB · unknown routes {sorted(unknown) or 'none'}")


if __name__ == "__main__":
    main()
