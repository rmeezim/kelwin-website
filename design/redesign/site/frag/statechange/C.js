window.KM = {
  init(root, { reduced }) {
    // interaction: hovering a spec row lights its lettered callout + leader
    root.querySelectorAll(".km-statechange-C__row").forEach((row) => {
      row.addEventListener("mouseenter", () => { root.dataset.hl = row.dataset.k; });
      row.addEventListener("mouseleave", () => { delete root.dataset.hl; });
    });

    if (reduced) return;
    // mono values type on, 24ms per character, in drafting order
    root.querySelectorAll("[data-type]").forEach((el) => {
      const text = el.textContent, at = +el.dataset.at || 0;
      el.textContent = "";
      setTimeout(() => {
        let i = 0;
        const step = () => { el.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(step, 24); };
        step();
      }, at);
    });
  },
};
