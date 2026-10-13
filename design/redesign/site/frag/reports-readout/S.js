/* reports-readout · S — the readout turns a spread at a time. The kit's segmented control is an
   ARIA tablist (roving tabindex; ← → ↑ ↓ Home End move and select); each spread is its tabpanel.
   Switching is a hard cut: the panel's hidden flag flips, nothing animates. Below 1024 one quiet
   "Next: …" button under the spread selects the next part and brings the control back into view.
   The markup's own state is part 1 shown (so nothing jumps when this runs); without script every
   spread is shown, stacked (CSS, scripting: none). The cleanup puts the authored state back. */
window.KM = {
  init(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.km-reports-readout-S__seg [role="tab"]'));
    if (!tabs.length) return function () {};
    var panels = tabs.map(function (t) { return root.querySelector("#" + t.getAttribute("aria-controls")); });
    var next = root.querySelector(".km-reports-readout-S__next");
    var bar = root.querySelector(".km-reports-readout-S__bar");
    function name(i) { return tabs[i].textContent.replace(/^\s*\d+\s*/, "").trim(); }
    function show(i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (panels[k]) panels[k].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (next) {
        if (i < tabs.length - 1) { next.hidden = false; next.textContent = "Next: " + name(i + 1); next.dataset.to = String(i + 1); }
        else { next.hidden = true; }
      }
    }
    function onClick(e) {
      var i = tabs.indexOf(e.currentTarget);
      if (i > -1) show(i, false);
    }
    function onKey(e) {
      var i = tabs.indexOf(e.currentTarget), n = tabs.length, to = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") to = (i + 1) % n;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = (i - 1 + n) % n;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = n - 1;
      if (to < 0) return;
      e.preventDefault(); show(to, true);
    }
    function onNext() {
      var to = +(next.dataset.to || 0);
      show(to, false);
      if (bar && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: "start" });
      tabs[to].focus({ preventScroll: true });
    }
    tabs.forEach(function (t) { t.addEventListener("click", onClick); t.addEventListener("keydown", onKey); });
    if (next) next.addEventListener("click", onNext);
    var start = 0;
    if (location.hash) panels.forEach(function (p, k) { if (p && "#" + p.id === location.hash) start = k; });
    show(start, false);
    return function () {
      tabs.forEach(function (t) { t.removeEventListener("click", onClick); t.removeEventListener("keydown", onKey); });
      if (next) { next.removeEventListener("click", onNext); next.hidden = true; next.textContent = "Next part"; }
      tabs.forEach(function (t, k) {
        t.setAttribute("aria-selected", k === 0 ? "true" : "false"); t.tabIndex = k === 0 ? 0 : -1;
        if (panels[k]) panels[k].hidden = k !== 0;
      });
    };
  }
};
