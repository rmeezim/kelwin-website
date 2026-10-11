window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    var xy = root.querySelector(".km-hero-C__xy");
    var xyv = root.querySelector(".km-hero-C__xyv");
    var REST = { x: 0.42, y: 0.18 };

    function fmt(x, y) { return "X " + x.toFixed(2) + " · Y " + y.toFixed(2); }

    // interaction: the X/Y readout and its tick ride the top sheet rule over the
    // viewport (cols 9–12) with the cursor, reading live sheet coordinates
    if (xy) {
      root.addEventListener("pointermove", function (e) {
        var r = root.getBoundingClientRect();
        var x = Math.min(Math.max(e.clientX - r.left, 1100), 1376);
        xy.style.left = x + "px";
        xyv.textContent = fmt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      });
      root.addEventListener("pointerleave", function () {
        xy.style.left = "";
        xyv.textContent = fmt(REST.x, REST.y);
      });
    }

    if (reduced) return; // final state already in the markup

    // entrance: mono values type on at 24ms per character, in drafting order
    var order = [".km-hero-C__ticker", ".km-hero-C__audit .km-hero-C__id", ".km-hero-C__block"];
    var typed = [];
    order.forEach(function (sel) { var el = root.querySelector(sel); if (el) typed.push(el); });
    var t0 = 1250;
    typed.forEach(function (el, k) {
      var full = el.textContent;
      el.textContent = "";
      el.style.minHeight = "1em";
      setTimeout(function () {
        var i = 0;
        var id = setInterval(function () {
          i++;
          el.textContent = full.slice(0, i);
          if (i >= full.length) clearInterval(id);
        }, 24);
      }, t0 + k * 140);
    });

    // entrance: the coordinates tick from the origin to their resting values
    if (xyv) {
      xyv.textContent = fmt(0, 0);
      setTimeout(function () {
        var t1 = performance.now();
        (function step(now) {
          var p = Math.min((now - t1) / 700, 1);
          var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          xyv.textContent = fmt(REST.x * e, REST.y * e);
          if (p < 1) requestAnimationFrame(step);
        })(t1);
      }, 1400);
    }
  }
};
