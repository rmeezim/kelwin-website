window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    const NS = "http://www.w3.org/2000/svg";

    // polyline walker
    const walker = (pts) => {
      const seg = []; let L = 0;
      for (let i = 1; i < pts.length; i++) {
        const d = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
        seg.push(d); L += d;
      }
      const at = (s) => {
        for (let i = 0; i < seg.length; i++) {
          if (s <= seg[i] || i === seg.length - 1) {
            const k = seg[i] ? Math.min(1, Math.max(0, s / seg[i])) : 0;
            return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
          }
          s -= seg[i];
        }
      };
      return { L, at };
    };
    // the closed circuit, clockwise from Narrative's channel entry
    const loop = walker([[691.5, 174.5], [959.5, 174.5], [959.5, 438.5], [841.5, 438.5], [841.5, 294.5], [691.5, 294.5], [691.5, 174.5]]);
    const P = loop.L; // 1064
    // the open path: in → Narrative's channel → down → out off the bleed edge
    const leak = walker([[509, 174.5], [959.5, 174.5], [959.5, 438.5], [1448, 438.5]]);

    const sigs = Array.from(root.querySelectorAll(".km-architecture-A__sig"));
    const lostG = root.querySelector(".km-architecture-A__lost");
    const btns = Array.from(root.querySelectorAll(".km-architecture-A__segbtn"));
    const capT = root.querySelector(".km-architecture-A__capt");
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const place = (el, xy) => { el.setAttribute("x", xy[0] - 4); el.setAttribute("y", xy[1] - 4); };
    const rest = (el) => place(el, loop.at(((+el.dataset.s % P) + P) % P));
    let run = 0;

    // hover: a key row lights its piece and station name
    const rows = Array.from(root.querySelectorAll(".km-architecture-A__row"));
    const pieces = { 1: root.querySelector(".km-architecture-A__k1"), 2: root.querySelector(".km-architecture-A__k2"), 3: root.querySelector(".km-architecture-A__k3") };
    const names = Array.from(root.querySelectorAll(".km-architecture-A__st"));
    rows.forEach((r) => {
      const k = r.dataset.k;
      r.addEventListener("mouseenter", () => {
        root.classList.add("is-dim");
        Object.entries(pieces).forEach(([i, p]) => p && p.classList.toggle("is-hot", i === k));
        names.forEach((n) => n.classList.toggle("is-hot", n.dataset.k === k));
      });
      r.addEventListener("mouseleave", () => {
        root.classList.remove("is-dim");
        Object.values(pieces).forEach((p) => p && p.classList.remove("is-hot"));
        names.forEach((n) => n.classList.remove("is-hot"));
      });
    });

    const setState = (state) => {
      const open = state === "open";
      root.classList.toggle("is-open", open);
      btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.state === state)));
      if (capT) capT.textContent = open ? "The mark as circuit · open, nothing returns" : "The mark as circuit · closed";
    };

    // open loop: a square enters, runs Narrative's channel and leaves off the edge
    const lose = (delay, token) => {
      setTimeout(() => {
        if (token !== run) return;
        const r = document.createElementNS(NS, "rect");
        r.setAttribute("class", "km-architecture-A__lostsig");
        r.setAttribute("width", 8); r.setAttribute("height", 8);
        lostG.appendChild(r);
        const dur = 1700, t0 = performance.now();
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur);
          place(r, leak.at(leak.L * (k * 0.25 + 0.75 * k * k)));
          if (k < 1 && token === run) requestAnimationFrame(step); else r.remove();
        };
        requestAnimationFrame(step);
      }, delay);
    };

    // closed loop: every square makes exactly one lap and settles
    const lap = (delay, token, dur = 2600) => {
      setTimeout(() => {
        if (token !== run) return;
        sigs.forEach((el) => { el.style.transition = "opacity .3s"; el.style.opacity = "1"; });
        const t0 = performance.now();
        const step = (now) => {
          if (token !== run) return;
          const k = Math.min(1, (now - t0) / dur);
          const e = ease(k);
          sigs.forEach((el) => place(el, loop.at((+el.dataset.s + P * e) % P)));
          if (k < 1) requestAnimationFrame(step); else sigs.forEach(rest);
        };
        requestAnimationFrame(step);
      }, delay);
    };

    const go = (state, fromUser) => {
      const token = ++run;
      setState(state);
      if (reduced) { sigs.forEach((el) => { rest(el); el.style.opacity = state === "open" ? "0" : ""; }); return; }
      if (state === "open") {
        sigs.forEach((el) => { el.style.transition = "opacity .4s"; el.style.opacity = "0"; });
        lose(fromUser ? 200 : 0, token);
        lose(fromUser ? 650 : 450, token);
      } else {
        sigs.forEach((el) => { el.style.transition = "none"; el.style.opacity = "0"; rest(el); });
        lap(800, token);
      }
    };

    btns.forEach((b) => b.addEventListener("click", () => go(b.dataset.state, true)));

    if (reduced) return; // final, closed state straight from CSS

    // demo (on the live site this starts when the plate is 50% visible):
    // open loop first, signal leaks out; then the return path is installed.
    const token = ++run;
    root.classList.add("is-init");
    setState("open");
    root.getBoundingClientRect();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-init")));
    sigs.forEach((el) => { el.style.transition = "none"; el.style.opacity = "0"; });
    lose(1500, token);
    lose(1950, token);
    setTimeout(() => { if (token === run) go("closed", false); }, 3000);
  }
};
