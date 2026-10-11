window.KM = {
  init(root, { reduced }) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".km-reframe-C__tab"));
    function set(k) {
      root.setAttribute("data-tab", k);
      tabs.forEach(function (t) { t.setAttribute("aria-selected", String(t.getAttribute("data-k") === k)); });
    }
    tabs.forEach(function (t) { t.addEventListener("click", function () { set(t.getAttribute("data-k")); }); });
    if (reduced) return;

    // drafting order: no layer is "under discussion" until the drawing is plotted,
    // then the red plane drops into K1 (opacity + 8px settle).
    root.classList.add("is-unplotted");
    setTimeout(function () { root.classList.remove("is-unplotted"); }, 2200);

    // mono values type on (24ms per character)
    var typed = root.querySelectorAll("[data-type]");
    Array.prototype.forEach.call(typed, function (el, n) {
      var full = el.textContent, i = 0;
      el.textContent = "";
      setTimeout(function tick() {
        i += 1; el.textContent = full.slice(0, i);
        if (i < full.length) setTimeout(tick, 24);
      }, 420 + n * 160);
    });

    // demo of the scroll-linked stepper: A → B → C → back to A, every 1.1s
    // (on the live site each tab is pinned to a scroll step; the plane follows).
    setTimeout(function () { set("B"); }, 3200);
    setTimeout(function () { set("C"); }, 4300);
    setTimeout(function () { set("A"); }, 5400);
  }
};
