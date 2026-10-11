/* principle · X · A×C — CONTOUR "noise settles into signal".
   Nine open curves of market noise enter the sheet at the left frame edge.
   t = 0 (raw): loud, spiky, full spread all the way to the statement — frayed.
   t = 1 (filtered): still noisy where they enter (the market is noisy), but a
   filter front has travelled left → right, lowering amplitude and frequency
   until the bundle closes onto the datum and one clean line carries on into
   "the clearest". Sample arrays are interpolated in JS (rAF); seeded PRNG, so
   every render is identical.                                                */
(function () {
  var TAU = Math.PI * 2;
  var G = { W: 302, cy: 100, n: 9, gap: 12, step: 3 };
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var rnd = mulberry32(707), PH = [], FRAY = [];
  for (var i = 0; i < G.n; i++) { PH.push([rnd() * TAU, rnd() * TAU, rnd() * TAU, rnd() * TAU, rnd() * TAU]); FRAY.push(rnd()); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sm(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
  function raw(i, x) { var p = PH[i]; return 0.5 * Math.sin(x / 41 * TAU + p[0]) + 0.32 * Math.sin(x / 17 * TAU + p[1]) + 0.18 * Math.sin(x / 9 * TAU + p[2]); }
  function calm(i, x) { var p = PH[i]; return 0.72 * Math.sin(x / 92 * TAU + p[3]) + 0.28 * Math.sin(x / 45 * TAU + p[4]); }
  function f(n) { return String(Math.round(n * 10) / 10); }
  function curve(p) {                                   // Catmull-Rom → cubic Béziers
    var d = "M" + f(p[0][0]) + " " + f(p[0][1]);
    for (var k = 0; k < p.length - 1; k++) {
      var p0 = p[k - 1] || p[k], p1 = p[k], p2 = p[k + 1], p3 = p[k + 2] || p2;
      d += "C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " +
        f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + " " + f(p2[1]);
    }
    return d;
  }
  // local filter progress: the front reaches x later the further right it is
  function front(t, xn) { return sm((t - 0.42 * xn) / 0.58); }
  // y = datum + spread·offset + amplitude·noise, each term interpolated per x by the front
  //   raw:      spread 1 everywhere, amplitude 13.5, spiky noise — frayed short of the statement
  //   filtered: spread closes by 76% of the field; amplitude decays; spiky at entry → calm
  function bundle(t) {
    var out = [], mid = (G.n - 1) / 2;
    var wEnd = front(t, 1);
    for (var i = 0; i < G.n; i++) {
      var o = (i - mid) * G.gap, sig = i === mid, pts = [];
      // raw: ragged ends short of the statement; filtered: the outer lines stop where
      // they have closed onto the datum, and only the middle one carries on to the word
      var xmax = sig ? G.W : lerp(G.W - 14 - FRAY[i] * 44, 0.8 * G.W, wEnd);
      var n = Math.ceil(xmax / G.step);
      for (var k = 0; k <= n; k++) {
        var x = xmax * k / n, xn = x / G.W, w = front(t, xn);
        var envF = 1 - sm((xn - 0.06) / 0.7);
        var spread = lerp(1, envF, w);
        var amp = lerp(13.5, 11 * (1 - sm((xn - 0.02) / 0.66)), w);
        var nzF = lerp(raw(i, x), calm(i, x), sm(xn / 0.5));
        var nz = lerp(raw(i, x), nzF, w);
        pts.push([x, G.cy + spread * o + amp * nz]);
      }
      out.push(curve(pts));
    }
    return out;
  }

  window.KM = {
    bundle: bundle,
    init: function (root, opts) {
      if (!root) return;
      var reduced = !!(opts && opts.reduced);
      var waves = root.querySelectorAll(".km-principle-X__wave");
      function draw(t) { var d = bundle(t); for (var i = 0; i < waves.length; i++) waves[i].setAttribute("d", d[i]); }
      function ease(u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }   // ≈ --ease-inout

      if (reduced) { draw(1); return; }                 // final drawing, synchronously; no timers, no loops

      // demo / live entrance: raw noise plots in (CSS wipe), then settles once
      draw(0);
      setTimeout(function () {
        var t0 = 0, MS = 1800;
        requestAnimationFrame(function step(now) {
          if (!t0) t0 = now;
          var u = Math.min(1, (now - t0) / MS);
          draw(ease(u));
          if (u < 1) requestAnimationFrame(step);
        });
      }, 1300);
    }
  };
})();
