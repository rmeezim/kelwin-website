/* fit — the two ledgers' copy (round-5 P2, approved; design/redesign/site/frag/fit/U.html).
   Verbatim: every word, mark and apostrophe is the founder-approved copy. Each `body` entry is
   one sentence — one line per sentence on desktop, flowing together on phones. */

export type FitRow = {
  /** Ledger index: F-01 … / D-01 … */
  code: string;
  title: string;
  /** The short line in the descriptor column. */
  desc: string;
  /** The answer, one sentence per entry. */
  body: string[];
  /** Rests open (the markup's final state). One per ledger. */
  open?: boolean;
};

export type FitSet = {
  /** yes → "Built for", no → "Not for". */
  key: "yes" | "no";
  /** The mono ledger sign (the minus is an en dash: this mono build draws U+2212 as its hyphen). */
  sign: string;
  title: string;
  sub: string;
  /** Element-id stem for the row heads and panels: f → km-fit-fh1 / km-fit-f1. */
  stem: string;
  rows: FitRow[];
};

export const SETS: FitSet[] = [
  {
    key: "yes",
    sign: "+",
    title: "Built for",
    sub: "We say yes when",
    stem: "f",
    rows: [
      {
        code: "F-01",
        title: "Real revenue, felt ceiling",
        desc: "The motion works.",
        body: ["Growth is real, just not predictable yet.", "There’s a motion we can measure, then make repeatable."],
      },
      {
        code: "F-02",
        title: "Someone will own it",
        desc: "An owner inside.",
        body: ["After handover the system is yours — run by your operator, or with us on retainer.", "Owning it is the real gate."],
        open: true,
      },
      {
        code: "F-03",
        title: "Committee-decided sales",
        desc: "Narrative carries the deal.",
        body: ["Several people sign.", "What they repeat to each other decides it, not a coupon at a checkout."],
      },
    ],
  },
  {
    key: "no",
    sign: "–",
    title: "Not for",
    sub: "We decline when",
    stem: "d",
    rows: [
      {
        code: "D-01",
        title: "Rent-it-forever",
        desc: "Dependency by design.",
        body: ["We’ll run it on retainer, but if nobody inside will own it, we decline."],
        open: true,
      },
      {
        code: "D-02",
        title: "Lead-list shopping",
        desc: "Buying lists, not a system.",
        body: ["Renting activity is the cycle we exist to end.", "A list vendor is the better call."],
      },
      {
        code: "D-03",
        title: "Pure self-serve / PLG",
        desc: "The product sells itself.",
        body: ["The system assumes a sales-carried deal."],
      },
    ],
  },
];
