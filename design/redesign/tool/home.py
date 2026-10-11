"""Stitch the round-2 sections into one scrolling homepage prototype.

    python3 tool/home.py                              -> R/site/home.html (or home-s.html when story-order.json exists)
    python3 tool/home.py --only system,principle --out home-system.html [--slot system=V]
                                                      -> a partial stitch (story order, listed ids only) for testing

Each section keeps its own scoped CSS/JS. Entrance animations are keyed off `.is-play`
on an ancestor, so every section sits in a .km-slot that gains `is-play` when it scrolls
into view (the hero plays on load); each fragment's KM.init is captured into a registry
and called at the same moment. The page is a 1440 stage zoomed to the viewer's width.
"""
import argparse
import json
import re
from pathlib import Path

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
ORDER = ["hero", "reframe", "evidence", "stack", "architecture", "statechange", "principle",
         "method", "fit", "assets", "beforeafter", "faq", "cta", "footer"]
SLOT = "X"


def read(p: Path) -> str:
    return p.read_text() if p.exists() else ""


def plan():
    """Section order: story-order.json ([{"id":…, "slot":…}, …]) when present, else the round-2 order in slot X."""
    so = R / "story-order.json"
    if so.exists():
        return [(x["id"], x.get("slot", "S")) for x in json.loads(so.read_text())]
    return [(sid, SLOT) for sid in ORDER]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--out", default="")
    ap.add_argument("--slot", default="", help="per-section slot overrides, e.g. evidence=V,system=W")
    a = ap.parse_args()
    only = [x for x in a.only.split(",") if x]
    over = dict(x.split("=", 1) for x in a.slot.split(",") if "=" in x)
    base = read(SITE / "base.css")
    kit = read(SITE / "kit-ac.css")
    css, html, js, used = [], [], [], []
    for sid, slot in plan():
        slot = over.get(sid, slot)
        if only and sid not in only:
            continue
        d = SITE / "frag" / sid
        h = read(d / f"{slot}.html")
        if not h.strip():
            print(f"  ! missing {sid}-{slot}")
            continue
        fid = f"{sid}-{slot}"
        used.append(fid)
        c = read(d / f"{slot}.css")
        c = re.sub(r"(:root|html)\.is-play", ".is-play", c)          # play state lives on the slot here
        css.append(f"/* ── {fid} ── */\n{c}")
        html.append(f'<div class="km-slot" id="s-{sid}" data-km="{fid}">\n{h}\n</div>')
        j = read(d / f"{slot}.js")
        js.append(f"/* ── {fid} ── */\n(function(){{ window.KM = undefined; try {{\n{j}\n}} catch (e) {{ console.error('{fid}', e); }}\n"
                  f"REG[{json.dumps(fid)}] = window.KM; window.KM = undefined; }})();")
    uses_gsap = any(re.search(r"\bgsap\b|ScrollTrigger", x) for x in js)
    libs = ('<script src="lib/gsap.min.js"></script><script src="lib/ScrollTrigger.min.js"></script>'
            '<script>gsap.registerPlugin(ScrollTrigger);</script>') if uses_gsap else ""
    page = f"""<!doctype html>
<html lang="en" data-skin="swiss" class="km-home"><head><meta charset="utf-8">
<script>(function(){{var d=document.documentElement;if(/kelwin/.test(location.hash))d.setAttribute("data-skin","kelwin");addEventListener("message",function(e){{var m=e.data||{{}};if(m.km==="skin"&&(m.skin==="swiss"||m.skin==="kelwin"))d.setAttribute("data-skin",m.skin);}});}})();</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>Kelwin · Homepage prototype</title>
<style>
{base}
/* ── kit ── */
{kit}
{chr(10).join(css)}
/* ── page ── */
html, body {{ background: var(--c-graphite); }}
body {{ width: 1440px; zoom: var(--page-zoom, 1); }}
.km-slot {{ position: relative; width: 1440px; }}
</style></head>
<body><div class="km-stage" data-km="home">
{chr(10).join(html)}
</div>
{libs}
<script>
var REG = {{}};
{chr(10).join(js)}
(function(){{
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function fit() {{ document.body.style.setProperty("--page-zoom", Math.min(1, window.innerWidth / 1440)); }}
  fit(); window.addEventListener("resize", fit);
  function play(slot) {{
    if (slot.dataset.played) return; slot.dataset.played = "1";
    if (!reduced) slot.classList.add("is-play");
    var fn = REG[slot.dataset.km];
    try {{ if (fn && typeof fn.init === "function") fn.init(slot.firstElementChild, {{ reduced: reduced }}); }} catch (e) {{ console.error(e); }}
  }}
  var slots = Array.prototype.slice.call(document.querySelectorAll(".km-slot"));
  var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(function(){{
    setTimeout(function(){{ play(slots[0]); }}, 180);
    if (!("IntersectionObserver" in window)) {{ slots.forEach(play); return; }}
    var io = new IntersectionObserver(function(es){{ es.forEach(function(e){{ if (e.isIntersecting) {{ play(e.target); io.unobserve(e.target); }} }}); }}, {{ threshold: 0.22 }});
    slots.slice(1).forEach(function(s){{ io.observe(s); }});
  }});
}})();
</script>
</body></html>"""
    out = SITE / (a.out or ("home.html" if not (R / "story-order.json").exists() else "home-s.html"))
    out.write_text(page)
    print(f"{out.name} · {len(used)} sections: {', '.join(used)}")


if __name__ == "__main__":
    main()
