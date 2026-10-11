window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    // interaction: hovering a lettered spec row lights its callout in the drawing
    root.querySelectorAll(".km-cta-C__row[data-k]").forEach((row) => {
      row.addEventListener("mouseenter", () => { root.dataset.hl = row.dataset.k; });
      row.addEventListener("mouseleave", () => { delete root.dataset.hl; });
    });
    if (reduced) return;
    // entrance: mono values type on, 24ms per character, in drafting order
    const order = [".km-cta-C__notelabel", ".km-cta-C__fig", ".km-cta-C__spechead [data-type]", ".km-cta-C__act--contact .km-cta-C__id", ".km-cta-C__act--audit .km-cta-C__id"];
    const at = [420, 640, 820, 1300, 3150];
    order.forEach((sel, n) => {
      root.querySelectorAll(sel).forEach((el, i) => {
        const text = el.textContent;
        el.textContent = "";
        setTimeout(() => {
          let k = 0;
          const step = () => { el.textContent = text.slice(0, ++k); if (k < text.length) setTimeout(step, 24); };
          step();
        }, at[n] + i * 120);
      });
    });
  },
};
