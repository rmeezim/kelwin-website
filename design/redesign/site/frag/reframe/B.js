window.KM = {
  init(root, { reduced }) {
    var rows = Array.prototype.slice.call(root.querySelectorAll(".km-reframe-B__row"));
    function open(i) {
      rows.forEach(function (r, k) {
        var on = k === i;
        r.classList.toggle("is-open", on);
        var b = r.querySelector(".km-reframe-B__btn");
        if (b) b.setAttribute("aria-expanded", String(on));
      });
    }
    rows.forEach(function (r, k) {
      var b = r.querySelector(".km-reframe-B__btn");
      if (b) b.addEventListener("click", function () { open(r.classList.contains("is-open") ? -1 : k); });
    });
    if (reduced) return;
    // Demo: N·01 rests open; once every symptom has been struck, the ledger opens N·02 in place.
    // On the live site rows open on click only (one open at a time).
    setTimeout(function () { open(1); }, 2500);
  }
};
