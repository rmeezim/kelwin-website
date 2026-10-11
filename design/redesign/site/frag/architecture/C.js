window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    // hover: a spec row lights its lettered callout (row F thickens the red return route)
    const rows = $$(".km-architecture-C__row[data-c]");
    const marks = $$(".km-architecture-C__plan [data-c]");
    rows.forEach((r) => {
      const c = r.dataset.c;
      r.addEventListener("mouseenter", () => marks.forEach((m) => m.classList.toggle("is-hot", m.dataset.c === c)));
      r.addEventListener("mouseleave", () => marks.forEach((m) => m.classList.remove("is-hot")));
    });

    if (reduced) return; // fully plotted final state from CSS

    // mono labels type on (24ms / character) once their element is plotted.
    // Monospace + NBSP padding keeps centred / end-anchored labels in place.
    const typed = $$("[data-type]");
    const defaults = { "km-architecture-C__sheetlab": 250, "km-architecture-C__cellid": 450 };
    typed.forEach((el, i) => {
      const full = el.textContent;
      const anchor = el.getAttribute("text-anchor") || (el.parentNode && el.parentNode.getAttribute && el.parentNode.getAttribute("text-anchor")) || "start";
      const pad = anchor !== "start";
      let t = el.dataset.t ? +el.dataset.t : (defaults[el.className] ?? 1000 + i * 40);
      const blank = (n) => full.slice(0, n) + (pad ? " ".repeat(full.length - n) : "");
      el.textContent = blank(0);
      setTimeout(() => {
        let n = 0;
        const tick = () => { n++; el.textContent = n >= full.length ? full : blank(n); if (n < full.length) setTimeout(tick, 24); };
        tick();
      }, t);
    });

    // after the red return route plots, one 6px square runs the whole loop once
    const run = root.querySelector(".km-architecture-C__run");
    const pts = [[230.5, 240.5], [787.5, 240.5], [787.5, 348.5], [230.5, 348.5], [230.5, 240.5]];
    const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    const at = (d) => {
      for (let i = 0; i < seg.length; i++) {
        if (d <= seg[i] || i === seg.length - 1) {
          const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
          return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
        }
        d -= seg[i];
      }
    };
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    setTimeout(() => {
      const dur = 2200, t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const [x, y] = at(L * ease(k));
        run.setAttribute("x", x - 3); run.setAttribute("y", y - 3);
        run.style.opacity = k < 0.06 ? k / 0.06 : k > 0.94 ? (1 - k) / 0.06 : 1;
        if (k < 1) requestAnimationFrame(step); else run.style.opacity = "";
      };
      requestAnimationFrame(step);
    }, 3700);
  }
};
