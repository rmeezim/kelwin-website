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
  /** What the number measures — a tight caption so the dial self-labels. */
  unit: string;
  /** The plain-language verdict. Skim only these four and you get the argument. */
  takeaway: string;
  /** The diagnostic pivot: what it's mistaken for → what it actually is. */
  mistaken: string;
  actual: string;
  /** Fill fraction of the arc (0–1) — the data-layer reading. */
  fill: number;
  /** Count-up duration in ms — varied per dial for an organic settle. */
  duration: number;
  source: string;
}

// Four signals, every one from a primary-grade B2B GTM source. Each dial
// pairs the reading with a symptom→cause pivot, so the section doesn't just
// list evidence — it re-states the diagnostic reframe four times over: the
// thing you'd blame (pipeline, volume, reps, price) is never the constraint.
const METRICS: Metric[] = [
  {
    id: "journey",
    dimension: "Visibility",
    value: 17,
    suffix: "%",
    unit: "of the journey involves sales",
    takeaway: "The decision happens without you.",
    mistaken: "Pipeline",
    actual: "Narrative",
    fill: 0.17,
    duration: 1200,
    source: "Gartner",
  },
  {
    id: "market",
    dimension: "Timing",
    value: 95,
    suffix: "%",
    unit: "of buyers aren't in‑market",
    takeaway: "Only 5% are ready to buy now.",
    mistaken: "Volume",
    actual: "Memory",
    fill: 0.95,
    duration: 1650,
    source: "Ehrenberg‑Bass",
  },
  {
    id: "complex",
    dimension: "Complexity",
    value: 77,
    suffix: "%",
    unit: "found buying complex or hard",
    takeaway: "Deciding is harder than pitching.",
    mistaken: "Weak reps",
    actual: "Architecture",
    fill: 0.77,
    duration: 1450,
    source: "Gartner",
  },
  {
    id: "loyalty",
    dimension: "Experience",
    value: 53,
    suffix: "%",
    unit: "of loyalty is the experience",
    takeaway: "How you sell beats what you sell.",
    mistaken: "Price",
    actual: "The sell",
    fill: 0.53,
    duration: 1350,
    source: "CEB · HBR",
  },
];

// Dial geometry — shared across all four so the fills compare cleanly.
const R = 52;
const CIRC = 2 * Math.PI * R;

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
            <span className="line-1">The symptoms look like pipeline.</span>{" "}
            <span className="line-2">The instruments read structure.</span>
          </h2>
        </header>

        <div className="ev-grid">
          {METRICS.map((m, i) => (
            <article
              className="ev-dial-cell ev-reveal"
              key={m.id}
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

              <p className="ev-unit">{m.unit}</p>
              <p className="ev-takeaway">{m.takeaway}</p>

              {/* Diagnostic pivot — the mistaken read, struck out, resolving
                  to the real constraint. This is what solidifies the reframe. */}
              <p className="ev-pivot">
                <span className="ev-pivot-wrong">{m.mistaken}</span>
                <span className="ev-pivot-arrow" aria-hidden="true">→</span>
                <span className="ev-pivot-right">{m.actual}</span>
              </p>

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
