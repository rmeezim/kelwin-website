"""Stitch one direction's sections, in homepage order, into page strips for review.
    python3 tool/page.py A   ->  R/site/page-A-1.png, page-A-2.png, ... (720px wide, ≤ 2400px tall each)"""
import json, sys
from pathlib import Path
from PIL import Image, ImageDraw
R = Path(__file__).resolve().parent.parent
opt = sys.argv[1]
order = [s["id"] for s in json.load(open(R / "sections.json"))]
W, MAXH = 720, 2400
tiles = []
for sid in order:
    p = R / "site" / "shots" / f"{sid}-{opt}.png"
    if not p.exists(): continue
    im = Image.open(p).convert("RGB"); im = im.resize((W, round(im.height * W / im.width)))
    lab = Image.new("RGB", (W, 18), (255, 0, 140)); ImageDraw.Draw(lab).text((6, 3), f"{sid}-{opt}", fill=(255, 255, 255))
    tiles += [lab, im]
strips, cur, h = [], [], 0
for t in tiles:
    if h + t.height > MAXH and cur: strips.append(cur); cur, h = [], 0
    cur.append(t); h += t.height
if cur: strips.append(cur)
for i, s in enumerate(strips, 1):
    canvas = Image.new("RGB", (W, sum(t.height for t in s)))
    y = 0
    for t in s: canvas.paste(t, (0, y)); y += t.height
    out = R / "site" / f"page-{opt}-{i}.png"; canvas.save(out); print(out, canvas.size)
