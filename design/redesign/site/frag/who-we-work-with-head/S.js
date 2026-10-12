/* who-we-work-with · head · S — the break chart's one interaction.
   The red fracture follows the situation in focus: an elevation under the pointer here, or a
   situation row below (the situations section announces it with a "km:wwww-situation" event
   on document, detail { n: 1|2|3 | 0 }). 0 = nothing in focus → back to rest (01).
   The drawing, its order and its final state are CSS; this only moves the red and lights the
   matching flag. Returns a cleanup (listeners off). Works the same under reduced motion.      */
window.KM = {
  init: function (root) {
    if (!root) return function () {};
    var frame = root.querySelector(".km-who-we-work-with-head-S__frame");
    if (!frame) return function () {};
    var flags = Array.prototype.slice.call(frame.querySelectorAll(".km-who-we-work-with-head-S__flag"));
    var hits = Array.prototype.slice.call(frame.querySelectorAll(".km-who-we-work-with-head-S__hit"));
    var off = [];

    function set(n) {
      n = +n || 0;
      if (n) frame.setAttribute("data-on", String(n)); else frame.removeAttribute("data-on");
      var lit = n || 1;
      flags.forEach(function (f) { f.classList.toggle("is-on", +f.getAttribute("data-n") === lit); });
    }
    function on(el, ev, fn) { el.addEventListener(ev, fn); off.push(function () { el.removeEventListener(ev, fn); }); }

    hits.forEach(function (h) {
      on(h, "mouseenter", function () { set(h.getAttribute("data-n")); });
      on(h, "mouseleave", function () { set(0); });
    });
    on(document, "km:wwww-situation", function (e) { set(e && e.detail ? e.detail.n : 0); });

    return function () { off.forEach(function (f) { f(); }); set(0); };
  }
};
