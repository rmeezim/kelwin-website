window.KM = {
  init(root, { reduced }) {
    var ledgers = Array.prototype.slice.call(root.querySelectorAll(".km-fit-B__ledger"));
    function set(row, on) {
      row.classList.toggle("is-open", on);
      var b = row.querySelector(".km-fit-B__btn");
      if (b) b.setAttribute("aria-expanded", String(on));
    }
    // one open row per ledger; clicking the open row closes it
    ledgers.forEach(function (lg) {
      var rows = Array.prototype.slice.call(lg.querySelectorAll(".km-fit-B__row"));
      rows.forEach(function (r) {
        var b = r.querySelector(".km-fit-B__btn");
        if (!b) return;
        b.addEventListener("click", function () {
          var was = r.classList.contains("is-open");
          rows.forEach(function (o) { set(o, false); });
          if (!was) set(r, true);
        });
      });
    });
    if (reduced) return;
    // Demo: Built for rests with N·02 open; the Not-for ledger lands closed and,
    // once both ledgers are drawn, opens N·06 in place (~2.2s). Final = both open.
    var no = root.querySelector(".km-fit-B__ledger--no .km-fit-B__row.is-open");
    if (!no) return;
    root.classList.add("is-cold");
    set(no, false);
    void root.offsetHeight;
    root.classList.remove("is-cold");
    setTimeout(function () { set(no, true); }, 2200);
  }
};
