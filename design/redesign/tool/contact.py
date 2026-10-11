import sys
from pathlib import Path
from PIL import Image, ImageDraw
R = Path(__file__).resolve().parent.parent
out = R.parent / "contact"; out.mkdir(exist_ok=True)
W = 620
for sec in sys.argv[1:]:
    tiles = []
    for opt in "ABC":
        p = R / "site" / "shots" / f"{sec}-{opt}.png"
        if not p.exists(): continue
        im = Image.open(p).convert("RGB"); im = im.resize((W, round(im.height * W / im.width)))
        tiles.append((opt, im))
    if not tiles: continue
    H = max(t.height for _, t in tiles)
    sheet = Image.new("RGB", (len(tiles) * (W + 12), H + 28), (60, 60, 60))
    d = ImageDraw.Draw(sheet)
    for i, (opt, t) in enumerate(tiles):
        sheet.paste(t, (i * (W + 12), 28)); d.text((i * (W + 12) + 6, 8), f"{sec} · {opt}", fill=(255, 255, 255))
    sheet.save(out / f"{sec}.png"); print(out / f"{sec}.png", sheet.size)
