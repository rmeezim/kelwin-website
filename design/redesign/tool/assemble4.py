"""Package the round-4 review page: what changed, the positioning check, then each reworked section
(round 4 live vs the runner-up alternative vs round 3 and the round-2/round-1 sources).

    python3 tool/assemble4.py        -> R/out4/ (index.html + supporting files), R/out4-files.json, R/preview4.html

Reads story-order.json (round-4 slots), ROUND4-NOTES.md, judge4.json ({id: {winner, loser, why}}),
positioning4.json ({summary, edits:[…]}), site/frag/*/{U,S,V,W,X,A}.meta.json, site/shots/*,
site/home-u.html (round 4) and site/home-s-r3-frozen.html (round 3, published as home-s.html).
"""
import json
import re
import shutil
from pathlib import Path

from assemble2 import publishable, webp

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
OUT = R / "out4"

NAMES = {"hero": "Hero", "reframe": "The reframe", "evidence": "Structural evidence", "letter": "The founder's letter",
         "system": "The system", "principle": "Operating principle", "handover": "The handover", "method": "Methodology",
         "fit": "Who it's for", "cta": "Final call to action", "footer": "Footer", "faq": "FAQ", "buttons": "The button (your idea)"}
CHANGED = ["hero", "evidence", "system", "handover", "method", "cta", "footer"]
VERDICT = {"hero": "Trimmed (D12)", "evidence": "Round-2 layout, new artifact", "system": "Back to the strata",
           "handover": "Re-laid out", "method": "Re-laid out", "cta": "Round 1, separated", "footer": "Fixed",
           "faq": "Button restored", "buttons": "Cut corner, applied"}
# what each reworked section is compared against: (section, slot, label, note)
PRIOR = {
    "hero": [("hero", "S", "Round 3", "With the film band and Pause film, before your D12 call.")],
    "evidence": [("evidence", "S", "Round 3", "The numeral row explorer you found safe and regular-looking."),
                 ("evidence", "X", "Round 2", "The layout you preferred, with the square of dots in the centre.")],
    "system": [("system", "S", "Round 3", "The pinned loop drawing you found cluttered (contact sheet of its frames)."),
               ("stack", "X", "Round 2 · The stack", "The strata assembly language you asked to return to."),
               ("architecture", "X", "Round 2 · Architecture", "The approved closed loop.")],
    "handover": [("handover", "S", "Round 3", "The split layout with the graphite column you didn't like."),
                 ("assets", "X", "Round 2 · What you own", "Approved in round 2."),
                 ("beforeafter", "X", "Round 2 · Before / after", "Approved in round 2.")],
    "method": [("method", "S", "Round 3", "The descending track you found too empty."),
               ("method", "X", "Round 2", "Approved in round 2.")],
    "cta": [("cta", "S", "Round 3", "The version you found the most AI-generated."),
            ("cta", "X", "Round 2", "The middle ground you found too basic."),
            ("cta", "A", "Round 1 · your pick", "The Core, Installed — the one you asked to go back to.")],
    "footer": [("footer", "S", "Round 3", "Full width, pure white, about one-sixth buried.")],
    "faq": [("faq", "S", "Round 3", "With the button demoted to a link.")],
    "buttons": [],
}
NOTE_KEYS = {"01": "hero", "03": "evidence", "05": "system", "07": "handover", "08": "method", "10": "cta", "11": "footer", "--": "faq"}
SETTLED = [("D1", "Your memo appears on the homepage, verbatim and signed."),
           ("D2", "One count of three layers, everywhere."),
           ("D3", "The method's one red step is Diagnose."),
           ("D4", "The FAQ lives on the System Audit page."),
           ("D5", "The four old slogans are retired; it's “Request”, not “Initiate”."),
           ("D6", "Footer crop: you picked one-fifth buried."),
           ("D7", "No “Deployment window open” on the homepage."),
           ("D8", "Audit facts confirmed: ten working days, two 90-minute sessions, read-only CRM and channel-stack access, no fee line."),
           ("D9", "The homepage speaks to founders and revenue leaders."),
           ("D10", "The hero lede stays as approved."),
           ("D11", "No background line under the signature; pod line off."),
           ("D12", "Changed as you asked: the film band and the Pause film button are both gone.", True)]


def r4notes() -> dict:
    out = {}
    for line in (R / "ROUND4-NOTES.md").read_text().splitlines():
        m = re.match(r"^(\d\d|--) [^:]+: (APPROVED|NEEDS CHANGES)(?: — (.*))?$", line.strip())
        if m and m.group(1) in NOTE_KEYS:
            out[NOTE_KEYS[m.group(1)]] = {"status": "Approved" if m.group(2) == "APPROVED" else "Needs changes", "note": (m.group(3) or "").strip()}
    d12 = re.search(r'D12: CHANGE — "(.*?)"\n', (R / "ROUND4-NOTES.md").read_text(), re.S)
    out["hero"] = {"status": "Approved, with your D12 change", "note": d12.group(1).replace("\n", " ") if d12 else ""}
    out["buttons"] = {"label": "Your message", "status": "Your idea", "note": "Also, I was thinking maybe we should design the CTA button kind of like this and make all the text inside the CTA button all caps. What do you think?"}
    return out


