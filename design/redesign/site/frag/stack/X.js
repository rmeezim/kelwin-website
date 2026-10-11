(function () {
  /* ── stack · X · FIG. 04 STRATA ─────────────────────────────────────────
     The markup is the final state (installed pitch, 03 Orchestration selected).
     Demo: the four slabs drop in exploded (pitch 148), 01 → 04, with 01
     already red; the stack closes up to its installed pitch (112, 700ms) while
     the dimension re-measures "4 layers" → "1 system" and the title block
     reads EXPLODED → INSTALLED; then the selection steps 01 → 02 → 03
     (red face, 8px lift, callout and ledger row move together).
     Live site: plays once at 40% visible; the selection auto-steps every
     1.4s while in view and stops for good on the first click.            */
  var api = {
    init: function (root, opts) {
      var reduced = opts && opts.reduced;
      var fig = root.querySelector(".km-stack-X__fig");
      var detail = root.querySelector(".km-stack-X__detail");
      if (!fig || !detail) return;
      var slabs = root.querySelectorAll(".km-stack-X__s");
      var cos = root.querySelectorAll(".km-stack-X__co");
      var rows = root.querySelectorAll(".km-stack-X__ledger .ac-row");
      var state = root.querySelector(".km-stack-X__state");
      var timers = [];

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
      function label(on) { if (state) state.textContent = on ? "Installed" : "Exploded"; }
      function assemble(on) {
        fig.classList.toggle("is-exploded", !on);
        label(on);
      }
      function stop() { timers.forEach(clearTimeout); timers = []; }

      rows.forEach(function (r) {
        var h = r.querySelector(".ac-row__head");
        if (!h) return;
        h.addEventListener("click", function () {
          stop();
          assemble(true);
          select(+r.getAttribute("data-l"));
        });
      });

      if (reduced) return;   // the markup already is the final drawing; no timers

      // opening state, set without transitions: exploded, 01 selected
      fig.classList.add("ac-cold"); detail.classList.add("ac-cold");
      assemble(false);
      select(1);
      void fig.getBoundingClientRect();
      fig.classList.remove("ac-cold"); detail.classList.remove("ac-cold");

      timers.push(setTimeout(function () {                                // planes stack: close up 700ms,
        fig.classList.remove("is-exploded");                              // the title block reads INSTALLED
        timers.push(setTimeout(function () { label(true); }, 640));       // as the slabs land
      }, 2000));
      timers.push(setTimeout(function () { select(2); }, 3000));
      timers.push(setTimeout(function () { select(3); }, 4200));
    }
  };
  if (typeof window !== "undefined") window.KM = api;
})();
