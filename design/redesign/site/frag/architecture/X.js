window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    const P = "km-architecture-X";
    const rows = Array.from(root.querySelectorAll(`.${P}__row`));
    const cell = root.querySelector("[data-statecell]");
    const timers = [];
    let openK = "d";

    // data-sel drives the segment, its tag and its row together
    const sel = (k) => root.setAttribute("data-sel", k || "");
    const open = (k) => {
      openK = k;
      rows.forEach((r) => {
        const on = r.dataset.k === k;
        r.classList.toggle("is-open", on);
        r.querySelector(".ac-row__head").setAttribute("aria-expanded", String(on));
      });
      sel(k);
    };
    const stop = () => {
      while (timers.length) clearTimeout(timers.pop());
      if (cell) cell.textContent = "Closed";
    };

    // ledger: exactly one row open; hover / focus previews a row's segment
    rows.forEach((r) => {
      const head = r.querySelector(".ac-row__head");
      head.addEventListener("click", () => { stop(); open(r.dataset.k); });
      r.addEventListener("mouseenter", () => sel(r.dataset.k));
      r.addEventListener("mouseleave", () => sel(openK));
      head.addEventListener("focus", () => sel(r.dataset.k));
      head.addEventListener("blur", () => sel(openK));
    });

    if (reduced) return; // final state straight from the markup: loop closed, D · Retune open

    // demo (live site: starts when the plate is 40% visible). The loop opens empty and "Open";
    // each segment lights its row as it draws (A → B → C), the red return draws last (D),
    // the title block flips to "Closed" and D opens in place. The CSS plays the drawing.
    root.classList.add("ac-cold");
    rows.forEach((r) => { r.classList.remove("is-open"); r.querySelector(".ac-row__head").setAttribute("aria-expanded", "false"); });
    openK = null;
    sel("");
    if (cell) cell.textContent = "Open";
    root.getBoundingClientRect();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("ac-cold")));

    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    at(800, () => sel("a"));            // A · define draws into 01
    at(1250, () => sel("b"));           // B · activate, 01 → 02
    at(1900, () => sel("c"));           // C · measure, 02 → 03
    at(2550, () => sel(""));            // output leaves; the loop is still open
    at(2950, () => sel("d"));           // D · retune: the red return draws under the line, 03 → 01
    at(3950, () => { if (cell) cell.textContent = "Closed"; open("d"); });
  }
};
