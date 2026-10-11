"""Package the round-5 review page: the touched sections (round 5 live vs round 4), your copy calls,
the standing rules, and the untouched sections.

    python3 tool/assemble5.py        -> R/out5/ (index.html + supporting files), R/out5-files.json, R/preview5.html

Reads story-order.json (round-5 slots), ROUND5-NOTES.md, site/frag/*/<slot>.meta.json, site/shots/*,
out4/shots/* (the round-4 images, for comparison) and site/home-r5.html.
"""
import json
import re
import shutil
from pathlib import Path

from assemble2 import publishable, webp

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
OUT = R / "out5"
R4 = R / "out4" / "shots"

NAMES = {"hero": "Hero", "reframe": "The reframe", "evidence": "Structural evidence", "letter": "The founder's letter",
         "system": "The system", "principle": "Operating principle", "handover": "The handover", "method": "Methodology",
         "fit": "Who it's for", "cta": "Final call to action", "footer": "Footer"}
CHANGED = ["hero", "reframe", "evidence", "system", "handover", "method", "fit", "footer"]
VERDICT = {"hero": "New lede (P1)", "reframe": "Fig removed", "evidence": "Back to round 3", "system": "List follows the layer",
           "handover": "Decluttered + hover detail", "method": "Fig removed", "fit": "New copy (P2)", "footer": "Plurel removed"}
R4SHOT = {"hero": "hero-U", "reframe": "reframe-S", "evidence": "evidence-U", "system": "system-U", "handover": "handover-U",
          "method": "method-U", "fit": "fit-S", "footer": "footer-U"}
WHAT = {
    "hero": "The lede now reads “Kelwin designs, installs and runs the narrative, channel and market intelligence systems…” — your P1.",
    "reframe": "The ‘Fig. 02 · Section cut · Not to scale’ boxes are gone; the Surface | Architecture switch sits on its own.",
    "evidence": "Back to the round-3 explorer you preferred: the four numbers are the buttons, and each one opens its full claim, meaning and source.",
    "system": "As each layer lights up red, its row on the right opens to full view in step with it, and the page never jumps. The Fig boxes are gone.",
    "handover": "The Fig boxes, the handover-test line and the row labels are gone, so the drawing is calmer. Hover, tab to or tap any document to see what it is.",
    "method": "The ‘Fig. 06 · Phase track · Indicative’ boxes are gone; the chart stands on its own.",
    "fit": "One operating model across the page: “After handover the system is yours — run by your operator, or with us on retainer.” — your P2.",
    "footer": "No mention of Plurel: the sister-company line is gone.",
}
NOTE_KEYS = {"01": "hero", "03": "evidence", "05": "system", "07": "handover", "08": "method", "10": "cta", "11": "footer"}


def r5notes() -> dict:
    text = (R / "ROUND5-NOTES.md").read_text()
    out = {}
    for line in text.splitlines():
        m = re.match(r"^(\d\d) [^:]+: (APPROVED|NEEDS CHANGES)(?: — (.*))?$", line.strip())
        if m and m.group(1) in NOTE_KEYS:
            out[NOTE_KEYS[m.group(1)]] = {"status": "Approved" if m.group(2) == "APPROVED" else "Needs changes", "note": (m.group(3) or "").strip()}
    fig = "I want you to get rid of these fig things across every section, wherever they are."
    plurel = "I feel like there is no need to mention anything about Plurel inside the website of Kelwin anywhere."
    out["hero"] = {"label": "Your round-4 call", "status": "P1 — Agree", "note": "Kelwin designs, installs and runs the narrative, channel and market intelligence systems that turn fragmented growth into repeatable pipeline."}
    out["reframe"] = {"label": "Your standing rule", "status": "No Fig. labels", "note": fig}
    out["method"]["label"] = "Your round-4 review"
    out["fit"] = {"label": "Your round-4 call", "status": "P2 — Agree", "note": "After handover the system is yours — run by your operator, or with us on retainer. Owning it is the real gate."}
    out["footer"] = {"label": "Your standing rule", "status": "No Plurel", "note": plurel}
    return out


def meta(sec, slot):
    return json.loads((SITE / "frag" / sec / f"{slot}.meta.json").read_text())


