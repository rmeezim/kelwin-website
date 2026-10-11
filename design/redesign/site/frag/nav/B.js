window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    var demo = root.querySelector(".km-nav-B__row.is-hover");
    var trigger = root.querySelector(".km-nav-B__item.is-open");
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && trigger) { trigger.setAttribute("aria-expanded", "false"); trigger.focus(); }
    });
    // a real pointer takes over from the demo hover
    root.addEventListener("pointermove", function once() {
      if (demo) demo.classList.remove("is-hover");
      root.removeEventListener("pointermove", once);
    });
    if (reduced || !demo) return;
    // demo: the ledger draws from the spine, then the pointer rests on
    // N·02 GTM Infrastructure at ~2.0s (row fills, name steps 8px right)
    root.classList.add("no-tr");
    demo.classList.remove("is-hover");
    void root.offsetWidth;
    root.classList.remove("no-tr");
    setTimeout(function () { demo.classList.add("is-hover"); }, 2000);
  }
};
