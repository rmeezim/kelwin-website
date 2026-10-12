/* capability-head · T · GTM Infrastructure — TRACE, the "untangle" variant (plan view).
   Six nodes start as a knot: the same ten vertices (six nodes, four corners) joined in order but
   scattered, so the line crosses itself. They untangle into one orthogonal route with a meaning
   to its two levels: the market below (where the signal starts and the buyer is reached) and the
   documented route raised above it, carrying the four services in order — 02.2 data pipeline,
   02.4 CRM, 02.3 orchestration, 02.1 deliverability. The dimension measures exactly the raised
   run. Then one packet makes a single traversal; when it arrives, the buyer node latches red (the
   header's one red). No loop.
   Every coordinate lives in the band's fixed 1312 × 290 viewBox (phone: 358 × 290).            */
(function () {
  // the final route: the market at y 196, the documented route raised to y 116 (steps at x 180 · 1150)
  var FIN = [[40, 196], [180, 196], [180, 116], [275, 116], [540, 116], [805, 116], [1070, 116], [1150, 116], [1150, 196], [1272, 196]];
  // the knot: the same vertices, scattered and crossing
  var KNOT = [[540, 226], [772, 86], [438, 128], [886, 216], [612, 98], [474, 238], [842, 92], [566, 196], [912, 146], [700, 168]];
  var NODES = [0, 3, 4, 5, 6, 9];                     // which vertices are nodes (the rest are corners)
  // the phone route: vertical — the market lane (x 60) and the raised, documented lane (x 180)
  var SM = [[60, 18], [60, 46], [180, 46], [180, 78], [180, 122], [180, 166], [180, 210], [180, 242], [60, 242], [60, 272]];
  function f(n) { return String(Math.round(n * 10) / 10); }
  function ease(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
  function mix(k) {                                     // k(i) ∈ [0,1] per vertex
    return FIN.map(function (p, i) { var t = k(i), q = KNOT[i]; return [q[0] + (p[0] - q[0]) * t, q[1] + (p[1] - q[1]) * t]; });
  }
  function poly(pts, off) { off = off || 0; return pts.map(function (p, i) { return (i ? "L" : "M") + f(p[0] + off) + " " + f(p[1] + off); }).join(""); }
  function lens(pts) { var L = [0]; for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; }
  function along(pts, L, s) {                          // point at arc length s
    for (var i = 1; i < pts.length; i++) if (s <= L[i]) { var u = (s - L[i - 1]) / (L[i] - L[i - 1] || 1); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u]; }
    return pts[pts.length - 1];
  }
  function geo() {
    var o = { tr: { d: poly(FIN, .5) }, sm: { d: poly(SM, .5) } };
    NODES.forEach(function (v, k) { var r = k === 5 ? 5 : 4; o["n" + k] = { attrs: { x: f(FIN[v][0] - r), y: f(FIN[v][1] - r) } }; o["m" + k] = { attrs: { x: f(SM[v][0] - 4), y: f(SM[v][1] - 4) } }; });
    return o;
  }

  window.KM = {
    geo: geo,
    init: function (root, opts) {
      if (!root) return function () {};
      var reduced = !!(opts && opts.reduced);
      var big = root.querySelector(".km-capability-head-T__big");
      var frame = root.querySelector(".km-capability-head-T__frame");
      if (!big || !frame) return function () {};
      var tr = big.querySelector(".km-capability-head-T__tr");
      var nodes = big.querySelectorAll(".km-capability-head-T__n");
      var pk = big.querySelector(".km-capability-head-T__pk");
      var flags = frame.querySelectorAll(".km-capability-head-T__f");
      var FLAGV = [3, 4, 5, 6];                         // flag order in the DOM = route order: 02.2 · 02.4 · 02.3 · 02.1
      function place(pts) {
        tr.setAttribute("d", poly(pts, .5));
        NODES.forEach(function (v, k) { var r = k === 5 ? 5 : 4; nodes[k].setAttribute("x", f(pts[v][0] - r)); nodes[k].setAttribute("y", f(pts[v][1] - r)); });
      }
      if (reduced) { place(FIN); return function () {}; }   // final route and the latched buyer, synchronously

      frame.classList.add("ac-cold", "is-pre");
      place(KNOT);
      void frame.offsetWidth; frame.classList.remove("ac-cold");
      var T_UN = 1700, D_UN = 1500, T_PK = 3400, D_PK = 1500;
      var L = lens(FIN), raf = 0, t0 = 0, live = true, done = false;
      function step(now) {
        if (!live) return;
        if (!t0) t0 = now;
        var t = now - t0;
        if (t >= T_UN && t < T_UN + D_UN + 400) {        // the untangle: vertices settle left → right (60ms stagger)
          place(mix(function (i) { return ease((t - T_UN - i * 40) / D_UN); }));
          for (var k = 0; k < flags.length; k++) if (t > T_UN + FLAGV[k] * 40 + D_UN * .8) flags[k].classList.add("is-in");
          if (t > T_UN + D_UN * .7) frame.classList.add("is-set");
        }
        if (t >= T_UN + D_UN + 400 && !frame.classList.contains("is-dim")) { place(FIN); frame.classList.add("is-set", "is-dim"); for (var j = 0; j < flags.length; j++) flags[j].classList.add("is-in"); }
        if (t >= T_PK && !done) {                          // one packet, one traversal
          var u = Math.min(1, (t - T_PK) / D_PK), s = L[L.length - 1] * (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
          var p = along(FIN, L, s);
          pk.setAttribute("x", f(p[0] - 3)); pk.setAttribute("y", f(p[1] - 3)); frame.classList.add("is-run");
          if (u >= 1) { done = true; frame.classList.remove("is-run"); frame.classList.add("is-out"); }
        }
        if (!done) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
      return function () {
        live = false; cancelAnimationFrame(raf); place(FIN);
        frame.classList.remove("is-pre", "is-set", "is-dim", "is-run", "is-out");
        for (var k = 0; k < flags.length; k++) flags[k].classList.remove("is-in");
      };
    }
  };
})();
