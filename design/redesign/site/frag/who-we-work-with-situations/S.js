/* who-we-work-with · situations · S — each case file tells the header's break chart which
   situation is in focus (pointer over the row, or keyboard focus inside it), so the red fracture
   up there follows the reader. Event: "km:wwww-situation" on document, detail { n: 1|2|3 | 0 }.
   No motion here (a still beat); the same under reduced motion. Returns a cleanup.           */
window.KM = {
  init: function (root) {
    if (!root) return function () {};
    var rows = Array.prototype.slice.call(root.querySelectorAll(".km-who-we-work-with-situations-S__row"));
    var off = [];
    function say(n) {
      try { document.dispatchEvent(new CustomEvent("km:wwww-situation", { detail: { n: n } })); } catch (e) {}
    }
    function on(el, ev, fn) { el.addEventListener(ev, fn); off.push(function () { el.removeEventListener(ev, fn); }); }
    rows.forEach(function (r) {
      var n = +r.getAttribute("data-n");
      on(r, "mouseenter", function () { say(n); });
      on(r, "mouseleave", function () { if (!r.contains(document.activeElement)) say(0); });
      on(r, "focusin", function () { say(n); });
      on(r, "focusout", function (e) { if (!r.contains(e.relatedTarget)) say(0); });
    });
    return function () { off.forEach(function (f) { f(); }); say(0); };
  }
};
