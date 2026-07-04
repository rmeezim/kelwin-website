"use client";

import { useEffect, useRef } from "react";
import NumberTicker from "@/components/effects/NumberTicker";
import ScrambleOnView from "@/components/effects/ScrambleOnView";
import "./StructuralEvidence.css";

interface Metric {
  id: string;
  /** One-word axis chip — the facet of the problem this signal covers. */
  dimension: string;
  /** Numeric value the tile counts up to. */
  value: number;
  suffix: string;
  /** What the number measures — sits directly under it so the figure self-labels. */
  unit: string;
  /** The plain-language verdict. Skim only these four and you get the argument. */
  takeaway: string;
  /** The structural "so what" for the reader. */
  support: string;
  /** Fill fraction of the meter (0–1) — the data-layer reading. */
  fill: number;
  /** Count-up duration in ms — varied per tile for an organic settle. */
  duration: number;
  source: string;
}

// Four signals, every one from a primary-grade B2B GTM source. Read as a
// set they make one argument: the constraint is structural — visibility,
// timing, complexity, experience — not pipeline volume or rep effort.
// Numbers are verbatim from the citation; the takeaway carries the meaning.
const METRICS: Metric[] = [
  {
    id: "journey",
    dimension: "Visibility",
    value: 17,
    suffix: "%",
    unit: "of the buying journey is spent with sales",
    takeaway: "The decision happens without you.",
    support:
      "By the time a rep is in the room, the thinking is mostly done. Your narrative did the selling — or it didn't.",
    fill: 0.17,
    duration: 1200,
    source: "Gartner",
  },
  {
    id: "market",
    dimension: "Timing",
    value: 95,
    suffix: "%",
    unit: "of your market is out‑of‑market today",
    takeaway: "Only 5% are ready to buy now.",
    support:
      "Chasing that 5% harder won't grow you. Being the name the other 95% remember will.",
    fill: 0.95,
    duration: 1650,
    source: "Ehrenberg‑Bass",
  },
  {
    id: "complex",
    dimension: "Complexity",
    value: 77,
    suffix: "%",
    unit: "call their last purchase complex or hard",
    takeaway: "Deciding is harder than pitching.",
    support:
      "That friction is built into how the choice gets made — not fixed by selling harder.",
    fill: 0.77,
    duration: 1450,
    source: "Gartner",
  },
  {
    id: "loyalty",
    dimension: "Experience",
    value: 53,
    suffix: "%",
    unit: "of loyalty comes from the buying experience",
    takeaway: "How you sell beats what you sell.",
    support:
      "More than brand, product and price combined. The experience is the product.",
    fill: 0.53,
    duration: 1350,
    source: "CEB · HBR",
  },
];

export default function StructuralEvidence() {
  const sectionRef = useRef<HTMLElement>(null);

  // Staggered entrance + meter fill, gated on scroll into view so the count
  // and the bar animate together. Reduced motion resolves everything to its
  // final state immediately (NumberTicker handles its own opt-out).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(".ev-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.2 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="evidence" className="evidence" ref={sectionRef}>
      <div className="ev-stage">
        <header className="ev-head ev-reveal">
          <div className="ev-head-top">
            <span className="ev-eyebrow">
              <span className="ev-eyebrow-dash" aria-hidden="true" />
              The structural read
            </span>
            <span className="ev-meta">Evidence · four signals</span>
          </div>
          <h2 className="ev-heading">
            <span className="line-1">The symptoms look like pipeline.</span>{" "}
            <span className="line-2">The evidence points to structure.</span>
          </h2>
        </header>

        <div className="ev-grid">
          {METRICS.map((m, i) => (
            <article
              className="ev-tile ev-reveal"
              key={m.id}
              style={{ ["--i" as string]: i, ["--pct" as string]: m.fill }}
            >
              <span className="ev-bracket ev-bracket-tl" aria-hidden="true" />
              <span className="ev-bracket ev-bracket-br" aria-hidden="true" />

              <div className="ev-tile-top">
                <span className="ev-dimension">{m.dimension}</span>
                <span className="ev-source">
                  <ScrambleOnView text={m.source} duration={520} />
                </span>
              </div>

              {/* Number + unit read as one self-labeling block. */}
              <div className="ev-figure">
                <NumberTicker
                  value={m.value}
                  suffix={m.suffix}
                  duration={m.duration}
                  className="ev-num"
                />
              </div>
              <p className="ev-unit">{m.unit}</p>

              {/* Meter — the physical proof of the proportion. */}
              <div className="ev-meter" aria-hidden="true">
                <span className="ev-meter-track" />
                <span className="ev-meter-fill" />
                <span className="ev-meter-ticks" />
              </div>

              {/* Takeaway — the instant meaning. Skim these four alone and
                  you have the whole argument. */}
              <p className="ev-takeaway">{m.takeaway}</p>
              <p className="ev-support">{m.support}</p>
            </article>
          ))}
        </div>

        <div className="ev-foot ev-reveal">
          <p className="ev-coda">A structural constraint doesn&rsquo;t yield to more volume.</p>
          <span className="ev-sources">
            Sources · Gartner B2B Buying Journey · Ehrenberg‑Bass 95:5 · CEB / HBR
          </span>
        </div>
      </div>
    </section>
  );
}
