(function () {
  /* ── evidence · T · the four readings, as an explorer ──────────────────
     The numerals are the control: four toggle buttons, one pressed at a
     time, with roving focus (arrow keys move focus AND select, Home/End
     jump). A press crossfades the readout (360ms, CSS) and re-extends the
     MEASURE bar from 0 to the reading's value (600ms). Red only for 01.

     The entrance has two beats: the WALL (numerals rise, 01 takes its
     rule) and the READOUT (claim → so-what → detail, then the red bar).

     Round 6 · the AUTOMATIC PASS is calm: once the readout has written in,
     each reading holds for 3.3s (17 → 95:5 → 77 → 53 → back to 17), then
     the pass stops for good. Under .is-auto the words crossfade slower
     (280ms out, then 420ms in), the bar retracts with the old words and
     re-extends over 900ms, and the numeral's rule and ink move at the same
     tempo. Any interaction (a press, hover-intent on a numeral, keyboard
     focus in the explorer) halts the pass at once; it never restarts.
     Standalone mockup: steps at 4.9 / 8.2 / 11.5 / 14.8s, settled by 16.1s.
     Live homepage (html.km-home): the wall plays when it is 40% visible,
     the readout when it is itself on screen, and the pass follows the
     readout, stepping only while the readout is on screen (off screen it
     waits, and resumes with a full hold when the readout comes back).
     Reduced motion: the final markup (01 pressed) stands; no timers.      */
  var V = [0.17, 0.05, 0.77, 0.53];        // share of 100 the bar fills, per reading
  var HOLD = 3300;                          // the automatic pass: one reading every 3.3s
  var FIRST = 3450;                         // 17's first hold, counted from the readout's claim
  var OUT = 280, EXT = 900;                 // pass tempo: bar retract (with the words' fade-out), bar re-extension
  var INTENT = 200;                         // hover-intent: the pointer rests on a numeral this long

  var api = {
    init: function (root, opts) {
      var reduced = !!(opts && opts.reduced);
      var home = document.documentElement.classList.contains("km-home");
      var wall = root.querySelector(".km-evidence-T__wall");
      var body = root.querySelector(".km-evidence-T__body") || wall;
      var ro = root.querySelector(".km-evidence-T__ro") || wall;
      var cells = [].slice.call(root.querySelectorAll(".km-evidence-T__cell"));
      var panels = [].slice.call(root.querySelectorAll(".km-evidence-T__panel"));
      var gauge = root.querySelector(".km-evidence-T__gauge");
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

      /* the pressed numeral, its tab stop and its words */
      function mark(n) {
        cur = n;
        cells.forEach(function (c, i) {
          c.setAttribute("aria-pressed", String(i === n));
          c.tabIndex = i === n ? 0 : -1;
        });
        panels.forEach(function (p) { p.classList.toggle("is-on", +p.getAttribute("data-n") === n); });
      }

      function select(n, focus) {
        if (n === cur && gauge.getAttribute("data-on") === String(n)) { if (focus) cells[n].focus(); return; }
        mark(n);
        bar(n, 600);
        if (focus) cells[n].focus();
      }

      /* ── the automatic pass ── */
      var SEQ = [1, 2, 3, 0], k = 0, autoT = null, endT = null, pend = null;
      var manual = false, roVis = true, due = false;

      /* one calm step: the old words fade and the bar retracts with them (OUT); then the bar re-extends
         to the new value (EXT) while the new words fade in. No snap. */
      function autoStep(n) {
        root.classList.add("is-auto");
        mark(n);
        gauge.setAttribute("data-on", "none");
        gauge.style.setProperty("--bt", OUT + "ms");
        gauge.style.setProperty("--v", 0);
        pend = function () {
          pend = null;
          gauge.classList.toggle("is-red", n === 0);
          gauge.style.setProperty("--bt", EXT + "ms");
          gauge.setAttribute("data-on", String(n));
          gauge.style.setProperty("--v", V[n]);
        };
        autoT = setTimeout(function () { autoT = null; if (pend) pend(); next(); }, OUT);
      }
      function next() {
        if (manual) return;
        if (k < SEQ.length) { arm(HOLD - OUT); return; }
        /* back on 17: let the bar and its flag land, then drop the pass tempo and let the readout speak again */
        endT = setTimeout(function () { root.classList.remove("is-auto"); quiet(false); }, EXT + 300);
      }
      /* screen readers: the readout is a polite live region so a press is announced; while the pass runs
         unasked it is muted (aria-live=off), and it speaks again the moment the pass ends or is halted */
      function quiet(on) { if (ro.hasAttribute("aria-live")) ro.setAttribute("aria-live", on ? "off" : "polite"); }
      function arm(ms) {
        if (manual) return;
        quiet(true);
        clearTimeout(autoT);
        autoT = setTimeout(tick, ms);
      }
      function tick() {
        autoT = null;
        if (manual) return;
        if (!roVis) { due = true; return; }      // the readout is off screen: wait for it
        autoStep(SEQ[k++]);
      }
      /* any interaction ends the pass for good; a step in flight lands where it was going */
      function halt() {
        if (manual) return;
        manual = true;
        clearTimeout(autoT); clearTimeout(endT); autoT = endT = null;
        if (pend) pend();
        root.classList.remove("is-auto");
        quiet(false);
      }

      /* a press ends the entrance holds too, then selects */
      function take() {
        halt();
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
        var key = e.key, n = cells.indexOf(document.activeElement);
        if (n < 0) return;
        var to = key === "ArrowRight" || key === "ArrowDown" ? (n + 1) % cells.length
               : key === "ArrowLeft" || key === "ArrowUp" ? (n + cells.length - 1) % cells.length
               : key === "Home" ? 0 : key === "End" ? cells.length - 1 : -1;
        if (to < 0) return;
        e.preventDefault();
        take();
        select(to, true);
      });

      if (reduced) { live = true; manual = true; bar(0, 0); return; }

      /* what halts the pass: a press anywhere in the explorer (mouse/pen at pointerdown, touch at click,
         so a swipe that scrolls the page does not count), keyboard focus inside it, and hover-intent on a
         numeral (a real pointer move into it, then a 200ms rest; the synthetic moves a browser sends
         after a scroll carry no movement, so a still pointer that a scroll slides over a numeral does not count) */
      body.addEventListener("pointerdown", function (e) { if (e.pointerType !== "touch") halt(); });
      body.addEventListener("click", halt);
      body.addEventListener("focusin", halt);
      var hov = null;
      cells.forEach(function (c) {
        c.addEventListener("pointermove", function (e) {
          if (manual || hov || e.pointerType === "touch" || (!e.movementX && !e.movementY)) return;
          hov = setTimeout(function () { hov = null; halt(); }, INTENT);
        });
        c.addEventListener("pointerleave", function () { clearTimeout(hov); hov = null; });
      });

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
      /* beat 2 · the READOUT (from --r0): claim → so-what → detail, then the red 17 bar extends (700ms);
         17 then holds, and the automatic pass begins FIRST ms after the claim */
      function playReadout(r0) {
        if (roDone) return;
        roDone = true;
        root.style.setProperty("--r0", r0 + "ms");
        zero();
        root.classList.remove("is-hold-ro");
        root.classList.add("is-ro");
        later(function () { bar(0, 700); }, r0 + 400);
        arm(r0 + FIRST);
      }

      if (!home) {
        /* standalone: the wall follows the lede (the kit's lede enters at 600ms), the readout follows 01's
           rule; the red 17 bar lands at 2.55s, 17 holds to 4.9s, then 95:5 at 4.9s, 77 at 8.2s, 53 at 11.5s
           and back to 17 at 14.8s (its red bar lands at 15.98s; everything is settled by 16.1s) */
        playWall(700);
        playReadout(700 + 750);
        return;
      }

      /* live homepage: the head plays with the slot. The wall waits until it is 40% visible; the readout
         waits until it is itself on screen, and never writes in before 01's rule has landed. The pass
         steps only while the readout is on screen. */
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
      /* the pass's eyes: is the readout on screen? (a step that falls due off screen waits for it) */
      roVis = false;
      var ioV = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          roVis = e.isIntersecting && e.intersectionRatio >= 0.34;
          if (roVis && due && !manual) { due = false; arm(HOLD); }
          if (manual || (k >= SEQ.length && !autoT)) ioV.disconnect();
        });
      }, { threshold: [0, 0.35] });
      ioW.observe(wall);
      ioR.observe(ro);
      ioV.observe(ro);
    }
  };
  if (typeof window !== "undefined") window.KM = api;
})();
