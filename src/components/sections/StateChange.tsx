"use client";

import { useEffect, useRef } from "react";
import "./StateChange.css";

// ─── State Change — the outcome as one visual argument ────────────────────
// Two panels, same axis: the typical GTM that resets to zero each quarter
// vs. the installed system that compounds. Replaces the six-principle
// ledger + marquee band — one artifact carries the idea both were making.
// The band's line survives as the coda; the infrastructure principle
// survives as the subhead.

export default function StateChange() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(".sc-reveal");
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

  // Shared chart furniture: baseline + quarter ticks (sand structure).
  const Axis = () => (
    <g aria-hidden="true">
      <line className="sc-axis" x1="16" y1="156" x2="384" y2="156" />
      {[16, 108, 200, 292, 384].map((x) => (
        <line key={x} className="sc-tick" x1={x} y1="156" x2={x} y2="151" />
      ))}
    </g>
  );

  return (
    <section id="state-change" className="statechange" ref={sectionRef}>
      <div className="sc-stage">
        <header className="sc-head sc-reveal">
          <div className="sc-head-top">
            <span className="sc-eyebrow">
              <span className="sc-eyebrow-dash" aria-hidden="true" />
              Operating Principle
            </span>
            <span className="sc-meta">State change · Δ</span>
          </div>
          <h2 className="sc-heading">
            <span className="line-1">Stop resetting.</span>{" "}
            <span className="line-2">Start compounding.</span>
          </h2>
          <p className="sc-sub">
            Most companies rebuild their pipeline from scratch every quarter.
            We build the part that carries forward.
          </p>
        </header>

        <div className="sc-grid">
          {/* ── Without the system — the sawtooth ── */}
          <figure className="sc-panel sc-reveal">
            <figcaption className="sc-panel-head">
              <span className="sc-panel-tag">Typical GTM</span>
              <span className="sc-panel-mode sc-mode-reset">Resets</span>
            </figcaption>
            <svg className="sc-chart" viewBox="0 0 400 176" aria-hidden="true">
              <Axis />
              {/* Sawtooth: each quarter's climb collapses back to baseline. */}
              <path
                className="sc-line sc-line-reset"
                pathLength={1}
                d="M 16 150 L 96 96 L 100 150 L 180 92 L 184 150 L 264 88 L 268 150 L 348 90 L 352 150 L 384 128"
              />
              {/* Drop markers where the resets happen. */}
              {[100, 184, 268, 352].map((x) => (
                <line key={x} className="sc-drop" x1={x} y1="96" x2={x} y2="150" />
              ))}
            </svg>
            <div className="sc-qlabels" aria-hidden="true">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
            <p className="sc-note">
              Campaigns end. Reps rotate. Learning evaporates — every quarter
              starts at zero.
            </p>
          </figure>

          {/* ── With the system — the compounding curve ── */}
          <figure className="sc-panel sc-reveal">
            <figcaption className="sc-panel-head">
              <span className="sc-panel-tag">With the system</span>
              <span className="sc-panel-mode sc-mode-compound">Compounds</span>
            </figcaption>
            <svg className="sc-chart" viewBox="0 0 400 176" aria-hidden="true">
              <Axis />
              {/* Soft area wash under the curve (clay data, whisper-level). */}
              <path
                className="sc-area"
                d="M 16 150 C 110 142, 190 132, 260 106 C 310 88, 350 62, 384 34 L 384 156 L 16 156 Z"
              />
              <path
                className="sc-line sc-line-compound"
                pathLength={1}
                d="M 16 150 C 110 142, 190 132, 260 106 C 310 88, 350 62, 384 34"
              />
              {/* Live tip — the section's one red moment. */}
              <circle className="sc-tip" cx="384" cy="34" r="3.5" />
            </svg>
            <div className="sc-qlabels" aria-hidden="true">
              <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
            </div>
            <p className="sc-note">
              Narrative, channels, and signal feed forward — every cycle
              deposits into the next.
            </p>
          </figure>
        </div>

        <div className="sc-foot sc-reveal">
          <p className="sc-coda">
            In a noisy market, the clearest company wins — not the loudest or
            the busiest.
          </p>
        </div>
      </div>
    </section>
  );
}
