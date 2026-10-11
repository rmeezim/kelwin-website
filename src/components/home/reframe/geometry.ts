/* ── reframe · the LATTICE section cut — geometry ─────────────────────────────────────────────
   Ported from design/redesign/site/frag/reframe/U.js. One true-isometric drawing in a 1312×424
   viewBox (the plate's field at the 1440 stage). The SURFACE is a 12×6 lattice floating LIFT
   units above the cut; the ARCHITECTURE is the cut itself: one deep block whose long face is
   divided into three bays (x 0–4 · 4–8 · 8–12), each directly beneath the symptom pinned to the
   same span of the surface.
   Surface state = the lattice is warped (seeded displaced vertices, three bulges where the
   symptoms pin, one sag, five missing members). Architecture state = every vertex sits on the
   true grid and the missing members close.
   The geometry is seeded (mulberry32), so every render is identical: the server component draws
   the final (true) state from these functions and the behaviour morphs between the two vertex
   sets — one source for both, as the mockup's markup generator was.                          */

export type Pt = [number, number];

const C = 26;
export const W = 12;
export const D = 6;
const DEEP = 96;
const LIFT = 30;
const OX = 740;
const OY = 64;
const BAYS = [0, 4, 8, 12]; // bay boundaries along x
const CX = C * Math.cos(Math.PI / 6);
const CY = C * 0.5;

export function P(x: number, y: number, z: number): Pt {
  return [OX + (x - y) * CX, OY + (x + y) * CY - z];
}

/** One decimal, no trailing zero — the mockup's number format, so the paths match it exactly. */
export function f(n: number): string {
  return (Math.round(n * 10) / 10).toString();
}

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

/* three symptom bulges on the back edge, one over the middle of each bay
   (x = 2 · 6 · 10, where the tags pin), plus one sag */
const BULGE = [
  { i: 2, j: 0.4, h: 24, r: 1.3 },
  { i: 6, j: 0.4, h: 18, r: 1.2 },
  { i: 10, j: 0.4, h: 22, r: 1.3 },
  { i: 5.5, j: 4.6, h: -16, r: 1.7 },
];
/* members missing from the warped lattice: [kind, line, segment start] */
const GAPS: Array<["x" | "y", number, number]> = [
  ["x", 2, 4],
  ["x", 4, 8],
  ["y", 9, 2],
  ["y", 3, 3],
  ["y", 6, 1],
];

export type Geo = { T: Pt[][]; Wp: Pt[][] };

/** The two vertex sets: T (true grid) and Wp (warped), indexed [i 0..W][j 0..D]. */
export function geo(): Geo {
  const rnd = mulberry32(20261008);
  const T: Pt[][] = [];
  const Wp: Pt[][] = [];
  for (let i = 0; i <= W; i++) {
    T[i] = [];
    Wp[i] = [];
    for (let j = 0; j <= D; j++) {
      T[i][j] = P(i, j, LIFT);
      const dx = 0.2 * Math.sin(0.85 * j + 0.5 * i + 0.9) + (rnd() - 0.5) * 0.16;
      const dy = 0.18 * Math.cos(0.65 * i - 0.45 * j + 0.3) + (rnd() - 0.5) * 0.16;
      let z = 8 * Math.sin(0.75 * i + 0.4) * Math.cos(0.8 * j + 1.2);
      for (const q of BULGE) {
        z += q.h * Math.exp(-((i - q.i) * (i - q.i) + (j - q.j) * (j - q.j)) / (2 * q.r * q.r));
      }
      Wp[i][j] = P(i + dx, j + dy, LIFT + z);
    }
  }
  return { T, Wp };
}

function isGap(k: "x" | "y", line: number, s: number): boolean {
  return GAPS.some((g) => g[0] === k && g[1] === line && g[2] === s);
}

/** Lattice paths for a vertex set V[i][j]: 7 x-lines (left → right), then 13 y-lines
 *  (back → front) — the order the 20 .km-reframe__m paths sit in — plus the gap members. */
export function mesh(V: Pt[][]): { lines: string[]; gaps: string } {
  const lines: string[] = [];
  for (let j = 0; j <= D; j++) {
    let d = "";
    for (let i = 0; i <= W; i++) {
      const p = V[i][j];
      d += (i === 0 || isGap("x", j, i - 1) ? "M" : "L") + f(p[0]) + " " + f(p[1]);
    }
    lines.push(d);
  }
  for (let i = 0; i <= W; i++) {
    let d = "";
    for (let j = 0; j <= D; j++) {
      const p = V[i][j];
      d += (j === 0 || isGap("y", i, j - 1) ? "M" : "L") + f(p[0]) + " " + f(p[1]);
    }
    lines.push(d);
  }
  let gaps = "";
  for (const G of GAPS) {
    const [a, c] = G[0] === "x" ? [V[G[2]][G[1]], V[G[2] + 1][G[1]]] : [V[G[1]][G[2]], V[G[1]][G[2] + 1]];
    gaps += "M" + f(a[0]) + " " + f(a[1]) + "L" + f(c[0]) + " " + f(c[1]);
  }
  return { lines, gaps };
}

function L(...pts: Pt[]): string {
  return pts.map((p, k) => (k ? "L" : "M") + f(p[0]) + " " + f(p[1])).join("");
}

/** The static parts of the drawing (the final-state markup). */
export function statics() {
  const B = (z: number) => P(0, D, z);
  const Cc = (z: number) => P(W, D, z);
  const A = (z: number) => P(W, 0, z);
  const deep = -DEEP;
  const bays: string[] = []; // the two bay dividers
  for (let b = 1; b < BAYS.length - 1; b++) bays.push(L(P(BAYS[b], D, 0), P(BAYS[b], D, deep)));
  let cells = "";
  for (let i = 1; i < W; i++) if (BAYS.indexOf(i) < 0) cells += L(P(i, D, 0), P(i, D, deep));
  for (let j = 1; j < D; j++) cells += L(P(W, j, 0), P(W, j, deep));
  return {
    // construction: the true surface outline + the hidden architecture (Surface only)
    ghost: L(P(0, 0, LIFT), P(W, 0, LIFT), P(W, D, LIFT), P(0, D, LIFT)) + "Z",
    hidden: L(B(0), B(deep), Cc(deep), A(deep), A(0)) + L(Cc(0), Cc(deep)) + L(B(0), Cc(0), A(0)),
    // outline: three verticals, the base, and the short top edge (the long top edge is the datum)
    edges: [L(B(0), B(deep)), L(Cc(0), Cc(deep)), L(A(0), A(deep)), L(B(deep), Cc(deep), A(deep)), L(Cc(0), A(0))],
    drops: L(B(LIFT), B(0)) + L(Cc(LIFT), Cc(0)) + L(A(LIFT), A(0)), // surface seated over the datum
    bays,
    cells,
    datum: L(B(0), Cc(0)), // one straight line
  };
}
