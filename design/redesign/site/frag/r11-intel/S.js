/* r11-intel · S — GTM Intelligence head: one quarter, and what it changes (round 11: redrawn for the phone).
   The markup is the finished frame. This script only decides WHEN it plays and WHICH drawing plays:
   · start: the h1's last letter − 250ms (the section's --ac-write-end, set by lib/turn.js's write-in), so the
     plate draws while the last letters land; 700ms when there is no write-in (a standalone build); and only
     once the plate is on screen (40% of it; on a phone, the three names above the weeks);
   · the frame: of the three drawings (1440 · tablet · phone) the one CSS shows plays. The 1440 and tablet
     frames are round 10's, unchanged: .is-run on the drawing (the 1440 frame also lights its HTML words with
     .is-run-lg on the measure). The phone drawing (round 11, HTML at real size) plays in two beats: its names
     write in at the start (.is-lay) while the weeks wait (.is-wait), because a phone head sits low and the
     13 weeks are often still below the fold; the weeks play (.is-run) once they are on screen;
   · phase 2 (the page setting next quarter) starts at the frame's data-km-r11-intel-t2 ms, and not before
     next quarter's part of the drawing is on screen (on the stacked frames it sits under the quarter; on the
     phone, three quarters of next quarter's weeks, so the new column grows where it is seen):
     .is-run2 / .is-run2-lg;
   · until the start, the plate is held hidden (.is-armed), so the finished frame never flashes first;
   · "Replay" runs it again from week 1 (the plate and the names stay). On a phone the button sits under next
     quarter, far below the weeks: the weeks are hidden again, the page scrolls them back on screen (the
     names above them where the screen allows) and they play once they are there.
   All the timing is CSS (S.css). Nothing loops.
   Reduced motion: nothing is armed, nothing plays, Replay stays hidden; the final frame is the markup. */
