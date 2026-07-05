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
              {/* Real-world shape: each quarter grinds upward with noise —
                  good weeks, bad weeks — then collapses at the boundary when
                  the campaign ends and the pipeline restarts. */}
              <path
                className="sc-line sc-line-reset"
                pathLength={1}
                d="M 16 150 L 30 144 L 44 147 L 58 134 L 72 129 L 86 133 L 98 116 L 104 110
                   L 108 151
                   L 122 144 L 136 138 L 150 141 L 164 127 L 178 122 L 190 110 L 196 104
                   L 200 150
                   L 214 146 L 228 139 L 242 143 L 256 129 L 270 124 L 282 115 L 288 109
                   L 292 149
                   L 306 143 L 320 135 L 334 139 L 348 122 L 362 117 L 376 108 L 384 103"
              />
              {/* Drop markers where the resets happen. */}
              <line className="sc-drop" x1="108" y1="110" x2="108" y2="151" />
              <line className="sc-drop" x1="200" y1="104" x2="200" y2="150" />
              <line className="sc-drop" x1="292" y1="109" x2="292" y2="149" />
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
                d="M 16 150 L 31 148 L 46 149 L 62 146 L 77 147 L 92 143 L 108 144 L 123 139
                   L 138 141 L 154 135 L 169 137 L 184 130 L 200 125 L 215 128 L 230 118
                   L 246 111 L 261 115 L 276 101 L 292 93 L 307 97 L 322 78 L 338 70
                   L 353 74 L 368 52 L 384 34
                   L 384 156 L 16 156 Z"
              />
              {/* Same market, same noise — drawdowns included — but every
                  cycle keeps its gains, so the trend bends upward. */}
              <path
                className="sc-line sc-line-compound"
                pathLength={1}
                d="M 16 150 L 31 148 L 46 149 L 62 146 L 77 147 L 92 143 L 108 144 L 123 139
                   L 138 141 L 154 135 L 169 137 L 184 130 L 200 125 L 215 128 L 230 118
                   L 246 111 L 261 115 L 276 101 L 292 93 L 307 97 L 322 78 L 338 70
                   L 353 74 L 368 52 L 384 34"
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

      </div>
      {/* The marquee band ("In a noisy market, the clearest company wins…")
          renders directly below this section — it carries the coda. */}
    </section>
  );
}
