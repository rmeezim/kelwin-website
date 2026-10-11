/* assets · C — SHEET 10/14. Keyed annotation: each parts-list row types on with its
   leader on the drawing; hovering a row moves the red plane to that part; tabs swap
   Parts list / Transfer terms. Final state = markup. */
window.KM = {
  init: function (root, opt) {
    if (!root) return;
    var reduced = opt && opt.reduced;
    var DEF = "5";
    var rows = root.querySelectorAll(".km-assets-C__row");
    var tabs = root.querySelectorAll(".km-assets-C__tab");
    var panels = root.querySelectorAll(".km-assets-C__panel");

    Array.prototype.forEach.call(rows, function (r) {
      r.addEventListener("mouseenter", function () { root.setAttribute("data-sel", r.getAttribute("data-k")); root.setAttribute("data-hot", r.getAttribute("data-k")); });
      r.addEventListener("mouseleave", function () { root.setAttribute("data-sel", DEF); root.removeAttribute("data-hot"); });
    });
    Array.prototype.forEach.call(tabs, function (t) {
      t.addEventListener("click", function () {
        var n = t.getAttribute("data-tab");
        Array.prototype.forEach.call(tabs, function (b) { var on = b === t; b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on ? "true" : "false"); });
        Array.prototype.forEach.call(panels, function (p, i) { p.classList.toggle("is-on", String(i + 1) === n); });
      });
    });

    if (reduced) return;

    // type-on (24ms per character), one row at a time, in step with its leader (see C.css)
    Array.prototype.forEach.call(rows, function (r, i) {
      var cells = r.querySelectorAll("[data-type]");
      var full = Array.prototype.map.call(cells, function (c) { return c.textContent; });
      Array.prototype.forEach.call(cells, function (c) { c.textContent = ""; });
      setTimeout(function () {
        Array.prototype.forEach.call(cells, function (c, j) {
          var s = full[j], n = 0;
          var iv = setInterval(function () { n++; c.textContent = s.slice(0, n); if (n >= s.length) clearInterval(iv); }, 24);
        });
      }, 2140 + i * 180);
    });
  }
};
