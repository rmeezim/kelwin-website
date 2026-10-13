/* who-we-work-with · situations · S — the kit ledger, one row open at a time; clicking the open
   row closes it. Rows are real buttons (aria-expanded / aria-controls); closed panels are inert.
   Arriving on a row's anchor (#founder-seller · #plateaued-motion · #misheard-category), or
   following a link to one later, opens that row and keeps it where the anchor put it: the other
   rows fold at once (no transition, .is-instant), then the row is aligned to its 112px scroll
   margin, so a row that folds above the target can never pull it out of view. No timers; the
   same under reduced motion. Returns a cleanup (listeners, frames).                           */
window.KM = {
  init: function (root) {
    if (!root) return function () {};
    var rows = Array.prototype.slice.call(root.querySelectorAll(".km-who-we-work-with-situations-S__row"));
    var off = [], raf = [];
    function setRow(r, open) {
      r.classList.toggle("is-open", open);
      r.querySelector(".ac-row__head").setAttribute("aria-expanded", String(open));
      r.querySelector(".ac-row__more").inert = !open;
    }
    function only(r) { rows.forEach(function (o) { setRow(o, o === r); }); }
    function riseOffset(el) {   /* the entrance's current translateY, in viewport px (the stage may be zoomed) */
      var t = getComputedStyle(el).transform, m = t && t !== "none" ? t.match(/matrix(3d)?\(([^)]+)\)/) : null;
      if (!m) return 0;
      var v = m[2].split(","), y = parseFloat(v[m[1] ? 13 : 5]) || 0;
      var k = el.offsetHeight ? el.getBoundingClientRect().height / el.offsetHeight : 1;
      return y * k;
    }
    function on(el, ev, fn) { el.addEventListener(ev, fn); off.push(function () { el.removeEventListener(ev, fn); }); }
    rows.forEach(function (r) {
      on(r.querySelector(".ac-row__head"), "click", function () {
        if (r.classList.contains("is-open")) setRow(r, false); else only(r);
      });
    });
    function fromHash() {
      var id = (location.hash || "").slice(1), r = null;
      for (var i = 0; i < rows.length; i++) if (rows[i].id === id) r = rows[i];
      if (!r) return;
      root.classList.add("is-instant");
      only(r);
      void r.offsetHeight;   /* the fold lands now, not over 360ms */
      r.scrollIntoView({ block: "start", behavior: "instant" });
      /* align the row's settled box, not its entrance: when the slot has just played, the kit
         cascade still holds the row 12px low (ac-up), and it would settle above its margin */
      var d = riseOffset(r);
      if (d) window.scrollBy({ top: -d, behavior: "instant" });
      raf.push(requestAnimationFrame(function () {
        raf.push(requestAnimationFrame(function () { root.classList.remove("is-instant"); }));
      }));
    }
    fromHash();
    on(window, "hashchange", fromHash);
    return function () {
      off.forEach(function (f) { f(); });
      raf.forEach(function (id) { cancelAnimationFrame(id); });
      root.classList.remove("is-instant");
    };
  }
};
