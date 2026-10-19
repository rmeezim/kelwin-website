"""Round-11 turn test pages (round 10's v2/build.py method, the three APPROVED pages only):
    python3 tools/build.py [id …]     ids: today lockup once letters (default: all that exist)
For each id: pages/<id>/page-{home,audit,insights}.html (the 1440 composition) and pages/<id>-390/,
pages/<id>-320/ (the phone composition: no html.km-home, the stage set to the phone's width — the recipe
the round-9 and round-10 phone checks used). src/ holds the pages as round 10 stitched them
(qa/r10/art/turn/v2/src: tool/home.py from the fragments, today's turn inlined). "today" copies them as
they are; any other id swaps in turn-<id>.js (its km:turn-head, km:turn-markup and km:turn-body;
nothing else in the page changes)."""
import re, sys
from pathlib import Path
HERE = Path(__file__).resolve().parent.parent
R = HERE.parents[3]
SITE = R / "site"
PAGES = ["home", "audit", "insights"]


def parts(js: str):
    head = re.search(r"/\* <km:turn-head> \*/\n(.*?)/\* </km:turn-head> \*/", js, re.S)
    body = re.search(r"/\* <km:turn-body> \*/\n(.*?)/\* </km:turn-body> \*/", js, re.S)
    mark = re.search(r"var KM_TURN_MARKUP = '([^']*)';", js)
    if not (head and body and mark):
        raise SystemExit("a km:turn-head / km:turn-body part or KM_TURN_MARKUP is missing")
    return head.group(1).strip(), mark.group(1), body.group(1).strip()


def swap(page: str, variant: Path) -> str:
    th, tm, tb = parts(variant.read_text())
    _, om, _ = parts((SITE / "lib" / "turn.js").read_text())
    a = "<script>/* lib/turn.js · km:turn-body */\n"   # the body script first (it also holds the old markup)
    assert page.count(a) == 1, "body part not found exactly once"
    i = page.index(a); j = page.index("</script>", i)
    page = page[:i] + f"<script>/* {variant.name} · km:turn-body */\n{tb}\n" + page[j:]
    a = "<script>(function (d) {\n  if (window.KMTurn) return;"
    assert page.count(a) == 1, "head part not found exactly once"
    i = page.index(a); j = page.index("</script>", i)
    page = page[:i] + f"<script>{th}" + page[j:]
    assert page.count(om) == 1, "turn markup not found exactly once"
    page = page.replace(om, tm)
    assert "lib/turn.js · km:turn-body" not in page and page.count(tm) == 2   # the markup + its copy in the body script
    return page


def phone(html: str, w: int) -> str:
    html = html.replace('<html lang="en" data-skin="swiss" class="km-home">', '<html lang="en" data-skin="swiss">', 1)
    st = f"<style>:root{{--stage:{w}px;--margin:16px;--gutter:16px}} body{{width:auto!important;zoom:1!important;--page-zoom:1!important}} .km-slot{{width:auto!important}}</style>"
    return html.replace("</head>", st + "</head>", 1)


ids = sys.argv[1:] or ["today"] + [p.stem[5:] for p in sorted(HERE.glob("turn-*.js"))]
for v in ids:
    for p in PAGES:
        src = HERE / "src" / f"page-{p}.html"
        page = src.read_text() if v == "today" else swap(src.read_text(), HERE / f"turn-{v}.js")
        out = HERE / "pages" / v; out.mkdir(parents=True, exist_ok=True)
        (out / src.name).write_text(page)
        for w in (390, 320):
            o = HERE / "pages" / f"{v}-{w}"; o.mkdir(parents=True, exist_ok=True)
            (o / src.name).write_text(phone(page, w))
    print(v, "built")
