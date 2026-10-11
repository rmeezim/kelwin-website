"""Package the round-6 review page: the hero chooser (today's hero + four new options, each with its own full
homepage), the evidence and system pacing changes, and the untouched sections.

    python3 tool/assemble6.py        -> R/out6/ (index.html + files), R/out6-files.json, R/preview6.html

Reads story-order.json (round-6 slots; hero U is "today"), hero6.json ({diagnosis, options:[{slot,label}]}),
ROUND6-NOTES.md, site/frag/*/<slot>.meta.json, site/shots/*; stitches site/home-r6-<slot>.html per hero option.
"""
import json
import re
import shutil
import subprocess
from pathlib import Path

from assemble2 import publishable, webp

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
OUT = R / "out6"
NAMES = {"hero": "Hero", "reframe": "The reframe", "evidence": "Structural evidence", "letter": "The founder's letter",
         "system": "The system", "principle": "Operating principle", "handover": "The handover", "method": "Methodology",
         "fit": "Who it's for", "cta": "Final call to action", "footer": "Footer"}
CHANGED = {"evidence": ("Slower pace", "The automatic pass now lingers on each number long enough to read it, runs once, settles on 17% and stops the moment you touch it."),
           "system": ("Faster skim + clickable slabs", "The automatic pass now skims the three layers briskly and hands control to you; click any slab in the drawing or any row on the right and the other follows.")}
PRIOR = {"evidence": ("evidence", "S", "Round 5"), "system": ("system", "U", "Round 5")}


def notes() -> dict:
    out = {}
    for line in (R / "ROUND6-NOTES.md").read_text().splitlines():
        m = re.match(r"^(\d\d) [^:]+: (APPROVED|NEEDS CHANGES)(?: — (.*))?$", line.strip())
        if m and m.group(3):
            key = {"03": "evidence", "05": "system"}.get(m.group(1))
            if key:
                out[key] = {"label": "Your round-5 review", "status": "Approved", "note": m.group(3).strip()}
    return out


def meta(sec, slot):
    return json.loads((SITE / "frag" / sec / f"{slot}.meta.json").read_text())


def frame(sec, slot):
    (OUT / f"m-{sec}-{slot}.html").write_text(publishable((SITE / f"m-{sec}-{slot}.html").read_text()))
    webp(SITE / "shots" / f"{sec}-{slot}.png", OUT / f"shots/{sec}-{slot}-r6.webp", width=1440, q=82)
    lint = json.loads((SITE / "shots" / f"{sec}-{slot}.json").read_text())
    return f"m-{sec}-{slot}.html", f"shots/{sec}-{slot}-r6.webp", int(lint.get("height", 900))


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    (OUT / "shots").mkdir()
    for d in ("brand", "fonts", "lib"):
        shutil.copytree(SITE / d, OUT / d)
    (OUT / "img").mkdir()
    shutil.copy(SITE / "img" / "film-room.webp", OUT / "img" / "film-room.webp")
    so = json.loads((R / "story-order.json").read_text())
    order = [x["id"] for x in so]
    slots = {x["id"]: x["slot"] for x in so}
    h6 = json.loads((R / "hero6.json").read_text())
    nts = notes()
    data = {"thesis": "", "order": order, "changes": [], "settled": [], "sections": [], "unchanged": [], "heroes": [],
            "changesHead": "Your two pacing notes. <span>Everything else as you approved it.</span>",
            "positioning": {"summary": "", "edits": []}, "heroDiag": h6.get("diagnosis", ""), "heroRec": h6.get("recommendation", ""), "heroStart": h6.get("start", "")}
    judged = {x["slot"]: x for x in h6.get("ranking", [])}
    missing = []
    for opt in h6["options"]:
        slot = opt["slot"]
        if not (SITE / f"m-hero-{slot}.html").exists():
            missing.append(f"hero-{slot}")
            continue
        m = meta("hero", slot)
        fr, shot, h = frame("hero", slot)
        home = f"home-r6-{slot}.html"
        subprocess.run(["python3", str(R / "tool" / "home.py"), "--slot", f"hero={slot}", "--out", home], check=True, capture_output=True)
        (OUT / home).write_text(publishable((SITE / home).read_text()))
        data["heroes"].append({"slot": slot, "label": opt["label"], "name": m.get("title", ""), "summary": m.get("summary", ""),
                               "video": m.get("video", ""), "addressed": m.get("addressed", []), "current": slot == slots["hero"],
                               "frame": fr, "shot": shot, "height": h, "home": home,
                               "verdict": judged.get(slot, {}).get("one_liner", ""), "score": judged.get(slot, {}).get("score", "")})
    for sid, (tag, what) in CHANGED.items():
        slot = slots[sid]
        m = meta(sid, slot)
        fr, shot, h = frame(sid, slot)
        psec, pslot, plabel = PRIOR[sid]
        webp(SITE / "shots" / f"{psec}-{pslot}.png", OUT / f"shots/r5-{sid}.webp")
        data["sections"].append({"id": sid, "name": NAMES[sid], "verdict": tag, "offpage": False, "pin": False,
                                 "notes": [nts[sid]] if sid in nts else [], "alt": None,
                                 "r4": {"title": m.get("title", ""), "summary": m.get("summary", ""), "story": m.get("story", ""),
                                        "motion": m.get("motion", []), "addressed": m.get("addressed", []), "signoff": [],
                                        "shot": shot, "frame": fr, "height": h},
                                 "prior": [{"key": f"r5-{sid}", "label": plabel, "title": "As you approved it", "shot": f"shots/r5-{sid}.webp",
                                            "what": "The round-5 version, for comparison."}]})
        data["changes"].append([f"{order.index(sid) + 1:02d} · {tag}", NAMES[sid], what])
    for sid in order:
        if sid in CHANGED or sid == "hero":
            continue
        fr, shot, h = frame(sid, slots[sid])
        data["unchanged"].append({"id": sid, "name": NAMES[sid], "shot": shot, "frame": fr})
    data["thesis"] = ("You said the rest of the page now looks proprietary and the hero is the one section that doesn't keep up. "
                      "Here are four new heroes, each built around video, next to today's. Each has its own full homepage, so you "
                      "can judge it in context. Plus your two pacing notes on the evidence and the system.")
    tpl = (R / "tool" / "selector6.template.html").read_text()
    page = tpl.replace("/*__DATA__*/null", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"), 1)
    (OUT / "index.html").write_text(page)
    (R / "preview6.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                     'content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="out6/"></head><body>' + page + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out6-files.json").write_text(json.dumps(files))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"heroes {len(data['heroes'])} · changed {len(data['sections'])} · unchanged {len(data['unchanged'])} · files {len(files)} · {size / 1e6:.1f} MB · missing {missing or 'none'}")


if __name__ == "__main__":
    main()
