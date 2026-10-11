window.KM = {
  init(root, { reduced }) {
    // The one scripted piece: the numeral counts the days (00 → 10) while the ten ticks settle.
    // Reduced motion: the markup already reads "10" over an even ruler, so start nothing.
    const num = root.querySelector(".km-cta-X__n");
    if (reduced || !num) return;

    const pad = (v) => String(v).padStart(2, "0");
    const w = num.getBoundingClientRect().width;            // hold the resting "10" box so "working days" never moves
    num.style.width = w + "px";
    num.textContent = pad(0);
    setTimeout(() => {
      const t0 = performance.now(), dur = 1500;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;   // ease-in-out, in step with the settle
        num.textContent = pad(Math.round(10 * e));
        if (k < 1) requestAnimationFrame(step); else num.style.width = "";
      };
      requestAnimationFrame(step);
    }, 1300);
  },
};
