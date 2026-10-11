/* method · S — "It starts with the audit."
   All entrance motion is CSS, keyed off .is-play on an ancestor (html in the standalone page,
   the section's slot on the stitched homepage): the ruler calibrates edge to edge, the bars
   extend phase by phase (Diagnose first, in red), the Handover datum draws down, Calibrate
   runs out past the edge, then one 6px packet rides it off the page every 9.6s.
   This script only times things honestly:
   · on the homepage (html.km-home) the slot plays as soon as it peeks in, when only the
     statement is on screen — so the track's animations wait, paused on their first frame,
     until the track itself is 30% in view (the head still plays on arrival);
   · the packet pauses whenever the section is off screen.
   · ≤ 760px the phases become a swipe track; while it actually scrolls sideways it is made a
     keyboard stop (tabindex 0, named by its aria-label) so arrow keys can move it — on desktop
     it stays out of the tab order. This runs under reduced motion too.
   Reduced motion: no .is-play, so the final state renders and no packet exists; no timers. */
window.KM = {
  init(root, { reduced }) {
    const rows = root.querySelector(".km-method-S__rows");
    if (rows) {
      const sync = () => {
        if (rows.scrollWidth > rows.clientWidth + 1) rows.setAttribute("tabindex", "0");
        else rows.removeAttribute("tabindex");
      };
      sync();
      window.addEventListener("resize", sync, { passive: true });
    }
    if (reduced || !("IntersectionObserver" in window)) return;
    const track = root.querySelector(".km-method-S__track");
    if (track && document.documentElement.classList.contains("km-home")) {
      root.setAttribute("data-wait", "");
      const gate = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) { root.removeAttribute("data-wait"); gate.disconnect(); }
      }, { threshold: 0.3 });
      gate.observe(track);
    }
    const idle = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) root.removeAttribute("data-idle"); else root.setAttribute("data-idle", ""); });
    }, { threshold: 0 });
    idle.observe(root);
  }
};
