/* interior · X · Specimen sheet — the page's own shape, drawn large.
   CONTOUR (P6): five jittery 1px lines enter the specimen band at the left,
   narrow through a filter zone and leave as one clean line that meets the
   frame at the red output tick. The morph is a settle front that travels
   left → right (sample interpolation): behind it each sample lands on its
   final value; callouts 01.1 → 01.4 register as the front reaches their
   station. One ambient loop afterwards: a slow phase drift on the clean run.
   The static HTML holds the final drawing (generated from KM.geo).          */
(function () {
  var TAU = Math.PI * 2;
  // band geometry (SVG user units = CSS px; the band is cols 1–12 × 300)
  var W = 1312, Y = 166.5, G = 26, XA = 170, XB = 900, STEP = 8, SW = 240;
  var STATIONS = [292, 472, 652, 832];                // 01.1 → 01.4 (left edge of each flag)
  var TOP = 40;                                       // underside of the flag codes
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var rnd = mulberry32(5021), PH = [];
  for (var i = 0; i < 5; i++) PH.push([rnd() * TAU, rnd() * TAU, rnd() * TAU]);
  function sm(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
  function env(x) { return 1 - sm((x - XA) / (XB - XA)); }
  // amplitude decays with env; the high harmonics die first, so the frequency settles too
  function noise(i, x, e) {
    var p = PH[i];
    return 15 * e * Math.sin(x / 176 * TAU + p[0]) + 9 * e * e * Math.sin(x / 67 * TAU + p[1]) + 4.5 * e * e * e * Math.sin(x / 29 * TAU + p[2]);
  }
  // the clean run's carrier: a quiet tone, flat where it meets the frame
  function carrier(x, ph) {
    var a = 3.2 * sm((x - XB - 24) / 220) * (1 - sm((x - (W - 150)) / 110));
    return a ? a * Math.sin((x - XB) / 136 * TAU - ph) : 0;
  }
  function finalY(i, x, ph) { var e = env(x); return Y + e * (i - 2) * G + noise(i, x, e) + carrier(x, ph); }
  function rawY(i, x) { return Y + (i - 2) * G * 1.06 + noise(i, x, 1.08); }
  function f(n) { return String(Math.round(n * 10) / 10); }
  function curve(p) {                                 // Catmull-Rom → cubic Béziers
    var d = "M" + f(p[0][0]) + " " + f(p[0][1]);
    for (var k = 0; k < p.length - 1; k++) {
      var p0 = p[k - 1] || p[k], p1 = p[k], p2 = p[k + 1], p3 = p[k + 2] || p2;
      d += "C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " +
        f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + " " + f(p2[1]);
    }
    return d;
  }
  // front F: samples left of it have settled (s → 1); F = +∞ is the final drawing
  function bundle(F, ph) {
    var out = [];
    for (var i = 0; i < 5; i++) {
      var pts = [];
      for (var x = 0; x <= W; x += STEP) {
        var s = sm((F - x) / SW), y = rawY(i, x) + (finalY(i, x, ph) - rawY(i, x)) * s;
        pts.push([x, y]);
        if (i !== 2 && s > 0.999 && x > XB + 8) break;   // merged into the clean line: stop
      }
      out.push(curve(pts));
    }
    return out;
  }
  function anchor(x) {                                // top-most settled line at a station
    var m = Infinity; for (var i = 0; i < 5; i++) m = Math.min(m, finalY(i, x, 0)); return m;
  }
  // static geometry for the HTML (node: tool fills data-g attributes from this)
  function geo() {
    var d = bundle(Infinity, 0), o = { };
    for (var i = 0; i < 5; i++) o["l" + i] = { d: d[i] };
    o.l2c = { d: d[2] };
    STATIONS.forEach(function (x, k) { o["co" + (k + 1)] = { style: "--x:" + x + "px;--a:" + f(anchor(x)) + "px" }; });
    return o;
  }

  window.KM = {
    geo: geo,
    init: function (root, opts) {
      if (!root) return;
      var reduced = !!(opts && opts.reduced);
      var frame = root.querySelector(".km-interior-X__frame");
      var lines = root.querySelectorAll(".km-interior-X__ln");
      var clean = root.querySelector(".km-interior-X__clean");
      var cos = root.querySelectorAll(".km-interior-X__co");
      function draw(F, ph) { var d = bundle(F, ph); for (var i = 0; i < lines.length; i++) lines[i].setAttribute("d", d[i]); if (clean) clean.setAttribute("d", d[2]); }
      function drawClean(ph) { var d = bundle(Infinity, ph)[2]; lines[2].setAttribute("d", d); if (clean) clean.setAttribute("d", d); }
      if (!frame || lines.length !== 5) return;
      if (reduced) { draw(Infinity, 0); return; }          // final drawing, no loops, no timers

      // the opening state: the raw bundle runs the full width; flags, dimension, tick, title block wait
      frame.classList.add("ac-cold", "is-pre");
      draw(-SW, 0);
      void frame.offsetWidth; frame.classList.remove("ac-cold");
      var T_SETTLE = 1500, D_SETTLE = 1900, T_DRIFT = 12000;
      var t0 = 0, settled = false, ph = 0, last = 0;
      function easeS(u) { return -(Math.cos(Math.PI * u) - 1) / 2; }
      requestAnimationFrame(function step(now) {
        if (!t0) t0 = now;
        var t = now - t0;
        if (!settled) {
          if (t >= T_SETTLE) {
            var u = Math.min(1, (t - T_SETTLE) / D_SETTLE);
            var F = -SW + (W + 2 * SW) * easeS(u);
            draw(F, 0);
            for (var k = 0; k < cos.length; k++) if (F >= STATIONS[k] + 12) cos[k].classList.add("is-on");
            if (F >= XB + 40) frame.classList.add("is-dim");
            if (F >= W) frame.classList.add("is-out");
            if (u >= 1) { settled = true; draw(Infinity, 0); last = now; }
          }
        } else {                                        // ambient: phase drift on the clean run only (12s per cycle)
          ph = ((now - last) / T_DRIFT) * TAU;
          drawClean(ph);
        }
        requestAnimationFrame(step);
      });
    }
  };
})();
