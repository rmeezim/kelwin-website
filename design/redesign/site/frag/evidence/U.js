(function () {
  /* ── evidence · U · The painted chip (promoted from slot V) ────────────
     One registered CSS property (--km-evidence-U-v, the active share 0–1)
     drives the whole instrument: the red field's height, the datum and its
     node, and which scale ticks are ink. A change of reading is one
     morph: the property transitions over --mt, the chip records the reading
     being left (data-from) and the one being shown (data-on), the node
     unlatches while the level travels and latches (fills) when it lands,
     and the reading text crossfades (CSS).

     Controls: press a numeral (the whole cell is the hit area). Hovering a
     numeral previews its reading in the chip (grey cell rule); leaving
     returns to the pressed one. Arrow keys move between the numerals and
     select as they go (roving tabindex, Home/End jump). Round 4: the band's
     segmented control is gone (the reframe keeps the page's one toggle).

     Standalone: the plate draws in, the red rises to 17, then the control
     is demoed once (95:5 → 77 → 53 → 17) and everything is settled by
     ≈ 5.85s. Live homepage (html.km-home): the plate waits until it is 40%
     on screen, plays its entrance once and never steps on its own.
     Reduced motion: the final markup stands (17 shown, node latched).     */
  var V = [0.17, 0.95, 0.77, 0.53];   // the share each reading paints red = its big numeral: 17 · 95 (of 95:5) · 77 · 53
  var P = "km-evidence-U";

  var api = {
    init: function (root, opts) {
      if (!root) return;
      var reduced = !!(opts && opts.reduced);
      var home = document.documentElement.classList.contains("km-home");
      var grid = root.querySelector("." + P + "__grid");
      var chip = root.querySelector("." + P + "__chip");
      var cells = [].slice.call(root.querySelectorAll("." + P + "__cell"));
      var nums = [].slice.call(root.querySelectorAll("." + P + "__num"));
      var reads = [].slice.call(root.querySelectorAll("." + P + "__read"));
      var live$ = root.querySelector("." + P + "__reads");
      if (!grid || !chip || cells.length !== 4) return;

      var sel = 0, shown = 0, timers = [], live = false, latchT = 0, peekT = 0;
      function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
      function stop() { timers.forEach(clearTimeout); timers = []; }

      /* the morph: move the level to v over ms; the node latches when it lands */
      function level(v, ms) {
        chip.style.setProperty("--mt", ms + "ms");
        chip.style.setProperty("--km-evidence-U-v", String(v));
        chip.classList.remove("is-latched");
        clearTimeout(latchT);
        latchT = setTimeout(function () { chip.classList.add("is-latched"); }, reduced ? 0 : ms);
      }
      /* what the chip shows (a selection or a hover preview) */
      function show(n, ms) {
        if (n === shown && chip.style.getPropertyValue("--km-evidence-U-v") === String(V[n])) return;
        if (n !== shown) chip.setAttribute("data-from", String(shown));
        shown = n;
        chip.setAttribute("data-on", String(n));
        reads.forEach(function (r) { r.classList.toggle("is-on", +r.getAttribute("data-n") === n); });
        level(V[n], ms || 1100);
      }
      /* what is pressed */
      function mark(n) {
        sel = n;
        cells.forEach(function (c, i) { c.classList.toggle("is-active", i === n); });
        nums.forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === n)); b.tabIndex = i === n ? 0 : -1; });
      }
      /* the reading is announced (aria-live) only when it is chosen, never for a hover preview */
      function announce(on) { if (live$) live$.setAttribute("aria-live", on ? "polite" : "off"); }
      function select(n, ms) { announce(true); mark(n); show(n, ms); }
      /* the hover preview on the cell's rule (-1 clears it) */
      function peek(n) {
        cells.forEach(function (x, i) { x.classList.toggle("is-peek", i === n); });
      }

      /* any real interaction ends the entrance holds and the demo, for good */
      function take() {
        if (live) return;
        live = true;
        stop();
        root.classList.remove("is-wait", "is-pre");
        root.classList.add("is-go");
      }

      cells.forEach(function (c, i) {
        c.addEventListener("click", function () { take(); peek(-1); select(i); });
        c.addEventListener("pointerenter", function (e) {
          if (e.pointerType !== "mouse") return;
          clearTimeout(peekT);
          peekT = setTimeout(function () {
            take();
            peek(i);
            announce(false);
            show(i);
          }, 90);
        });
        c.addEventListener("pointerleave", function (e) {
          if (e.pointerType !== "mouse") return;
          clearTimeout(peekT);
          peek(-1);
          peekT = setTimeout(function () { if (live) { announce(false); show(sel); } }, 140);
        });
      });
      grid.addEventListener("keydown", function (e) {
        var n = nums.indexOf(document.activeElement);
        if (n < 0) return;
        var k = e.key;
        var to = k === "ArrowRight" || k === "ArrowDown" ? (n + 1) % 4
               : k === "ArrowLeft" || k === "ArrowUp" ? (n + 3) % 4
               : k === "Home" ? 0 : k === "End" ? 3 : -1;
        if (to < 0) return;
        e.preventDefault();
        take();
        select(to);
        nums[to].focus();
      });

      if (reduced) { live = true; chip.classList.add("is-latched"); return; }

      /* opening state: the level at 0, nothing ruled yet. Transitions are frozen on the whole section while
         it is set, so 01's state rule, square and label start empty instead of visibly retracting first. */
      root.classList.add("ac-cold");
      chip.style.setProperty("--km-evidence-U-v", "0");
      chip.classList.remove("is-latched");
      root.classList.add("is-pre");
      void root.offsetWidth;
      root.classList.remove("ac-cold");

      function go() {
        root.classList.remove("is-wait");
        root.classList.add("is-go");
        /* after the ground paints and the scale calibrates: 01 takes its rule and the red rises to 17
           — landed at ≈ 2.0s */
        later(function () { root.classList.remove("is-pre"); level(V[0], 800); }, 1200);
        if (home) return;
        /* standalone demo, once: 95:5 → 77 → 53 → back to 17. Each move is 650ms and each reading holds
           ≈ 300ms after it lands; settled ≈ 5.85s, nothing moves after that */
        [[1, 2350], [2, 3300], [3, 4250], [0, 5200]].forEach(function (s) {
          later(function () { select(s[0], 650); }, s[1]);
        });
      }

      if (!home) { go(); return; }
      root.classList.add("is-wait");
      if (!("IntersectionObserver" in window)) { go(); return; }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !live) { io.disconnect(); go(); } });
      }, { threshold: 0.4 });
      io.observe(grid);
    }
  };
  if (typeof window !== "undefined") window.KM = api;
})();
