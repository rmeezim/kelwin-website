/* interior · B — the manifest ledger opens in place, one row at a time.
   Demo: the ledger arrives closed and S·01 opens at ~2.1s (the final, resting state). */
window.KM = {
  init: function (root, opt) {
    if (!root) return;
    var ledger = root.querySelector(".km-interior-B__ledger");
    var rows = Array.prototype.slice.call(root.querySelectorAll(".km-interior-B__row"));
    function open(i) {
      rows.forEach(function (r, j) {
        var on = j === i;
        r.classList.toggle("is-open", on);
        r.querySelector(".km-interior-B__rh").setAttribute("aria-expanded", on ? "true" : "false");
      });
    }
    rows.forEach(function (r, j) {
      r.querySelector(".km-interior-B__rh").addEventListener("click", function () {
        open(r.classList.contains("is-open") ? -1 : j);
      });
    });
    if (opt && opt.reduced) return;           // reduced motion: S·01 stays open (the final state)
    ledger.classList.add("is-snap");
    open(-1);
    void ledger.offsetWidth;
    ledger.classList.remove("is-snap");
    setTimeout(function () { open(0); }, 2100);
  }
};
