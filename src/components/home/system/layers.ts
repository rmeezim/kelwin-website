// The three layers: the ledger's copy and each slab's drawing. Coordinates are drawing units of the
// 755 × 580 strata drawing (viewBox "6 0 755 580"); timings are ms after the slab's own drop.

type Ink = { d: string; at: number; t: number; hero?: boolean };
type Mark = { x: number; y: number; at: number; hub?: boolean };

export type Layer = {
  n: 1 | 2 | 3;
  code: string;
  name: string;
  job: string;
  whatItIs: string;
  inPractice: string;
  /** the layer's own page (round 8, Q5d: "Inside this layer →" in its open row) */
  href: string;
  /** the y of the slab's back corner: slabs sit 132 units apart when installed */
  y0: number;
  /** the job drawn on the slab's top face */
  inks: Ink[];
  /** 03's ring: the gap that closes once the return lands */
  gap?: string;
  nodes: Mark[];
};

export const LAYERS: Layer[] = [
  {
    n: 1,
    code: "01",
    name: "Narrative Systems",
    href: "/capabilities/narrative-systems",
    job: "The words buyers repeat",
    whatItIs: "The positioning and language that decide whether buyers can explain you in their own words.",
    inPractice: "We rewrite what your site, deck and reps say until a buyer can repeat it without you.",
    y0: 75,
    // lines of text
    inks: [
      { d: "M257.4 103L314.5 136", at: 250, t: 300, hero: true },
      { d: "M240.1 113L350.9 177", at: 290, t: 300 },
      { d: "M228.8 119.5L325.8 175.5", at: 330, t: 300 },
      { d: "M217.5 126L324.9 188", at: 370, t: 300 },
      { d: "M206.3 132.5L287.7 179.5", at: 410, t: 300 },
      { d: "M195 139L240.1 165", at: 450, t: 300 },
    ],
    nodes: [],
  },
  {
    n: 2,
    code: "02",
    name: "GTM Infrastructure",
    href: "/capabilities/gtm-infrastructure",
    job: "The machine that carries it to buyers",
    whatItIs: "Data pipelines, orchestration, and CRM architecture built as one documented machine in your stack.",
    inPractice:
      "We build the data pipeline into your CRM, install the plays and triggers in your stack, and run the first cycles with your team, then keep them running on retainer.",
    y0: 207,
    // one signal routed three ways
    inks: [
      { d: "M219.3 249L245.3 264", at: 250, t: 200 },
      { d: "M245.3 264L267.8 251L338.8 292", at: 420, t: 260 },
      { d: "M245.3 264L279.9 284L342.3 320", at: 450, t: 280 },
      { d: "M279.9 284L255.7 298L304.2 326", at: 620, t: 180 },
    ],
    nodes: [
      { x: 216.5, y: 245.5, at: 250 },
      { x: 242.5, y: 261.5, at: 400, hub: true },
      { x: 276.5, y: 281.5, at: 550 },
      { x: 335.5, y: 289.5, at: 660 },
      { x: 339.5, y: 317.5, at: 710 },
      { x: 301.5, y: 323.5, at: 780 },
    ],
  },
  {
    n: 3,
    code: "03",
    name: "GTM Intelligence",
    href: "/capabilities/gtm-intelligence",
    job: "The loop that learns",
    whatItIs: "The observation layer that feeds what works back into narrative and infrastructure, so the system learns.",
    inPractice: "We instrument every touch, then sit with you each quarter and retune the system against what the signal says.",
    y0: 339,
    // a ring that closes once the loop does
    inks: [
      {
        d: "M324.1 423L323 425.2L321.4 427.2L319.6 429.2L317.4 431L314.9 432.8L312.1 434.3L309.1 435.8L305.9 437L302.5 438.1L298.9 438.9L295.2 439.6L291.4 440L287.6 440.3L283.7 440.3L279.8 440.1L276 439.7L272.3 439.1L268.7 438.3L265.2 437.3L261.9 436.1L258.9 434.7L256 433.2L253.5 431.5L251.2 429.7L249.3 427.8L247.6 425.7L246.3 423.6L245.4 421.5L244.9 419.2L244.7 417L244.9 414.8L245.4 412.5L246.3 410.4L247.6 408.3L249.3 406.2L251.2 404.3L253.5 402.5L256 400.8L258.9 399.3L261.9 397.9L265.2 396.7L268.7 395.7L272.3 394.9L276 394.3L279.8 393.9L283.7 393.7L287.6 393.7L291.4 394L295.2 394.4L298.9 395.1L302.5 395.9L305.9 397L309.1 398.2L312.1 399.7L314.9 401.2L317.4 403L319.6 404.8L321.4 406.8L323 408.8L324.1 411",
        at: 250,
        t: 700,
      },
    ],
    gap: "M324.1 411A40.4 23.3 0 0 1 324.1 423",
    nodes: [{ x: 321.5, y: 407.5, at: 900 }],
  },
];

/* Slab geometry from its back corner y0: a 263 × 152 iso rectangle, 14 units thick. */
export const slabTop = (y: number) => `M253.9 ${y}L413.3 ${y + 92}L309.3 ${y + 152}L150 ${y + 60}Z`;
export const slabLeft = (y: number) => `M150 ${y + 60}L309.3 ${y + 152}L309.3 ${y + 166}L150 ${y + 74}Z`;
export const slabRight = (y: number) => `M309.3 ${y + 152}L413.3 ${y + 92}L413.3 ${y + 106}L309.3 ${y + 166}Z`;
/** the slab's silhouette (top + both sides): the keyboard hit's focus rect */
export const slabArea = (y: number) => `M253.9 ${y}L413.3 ${y + 92}V${y + 106}L309.3 ${y + 166}L150 ${y + 74}V${y + 60}Z`;
/** four 12-unit corner brackets, 8 units outside the slab's box */
export const slabFocus = (y: number) =>
  `M141.5 ${y + 3.5}V${y - 8.5}H153.5M409.5 ${y - 8.5}H421.5V${y + 3.5}M421.5 ${y + 162.5}V${y + 174.5}H409.5M153.5 ${y + 174.5}H141.5V${y + 162.5}`;
