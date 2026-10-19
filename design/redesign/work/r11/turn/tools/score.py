"""What a take's frames show of the flicker (round-11 fix: the take picker in film.mjs calls this on every take, and
tools/steps.py uses it on the finished film).
    python3 tools/score.py <take.json>
<take.json>: {"vp": "1440x900", "width": 1280, "frames": [{"file", "t"}], "windows": [{"kind", "a", "z", "full", "dir"}]}
t, a and z are ms on one clock, but the windows only say roughly where each flicker is and which logo is on the panel
(full = the full logo, so the wordmark is read too; dir "on" = off → bright → dim → on, "off" = the lift's flicker:
on → dim → bright → off). The flicker itself is found in the frames: a page's clock and the recorder's differ by up to
~250ms (a busy page starts its animations late), so each window is widened and only frames where the panel covers the
logo's row are read. With "t0" (the film's start) the frames are first resampled to 30 fps as the film will show them.
For each piece of the logo (K3, K2, K1, the wordmark), each flicker step's time on screen is measured from the first
frame that shows it to the first that does not. A step is 40–66ms by design; one shown longer than 75ms is HELD (3+
frames in the film); a step no frame shows is MISSED. Prints {"held", "missed", "maxMs", "detail"}."""
import json, sys
import numpy as np

U = 44 / 152
PIECES = {"K3": (6, 120, 36, 146), "K2": (8, 66, 48, 92), "K1": (10, 8, 95, 38)}


def boxes(vp, width, full):
    vw, vh = map(int, vp.split("x")); s = width / vw
    left = round(vw / 2 - 44 * 367 / 152) if full else vw / 2 - 22
    top = vh / 2 - 22
    b = {k: (left + x0 * U, top + y0 * U, left + x1 * U, top + y1 * U) for k, (x0, y0, x1, y1) in PIECES.items()}
    if full: b["word"] = (left + 44 * 228 / 152, top + 4, left + 44 * 730 / 152, top + 40)
    b["panel"] = (vw / 2 - 100, top - 44, vw / 2 + 100, top - 22)   # plain panel just above the logo
    return {k: tuple(int(round(v * s)) for v in bb) for k, bb in b.items()}


def state(v):
    return "." if v < .1 else "d" if v < .55 else "b" if v < .95 else "#"


def analyze(frames, vp, width, windows):
    """frames: [(t ms, gray ndarray)] in order. Returns (held, missed, maxMs, detail)."""
    held, missed, mx, detail = 0, 0, 0, []
    ws = sorted(windows, key=lambda w: w["a"])
    for n, w in enumerate(ws):
        # widen: from 150ms before (but after the previous window) to 400ms after (but before the next window)
        a = max(w["a"] - 150, ws[n - 1]["z"] if n else -float("inf"))
        z = min(w["z"] + 400, ws[n + 1]["a"] - 50 if n + 1 < len(ws) else float("inf"))
        bx = boxes(vp, width, w["full"])
        x0, y0, x1, y1 = bx["panel"]
        idx = [i for i, (t, g) in enumerate(frames) if a <= t <= z]
        P = np.array([frames[i][1][y0:y1, x0:x1].mean() for i in idx]) if idx else np.array([])
        if not len(P): detail.append(f"{w['kind']}: no frames"); missed += 8; continue
        hist = np.round(P[(P > 28) & (P < 56)])
        if not len(hist): detail.append(f"{w['kind']}: the panel never covers"); missed += 8; continue
        pl = float(np.bincount(hist.astype(int)).argmax())
        cov = [i for i, p in zip(idx, P) if abs(p - pl) <= 6]          # frames where the panel covers the logo's row
        for k in [k for k in bx if k != "panel"]:
            px0, py0, px1, py1 = bx[k]
            L = np.array([frames[i][1][py0:py1, px0:px1].mean() for i in cov])
            if len(L) < 3 or L.max() - pl < 40: detail.append(f"{w['kind']} {k}: not seen"); missed += 2; continue
            on = np.percentile(L, 95)
            st = [state(v) for v in (L - pl) / (on - pl)]
            ts = [frames[i][0] for i in cov]
            # the flicker: on → from the first frame that is not off to the first frame that is fully on (and stays);
            #              off → from the first frame that is not fully on (after one that is) to the first that is off
            if w["dir"] == "on":
                s = next((j for j, c in enumerate(st) if c != "."), None)
                e = next((j for j in range(len(st) - 1, -1, -1) if st[j] != "#"), None)
                e = e + 1 if e is not None and e + 1 < len(st) else None
            else:
                f = next((j for j, c in enumerate(st) if c == "#"), None)
                s = next((j for j in range(f, len(st)) if st[j] != "#"), None) if f is not None else None
                e = next((j for j in range(s, len(st)) if st[j] == "."), None) if s is not None else None
            if s is None or e is None or e <= s:
                detail.append(f"{w['kind']} {k}: no flicker found ({''.join(st)})"); missed += 2; continue
            runs, j = [], s
            while j < e:
                q = j
                while q + 1 < e and st[q + 1] == st[j]: q += 1
                runs.append((st[j], ts[j], ts[q + 1])); j = q + 1
            seq = "".join(r[0] for r in runs)
            for c in "bd":
                if c not in seq: missed += 1
            for c, ta, tz in runs:
                if c in "bd":
                    d = tz - ta; mx = max(mx, d)
                    if d > 75: held += 1; detail.append(f"{w['kind']} {k}: '{c}' held {round(d)}ms")
            detail.append(f"{w['kind']} {k}: " + " ".join(f"{c}{round(tz - ta)}" for c, ta, tz in runs) + f"  (from {round(ts[s] - w['a'])}ms)")
    return held, missed, round(mx), detail


if __name__ == "__main__":
    from PIL import Image
    m = json.load(open(sys.argv[1]))
    fr = [(f["t"], np.asarray(Image.open(f["file"]).convert("L"), dtype=float)) for f in m["frames"]]
    if m.get("t0") is not None:
        # as the film will show it: the delivered frames resampled to 30 fps from the film's start (each tick shows
        # the last frame delivered by tick + 1/60 s), so a step's time on screen is counted in the film's own frames
        ticks, i, k = [], 0, 0
        while m["t0"] + k * 1000 / 30 <= fr[-1][0]:
            T = m["t0"] + k * 1000 / 30
            while i + 1 < len(fr) and fr[i + 1][0] <= T + 1000 / 60: i += 1
            ticks.append((T, fr[i][1])); k += 1
        fr = ticks
    h, mi, mx, de = analyze(fr, m["vp"], m["width"], m["windows"])
    print(json.dumps({"held": h, "missed": mi, "maxMs": mx, "detail": de}))
