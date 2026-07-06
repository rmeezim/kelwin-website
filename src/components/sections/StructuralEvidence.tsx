"use client";

import { useEffect, useRef } from "react";
import NumberTicker from "@/components/effects/NumberTicker";
import "./StructuralEvidence.css";

interface Metric {
  id: string;
  /** One-word axis chip — the facet of the problem this signal covers. */
  dimension: string;
  /** Numeric value the dial counts up to. */
  value: number;
  suffix: string;
  /** The finding as one plain, complete sentence — no assembly required. */
  claim: string;
  /** The so-what, one line: what this means you should fix. */
  so: string;
  /** The expanded read revealed on hover/focus — depth for the curious. */
  detail: string;
  /** Fill fraction of the arc (0–1) — the data-layer reading. */
  fill: number;
  /** Count-up duration in ms — varied per dial for an organic settle. */
  duration: number;
  source: string;
}

// Four signals, every one from a primary-grade B2B GTM source. Each tile
// reads in two beats with zero decoding: a full-sentence finding (the
// number restated in words, so the dial never needs interpreting), then
// one line naming the real fix. Hover keeps the deeper read.
const METRICS: Metric[] = [
  {
    id: "journey",
    dimension: "Visibility",
    value: 17,
    suffix: "%",
    claim: "Buyers spend just 17% of the journey with sales.",
    so: "The deal is decided by your narrative — not your reps.",
    detail:
      "Buyers spend only 17% of a purchase with sales — and less with any single vendor. The decision is mostly made before a rep is in the room, on what the market already believes about you. That's narrative work, not more outreach.",
    fill: 0.17,
    duration: 1200,
    source: "Gartner",
  },
  {
    id: "market",
    dimension: "Timing",
    value: 95,
    suffix: "%",
    claim: "95% of your market isn't buying right now.",
    so: "You win by being remembered when they are — not by chasing harder.",
    detail:
      "At any given moment only about 5% of your market is actively buying. You can't convert the 95% who aren't ready — you can only be the name they recall when they are. That's mental availability, not pipeline volume.",
    fill: 0.95,
    duration: 1650,
    source: "Ehrenberg‑Bass",
  },
  {
    id: "complex",
    dimension: "Complexity",
    value: 77,
    suffix: "%",
    claim: "77% of buyers say the purchase was hard to make.",
    so: "The friction is your buying process — make deciding easier and you win.",
    detail:
      "More than three‑quarters of buyers call their last purchase complex or difficult. That friction is the buying process — too many stakeholders, no clear path — not your reps underperforming. You win by making the decision easier to make.",
    fill: 0.77,
    duration: 1450,
    source: "Gartner",
  },
  {
    id: "loyalty",
    dimension: "Experience",
    value: 53,
    suffix: "%",
    claim: "53% of loyalty comes from the buying experience.",
    so: "How you sell outweighs brand, product, and price combined.",
    detail:
      "The biggest driver of B2B loyalty isn't brand, product, or price — it's the buying experience, at 53%. How you frame and guide the decision outweighs everything sitting in your pipeline. The way you sell is the product.",
    fill: 0.53,
    duration: 1350,
    source: "CEB · HBR",
  },
];

// Dial geometry — shared across all four so the fills compare cleanly.
const R = 52;
const CIRC = 2 * Math.PI * R;

// Split into words for the blur-to-focus reveal; each word carries its
// index so CSS can stagger it into existence.
function words(text: string) {
  return text.split(" ").map((w, i) => (
    <span className="ev-word" style={{ ["--wi" as string]: i }} key={i}>
      {w}{" "}
    </span>
  ));
}

export default function StructuralEvidence() {
  const sectionRef = useRef<HTMLElement>(null);

  // Staggered entrance + arc sweep + count-up, gated on scroll into view.
  // Reduced motion resolves everything to its final state immediately
  // (NumberTicker handles its own opt-out; the arcs snap via .is-in).
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
            <span className="ev-meta">Diagnostic · four instruments</span>
          </div>
          <h2 className="ev-heading">
            <span className="line-1">Four numbers.</span>{" "}
            <span className="line-2">One diagnosis.</span>
          </h2>
          <p className="ev-subhead">
            Every one of them gets blamed on the pipeline. Every one is
            measuring something structural.{" "}
            <span className="ev-subhead-hint">Hover a dial for the full read.</span>
          </p>
        </header>

        <div className="ev-grid">
          {METRICS.map((m, i) => (
            <article
              className="ev-dial-cell ev-reveal"
              key={m.id}
              tabIndex={0}
              aria-label={`${m.claim} ${m.detail}`}
              style={{ ["--i" as string]: i, ["--pct" as string]: m.fill }}
            >
              <span className="ev-dimension">{m.dimension}</span>

              {/* Radial gauge — the arc sweeps to the proportion; the number
                  counts up in the center. Read at a glance before any text. */}
              <div className="ev-dial">
                <svg className="ev-dial-svg" viewBox="0 0 120 120" aria-hidden="true">
                  {/* faint outer bezel */}
                  <circle className="ev-dial-bezel" cx="60" cy="60" r="58" />
                  {/* cardinal calibration ticks (sand structure) */}
                  <g className="ev-dial-ticks">
                    <line x1="60" y1="1.5" x2="60" y2="8" />
                    <line x1="118.5" y1="60" x2="112" y2="60" />
                    <line x1="60" y1="118.5" x2="60" y2="112" />
                    <line x1="1.5" y1="60" x2="8" y2="60" />
                  </g>
                  {/* track ring */}
                  <circle className="ev-dial-track" cx="60" cy="60" r={R} />
                  {/* value arc (clay data) — animates via stroke-dashoffset */}
                  <circle
                    className="ev-dial-arc"
                    cx="60"
                    cy="60"
                    r={R}
                    transform="rotate(-90 60 60)"
                    style={{
                      strokeDasharray: CIRC,
                      ["--circ" as string]: CIRC,
                    }}
                  />
                </svg>
                <div className="ev-dial-center">
                  <NumberTicker
                    value={m.value}
                    suffix={m.suffix}
                    duration={m.duration}
                    className="ev-num"
                  />
                </div>
              </div>

              {/* Two beats, zero decoding: the finding as a full sentence,
                  then the one-line fix it points to. */}
              <p className="ev-claim">{m.claim}</p>
              <p className="ev-so">{m.so}</p>

              {/* Hover/focus detail — the point spelled out, words fading into
                  focus. Overlays the cell on pointer devices; sits inline on
                  touch (before the source) so the reading is never gated. */}
              <div className="ev-detail" aria-hidden="true">
                <span className="ev-detail-head">
                  {m.dimension} · {m.value}
                  {m.suffix}
                </span>
                <p className="ev-detail-body">{words(m.detail)}</p>
              </div>

              <span className="ev-source">{m.source}</span>
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
