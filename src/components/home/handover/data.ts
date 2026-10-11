/* The handover · the six documents Kelwin hands over, and how each sheet is drawn.
   Ported from design/redesign/work/handover-U/gen.mjs (the generator of the approved mockup U.html): the same
   furniture functions on the same 96×136 page, so every path lands on the same half-pixel as the mockup.
   Each sheet is drawn twice in its own slot: a DRAFT copy (dashed edge, rough page, Kelwin's working draft) and an
   OWNED copy (solid edge, finished page). The spread splits the two exactly at the Handover datum. */

/** Sheet size (1:1.41). Furniture is authored on a 96×136 page and snapped to whole pixels at the real size. */
export const SW = 96;
export const SH = Math.round(SW * 1.4167);
/** The key zone and the datum track (handover.css carries the same numbers as --kz / --dz). */
export const KZ = 146;
export const DZ = 36;
export const DX = KZ + DZ / 2;
export const MID = Math.round(SH / 2);

/** A shape inside a sheet copy: a path, or a small filled rect (bullets, live cells, readout values). */
export type Shape =
  | { kind: "path"; cls: string; d: string }
  | { kind: "rect"; cls: string; x: number; y: number; w: number; h: number };

const sx = (x: number) => Math.round((x * SW) / 96);
const sy = (y: number) => Math.round((y * SH) / 136);
const h = (x1: number, x2: number, y: number) => `M${sx(x1)} ${sy(y) + 0.5}H${sx(x2)}`;
const rect = (x: number, y: number, w: number, hh: number) =>
  `M${sx(x) + 0.5} ${sy(y) + 0.5}h${sx(x + w) - sx(x)}v${sy(y + hh) - sy(y)}h-${sx(x + w) - sx(x)}z`;
const box = (x: number, y: number, s: number): Shape => ({ kind: "rect", cls: "dot", x: sx(x), y: sy(y), w: s, h: s });
const path = (cls: string, parts: string[]): Shape[] => (parts.length ? [{ kind: "path", cls, d: parts.join("") }] : []);

/* page furniture only (rules, bullets, table cells, panels): each sheet is a different KIND of document. */
const FURNITURE: Record<string, { own: Shape[]; draft: Shape[] }> = {
  // 01 Narrative OS · a two-level message hierarchy
  "01": {
    own: [
      ...path("hr", [h(9, 58, 52), h(9, 50, 88)]),
      ...path("ru", [h(17, 86, 61), h(17, 77, 69), h(17, 82, 77), h(17, 84, 97), h(17, 71, 105), h(17, 79, 113)]),
    ],
    draft: path("ru", [h(9, 46, 52), h(9, 72, 63), h(9, 38, 75), h(9, 60, 92)]),
  },
  // 02 Channel Playbooks · six bulleted plays
  "02": {
    own: [
      ...path("ru", [h(18, 80, 53), h(18, 70, 64), h(18, 86, 75), h(18, 64, 86), h(18, 77, 97), h(18, 73, 108)]),
      ...[53, 64, 75, 86, 97, 108].map((y) => box(9, y - 1.5, 3)),
    ],
    draft: [...path("ru", [h(18, 66, 53), h(18, 52, 64)]), ...[53, 64].map((y) => box(9, y - 1.5, 3))],
  },
  // 03 ICP & Signal Map · a three-column table with two live rows
  "03": {
    own: [
      ...path("hr", [h(9, 30, 52), h(38, 60, 52), h(70, 87, 52)]),
      ...path("ru", [h(9, 87, 58)]),
      ...path(
        "ru",
        [66, 75, 84, 93, 102, 111].flatMap((y, i) => [
          h(9, [26, 22, 28, 20, 25, 23][i], y),
          h(38, [58, 52, 61, 49, 56, 54][i], y),
          h(70, [84, 80, 86, 79, 83, 81][i], y),
        ]),
      ),
      { kind: "rect", cls: "hot", x: sx(64), y: sy(75) - 2, w: 4, h: 4 },
      { kind: "rect", cls: "hot", x: sx(64), y: sy(102) - 2, w: 4, h: 4 },
    ],
    draft: path("ru", [52, 59, 66, 73, 80, 87, 94].map((y, i) => h(9, [44, 36, 50, 30, 41, 47, 33][i], y))),
  },
  // 04 Orchestration Rules · if → then: a condition, a chevron, an action
  "04": {
    own: [
      ...path("ru", [54, 67, 80, 93, 106].flatMap((y, i) => [h(9, [33, 29, 35, 27, 31][i], y), h(51, [86, 80, 84, 77, 82][i], y)])),
      ...path("hr", [54, 67, 80, 93, 106].map((y) => `M${sx(40)} ${sy(y) - 3}L${sx(40) + 3.5} ${sy(y) + 0.5}L${sx(40)} ${sy(y) + 4}`)),
    ],
    draft: path("ru", [54, 67, 80, 93, 106].map((y, i) => h(9, [33, 29, 35, 27, 31][i], y))),
  },
  // 05 Signal Dashboard · four readout panels with values, one lit
  "05": {
    own: [
      ...path("ru", [rect(9, 51, 35, 28), rect(52, 51, 35, 28), rect(9, 87, 35, 28), rect(52, 87, 35, 28)]),
      ...path("ru", [h(14, 30, 58), h(57, 74, 58), h(14, 28, 94), h(57, 72, 94)]),
      { kind: "rect", cls: "val", x: sx(14), y: sy(68), w: sx(39) - sx(14), h: 4 },
      { kind: "rect", cls: "val km-handover__val--on", x: sx(57), y: sy(68), w: sx(73) - sx(57), h: 4 },
      { kind: "rect", cls: "val", x: sx(14), y: sy(104), w: sx(33) - sx(14), h: 4 },
      { kind: "rect", cls: "val", x: sx(57), y: sy(104), w: sx(66) - sx(57), h: 4 },
    ],
    draft: [
      ...path("pn", [rect(9, 51, 35, 28), rect(52, 51, 35, 28), rect(9, 87, 35, 28), rect(52, 87, 35, 28)]),
      ...path("ru", [h(14, 30, 58), h(57, 74, 58)]),
    ],
  },
  // 06 Rebuild Sequence · four quarter columns; each quarter carries the last one's rows and adds its own
  "06": {
    own: [
      ...path("hr", [h(9, 24, 52), h(30, 45, 52), h(51, 66, 52), h(72, 87, 52)]),
      ...path(
        "ru",
        [[9, 22], [30, 43], [51, 64], [72, 85]].flatMap(([a, b], q) =>
          [61, 69, 77, 85, 93, 101].slice(0, q + 3).map((y) => h(a, b - ((y + q * 3) % 5), y)),
        ),
      ),
      ...path("lead", [h(9, 22, 61)]),
    ],
    draft: [
      ...path("hr", [h(9, 24, 52)]),
      ...path("ru", [61, 68, 75, 82, 89, 96, 103, 110].map((y, i) => h(9, [22, 18, 24, 16, 21, 19, 23, 17][i], y))),
    ],
  },
};

