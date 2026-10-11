import type { Behavior } from "../types";
import { bundle } from "./noise";

/* principle · CONTOUR "noise settles into signal" (ported from design/redesign/site/frag/principle/S.js).
   At play the raw bundle is drawn (t = 0) while the CSS wipe plots it in; from 1.3s a filter front travels
   left → right for 1.8s (sample interpolation per frame, eased ≈ --ease-inout) until the nine lines close onto
   the datum and one line enters "the clearest". Plays once; no ambient loop, no controls.
   Reduced motion: the filtered drawing synchronously (the markup already holds it), no timers. */

const SETTLE_AT = 1300; // ms after play
const SETTLE_MS = 1800;

/** cubic in-out ≈ the kit's --ease-inout */
const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

export const init: Behavior = (root, { reduced }) => {
  const waves = Array.from(root.querySelectorAll<SVGPathElement>(".km-principle__wave"));
  if (!waves.length) return;

  const draw = (t: number) => {
    const d = bundle(t);
    waves.forEach((w, i) => w.setAttribute("d", d[i]));
  };

  if (reduced) {
    draw(1); // final drawing, synchronously; no timers, no loops
    return;
  }

  // the live entrance: raw noise plots in (CSS wipe), then settles once
  let raf = 0;
  let t0 = 0;
  const step = (now: number) => {
    if (!t0) t0 = now;
    const u = Math.min(1, (now - t0) / SETTLE_MS);
    draw(ease(u));
    raf = u < 1 ? requestAnimationFrame(step) : 0;
  };

  draw(0);
  const timer = window.setTimeout(() => {
    raf = requestAnimationFrame(step);
  }, SETTLE_AT);

  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(raf);
    draw(1); // back to the markup's resting state (the filtered drawing)
  };
};