def entry(sec, slot):
    m = meta(sec, slot)
    lint = json.loads((SITE / "shots" / f"{sec}-{slot}.json").read_text())
    (OUT / f"m-{sec}-{slot}.html").write_text(publishable((SITE / f"m-{sec}-{slot}.html").read_text()))
    webp(SITE / "shots" / f"{sec}-{slot}.png", OUT / f"shots/{sec}-{slot}-r5.webp", width=1440, q=82)
    return {"title": m.get("title", ""), "summary": m.get("summary", ""), "story": m.get("story", ""),
            "motion": m.get("motion", []), "addressed": m.get("addressed", []), "signoff": [],
            "shot": f"shots/{sec}-{slot}-r5.webp", "frame": f"m-{sec}-{slot}.html", "height": int(lint.get("height", 900))}


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for d in ("brand", "fonts", "lib"):
        shutil.copytree(SITE / d, OUT / d)
    (OUT / "img").mkdir()
    shutil.copy(SITE / "img" / "film-room.webp", OUT / "img" / "film-room.webp")
    so = json.loads((R / "story-order.json").read_text())
    order = [x["id"] for x in so]
    slots = {x["id"]: x["slot"] for x in so}
    notes = r5notes()
    data = {"thesis": "", "order": order, "changes": [], "settled": [], "sections": [], "unchanged": [],
            "changesHead": "Eight sections touched. <span>Everything else as you approved it.</span>",
            "positioning": {"summary": "Your answers on the three copy calls, applied as you gave them.", "edits": [
                {"id": "P1", "section": "01 · Hero lede", "kind": "safe", "status": "Applied",
                 "current": "Kelwin designs the narrative, market intelligence and outbound systems that turn fragmented growth into repeatable pipeline.",
                 "proposed": "Kelwin designs, installs and runs the narrative, channel and market intelligence systems that turn fragmented growth into repeatable pipeline.",
                 "why": "The service is in the first sentence, and the one agency word is gone."},
                {"id": "P2", "section": "09 · Who it's for", "kind": "safe", "status": "Applied",
                 "current": "Someone will own it — After handover an internal operator runs the system. · Outsource-it-forever — Nobody inside will own the system — declined.",
                 "proposed": "Someone will own it — After handover the system is yours — run by your operator, or with us on retainer. Owning it is the real gate. · Rent-it-forever — We'll run it on retainer, but if nobody inside will own it, we decline.",
                 "why": "One operating model across the page: the gate is owning the system, and the retainer is welcome. Its short line now reads ‘An owner inside.’ to match."},
                {"id": "P3", "section": "09 · Pointer to Plurel", "kind": "safe", "status": "Dropped",
                 "current": "A one-line pointer to Plurel for buyers who need demand.",
                 "proposed": "Not added — and Plurel is now removed everywhere else too.",
                 "why": "Your call: no mention of Plurel anywhere on the Kelwin website."}]}}
    data["settled"] = [["R1", "No Plurel anywhere on the Kelwin website — gone from the redesign's footer, and from the live site's footer and About page (ready to publish when you say).", True],
                       ["R2", "No ‘Fig.’ numbers or title-block boxes anywhere — removed from the reframe, the system, the handover and the method.", True],
                       ["R3", "Primary buttons keep your cut corner (C), on every page.", False]]
    missing = []
    for sid in CHANGED:
        slot = slots[sid]
        if not (SITE / f"m-{sid}-{slot}.html").exists():
            missing.append(sid)
            continue
        e = {"id": sid, "name": NAMES[sid], "verdict": VERDICT[sid], "offpage": False, "pin": False,
             "notes": [notes[sid]] if sid in notes else [], "r4": entry(sid, slot), "alt": None, "prior": []}
        src = R4 / f"{R4SHOT[sid]}.webp"
        if src.exists():
            (OUT / "shots").mkdir(exist_ok=True)
            shutil.copy(src, OUT / f"shots/r4-{sid}.webp")
            e["prior"].append({"key": f"r4-{sid}", "label": "Round 4", "title": "As you reviewed it", "shot": f"shots/r4-{sid}.webp",
                               "what": "The round-4 version you reviewed, for comparison."})
        data["sections"].append(e)
        data["changes"].append([f"{order.index(sid) + 1:02d} · {VERDICT[sid]}", NAMES[sid], WHAT[sid]])
    for sid in order:
        if sid in CHANGED:
            continue
        slot = slots[sid]
        (OUT / f"m-{sid}-{slot}.html").write_text(publishable((SITE / f"m-{sid}-{slot}.html").read_text()))
        webp(SITE / "shots" / f"{sid}-{slot}.png", OUT / f"shots/{sid}-{slot}-r5.webp")
        data["unchanged"].append({"id": sid, "name": NAMES[sid], "shot": f"shots/{sid}-{slot}-r5.webp", "frame": f"m-{sid}-{slot}.html"})
    data["thesis"] = ("Round 5 applies your answers: the evidence goes back to its round-3 explorer, the system's list now opens "
                      "in step with the highlighted layer, the handover is decluttered and shows detail when you hover a document, "
                      "every ‘Fig.’ label is gone, your two copy calls are in, and Plurel is no longer mentioned anywhere.")
    p = SITE / "home-r5.html"
    if p.exists():
        (OUT / "home-r5.html").write_text(publishable(p.read_text()))
    else:
        missing.append("home-r5.html")
    tpl = (R / "tool" / "selector5.template.html").read_text()
    page = tpl.replace("/*__DATA__*/null", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"), 1)
    (OUT / "index.html").write_text(page)
    (R / "preview5.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                     'content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="out5/"></head><body>' + page + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out5-files.json").write_text(json.dumps(files))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"touched {len(data['sections'])} · unchanged {len(data['unchanged'])} · files {len(files)} · {size / 1e6:.1f} MB · missing {missing or 'none'}")


if __name__ == "__main__":
    main()
