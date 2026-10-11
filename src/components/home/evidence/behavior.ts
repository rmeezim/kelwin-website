import type { Behavior } from "../types";

/* ── evidence · the four readings, as an explorer (mockup slot T) ───────────────────────────
   The numerals are the control: four toggle buttons, one pressed at a time, with roving focus
   (arrow keys move focus AND select, Home/End jump). A press crossfades the readout (360ms, CSS)
   and re-extends the MEASURE bar from 0 to the reading's value (600ms). Red only for 01.

   The entrance has two beats: the WALL (numerals rise, 01 takes its rule) when the wall is 40%
   visible, and the READOUT (claim → so-what → detail, then the red bar) when the readout itself
   is on screen — never before 01's rule has landed, so the bar never fills below the fold.

   The AUTOMATIC PASS (round 6, calm): 17 holds 3.45s from its claim, then one reading every 3.3s
   (17 → 95:5 → 77 → 53 → back to 17), then it stops for good. Under .is-auto the words crossfade
   slower (280ms out, then 420ms in), the bar retracts with the old words and re-extends over
   900ms. Any interaction (a press, hover-intent on a numeral, keyboard focus in the explorer)
   halts the pass at once; it never restarts. Production refinement: the pass only steps while
   the explorer (wall + readout) is at least half on screen — half of itself, or half the
   viewport when it is taller than that. A step that falls due off screen waits; when the
   explorer returns, the reading on screen holds a full 3.3s before the pass continues. A hidden
   tab counts as off screen (its timers still run, throttled, and its IntersectionObserver goes
   quiet): the pending step is withdrawn, a step in flight lands, and the pass waits for the tab.
   Reduced motion: the final markup (01 pressed) stands; presses still work; no timers.        */

const HOLD = 3300; // the automatic pass: one reading every 3.3s
const FIRST = 3450; // 17's first hold, counted from the readout's claim
const OUT = 280; // pass tempo: the bar retracts with the words' fade-out…
const EXT = 900; // …then re-extends to the new value
const INTENT = 200; // hover-intent: the pointer rests on a numeral this long
const PRESS = 600; // a press: the bar snaps to 0 and re-extends
const SEQ = [1, 2, 3, 0]; // the pass: 95:5, 77, 53, back to 17
const SEEN = 0.5; // the explorer counts as "in view" at half of itself (or half the viewport)

