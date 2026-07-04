"use client";

import { useEffect, useRef } from "react";
import NumberTicker from "@/components/effects/NumberTicker";
import ScrambleOnView from "@/components/effects/ScrambleOnView";
import "./StructuralEvidence.css";

interface Metric {
  id: string;
  index: string;
  /** Numeric value the tile counts up to. */
  value: number;
  suffix: string;
  /** Fill fraction of the gauge (0–1) — the data layer reading. */
  fill: number;
  /** Count-up duration in ms — varied per tile for an organic settle. */
  duration: number;
  claim: string;
  reframe: string;
  source: string;
}

// Four signals, every one from a primary-grade B2B GTM source. Read as a
// set they make one argument: the constraint is structural — narrative,
// mental availability, buying architecture, decision experience — not
// pipeline volume or rep effort. Numbers are verbatim from the citation.
const METRICS: Metric[] = [
  {
    id: "journey",
    index: "S—01",
    value: 17,
    suffix: "%",
    fill: 0.17,
    duration: 1200,
    claim: "of the buying journey is spent with your sales team.",
    reframe:
      "The rest is decided in your absence — on the strength of your narrative, not your reps.",
    source: "Gartner",
  },
  {
    id: "market",
    index: "S—02",
    value: 95,
    suffix: "%",
    fill: 0.95,
    duration: 1650,
    claim: "of your market is out‑of‑market at any given moment.",
    reframe:
      "More outreach can't close a positioning gap. You win by being the answer they already remember.",
    source: "Ehrenberg‑Bass",
  },
  {
    id: "complex",
    index: "S—03",
    value: 77,
    suffix: "%",
    fill: 0.77,
    duration: 1450,
    claim: "of buyers call their last purchase complex or difficult.",
    reframe:
      "That friction lives in the buying architecture — not in how hard the team is selling.",
    source: "Gartner",
  },
  {
    id: "loyalty",
    index: "S—04",
    value: 53,
    suffix: "%",
    fill: 0.53,
    duration: 1350,
    claim: "of loyalty comes from the buying experience — over brand, product and price combined.",
    reframe:
      "How the decision is shaped outweighs whatever sits in the pipeline.",
    source: "CEB · HBR",
  },
];

export default function StructuralEvidence() {
  const sectionRef = useRef<HTMLElement>(null);

  // Staggered entrance + gauge fill, gated on scroll into view so the count
  // and the meter animate together. Reduced motion resolves everything to
  // its final state immediately (NumberTicker handles its own opt-out).
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
                <span className="ev-index">{m.index}</span>
                <span className="ev-source">
                  <ScrambleOnView text={m.source} duration={520} />
                </span>
              </div>

              <div className="ev-figure">
                <NumberTicker
                  value={m.value}
                  suffix={m.suffix}
                  duration={m.duration}
                  className="ev-num"
                />
              </div>

              <div className="ev-gauge" aria-hidden="true">
                <span className="ev-gauge-track" />
                <span className="ev-gauge-fill" />
                <span className="ev-gauge-ticks" />
              </div>

              <p className="ev-claim">{m.claim}</p>

              <div className="ev-divider" aria-hidden="true" />

              <p className="ev-reframe">
                <span className="ev-reframe-label">Reframe</span>
                {m.reframe}
              </p>
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
