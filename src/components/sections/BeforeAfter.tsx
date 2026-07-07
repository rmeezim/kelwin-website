"use client";

import { useEffect, useRef } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import "./BeforeAfter.css";

// ─── Before / After — the transformation ledger ───────────────────────────
// Same team, same market — what changes is the system underneath. Six paired
// shifts, each tagged with the dimension it moves. The old state carries the
// red decline mark (the entropy the site keeps naming); the installed state
// carries the patina "system is working" mark. Reuses the Fit gate's ✕ / ✓
// vocabulary so the two qualification/outcome moments read as one instrument.

interface Shift {
  tag: string;
  before: string;
  after: string;
}

const SHIFTS: Shift[] = [
  { tag: "Targeting",   before: "Random outbound activity",          after: "Clear ICP and account logic" },
  { tag: "Messaging",   before: "The founder writes every message",  after: "A reusable narrative system" },
  { tag: "Compounding", before: "Campaigns reset every month",       after: "Learning that compounds each cycle" },
  { tag: "Motion",      before: "SDRs chase raw volume",             after: "The team follows buyer signal" },
  { tag: "Diagnosis",   before: "No idea why replies stay low",      after: "Objections and patterns, named" },
  { tag: "Ownership",   before: "Dependent on the agency",           after: "The system and docs stay in-house" },
];

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(".ba-reveal");
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
      { threshold: 0.18 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="transformation" className="shift" ref={sectionRef}>
      <div className="shift-stage">
        <header className="shift-head ba-reveal">
          <div className="shift-head-top">
            <span className="shift-eyebrow">
              <span className="shift-eyebrow-dash" aria-hidden="true" />
              Transformation
            </span>
            <span className="shift-meta">Operating state · before → after</span>
          </div>
          <h2 className="shift-heading">
            <span className="line-1">Before Kelwin.</span>{" "}
            <span className="line-2">After Kelwin.</span>
          </h2>
          <p className="shift-lede">
            Same team, same market. What changes is the system underneath — and
            everything that system produces.
          </p>
        </header>

        <div className="shift-panel ba-reveal">
          <div className="shift-panel-head">
            <span className="shift-protocol">Operating State</span>
            <span className="shift-panel-line" aria-hidden="true" />
            <span className="shift-stamp">6 shifts · one installed system</span>
          </div>

          <div className="shift-table" role="table" aria-label="Before and after Kelwin, across six dimensions">
            <div className="shift-colhead" role="row" aria-hidden="true">
              <span className="shift-col-tag" />
              <span className="shift-collabel is-before">Before · without the system</span>
              <span className="shift-col-arrow" />
              <span className="shift-collabel is-after">After · with the system</span>
            </div>

            {SHIFTS.map((s, i) => (
              <div
                className="shift-row ba-reveal"
                role="row"
                key={s.tag}
                style={{ ["--i" as string]: i }}
              >
                <span className="shift-tag" role="cell">{s.tag}</span>
                <span className="shift-cell shift-before" role="cell">
                  <span className="shift-mark shift-mark-no" aria-hidden="true" />
                  <span className="shift-text">{s.before}</span>
                </span>
                <span className="shift-arrow" role="cell" aria-hidden="true">→</span>
                <span className="shift-cell shift-after" role="cell">
                  <span className="shift-mark shift-mark-yes" aria-hidden="true" />
                  <span className="shift-text">{s.after}</span>
                </span>
              </div>
            ))}
          </div>

          <footer className="shift-verdict ba-reveal">
            <p className="shift-coda">The activity can look the same. The system underneath is the difference.</p>
            <ArrowLink href="/audit" label="See what changes — start with the audit" tone="sand" />
          </footer>
        </div>
      </div>
    </section>
  );
}
