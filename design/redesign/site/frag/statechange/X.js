/* statechange · X — FIG. 06 accretion rings.
   Demo (≤ 6s): the plate opens on Entropy. Q1, Q2, Q3: a ring draws and collapses back to
   the centre (reset to zero). At Q4 the control flips to System: the red "installed" ring
   draws and stays, Q5–Q8 accrete outward (600ms each, 160ms stagger) and Δ counts 0 → 5 as
   each ring closes; the dimension then measures what was carried forward.
   Live site: the same sequence runs once at 40% visible; the first click stops it for good.
   Reduced motion: the static System drawing, no timers, no loops.                          */
window.KM = {
  init(root, { reduced }) {
    const plate = root.querySelector(".km-statechange-X__plate");
    const num = root.querySelector(".km-statechange-X__dnum");
    const delta = root.querySelector(".km-statechange-X__delta");
    const q = root.querySelector("[data-q]");
    const cell = root.querySelector("[data-statecell]");
    const pulse = root.querySelector(".km-statechange-X__pulse");
    const node = root.querySelector(".km-statechange-X__node");
    const btns = Array.from(root.querySelectorAll(".km-statechange-X__seg button"));
    const N = 5;                                          // Q4–Q8 stay
    const LAND = [520, 980, 1140, 1300, 1460];            // ring closes: red, then Q5–Q8 (380 + i·160 + 600)
    let timers = [];
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const show = (n) => {
      num.textContent = String(n);
      delta.setAttribute("aria-label", `Delta: ${n} quarters carried forward`);
    };

    // one reset quarter: the ring draws (counter-clockwise from the radius line), then collapses to zero
    const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
    function reset() {
      if (!pulse.animate) return;
      pulse.animate([
        { opacity: 1, strokeDashoffset: 1, transform: "scale(1, -1)", easing: ease },
        { opacity: 1, strokeDashoffset: 0, transform: "scale(1, -1)", offset: 0.56 },
        { opacity: 1, strokeDashoffset: 0, transform: "scale(1, -1)", offset: 0.62, easing: "cubic-bezier(0.55, 0, 0.9, 0.45)" },
        { opacity: 0.25, strokeDashoffset: 0, transform: "scale(0.04, -0.04)" },
      ], { duration: 720 });
      setTimeout(() => node.classList.add("is-on"), 690);   // the centre latches: back to zero
      setTimeout(() => node.classList.remove("is-on"), 1000);
    }

    function setState(s, instant) {
      clear();
      if (instant) plate.classList.add("ac-cold");
      plate.dataset.state = s;
      btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.to === s)));
      cell.textContent = s === "system" ? "System" : "Entropy";
      if (s === "system") {
        q.textContent = "Q1–Q3";
        if (instant) show(N);
        else LAND.forEach((t, i) => later(t, () => show(i + 1)));
      } else {
        q.textContent = "Q1–Q8";
        show(0);
        // after the rings retract, a quarter resets — and keeps resetting every 8s while Entropy holds
        // (the section's one ambient loop; the System's rider is hidden in this state)
        const loop = (ms) => later(ms, () => { reset(); loop(8000); });
        if (!instant) loop(760);
      }
      if (instant) { void plate.offsetHeight; plate.classList.remove("ac-cold"); }
    }

    btns.forEach((b) => b.addEventListener("click", () => {
      if (plate.dataset.state !== b.dataset.to) setState(b.dataset.to);
    }));
    show(N);

    if (reduced) return;                                   // final System drawing, nothing scheduled

    // the orchestrated moment
    setState("entropy", true);
    q.textContent = "Q1";
    later(900, reset);
    later(1500, () => { q.textContent = "Q1–Q2"; reset(); });
    later(2100, () => { q.textContent = "Q1–Q3"; reset(); });
    later(2700, () => setState("system"));                // Q4: the system is installed
  },
};
