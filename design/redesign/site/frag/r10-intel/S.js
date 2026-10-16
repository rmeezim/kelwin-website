/* r10-intel · S — GTM Intelligence head: one quarter, and what it changes.
   The markup is the finished frame. This script only decides WHEN it plays and WHICH drawing plays:
   · start: the h1's last letter − 250ms (the section's --ac-write-end, set by lib/turn.js's write-in), so the
     plate draws while the last letters land; 700ms when there is no write-in (a standalone build); and only
     once the plate is 40% on screen;
   · the frame: of the three drawings (1440 · tablet · phone) the one CSS shows gets .is-run (the 1440 frame
     also lights its HTML words with .is-run-lg on the measure); the others stay finished;
   · phase 2 (the page setting next quarter) starts at the frame's data-t2 ms, and not before next quarter's
     part of the drawing is on screen (on a phone it sits under the quarter): .is-run2 / .is-run2-lg;
   · until the run, the plate is held hidden (.is-armed), so the finished frame never flashes first;
   · "Replay" runs it again from week 1 (the plate stays).
   All the timing is CSS (S.css). Nothing loops.
   Reduced motion: nothing is armed, nothing plays, Replay stays hidden; the final frame is the markup. */
window.KM = {
  init(root, { reduced }) {
    const P = "km-r10-intel-S__";
    const m = root.querySelector("." + P + "m");
    const plate = root.querySelector("." + P + "plate");
    const replay = root.querySelector("." + P + "replay");
    const frames = Array.prototype.slice.call(root.querySelectorAll("." + P + "d"));
    root.classList.add("is-init");                      // the plate may show (S.css holds it until now)
    if (!m || !plate || !frames.length || reduced) return function () {};

    const timers = [];
    let io = null, io2 = null, started = false, frame = null, nqSeen = false, t2Due = false;
    root.classList.add("is-armed");
    if (replay) replay.hidden = false;

    // the drawing CSS shows at this width (the kit switches frames with visibility)
    function shown() {
      for (let i = frames.length - 1; i >= 0; i--) if (getComputedStyle(frames[i]).visibility === "visible") return frames[i];
      return frames[0];
    }
    function phase2() {
      if (!frame || frame.classList.contains("is-run2")) return;
      frame.classList.add("is-run2");
      if (frame.classList.contains(P + "d--lg")) m.classList.add("is-run2-lg");
    }
    function watchNext() {                                 // next quarter's part of the drawing, on screen?
      if (io2) { io2.disconnect(); io2 = null; }
      nqSeen = false;
      const box = frame && frame.querySelector("." + P + "box");
      if (!box || !("IntersectionObserver" in window)) { nqSeen = true; return; }
      io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) { nqSeen = true; if (t2Due) phase2(); if (io2) { io2.disconnect(); io2 = null; } }
        });
      }, { threshold: [0.5] });
      io2.observe(box);
    }
    function run() {
      timers.forEach(clearTimeout); timers.length = 0;
      frames.forEach(function (f) { f.classList.remove("is-run", "is-run2"); });
      m.classList.remove("is-run-lg", "is-run2-lg");
      void m.getBoundingClientRect();                      // restart every animation from week 1
      frame = shown(); t2Due = false;
      frame.classList.add("is-run");
      if (frame.classList.contains(P + "d--lg")) m.classList.add("is-run-lg");
      watchNext();
      const t2 = parseFloat(frame.getAttribute("data-t2")) || 3900;
      timers.push(setTimeout(function () { t2Due = true; if (nqSeen) phase2(); }, t2));
    }
    function go() {
      if (started) return;
      started = true;
      if (io) { io.disconnect(); io = null; }
      root.classList.remove("is-armed");
      root.classList.add("is-go");                         // the plate fades in (300ms) as the quarter starts
      run();
    }
    // after the h1: wait for the plate to be 40% on screen (on a short phone it may sit below the fold)
    function arm() {
      if (!("IntersectionObserver" in window)) { go(); return; }
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio >= 0.4) go(); });
      }, { threshold: [0.4] });
      io.observe(plate);
    }
    const we = parseFloat(getComputedStyle(root).getPropertyValue("--ac-write-end"));
    timers.push(setTimeout(arm, isNaN(we) ? 700 : Math.max(0, we - 250)));

    function onReplay() { if (!started) go(); else run(); }
    if (replay) replay.addEventListener("click", onReplay);

    return function cleanup() {
      timers.forEach(clearTimeout);
      if (io) io.disconnect();
      if (io2) io2.disconnect();
      if (replay) { replay.removeEventListener("click", onReplay); replay.hidden = true; }
      root.classList.remove("is-armed", "is-go", "is-init");
      m.classList.remove("is-run-lg", "is-run2-lg");
      frames.forEach(function (f) { f.classList.remove("is-run", "is-run2"); });
    };
  }
};
