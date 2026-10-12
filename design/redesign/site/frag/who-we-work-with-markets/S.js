/* who-we-work-with · markets · S — the ledger opens in place, one row at a time; clicking the
   open row closes it. Rows are real buttons (aria-expanded / aria-controls); closed panels are
   inert. Entrance: I·01 keeps its open height from the first frame but holds its line (.is-pre)
   until the rows have landed, then opens (once). Reduced motion: final markup, no timers.
   Returns a cleanup (listeners and the timer).                                               */
window.KM = {
  init: function (root, opts) {
    if (!root) return function () {};
    var reduced = !!(opts && opts.reduced);
    var rows = Array.prototype.slice.call(root.querySelectorAll(".km-who-we-work-with-markets-S__lg > .ac-row"));
    var off = [], timer = 0;
    function setRow(r, open) {
      r.classList.remove("is-pre");
      r.classList.toggle("is-open", open);
      r.querySelector(".ac-row__head").setAttribute("aria-expanded", String(open));
      r.querySelector(".ac-row__more").inert = !open;
    }
    rows.forEach(function (r) {
      var head = r.querySelector(".ac-row__head");
      function click() {
        clearTimeout(timer);                                   // the reader drives it from here
        var was = r.classList.contains("is-open") && !r.classList.contains("is-pre");
        rows.forEach(function (o) { setRow(o, false); });
        if (!was) setRow(r, true);
      }
      head.addEventListener("click", click);
      off.push(function () { head.removeEventListener("click", click); });
    });

    if (!reduced) {
      var first = root.querySelector(".km-who-we-work-with-markets-S__lg > .ac-row.is-open");
      if (first) {
        root.classList.add("ac-cold");
        first.classList.add("is-pre");
        void root.offsetHeight;
        requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("ac-cold"); }); });
        timer = setTimeout(function () { first.classList.remove("is-pre"); }, 1250);
      }
    }
    return function () {
      clearTimeout(timer);
      off.forEach(function (f) { f(); });
      rows.forEach(function (r) { r.classList.remove("is-pre"); });
    };
  }
};
