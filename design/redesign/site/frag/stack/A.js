/* stack · A · FIG. 04 — four nested pieces, exploded along the mark's own diagonal.
   Geometry = the founder's master mark (brand/kelwin-mark.svg, three heavy pieces in a
   152u box) extended ONE nested step outward at the same bar / channel proportions,
   because the stack genuinely has four layers. It is a figure, not the logo.
   One function drives the static markup (final state: L3 selected) and every state
   change, so plates, leaders, callouts and red always agree.                       */
(function () {
  var U = 1.26;           // px per mark unit
  var D = 8;              // explode step per layer (on top of the mark's own 15u channel)
  var E = 12;             // extra channel opened on both sides of the selected layer
  var TOP = 40;           // plate px above the drawing
  var OMAX = 3 * D + 2 * E;
  var OX = 620;           // plate px of the core's left edge (fixed anchor)
  var OY = TOP + OMAX * U;
  var CO_X = 24;          // callouts hang from the plate's left edge
  // four nested pieces in mark units (K2–K4 = the master's three pieces, offset 60u down;
  // K1 = one more outer corner: bars 45u / 44u, channel 15u, exactly like the master)
  var SHAPE = {
    1: [[0, 0], [211, 0], [211, 212], [167, 212], [167, 45], [0, 45]],
    2: [[0, 60], [152, 60], [152, 212], [108, 212], [108, 105], [0, 105]],
    3: [[0, 120], [94, 120], [94, 212], [55, 212], [55, 158], [0, 158]],
    4: [[0, 174], [42, 174], [42, 212], [0, 212]]
  };
  var BAND = { 1: 22.5, 2: 82.5, 3: 139, 4: 193 };   // mid-height of each piece's left end

  function offs(L) {                     // explode offset (mark units) of every piece when L is selected
    var s = 4 - L, o = {};
    for (var i = 0; i < 4; i++) {
      var v = i * D;
      for (var j = 1; j <= i; j++) if (j === s || j - 1 === s) v += E;
      o[4 - i] = v;
    }
    return o;
  }
  function px(n) { return Math.round(n * 2) / 2; }
  function shapePath(k) {                // drawn at the final (L3-selected) offset
    var o = offs(3)[k];
    return "M" + SHAPE[k].map(function (p) { return px(OX + (p[0] + o) * U) + " " + px(OY + (p[1] - o) * U); }).join("L") + "Z";
  }
  function tip(k, L) {                   // the left end of piece k in state L (where its leader lands)
    var o = offs(L)[k];
    return { x: Math.round(OX + o * U), y: Math.floor(OY + (BAND[k] - o) * U) + 0.5 };
  }
  function shift(k, L) {                 // piece translate relative to the final (L3) markup
    var d = (offs(L)[k] - offs(3)[k]) * U;
    return "translate(" + px(d) + "px, " + px(-d) + "px)";
  }
  function coStyle(k, L) {               // callout: key row centred on the leader, leader runs to the piece
    var t = tip(k, L), f = tip(k, 3);
    return { top: f.y - 8.5, width: t.x - CO_X, dy: t.y - f.y };
  }
  function svg(L) {
    var s = "";
    for (var k = 1; k <= 4; k++) {
      s += '<g class="km-stack-A__in" data-l="' + k + '"><g class="km-stack-A__k' + (k === L ? " is-sel" : "") + '" data-l="' + k +
           '" style="transform: ' + shift(k, L) + '"><path d="' + shapePath(k) + '"/></g></g>';
    }
    return s;
  }

  window.KM = {
    geom: { svg: svg, coStyle: coStyle },
    init: function (root, opt) {
      if (!root) return;
      var plate = root.querySelector(".km-stack-A__plate");
      var ks = root.querySelectorAll(".km-stack-A__k");
      var cos = root.querySelectorAll(".km-stack-A__co");
      var tabs = root.querySelectorAll(".km-stack-A__seg button");
      var strips = root.querySelectorAll(".km-stack-A__strip");
      function apply(L) {
        plate.setAttribute("data-sel", L);
        Array.prototype.forEach.call(ks, function (g) {
          var l = +g.getAttribute("data-l");
          g.style.transform = shift(l, L);
          g.classList.toggle("is-sel", l === L);
        });
        Array.prototype.forEach.call(cos, function (c) {
          var st = coStyle(+c.getAttribute("data-l"), L);
          c.style.width = st.width + "px";
          c.style.transform = "translateY(" + st.dy + "px)";
        });
        [cos, strips].forEach(function (list) {
          Array.prototype.forEach.call(list, function (el) { el.classList.toggle("is-sel", +el.getAttribute("data-l") === L); });
        });
        Array.prototype.forEach.call(tabs, function (b) {
          var on = +b.getAttribute("data-l") === L;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
      }
      Array.prototype.forEach.call(tabs, function (b) {
        b.addEventListener("click", function () { apply(+b.getAttribute("data-l")); });
      });
      if (opt && opt.reduced) return;          // reduced motion: the static final state (L3) stays
      // demo: assemble with the core (L4 · Intelligence) installed in red, then advance once to Orchestration.
      plate.classList.add("is-snap");
      apply(4);
      void plate.offsetWidth;
      plate.classList.remove("is-snap");
      setTimeout(function () { apply(3); }, 2400);
    }
  };
})();
