/* capability-services · T — the ledger opens in place (kit .ac-row). Each row's head is a real
   button (aria-expanded / aria-controls); rows open independently; 02.1 rests open. On phones
   (≤767) the two rows that carry a reading (02.1, 02.4) rest open and stay open — no reading
   hidden behind a toggle — and their buttons say so; 02.2 and 02.3 keep the toggle.        */
window.KM = {
  init: function (root) {
    if (!root) return function () {};
    var rows = root.querySelectorAll(".ac-row"), off = [];
    var mq = window.matchMedia ? window.matchMedia("(max-width: 767px)") : null;
    function phone() { return !!(mq && mq.matches && !document.documentElement.classList.contains("km-home")); }
    function set(row, open) {
      row.classList.toggle("is-open", open);
      var b = row.querySelector(".ac-row__head"); if (b) b.setAttribute("aria-expanded", String(open));
    }
    function reading(r) { return r.classList.contains("km-capability-services-T__rrow"); }
    function sync() { if (phone()) rows.forEach(function (r) { if (reading(r)) set(r, true); }); }
    rows.forEach(function (row) {
      var b = row.querySelector(".ac-row__head"); if (!b) return;
      function flip() { if (phone() && reading(row)) return; set(row, !row.classList.contains("is-open")); }
      b.addEventListener("click", flip);
      off.push(function () { b.removeEventListener("click", flip); });
    });
    sync();
    if (mq && mq.addEventListener) { mq.addEventListener("change", sync); off.push(function () { mq.removeEventListener("change", sync); }); }
    return function () { off.forEach(function (f) { f(); }); };
  }
};
