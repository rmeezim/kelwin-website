/* capability-head · U · GTM Intelligence — ORBIT, the "stations" variant (plan view).
   Every touch arrives along one line (a tape of ticks) and enters an open ring at 03.1 Signal
   taxonomy. The ring carries three more stations — 03.2 Win/loss, 03.3 Resonance, 03.4
   Quarterly calibration — and stays open for the last 40° until the quarter is calibrated.
   A node rides the ring once; when it reaches 03.4 the gap closes with the red arc (the
   header's one red) and the node comes home to 03.1, where the next quarter starts.
   Flat stations and callouts — not the accretion rings rejected in round 3, and not the
   homepage's iso slab 03. Fixed viewBox 1312 × 300 (phone 358 × 240); no ambient loop.      */
(function () {
  var TAU = Math.PI * 2;
  var B = { cx: 760, cy: 164, r: 112, x0: 40 };           // the band ring; the tape starts at x0
  var M = { cx: 196, cy: 124, r: 96, x0: 0 };             // the phone ring
  var A1 = 270, GAP = 40, A4 = A1 + 360 - GAP;            // 03.1 at 9 o'clock; 03.4 at 230° (clockwise from 12)
  var ST = [270, 390, 480, 590];                          // the four stations, as ride angles (03.1 · 03.2 at 30° · 03.3 at 120° · 03.4)
  function f(n) { return String(Math.round(n * 10) / 10); }
  function pt(c, a) { var t = a / 360 * TAU; return [c.cx + c.r * Math.sin(t), c.cy - c.r * Math.cos(t)]; }
  function arc(c, a, b) {                                  // clockwise arc from angle a to b
    var p = pt(c, a), q = pt(c, b), large = (b - a) % 360 > 180 ? 1 : 0;
    return "M" + f(p[0]) + " " + f(p[1]) + "A" + c.r + " " + c.r + " 0 " + large + " 1 " + f(q[0]) + " " + f(q[1]);
  }
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function tape(c, x1, n, hmax, seed) {                    // the touches: irregular ticks above the entry line
    var r = mulberry32(seed), d = "", x = c.x0 + 6;
    for (var i = 0; i < n && x < x1 - 10; i++) {
      var h = 4 + Math.round(r() * hmax);
      d += "M" + f(Math.round(x) + .5) + " " + f(c.cy) + "V" + f(c.cy - h);
      x += 8 + r() * ((x1 - c.x0) / n) * 1.3;
    }
    return d;
  }
  function geo() {
    var o = {};
    var e1 = pt(B, A1), e4 = pt(B, A4);
    o.ent = { d: "M" + B.x0 + " " + f(B.cy + .5) + "H" + f(e1[0]) };
    o.tape = { d: tape({ cx: 0, cy: B.cy, x0: B.x0 }, e1[0] - 30, 34, 12, 3017) };
    o.ring = { d: arc(B, A1, A4) };
    o.gap = { d: arc(B, A4, A1 + 360) };
    ST.forEach(function (a, k) { var p = pt(B, a); o["s" + k] = { attrs: { x: f(p[0] - 4), y: f(p[1] - 4) } }; });
    o.nd = { attrs: { x: f(e1[0] - 4.5), y: f(e1[1] - 4.5) } };
    var m1 = pt(M, A1);
    o.ment = { d: "M" + M.x0 + " " + f(M.cy + .5) + "H" + f(m1[0]) };
    o.mtape = { d: tape({ cx: 0, cy: M.cy, x0: 8 }, m1[0] - 14, 9, 9, 3017) };
    o.mring = { d: arc(M, A1, A4) };
    o.mgap = { d: arc(M, A4, A1 + 360) };
    ST.forEach(function (a, k) { var p = pt(M, a); o["m" + k] = { attrs: { x: f(p[0] - 4), y: f(p[1] - 4) } }; });
    return o;
  }

  window.KM = {
    geo: geo,
    init: function (root, opts) {
      if (!root) return function () {};
      var reduced = !!(opts && opts.reduced);
      var frame = root.querySelector(".km-capability-head-U__frame");
      var nd = root.querySelector(".km-capability-head-U__nd");
      var flags = root.querySelectorAll(".km-capability-head-U__co");
      if (!frame || !nd) return function () {};
      function put(a) { var p = pt(B, a); nd.setAttribute("x", f(p[0] - 4.5)); nd.setAttribute("y", f(p[1] - 4.5)); }
      if (reduced) { put(A1); return function () {}; }        // closed ring, node home at 03.1, synchronously

      frame.classList.add("ac-cold", "is-pre");
      put(A1);
      void frame.offsetWidth; frame.classList.remove("ac-cold");
      var T_RIDE = 2300, D_RIDE = 2100, D_CLOSE = 600;
      var raf = 0, t0 = 0, live = true, done = false;
      function ease(u) { return u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
      function step(now) {
        if (!live) return;
        if (!t0) t0 = now;
        var t = now - t0;
        if (t >= T_RIDE) {
          frame.classList.add("is-ride");
          var u = Math.min(1, (t - T_RIDE) / D_RIDE), a = A1 + (A4 - A1) * ease(u);
          if (u < 1) put(a);
          for (var k = 0; k < flags.length; k++) if (a >= ST[k] - 2) flags[k].classList.add("is-in");
          if (u >= 1) {                                          // the gap closes in red; the node comes home
            frame.classList.add("is-close");
            var v = Math.min(1, (t - T_RIDE - D_RIDE) / D_CLOSE);
            put(A4 + GAP * ease(v));
            if (v >= 1) { frame.classList.add("is-dim"); done = true; put(A1); }
          }
        }
        if (!done) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
      return function () {
        live = false; cancelAnimationFrame(raf); put(A1);
        frame.classList.remove("is-pre", "is-ride", "is-close", "is-dim");
        for (var k = 0; k < flags.length; k++) flags[k].classList.remove("is-in");
      };
    }
  };
})();
