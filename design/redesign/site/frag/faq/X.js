window.KM = {
  init(root, { reduced }) {
    const rows = Array.from(root.querySelectorAll(".ac-row"));
    const timers = [];

    // one row open at a time (or none): + turns to −, the selection rule draws, the answer unfolds
    function set(n) {
      rows.forEach((r, j) => {
        const on = j === n;
        r.classList.toggle("is-open", on);
        r.querySelector(".ac-row__head").setAttribute("aria-expanded", String(on));
        r.querySelector(".ac-row__more").inert = !on;
      });
    }
    rows.forEach((r, j) => {
      r.querySelector(".ac-row__head").addEventListener("click", () => {
        timers.forEach(clearTimeout);                       // the reader drives from the first click
        set(r.classList.contains("is-open") ? -1 : j);
      });
    });

    if (reduced) return;                                    // resting state from the markup: 01 open, no timers

    // demo: the ledger draws in closed, then 01 (the top of the reading path) opens once, as the
    // last row lands. That single opening is the section's one moment (live: once, when 40% visible).
    root.classList.add("ac-cold");
    set(-1);
    void root.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("ac-cold")));
    timers.push(setTimeout(() => set(0), 1600));
  },
};
