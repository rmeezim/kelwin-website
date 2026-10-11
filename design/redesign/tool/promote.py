"""Promote an approved section version into another slot unchanged (class names renamed only).

    python3 tool/promote.py <section> [FROM=X] [TO=S]

Copies site/frag/<section>/<FROM>.{html,css,js,meta.json} to <TO>.*, rewriting the scoped
class/keyframe prefix km-<section>-<FROM> -> km-<section>-<TO>.
"""
import json
import re
import sys
from pathlib import Path

R = Path(__file__).resolve().parent.parent
sec = sys.argv[1]
src = sys.argv[2] if len(sys.argv) > 2 else "X"
dst = sys.argv[3] if len(sys.argv) > 3 else "S"
d = R / "site" / "frag" / sec
pat = re.compile(rf"km-{re.escape(sec)}-{src}(?![A-Za-z0-9])")
for ext in ("html", "css", "js"):
    p = d / f"{src}.{ext}"
    if p.exists():
        (d / f"{dst}.{ext}").write_text(pat.sub(f"km-{sec}-{dst}", p.read_text()))
meta = json.loads((d / f"{src}.meta.json").read_text())
meta.setdefault("notes", "")
meta["notes"] = (meta["notes"] + f" · Promoted unchanged from round-2 slot {src}.").strip(" ·")
(d / f"{dst}.meta.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False))
print(f"{sec}: {src} -> {dst}")
