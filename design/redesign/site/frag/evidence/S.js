(function () {
  /* ── evidence · S · the four readings, as an explorer ──────────────────
     The numerals are the control: four toggle buttons, one pressed at a
     time, with roving focus (arrow keys move focus AND select, Home/End
     jump). A press crossfades the readout (360ms, CSS) and re-extends the
     MEASURE bar from 0 to the reading's value (600ms). Red only for 01.

     The entrance has two beats: the WALL (numerals rise, 01 takes its
     rule) and the READOUT (claim → so-what → detail, then the red bar).
     Standalone mockup: both beats play, then the control is demoed once
     (17 → 95:5 → 77 → 53 → 17) and everything has settled inside 6s.
     Live homepage (html.km-home): the wall plays when it is 40% visible;
     the readout writes in (and the red bar extends) only once the readout
     itself is on screen, so the section's one moment is never spent below
     the fold. Plays once, never auto-steps.
     Reduced motion: the final markup (01 pressed) stands; no timers.      */
  var V = [0.17, 0.05, 0.77, 0.53];        // share of 100 the bar fills, per reading

  var api = {
    init: function (root, opts) {
      var reduced = !!(opts && opts.reduced);
      var home = document.documentElement.classList.contains("km-home");
      var wall = root.querySelector(".km-evidence-S__wall");
      var cells = [].slice.call(root.querySelectorAll(".km-evidence-S__cell"));
      var panels = [].slice.call(root.querySelectorAll(".km-evidence-S__panel"));
      var gauge = root.querySelector(".km-evidence-S__gauge");
      if (!wall || !cells.length || !gauge) return;
      var cur = 0, timers = [], live = false;

      function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
      function stopAll() { timers.forEach(clearTimeout); timers = []; root.classList.remove("is-pre"); }

      /* the bar at 0 with no transition (the ac-cold class freezes it while it snaps) */
      function zero() {
        gauge.classList.add("ac-cold");
        gauge.setAttribute("data-on", "none");
        gauge.style.setProperty("--v", 0);
        void gauge.offsetWidth;
        gauge.classList.remove("ac-cold");
      }

      /* the bar: snap to 0, then extend to the reading over ms (ms = 0 sets it at once) */
      function bar(n, ms) {
        if (reduced || !ms) {
          gauge.setAttribute("data-on", String(n));
          gauge.classList.toggle("is-red", n === 0);
          gauge.style.setProperty("--v", V[n]);
          return;
        }
        zero();
        gauge.classList.toggle("is-red", n === 0);
        gauge.style.setProperty("--bt", ms + "ms");
        gauge.setAttribute("data-on", String(n));
        gauge.style.setProperty("--v", V[n]);
      }

      function select(n, focus) {
        if (n === cur && gauge.getAttribute("data-on") === String(n)) { if (focus) cells[n].focus(); return; }
        cur = n;
        cells.forEach(function (c, i) {
          c.setAttribute("aria-pressed", String(i === n));
          c.tabIndex = i === n ? 0 : -1;
        });
        panels.forEach(function (p) { p.classList.toggle("is-on", +p.getAttribute("data-n") === n); });
        bar(n, 600);
        if (focus) cells[n].focus();
      }

      /* any real interaction ends the entrance holds and the demo for good */
      function take() {
        if (live) return;
        live = true;
        stopAll();
        root.classList.remove("is-wait", "is-hold-ro");
        root.classList.add("is-go");
      }

      cells.forEach(function (c, i) {
        c.addEventListener("click", function () { take(); select(i, false); });
      });
      wall.addEventListener("keydown", function (e) {
        var k = e.key, n = cells.indexOf(document.activeElement);
        if (n < 0) return;
        var to = k === "ArrowRight" || k === "ArrowDown" ? (n + 1) % cells.length
               : k === "ArrowLeft" || k === "ArrowUp" ? (n + cells.length - 1) % cells.length
               : k === "Home" ? 0 : k === "End" ? cells.length - 1 : -1;
        if (to < 0) return;
        e.preventDefault();
        take();
        select(to, true);
      });

      if (reduced) { live = true; bar(0, 0); return; }

      /* beat 1 · the WALL: numerals rise (CSS, from --w0) → cell 01 takes its rule at w0 + 600 */
      var tWall = 0, w0Used = 700, roDone = false;
      function playWall(w0) {
        tWall = Date.now();
        w0Used = w0;
        root.style.setProperty("--w0", w0 + "ms");
        root.classList.add("is-pre");
        root.classList.remove("is-wait");
        root.classList.add("is-go");
        later(function () { root.classList.remove("is-pre"); }, w0 + 600);
      }
      /* beat 2 · the READOUT (from --r0): claim → so-what → detail, then the red 17 bar extends (700ms) */
      function playReadout(r0) {
        if (roDone) return;
        roDone = true;
        root.style.setProperty("--r0", r0 + "ms");
        zero();
        root.classList.remove("is-hold-ro");
        root.classList.add("is-ro");
        later(function () { bar(0, 700); }, r0 + 400);
      }

      if (!home) {
        /* standalone: the wall follows the lede (the kit's lede enters at 600ms), the readout follows 01's
           rule; the red 17 bar lands at 2.55s and holds 0.4s, then the control is demoed once and comes
           back to 17 (that bar lands at 5.5s; everything is settled inside 6s) */
        playWall(700);
        playReadout(700 + 750);
        [[1, 2950], [2, 3600], [3, 4250], [0, 4900]].forEach(function (s) {
          later(function () { select(s[0], false); }, s[1]);
        });
        return;
      }

      /* live homepage: the head plays with the slot. The wall waits until it is 40% visible; the readout
         waits until it is itself on screen, and never writes in before 01's rule has landed. */
      var t0 = Date.now(), roSeen = false;
      root.classList.add("is-wait", "is-hold-ro");
      gauge.setAttribute("data-on", "none");
      gauge.style.setProperty("--v", 0);
      function wallGo() {
        if (live || tWall) return;
        playWall(Math.max(120, 700 - (Date.now() - t0)));
        if (roSeen) roGo();
      }
      function roGo() {
        roSeen = true;
        if (live || !tWall || roDone) return;
        playReadout(Math.max(0, w0Used + 750 - (Date.now() - tWall)));
      }
      if (!("IntersectionObserver" in window)) { wallGo(); roGo(); return; }
      var ioW = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { ioW.disconnect(); wallGo(); } });
      }, { threshold: 0.4 });
      var ioR = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { ioR.disconnect(); roGo(); } });
      }, { threshold: 0.35 });
      ioW.observe(wall);
      ioR.observe(root.querySelector(".km-evidence-S__ro") || wall);
    }
  };
  if (typeof window !== "undefined") window.KM = api;
})();
