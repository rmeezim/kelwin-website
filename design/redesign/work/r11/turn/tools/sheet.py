"""A frame sheet of a finished film: every frame (30 fps) over the turn, cropped to a band around the logo, each
labelled with its time from the click (or from the start, entering cold).
    python3 tools/sheet.py films/<name>.json look/<out>.png [from_ms to_ms]"""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

FF = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/ffenv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
j = Path(sys.argv[1]); m = json.loads(j.read_text()); out = sys.argv[2]
w, h = m["width"], m["height"]
o = (m.get("clickAt") or 0) * 1000
t = m["timelineMs"]
if len(sys.argv) > 4: a, z = o + float(sys.argv[3]), o + float(sys.argv[4])
elif m["mode"] == "arrive": a, z = (t.get("firstPaint") or 0) - 60, m["liftAt"] * 1000 + 560
else: a, z = o + (t.get("turning") or 0) + 150, m["liftAt"] * 1000 + 560
raw = subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-i", str(j.with_suffix(".mp4")), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                     capture_output=True, check=True).stdout
n = len(raw) // (w * h * 3); fr = np.frombuffer(raw[: n * w * h * 3], np.uint8).reshape(n, h, w, 3)
idx = [i for i in range(n) if a <= i * 1000 / 30 <= z]
bw, bh = (int(w * .5), int(h * .16)) if w > 600 else (w, int(h * .14))
x0, y0 = (w - bw) // 2, (h - bh) // 2
cols = 6 if w > 600 else 8
tiles = []
for i in idx:
    im = Image.fromarray(fr[i][y0:y0 + bh, x0:x0 + bw].copy())
    d = ImageDraw.Draw(im); d.text((4, 2), f"{round(i * 1000 / 30 - o)}", fill=(255, 200, 0))
    tiles.append(im)
rows = (len(tiles) + cols - 1) // cols
S = Image.new("RGB", (cols * (bw + 3), rows * (bh + 3)), (119, 119, 119))
for k, im in enumerate(tiles): S.paste(im, ((k % cols) * (bw + 3), (k // cols) * (bh + 3)))
S.save(out); print(out, len(tiles), "frames", S.size)
