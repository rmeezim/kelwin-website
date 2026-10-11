window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    var timer = null, sw = null;
    function select(n, instant) {
      if (instant) root.classList.add("no-tr");
      else { root.classList.add("is-switching"); clearTimeout(sw); sw = setTimeout(function () { root.classList.remove("is-switching"); }, 950); }
      root.setAttribute("data-sel", String(n));
      if (instant) { void root.offsetWidth; root.classList.remove("no-tr"); }
    }

    // live behaviour: hovering or focusing a strip selects it (its piece of
    // the mark turns red, its title lifts, the caption narrates it)
    root.querySelectorAll(".km-nav-A__strip").forEach(function (s) {
      var n = s.getAttribute("data-cap");
      s.addEventListener("mouseenter", function () { clearTimeout(timer); select(n); });
      s.addEventListener("focusin", function () { clearTimeout(timer); select(n); });
    });
    var trigger = root.querySelector(".km-nav-A__item.is-open");
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && trigger) { trigger.setAttribute("aria-expanded", "false"); trigger.focus(); }
    });

    if (reduced) { select(2, true); return; }
    // demo: the plate unrolls with nothing selected while the index mark assembles
    // (K1 → K2 → K3); at ~2.4s the pointer settles on CAP. 02 and K2 lands red
    select(0, true);
    timer = setTimeout(function () { select(2); }, 2400);
  }
};
