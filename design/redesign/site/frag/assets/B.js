/* assets · B — the handover manifest. CSS plays the handover (the sheet hangs open from the spine, then
   each custody box fills and its holder reads Kelwin → Yours, top-down); JS keeps exactly one row open
   and, in the demo, opens N·01 onto its contents once every asset has changed hands. */
window.KM = {
  init: function (root, opt) {
    if (!root) return;
    var sheet = root.querySelector(".km-assets-B__sheet");
    var rows = Array.prototype.slice.call(root.querySelectorAll(".km-assets-B__row"));
    function open(i) {
      rows.forEach(function (r, j) {
        var on = j === i;
        r.classList.toggle("is-open", on);
        r.querySelector(".km-assets-B__head").setAttribute("aria-expanded", on ? "true" : "false");
      });
    }
    rows.forEach(function (r, j) {
      r.querySelector(".km-assets-B__head").addEventListener("click", function () {
        open(r.classList.contains("is-open") ? -1 : j);
      });
    });
    if (opt && opt.reduced) return;               // reduced motion: handed over, N·01 open
    sheet.classList.add("is-snap");               // demo: arrives closed …
    open(-1);
    void sheet.offsetWidth;
    sheet.classList.remove("is-snap");
    setTimeout(function () { open(0); }, 3350);   // … and N·01 opens once everything is yours
  }
};
