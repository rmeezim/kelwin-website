/* assets · A · FIG. 08 — Installed ⇄ Handed over.
   The markup is the final state: every part seated in its numbered cut-out in
   the tray. 'Installed' slides the five solid parts onto the assembly drawing
   (part 06) so they nest as the running mark; the empty seats stay behind.
   Every piece sits in the tray at its own height in the mark, and parts and
   drawing share one scale (1.5 px per mark unit), so each part only slides
   sideways along its row, onto whole-pixel edges. */
(function () {
  // offset from each part's seat in the tray to its place in the assembled mark (px)
  var NEST = { 1: [994, 0], 2: [970, 0], 3: [549, 0], 4: [525, 0], 5: [103, 0] };
  window.KM = {
    init: function (root, opt) {
      if (!root) return;
      var plate = root.querySelector(".km-assets-A__plate");
      var parts = root.querySelectorAll(".km-assets-A__p");
      var segs = root.querySelectorAll(".km-assets-A__seg");
      var timer = null;
      function apply(state) {
        plate.setAttribute("data-state", state);
        Array.prototype.forEach.call(parts, function (g) {
          var d = NEST[g.getAttribute("data-p")];
          g.style.transform = state === "installed" && d ? "translate(" + d[0] + "px, " + d[1] + "px)" : "";
        });
        Array.prototype.forEach.call(segs, function (b) {
          b.setAttribute("aria-selected", b.getAttribute("data-state") === state ? "true" : "false");
        });
      }
      Array.prototype.forEach.call(segs, function (b) {
        b.addEventListener("click", function () { clearTimeout(timer); apply(b.getAttribute("data-state")); });
      });
      if (opt && opt.reduced) return;            // reduced motion: the static final state (Handed over)
      // demo: the mark assembles on its drawing as the running system, then is handed over once.
      plate.classList.add("is-snap");
      apply("installed");
      void plate.getBoundingClientRect();
      plate.classList.remove("is-snap");
      timer = setTimeout(function () { apply("handed"); }, 2500);
    }
  };
})();
