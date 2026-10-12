/* the-lab-instruments · S — the ledger opens in place, one row at a time (real buttons,
   aria-expanded / aria-controls; closed panels are inert). Demo: the rows cascade in closed,
   then 01 opens once (live: once, when 40% visible). Phones (≤767, outside the stitched
   1440 stage): every row rests closed, so the page stays short; a tap opens one. Reduced
   motion: the resting state (01 open; all closed on phones), no timers. init returns a
   cleanup (timers + listeners).                                                           */
window.KM = {
  init: function (root, opts) {
    if (!root) return function () {};
    var reduced = !!(opts && opts.reduced);
    var rows = Array.prototype.slice.call(root.querySelectorAll(".ac-row"));
    var timers = [], offs = [];
    function set(n) {
      rows.forEach(function (r, j) {
        var on = j === n;
        r.classList.toggle("is-open", on);
        r.querySelector(".ac-row__head").setAttribute("aria-expanded", String(on));
        r.querySelector(".ac-row__more").inert = !on;
      });
    }
    rows.forEach(function (r, j) {
      var b = r.querySelector(".ac-row__head");
      function click() {
        timers.forEach(clearTimeout); timers = [];
        set(r.classList.contains("is-open") ? -1 : j);
      }
      b.addEventListener("click", click);
      offs.push(function () { b.removeEventListener("click", click); });
    });
    function cleanup() { timers.forEach(clearTimeout); offs.forEach(function (f) { f(); }); }
    var phone = !document.documentElement.classList.contains("km-home") &&
      !!(window.matchMedia && window.matchMedia("(max-width: 767px)").matches);
    if (phone) set(-1);
    if (reduced) return cleanup;
    root.classList.add("ac-cold");
    set(-1);
    void root.offsetHeight;
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("ac-cold"); }); });
    if (!phone) timers.push(setTimeout(function () { set(0); }, 1500));
    return cleanup;
  }
};
