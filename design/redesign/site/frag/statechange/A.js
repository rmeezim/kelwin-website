window.KM = {
  init(root, { reduced }) {
    const plate = root.querySelector(".km-statechange-A__plate");
    const num = root.querySelector(".km-statechange-A__dnum");
    const delta = root.querySelector(".km-statechange-A__delta");
    const btns = Array.from(root.querySelectorAll(".km-statechange-A__seg button"));
    const N = 5;                                   // Q2–Q6 each carry the quarter before them
    let timers = [];
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const show = (n) => {
      num.textContent = String(n);
      delta.setAttribute("aria-label", `Delta: ${n} of ${N} quarters carried forward`);
    };

    function setState(s, instant) {
      clear();
      if (instant) plate.classList.add("is-instant");
      plate.dataset.state = s;
      btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.to === s)));
      if (s === "system") {
        // the reading counts 0 → 5 as each quarter's corner closes around the last (900ms + 120ms stagger)
        if (instant) show(N);
        else for (let i = 1; i <= N; i++) timers.push(setTimeout(() => show(i), 900 + i * 120));
      } else {
        show(0);
      }
      if (instant) { void plate.offsetHeight; plate.classList.remove("is-instant"); }
    }

    btns.forEach((b) => b.addEventListener("click", () => { if (plate.dataset.state !== b.dataset.to) setState(b.dataset.to); }));
    show(N);

    if (reduced) return;                           // reduced motion: the final (System) state, no demo
    setState("entropy", true);                     // the plate opens on Entropy …
    timers.push(setTimeout(() => setState("system"), 2400));   // … and advances once (live site: at 50% visible)
  },
};
