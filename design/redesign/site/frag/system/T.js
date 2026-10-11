(function () {
  /* ── system · U · Strata, closed (round 6) ──────────────────────────────────
     The markup is the final state: installed, the return drawn, the ring on 03
     closed, 01 selected and its row open.
     One rule holds throughout: the red slab, its bright callout and the ledger's
     open row are always the same layer. show(n) moves all of them at once.
     Sequence (once, ~6.5s, a brisk skim that hands over to the reader): the three
     slabs drop in exploded (pitch 176), 01 → 03, 1.25s apart. Each lands with its
     top face red and draws its one inscription, and its ledger row opens as the
     red arrives (the previous row closes with the accordion's own 360ms ease).
     One beat after 03 lands, the stack closes up to its installed pitch (132)
     while the dimension re-measures "3 layers" → "1 system"; the one return line
     draws from slab 03 back up into slab 01, the ring on 03 closes, and the red,
     with its row, lands back on 01 as the arrow arrives, where it rests.
     Both sides are controls, kept in step by show(n): a slab (or its callout) and
     its row. Pressing either (click, tap, Enter or Space) stops the pass at once,
     finishes the drawing and shows that layer; moving into the drawing or the list
     with the keyboard stops it too, so nothing changes under focus. The pointer goes to
     the visible slab faces (the slab on top is the one pressed); the role=button hit
     layer is the keyboard stop. Hovering a slab, its callout or its row (mouse/pen)
     brightens that slab and its callout and nudges the row's title.
     Layout: the ledger reserves its tallest state (min-height) from load, so the
     section and the "Find your weakest layer" door never move, before or while
     rows open and close.
     Standalone: plays at once. Homepage (html.km-home): waits until the figure
     itself is 30% in view, then plays once. No pin, no loop, no ScrollTrigger.
     Reduced motion: the markup's final state, no timers; every control works. */
  // timing (ms after the drawing starts). The CSS entrance delays (slab drops, inscriptions, callouts, the
  // dimension) are written against the same beats: drops at T1, T1 + STEP, T1 + 2 * STEP.
  var T1 = 500;                                      // slab 01 drops
  var STEP = 1250;                                   // the red's dwell on each layer during the pass
  var CLOSE = T1 + 3 * STEP;                         // 4250: one beat after 03, the stack closes up (700ms)
  var LOOP = CLOSE + 650;                            // 4900: the return draws (1000ms); the ring closes 800–1300ms in
  var HOME = LOOP + 850;                             // 5750: the arrow lands, the red and its row return to 01
  var REST = HOME + 700;                             // 6450: settled, nothing left to run

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
      var body = root.querySelector(".km-system-T__body");
      var fig = root.querySelector(".km-system-T__fig");
      var detail = root.querySelector(".km-system-T__detail");
      var ledger = root.querySelector(".km-system-T__ledger");
      if (!body || !fig || !detail || !ledger) return;
      var slabs = root.querySelectorAll(".km-system-T__s");
      var cos = root.querySelectorAll(".km-system-T__co");
      var rows = root.querySelectorAll(".km-system-T__ledger .ac-row");
      var hits = root.querySelectorAll(".km-system-T__hit");
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
        // the open row's control, in the list and in the drawing: expanded, and it cannot collapse it
        // (one row is always open: the ARIA accordion pattern)
        function expand(h, on) {
          h.setAttribute("aria-expanded", String(on));
          if (on) h.setAttribute("aria-disabled", "true"); else h.removeAttribute("aria-disabled");
        }
        rows.forEach(function (r) {
          var on = +r.getAttribute("data-l") === n;
          r.classList.toggle("is-cur", on);
          r.classList.toggle("is-open", on);
          var h = r.querySelector(".ac-row__head");
          if (h) expand(h, on);
        });
        hits.forEach(function (h) {
          var on = +h.getAttribute("data-l") === n;
          h.classList.toggle("is-on", on);
          expand(h, on);
        });
      }
      // live(n): during the pass a slab (and its callout) takes the pointer once it has landed
      function live(n) {
        slabs.forEach(function (s) { if (+s.getAttribute("data-l") <= n) s.classList.remove("is-wait"); });
        cos.forEach(function (c) { if (+c.getAttribute("data-l") <= n) c.classList.remove("is-wait"); });
      }
      // hover(n, on): the slab's outline comes up to paper, its callout brightens and its row's title takes the
      // kit's 6px hover nudge, from whichever of the three the pointer is on
      function hover(n, on) {
        slabs.forEach(function (s) { if (+s.getAttribute("data-l") === n) s.classList.toggle("is-hover", on); });
        rows.forEach(function (r) { if (+r.getAttribute("data-l") === n) r.classList.toggle("is-hover", on); });
        cos.forEach(function (c) {
          var co = c.querySelector(".ac-callout");
          if (co && +c.getAttribute("data-l") === n) co.classList.toggle("is-hover", on);
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
      function finish() {                                   // stop the pass; jump to the resting drawing: installed, loop and ring closed
        timers.forEach(clearTimeout); timers.length = 0;
        if (io) { io.disconnect(); io = null; }
        fig.classList.remove("is-exploded", "is-unlooped");
        live(3);
        settle();
        done = true;
      }
      // activate(n): any press, on either side, stops the pass and shows that layer
      function activate(n) { if (!done) finish(); show(n); }
      function hoverable(el, n) {                           // mouse and pen only: a tap must not leave a hover behind
        el.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") hover(n, true); });
        el.addEventListener("pointerleave", function () { hover(n, false); });
      }
      rows.forEach(function (r) {
        var h = r.querySelector(".ac-row__head");
        if (!h) return;
        var n = +r.getAttribute("data-l");
        h.addEventListener("click", function () { activate(n); });
        hoverable(h, n);
      });
      // the slabs, pointer and touch: the visible faces take the press, so the slab on top is the one pressed
      slabs.forEach(function (s) {
        var n = +s.getAttribute("data-l");
        s.addEventListener("click", function () { activate(n); });
        hoverable(s, n);
      });
      // the slabs, keyboard and assistive tech: role=button on the hit layer (Enter on keydown, Space on keyup, as a
      // native button; click covers a screen reader's activation)
      hits.forEach(function (h) {
        var n = +h.getAttribute("data-l");
        h.addEventListener("click", function () { activate(n); });
        h.addEventListener("keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); activate(n); }
          else if (e.key === " " || e.key === "Spacebar") e.preventDefault();      // no page scroll
        });
        h.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); activate(n); } });
      });
      // a slab's callout is part of it (pointer only: the slab is the keyboard stop)
      cos.forEach(function (c) {
        var co = c.querySelector(".ac-callout");
        if (!co) return;
        var n = +c.getAttribute("data-l");
        co.addEventListener("click", function () { activate(n); });
        hoverable(co, n);
      });
      // a reader who moves into the drawing or the list (Tab, or the focus a press gives) takes it over: the pass
      // stops where it is, and nothing opens or closes under their focus. (A click lands here first, then shows.)
      ledger.addEventListener("focusin", function () { if (!done) finish(); });
      fig.addEventListener("focusin", function () { if (!done) finish(); });

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
      if (reduced || ledger.contains(document.activeElement) || fig.contains(document.activeElement)) { done = true; root.classList.add("is-settled"); return; }

      // opening state, set without transitions: exploded, loop and ring open, 01 shown, figure hidden until it
      // plays, and no slab takes the pointer before it has landed
      fig.classList.add("ac-cold"); detail.classList.add("ac-cold");
      body.classList.add("is-armed");
      fig.classList.add("is-exploded", "is-unlooped");
      slabs.forEach(function (s) { s.classList.add("is-wait"); });
      cos.forEach(function (c) { c.classList.add("is-wait"); });
      show(1);
      void fig.getBoundingClientRect();
      fig.classList.remove("ac-cold"); detail.classList.remove("ac-cold");

      function play() {
        body.classList.add("is-go");
        // installed layer by layer: slabs drop at 500 / 1750 / 3000ms (the CSS delays), each red while it
        // lands, and its row opens with it.
        at(function () { live(1); }, T1);
        at(function () { show(2); live(2); }, T1 + STEP);
        at(function () { show(3); live(3); }, T1 + 2 * STEP);
        at(function () { fig.classList.remove("is-exploded"); }, CLOSE);     // the stack closes up (700ms)
        at(function () { fig.classList.remove("is-unlooped"); }, LOOP);      // the return draws (1000ms); the ring closes with it
        at(function () { show(1); }, HOME);                                  // the red, and its row, land back on 01
        at(function () { done = true; timers.length = 0; settle(); }, REST);
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
    var pre = function () { Array.prototype.forEach.call(document.querySelectorAll(".km-system-T__ledger"), reserveLedger); };
    pre();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pre);
  }
})();
