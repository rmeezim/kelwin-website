window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    const $ = (s) => root.querySelector(s);
    const $$ = (s) => Array.from(root.querySelectorAll(s));

    // ── ledger: opens in place, exactly one row open ──
    const rows = $$(".km-architecture-B__row");
    const openRow = (row) => rows.forEach((r) => {
      const on = r === row;
      r.classList.toggle("is-open", on);
      r.querySelector(".km-architecture-B__rowhead").setAttribute("aria-expanded", String(on));
    });
    rows.forEach((r) => r.querySelector(".km-architecture-B__rowhead").addEventListener("click", () => openRow(r)));

    // hover: a ledger row lights its segment of the loop (row 4 = the red return)
    const segs = $$(".km-architecture-B__seg");
    const stations = $$(".km-architecture-B__st");
    const STATION_FOR = { 1: "1", 2: "2", 3: "3", 4: "4" };
    rows.forEach((r) => {
      const n = r.dataset.seg;
      r.addEventListener("mouseenter", () => {
        segs.forEach((p) => p.classList.toggle("is-hot", p.dataset.seg === n));
        stations.forEach((g) => g.classList.toggle("is-hot", g.dataset.n === STATION_FOR[n]));
      });
      r.addEventListener("mouseleave", () => { segs.forEach((p) => p.classList.remove("is-hot")); stations.forEach((g) => g.classList.remove("is-hot")); });
    });

    if (reduced) return; // final state straight from CSS (row N·04 open, loop drawn)

    // ── plot the loop as one continuous drawing (long durations, short distances) ──
    const bez = (x1, y1, x2, y2) => (x) => {
      const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
      const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
      const sx = (t) => ((ax * t + bx) * t + cx) * t;
      let t = x;
      for (let i = 0; i < 8; i++) { const d = (3 * ax * t + 2 * bx) * t + cx; const e = sx(t) - x; if (Math.abs(e) < 1e-5 || !d) break; t -= e / d; }
      t = Math.min(1, Math.max(0, t));
      return ((ay * t + by) * t + cy) * t;
    };
    const easeOut = bez(0.2, 0.7, 0.3, 1);
    const easeInOut = bez(0.65, 0, 0.35, 1);

    const hide = (el) => { if (el) { el.style.transition = "none"; el.style.opacity = "0"; } };
    const show = (el, ms = 400) => { if (el) { el.style.transition = `opacity ${ms}ms cubic-bezier(.2,.7,.3,1)`; el.style.opacity = "1"; } };
    const prep = (p) => { const L = p.getTotalLength(); p.style.strokeDasharray = `${L} ${L}`; p.style.strokeDashoffset = `${L}`; return L; };
    const plot = (p, L, delay, dur, ease, onDone) => setTimeout(() => {
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        p.style.strokeDashoffset = `${L * (1 - ease(k))}`;
        if (k < 1) requestAnimationFrame(step);
        else { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; if (onDone) onDone(); }
      };
      requestAnimationFrame(step);
    }, delay);

    const inP = $(".km-architecture-B__seg[data-seg='1']");
    const top = $(".km-architecture-B__top");
    const right = $(".km-architecture-B__right");
    const out = $(".km-architecture-B__out");
    const ret = $(".km-architecture-B__ret");
    const inBits = [$(".km-architecture-B__injt"), ...$$(".km-architecture-B__inlab")];
    const chevs = $$(".km-architecture-B__chevs .km-architecture-B__chev:not(.km-architecture-B__chev--ret)");
    const retChevs = $$(".km-architecture-B__chev--ret");
    const outLab = $(".km-architecture-B__outlab");
    const reroute = $(".km-architecture-B__reroute");
    const st = {}; stations.forEach((g) => { st[g.dataset.n] = g; });

    const Lin = prep(inP), Ltop = prep(top), Lright = prep(right), Lout = prep(out), Lret = prep(ret);
    [...inBits, outLab, reroute, ...chevs, ...retChevs, ...stations].forEach(hide);

    // the ledger starts closed; N·04 opens as the return closes the loop
    root.classList.add("is-init");
    openRow(null);
    root.getBoundingClientRect();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-init")));

    // 1 · the input leaves the spine
    setTimeout(() => inBits.forEach((el) => show(el, 400)), 900);
    plot(inP, Lin, 900, 450, easeOut, () => show(st["1"], 500));
    // 2 · forward: 1 → 2 → 3, each station appears as the line reaches it
    plot(top, Ltop, 1350, 800, easeOut, () => { show(chevs[0]); show(st["2"], 500); });
    plot(right, Lright, 2150, 700, easeOut, () => { show(chevs[1]); show(st["3"], 500); });
    // 3 · output runs to the margin
    plot(out, Lout, 2850, 700, easeOut, () => show(outLab, 500));
    // 4 · the closing beat: the red return, 3 → back into 1, as one right angle
    plot(ret, Lret, 2950, 900, easeInOut, () => { retChevs.forEach((c) => show(c, 300)); show(st["4"], 500); });
    // the reroute settles in quietly after the return
    setTimeout(() => show(reroute, 600), 3700);
    // 5 · the ledger answers: N·04 opens in place
    setTimeout(() => openRow(rows[3]), 3700);
  }
};
