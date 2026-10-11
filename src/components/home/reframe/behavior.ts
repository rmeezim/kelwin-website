import type { Behavior } from "../types";
import { D, W, geo, mesh, type Pt } from "./geometry";

/* reframe · the LATTICE section cut (ported from design/redesign/site/frag/reframe/U.js).
   The markup is the resolved ARCHITECTURE state. At play the plate opens in SURFACE (the warped
   lattice, three symptom tags pinned to its bulges, the architecture only dashed beneath it) and
   advances once to ARCHITECTURE at 2.6s, once all three tags have landed: every one of the 91
   lattice vertices interpolates from its warped position to the true grid (rAF, 1300ms,
   --ease-inout) while the CSS transitions draw the cut, the dimensions and the red datum.
   · Surface | Architecture really switches the figure both ways (back to Surface the lattice warps
     again in 900ms). It is a pair of toggle buttons (aria-pressed: one figure, no panels, so not a
     tablist), both in the tab order; ←/→ (and Home/End) also move to the other one and press it.
     The first interaction — a press, or keyboard focus arriving in the figure — cancels the
     automatic switch, so nothing changes under the visitor's focus.
   · The readout ("Fix the surface …" / "Fix the architecture …") is a live region kept quiet
     (aria-live=off) through the opening and the automatic switch; it turns polite at the visitor's
     first focus or press, so only the switches they make are announced.
   · Standalone (the preview) the plate plays on the mockup's timeline from the slot's play. On the
     homepage (.km-home) the slot plays when only the head is on screen: the plate opens in Surface on
     the slot's timeline (panel, readout, band, dashed construction), while the lattice, the tags and
     the strips hold their first frame ([data-wait]) until the plate is half in view. Then the lattice
     plots at once (--rf-shift ≤ 860ms), the tags pin and the switch lands ≈ 1.75s later, as specified
     ("when it is 50% visible … the switch fires ≈ 1.8s later"). A click on the control, or a plate
     already above the viewport (reached scrolling up), releases the hold too.
   · Reduced motion: the resolved Architecture state synchronously — no timers, no rAF; the control
     still switches the figure (instantly).
   Cleanup clears every timer, rAF, listener and observer and puts the figure back to the markup's
   state, so a strict-mode remount (init → cleanup → init) leaves exactly one live instance. */

type State = "surface" | "arch";

const AUTO_AT = 2600; // the automatic switch, on the slot's timeline
const LATTICE_AT = 860; // the lattice's first line starts plotting (reframe.css §2)

