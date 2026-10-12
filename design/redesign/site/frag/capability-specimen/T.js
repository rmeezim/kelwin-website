/* capability-specimen · T — the Orchestration Rules sheet. Each rule row is a real button
   (aria-pressed, one pressed at a time); hovering or focusing a rule previews its route on the
   small TRACE, choosing it keeps it (and moves the sheet's one red, the index square, to it).
   Rule 2 rests chosen. The drawing is decorative (aria-hidden); every rule's text is always
   visible. The static HTML holds rule 2's route, generated from KM.geo().                    */
(function () {
  var P = { S: [20, 120], M: [110, 120], C: [200, 120], R: [290, 120], H: [370, 120], N: [290, 36], W: [370, 204], O: [200, 204] };
  // each rule: its route (orthogonal subpaths) and the nodes it touches
  var RULES = {
    1: { d: "M20 120H370M290 120V204H370", n: "SMCRHW" },
    2: { d: "M20 120H290V36H370V120M290 120V204H370", n: "SMCRNHW" },
    3: { d: "M200 120H290V36H370V120M290 120V204H370", n: "CRNHW" },
    4: { d: "M20 120H290V36M290 120V204H370", n: "SMCRNW" },
    5: { d: "M370 120H290V204H200", n: "HRO" }
  };
  function off(d) { return d.replace(/([MHVL])(\d+(?:\.\d+)?)(?: (\d+(?:\.\d+)?))?/g, function (m, c, a, b) { return c + (+a + .5) + (b !== undefined ? " " + (+b + .5) : ""); }); }
  function geo() {
    var o = { act: { d: off(RULES[2].d) }, all: { d: off("M20 120H370M290 120V36H370V120M290 120V204H370M290 204H200") } };
    return o;
  }
  window.KM = {
    geo: geo,
    init: function (root, opts) {
      if (!root) return function () {};
      var reduced = !!(opts && opts.reduced);
      var btns = root.querySelectorAll(".km-capability-specimen-T__rule");
      var act = root.querySelector(".km-capability-specimen-T__act");
      var nodes = root.querySelectorAll(".km-capability-specimen-T__nd");
      var lab = root.querySelector(".km-capability-specimen-T__which");
      if (!btns.length || !act) return function () {};
      var chosen = "2", offs = [];
      function plot(r, animate) {
        var R = RULES[r]; if (!R) return;
        act.setAttribute("d", off(R.d));
        nodes.forEach(function (n) { n.classList.toggle("is-on", R.n.indexOf(n.getAttribute("data-n")) >= 0); });
        if (lab) lab.textContent = "Rule " + r;
        if (animate && !reduced) { act.classList.remove("is-draw"); void act.getBoundingClientRect(); act.classList.add("is-draw"); }
      }
      function choose(r) {
        chosen = r;
        btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-r") === r)); });
        plot(r, true);
      }
      btns.forEach(function (b) {
        var r = b.getAttribute("data-r");
        function click() { choose(r); }
        function enter() { if (r !== chosen) plot(r, true); }
        function leave() { if (r !== chosen) plot(chosen, false); }
        b.addEventListener("click", click); b.addEventListener("mouseenter", enter); b.addEventListener("focus", enter);
        b.addEventListener("mouseleave", leave); b.addEventListener("blur", leave);
        offs.push(function () {
          b.removeEventListener("click", click); b.removeEventListener("mouseenter", enter); b.removeEventListener("focus", enter);
          b.removeEventListener("mouseleave", leave); b.removeEventListener("blur", leave);
        });
      });
      plot(chosen, false);
      return function () { offs.forEach(function (f) { f(); }); };
    }
  };
})();
