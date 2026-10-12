/* about-head · S — the band's one orchestrated moment.
   The lattice arrives warped (a smooth 2D displacement field bends every row and station
   line), holds for a beat, then resolves to the true grid over 1.4s; the cells then seat row
   by row in CSS and the red cell lands last. The static HTML is the final drawing, so
   reduced motion (and no JS) shows it at once. init returns a cleanup that stops the frame
   loop and restores the true grid (React strict mode runs it twice in dev).              */
window.KM = {
  init: function (root, opts) {
    if (!root) return function () {};
    var reduced = !!(opts && opts.reduced);
    var lines = Array.prototype.slice.call(root.querySelectorAll(".km-about-head-S__ln"));
    if (!lines.length) return function () {};
    var geo = lines.map(function (el) {
      var h = el.getAttribute("data-h"), v = el.getAttribute("data-v");
      var n = (h || v).split(" ").map(Number);
      return { el: el, h: !!h, c: n[0], a: n[1], b: n[2], d: el.getAttribute("d") };
    });
    function restore() { geo.forEach(function (g) { g.el.setAttribute("d", g.d); }); }
    if (reduced) { restore(); return function () {}; }

    // the warp: a smooth field, strongest mid-band, so the frame's corners stay registered
    function field(x, y) {
      var e = Math.sin(Math.PI * Math.min(1, Math.max(0, (x - 0) / 1312)));
      return [
        e * (10 * Math.sin(x / 113 + y / 47 + 1.3) + 5 * Math.sin(x / 49 - y / 31 + 0.4)),
        e * (12 * Math.sin(x / 91 - y / 59 + 2.1) + 6 * Math.sin(x / 43 + y / 27 + 4.2))
      ];
    }
    function f(n) { return Math.round(n * 10) / 10; }
    function draw(k) {
      geo.forEach(function (g) {
        var d = "", n = Math.max(1, Math.ceil((g.b - g.a) / 8)), i, s, x, y, w;
        for (i = 0; i <= n; i++) {
          s = g.a + (g.b - g.a) * i / n;
          x = g.h ? s : g.c; y = g.h ? g.c : s;
          w = field(x, y);
          d += (i ? "L" : "M") + f(x + k * w[0]) + " " + f(y + k * w[1]);
        }
        g.el.setAttribute("d", d);
      });
    }
    function ease(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }

    var HOLD = 1000, RESOLVE = 1400, raf = 0, t0 = 0, done = false;
    draw(1);
    raf = requestAnimationFrame(function step(now) {
      if (!t0) t0 = now;
      var t = now - t0;
      if (t > HOLD) {
        var u = Math.min(1, (t - HOLD) / RESOLVE);
        if (u >= 1) { restore(); done = true; return; }
        draw(1 - ease(u));
      }
      raf = requestAnimationFrame(step);
    });
    return function () { cancelAnimationFrame(raf); if (!done) restore(); };
  }
};