export const init: Behavior = (root, { reduced }) => {
  const fig = root.querySelector<HTMLElement>(".km-reframe__fig");
  if (!fig) return;
  const segs = Array.from(root.querySelectorAll<HTMLButtonElement>(".km-reframe__seg > button"));
  const paths = Array.from(fig.querySelectorAll<SVGPathElement>(".km-reframe__m"));
  const gapPath = fig.querySelector<SVGPathElement>(".km-reframe__gaps");
  const rsS = fig.querySelector<HTMLElement>(".km-reframe__rs--s");
  const rsA = fig.querySelector<HTMLElement>(".km-reframe__rs--a");
  const tags = fig.querySelector<HTMLElement>(".km-reframe__tags");
  const bays = fig.querySelector<HTMLElement>(".km-reframe__bays");
  const ro = fig.querySelector<HTMLElement>(".km-reframe__ro");
  const G = geo();
  const undo: Array<() => void> = [];
  let t = 1; // 0 = warped, 1 = true
  let raf = 0;
  let auto = 0;
  let touched = false;
  let release: (() => void) | null = null; // the homepage gate, while it holds

  const draw = (k: number) => {
    const V: Pt[][] = [];
    for (let i = 0; i <= W; i++) {
      V[i] = [];
      for (let j = 0; j <= D; j++) {
        const a = G.Wp[i][j];
        const b = G.T[i][j];
        V[i][j] = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
      }
    }
    const m = mesh(V);
    paths.forEach((p, n) => p.setAttribute("d", m.lines[n]));
    gapPath?.setAttribute("d", m.gaps);
  };
  const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2); // --ease-inout
  const morph = (to: number, ms: number, delay = 0) => {
    cancelAnimationFrame(raf);
    const from = t;
    let t0 = 0;
    if (reduced || ms <= 0) {
      t = to;
      draw(t);
      return;
    }
    const step = (now: number) => {
      if (!t0) t0 = now + delay;
      const x = Math.min(Math.max((now - t0) / ms, 0), 1);
      t = from + (to - from) * ease(x);
      draw(t);
      if (x < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  // the control and what the accessibility tree reads follow the state (the markup's form:
  // aria-hidden="true" on what is hidden, no attribute on what shows; the dimensions are always hidden —
  // annotation the figure's label already carries)
  const hide = (el: HTMLElement | null, hidden: boolean) => {
    if (hidden) el?.setAttribute("aria-hidden", "true");
    else el?.removeAttribute("aria-hidden");
  };
  const mark = (state: State) => {
    const surf = state === "surface";
    segs.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.state === state)));
    hide(rsS, !surf);
    hide(rsA, surf);
    hide(tags, !surf);
    hide(bays, surf);
  };
  const set = (state: State, instant: boolean) => {
    const surf = state === "surface";
    if (instant || reduced) fig.classList.add("ac-cold");
    fig.classList.toggle("is-surface", surf);
    mark(state);
    // warp ↔ true: the lattice resolves in 1300ms (100ms after the tags lift); it warps back faster
    morph(surf ? 0 : 1, instant ? 0 : surf ? 900 : 1300, surf ? 0 : 100);
    if (instant || reduced) {
      void fig.getBoundingClientRect();
      fig.classList.remove("ac-cold");
    }
  };
  // the visitor has the figure: the automatic switch is cancelled, a held figure plays (on the homepage —
  // it is plainly being looked at), and from now on the readout speaks the switches they make
  const engage = () => {
    touched = true;
    window.clearTimeout(auto);
    release?.();
    ro?.setAttribute("aria-live", "polite");
  };
  const take = (b: HTMLButtonElement) => {
    engage();
    set(b.dataset.state === "surface" ? "surface" : "arch", false);
  };
  // keyboard focus arriving in the figure (Tab onto the control) takes it over too
  fig.addEventListener("focusin", engage);
  undo.push(() => fig.removeEventListener("focusin", engage));

  // ── the control: click, and the arrow keys ──
  segs.forEach((b, k) => {
    const onClick = () => take(b);
    const onKey = (e: KeyboardEvent) => {
      const last = segs.length - 1;
      const to =
        e.key === "ArrowRight" ? (k === last ? 0 : k + 1)
        : e.key === "ArrowLeft" ? (k === 0 ? last : k - 1)
        : e.key === "Home" ? 0
        : e.key === "End" ? last
        : -1;
      if (to < 0) return;
      e.preventDefault();
      segs[to].focus();
      take(segs[to]);
    };
    b.addEventListener("click", onClick);
    b.addEventListener("keydown", onKey);
    undo.push(() => {
      b.removeEventListener("click", onClick);
      b.removeEventListener("keydown", onKey);
    });
  });

  const cleanup = () => {
    window.clearTimeout(auto);
    cancelAnimationFrame(raf);
    undo.forEach((fn) => fn());
    root.removeAttribute("data-wait");
    root.style.removeProperty("--rf-shift");
    if (!root.getAttribute("style")) root.removeAttribute("style");
    // back to the markup's state (Architecture, the readout quiet), without transitions
    ro?.setAttribute("aria-live", "off");
    fig.classList.add("ac-cold");
    fig.classList.remove("is-surface");
    t = 1;
    draw(1);
    mark("arch");
    void fig.getBoundingClientRect();
    fig.classList.remove("ac-cold");
  };

  if (reduced) {
    set("arch", true);
    return cleanup;
  }

  // Surface first; then, once, Architecture.
  set("surface", true);
  const schedule = (shift: number) => {
    if (touched) return;
    auto = window.setTimeout(() => set("arch", false), AUTO_AT - shift);
  };

  if (root.closest(".km-home") && "IntersectionObserver" in window) {
    // homepage gate: the shell plays now; the lattice, the tags and the strips hold until the plate
    // is half in view (or fills half the viewport), or already lies above it
    root.setAttribute("data-wait", "");
    const t0 = performance.now();
    const gate = new IntersectionObserver(
      (entries) => {
        const seen = entries.some(
          (e) =>
            (e.isIntersecting &&
              (e.intersectionRatio >= 0.5 || e.intersectionRect.height >= window.innerHeight * 0.5)) ||
            e.boundingClientRect.top < 0,
        );
        if (seen) release?.();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    release = () => {
      release = null;
      gate.disconnect();
      // the lattice plots now — but never before it would have on the slot's own timeline
      const shift = Math.round(Math.min(LATTICE_AT, performance.now() - t0));
      root.style.setProperty("--rf-shift", `${shift}ms`);
      root.removeAttribute("data-wait");
      schedule(shift);
    };
    gate.observe(fig);
    undo.push(() => {
      release = null;
      gate.disconnect();
    });
  } else {
    schedule(0);
  }

  return cleanup;
};
