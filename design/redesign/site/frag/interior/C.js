/* interior · C — SHEET C·01.
   · spec rows A–D light their lettered callout + leader on hover (data-hot);
   · mono cell IDs type on in drafting order (24ms per character);
   · demo of the scroll-linked index: [01] → [02] at ~3.6s (the manifest rows take the highlight
     in raster order), then back to [01] at ~5.1s — on the live site the index follows the reader;
   · an X/Y readout on the right frame edge follows the cursor.                                   */
window.KM = {
  init: function (root, opt) {
    if (!root) return;
    var reduced = opt && opt.reduced;
    Array.prototype.forEach.call(root.querySelectorAll(".km-interior-C__row[data-key]"), function (row) {
      row.addEventListener("mouseenter", function () { root.setAttribute("data-hot", row.getAttribute("data-key")); });
      row.addEventListener("mouseleave", function () { root.removeAttribute("data-hot"); });
    });
    Array.prototype.forEach.call(root.querySelectorAll(".km-interior-C__tab"), function (tab) {
      tab.addEventListener("click", function (e) { e.preventDefault(); setTab(tab.getAttribute("data-tab")); });
    });
    function setTab(n) {
      root.setAttribute("data-tab", n);
      Array.prototype.forEach.call(root.querySelectorAll(".km-interior-C__tab"), function (t) {
        if (t.getAttribute("data-tab") === String(n)) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
      });
    }
    var xy = root.querySelector(".km-interior-C__xy");
    root.addEventListener("mousemove", function (e) {
      var r = root.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      xy.textContent = "X " + x.toFixed(2) + " · Y " + y.toFixed(2);
    });
    if (reduced) return;
    // mono cell IDs type on in drafting order (24ms per character)
    Array.prototype.forEach.call(root.querySelectorAll(".km-interior-C__cellid, .km-interior-C__ctak, .km-interior-C__fig"), function (el, n) {
      var full = el.textContent; el.textContent = "";
      var i = 0;
      setTimeout(function step() { i += 1; el.textContent = full.slice(0, i); if (i < full.length) setTimeout(step, 24); }, 420 + n * 160);
    });
    setTimeout(function () { setTab(2); }, 3600);
    setTimeout(function () { setTab(1); }, 5100);
  }
};
