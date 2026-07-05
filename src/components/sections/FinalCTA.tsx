"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import DotMatrixReading from "@/components/ui/DotMatrixReading";
import "./FinalCTA.css";

// The one red moment: a full-bleed signal-red "deployment terminal" that
// closes the page. Adopts the sister-brand's poster-red language (Plurel's
// red cards) but in Kelwin's instrument form — rounded grid-cell furniture
// and scattered mono ticks lifted from the reference pitch-deck cover,
// corner brackets, and the flip-board reading as the hero readout.

// Deterministic scatter of "tick" marks across the cell grid — indices into
// a 6×4 grid. Fixed (not random) so SSR and client markup match.
const GRID_COLS = 6;
const GRID_ROWS = 4;
const TICK_CELLS = [1, 6, 9, 14, 17, 22];

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);

  // Trip the dot-matrix reveal once the section scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const row = el.querySelector<HTMLElement>(".fcta-readout");
    if (!row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      row.classList.add("dm-live");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            row.classList.add("dm-live");
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="fcta" ref={ref}>
      {/* Grid-cell furniture — rounded outlines with scattered ticks. */}
      <div className="fcta-grid" aria-hidden="true">
        {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => (
          <span className="fcta-cell" key={i}>
            {TICK_CELLS.includes(i) && <span className="fcta-tick" />}
          </span>
        ))}
      </div>

      {/* Corner registration brackets. */}
      <span className="fcta-corner fcta-corner-tl" aria-hidden="true" />
      <span className="fcta-corner fcta-corner-tr" aria-hidden="true" />
      <span className="fcta-corner fcta-corner-bl" aria-hidden="true" />
      <span className="fcta-corner fcta-corner-br" aria-hidden="true" />

      <div className="fcta-stage">
        {/* Top status bar. */}
        <div className="fcta-topbar">
          <span className="fcta-mono">KELWIN/OS · DEPLOYMENT</span>
          <span className="fcta-mono fcta-status">
            <span className="fcta-status-dot" />
            System Ready
          </span>
        </div>

        {/* Core: headline + copy on the left, readout on the right. */}
        <div className="fcta-core">
          <div className="fcta-lead">
            <span className="fcta-eyebrow">
              <span className="fcta-eyebrow-dash" aria-hidden="true" />
              Final Protocol
            </span>
            <h2 className="fcta-headline">
              Install the system
              <br />
              your revenue runs on.
            </h2>
            <p className="fcta-sub">
              One diagnostic maps the architecture underneath your pipeline.
              What we build, you keep — and it compounds long after we leave.
            </p>
            <div className="fcta-actions">
              <DiagnosticMethodCTA
                href="/audit"
                label="Initiate System Audit"
                variant="bone"
              />
              <Link className="fcta-secondary" href="/audit">
                Book a strategic call
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            {/* Expectation-setting micro-copy — what the button actually
                starts (Gemini audit: reduce CTA friction). */}
            <p className="fcta-microcopy">
              Fixed scope · ten working days · the readout is yours to keep.
            </p>
          </div>

          <div className="fcta-readout dm-armed" aria-hidden="true">
            <DotMatrixReading value="T-00" cell={13} label="Deployment window open" />
            <span className="fcta-readout-label">Deployment Window · Open</span>
          </div>
        </div>

        {/* Bottom status bar. */}
        <div className="fcta-botbar">
          <span className="fcta-mono">Audit/Spec · v1.0</span>
          <span className="fcta-mono">Fixed scope · Ten working days</span>
        </div>
      </div>
    </section>
  );
}
