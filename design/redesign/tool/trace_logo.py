import sys
import numpy as np, potrace
from PIL import Image
R = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/redesign"
SRC = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/images/3.png"
INVERT = sys.argv[1] == "1"
src = Image.open(SRC).convert("L"); W, H = src.size
arr = np.array(src) > 128
ys = np.where(arr.any(axis=1))[0]; xs = np.where(arr.any(axis=0))[0]
top, bot, left, right = ys.min(), ys.max(), xs.min(), xs.max()
S, wx0 = 4, 270
crop = src.crop((wx0, top - 6, W, bot + 7)).resize(((W - wx0) * S, (bot - top + 13) * S), Image.LANCZOS)
a = np.array(crop) > 128
bm = potrace.Bitmap(~a if INVERT else a)
plist = bm.trace(turdsize=8, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
oy = top - 6
def P(p): return f"{(p.x / S + wx0 - left):.2f} {(p.y / S + oy - top):.2f}"
parts = []
for c in plist:
    parts.append("M" + P(c.start_point))
    for s in c.segments:
        parts.append(("L" + P(s.c) + "L" + P(s.end_point)) if s.is_corner else ("C" + P(s.c1) + " " + P(s.c2) + " " + P(s.end_point)))
    parts.append("Z")
mx, my = 58 - left, 67 - top
RECTS = [(0,0,152,45),(108,0,44,152),(0,60,94,38),(55,60,39,92),(0,114,42,38)]
rects = "".join(f'<rect x="{x+mx}" y="{y+my}" width="{w}" height="{h}"/>' for x,y,w,h in RECTS)
VW, VH = right - left + 1, bot - top + 1
open(f"{R}/site/brand/kelwin-lockup.svg", "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VW} {VH}" fill="#000">{rects}<path fill-rule="evenodd" d="{"".join(parts)}"/></svg>')
print("curves", len(plist), "viewBox", VW, VH)
