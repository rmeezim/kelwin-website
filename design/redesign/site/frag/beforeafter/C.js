window.KM = {
  init(root, { reduced }) {
    if (reduced) return;                         // reduced motion: the fully plotted sheet
    // mono change classes type on (24ms per character) as each IS line finishes plotting
    root.querySelectorAll(".km-beforeafter-C__chg").forEach((el, r) => {
      const v = el.dataset.v || el.textContent;
      el.textContent = "";
      const start = 1580 + r * 130 + 520;
      for (let i = 1; i <= v.length; i++) setTimeout(() => { el.textContent = v.slice(0, i); }, start + i * 24);
    });
  },
};
