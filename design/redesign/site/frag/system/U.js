(function () {
  /* ── system · U · Strata, closed (round 5) ──────────────────────────────────
     The markup is the final state: installed, the return drawn, the ring on 03
     closed, 01 selected and its row open.
     One rule holds throughout: the red slab, its bright callout and the ledger's
     open row are always the same layer. show(n) moves all three at once.
     Sequence (once, ~9.5s): the three slabs drop in exploded (pitch 176), 01 → 03,
     2.8s apart. Each lands with its top face red while it is installed and draws
     its one inscription, and its ledger row opens as the red arrives (the previous
     row closes with the accordion's own 360ms ease), so each row stays open for
     about 2.8s. The stack then closes up to its installed pitch (132) while the
     dimension re-measures "3 layers" → "1 system"; the one return line draws from
     slab 03 back up into slab 01, the ring on 03 closes, and the red, with its row,
     lands back on 01, where it rests.
     Layout: the ledger reserves its tallest state (min-height) from load, so the
     section and the "Find your weakest layer" door never move, before or while
     rows open and close.
     Pressing a row finishes the drawing at once and shows that layer; moving into
     the list with the keyboard finishes it too, so no row closes under focus.
     Standalone: plays at once. Homepage (html.km-home): waits until the figure
     itself is 30% in view, then plays once. No pin, no loop, no ScrollTrigger.
     Reduced motion: the markup's final state, no timers. */
  var STEP = 2800;                                   // the red's dwell on each layer during the assembly

  // reserveLedger(): hold the ledger at its tallest state (closed heads + the tallest open panel), so nothing
  // below or beside it moves as rows open and close. offsetHeight / rect height undoes the homepage's zoom.
  function reserveLedger(ledger) {
    ledger.style.minHeight = "";
    var box = ledger.getBoundingClientRect().height;
    if (!box) return;
    var k = ledger.offsetHeight / box;
    var open = 0, tallest = 0;
    Array.prototype.forEach.call(ledger.querySelectorAll(".ac-row"), function (r) {
      var more = r.querySelector(".ac-row__more"), inner = r.querySelector(".ac-row__in");
      if (more) open += more.getBoundingClientRect().height;
      if (inner) tallest = Math.max(tallest, inner.getBoundingClientRect().height);
    });
    ledger.style.minHeight = Math.ceil((box - open + tallest) * k) + 1 + "px";
  }

  var api = {
    init: function (root, opts) {
      var reduced = opts && opts.reduced;
      var body = root.querySelector(".km-system-U__body");
      var fig = root.querySelector(".km-system-U__fig");
      var detail = root.querySelector(".km-system-U__detail");
      var ledger = root.querySelector(".km-system-U__ledger");
      if (!body || !fig || !detail || !ledger) return;
      var slabs = root.querySelectorAll(".km-system-U__s");
      var cos = root.querySelectorAll(".km-system-U__co");
      var rows = root.querySelectorAll(".km-system-U__ledger .ac-row");
      var timers = [];
      var done = false;
      var io = null;

      // show(n): the red face (with its 8px lift), its bright callout, the ledger's current-row rule
      // and the open row all move to layer n, together.
      function show(n) {
        fig.setAttribute("data-sel", String(n));
        slabs.forEach(function (s) { s.classList.toggle("is-on", +s.getAttribute("data-l") === n); });
        cos.forEach(function (c) {
          var on = +c.getAttribute("data-l") === n;
          c.classList.toggle("is-on", on);
          var co = c.querySelector(".ac-callout");
          if (co) co.classList.toggle("is-on", on);
        });
        rows.forEach(function (r) {
          var on = +r.getAttribute("data-l") === n;
          r.classList.toggle("is-cur", on);
          r.classList.toggle("is-open", on);
          var h = r.querySelector(".ac-row__head");
          if (!h) return;
          h.setAttribute("aria-expanded", String(on));
          // one row is always open, so the open row's button cannot collapse it (the ARIA accordion pattern)
          if (on) h.setAttribute("aria-disabled", "true"); else h.removeAttribute("aria-disabled");
        });
      }

      // reserve(): see reserveLedger above. Re-measured whenever the text re-wraps (width, a late font,
      // the skin switch): see the ResizeObserver below.
      function reserve() { reserveLedger(ledger); }

      function at(fn, t) { timers.push(setTimeout(fn, t)); }
      function settle() {                                   // retire the entrance hooks: nothing can replay a fade
        body.classList.remove("is-armed", "is-go");
        root.classList.add("is-settled");
      }
      function finish() {                                   // jump to the resting drawing: installed, loop and ring closed
        timers.forEach(clearTimeout); timers.length = 0;
        if (io) { io.disconnect(); io = null; }
        fig.classList.remove("is-exploded", "is-unlooped");
        settle();
        done = true;
      }
      rows.forEach(function (r) {
        var h = r.querySelector(".ac-row__head");
        if (!h) return;
        h.addEventListener("click", function () {
          if (!done) finish();
          show(+r.getAttribute("data-l"));
        });
      });
      // a reader who moves into the list (Tab) takes it over: the drawing finishes where it is, and no row
      // opens or closes under their focus. (A click lands here too, then the click shows its layer.)
      ledger.addEventListener("focusin", function () { if (!done) finish(); });

      // ≤ 760px: the drawing scales to the column (the CSS reads --fs). Acts only on a width
      // change that holds for 250ms, so a brief resize (a tall capture) changes nothing.
      var mq = window.matchMedia ? window.matchMedia("(max-width: 760px)") : null;
      var fitT = 0;
      function fit() {
        if (mq && mq.matches) {
          var w = fig.getBoundingClientRect().width;
          if (w > 0) fig.style.setProperty("--fs", Math.min(1, (w - 32) / 406).toFixed(3));
        } else fig.style.removeProperty("--fs");
        reserve();
      }
      function refit() { clearTimeout(fitT); fitT = setTimeout(fit, 250); }
      fit();
      if (mq) { if (mq.addEventListener) mq.addEventListener("change", refit); else if (mq.addListener) mq.addListener(refit); }
      window.addEventListener("resize", refit);
      // the reserve follows the text, not the window: a row head or panel that re-wraps re-measures it
      // (opening and closing never changes these boxes, only their clipping wrappers)
      if ("ResizeObserver" in window) {
        var rsT = 0;
        var ro = new ResizeObserver(function () { cancelAnimationFrame(rsT); rsT = requestAnimationFrame(reserve); });
        rows.forEach(function (r) {
          [".ac-row__head", ".ac-row__in"].forEach(function (s) { var el = r.querySelector(s); if (el) ro.observe(el); });
        });
      }

      // the markup already is the final drawing: reduced motion, or a reader already inside the list
      if (reduced || ledger.contains(document.activeElement)) { done = true; root.classList.add("is-settled"); return; }

      // opening state, set without transitions: exploded, loop and ring open, 01 shown, figure hidden until it plays
      fig.classList.add("ac-cold"); detail.classList.add("ac-cold");
      body.classList.add("is-armed");
      fig.classList.add("is-exploded", "is-unlooped");
      show(1);
      void fig.getBoundingClientRect();
      fig.classList.remove("ac-cold"); detail.classList.remove("ac-cold");

      function play() {
        body.classList.add("is-go");
        // installed layer by layer: slabs drop at 500 / 3300 / 6100ms (the CSS delays), each red while it
        // lands, and its row opens with it.
        at(function () { show(2); }, 500 + STEP);
        at(function () { show(3); }, 500 + 2 * STEP);
        at(function () { fig.classList.remove("is-exploded"); }, 7300);      // the stack closes up (700ms)
        at(function () { fig.classList.remove("is-unlooped"); }, 7950);      // the return draws (1000ms); the ring closes with it
        at(function () { show(1); }, 8800);                                  // the red, and its row, land back on 01
        at(function () { done = true; timers.length = 0; settle(); }, 9500);
      }

      var home = document.documentElement.classList.contains("km-home");
      if (!home || !("IntersectionObserver" in window)) { play(); return; }
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && io) { io.disconnect(); io = null; play(); } });
      }, { threshold: 0.3 });
      io.observe(fig);
    }
  };
  if (typeof window !== "undefined") window.KM = api;

  // the reserve also holds before the section plays: a reader who lands mid-section (a reload, a jump)
  // never sees the door and the next section step down when the sequence starts
  if (typeof document !== "undefined") {
    var pre = function () { Array.prototype.forEach.call(document.querySelectorAll(".km-system-U__ledger"), reserveLedger); };
    pre();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pre);
  }
})();
