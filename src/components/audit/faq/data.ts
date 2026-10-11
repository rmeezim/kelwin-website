/* The six questions, verbatim from the approved mockup (design/redesign/site/frag/faq/U.html).
   Row 01 rests open: the reading path starts at the top, and 02's terms are what the final
   call shows next, so the FAQ never repeats them word for word. */
export type FaqItem = { q: string; a: string };

export const QUESTIONS: FaqItem[] = [
  {
    q: "How is this different from a lead generation agency?",
    a: "An agency rents you activity, and the results stop the day the contract does. Kelwin installs the narrative system, channel orchestration and intelligence layer, and your team owns all three.",
  },
  {
    q: "What exactly is the System Audit?",
    a: "We map how demand actually moves through your narrative, channels and data, and name the constraint holding revenue: rarely the thing you’ve been told to fix. The readout is yours to keep.",
  },
  {
    q: "How long does an install take?",
    a: "We don’t quote a number before the audit. What’s fixed is the shape: Diagnose, Architect and Install run once, in order, and Calibrate becomes a standing cadence.",
  },
  {
    q: "Do you replace our team, or work with it?",
    a: "The system is installed into how your company already runs: its motions, its language, the way deals actually get decided. It is documented, so it survives team changes.",
  },
  {
    q: "What happens when the engagement ends?",
    a: "Six transferable assets, from the Narrative OS to the rebuild sequence, are yours outright. If it stops working the day we leave, we built it wrong.",
  },
  {
    q: "How do we know if we’re a fit?",
    a: "You’re likely a fit if you’re past first revenue, your GTM is founder-led or lean, and committees decide your deals. If not, the audit will say so plainly.",
  },
];

/** The row that rests open (markup, reduced motion, and after the entrance). */
export const RESTING_OPEN = 0;
