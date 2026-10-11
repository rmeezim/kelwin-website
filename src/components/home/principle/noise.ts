/* principle · CONTOUR "noise settles into signal" — the drawing's geometry (ported from the approved mockup,
   design/redesign/site/frag/principle/S.js).
   Nine open curves of market noise enter the sheet at the left frame edge.
   t = 0 (raw): loud, spiky, full spread all the way to the statement — frayed.
   t = 1 (filtered): still noisy where they enter (the market is noisy), but a filter front has travelled
   left → right, lowering amplitude and frequency until the bundle closes onto the datum and one clean line
   carries on into "the clearest". Seeded PRNG (mulberry32), so every render is identical: the server renders
   bundle(1) into the markup (the no-JS / reduced-motion drawing) and behavior.ts interpolates 0 → 1. */

/** The field, in SVG user units: 302 × 200, datum at y 100, nine lines 12 apart, sampled every 3. */
export const G = { W: 302, H: 200, cy: 100, n: 9, gap: 12, step: 3 } as const;
/** The middle line — the one signal that carries on into the statement. */
export const SIG = (G.n - 1) / 2;

const TAU = Math.PI * 2;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(707);
const PH: number[][] = [];
const FRAY: number[] = [];
for (let i = 0; i < G.n; i++) {
  PH.push([rnd() * TAU, rnd() * TAU, rnd() * TAU, rnd() * TAU, rnd() * TAU]);
  FRAY.push(rnd());
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sm = (u: number) => {
  const v = u < 0 ? 0 : u > 1 ? 1 : u;
  return v * v * (3 - 2 * v);
};
const raw = (i: number, x: number) => {
  const p = PH[i];
  return 0.5 * Math.sin((x / 41) * TAU + p[0]) + 0.32 * Math.sin((x / 17) * TAU + p[1]) + 0.18 * Math.sin((x / 9) * TAU + p[2]);
};
const calm = (i: number, x: number) => {
  const p = PH[i];
  return 0.72 * Math.sin((x / 92) * TAU + p[3]) + 0.28 * Math.sin((x / 45) * TAU + p[4]);
};
const f = (n: number) => String(Math.round(n * 10) / 10);

/** Catmull-Rom through the samples → cubic Béziers. */
function curve(p: [number, number][]) {
  let d = "M" + f(p[0][0]) + " " + f(p[0][1]);
  for (let k = 0; k < p.length - 1; k++) {
    const p0 = p[k - 1] || p[k];
    const p1 = p[k];
    const p2 = p[k + 1];
    const p3 = p[k + 2] || p2;
    d +=
      "C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " +
      f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + " " + f(p2[1]);
  }
  return d;
}

/** Local filter progress: the front reaches x later the further right it is. */
const front = (t: number, xn: number) => sm((t - 0.42 * xn) / 0.58);

/** The nine path `d` strings at filter progress t (0 raw → 1 filtered).
 *  y = datum + spread·offset + amplitude·noise, each term interpolated per x by the front:
 *    raw:      spread 1 everywhere, amplitude 13.5, spiky noise — frayed short of the statement
 *    filtered: spread closes by 76% of the field; amplitude decays; spiky at entry → calm */
export function bundle(t: number): string[] {
  const out: string[] = [];
  const wEnd = front(t, 1);
  for (let i = 0; i < G.n; i++) {
    const o = (i - SIG) * G.gap;
    const sig = i === SIG;
    const pts: [number, number][] = [];
    // raw: ragged ends short of the statement; filtered: the outer lines stop where they have closed onto the
    // datum, and only the middle one carries on to the word
    const xmax = sig ? G.W : lerp(G.W - 14 - FRAY[i] * 44, 0.8 * G.W, wEnd);
    const n = Math.ceil(xmax / G.step);
    for (let k = 0; k <= n; k++) {
      const x = (xmax * k) / n;
      const xn = x / G.W;
      const w = front(t, xn);
      const envF = 1 - sm((xn - 0.06) / 0.7);
      const spread = lerp(1, envF, w);
      const amp = lerp(13.5, 11 * (1 - sm((xn - 0.02) / 0.66)), w);
      const nzF = lerp(raw(i, x), calm(i, x), sm(xn / 0.5));
      const nz = lerp(raw(i, x), nzF, w);
      pts.push([x, G.cy + spread * o + amp * nz]);
    }
    out.push(curve(pts));
  }
  return out;
}

/** The filtered drawing (t = 1): what the markup holds before and after the entrance. */
export const FILTERED = bundle(1);
