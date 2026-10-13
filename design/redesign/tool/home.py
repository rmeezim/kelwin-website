"""Stitch the round-2 sections into one scrolling homepage prototype.

    python3 tool/home.py                              -> R/site/home.html (or home-s.html when story-order.json exists)
    python3 tool/home.py --only system,principle --out home-system.html [--slot system=V]
                                                      -> a partial stitch (story order, listed ids only) for testing

Each section keeps its own scoped CSS/JS. Entrance animations are keyed off `.is-play`
on an ancestor, so every section sits in a .km-slot that gains `is-play` when it scrolls
into view (the hero plays on load); each fragment's KM.init is captured into a registry
and called at the same moment. The page is a 1440 stage zoomed to the viewer's width.

Round 9: every stitched page (homepage and interior) carries THE TURN (site/lib/turn.js, kit
§13): its head part is inlined into <head> (it raises the panel before the first paint), the
panel markup opens <body>, and its body part runs before the boot, which waits for KMTurn.open
(the panel lifting) before it plays the first slot. Interior heads (.ac-ihead) also get the
write-in. --no-turn stitches a page without it (for comparisons).
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


def turn_parts():
    """(head snippet, panel markup, body script) lifted out of site/lib/turn.js, their single source.
    Both scripts are inlined, so a stitched page stays self-contained (the review packagers copy
    brand/ and fonts/ only)."""
    js = read(SITE / "lib" / "turn.js")
    head = re.search(r"/\* <km:turn-head> \*/\n(.*?)/\* </km:turn-head> \*/", js, re.S)
    body = re.search(r"/\* <km:turn-body> \*/\n(.*?)/\* </km:turn-body> \*/", js, re.S)
    mark = re.search(r"var KM_TURN_MARKUP = '([^']*)';", js)
    if not (head and body and mark):
        raise SystemExit("site/lib/turn.js: the km:turn-head / km:turn-body part or KM_TURN_MARKUP is missing")
    return head.group(1).strip(), mark.group(1), body.group(1).strip()


ORDER_FILE = None


def plan():
    """Section order: --order FILE, else story-order.json ([{"id":…, "slot":…}, …]) when present, else the round-2 order in slot X."""
    so = Path(ORDER_FILE) if ORDER_FILE else R / "story-order.json"
    if so.exists():
        return [(x["id"], x.get("slot", "S")) for x in json.loads(so.read_text())]
    return [(sid, SLOT) for sid in ORDER]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--out", default="")
    ap.add_argument("--slot", default="", help="per-section slot overrides, e.g. evidence=V,system=W")
    ap.add_argument("--order", default="", help="a page order file ([{id, slot}, …]) instead of story-order.json (interior pages)")
    ap.add_argument("--no-turn", action="store_true", help="stitch without the round-9 page turn (comparisons only)")
    a = ap.parse_args()
    global ORDER_FILE
    ORDER_FILE = a.order or None
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
    # the turn (round 9): head snippet before the first paint · panel first in <body> · the body script before the boot
    turn_head, turn_markup, turn_body = "", "", ""
    if not a.no_turn:
        th, tm, tb = turn_parts()
        turn_head = f"\n<script>{th}</script>"
        turn_markup = tm + "\n"
        turn_body = f"<script>/* lib/turn.js · km:turn-body */\n{tb}\n</script>\n"
    page = f"""<!doctype html>
<html lang="en" data-skin="swiss" class="km-home"><head><meta charset="utf-8">
<script>(function(){{var d=document.documentElement;if(/kelwin/.test(location.hash))d.setAttribute("data-skin","kelwin");addEventListener("message",function(e){{var m=e.data||{{}};if(m.km==="skin"&&(m.skin==="swiss"||m.skin==="kelwin"))d.setAttribute("data-skin",m.skin);}});}})();</script>{turn_head}
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
.km-turn {{ zoom: calc(1 / var(--page-zoom, 1)); }}   /* the turn is chrome: it never shrinks with the zoomed 1440 stage */
</style></head>
<body>{turn_markup}<div class="km-stage" data-km="home">
{chr(10).join(html)}
</div>
{libs}
{turn_body}<script>
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
  var turned = (window.KMTurn && window.KMTurn.open) || Promise.resolve();   /* the turn's panel lifting (lib/turn.js) */
  ready.then(function(){{ return turned; }}).then(function(){{
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
