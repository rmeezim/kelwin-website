import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
R = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/redesign"
CAP_T, TRACK, WEIGHT = float(sys.argv[1]), float(sys.argv[2]), sys.argv[3]
f = TTFont({"500": "poppins-1.ttf", "600": "poppins-2.ttf"}[WEIGHT])
gs = f.getGlyphSet(); cmap = f.getBestCmap(); cap = f["OS/2"].sCapHeight or 697
MARK = [(0,0,100,30),(70,0,30,100),(0,36,64,12),(52,36,12,64),(0,54,46,12),(34,54,12,46),(0,72,28,28)]
mark_rects = "".join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}"/>' for x,y,w,h in MARK)
BASE, X0 = 93.0, 146.0
s = CAP_T / cap
pen = SVGPathPen(gs); x = 0.0
for i, ch in enumerate("Kelwin"):
    g = cmap[ord(ch)]
    gs[g].draw(TransformPen(pen, (s, 0, 0, -s, X0 + x * s, BASE)))
    x += f["hmtx"][g][0] + (TRACK if i < 5 else 0)
W = round(X0 + x * s + 1, 1)
open(f"{R}/site/brand/kelwin-mark.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#000">{mark_rects}</svg>')
open(f"{R}/site/brand/kelwin-lockup.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 100" fill="#000">{mark_rects}<path d="{pen.getCommands()}"/></svg>')
print(W)
