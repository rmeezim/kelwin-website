window.KM = {
  init(root, { reduced }) {
    // ── the ledgers: one open row per ledger; clicking the open row closes it ──
    function setRow(row, on) {
      row.classList.remove("is-pre");
      row.classList.toggle("is-open", on);
      row.querySelector(".ac-row__head").setAttribute("aria-expanded", String(on));
      row.querySelector(".ac-row__more").inert = !on;
    }
    var ledgers = Array.prototype.slice.call(root.querySelectorAll(".km-fit-S__lg"));
    var pending = ledgers.map(function () { return 0; });       // one timed reveal per ledger
    ledgers.forEach(function (lg, k) {
      var rows = Array.prototype.slice.call(lg.querySelectorAll(".ac-row"));
      rows.forEach(function (r) {
        r.querySelector(".ac-row__head").addEventListener("click", function () {
          clearTimeout(pending[k]);                             // the reader drives this ledger from here
          // a row still held for its reveal shows "+", so a click on it opens it
          var was = r.classList.contains("is-open") && !r.classList.contains("is-pre");
          rows.forEach(function (o) { setRow(o, false); });
          if (!was) setRow(r, true);
        });
      });
    });

    if (reduced) return;                                        // final markup: F-02 + D-01 open, no timers

    // ── reveal: the two resting rows keep their open height from the first frame, so the
    //    rows below them never move. Their answers are held (.is-pre) while the rows cascade
    //    in, then open in reading order: F-02 "Someone will own it", then D-01 "Outsource-it-forever" ──
    var open = ledgers.map(function (lg) { return lg.querySelector(".ac-row.is-open"); });
    if (!open.some(Boolean)) return;
    root.classList.add("ac-cold");
    open.forEach(function (r) { if (r) r.classList.add("is-pre"); });
    void root.offsetHeight;
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("ac-cold"); }); });
    [1300, 1620].forEach(function (t, k) {
      if (open[k]) pending[k] = setTimeout(function () { open[k].classList.remove("is-pre"); }, t);
    });
  }
};
