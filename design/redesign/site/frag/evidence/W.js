(function () {
  /* ── evidence · W · the calibrated gauge ───────────────────────────────
     One gauge, one reading at a time. --f on the gauge (0–1) drives the
     painted share (scaleX) and the needle (translateX); the JS tweens it.
     A change of reading RE-MEASURES like an instrument:
       1. the flag lifts and the share retracts to 0 (time ∝ how far it is);
       2. a calibration pass runs through the 101 marks, 0 → 100;
       3. the share extends to the new value at an even speed, the needle
          riding its edge; the flag latches on arrival (95:5 then
          dimensions its empty run, "95 not buying").
     Triggers: the 17% · 95:5 · 77% · 53% control, a press on a reading,
     or resting the pointer on a reading (140ms intent, so a pass across
     the plate doesn't fire it).
     Standalone mockup: the gauge draws itself (datum, caps, track, marks
     0 → 100), measures 17, then demos 95:5 → 77 → 53 → back to 17, all
     settled by about 6s. The first interaction stops the demo for good.
     Live homepage (html.km-home): the gauge waits until it is 60% on
     screen, draws itself and measures 17 once. It never steps on its own.
     Reduced motion: the final markup (17 measured) stands; changes land
     at once; no timers, no loops.                                        */
  var P = "km-evidence-W";
  var V = { 1: 0.17, 2: 0.05, 3: 0.77, 4: 0.53 };   // 01 Visibility · 02 Timing (5 buying now) · 03 Complexity · 04 Experience

  var api = {
    init: function (root, opts) {
      if (!root) return;
      var reduced = !!(opts && opts.reduced);
      var home = document.documentElement.classList.contains("km-home");
      function q(s) { return root.querySelector("." + P + s); }
      function qa(s) { return [].slice.call(root.querySelectorAll("." + P + s)); }
      var plate = q("__plate"), gauge = q("__gauge"), fig = q("__fig");
      if (!plate || !gauge) return;
      var cells = qa("__cell"), segs = qa("__seg button"), names = qa("__name"), fvs = qa("__fv"), words = qa("__w");

      var cur = 1, f = V[1], raf = 0, runT = [], demoT = [], hoverT = 0, waiting = false, started = false;

      function setF(x) { f = x; gauge.style.setProperty("--f", x.toFixed(4)); }
      function on(list, n) { list.forEach(function (el) { el.classList.toggle("is-on", +el.getAttribute("data-n") === n); }); }
      function mark(n) {
        plate.setAttribute("data-state", String(n));
        gauge.setAttribute("data-on", String(n));
        cells.forEach(function (c) { c.classList.toggle("is-active", +c.getAttribute("data-n") === n); });
        segs.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-n") === n)); });
        on(names, n); on(words, n);
      }
      function later(list, fn, ms) { list.push(setTimeout(fn, ms)); }
      function clear(list) { list.forEach(clearTimeout); list.length = 0; }
      function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }   // --ease-inout, near enough
      function tween(from, to, dur, done) {
        if (raf) cancelAnimationFrame(raf);
        var t0 = null;
        function step(now) {
          if (t0 === null) t0 = now;
          var k = dur > 0 ? Math.min((now - t0) / dur, 1) : 1;
          setF(from + (to - from) * ease(k));
          if (k < 1) raf = requestAnimationFrame(step); else { raf = 0; if (done) done(); }
        }
        raf = requestAnimationFrame(step);
      }
      function settle(n) {
        gauge.classList.remove("is-moving");
        gauge.classList.toggle("is-rest", n === 2);
      }
      function calibrate(speed) {
        gauge.style.setProperty("--cals", (2.6 * speed).toFixed(2) + "ms");
        gauge.style.setProperty("--calt", Math.round(220 * speed) + "ms");
        gauge.classList.remove("is-cal");
        void gauge.offsetWidth;
        gauge.classList.add("is-cal");
      }

      /* re-measure: retract → calibrate → fill. speed scales every duration (1 live, .6 in the demo). */
      function measure(n, speed) {
        if (n === cur && !gauge.classList.contains("is-moving")) return;
        cur = n;
        mark(n);
        clear(runT);
        if (reduced) { if (raf) cancelAnimationFrame(raf); raf = 0; setF(V[n]); on(fvs, n); settle(n); return; }
        gauge.classList.add("is-moving");
        gauge.classList.remove("is-rest");
        var tR = (120 + 260 * f) * speed;                  // retract: quicker from a short share
        tween(f, 0, tR, null);
        later(runT, function () { calibrate(speed); }, Math.max(0, tR - 80 * speed));
        var tF = (320 + 640 * V[n]) * speed;               // fill: an even speed, so 77 takes longer than 5
        later(runT, function () {
          on(fvs, n);
          tween(0, V[n], tF, function () { settle(n); });
        }, tR + 140 * speed);
      }

      /* the gauge draws itself (CSS, from --g0), then measures 17 */
      function start(g0) {
        if (started) return;
        started = true;
        waiting = false;
        root.style.setProperty("--g0", g0 + "ms");
        root.classList.remove("is-wait");
        root.classList.add("is-go");
        later(runT, function () { on(words, cur); }, g0 + 850);
        later(runT, function () {
          on(fvs, cur);
          tween(0, V[cur], 650, function () { settle(cur); });
        }, g0 + 650);
      }

      /* any real interaction ends the demo for good (and starts a gauge still waiting off-screen) */
      function user(n) {
        clear(demoT);
        if (waiting) { start(0); }
        measure(n, 1);
      }
      segs.forEach(function (b) {
        b.addEventListener("click", function () { user(+b.getAttribute("data-n")); });
      });
      cells.forEach(function (c) {
        var n = +c.getAttribute("data-n");
        c.addEventListener("click", function () { clearTimeout(hoverT); user(n); });
        c.addEventListener("mouseenter", function () { clearTimeout(hoverT); hoverT = setTimeout(function () { user(n); }, 140); });
        c.addEventListener("mouseleave", function () { clearTimeout(hoverT); });
      });

      if (reduced) { started = true; setF(V[1]); settle(1); return; }   // the final state, as marked up

      /* opening state: the share at 0, flag lifted, words held (frozen while they snap) */
      gauge.classList.add("ac-cold", "is-moving");
      setF(0);
      words.forEach(function (w) { w.classList.remove("is-on"); });
      void gauge.offsetWidth;
      requestAnimationFrame(function () { gauge.classList.remove("ac-cold"); });

      if (!home) {
        /* standalone: the gauge follows the plate, measures 17 (settled ≈ 2.0s), then demos the control once */
        start(700);
        [[2, 2250], [3, 3050], [4, 4100], [1, 5150]].forEach(function (s) {
          later(demoT, function () { measure(s[0], 0.6); }, s[1]);
        });
        return;
      }

      /* live homepage: wait until the gauge itself is well on screen; play once; never auto-step */
      waiting = true;
      root.classList.add("is-wait");
      if (!("IntersectionObserver" in window) || !fig) { start(120); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); if (waiting) start(120); } });
      }, { threshold: 0.6 });
      io.observe(fig);
    }
  };
  if (typeof window !== "undefined") window.KM = api;
})();
