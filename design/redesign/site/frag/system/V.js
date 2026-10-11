(function () {
  /* ── system · V · Faithful strata ─────────────────────────────────────────
     The markup is the final state: installed, the return drawn, 01 selected.
     Sequence (once): the three slabs drop in exploded (pitch 176), 01 → 03,
     with 01 already red, and each draws its one inscription; the stack closes
     up to its installed pitch (132) while the dimension re-measures
     "3 layers" → "1 system"; the red steps down 01 → 02 → 03; then the one
     return line draws from slab 03 back up into slab 01 and the red arrives
     back on 01. Pressing a ledger row finishes the drawing at once and moves
     the red (and an 8px lift) to that slab.
     Standalone: plays at once. Homepage (html.km-home): waits until the
     figure itself is 45% in view, then plays once. No pin, no loop.        */
  var api = {
    init: function (root, opts) {
      var reduced = opts && opts.reduced;
      var body = root.querySelector(".km-system-V__body");
      var fig = root.querySelector(".km-system-V__fig");
      var detail = root.querySelector(".km-system-V__detail");
      if (!body || !fig || !detail) return;
      var slabs = root.querySelectorAll(".km-system-V__s");
      var cos = root.querySelectorAll(".km-system-V__co");
      var rows = root.querySelectorAll(".km-system-V__ledger .ac-row");
      var state = root.querySelector(".km-system-V__state");
      var timers = [];
      var done = false;
      var io = null;

      function select(n) {
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
          r.classList.toggle("is-open", on);
          var h = r.querySelector(".ac-row__head");
          if (h) h.setAttribute("aria-expanded", String(on));
        });
      }
      function label(installed) { if (state) state.textContent = installed ? "Installed" : "Exploded"; }
      function stop() { timers.forEach(clearTimeout); timers = []; }
      function finish() {                                   // the resting drawing: installed, loop closed
        stop();
        fig.classList.remove("is-exploded");
        fig.classList.remove("is-unlooped");
        label(true);
        if (!body.classList.contains("is-go")) body.classList.remove("is-armed");   // pressed before it played: show it at rest
        if (io) io.disconnect();
        done = true;
      }

      rows.forEach(function (r) {
        var h = r.querySelector(".ac-row__head");
        if (!h) return;
        h.addEventListener("click", function () {
          if (!done) finish();
          select(+r.getAttribute("data-l"));
        });
      });

      // ≤ 760px: the drawing scales to the column (the CSS reads --fs)
      function fit() {
        if (!window.matchMedia || !window.matchMedia("(max-width: 760px)").matches) { fig.style.removeProperty("--fs"); return; }
        var w = fig.getBoundingClientRect().width;
        if (w > 0) fig.style.setProperty("--fs", Math.min(1, w / 420).toFixed(3));
      }
      fit();
      window.addEventListener("resize", fit);

      if (reduced) { done = true; return; }   // the markup already is the final drawing; no timers

      // opening state, set without transitions: exploded, loop open, 01 selected, figure hidden until it plays
      fig.classList.add("ac-cold"); detail.classList.add("ac-cold");
      body.classList.add("is-armed");
      fig.classList.add("is-exploded", "is-unlooped");
      label(false);
      select(1);
      void fig.getBoundingClientRect();
      fig.classList.remove("ac-cold"); detail.classList.remove("ac-cold");

      function play() {
        body.classList.add("is-go");
        timers.push(setTimeout(function () {                    // planes stack: close up 700ms
          fig.classList.remove("is-exploded");
          timers.push(setTimeout(function () { label(true); }, 640));
        }, 2200));
        timers.push(setTimeout(function () { select(2); }, 3050));   // the red steps down the stack
        timers.push(setTimeout(function () { select(3); }, 3850));
        timers.push(setTimeout(function () { fig.classList.remove("is-unlooped"); }, 4500));   // the return draws (1000ms)
        timers.push(setTimeout(function () { select(1); done = true; }, 5350));              // and lands the red back on 01
      }

      var home = document.documentElement.classList.contains("km-home");
      if (!home || !("IntersectionObserver" in window)) { play(); return; }
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); play(); } });
      }, { threshold: 0.45 });
      io.observe(fig);
    }
  };
  if (typeof window !== "undefined") window.KM = api;
})();
