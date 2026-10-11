"""Package the round-3 review page: the story map, then each beat (round 3 live vs its round-2 sources).

    python3 tool/assemble3.py        -> R/out3/ (index.html + supporting files), R/out3-files.json, R/preview3.html

Reads story-order.json, story3.json, ROUND3-NOTES.md, site/frag/*/S.meta.json (+ X/A metas for the
round-2 sources), site/shots/*, site/home-s.html and site/home.html (round 2, for comparison).
"""
import json
import re
import shutil
from pathlib import Path

from assemble2 import publishable, webp

R = Path(__file__).resolve().parent.parent
SITE = R / "site"
OUT = R / "out3"

NAMES = {"hero": ("Hero", "Hero", "Kept"), "reframe": ("The reframe", "Reframe", "Kept"),
         "evidence": ("Structural evidence", "Evidence", "Rebuilt"), "letter": ("The founder's letter", "Letter", "New"),
         "system": ("The system, closed", "System", "Merged"), "principle": ("Operating principle", "Principle", "Kept · moved"),
         "handover": ("The handover", "Handover", "Merged"), "method": ("Methodology", "Method", "Re-laid out"),
         "fit": ("Who it's for", "Fit", "Fixed"), "cta": ("Final call to action", "CTA", "Reworked"),
         "footer": ("Footer", "Footer", "Fixed"), "faq": ("FAQ", "FAQ", "Moved to the audit page")}
# round-2 sections each beat was built from: (section, slot, label, what it became)
SOURCES = {
    "hero": [("hero", "X", "Round 2", "")],
    "reframe": [("reframe", "X", "Round 2", "")],
    "evidence": [("evidence", "X", "Round 2", "")],
    "letter": [("statechange", "X", "Round 2 · State change", "Its “reset every quarter” story now has a voice in the letter, and a full-scale drawing in the system."),
               ("beforeafter", "X", "Round 2 · Before / after", "Its six “befores” are the letter's margin list, struck out later in the handover.")],
    "system": [("stack", "X", "Round 2 · The stack", "Its layered slabs are now built into the loop, one per scroll step."),
               ("architecture", "X", "Round 2 · Architecture", "Its closed loop and return path are the system's final frame."),
               ("statechange", "X", "Round 2 · State change", "Its reset-vs-compound idea is now the system's first and last frames.")],
    "principle": [("principle", "X", "Round 2", "")],
    "handover": [("assets", "X", "Round 2 · What you own", "Its six sheets now cross to the client's side, one per problem."),
                 ("beforeafter", "X", "Round 2 · Before / after", "Its six shifts are now each tied to the asset that causes them.")],
    "method": [("method", "X", "Round 2", "")],
    "fit": [("fit", "X", "Round 2", "")],
    "cta": [("cta", "X", "Round 2", "Ten Days, Measured — the version you approved but felt was missing something."),
            ("cta", "A", "Round 1 · your pick", "The Core, Installed — the one you found more engaging and proprietary.")],
    "footer": [("footer", "X", "Round 2", "")],
    "faq": [("faq", "X", "Round 2", "")],
}
NOTE_IDS = ["nav", "hero", "reframe", "evidence", "stack", "architecture", "statechange", "principle", "method", "fit",
            "assets", "beforeafter", "faq", "cta", "footer", "interior"]
NOTE_NAMES = {"stack": "The stack", "architecture": "Architecture", "statechange": "State change", "assets": "What you own",
              "beforeafter": "Before / after"}
NOTES_FOR = {"letter": [], "system": ["stack", "architecture", "statechange"], "handover": ["assets", "beforeafter"]}


def r3notes() -> dict:
    out = {}
    for line in (R / "ROUND3-NOTES.md").read_text().splitlines():
        m = re.match(r"^(\d\d) [^:]+: (APPROVED|NEEDS CHANGES) · [^—]*?(?: — \"(.*)\")?$", line.strip())
        if m:
            out[NOTE_IDS[int(m.group(1)) - 1]] = {"status": "Approved" if m.group(2) == "APPROVED" else "Needs changes",
                                                 "note": (m.group(3) or "").strip()}
    return out


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for d in ("brand", "fonts", "lib"):
        shutil.copytree(SITE / d, OUT / d)
    (OUT / "img").mkdir()
    shutil.copy(SITE / "img" / "film-room.webp", OUT / "img" / "film-room.webp")
    story = json.loads((R / "story3.json").read_text())
    order = [x["id"] for x in json.loads((R / "story-order.json").read_text())]
    notes = r3notes()
    data = {"story": story, "order": order, "names": {k: v[0] for k, v in NAMES.items()}, "sections": []}
    missing = []
    for sid in order + ["faq"]:
        meta_p = SITE / "frag" / sid / "S.meta.json"
        page = SITE / f"m-{sid}-S.html"
        shot = SITE / "shots" / f"{sid}-S.png"
        if not (meta_p.exists() and page.exists() and shot.exists()):
            missing.append(sid)
            continue
        meta = json.loads(meta_p.read_text())
        lint = json.loads((SITE / "shots" / f"{sid}-S.json").read_text())
        (OUT / f"m-{sid}-S.html").write_text(publishable(page.read_text()))
        webp(shot, OUT / f"shots/{sid}-S.webp", width=1440, q=82)
        name, short, verdict = NAMES[sid]
        prior = []
        for (psec, slot, label, what) in SOURCES[sid]:
            pm = json.loads((SITE / "frag" / psec / f"{slot}.meta.json").read_text())
            key = f"{psec}-{slot}"
            webp(SITE / "shots" / f"{psec}-{slot}.png", OUT / f"shots/{key}.webp")
            prior.append({"key": key, "label": label, "title": pm.get("title", ""), "shot": f"shots/{key}.webp",
                          "what": what or "The round-2 version, shown for comparison."})
        nids = NOTES_FOR.get(sid, [sid])
        sec_notes = [{"from": NOTE_NAMES.get(n, NAMES.get(n, (n,))[0]), **notes[n]} for n in nids if n in notes]
        data["sections"].append({
            "id": sid, "name": name, "short": short, "verdict": verdict, "offpage": sid not in order,
            "pin": sid == "system", "notes": sec_notes, "prior": prior,
            "r3": {"title": meta.get("title", ""), "summary": meta.get("summary", ""), "story": meta.get("story", ""),
                   "motion": meta.get("motion", []), "addressed": meta.get("addressed", []), "signoff": meta.get("signoff", []),
                   "shot": f"shots/{sid}-S.webp", "frame": f"m-{sid}-S.html", "height": int(lint.get("height", 900))},
        })
    for src, dst in (("home-s.html", "home-s.html"), ("home.html", "home.html")):
        p = SITE / src
        if p.exists():
            (OUT / dst).write_text(publishable(p.read_text()))
        else:
            missing.append(src)
    tpl = (R / "tool" / "selector3.template.html").read_text()
    page = tpl.replace("/*__DATA__*/null", json.dumps(data, ensure_ascii=False).replace("</", "<\\/"), 1)
    (OUT / "index.html").write_text(page)
    (R / "preview3.html").write_text('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" '
                                     'content="width=device-width,initial-scale=1,viewport-fit=cover"><base href="out3/"></head><body>' + page + "</body></html>")
    files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
    (R / "out3-files.json").write_text(json.dumps(files))
    size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"beats {len(data['sections'])} · files {len(files)} · {size / 1e6:.1f} MB · missing {missing or 'none'}")


if __name__ == "__main__":
    main()
