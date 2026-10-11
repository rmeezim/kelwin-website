window.KM = {
  init(root, { reduced }) {
    const fig = root.querySelector(".km-beforeafter-X__fig");
    const btns = Array.from(root.querySelectorAll(".km-beforeafter-X__seg > button"));
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    let state = fig.classList.contains("is-before") ? "before" : "after";

    function control(s) { btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.to === s))); }
    function layout(s) {
      fig.classList.toggle("is-after", s === "after");
      fig.classList.toggle("is-before", s === "before");
    }

    // the switch (the section's one orchestrated moment); CSS carries the whole sequence:
    // 1 the control's fill moves (500ms);
    // 2 row by row, 01 → 06, 60ms apart, the receding voice settles to 17px --fg-2 (600ms);
    // 3 from 150ms the plates re-proportion across the seam, 7|5 ↔ 5|7 columns (900ms --ease-inout);
    // 4 from 250ms each row's rules are wiped and redrawn left → right (800ms);
    // 5 from 400ms the gaining voice swells to 32px --fg, 01 → 06 (600ms). Lands by ≈ 1.35s.
    // Transitions retarget mid-flight, so a second click simply reverses; there is no lock.
    function go(s, animate) {
      if (s === state) return;
      state = s;
      control(s);
      if (animate) { fig.classList.remove("is-drawing"); void fig.offsetWidth; fig.classList.add("is-drawing"); }
      layout(s);
    }

    btns.forEach((b) => b.addEventListener("click", () => {
      timers.splice(0).forEach(clearTimeout);   // the reader takes over: the demo switch is cancelled
      fig.classList.remove("is-cold");
      go(b.dataset.to, !reduced);
    }));

    if (reduced) return;                         // reduced motion: the resting After state, synchronously; no timers

    // demo: the plates open on Before (paper leads), the rows draw in 01 → 06 under html.is-play …
    fig.classList.add("is-cold");
    layout("before"); control("before"); state = "before";
    void fig.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => fig.classList.remove("is-cold")));
    // … Before holds for a readable beat, then the figure switches to After once
    // (live site: when the figure is 40% visible)
    later(() => go("after", true), 2600);
  },
};
