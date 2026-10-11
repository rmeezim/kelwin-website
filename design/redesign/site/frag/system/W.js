/* system · W — FIG. 03 Strata, assembled by scroll.
   One step function drives everything:
     step 0  the empty frame; the three ledger rows wait, closed
     step 1  slab 01 drops in, red (being installed); row 01 opens
     step 2  slab 02 drops in, red moves to it; row 02 opens
     step 3  slab 03 drops in, red moves to it; row 03 opens; the bracket reads "3 layers"
     step 4  the stack closes up; the red leaves the slabs and is inked over the bracket as
             the one return path (03 → 01); the ring on 03 closes; the bracket reads "1 system"
   · homepage (html.km-home, wide, motion on): a tall track with a sticky stage; the step is
     picked from the scroll position (no ScrollTrigger pin: it breaks under the prototype's
     page zoom). Scrolling back reverses.
   · standalone mockup: plays steps 1–4 once by itself, done in about 6s, then rests.
   · reduced motion and ≤ 760px: the markup is already the assembled state.
   The ledger stays a control: a click opens that row (and brightens its callout).          */
(function () {
  "use strict";
  var P = "km-system-W";
  var DEMO = [900, 1900, 2900, 3900];          // standalone: step 1–4 start times (ms)
  var TH = [-320, 240, 540, 840];              // homepage: pinned-scroll units where steps 1–4 begin
  var PIN = 1200;                              // pinned scroll distance (matches --sys-pin)

  function setup(root, reduced) {
    if (!root || root.__kmW) return;
    root.__kmW = true;
    var home = document.documentElement.classList.contains("km-home");
    var narrowMQ = window.matchMedia ? window.matchMedia("(max-width: 760px)") : { matches: false };
    var fig = root.querySelector("." + P + "__fig");
    var track = root.querySelector("." + P + "__track");
    var stage = root.querySelector("." + P + "__stage");
    var body = root.querySelector("." + P + "__body");
    var state = root.querySelector("." + P + "__state");
    var slabs = toArr(root.querySelectorAll("." + P + "__s"));
    var cos = toArr(root.querySelectorAll("." + P + "__co"));
    var rows = toArr(root.querySelectorAll("." + P + "__ledger .ac-row"));
    var cur = 4, stateT = null, handT = null, timers = [], mode = null, ticking = false, played = false;

    function toArr(l) { return Array.prototype.slice.call(l); }
    function L(el) { return +el.getAttribute("data-l"); }

    /* the ledger: one row open; its callout brightens */
    function open(k) {
      rows.forEach(function (r) {
        var on = L(r) === k;
        r.classList.toggle("is-open", on);
        var h = r.querySelector(".ac-row__head");
        if (h) h.setAttribute("aria-expanded", String(on));
      });
      cos.forEach(function (c) { var co = c.querySelector(".ac-callout"); if (co) co.classList.toggle("is-on", L(c) === k); });
    }

    function step(n, instant) {
      if (n === cur && !instant) return;
      cur = n;
      if (instant) root.classList.add("ac-cold");
      slabs.forEach(function (s) {
        var k = L(s);
        s.classList.toggle("is-in", k <= n);
        s.classList.toggle("is-on", k === n && n <= 3);
      });
      cos.forEach(function (c) {
        var k = L(c);
        c.classList.toggle("is-in", k <= n);
        c.classList.toggle("is-on", k === n && n <= 3);
      });
      rows.forEach(function (r) {
        var k = L(r);
        r.classList.toggle("is-pending", k > n);
        r.classList.toggle("is-cur", k === n && n <= 3);
      });
      open(n === 0 ? 0 : Math.min(n, 3));       // at rest (step 4) row 03 stays open: the return leaves from it
      // the hand-off: the red drains from 03's face as the return starts from its corner
      clearTimeout(handT);
      if (n === 4 && !instant) { root.classList.add("is-handoff"); handT = setTimeout(function () { root.classList.remove("is-handoff"); }, 1300); }
      else root.classList.remove("is-handoff");
      fig.classList.toggle("is-exploded", n < 4);
      fig.classList.toggle("is-closed", n >= 4);
      fig.classList.toggle("has-dim", n >= 3);
      // the title block's state cell changes as the slabs land
      clearTimeout(stateT);
      var label = n >= 4 ? "Installed" : "Exploded";
      if (instant || n < 4) { if (state) state.textContent = label; }
      else stateT = setTimeout(function () { if (state) state.textContent = label; }, 640);
      if (instant) { void root.offsetHeight; root.classList.remove("ac-cold"); }
    }

    function stop() { timers.forEach(clearTimeout); timers = []; }

    /* phones: scale the stack's own extent (480 wide) to the column */
    function fit() {
      if (narrowMQ.matches) root.style.setProperty("--fs", String(Math.min(1, Math.round(fig.clientWidth / 480 * 1000) / 1000)));
      else root.style.removeProperty("--fs");
    }

    /* ── the pin (homepage) ── */
    function measure() {
      ticking = false;
      if (mode !== "pin") return;
      var r = track.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      var range = r.height - sr.height;
      if (range <= 0) return;
      var d = (-r.top / range) * PIN;
      var n = 0;
      while (n < 4 && d >= TH[n]) n++;
      step(n);
    }
    function sizeStage() {
      if (mode !== "pin") return;
      body.style.transform = "";
      var bh = body.offsetHeight;
      root.style.setProperty("--sys-body-h", bh + "px");
      var s = Math.min(1, (stage.clientHeight - 48) / bh);
      body.style.transform = s < 1 ? "scale(" + Math.round(s * 1000) / 1000 + ")" : "";
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(measure); } }

    function setMode() {
      var next = reduced || narrowMQ.matches ? "rest" : home ? "pin" : played ? "rest" : "demo";
      if (next === mode) return;
      stop();
      mode = next;
      root.classList.toggle("is-pinned", mode === "pin");
      root.classList.toggle("is-live", mode !== "rest");
      fit();
      if (mode === "rest") { body.style.transform = ""; step(4, true); return; }
      if (mode === "pin") { step(0, true); sizeStage(); measure(); return; }
      // demo: from the empty frame, the four steps in order, done in about 6s (plays once per load)
      played = true;
      step(0, true);
      DEMO.forEach(function (t, i) { timers.push(setTimeout(function () { step(i + 1); }, t)); });
    }

    rows.forEach(function (r) {
      var h = r.querySelector(".ac-row__head");
      if (!h) return;
      h.addEventListener("click", function () {
        if (mode === "demo") { stop(); step(4); }    // a click ends the demo on the assembled drawing
        open(L(r));
      });
    });

    setMode();
    // entrance hooks retire once played, so a resize or a tall capture can never replay them
    if (!reduced && !home) setTimeout(function () { root.classList.add("is-settled"); }, 2600);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { fit(); sizeStage(); onScroll(); });
    // tall page captures briefly re-evaluate the ≤ 760px query: act only on a change that holds
    var mqT = null;
    function onMQ() { clearTimeout(mqT); mqT = setTimeout(setMode, 250); }
    if (narrowMQ.addEventListener) narrowMQ.addEventListener("change", onMQ);

    // homepage entrance: the section plays its own head choreography as it arrives (the page
    // player waits until 22% of this very tall section is visible, which would flash the head)
    if (home && !reduced && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          root.classList.add("is-play"); io.disconnect();
          setTimeout(function () { root.classList.add("is-settled"); }, 2600);
        });
      }, { rootMargin: "0px 0px -6% 0px" });
      io.observe(root);
    }
  }

  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // on the homepage the section arms itself at once, so the pin is ready before it is reached
  if (document.documentElement.classList.contains("km-home")) setup(document.querySelector("." + P), RM);

  window.KM = { init: function (root, opts) { setup(root, !!(opts && opts.reduced)); } };
})();
