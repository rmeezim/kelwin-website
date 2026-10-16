/* r10-turn · S — the two page-turn proposals, each played in its small screen at real speed, between
   two approved pages (the System Audit, then Insights). Timings are the real ones
   (qa/r10/art/turn/turn-a.js · turn-b.js).
   One screen's pass: the cover held → the lift onto the Audit (the page makes its entrance and the
   red line becomes its rule) → 1.4s on the page → a click turns it → the lift onto Insights (the line
   becomes that page's rule) → 1.4s → (A only) a last click, ending on A's held frame.
   The pass: when 40% of the pair is on screen (at once in a standalone build), A plays, then B.
   A screen's Play button stops the pass for good and plays that screen.
   Reduced motion: no pass; Play switches a screen between its still and the Audit page, at once. */
window.KM = {
  init(root, { reduced }) {
    const timers = [], offs = [];
    const T = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
    const HOLD = 300, READ = 1400;

    /* cubic-bezier helpers (as turn-b.js): a position at a time, and the ease of a curve's first part */
    const bez = (p1, p2, s) => { const u = 1 - s; return 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s; };
    const paramAt = (e, x) => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (bez(e[0], e[2], m) < x) lo = m; else hi = m; } return (lo + hi) / 2; };
    const ease = (e, x) => (x <= 0 ? 0 : x >= 1 ? 1 : bez(e[1], e[3], paramAt(e, x)));
    const head = (e, s) => {
      const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      const P1 = [e[0], e[1]], P2 = [e[2], e[3]], Q1 = lerp([0, 0], P1, s), M = lerp(P1, P2, s), R2 = lerp(P2, [1, 1], s), Q2 = lerp(Q1, M, s), R1 = lerp(M, R2, s), P = lerp(Q2, R1, s);
      return P[0] > 0 && P[1] > 0 ? `cubic-bezier(${[Q1[0] / P[0], Q1[1] / P[1], Q2[0] / P[0], Q2[1] / P[1]].map((v) => v.toFixed(4)).join(", ")})` : "linear";
    };
    const DOWN_EASE = [.4, 0, .2, 1], CATCH_EASE = [.25, 1, .5, 1];

    function screen(v) {
      const scr = root.querySelector(`.km-r10-turn-S__scr--${v}`);
      const pages = [...scr.querySelectorAll(".km-r10-turn-S__pg")];
      const line = scr.querySelector(".km-r10-turn-S__line"), sheet = scr.querySelector(".km-r10-turn-S__sheet"), edge = scr.querySelector(".km-r10-turn-S__edge");
      const still = v === "a" ? "is-held" : "is-catch";
      let own = [], anims = [];
      const t = (fn, ms) => own.push(T(fn, ms));
      const set = (cls) => { scr.classList.remove("is-held", "is-lift", "is-leave", "is-open", "is-catch"); if (cls) scr.classList.add(cls); };
      const show = (i, cls) => pages.forEach((p, k) => { p.classList.remove("is-on", "is-in", "is-landed"); if (k === i) { p.classList.add("is-on"); (cls || []).forEach((c) => p.classList.add(c)); } });
      function stopAll() { own.forEach(clearTimeout); own = []; anims.forEach((a) => { try { a.cancel(); } catch (e) {} }); anims = []; line.style.visibility = ""; if (edge) edge.style.visibility = ""; }
      function toStill() { stopAll(); set(still); show(0, v === "b" ? ["is-landed"] : []); }
      function toHeld() { stopAll(); set("is-held"); show(0); }
      /* the line's path onto a page's rule, from layout boxes (both layers fill the screen) */
      function path(rule) {
        const w = line.offsetWidth;
        return { tx: rule.offsetLeft - line.offsetLeft, ty: rule.offsetTop + rule.offsetHeight / 2 - (line.offsetTop + line.offsetHeight / 2), sx: rule.offsetWidth / w };
      }
      function lift(i) {   /* uncover page i; the line becomes its rule */
        const pg = pages[i], rule = pg.querySelector(".km-r10-turn-S__rule");
        show(i, ["is-in"]); set("is-lift");
        const land = () => { pg.classList.add("is-landed"); line.style.visibility = "hidden"; };
        if (!line.animate) { land(); t(() => set("is-open"), 760); return; }
        const p = path(rule);
        if (v === "a") {   /* A: 140–700 the line shrinks and travels onto the rule */
          const an = line.animate([{ transform: "translate(0px, 0px) scale(1, 1)" }, { transform: `translate(${p.tx}px, ${p.ty.toFixed(2)}px) scale(${p.sx.toFixed(5)}, 1)` }],
            { duration: 560, delay: 140, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "both" });
          anims.push(an); an.onfinish = land;
          t(() => set("is-open"), 760);
        } else {           /* B: the sheet slides down; the line rides it, then the page catches it */
          const H = sheet.offsetHeight * 1.01, DOWN = 760, CATCH = 360, slope0 = CATCH_EASE[1] / CATCH_EASE[0], CMAX = 0.16 * scr.offsetHeight;
          let t1 = 0, y1 = 0;
          for (let s = 0; s <= DOWN; s += 2) {
            const y = ease(DOWN_EASE, s / DOWN) * H, vel = (ease(DOWN_EASE, (s + 1) / DOWN) - ease(DOWN_EASE, (s - 1) / DOWN)) * H / 2;
            t1 = s; y1 = y; if (y + Math.min(CMAX, Math.max(0, vel) * CATCH / slope0) >= p.ty) { y1 = Math.min(y, p.ty); break; }
          }
          const total = t1 + CATCH, fr = [];
          if (t1 > 0) fr.push({ offset: 0, transform: "translate(0px, 0px) scale(1, 1)", easing: head(DOWN_EASE, paramAt(DOWN_EASE, t1 / DOWN)) });
          fr.push({ offset: t1 / total, transform: `translate(0px, ${y1.toFixed(2)}px) scale(1, 1)`, easing: `cubic-bezier(${CATCH_EASE.join(", ")})` });
          fr.push({ offset: 1, transform: `translate(${p.tx}px, ${p.ty.toFixed(2)}px) scale(${p.sx.toFixed(5)}, 1)` });
          edge.style.visibility = "hidden"; line.style.visibility = "visible";
          const sa = sheet.animate([{ transform: "translateY(0px)" }, { transform: `translateY(${H.toFixed(1)}px)` }], { duration: DOWN, easing: `cubic-bezier(${DOWN_EASE.join(", ")})`, fill: "forwards" });
          const la = line.animate(fr, { duration: total, fill: "forwards" });
          anims.push(sa, la); la.onfinish = land;
          t(() => { set("is-open"); sa.cancel(); edge.style.visibility = ""; }, Math.max(DOWN, total) + 20);
        }
      }
      function leave() {   /* a click: the cover closes (the line is put back first) */
        anims.forEach((a) => { try { a.cancel(); } catch (e) {} }); anims = [];
        line.style.visibility = ""; if (edge) edge.style.visibility = "";
        set("is-leave");
      }
      const LEAVE = v === "a" ? 640 : 460;
      function play(done) {
        toHeld();
        let at = HOLD;
        t(() => lift(0), at); at += 780 + READ;
        t(leave, at); at += LEAVE;
        t(() => { set("is-held"); show(1); }, at); at += HOLD;
        t(() => lift(1), at); at += 780 + READ;
        if (v === "a") { t(leave, at); at += LEAVE; t(() => { set("is-held"); show(0); }, at); }
        t(() => { if (done) done(); }, at + 20);
      }
      function toggle() {   /* reduced motion: the still ↔ the Audit page, at once */
        if (scr.classList.contains("is-open")) toStill(); else { stopAll(); set("is-open"); show(0, ["is-landed"]); }
      }
      return { play, toStill, toHeld, toggle };
    }
    const A = screen("a"), B = screen("b");

    /* the pass: A, then B (B is put in its held frame first, before the screens are seen) */
    let stopped = false, io = null;
    function pass() {
      if (stopped || reduced) return;
      A.play(() => { if (!stopped) T(() => B.play(), 400); });
    }
    function stop() { stopped = true; if (io) { io.disconnect(); io = null; } }
    root.querySelectorAll(".km-r10-turn-S__play").forEach((btn) => {
      const s = btn.dataset.play === "a" ? A : B, o = s === A ? B : A;
      on(btn, "click", () => {
        stop();
        if (reduced) { s.toggle(); return; }
        o.toHeld(); s.play();
      });
    });
    if (!reduced) {
      B.toHeld();
      const standalone = !document.documentElement.classList.contains("km-home");
      const pair = root.querySelector(".km-r10-turn-S__pair");
      if (standalone || !("IntersectionObserver" in window)) T(pass, 1300);
      else {
        io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); io = null; T(pass, 300); } }, { threshold: 0.4 });
        io.observe(pair);
      }
    }

    return () => {
      timers.forEach(clearTimeout); offs.forEach((f) => f()); if (io) io.disconnect();
      A.toStill(); B.toStill();
    };
  },
};