/** One sheet copy: its index, header rule and title rules, then its page furniture. */
export function sheetShapes(n: string, kind: "own" | "draft"): Shape[] {
  const title = kind === "own" ? [...path("hr", [h(9, 70, 31)]), ...path("ru", [h(9, 56, 38)])] : path("ru", [h(9, 50, 31)]);
  return [...path("hr", [h(32, 87, 15)]), ...title, ...FURNITURE[n][kind]];
}
/** Where the sheet's index sits (x 9, baseline 20 on the 96×136 page). */
export const IX = { x: sx(9), y: sy(20) };

/** The detail card's one line; `nb` is a phrase that must not break ("next-best", "re-scored"). */
export type Line = { pre: string; nb?: string; post?: string };

export type Asset = {
  n: string;
  name: string;
  tag: string;
  /** the letter's margin line this document ends (struck) */
  was: string;
  /** what replaces it */
  now: string;
  /** the detail card's line (round-2 asset descriptions, verbatim) */
  d: Line;
};

export const CAPS = ["Narrative systems", "GTM infrastructure", "GTM intelligence"] as const;

export const ASSETS: Asset[] = [
  { n: "01", name: "Narrative OS", tag: "Document", was: "The founder writes every message", now: "A reusable narrative system",
    d: { pre: "Positioning, language and the message hierarchy every channel inherits." } },
  { n: "02", name: "Channel Playbooks", tag: "Playbook set", was: "Dependent on the agency", now: "The system and docs stay in-house",
    d: { pre: "The plays for email, LinkedIn, phone, content, paid and events." } },
  { n: "03", name: "ICP & Signal Map", tag: "Living dataset", was: "Random outbound activity", now: "Clear ICP and account logic",
    d: { pre: "Who to reach, and the live signals that say when." } },
  { n: "04", name: "Orchestration Rules", tag: "Routing logic", was: "SDRs chase raw volume", now: "The team follows buyer signal",
    d: { pre: "The logic that routes every ", nb: "next-best", post: " touch." } },
  { n: "05", name: "Signal Dashboard", tag: "Instrumentation", was: "No idea why replies stay low", now: "Objections and patterns, named",
    d: { pre: "The readouts your GTM decisions run on." } },
  { n: "06", name: "Rebuild Sequence", tag: "Quarterly plan", was: "Campaigns reset every month", now: "Each quarter deposits into the next",
    d: { pre: "The prioritised plan, ", nb: "re-scored", post: " every quarter." } },
];

/** Slot columns in the figure grid: key zone (1) · datum track (2) · then pairs at 3,5 | 7,9 | 11,13. */
export const COL = [3, 5, 7, 9, 11, 13] as const;
