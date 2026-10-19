"""The flicker, frame by frame, in a finished film (round-11 fix: verify by the frames the founder will see).
    python3 tools/steps.py films/<name>.json [...]
Decodes the film at its 30 fps and reads each piece of the logo on every frame (K3, K2, K1 and the wordmark; today's
turn has no wordmark) with tools/score.py: every flicker (leaving, entering cold, each lift) and how many frames each
of its steps stays on screen. A step lasts 40–66ms by design (1–2 frames at 30 fps); a step held 3 frames or more is
a stall the founder would see (HELD), a step no frame shows is MISSED. Exits 1 if anything is held.
    python3 tools/steps.py --json <take.json>   one JSON line {held, missed, maxMs, frames, detail} (tools/film.mjs
    judges every take by its own encoded film with this)."""
import json, subprocess, sys
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parent))
from score import analyze

FF = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/ffenv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"


def decode(mp4, w, h):
    raw = subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-i", str(mp4), "-vf", "format=gray", "-f", "rawvideo", "-"],
                         capture_output=True, check=True).stdout
    n = len(raw) // (w * h)
    a = np.frombuffer(raw[: n * w * h], np.uint8).reshape(n, h, w).astype(float)
    return [(i * 1000 / 30, a[i]) for i in range(n)]


def windows(m):
    t = m["timelineMs"]; F, C = m.get("flickerMs", 610), m.get("coldMs", 410)
    full, cfull = F > 500, C > 300
    W = []
    if m.get("clickAt") is not None and t.get("turning") is not None:
        c = m["clickAt"] * 1000 + t["turning"]
        W.append({"kind": "leave", "a": c + 200, "z": c + F + 80, "full": full, "dir": "on"})
    if m.get("liftAt") is not None:
        W.append({"kind": "lift", "a": m["liftAt"] * 1000, "z": m["liftAt"] * 1000 + 220, "full": cfull if m["mode"] == "arrive" else full, "dir": "off"})
    if t.get("firstPaint") is not None:
        W.append({"kind": "cold", "a": t["firstPaint"], "z": t["firstPaint"] + C + 80, "full": cfull, "dir": "on"})
    if t.get("arriveLift") is not None:
        a = m["arriveLiftAt"] * 1000 if m.get("arriveLiftAt") is not None else t["arriveLift"]
        W.append({"kind": "arrivelift", "a": a, "z": a + 220, "full": cfull, "dir": "off"})
    return W


def summary(detail):
    out = []
    for d in detail:
        if "held" in d: continue
        k, runs = d.split(": ", 1)
        steps = runs.split("  (")[0].split()
        if all(x[1:].lstrip("-").isdigit() for x in steps):
            out.append(f"{k} " + " ".join(f"{x[0]}{round(int(x[1:]) / (1000 / 30))}" for x in steps))
        else:
            out.append(f"{k} {runs.strip()}")
    return out


args = sys.argv[1:]
as_json = "--json" in args
args = [a for a in args if a != "--json"]
bad = 0
for j in args:
    j = Path(j); m = json.loads(j.read_text())
    fr = decode(j.with_suffix(".mp4"), m["width"], m["height"])
    held, missed, mx, detail = analyze(fr, m["vp"], m["width"], windows(m))
    bad += held
    if as_json:
        print(json.dumps({"held": held, "missed": missed, "maxMs": mx, "frames": summary(detail), "detail": detail})); continue
    print(f"{j.stem}: held {held} · missed {missed} · longest step {mx}ms ({round(mx / (1000 / 30))} frames)")
    for line in summary(detail):
        k, rest = line.split(" ", 1) if line.count(" ") else (line, "")
        print("    " + line)
sys.exit(1 if bad and not as_json else 0)
