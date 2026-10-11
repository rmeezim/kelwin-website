/* stack · B — the ledger opens in place; one row open at a time. */
window.KM = {
  init: function (root, opt) {
    if (!root) return;
    var ledger = root.querySelector(".km-stack-B__ledger");
    var rows = Array.prototype.slice.call(root.querySelectorAll(".km-stack-B__row"));
    function open(i) {
      rows.forEach(function (r, j) {
        var on = j === i;
        r.classList.toggle("is-open", on);
        r.querySelector(".km-stack-B__head").setAttribute("aria-expanded", on ? "true" : "false");
      });
    }
    rows.forEach(function (r, j) {
      r.querySelector(".km-stack-B__head").addEventListener("click", function () {
        open(r.classList.contains("is-open") ? -1 : j);
      });
    });
    if (opt && opt.reduced) return;           // reduced motion: N·03 stays open (the final state)
    // demo: the ledger arrives with N·01 open, then N·01 closes and N·03 opens in place.
    ledger.classList.add("is-snap");
    open(0);
    void ledger.offsetWidth;
    ledger.classList.remove("is-snap");
    setTimeout(function () { open(2); }, 1800);
  }
};
