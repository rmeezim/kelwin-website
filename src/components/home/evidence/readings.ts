/* The four published readings (approved copy, verbatim from the mockup — slot T).
   Order is the live order: the wall, the readout and the automatic pass all follow it. */
export type Reading = {
  /** The cell label: index · topic. */
  idx: string;
  /** The numeral and its unit (set at .5em, light). */
  num: string;
  unit: string;
  /** The readout's three lines. */
  claim: string;
  so: string;
  detail: string;
  /** MEASURE: the share of 100 the bar fills, and the flag set at the fill's end. */
  at: number;
  val: string;
  /** Screen-reader lead-in before the unit line (not rendered). */
  sr: string;
  /** The bar's unit, in words, and its source. */
  unitText: string;
  src: string;
};

export const READINGS: Reading[] = [
  {
    idx: "01 · Visibility",
    num: "17",
    unit: "%",
    claim: "Buyers spend just 17% of the journey with sales.",
    so: "The deal is decided by your narrative — not your reps.",
    detail:
      "Buyers spend only 17% of a purchase with sales — and less with any single vendor. The decision is mostly made before a rep is in the room, on what the market already believes about you. That’s narrative work, not more outreach.",
    at: 0.17,
    val: "17 / 100",
    sr: "17 of 100. ",
    unitText: "Share of the purchase spent with sales — every vendor combined.",
    src: "Source · Gartner",
  },
  {
    idx: "02 · Timing",
    num: "95",
    unit: ":5",
    claim: "95% of your market isn’t buying right now.",
    so: "You win by being remembered when they are — not by chasing harder.",
    detail:
      "At any given moment only about 5% of your market is actively buying. You can’t convert the 95% who aren’t ready — you can only be the name they recall when they are. That’s mental availability, not pipeline volume.",
    at: 0.05,
    val: "5 / 100",
    sr: "5 of 100; 95 not buying. ",
    unitText: "Share of your market buying right now.",
    src: "Source · Ehrenberg-Bass",
  },
  {
    idx: "03 · Complexity",
    num: "77",
    unit: "%",
    claim: "77% of buyers say the purchase was hard to make.",
    so: "The friction is your buying process — make deciding easier and you win.",
    detail:
      "More than three-quarters of buyers call their last purchase complex or difficult. That friction is the buying process — too many stakeholders, no clear path — not your reps underperforming. You win by making the decision easier to make.",
    at: 0.77,
    val: "77 / 100",
    sr: "77 of 100. ",
    unitText: "Share of buyers who found the purchase hard.",
    src: "Source · Gartner",
  },
  {
    idx: "04 · Experience",
    num: "53",
    unit: "%",
    claim: "53% of loyalty comes from the buying experience.",
    so: "How you sell outweighs brand, product, and price combined.",
    detail:
      "The biggest driver of B2B loyalty isn’t brand, product, or price — it’s the buying experience, at 53%. How you frame and guide the decision outweighs everything sitting in your pipeline. The way you sell is the product.",
    at: 0.53,
    val: "53 / 100",
    sr: "53 of 100. ",
    unitText: "Share of loyalty that comes from the buying experience.",
    src: "Source · CEB · HBR",
  },
];
