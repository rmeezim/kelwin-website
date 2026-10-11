/* method · X — FIG. 08 Phase gantt.
   Demo (≤ 6s): the plate opens unbuilt. The ruler calibrates (ticks arrive off-pitch and
   settle), then the phases step 01 → 04 every 1.2s: the rail slides to the column, the column
   lifts from 36% to full, and that phase's bar extends from its origin under it (solid paper
   while active, settling to the neutral "done" tone once passed). With Diagnose, the value at
   its end counts 01 → 10 working days. At 04 the Calibrate bar extends in red and runs out
   through the plate edge.
   Live site: plays once at 40% visible, steps every 1.2s while in view; the first click or key
   stops it for good. Reduced motion: the final markup, no timers.                            */
window.KM = {
  init(root, { reduced }) {
    const $$ = (s) => Array.from(root.querySelectorAll(s));
    const cols = $$(".km-method-X__col");
    const bars = $$(".km-method-X__bar");
    const val = root.querySelector(".km-method-X__val");
    const cell = root.querySelector("[data-statecell]");
    const count = root.querySelector("[data-count]");
    const NAMES = ["Diagnose", "Architect", "Install", "Calibrate"];
    let timers = [];
    let raf = 0;
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));

    function set(a) {
      root.setAttribute("data-active", String(a));
      [cols, bars].forEach((list) => list.forEach((el, k) => {
        el.classList.toggle("is-done", k < a);
        el.classList.toggle("is-active", k === a);
        el.classList.toggle("is-todo", k > a);
      }));
      cols.forEach((c, k) => { c.setAttribute("aria-selected", String(k === a)); c.tabIndex = k === Math.max(a, 0) ? 0 : -1; });
      if (cell) cell.textContent = a >= 0 ? NAMES[a] : "Calibrating";
    }
    function countUp() {
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / 800);
        count.textContent = String(Math.max(1, Math.round(p * 10))).padStart(2, "0");
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    function stop() {
      timers.forEach(clearTimeout); timers = [];
      cancelAnimationFrame(raf);
      bars.forEach((b) => b.classList.remove("is-unbuilt"));
      val.classList.remove("is-unbuilt");
      count.textContent = "10";
    }

    cols.forEach((c, k) => {
      c.addEventListener("click", () => { stop(); set(k); });
      c.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const n = (k + d + cols.length) % cols.length;
        stop(); set(n); cols[n].focus();
      });
    });
    if (reduced) return;

    // opening state: nothing built, every column waiting
    root.classList.add("ac-cold");
    set(-1);
    bars.forEach((b) => b.classList.add("is-unbuilt"));
    val.classList.add("is-unbuilt");
    count.textContent = "00";
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("ac-cold")));

    const step = (k) => { set(k); bars[k].classList.remove("is-unbuilt"); };
    later(1200, () => { step(0); val.classList.remove("is-unbuilt"); countUp(); });
    later(2400, () => step(1));
    later(3600, () => step(2));
    later(4800, () => step(3));
  }
};