def meta(sec, slot):
    return json.loads((SITE / "frag" / sec / f"{slot}.meta.json").read_text())


def entry(sec, slot):
    m = meta(sec, slot)
    lint = json.loads((SITE / "shots" / f"{sec}-{slot}.json").read_text())
    (OUT / f"m-{sec}-{slot}.html").write_text(publishable((SITE / f"m-{sec}-{slot}.html").read_text()))
    webp(SITE / "shots" / f"{sec}-{slot}.png", OUT / f"shots/{sec}-{slot}.webp", width=1440, q=82)
    return {"title": m.get("title", ""), "summary": m.get("summary", ""), "story": m.get("story", ""),
            "motion": m.get("motion", []), "addressed": m.get("addressed", []), "signoff": m.get("signoff", []),
            "shot": f"shots/{sec}-{slot}.webp", "frame": f"m-{sec}-{slot}.html", "height": int(lint.get("height", 900))}


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for d in ("brand", "fonts", "lib"):
        shutil.copytree(SITE / d, OUT / d)
    (OUT / "img").mkdir()
    shutil.copy(SITE / "img" / "film-room.webp", OUT / "img" / "film-room.webp")
    order = [x["id"] for x in json.loads((R / "story-order.json").read_text())]
    slots = {x["id"]: x["slot"] for x in json.loads((R / "story-order.json").read_text())}
    judge = json.loads((R / "judge4.json").read_text()) if (R / "judge4.json").exists() else {}
    pos = json.loads((R / "positioning4.json").read_text()) if (R / "positioning4.json").exists() else {"summary": "", "edits": []}
    notes = r4notes()
    data = {"thesis": "", "order": order, "changes": [], "positioning": pos,
            "settled": [list(x) for x in SETTLED], "sections": [], "unchanged": []}
    missing = []
    for sid in CHANGED + ["faq", "buttons"]:
        if not (SITE / "frag" / sid / "U.meta.json").exists() or not (SITE / f"m-{sid}-U.html").exists():
            missing.append(sid)
            continue
        e = {"id": sid, "name": NAMES[sid], "verdict": VERDICT[sid], "offpage": sid not in order, "pin": False,
             "notes": [notes[sid]] if sid in notes else [], "r4": entry(sid, "U"), "alt": None, "prior": []}
        j = judge.get(sid)
        if j and (SITE / f"m-{sid}-{j['loser']}.html").exists():
            e["alt"] = {**entry(sid, j["loser"]), "why": j["why"]}
        e["pin"] = bool(judge.get(sid, {}).get("pin"))
        for (psec, slot, label, what) in PRIOR[sid]:
            key = f"{psec}-{slot}"
            webp(SITE / "shots" / f"{psec}-{slot}.png", OUT / f"shots/{key}.webp")
            e["prior"].append({"key": key, "label": label, "title": meta(psec, slot).get("title", ""), "shot": f"shots/{key}.webp", "what": what})
        data["sections"].append(e)
        if sid in order:
            data["changes"].append([f"{order.index(sid) + 1:02d} · {VERDICT[sid]}", NAMES[sid], e["r4"]["summary"]])
    bt = next((x for x in data["sections"] if x["id"] == "buttons"), None)
    if bt:
        data["changes"].append(["Site-wide · Your idea", "The button", bt["r4"]["summary"]])
    fq = next((x for x in data["sections"] if x["id"] == "faq"), None)
    if fq:
        data["changes"].append(["Audit page · Button restored", "FAQ", fq["r4"]["addressed"][1] if len(fq["r4"]["addressed"]) > 1 else fq["r4"]["summary"]])
    for sid in order:
        if sid in CHANGED:
            continue
        slot = slots[sid]
        (OUT / f"m-{sid}-{slot}.html").write_text(publishable((SITE / f"m-{sid}-{slot}.html").read_text()))
        webp(SITE / "shots" / f"{sid}-{slot}.png", OUT / f"shots/{sid}-{slot}.webp")
        data["unchanged"].append({"id": sid, "name": NAMES[sid], "shot": f"shots/{sid}-{slot}.webp", "frame": f"m-{sid}-{slot}.html"})
    data["thesis"] = ("You approved the story and most of the page. This round reworks the five sections you flagged and makes "
                      "your three smaller fixes. For the four biggest, two designers built competing versions independently; a "
                      "judge picked the stronger and grafted in the best of the other, and a reviewer then tested it on the page. "
                      "The runner-up is here too, if you prefer it.")
    for src, dst in (("home-u.html", "home-u.html"), ("home-s-r3-frozen.html", "home-s.html")):
        p = SITE / src
        if p.exists():
            (OUT / dst).write_text(publishable(p.read_text()))
        else:
            missing.append(src)
    tpl = (R / "tool" / "selector4.template.html").read_text()
    page = tpl.replace("/*__DATA__*/null", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"), 1)
    (OUT / "index.html").write_text(page)
    (R / "preview4.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                     'content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="out4/"></head><body>' + page + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out4-files.json").write_text(json.dumps(files))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"reworked {len(data['sections'])} · unchanged {len(data['unchanged'])} · files {len(files)} · {size / 1e6:.1f} MB · missing {missing or 'none'}")


if __name__ == "__main__":
    main()
