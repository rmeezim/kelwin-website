window.KM = {
  init(root, { reduced }) {
    // B's ledgers open in place, one row at a time.
    const rows = [...root.querySelectorAll(".km-cta-B__row")];
    const open = (row) => rows.forEach((r) => {
      const on = r === row && !r.classList.contains("is-open");
      r.classList.toggle("is-open", on);
      r.querySelector(".km-cta-B__rb").setAttribute("aria-expanded", String(on));
    });
    rows.forEach((r) => r.querySelector(".km-cta-B__rb").addEventListener("click", () => open(r)));
    if (reduced) return;
    // demo: the ledger arrives closed, then its second row opens (~1.9s)
    const second = rows[1];
    if (!second) return;
    second.classList.remove("is-open");
    second.querySelector(".km-cta-B__rb").setAttribute("aria-expanded", "false");
    setTimeout(() => open(second), 1800);
  },
};
