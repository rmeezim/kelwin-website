/* method · W — "Phase ledger + track".
   All entrance motion is CSS, keyed off .is-play on an ancestor (html in the standalone page,
   the section's slot on the stitched homepage). This script only times things honestly:
   · on the homepage (html.km-home) the slot starts playing as soon as it peeks in, when only the
     head is on screen — so the instrument's animations wait, held on their first frame, until
     the panel itself is 35% in view (the head still plays on arrival). It plays once;
   · the Calibrate packet pauses whenever the section is off screen.
   Reduced motion: no .is-play, so the final state renders and no packet exists; no timers. */
window.KM = {
  init(root, { reduced }) {
    if (reduced || !("IntersectionObserver" in window)) return;
    const panel = root.querySelector(".km-method-W__panel");
    if (panel && document.documentElement.classList.contains("km-home")) {
      root.setAttribute("data-wait", "");
      const gate = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) { root.removeAttribute("data-wait"); gate.disconnect(); }
      }, { threshold: 0.35 });
      gate.observe(panel);
    }
    const idle = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) root.removeAttribute("data-idle"); else root.setAttribute("data-idle", ""); });
    }, { threshold: 0 });
    idle.observe(root);
  }
};
