window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    var P = "km-evidence-X";
    var plate = root.querySelector("." + P + "__plate");
    var pts = Array.prototype.slice.call(root.querySelectorAll("." + P + "__p"));
    var cells = Array.prototype.slice.call(root.querySelectorAll("." + P + "__cell"));
    var segs = Array.prototype.slice.call(root.querySelectorAll("." + P + "__seg button"));
    var keys = Array.prototype.slice.call(root.querySelectorAll("." + P + "__k"));
    var VAL = { 1: 17, 2: 95, 3: 77, 4: 53 };   // 01 Visibility · 02 Timing · 03 Complexity · 04 Experience
    var FIG = 384, cur = 1, timers = [];

    // lattice targets come from the markup (the markup IS the final drawing).
    // data-r runs column by column, so a point's column is its rank's tens digit.
    var xs = pts.map(function (p) { return +p.getAttribute("x"); }).sort(function (a, b) { return a - b; });
    var X0 = xs[0], PITCH = (xs[xs.length - 1] - X0) / 9;
    var P0 = pts.map(function (p) {
      var x = +p.getAttribute("x"), y = +p.getAttribute("y");
      return { el: p, x: x, y: y, r: +p.getAttribute("data-r"), col: Math.round((x - X0) / PITCH), row: Math.round((y - X0) / PITCH) };
    });

    // a share behaves like a bar: it extends rightwards from its old edge, or retracts back to its new
    // one, 30ms per column; the part-column fills from its centre out
    function edge(v) { return v / 10; }
    function paint(n, sweep) {
      var v = VAL[n], from = edge(VAL[cur]);
      P0.forEach(function (q) {
        q.el.style.transitionDelay = sweep ? Math.round(Math.abs(q.col + 0.5 - from) * 30 + Math.abs(q.row - 4.5) * 6) + "ms" : "0ms";
        q.el.style.transitionDuration = "";
        q.el.classList.toggle("is-red", n === 1 && q.r < v);
        q.el.classList.toggle("is-on", n !== 1 && q.r < v);
      });
      cur = n;
    }
    function mark(n) {
      plate.setAttribute("data-state", String(n));
      cells.forEach(function (c) { c.classList.toggle("is-active", +c.getAttribute("data-n") === n); });
      segs.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-n") === n)); });
      keys.forEach(function (k) { k.classList.toggle("is-on", +k.getAttribute("data-n") === n); });
    }
    function set(n, sweep) { paint(n, sweep); mark(n); }
    function stop() { timers.forEach(clearTimeout); timers = []; }

    segs.forEach(function (b) {
      b.addEventListener("click", function () { stop(); land(); set(+b.getAttribute("data-n"), true); });
    });

    if (reduced) return; // final state as marked up: lattice, 01 · 17 in red, no timers, no loops

    // ── opening state: four loose clouds, one beside each reading (seeded, so every render is identical).
    //    Cloud k is every other point in both directions, so each cloud lands spread across the whole
    //    lattice and the four weave into one structure.
    function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    var rnd = mulberry32(303);
    var C = [[58, -26], [FIG - 64, -26], [58, FIG + 20], [FIG - 64, FIG + 20]];   // 01 TL · 02 TR · 03 BL · 04 BR
    P0.forEach(function (q) {
      var k = (q.row % 2) * 2 + (q.col % 2), a = rnd() * 6.2832, d = 70 * Math.sqrt(rnd());
      q.sx = C[k][0] + Math.cos(a) * d * 1.15;
      q.sy = C[k][1] + Math.sin(a) * d * 0.8;
      q.appear = 380 + k * 80 + rnd() * 120;                            // clouds appear in reading order
      q.start = 760 + (q.col + q.row) * 18 + rnd() * 40;                // converge, swept from 01 (top-left)
      q.landed = false;
      q.el.style.opacity = "0";
      q.el.setAttribute("x", q.sx.toFixed(1)); q.el.setAttribute("y", q.sy.toFixed(1));
      q.el.classList.remove("is-red", "is-on");
      q.el.classList.add("is-loose");
    });
    plate.classList.add("ac-cold");
    mark(1);
    cells.forEach(function (c) { c.classList.remove("is-active"); });
    void plate.offsetWidth;
    requestAnimationFrame(function () { requestAnimationFrame(function () { plate.classList.remove("ac-cold"); }); });

    // --ease-inout = cubic-bezier(.65, 0, .35, 1), solved for x
    function bez(t) {
      var x1 = .65, x2 = .35, u = t;
      for (var i = 0; i < 6; i++) {
        var x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
        var dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
        if (Math.abs(x) < 1e-4 || !dx) break; u -= x / dx;
      }
      return 3 * (1 - u) * u * u + u * u * u;      // y1 = 0, y2 = 1
    }
    var DUR = 1200, t0 = null, raf = 0;
    function place(q, k) {
      q.el.setAttribute("x", (q.sx + (q.x - q.sx) * k).toFixed(2));
      q.el.setAttribute("y", (q.sy + (q.y - q.sy) * k).toFixed(2));
    }
    // a point latches as it lands: grey for the remainder, red if it is one of the 17
    function latch(q) {
      q.landed = true; place(q, 1); q.el.style.opacity = "";
      q.el.style.transitionDelay = "0ms";
      q.el.style.transitionDuration = "200ms";
      q.el.classList.remove("is-loose");
      if (q.r < VAL[1]) q.el.classList.add("is-red");
    }
    function land() {   // a click mid-flight lands everything at once
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      P0.forEach(function (q) { if (!q.landed) latch(q); });
    }
    function tick(now) {
      if (t0 === null) t0 = now;
      var t = now - t0, busy = false;
      P0.forEach(function (q) {
        if (q.landed) return;
        busy = true;
        q.el.style.opacity = String(Math.min(Math.max((t - q.appear) / 260, 0), 1));
        var k = Math.min(Math.max((t - q.start) / DUR, 0), 1);
        if (k >= 1) latch(q); else place(q, bez(k));
      });
      raf = busy ? requestAnimationFrame(tick) : 0;
    }
    raf = requestAnimationFrame(tick);

    // numerals count up once (1.2s, tabular, two digits held); the ':5' of 95:5 waits for its count
    var nums = root.querySelectorAll("." + P + "__n");
    var ratio = root.querySelector("." + P + "__cell--tr ." + P + "__u");
    nums.forEach(function (el) { el.textContent = "00"; });
    if (ratio) { ratio.style.opacity = "0"; ratio.style.transition = "opacity 300ms ease-out"; }
    var c0 = null;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function count(now) {
      if (c0 === null) c0 = now;
      var t = Math.min(Math.max((now - c0 - 700) / 1200, 0), 1);
      nums.forEach(function (el) { var v = Math.round(+el.getAttribute("data-to") * ease(t)); el.textContent = (v < 10 ? "0" : "") + v; });
      if (t < 1) requestAnimationFrame(count); else if (ratio) ratio.style.opacity = "1";
    }
    requestAnimationFrame(count);

    // ── the orchestrated moment: as the 17 latch red, 01's rule draws; then the field steps through
    //    the readings (02 → 03 → 04) and comes back to rest on 01, the 17. Demo: one step per 0.95s,
    //    settled by ≈ 5.9s. On the live site: once at 40% visible, one step per 1.4s, the first
    //    click stops it for good.
    timers.push(setTimeout(function () { mark(1); }, 1500));
    [[2, 2450], [3, 3400], [4, 4350], [1, 5300]].forEach(function (s) {
      timers.push(setTimeout(function () { set(s[0], true); }, s[1]));
    });
  }
};
