/* handover · W — the rows complete, one by one.
   The CSS holds every timing; this file only decides WHEN. It arms the ledger (.is-arm: dashed glyphs,
   unstruck befores, no afters) and starts the run (.is-run). Standalone: both at once, the CSS delays let
   the head land first. On the homepage (html.km-home) the run waits until the ledger itself is well in
   view, so no row completes below the fold. Reduced motion, narrow screens or no script: nothing is armed,
   and the default CSS is the final, handed-over state. */
window.KM = {
  init: function (root, opts) {
    if (!root || (opts && opts.reduced)) return;
    if (window.matchMedia && window.matchMedia("(max-width: 760px)").matches) return;
    var led = root.querySelector(".km-handover-W__led");
    if (!led) return;
    var t = Date.now();
    root.classList.add("is-arm");
    var home = document.documentElement.classList.contains("km-home");
    if (!home || !("IntersectionObserver" in window)) { root.classList.add("is-run"); return; }
    var io = new IntersectionObserver(function (es) {
      for (var k = 0; k < es.length; k++) {
        if (!es[k].isIntersecting) continue;
        io.disconnect();
        /* give the rows' own entrance (≈1.2s after the section arrives) time to land first */
        var wait = Math.max(300, 1200 - (Date.now() - t));
        root.style.setProperty("--hw-t0", wait + "ms");
        root.classList.add("is-run");
        return;
      }
    }, { threshold: 0.6 });
    io.observe(led);
  }
};
