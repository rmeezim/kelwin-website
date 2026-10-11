import type { Behavior } from "../types";
import { MONTAGE_MS, TAKE_MS } from "./takes";

/* The Operating Feed. One 24 s film in three 8 s takes (01 Narrative Systems · 02 GTM
   Infrastructure · 03 GTM Intelligence). The takes, the camera moves, the playhead and the
   elapsed run are CSS keyed to [data-take]; this clock only cuts between takes, writes the
   timecode, plays / pauses real footage when a take has it, and stops when the hero is off
   screen or the tab is hidden. No canvas, no rAF loop: a cut timer every 8 s and a timecode
   timer once a second. Reduced motion: a still of take 01; the chapters still select stills. */
export const init: Behavior = (root, { reduced }) => {
  const chapters = Array.from(root.querySelectorAll<HTMLButtonElement>(".km-hero__ch"));
  const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("video.km-hero__vid"));
  const tk = root.querySelector<HTMLElement>(".km-hero__tk");
  const tc = root.querySelector<HTMLElement>(".km-hero__tc");
  const N = chapters.length;
  if (!N) return;

  let take = 0;
  let t0 = 0; // loop position (ms) when the clock last started or stopped
  let since = 0; // performance.now() when the clock last started
  let running = false;
  let auto = true; // the establishing montage + auto-cycle, until someone picks a chapter
  let cutTimer = 0;
  let tickTimer = 0;
  const demo: number[] = [];

  const pad = (n: number) => (n < 10 ? "0" : "") + n;
  const loopMs = () => (running ? t0 + (performance.now() - since) : t0);
  const stamp = (ms: number) => {
    if (tc) tc.textContent = "00:00:" + pad(Math.min(N * (TAKE_MS / 1000) - 1, Math.floor(ms / 1000)));
    if (tk) tk.textContent = pad(take + 1);
  };

  // real footage (when a take has it): only the active take's video plays, and only while the clock runs
  const syncVideo = (rewind: boolean) => {
    for (const v of videos) {
      const active = Number(v.dataset.k) === take + 1;
      if (active && rewind) {
        try {
          v.currentTime = 0;
        } catch {
          /* metadata not loaded yet: it starts at 0 anyway */
        }
      }
      if (active && running && !reduced) v.play().catch(() => {});
      else v.pause();
    }
  };

  const show = (k: number, restart: boolean) => {
    take = k;
    if (restart) {
      // restart the take's CSS from frame 0
      root.removeAttribute("data-take");
      void root.offsetWidth;
    }
    root.setAttribute("data-take", String(k + 1));
    chapters.forEach((c, i) => c.setAttribute("aria-current", i === k ? "true" : "false"));
  };

  const tick = () => {
    const m = loopMs();
    stamp(m);
    tickTimer = window.setTimeout(tick, 1000 - (m % 1000) + 12);
  };

  const schedule = () => {
    window.clearTimeout(cutTimer);
    window.clearTimeout(tickTimer);
    if (!running) return;
    const ms = loopMs();
    const end = (Math.floor(ms / TAKE_MS) + 1) * TAKE_MS;
    // hard cut at the end of the take: the next take while auto-cycling, the same take once someone has chosen
    cutTimer = window.setTimeout(() => cut(auto ? (take + 1) % N : take), Math.max(0, end - ms));
    tick();
  };

  function cut(k: number) {
    root.classList.add("is-cut");
    t0 = k * TAKE_MS;
    since = performance.now();
    show(k, true);
    stamp(t0);
    syncVideo(true);
    schedule();
  }

  const hold = () => {
    if (running) t0 = loopMs();
    running = false;
    root.classList.add("is-held");
    window.clearTimeout(cutTimer);
    window.clearTimeout(tickTimer);
    syncVideo(false);
  };

  const play = () => {
    if (running || reduced) return;
    since = performance.now();
    running = true;
    root.classList.remove("is-held");
    syncVideo(false);
    schedule();
  };

  // pause off screen (IntersectionObserver) and in a background tab (visibilitychange)
  let io: IntersectionObserver | undefined;
  let visible = true;
  let shown = !document.hidden;
  const sync = () => (visible && shown ? play() : hold());
  const onVisibility = () => {
    shown = !document.hidden;
    sync();
  };

  // chapters: click / tap seeks the film to that take; the auto-cycle stops for good ("let them skim")
  const onChapter = (e: Event) => {
    const i = chapters.indexOf(e.currentTarget as HTMLButtonElement);
    if (i < 0) return;
    auto = false;
    demo.forEach((t) => window.clearTimeout(t));
    if (reduced) {
      // a still per chapter, no motion
      show(i, false);
      stamp(i * TAKE_MS);
      syncVideo(true);
      return;
    }
    cut(i);
    if (!running) hold();
  };
  chapters.forEach((c) => c.addEventListener("click", onChapter));

  const cleanup = () => {
    window.clearTimeout(cutTimer);
    window.clearTimeout(tickTimer);
    demo.forEach((t) => window.clearTimeout(t));
    io?.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    chapters.forEach((c) => c.removeEventListener("click", onChapter));
    running = false;
    // back to the resting frame, so a re-init (strict mode, remount) starts clean
    root.classList.remove("is-cut", "is-held");
    take = 0;
    show(0, false);
    stamp(0);
    syncVideo(true);
  };

  show(0, !reduced);
  stamp(0);
  syncVideo(true);
  if (reduced) return cleanup; // poster frame of take 01, chapter 01 active, no timers

  // the orchestrated moment: once the frame has plotted, a short establishing montage 01 → 02 → 03
  // (each held long enough to read its chapter), then the takes settle into their 8s rhythm on the 24s loop.
  // Each montage cut is timed from the previous one, so a stalled main thread can never fire two back to back.
  const montage = (j: number, prev: number) => {
    if (j >= MONTAGE_MS.length) return;
    demo.push(
      window.setTimeout(() => {
        if (auto && running) cut(j + 1);
        montage(j + 1, MONTAGE_MS[j]);
      }, MONTAGE_MS[j] - prev),
    );
  };
  montage(0, 0);

  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      (es) => {
        visible = es[es.length - 1].isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    io.observe(root);
  }
  document.addEventListener("visibilitychange", onVisibility);
  sync();

  return cleanup;
};
