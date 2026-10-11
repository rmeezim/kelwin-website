(function () {
  /* ── reframe · X · LATTICE section cut ──────────────────────────────────
     One true-isometric drawing. The SURFACE is a 12×6 lattice floating just
     above the cut; the ARCHITECTURE is the cut itself: one deep block whose
     long face is divided into three bays (x 0–4 · 4–8 · 8–12), each bay
     directly beneath the symptom that sits on the same span of the surface.
     Surface state = the lattice is warped (displaced vertices, three bulges,
     five missing members) over the dashed, unseen architecture.
     Architecture state = every vertex interpolates to the true grid, the cut
     plots solid bay by bay (left → right, the reading order), and the red
     datum, one straight line, seats along the top of the real layer.
     Geometry is seeded, so every render is identical.                     */
  var C = 26, W = 12, D = 6, DEEP = 96, LIFT = 30, OX = 740, OY = 64;
  var BAYS = [0, 4, 8, 12];                       // bay boundaries along x
  var CX = C * Math.cos(Math.PI / 6), CY = C * 0.5;
  function P(x, y, z) { return [OX + (x - y) * CX, OY + (x + y) * CY - z]; }
  function f(n) { return (Math.round(n * 10) / 10).toString(); }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* three symptom bulges on the back edge, one over the middle of each bay
     (x = 2 · 6 · 10, where the tags pin), plus one sag */
  var BULGE = [
    { i: 2, j: 0.4, h: 24, r: 1.3 }, { i: 6, j: 0.4, h: 18, r: 1.2 },
    { i: 10, j: 0.4, h: 22, r: 1.3 }, { i: 5.5, j: 4.6, h: -16, r: 1.7 }
  ];
  /* members missing from the warped lattice: [kind, line, segment start] */
  var GAPS = [["x", 2, 4], ["x", 4, 8], ["y", 9, 2], ["y", 3, 3], ["y", 6, 1]];

  function geo() {
    var rnd = mulberry32(20261008), T = [], Wp = [];
    for (var i = 0; i <= W; i++) {
      T[i] = []; Wp[i] = [];
      for (var j = 0; j <= D; j++) {
        T[i][j] = P(i, j, LIFT);
        var dx = 0.2 * Math.sin(0.85 * j + 0.5 * i + 0.9) + (rnd() - 0.5) * 0.16;
        var dy = 0.18 * Math.cos(0.65 * i - 0.45 * j + 0.3) + (rnd() - 0.5) * 0.16;
        var z = 8 * Math.sin(0.75 * i + 0.4) * Math.cos(0.8 * j + 1.2);
        for (var b = 0; b < BULGE.length; b++) {
          var q = BULGE[b];
          z += q.h * Math.exp(-((i - q.i) * (i - q.i) + (j - q.j) * (j - q.j)) / (2 * q.r * q.r));
        }
        Wp[i][j] = P(i + dx, j + dy, LIFT + z);
      }
    }
    return { T: T, Wp: Wp };
  }
  function isGap(k, line, s) {
    for (var g = 0; g < GAPS.length; g++) if (GAPS[g][0] === k && GAPS[g][1] === line && GAPS[g][2] === s) return true;
    return false;
  }
  /* lattice paths for a vertex set V[i][j] = [x, y] */
  function mesh(V) {
    var out = [], i, j, d, p;
    for (j = 0; j <= D; j++) {                          // x-lines (left → right)
      d = "";
      for (i = 0; i <= W; i++) { p = V[i][j]; d += (i === 0 || isGap("x", j, i - 1) ? "M" : "L") + f(p[0]) + " " + f(p[1]); }
      out.push(d);
    }
    for (i = 0; i <= W; i++) {                          // y-lines (back → front)
      d = "";
      for (j = 0; j <= D; j++) { p = V[i][j]; d += (j === 0 || isGap("y", i, j - 1) ? "M" : "L") + f(p[0]) + " " + f(p[1]); }
      out.push(d);
    }
    var g = "";
    for (var k = 0; k < GAPS.length; k++) {
      var G = GAPS[k], a, c;
      if (G[0] === "x") { a = V[G[2]][G[1]]; c = V[G[2] + 1][G[1]]; } else { a = V[G[1]][G[2]]; c = V[G[1]][G[2] + 1]; }
      g += "M" + f(a[0]) + " " + f(a[1]) + "L" + f(c[0]) + " " + f(c[1]);
    }
    return { lines: out, gaps: g };
  }
  function L() { var s = ""; for (var k = 0; k < arguments.length; k++) s += (k ? "L" : "M") + f(arguments[k][0]) + " " + f(arguments[k][1]); return s; }
  /* the static parts of the drawing (used by the generator for the final-state markup) */
  function statics() {
    var B = function (z) { return P(0, D, z); }, Cc = function (z) { return P(W, D, z); }, A = function (z) { return P(W, 0, z); };
    var deep = -DEEP, s = {};
    s.ghost = L(P(0, 0, LIFT), P(W, 0, LIFT), P(W, D, LIFT), P(0, D, LIFT)) + "Z";
    s.hidden = L(B(0), B(deep), Cc(deep), A(deep), A(0)) + L(Cc(0), Cc(deep)) + L(B(0), Cc(0), A(0));
    // outline: three verticals, the base, and the short top edge (the long top edge is the datum)
    s.edges = [L(B(0), B(deep)), L(Cc(0), Cc(deep)), L(A(0), A(deep)), L(B(deep), Cc(deep), A(deep)), L(Cc(0), A(0))];
    s.drops = L(B(LIFT), B(0)) + L(Cc(LIFT), Cc(0)) + L(A(LIFT), A(0)); // surface seated over the datum
    s.bays = [];                                                          // the two bay dividers
    for (var b = 1; b < BAYS.length - 1; b++) s.bays.push(L(P(BAYS[b], D, 0), P(BAYS[b], D, deep)));
    var cells = "";
    for (var i = 1; i < W; i++) if (BAYS.indexOf(i) < 0) cells += L(P(i, D, 0), P(i, D, deep));
    for (var j = 1; j < D; j++) cells += L(P(W, j, 0), P(W, j, deep));
    s.cells = cells;
    s.datum = L(B(0), Cc(0));                                             // one straight line
    // callout anchors: the bays (lower part, mid-span) and the symptom vertices on the warped back edge
    s.bayAnchors = [];
    for (b = 0; b < BAYS.length - 1; b++) s.bayAnchors.push(P((BAYS[b] + BAYS[b + 1]) / 2, D, deep + 16));
    var G = geo();
    s.tagAnchors = [G.Wp[2][0], G.Wp[6][0], G.Wp[10][0]];
    s.dims = { surface: [A(LIFT), A(0)], arch: [A(0), A(deep)] };
    s.A = A(0); s.B = B(0); s.C = Cc(0); s.bottom = Cc(deep);
    return s;
  }

  var api = {
    geo: geo, mesh: mesh, statics: statics, P: P,
    init: function (root, opts) {
      var reduced = opts && opts.reduced;
      var fig = root.querySelector(".km-reframe-X__fig");
      if (!fig) return;
      var segs = root.querySelectorAll(".km-reframe-X__seg > button");
      var paths = fig.querySelectorAll(".km-reframe-X__m");
      var gapPath = fig.querySelector(".km-reframe-X__gaps");
      var G = geo(), t = 1, raf = 0;

      function draw(k) {
        var V = [];
        for (var i = 0; i <= W; i++) {
          V[i] = [];
          for (var j = 0; j <= D; j++) {
            var a = G.Wp[i][j], b = G.T[i][j];
            V[i][j] = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
          }
        }
        var m = mesh(V);
        for (var n = 0; n < paths.length; n++) paths[n].setAttribute("d", m.lines[n]);
        gapPath.setAttribute("d", m.gaps);
      }
      function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }  // --ease-inout
      function morph(to, ms, delay) {
        cancelAnimationFrame(raf);
        var from = t, t0 = 0;
        if (reduced || ms <= 0) { t = to; draw(t); return; }
        function step(now) {
          if (!t0) t0 = now + (delay || 0);
          var x = Math.min(Math.max((now - t0) / ms, 0), 1);
          t = from + (to - from) * ease(x);
          draw(t);
          if (x < 1) raf = requestAnimationFrame(step);
        }
        raf = requestAnimationFrame(step);
      }
      function set(state, instant) {
        var surf = state === "surface";
        if (instant || reduced) fig.classList.add("ac-cold");
        fig.classList.toggle("is-surface", surf);
        segs.forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-state") === state)); });
        // warp ↔ true: the lattice resolves in 1300ms (100ms after the tags lift); it warps back faster
        morph(surf ? 0 : 1, instant ? 0 : (surf ? 900 : 1300), surf ? 0 : 100);
        if (instant || reduced) { void fig.getBoundingClientRect(); fig.classList.remove("ac-cold"); }
      }

      segs.forEach(function (b) {
        b.addEventListener("click", function () { set(b.getAttribute("data-state"), false); });
      });

      if (reduced) { set("arch", true); return; }

      // Demo: the plate opens on SURFACE (the warped lattice, three symptom tags pinned to its
      // bulges, the architecture only dashed beneath it) and advances once to ARCHITECTURE at 2.6s,
      // once all three tags have landed. On the live site the same switch fires once, ≈ 1.8s after
      // the plate is 50% visible, and never again after the first click on the control.
      set("surface", true);
      var auto = setTimeout(function () { set("arch", false); }, 2600);
      segs.forEach(function (b) { b.addEventListener("click", function () { clearTimeout(auto); }); });
    }
  };
  if (typeof window !== "undefined") window.KM = api;
  if (typeof module !== "undefined") module.exports = api;
})();
