/* method · V — FIG. 05 Phase track.
   All entrance motion is CSS keyed off .is-play on an ancestor. This script only:
   · counts the audit's label 01 → 10 working days while the red bar extends (it starts on the
     bar's own animationstart, so it stays in step when the homepage holds the plate);
   · on the homepage (html.km-home) holds the plate on its first frame until it is 35% in
     view — the stitch starts a section at 22%, when only the heading is on screen;
   · pauses the Calibrate packet while the section is off screen.
   Reduced motion: no .is-play, the markup is the final state ("10"), no timers, no loop. */
window.KM = {
  init(root, { reduced }) {
    if (reduced) return;
    const bar = root.querySelector(".km-method-V__bar--1");
    const count = root.querySelector("[data-count]");
    if (bar && count) {
      let raf = 0;
      bar.addEventListener("animationstart", (e) => {
        if (e.target !== bar) return;
        cancelAnimationFrame(raf);
        const t0 = performance.now();
        const dur = 700;
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          count.textContent = String(Math.max(1, Math.round(p * 10))).padStart(2, "0");
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        count.textContent = "01";
        raf = requestAnimationFrame(tick);
      });
    }
    if (!("IntersectionObserver" in window)) return;
    const plate = root.querySelector(".km-method-V__plate");
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
