"""Stitch an interior page mockup (round 8) from the interior plan, ending on the approved footer.
    python3 tool/ipage.py <page-file> [--instance <instance-file>]     e.g.  ipage.py about
                                                                         ipage.py capability --instance gtm-intelligence
    python3 tool/ipage.py --all                                          every page and every template instance
Writes R/site/page-<name>.html (served like the homepage stitch: 1440 stage, zoomed to the viewport).
Template instances use slots by position: 1st instance S, 2nd T, 3rd U (capability: narrative-systems S,
gtm-infrastructure T, gtm-intelligence U; article: revenue-entropy S, the-17-percent-window T, deliverability U;
legal: privacy S, terms T). Plain pages use slot S. The plan is the repo's design/redesign/interior-plan.json."""
import argparse
import json
import subprocess
from pathlib import Path

R = Path(__file__).resolve().parent.parent
PLAN = Path("/home/user/kelwin-website/design/redesign/interior-plan.json")
SLOTS = "STUVWXYZ"


def builds():
    plan = json.loads(PLAN.read_text())
    out = []
    for pg in plan["pages"]:
        insts = pg.get("instances") or []
        if pg.get("template") and insts:
            for i, inst in enumerate(insts):
                order = inst.get("order") or [s["id"] for s in pg["sections"]]
                out.append((pg["file"], inst["file"], SLOTS[i], order))
        else:
            out.append((pg["file"], pg["file"], "S", [s["id"] for s in pg["sections"]]))
    return out


def stitch(name, slot, order):
    seq = [{"id": sid, "slot": slot} for sid in order]
    if not any(s["id"] == "not-found-page" for s in seq):
        seq.append({"id": "footer", "slot": "U"})
    tmp = R / "pages"; tmp.mkdir(exist_ok=True)
    of = tmp / f"{name}.json"; of.write_text(json.dumps(seq, indent=1))
    r = subprocess.run(["python3", str(R / "tool" / "home.py"), "--order", str(of), "--out", f"page-{name}.html"], capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("page", nargs="?", default="")
    ap.add_argument("--instance", default="")
    ap.add_argument("--all", action="store_true")
    a = ap.parse_args()
    for page, name, slot, order in builds():
        if a.all or (page == a.page and (not a.instance or a.instance == name)):
            stitch(name, slot, order)


if __name__ == "__main__":
    main()
