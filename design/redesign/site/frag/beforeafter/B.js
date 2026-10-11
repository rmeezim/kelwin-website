window.KM = {
  init(root, { reduced }) {
    const rows = Array.from(root.querySelectorAll(".km-beforeafter-B__row"));
    const set = (row, open) => {
      row.classList.toggle("is-open", open);
      row.querySelector(".km-beforeafter-B__btn").setAttribute("aria-expanded", String(open));
    };
    // one row open at a time: clicking a row opens it in place and closes the others
    rows.forEach((row) => row.querySelector(".km-beforeafter-B__btn").addEventListener("click", () => {
      const open = !row.classList.contains("is-open");
      rows.forEach((r) => set(r, false));
      set(row, open);
    }));

    if (reduced) return;                       // reduced motion: the resting state, N·03 open
    root.classList.add("is-cold");             // demo: start with every row closed …
    set(rows[2], false);
    void root.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-cold")));
    setTimeout(() => set(rows[2], true), 2900); // … then N·03 (Compounding) opens once the system has arrived
  },
};
