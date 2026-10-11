window.KM = {
  init(root, { reduced }) {
    // The core's number counts up once (A's numeral rule), landing with the plate.
    const num = root.querySelector(".km-cta-A__num");
    if (!num || reduced) return;
    const end = 10, pad = (n) => String(n).padStart(2, "0");
    num.textContent = pad(0);
    setTimeout(() => {
      const t0 = performance.now(), dur = 900;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        num.textContent = pad(Math.round(end * e));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 1550);
  },
};
