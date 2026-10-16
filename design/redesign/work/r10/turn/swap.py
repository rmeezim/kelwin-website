"""Swap the page turn inlined in a stitched page (site/lib/turn.js, as tool/home.py writes it) for a
round-10 variant's. Three inline parts are replaced, and nothing else in the page changes:
  1. the head script that begins  (function (d) {\\n  if (window.KMTurn) return;   → the variant's km:turn-head
  2. the <div class="km-turn" …</div> at the top of <body>                          → the variant's km:turn-markup
  3. the  /* lib/turn.js · km:turn-body */  script                                   → the variant's km:turn-body

    python3 swap.py stitch       restitches the two pages from the current fragments into src/ (tool/home.py
                                 --order pages/<name>.json): the R/site copies predate round 10's footer
                                 clock (they still show London); otherwise they are the same pages
    python3 swap.py a            builds a/page-gtm-intelligence.html and a/page-about.html from src/ (else R/site)
    python3 swap.py b            the same into b/
    python3 swap.py today        today's turn, unchanged, into today/ (for the side-by-side film)
    python3 swap.py <turn-x.js> <in.html> <out.html>      any page, any variant
    --keep-copy                  skip the film copy patch below

FILM COPY PATCH (About only, not part of the turn): the round-9 About page still names the founder and
his employer, which the founder's round-9 answers take out (ROUND10-PLAN A7, A9); the page itself is
rebuilt later in round 10. So that the films shown to him don't show what he asked to remove, the test
copies replace those visible lines with neutral ones. Nothing else in the page changes.
"""
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
R = HERE.parents[3]
SITE = R / "site"
PAGES = ["page-gtm-intelligence.html", "page-about.html"]
SRC = HERE / "src"


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
    # 3 · the body script (first: it also holds the old markup, as a string)
    a = "<script>/* lib/turn.js · km:turn-body */\n"
    i = page.index(a); j = page.index("</script>", i)
    page = page[:i] + f"<script>/* {variant.name} · km:turn-body */\n{tb}\n" + page[j:]
    # 1 · the head script
    a = "<script>(function (d) {\n  if (window.KMTurn) return;"
    assert page.count(a) == 1, "head part not found exactly once"
    i = page.index(a); j = page.index("</script>", i)
    page = page[:i] + f"<script>{th}" + page[j:]
    # 2 · the panel markup at the top of <body>
    assert page.count(om) == 1, "turn markup not found exactly once"
    page = page.replace(om, tm)
    assert "lib/turn.js · km:turn-body" not in page and "var KM_TURN_MARKUP = '<div class=\"km-turn\"" not in page
    return page


FILM_COPY = {
    "page-about.html": [
        ("Rameez founded Kelwin in 2026 to build revenue systems clients keep.", "Kelwin was founded in 2026 to build revenue systems clients keep."),
        ("The founder, at his own desk.", "The founding team, at work."),
        ('<h2 class="km-about-head-S__name">Rameez</h2>', '<h2 class="km-about-head-S__name">The founding team</h2>'),
        ("Rameez reads every audit request.", "Every audit request is read in full."),
        (">Why he started Kelwin<", ">Why Kelwin started<"),
    ]
}


def film_copy(name: str, page: str) -> str:
    for a, b in FILM_COPY.get(name, []):
        assert a in page, f"film copy patch: {a!r} not found in {name}"
        page = page.replace(a, b)
    bg = re.search(r'(<p class="km-about-head-S__bg">).*?(</p>)', page, re.S)
    if name == "page-about.html" and bg:
        page = page[:bg.start()] + bg.group(1) + "Sales and marketing, by background." + bg.group(2) + page[bg.end():]
    return page


def main():
    keep = "--keep-copy" in sys.argv
    if keep:
        sys.argv.remove("--keep-copy")
    if len(sys.argv) == 2 and sys.argv[1] == "stitch":
        SRC.mkdir(exist_ok=True)
        for p in PAGES:
            name = p[len("page-"):-len(".html")]
            subprocess.run([sys.executable, str(R / "tool" / "home.py"), "--order", str(R / "pages" / f"{name}.json"),
                            "--out", str(Path("..") / SRC.relative_to(R) / p)], cwd=R, check=True)
    elif len(sys.argv) == 2:
        v = sys.argv[1]
        out = HERE / v
        out.mkdir(exist_ok=True)
        for p in PAGES:
            page = ((SRC / p) if (SRC / p).exists() else (SITE / p)).read_text()
            if v != "today":
                page = swap(page, HERE / f"turn-{v}.js")
            if not keep:
                page = film_copy(p, page)
            (out / p).write_text(page)
            print(f"{v}/{p}")
    elif len(sys.argv) == 4:
        Path(sys.argv[3]).write_text(swap(Path(sys.argv[2]).read_text(), Path(sys.argv[1])))
        print(sys.argv[3])
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    main()
