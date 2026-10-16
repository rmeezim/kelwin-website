"""Build the second-pass test pages from v2/src (stitched from the current fragments by tool/home.py):
    python3 v2/build.py            → v2/a/, v2/b/ (the two proposals) and v2/today/ (lib/turn.js as is),
                                     plus v2/<v>-390/ and v2/<v>-320/: the same pages in the PHONE
                                     composition (no html.km-home, the stage set to the phone's width —
                                     the recipe the round-9 phone checks used), for the phone hand-off.
Pages: home, audit, insights, revenue-entropy (approved pages: what the founder's films show) and
gtm-intelligence (checks only: its side head puts the rule in the right-hand column)."""
import subprocess, sys, shutil
from pathlib import Path
HERE = Path(__file__).resolve().parent; T = HERE.parent
PAGES = ["home", "audit", "insights", "revenue-entropy", "gtm-intelligence"]
def phone(html: str, w: int) -> str:
    html = html.replace('<html lang="en" data-skin="swiss" class="km-home">', '<html lang="en" data-skin="swiss">', 1)
    st = f"<style>:root{{--stage:{w}px;--margin:16px;--gutter:16px}} body{{width:auto!important;zoom:1!important;--page-zoom:1!important}} .km-slot{{width:auto!important}}</style>"
    return html.replace("</head>", st + "</head>", 1)
for v in ["a", "b", "today"]:
    out = HERE / v; out.mkdir(exist_ok=True)
    for p in PAGES:
        src = HERE / "src" / f"page-{p}.html"; dst = out / src.name
        if v == "today": shutil.copy(src, dst)
        else: subprocess.run([sys.executable, str(T / "swap.py"), str(T / f"turn-{v}.js"), str(src), str(dst)], check=True, stdout=subprocess.DEVNULL)
        for w in (390, 320):
            o = HERE / f"{v}-{w}"; o.mkdir(exist_ok=True)
            (o / src.name).write_text(phone(dst.read_text(), w))
    print(v, "built")
