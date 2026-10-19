"""Each film's poster at the moment that explains it: the held frame, the logo whole on the panel.
    python3 tools/posters.py            (all films in films/)
The film is decoded at 30 fps over the turn (a turn: the click to the lift + 0.3s; once-*: the cold arrival, before the
click) and the poster is the middle of the run of frames where the centre of the panel is brightest (the logo whole,
none of it mid-flicker), among the frames the panel covers. Writes <film>.webp (and records posterAt in the json)."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image
FF = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/ffenv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
F = Path(__file__).resolve().parent.parent / "films"
for j in sorted(F.glob("*.json")):
    m = json.loads(j.read_text()); mp4 = j.with_suffix(".mp4")
    w, h = m["width"], m["height"]
    if m["mode"] == "chain": a, z = 0.0, m["clickAt"]
    elif m["mode"] == "arrive": a, z = 0.0, min(m["seconds"], (m["liftAt"] or 1.5) + 0.3)
    else: a, z = m["clickAt"], min(m["seconds"], m["liftAt"] + 0.3)
    raw = subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-ss", f"{a:.3f}", "-t", f"{z - a:.3f}", "-i", str(mp4), "-vf", "fps=30,format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    n = len(raw) // (w * h); fr = np.frombuffer(raw[: n * w * h], np.uint8).reshape(n, h, w)
    c = fr[:, int(h * .35): int(h * .65), int(w * .2): int(w * .8)]
    panel = ((fr > 28) & (fr < 52)).mean(axis=(1, 2)) > 0.9   # the panel covers the window (graphite, nothing else)
    score = (c > 200).sum(axis=(1, 2)) * panel
    best = score.max(); run = [i for i, s in enumerate(score) if s >= best * 0.97]
    # the longest consecutive run of near-best frames, its middle
    runs, cur = [], [run[0]]
    for i in run[1:]:
        if i == cur[-1] + 1: cur.append(i)
        else: runs.append(cur); cur = [i]
    runs.append(cur); r = max(runs, key=len); k = r[len(r) // 2]
    at = a + k / 30 + 1 / 60
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{at:.3f}", "-i", str(mp4), "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", str(j.with_suffix(".webp"))], check=True)
    m["posterAt"] = round(at, 2); j.write_text(json.dumps(m, indent=1))
    print(j.stem, "poster at", round(at, 2), "held frames", len(r), "bright px", int(best))
