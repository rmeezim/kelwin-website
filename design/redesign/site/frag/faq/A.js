window.KM = {
  init: function (root, opts) {
    var rows = [].slice.call(root.querySelectorAll(".km-faq-A__row"));
    var timer = null;
    function set(n) {
      rows.forEach(function (r, j) {
        var on = j === n;
        r.classList.toggle("is-open", on);
        r.querySelector(".km-faq-A__q").setAttribute("aria-expanded", String(on));
      });
    }
    rows.forEach(function (r, j) {
      r.querySelector(".km-faq-A__q").addEventListener("click", function () {
        clearTimeout(timer);
        set(r.classList.contains("is-open") ? -1 : j);
      });
    });
    if (opts && opts.reduced) return;
    // Demo: 01 opens with the entrance; at 2.4s the System Audit strip takes over —
    // 01 folds while 02 unfolds (900ms), and the red core leaves 01 and lands in 02.
    timer = setTimeout(function () { set(1); }, 2400);
  }
};
