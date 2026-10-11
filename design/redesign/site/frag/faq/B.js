window.KM = {
  init: function (root, opts) {
    var rows = [].slice.call(root.querySelectorAll(".km-faq-B__row"));
    var timer = null;
    function set(n) {
      rows.forEach(function (r, j) {
        var on = j === n;
        r.classList.toggle("is-open", on);
        r.querySelector(".km-faq-B__btn").setAttribute("aria-expanded", String(on));
      });
    }
    rows.forEach(function (r, j) {
      r.querySelector(".km-faq-B__btn").addEventListener("click", function () {
        clearTimeout(timer);
        set(r.classList.contains("is-open") ? -1 : j);
      });
    });
    // Resting state (markup, reduced motion): N·02, the System Audit, is open with its red door.
    if (opts && opts.reduced) return;
    // Demo: the entrance arrives on N·01 (set without transitions), and at 2.1s the ledger
    // hands over to N·02 — 01 closes as 02 opens (360ms height + opacity, + turns to −).
    root.classList.add("is-init");
    set(0);
    void root.offsetHeight;
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("is-init"); }); });
    timer = setTimeout(function () { set(1); }, 2100);
  }
};
