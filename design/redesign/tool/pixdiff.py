"""Compare a production shot with the approved mockup shot (same width).
    python3 tool/pixdiff.py prod.png mock.png out.png [--crop-top N] [--crop-top-mock N] [--height N]
Prints the share of pixels that differ (per-channel delta > 24) over the overlapping height and the
height difference, and writes a 3-panel image: mock | prod | diff (differences in red)."""
import sys
from PIL import Image, ImageChops
a = sys.argv
prod, mock, out = Image.open(a[1]).convert("RGB"), Image.open(a[2]).convert("RGB"), a[3]
def opt(k):
    return int(a[a.index(k) + 1]) if k in a else 0
prod = prod.crop((0, opt("--crop-top"), prod.width, prod.height))
mock = mock.crop((0, opt("--crop-top-mock"), mock.width, mock.height))
w, h = min(prod.width, mock.width), min(prod.height, mock.height)
if opt('--height'):
    h = min(h, opt('--height'))
p, m = prod.crop((0, 0, w, h)), mock.crop((0, 0, w, h))
d = ImageChops.difference(p, m).convert("L").point(lambda v: 255 if v > 24 else 0)
share = sum(1 for v in d.get_flattened_data() if v) / (w * h)
red = Image.new("RGB", (w, h), (232, 86, 78))
diff = Image.composite(red, p.point(lambda v: v // 3), d)
panel = Image.new("RGB", (w * 3 + 40, h), (0, 0, 0))
panel.paste(m, (0, 0)); panel.paste(p, (w + 20, 0)); panel.paste(diff, (2 * w + 40, 0))
panel.thumbnail((2400, 99999)); panel.save(out)
print(f"differing pixels {share:.1%} over {w}x{h} · prod height {prod.height} vs mock {mock.height} (Δ {prod.height - mock.height:+d}) → {out}")
