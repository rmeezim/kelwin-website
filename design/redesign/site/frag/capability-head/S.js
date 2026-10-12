/* capability-head · S · Narrative Systems — CONTOUR, the approved header X band (round 3),
   title block retired, C1 guard added.
   Five jittery 1px lines enter a drawn filter (a mouth at XA, two converging hairlines to a
   neck at XB) and leave as one clean line that meets the frame at the red output tick.
   The morph is a settle front travelling left → right (sample interpolation); the four flags
   stand on the filter's upper hairline and register as the front passes them.
   C1 guard: every coordinate is computed in the band's fixed 1312 × 300 viewBox (the phone
   drawing in its own 358 × 180), so the settle never fragments at any width; the bundle stays
   inside its filter and never fills the sheet.
   Ambient (the interior's one loop): a slow phase drift on the clean run only, 12s a cycle.   */
(function () {
  var TAU = Math.PI * 2;
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function sm(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
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

  // one CONTOUR, parameterised: the band (1312 × 300, five lines) and the phone (358 × 240, three)
  function Contour(P) {
    var rnd = mulberry32(P.seed), PH = [];
    for (var i = 0; i < P.n; i++) PH.push([rnd() * TAU, rnd() * TAU, rnd() * TAU]);
    var mid = (P.n - 1) / 2;
    // the filter: full spread before the mouth, then a convex decay to the neck (stays inside the hairlines)
    function env(x) { if (x <= P.xa) return 1; if (x >= P.xb) return 0; return Math.pow(1 - (x - P.xa) / (P.xb - P.xa), 1.6); }
    function noise(i, x, e) {
      var p = PH[i], k = P.k;
      return P.amp * (15 * e * Math.sin(x / (176 * k) * TAU + p[0]) + 9 * e * e * Math.sin(x / (67 * k) * TAU + p[1]) + 4.5 * e * e * e * Math.sin(x / (29 * k) * TAU + p[2]));
    }
    function carrier(x, ph) {                          // the clean run's quiet tone, flat where it meets the frame
      if (!P.car) return 0;
      var a = P.car * sm((x - P.xb - 24) / 220) * (1 - sm((x - (P.w - 150)) / 110));
      return a ? a * Math.sin((x - P.xb) / 136 * TAU - ph) : 0;
    }
    function finalY(i, x, ph) { var e = env(x); return P.y + e * (i - mid) * P.g + noise(i, x, e) + carrier(x, ph); }
    function rawY(i, x) { return P.y + (i - mid) * P.g * 1.06 + noise(i, x, 1.08); }
    function line(i, F, ph) {                           // one line at front F (F = ∞ is final)
      var pts = [];
      for (var x = 0; x <= P.w; x += P.step) {
        var s = sm((F - x) / P.sw), y = rawY(i, x) + (finalY(i, x, ph) - rawY(i, x)) * s;
        pts.push([x, y]);
        if (i !== Math.round(mid) && s > 0.999 && x > P.xb + 8) break;   // merged into the clean line: stop
      }
      return curve(pts);
    }
    function lines(F, ph) {                             // front F: samples left of it have settled
      var out = [];
      for (var i = 0; i < P.n; i++) out.push(line(i, F, ph));
      return out;
    }
    // the filter's hairlines: a mouth at xa (±h) converging to a neck at xb (±2)
    function topAt(x) { var u = (x - P.xa) / (P.xb - P.xa); return P.y - P.h + (P.h - 2) * u; }
    function filter() {
      var a = P.xa + .5, b = P.xb + .5, t = P.y - P.h, bt = P.y + P.h;
      return "M" + f(a) + " " + f(t) + "L" + f(b) + " " + f(P.y - 2) + "M" + f(a) + " " + f(bt) + "L" + f(b) + " " + f(P.y + 2);
    }
    function mouth() { var a = P.xa + .5; return "M" + f(a) + " " + f(P.y - P.h) + "V" + f(P.y + P.h); }
    return { lines: lines, line: line, mid: Math.round(mid), topAt: topAt, filter: filter, mouth: mouth, P: P };
  }

  var BIG = Contour({ seed: 5021, n: 5, w: 1312, y: 164.5, g: 26, xa: 150, xb: 900, h: 92, step: 8, sw: 240, k: 1, amp: 1, car: 3.2 });
  var SM = Contour({ seed: 5021, n: 3, w: 358, y: 90.5, g: 30, xa: 24, xb: 167, h: 68, step: 4, sw: 80, k: .5, amp: .9, car: 0 });
  var STATIONS = [292, 472, 652, 832];                // 01.1 → 01.4: each flag stands on the filter's upper hairline

  function geo() {
    var o = {}, d = BIG.lines(Infinity, 0), s = SM.lines(Infinity, 0);
    for (var i = 0; i < 5; i++) o["l" + i] = { d: d[i] };
    o.cl = { d: d[2] };
    o.fl = { d: BIG.filter() }; o.mo = { d: BIG.mouth() };
    for (var j = 0; j < 3; j++) o["s" + j] = { d: s[j] };
    o.scl = { d: s[1] };
    o.sfl = { d: SM.filter() }; o.smo = { d: SM.mouth() };
    STATIONS.forEach(function (x, k) { o["f" + (k + 1)] = { style: "--x:" + x + ";--a:" + f(BIG.topAt(x)) }; });
    return o;
  }

  window.KM = {
    geo: geo,
    init: function (root, opts) {
      if (!root) return function () {};
      var reduced = !!(opts && opts.reduced);
      var frame = root.querySelector(".km-capability-head-S__frame");
      var big = root.querySelector(".km-capability-head-S__big");
      var ln = big ? big.querySelectorAll(".km-capability-head-S__ln") : [];
      var clean = big ? big.querySelector(".km-capability-head-S__clean") : null;
      var flags = root.querySelectorAll(".km-capability-head-S__f");
      if (!frame || ln.length !== 5) return function () {};
      function draw(F, ph) { var d = BIG.lines(F, ph); for (var i = 0; i < 5; i++) ln[i].setAttribute("d", d[i]); if (clean) clean.setAttribute("d", d[2]); }
      function drawClean(ph) { var d = BIG.line(BIG.mid, Infinity, ph); ln[2].setAttribute("d", d); if (clean) clean.setAttribute("d", d); }
      if (reduced) { draw(Infinity, 0); return function () {}; }   // final drawing, synchronously; no loop, no timer

      // the opening state: the raw bundle runs the full width; flags, dimension and tick wait for the front
      frame.classList.add("ac-cold", "is-pre");
      draw(-BIG.P.sw, 0);
      void frame.offsetWidth; frame.classList.remove("ac-cold");
      var T0 = 2000, DUR = 1900, DRIFT = 12000, W = BIG.P.w, SW = BIG.P.sw;
      var raf = 0, t0 = 0, settled = false, prev = 0, acc = 0, live = true, vis = true, io = null;
      function easeS(u) { return -(Math.cos(Math.PI * u) - 1) / 2; }
      // the loop runs while the settle plays; after it, only while the band is on screen and the tab is shown
      function want() { return live && (!settled || (vis && !document.hidden)); }
      function kick() { if (!raf && want()) raf = requestAnimationFrame(step); }
      function step(now) {
        raf = 0;
        if (!live) return;
        if (!t0) t0 = now;
        var t = now - t0;
        if (!settled) {
          if (t >= T0) {
            var u = Math.min(1, (t - T0) / DUR), F = -SW + (W + 2 * SW) * easeS(u);
            draw(F, 0);
            for (var k = 0; k < flags.length; k++) if (F >= STATIONS[k] + 12) flags[k].classList.add("is-in");
            if (F >= BIG.P.xb + 40) frame.classList.add("is-dim");
            if (F >= W) frame.classList.add("is-out");
            if (u >= 1) { settled = true; draw(Infinity, 0); prev = now; }
          }
        } else {                                         // ambient: the clean run's phase drifts, 12s a cycle
          acc += Math.min(now - prev, 50); prev = now;   // a paused loop resumes where it stopped
          drawClean((acc / DRIFT) * TAU);              // only the clean line is recomputed
        }
        kick();
      }
      function onVis() { if (!document.hidden) prev = performance.now(); kick(); }
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(function (es) { vis = es[es.length - 1].isIntersecting; if (vis) prev = performance.now(); kick(); });
        io.observe(frame);
      }
      document.addEventListener("visibilitychange", onVis);
      kick();
      return function () {
        live = false; cancelAnimationFrame(raf); raf = 0;
        if (io) io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        frame.classList.remove("is-pre", "is-dim", "is-out");
        for (var k = 0; k < flags.length; k++) flags[k].classList.remove("is-in");
        draw(Infinity, 0);
      };
    }
  };
})();
