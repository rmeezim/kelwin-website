/* method · U — FIG. 05 Phase track.
   All entrance motion is CSS keyed off .is-play on an ancestor; the audit's "10" is static
   (the page's one counter belongs to the system). This script only:
   · on the homepage (html.km-home) holds the figure on its first frame until the plate is 35%
     in view — the stitch starts a section when only its heading is on screen; it plays once;
   · pauses the Calibrate packet while the section is off screen.
   Reduced motion: no .is-play, the markup is the final state, no timers, no loop. */
window.KM = {
  init(root, { reduced }) {
    if (reduced || !("IntersectionObserver" in window)) return;
    const plate = root.querySelector(".km-method-U__plate");
    if (plate && document.documentElement.classList.contains("km-home")) {
      root.setAttribute("data-wait", "");
      const gate = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) { root.removeAttribute("data-wait"); gate.disconnect(); }
      }, { threshold: 0.35 });
      gate.observe(plate);
    }
    const idle = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) root.removeAttribute("data-idle"); else root.setAttribute("data-idle", ""); });
    }, { threshold: 0 });
    idle.observe(root);
  }
};