window.KM = {
  init(root, { reduced }) {
    const P = "km-r11-intel-S__";
    const m = root.querySelector("." + P + "m");
    const plate = root.querySelector("." + P + "plate");
    const replay = root.querySelector("." + P + "replay");
    const ph = root.querySelector("." + P + "p");                         // the phone drawing
    const svgs = Array.prototype.slice.call(root.querySelectorAll("." + P + "d"));
    const frames = svgs.concat(ph ? [ph] : []);
    root.classList.add("is-init");                      // the plate may show (S.css holds it until now)
    if (!m || !plate || !frames.length || reduced) return function () {};

    const timers = [];
    let io = null, io2 = null, io3 = null, raf = 0, started = false, frame = null, nqSeen = false, t2Due = false;
    root.classList.add("is-armed");
    if (replay) replay.hidden = false;

    function isPhone() { return !!ph && getComputedStyle(ph).visibility === "visible"; }
    // the drawing CSS shows at this width (all three switch by visibility: the phone drawing stands in for the
    // measure below 768, and the kit switches the measure's own two)
    function shown() {
      if (isPhone()) return ph;
      for (let i = svgs.length - 1; i >= 0; i--) if (getComputedStyle(svgs[i]).visibility === "visible") return svgs[i];
      return svgs[0];
    }
    function phase2() {
      if (!frame || frame.classList.contains("is-run2")) return;
      frame.classList.add("is-run2");
      if (frame.classList.contains(P + "d--lg")) m.classList.add("is-run2-lg");
    }
    function watchNext() {                                 // next quarter's part of the drawing, on screen?
      if (io2) { io2.disconnect(); io2 = null; }
      nqSeen = false;
      const box = frame && frame.querySelector(frame === ph ? "." + P + "pxr" : "." + P + "box");
      if (!box || !("IntersectionObserver" in window)) { nqSeen = true; return; }
      const at = frame === ph ? 0.75 : 0.5;
      io2 = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio >= at) { nqSeen = true; if (t2Due) phase2(); if (io2) { io2.disconnect(); io2 = null; } }
        });
      }, { threshold: [at] });
      io2.observe(box);
    }
    function run() {
      timers.forEach(clearTimeout); timers.length = 0;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      if (io3) { io3.disconnect(); io3 = null; }
      frames.forEach(function (f) { f.classList.remove("is-run", "is-run2"); });
      m.classList.remove("is-run-lg", "is-run2-lg");
      if (ph) ph.classList.remove("is-wait");
      void root.getBoundingClientRect();                   // restart every animation from week 1
      frame = shown(); t2Due = false;
      frame.classList.add("is-run");
      if (frame.classList.contains(P + "d--lg")) m.classList.add("is-run-lg");
      watchNext();
      const t2 = parseFloat(frame.getAttribute("data-km-r11-intel-t2")) || 3900;
      timers.push(setTimeout(function () { t2Due = true; if (nqSeen) phase2(); }, t2));
    }
    // the phone: the weeks play once they are on screen (all but a sliver of them, or 60% of the screen)
    function runWhenSeen() {
      const q = ph.querySelector("." + P + "pq");
      if (!q || !("IntersectionObserver" in window)) { run(); return; }
      io3 = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          const vh = window.innerHeight || 1;
          if (e.isIntersecting && (e.intersectionRatio >= 0.92 || e.intersectionRect.height >= vh * 0.6)) run();
        });
      }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 0.92, 1] });
      io3.observe(q);
    }
    function go() {
      if (started) return;
      started = true;
      if (io) { io.disconnect(); io = null; }
      root.classList.remove("is-armed");
      root.classList.add("is-go");                         // the plate fades in (300ms) as the quarter starts
      if (isPhone()) { ph.classList.add("is-lay", "is-wait"); runWhenSeen(); }
      else run();
    }
    // after the h1: wait for the plate to be on screen (on a phone: the names above the weeks)
    function arm() {
      if (!("IntersectionObserver" in window)) { go(); return; }
      const phone = isPhone(), target = phone ? (ph.querySelector("." + P + "pk") || plate) : plate, at = phone ? 0.6 : 0.4;
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio >= at) go(); });
      }, { threshold: [at] });
      io.observe(target);
    }
    const we = parseFloat(getComputedStyle(root).getPropertyValue("--ac-write-end"));
    timers.push(setTimeout(arm, isNaN(we) ? 700 : Math.max(0, we - 250)));

    // Replay on a phone: if the weeks are not all on screen, hide them again (.is-wait), bring them back on
    // screen (the drawing's top 24px under the screen's, or the weeks' foot 16px over its bottom when the
    // names and the weeks do not fit together) and, once the scroll has settled, play them when they are
    // there (watching from the settled screen, so next quarter is never counted as seen in passing)
    function replayPhone() {
      const q = ph.querySelector("." + P + "pq"), vh = window.innerHeight || 1;
      const qr = q ? q.getBoundingClientRect() : null;
      if (!qr || (qr.top >= 0 && qr.bottom <= vh)) { run(); return; }
      timers.forEach(clearTimeout); timers.length = 0;
      if (io2) { io2.disconnect(); io2 = null; }
      if (io3) { io3.disconnect(); io3 = null; }
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      ph.classList.remove("is-run", "is-run2"); ph.classList.add("is-wait");
      let dy = ph.getBoundingClientRect().top - 24;
      if (qr.bottom - dy > vh - 16) dy = qr.bottom - (vh - 16);
      const de = document.documentElement, y = Math.max(0, Math.min(window.scrollY + dy, de.scrollHeight - vh)), t0 = Date.now();
      window.scrollTo({ top: y, behavior: "smooth" });
      (function settle() {
        if (Math.abs(window.scrollY - y) < 2 || Date.now() - t0 > 1500) { raf = 0; runWhenSeen(); return; }
        raf = requestAnimationFrame(settle);
      })();
    }
    function onReplay() {
      if (!started) { go(); if (isPhone()) replayPhone(); return; }
      if (isPhone()) replayPhone(); else run();
    }
    if (replay) replay.addEventListener("click", onReplay);

    return function cleanup() {
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (io2) io2.disconnect();
      if (io3) io3.disconnect();
      if (replay) { replay.removeEventListener("click", onReplay); replay.hidden = true; }
      root.classList.remove("is-armed", "is-go", "is-init");
      m.classList.remove("is-run-lg", "is-run2-lg");
      frames.forEach(function (f) { f.classList.remove("is-run", "is-run2", "is-lay", "is-wait"); });
    };
  }
};
