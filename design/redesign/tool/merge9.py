"""Merge the parallel review-writer parts (qa/r9-review/parts/*.json) into tool/review9.json.
   Each part file holds one or more top-level keys of review9.json; a part replaces that key whole.
   page-flags.json ({page: [flag, ...]}) is folded into pages[].flags as plain flags (no question link)
   unless the pages part already carries them. questions-extra.json ({questions: [...]}) is appended.
   python3 tool/merge9.py [--dry]"""
import json, sys
from pathlib import Path
R = Path(__file__).resolve().parent.parent
P = R / "qa" / "r9-review" / "parts"
data = json.loads((R / "tool" / "review9.json").read_text())
log = []
for f in sorted(P.glob("*.json")):
    if f.name in ("page-flags.json", "questions-extra.json"):
        continue
    part = json.loads(f.read_text())
    for k, v in part.items():
        log.append(f"{f.name}: {k} ({'new' if k not in data else 'replaced'})")
        data[k] = v
extra = P / "questions-extra.json"
if extra.exists():
    q = json.loads(extra.read_text()).get("questions", [])
    ids = {x["id"] for x in data.get("questions", [])}
    add = [x for x in q if x["id"] not in ids]
    data.setdefault("questions", []).extend(add)
    log.append(f"questions-extra.json: +{len(add)} questions")
flags = P / "page-flags.json"
if flags.exists():
    fl = json.loads(flags.read_text())
    for pg in data.get("pages", []):
        have = {x.get("text") for x in pg.get("flags", [])}
        for t in fl.get(pg["id"], []):
            if t not in have:
                pg.setdefault("flags", []).append({"text": t})
    log.append(f"page-flags.json: folded into {sum(1 for p in data.get('pages', []) if p['id'] in fl)} pages")
todo = json.dumps(data, ensure_ascii=False).count('"TODO')
print("\n".join(log)); print(f"TODO strings left: {todo}")
if "--dry" not in sys.argv:
    (R / "tool" / "review9.json").write_text(json.dumps(data, indent=1, ensure_ascii=False))
    print("wrote tool/review9.json")