export const init: Behavior = (root, { reduced }) => {
  const wall = root.querySelector<HTMLElement>(".km-evidence__wall");
  const body = root.querySelector<HTMLElement>(".km-evidence__body") ?? wall;
  const ro = root.querySelector<HTMLElement>(".km-evidence__ro") ?? wall;
  const gauge = root.querySelector<HTMLElement>(".km-evidence__gauge");
  const cells = Array.from(root.querySelectorAll<HTMLButtonElement>(".km-evidence__cell"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>(".km-evidence__panel"));
  if (!wall || !body || !ro || !gauge || !cells.length) return;

  /* the share of 100 each reading fills, read from its flag's --at (the markup is the source) */
  const V = cells.map((_, i) => {
    const flag = gauge.querySelector<HTMLElement>(`.km-evidence__val[data-n="${i}"]`);
    return parseFloat(flag?.style.getPropertyValue("--at") ?? "") || 0;
  });

  const listeners = new AbortController();
  const on = { signal: listeners.signal };
  const timers = new Set<number>();
  const observers: IntersectionObserver[] = [];
  let cur = 0; // the reading shown
  let live = false; // the entrance holds are over (a press, or reduced motion)
  /* the automatic pass */
  let k = 0; // next index into SEQ
  let autoT: number | null = null; // the pending step (or its retract → re-extend hand-off)
  let endT: number | null = null; // the pass's closing beat
  let hov: number | null = null; // hover-intent
  let pend: (() => void) | null = null; // the second half of a step in flight
  let manual = false; // halted for good (or never armed: reduced motion)
  let inView = true; // is the explorer on screen enough to step?
  let due = false; // a step fell due while it was not
  let eyes: IntersectionObserver | null = null; // watches the explorer for the pass; closed when the pass ends

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };
  const cancel = (id: number | null) => {
    if (id === null) return;
    window.clearTimeout(id);
    timers.delete(id);
  };
  const stopAll = () => {
    timers.forEach((id) => window.clearTimeout(id));
    timers.clear();
    autoT = endT = hov = null;
    root.classList.remove("is-pre");
  };

  /* the bar at 0 with no transition (ac-cold freezes it while it snaps) */
  const zero = () => {
    gauge.classList.add("ac-cold");
    gauge.setAttribute("data-on", "none");
    gauge.style.setProperty("--v", "0");
    gauge.getBoundingClientRect();
    gauge.classList.remove("ac-cold");
  };

  /* the bar: snap to 0, then extend to the reading over ms (ms = 0 sets it at once) */
  const bar = (n: number, ms: number) => {
    if (reduced || !ms) {
      gauge.setAttribute("data-on", String(n));
      gauge.classList.toggle("is-red", n === 0);
      gauge.style.setProperty("--v", String(V[n]));
      return;
    }
    zero();
    gauge.classList.toggle("is-red", n === 0);
    gauge.style.setProperty("--bt", `${ms}ms`);
    gauge.setAttribute("data-on", String(n));
    gauge.style.setProperty("--v", String(V[n]));
  };

  /* the pressed numeral, its tab stop and its words */
  const mark = (n: number) => {
    cur = n;
    cells.forEach((c, i) => {
      c.setAttribute("aria-pressed", String(i === n));
      c.tabIndex = i === n ? 0 : -1;
    });
    panels.forEach((p) => p.classList.toggle("is-on", Number(p.dataset.n) === n));
  };

  const select = (n: number, focus: boolean) => {
    if (n === cur && gauge.getAttribute("data-on") === String(n)) {
      if (focus) cells[n].focus();
      return;
    }
    mark(n);
    bar(n, PRESS);
    if (focus) cells[n].focus();
  };

  /* ── the automatic pass ── */
  /* screen readers: the readout is a polite live region so a press is announced; while the pass
     runs unasked it is muted (aria-live=off), and it speaks again when the pass ends or is halted */
  const quiet = (q: boolean) => {
    if (ro.hasAttribute("aria-live")) ro.setAttribute("aria-live", q ? "off" : "polite");
  };

  /* one calm step: the old words fade and the bar retracts with them (OUT); then the bar
     re-extends to the new value (EXT) while the new words fade in. No snap. */
  const autoStep = (n: number) => {
    root.classList.add("is-auto");
    mark(n);
    gauge.setAttribute("data-on", "none");
    gauge.style.setProperty("--bt", `${OUT}ms`);
    gauge.style.setProperty("--v", "0");
    pend = () => {
      pend = null;
      gauge.classList.toggle("is-red", n === 0);
      gauge.style.setProperty("--bt", `${EXT}ms`);
      gauge.setAttribute("data-on", String(n));
      gauge.style.setProperty("--v", String(V[n]));
    };
    autoT = later(() => {
      autoT = null;
      pend?.();
      next();
    }, OUT);
  };
  const next = () => {
    if (manual) return;
    if (k < SEQ.length) {
      arm(HOLD - OUT);
      return;
    }
    /* back on 17: let the bar and its flag land, then drop the pass tempo and let the readout speak */
    endT = later(() => {
      endT = null;
      root.classList.remove("is-auto");
      quiet(false);
      eyes?.disconnect();
    }, EXT + 300);
  };
  const tick = () => {
    autoT = null;
    if (manual) return;
    if (!inView || document.hidden) {
      due = true; // the explorer is off screen (or the tab is hidden): wait for it
      return;
    }
    autoStep(SEQ[k++]);
  };
  const arm = (ms: number) => {
    if (manual) return;
    quiet(true);
    cancel(autoT);
    autoT = later(tick, ms);
  };
  /* any interaction ends the pass for good; a step in flight lands where it was going */
  const halt = () => {
    if (manual) return;
    manual = true;
    cancel(autoT);
    cancel(endT);
    autoT = endT = null;
    pend?.();
    root.classList.remove("is-auto");
    quiet(false);
    eyes?.disconnect();
  };

  /* a press ends the entrance holds too, then selects */
  const take = () => {
    halt();
    if (live) return;
    live = true;
    observers.forEach((io) => io.disconnect()); // the entrance beats are over
    stopAll();
    root.classList.remove("is-wait", "is-hold-ro");
    root.classList.add("is-go");
  };

  cells.forEach((c, i) => {
    c.addEventListener(
      "click",
      () => {
        take();
        select(i, false);
      },
      on,
    );
  });
  wall.addEventListener(
    "keydown",
    (e) => {
      const n = cells.indexOf(document.activeElement as HTMLButtonElement);
      if (n < 0) return;
      const key = e.key;
      const last = cells.length - 1;
      const to =
        key === "ArrowRight" || key === "ArrowDown"
          ? (n + 1) % cells.length
          : key === "ArrowLeft" || key === "ArrowUp"
            ? (n + last) % cells.length
            : key === "Home"
              ? 0
              : key === "End"
                ? last
                : -1;
      if (to < 0) return;
      e.preventDefault();
      take();
      select(to, true);
    },
    on,
  );

  /* restores the server markup (01 pressed, red 17 bar drawn) — React strict mode remounts */
  const cleanup = () => {
    listeners.abort();
    observers.forEach((io) => io.disconnect());
    stopAll();
    pend = null;
    root.classList.remove("is-wait", "is-hold-ro", "is-go", "is-ro", "is-pre", "is-auto");
    root.style.removeProperty("--w0");
    root.style.removeProperty("--r0");
    mark(0);
    gauge.classList.add("ac-cold", "is-red");
    gauge.setAttribute("data-on", "0");
    gauge.style.setProperty("--v", String(V[0]));
    gauge.style.removeProperty("--bt");
    gauge.getBoundingClientRect();
    gauge.classList.remove("ac-cold");
    quiet(false);
  };

  if (reduced) {
    live = true;
    manual = true;
    bar(0, 0);
    return cleanup;
  }

  /* what halts the pass: a press anywhere in the explorer (mouse/pen at pointerdown, touch at
     click, so a swipe that scrolls the page does not count), keyboard focus inside it, and
     hover-intent on a numeral (a real pointer move into it, then a 200ms rest; the synthetic moves
     a browser sends after a scroll carry no movement, so a still pointer a scroll slides over a
     numeral does not count) */
  body.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType !== "touch") halt();
    },
    on,
  );
  body.addEventListener("click", halt, on);
  body.addEventListener("focusin", halt, on);
  cells.forEach((c) => {
    c.addEventListener(
      "pointermove",
      (e) => {
        if (manual || hov !== null || e.pointerType === "touch" || (!e.movementX && !e.movementY)) return;
        hov = later(() => {
          hov = null;
          halt();
        }, INTENT);
      },
      on,
    );
    c.addEventListener(
      "pointerleave",
      () => {
        cancel(hov);
        hov = null;
      },
      on,
    );
  });

  /* beat 1 · the WALL: numerals rise (CSS, from --w0) → cell 01 takes its rule at w0 + 600 */
  let tWall = 0;
  let w0Used = 700;
  let roDone = false;
  const playWall = (w0: number) => {
    tWall = Date.now();
    w0Used = w0;
    root.style.setProperty("--w0", `${w0}ms`);
    root.classList.add("is-pre");
    root.classList.remove("is-wait");
    root.classList.add("is-go");
    later(() => root.classList.remove("is-pre"), w0 + 600);
  };
  /* beat 2 · the READOUT (from --r0): claim → so-what → detail, then the red 17 bar extends
     (700ms); 17 then holds, and the automatic pass begins FIRST ms after the claim */
  const playReadout = (r0: number) => {
    if (roDone) return;
    roDone = true;
    root.style.setProperty("--r0", `${r0}ms`);
    zero();
    root.classList.remove("is-hold-ro");
    root.classList.add("is-ro");
    later(() => bar(0, 700), r0 + 400);
    arm(r0 + FIRST);
  };

  /* the head plays with the slot. The wall waits until it is 40% visible; the readout waits until
     it is itself on screen, and never writes in before 01's rule has landed. A beat whose top edge
     is already above the viewport (a reload or back/forward that restores a deep scroll, a late
     slot play, a jump past the section) counts as seen, and a readout that is seen first plays the
     wall before it (the wall's 120ms floor keeps 01's rule ahead of the bar), so the readout can
     never sit blank on screen waiting for a wall the reader has already scrolled past. */
  const t0 = Date.now();
  let roSeen = false;
  let ioW: IntersectionObserver | null = null;
  let ioR: IntersectionObserver | null = null;
  root.classList.add("is-wait", "is-hold-ro");
  zero();
  const wallGo = () => {
    ioW?.disconnect();
    if (live || tWall) return;
    playWall(Math.max(120, 700 - (Date.now() - t0)));
    if (roSeen) roGo();
  };
  const roGo = () => {
    roSeen = true;
    ioR?.disconnect();
    if (live || roDone) return;
    if (!tWall) {
      wallGo(); // plays the wall, then comes back here (roSeen) for the readout
      return;
    }
    playReadout(Math.max(0, w0Used + 750 - (Date.now() - tWall)));
  };

  if (!("IntersectionObserver" in window)) {
    wallGo();
    roGo();
    return cleanup;
  }
  const watch = (el: Element, cb: IntersectionObserverCallback, threshold: number | number[]) => {
    const io = new IntersectionObserver(cb, { threshold });
    observers.push(io);
    io.observe(el);
    return io;
  };
  /* in view at its threshold, or already scrolled into/past (its top above the viewport's top) */
  const seen = (e: IntersectionObserverEntry, at: number) =>
    (e.isIntersecting && e.intersectionRatio >= at - 0.001) || e.boundingClientRect.top < (e.rootBounds?.top ?? 0);
  ioW = watch(
    wall,
    (es) => {
      if (es.some((e) => seen(e, 0.4))) wallGo();
    },
    [0, 0.4],
  );
  ioR = watch(
    ro,
    (es) => {
      if (es.some((e) => seen(e, 0.35))) roGo();
    },
    [0, 0.35],
  );
  /* the pass's eyes: is the explorer at least half on screen (half of itself, or half the
     viewport when it is taller)? A step that falls due while it is not waits for it. */
  inView = false;
  const steps = Array.from({ length: 21 }, (_, i) => i / 20);
  eyes = watch(
    body,
    (es) => {
      for (const e of es) {
        const vh = e.rootBounds?.height ?? window.innerHeight;
        const need = SEEN * Math.min(e.boundingClientRect.height, vh);
        inView = e.isIntersecting && e.intersectionRect.height >= need - 1;
        if (inView && due && !manual && !document.hidden) {
          due = false;
          arm(HOLD);
        }
      }
    },
    steps,
  );

  /* a hidden tab is off screen: withdraw the pending step (a step in flight lands where it was
     going first), and when the tab is back with the explorer in view, the reading on screen holds a
     full 3.3s before the pass continues */
  document.addEventListener(
    "visibilitychange",
    () => {
      if (manual) return;
      if (document.hidden) {
        if (autoT === null) return; // nothing pending: not armed yet, already waiting, or the pass is over
        cancel(autoT);
        autoT = null;
        if (pend) {
          pend();
          if (k >= SEQ.length) {
            next(); // that was the last step: the pass closes as it would have
            return;
          }
        }
        due = true;
      } else if (due && inView) {
        due = false;
        arm(HOLD);
      }
    },
    on,
  );

  return cleanup;
};
