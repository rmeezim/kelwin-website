from PIL import Image
from pathlib import Path
import sys
SITE = Path(__file__).resolve().parent.parent / "site"
NAME = (sys.argv[1] if len(sys.argv) > 1 else "home.html").replace(".html", "")
im = Image.open(SITE / f"{NAME}-full.png").convert("RGB"); W = 720
im = im.resize((W, round(im.height * W / im.width)))
for old in SITE.glob(f"{NAME}-[0-9]*.png"): old.unlink()
n = 0
for y in range(0, im.height, 2200):
    n += 1; im.crop((0, y, W, min(im.height, y + 2200))).save(SITE / f"{NAME}-{n}.png")
print(n, "strips", im.size)
