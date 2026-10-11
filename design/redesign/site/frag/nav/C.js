window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function select(n, instant) {
      if (instant) root.classList.add("no-tr");
      root.setAttribute("data-sel", String(n));
      if (instant) { void root.offsetWidth; root.classList.remove("no-tr"); }
    }

    // live: hovering or focusing a selector cell selects its capability (plane, leader, spec panel)
    root.querySelectorAll(".km-nav-C__sel[data-cap]").forEach(function (c) {
      var on = function () { timers.forEach(clearTimeout); select(c.getAttribute("data-cap")); };
      c.addEventListener("mouseenter", on);
      c.addEventListener("focus", on);
    });
    // an X/Y readout runs on the frame edge under the sheet
    var xy = root.querySelector(".km-nav-C__xy");
    root.addEventListener("pointermove", function (e) {
      var r = root.getBoundingClientRect();
      var x = Math.round(e.clientX - r.left), y = Math.round(e.clientY - r.top);
      root.classList.add("is-pointer");
      if (xy) xy.textContent = "X " + String(x).padStart(4, "0") + " · Y " + String(y).padStart(4, "0");
    });
    root.addEventListener("pointerleave", function () { root.classList.remove("is-pointer"); });
    var trigger = root.querySelector(".km-nav-C__cell.is-active");
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && trigger) { trigger.setAttribute("aria-expanded", "false"); trigger.focus(); }
    });

    if (reduced) { select(2, true); return; }

    // entrance: mono IDs type on in raster order at 24ms per character
    var typed = Array.prototype.slice.call(root.querySelectorAll("[data-type]"));
    typed.sort(function (a, b) {
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return (Math.round(ra.top) - Math.round(rb.top)) || (ra.left - rb.left);
    });
    typed.forEach(function (el, k) {
      var full = el.textContent;
      el.textContent = "";
      el.style.minWidth = "1ch";
      var start = 600 + k * 45;
      for (var c = 1; c <= full.length; c++) {
        (function (c) { later(function () { el.textContent = full.slice(0, c); }, start + c * 24); })(c);
      }
    });

    // demo (on the live site: hover/focus): once plotted, the red plane drops onto K1 (selector A),
    // then steps to K2 (selector B) — the spec column follows
    select(0, true);
    later(function () { select(1); }, 2000);
    later(function () { select(2); }, 3200);
  }
};
