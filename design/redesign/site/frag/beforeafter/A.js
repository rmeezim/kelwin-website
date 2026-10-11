window.KM = {
  init(root, { reduced }) {
    const fig = root.querySelector(".km-beforeafter-A__fig");
    const btns = Array.from(root.querySelectorAll(".km-beforeafter-A__opt"));
    const ROWS = 6, SEAM = 900, FADE = 240;
    let state = "after";
    let busy = false;

    function control(s) { btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.to === s))); }
    function layout(s) {
      fig.classList.toggle("is-after", s === "after");
      fig.classList.toggle("is-before", s === "before");
    }
    function snap(s) { layout(s); control(s); fig.classList.toggle("is-cored", s === "after"); state = s; }

    // the orchestrated switch: control moves → both voices fade → the plates re-proportion across the seam
    // (900ms --ease-inout) → the voices return at their new sizes, row by row → the core seats (After only)
    function go(s) {
      if (busy || s === state) return;
      busy = true;
      control(s);
      fig.classList.remove("is-cored");
      fig.classList.add("is-fading");
      setTimeout(() => layout(s), FADE);
      setTimeout(() => fig.classList.remove("is-fading"), FADE + SEAM - 160);
      const land = FADE + SEAM - 160 + (ROWS - 1) * 60 + 420;
      setTimeout(() => { if (s === "after") fig.classList.add("is-cored"); }, land);
      setTimeout(() => { state = s; busy = false; }, land + 400);
    }

    btns.forEach((b) => b.addEventListener("click", () => go(b.dataset.to)));

    if (reduced) return;                       // reduced motion: the resting After state, no demo
    fig.classList.add("is-cold");              // the plate opens on Before …
    snap("before");
    void fig.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => fig.classList.remove("is-cold")));
    setTimeout(() => go("after"), 2400);       // … and advances once (live site: when 50% visible)
  },
};
