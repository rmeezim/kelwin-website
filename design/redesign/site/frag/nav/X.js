/* nav · X · A×C "Cinematic Drafting" — the hanging plate as a capability sheet.
   One signal line is drawn across the plate's three strips; each strip's run of
   it is that capability's glyph (CONTOUR · TRACE · ORBIT). The open strip's
   glyph resolves in --fg with its one signature morph; the others rest raw
   and quiet. Only the open glyph may run an ambient loop (≥ 8s).           */
(function () {
  var TAU = Math.PI * 2;
  // ── CONTOUR geometry (shared with the static HTML, which holds the t=0 paths) ──
  var C = { x0: 32, cy: 72, gap: 16, W: 433.333 };
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var rnd = mulberry32(1307), PH = [];
  for (var i = 0; i < 5; i++) PH.push([rnd() * TAU, rnd() * TAU, rnd() * TAU]);
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sm(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
  function noise(i, x) { var p = PH[i]; return 0.6 * Math.sin(x / 72 * TAU + p[0]) + 0.28 * Math.sin(x / 35 * TAU + p[1]) + 0.12 * Math.sin(x / 19 * TAU + p[2]); }
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
  // t = 0: raw (a loud bundle that only meets at the strip's edge)
  // t = 1: resolved (noise filtered early, one clean line carries on)
  function contour(t) {
    var xc = lerp(372, 216, t), A = lerp(6.5, 4, t), out = [];
    for (var i = 0; i < 5; i++) {
      var o = (i - 2) * C.gap, pts = [], n = Math.ceil((xc - C.x0) / 6);
      for (var k = 0; k <= n; k++) {
        var x = C.x0 + (xc - C.x0) * k / n, u = (x - C.x0) / (xc - C.x0);
        var env = 1 - sm((u - 0.1) / 0.9);
        pts.push([x, C.cy + env * (o + A * noise(i, x))]);
      }
      var d = curve(pts);
      if (i === 2) d += "H" + C.W;
      out.push(d);
    }
    return out;
  }

  window.KM = {
    contour: contour,
    init: function (root, opts) {
      if (!root) return;
      var reduced = !!(opts && opts.reduced);
      var cur = -1, tC = 0, raf = 0, pRaf = 0, pTimer = 0, demo = 0;
      var lines = root.querySelectorAll(".km-nav-X__wave");
      var route = root.querySelector(".km-nav-X__route-on");
      var packet = root.querySelector(".km-nav-X__packet");
      var L = route ? route.getTotalLength() : 0;

      function drawContour(t) { var d = contour(t); for (var i = 0; i < lines.length; i++) lines[i].setAttribute("d", d[i]); }
      function ease(u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }   // ≈ --ease-inout
      function tweenContour(to, ms) {
        cancelAnimationFrame(raf);
        if (!ms || tC === to) { tC = to; drawContour(tC); return; }
        var from = tC, t0 = 0;
        raf = requestAnimationFrame(function step(now) {
          if (!t0) t0 = now;
          var u = Math.min(1, (now - t0) / ms);
          tC = from + (to - from) * ease(u); drawContour(tC);
          if (u < 1) raf = requestAnimationFrame(step);
        });
      }
      function placePacket(frac) {
        if (!route || !packet) return;
        var p = route.getPointAtLength(frac * L);
        packet.setAttribute("x", (p.x - 3).toFixed(2)); packet.setAttribute("y", (p.y - 3).toFixed(2));
      }
      function stopPacket() { clearTimeout(pTimer); cancelAnimationFrame(pRaf); }
      function startPacket(delay) {                     // one 6px packet, constant speed, 12s per lap (calm; ≥ 8s ambient rule)
        stopPacket(); placePacket(0);
        pTimer = setTimeout(function () {
          var t0 = 0;
          pRaf = requestAnimationFrame(function step(now) {
            if (!t0) t0 = now;
            placePacket(((now - t0) / 12000) % 1);
            pRaf = requestAnimationFrame(step);
          });
        }, delay);
      }

      function select(n, instant) {
        if (n === cur) return;
        cur = n;
        if (instant) root.classList.add("ac-cold");
        root.setAttribute("data-sel", String(n));
        tweenContour(n === 1 ? 1 : 0, instant ? 0 : (n === 1 ? 1400 : 600));
        if (n === 2 && !reduced) startPacket(instant ? 0 : 1000); else stopPacket();
        if (instant) { void root.offsetWidth; root.classList.remove("ac-cold"); }
      }

      // live: hovering or focusing a strip opens it (master → detail)
      root.querySelectorAll(".km-nav-X__strip").forEach(function (s) {
        var n = +s.getAttribute("data-cap");
        function go() { clearTimeout(demo); root.removeAttribute("data-demo"); select(n); }
        s.addEventListener("mouseenter", go);
        s.addEventListener("focusin", go);
      });
      var trigger = root.querySelector(".km-nav-X__item[aria-expanded]");
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && trigger) { trigger.setAttribute("aria-expanded", "false"); trigger.focus(); }
      });

      if (reduced) {                                    // final drawing, synchronously; no loops, no timers
        select(2, true); drawContour(0); placePacket(0.3);
        return;
      }
      // demo: the plate unrolls with nothing open while the raw line plots
      // left → right; at ~2.4s the pointer settles on CAP. 02 and its route resolves
      select(0, true);
      demo = setTimeout(function () { select(2); }, 2400);
    }
  };
})();
