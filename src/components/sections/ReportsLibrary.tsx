"use client";

import { useEffect, useRef } from "react";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "./ReportsLibrary.css";

// ─── Reports — the document registry ──────────────────────────────────────
// Two document classes: research documents authored by the practice, and
// engagement readouts published only when a client clears them. This page
// is the palette's one STEEL deployment — steel marks document artifacts
// (glyphs, class chips, registry furniture) and nothing else, so print/PDF
// collateral and the site share a single vocabulary. Statuses stay honest:
// nothing here pretends to be downloadable before it exists.

interface Report {
  n: string;
  title: string;
  abstract: string;
  contents: string[];
  format: string;
  pages: string;
  cadence: string;
  status: string;
  subject: string;
}

const RESEARCH: Report[] = [
  {
    n: "R·01",
    title: "The Revenue Entropy Index — 2026 benchmark",
    abstract:
      "How fast GTM learning decays across B2B teams: reset cadence, signal retention, and narrative drift — benchmarked across installs and public data.",
    contents: ["Method", "Benchmarks", "Findings", "Worksheets"],
    format: "PDF",
    pages: "~28 pp",
    cadence: "Annual",
    status: "In production · Q4 2026",
    subject: "Report%20request%3A%20R%C2%B701%20Revenue%20Entropy%20Index",
  },
  {
    n: "R·02",
    title: "Signal-Based Selling — the field spec",
    abstract:
      "The operating spec for omnichannel signal routing: trigger classes, routing logic, and the instrumentation that keeps the motion honest.",
    contents: ["Trigger taxonomy", "Routing rules", "Instrumentation"],
    format: "PDF",
    pages: "~18 pp",
    cadence: "Versioned",
    status: "In production",
    subject: "Report%20request%3A%20R%C2%B702%20Signal-Based%20Selling",
  },
  {
    n: "R·03",
    title: "The Deliverability Spec Sheet",
    abstract:
      "Domains, authentication, warmup, and list discipline — the infrastructure floor under every outbound message you will ever send.",
    contents: ["Domain architecture", "Auth records", "Warmup protocol", "List hygiene"],
    format: "PDF",
    pages: "~12 pp",
    cadence: "Maintained",
    status: "Drafting",
    subject: "Report%20request%3A%20R%C2%B703%20Deliverability%20Spec%20Sheet",
  },
];

function DocGlyph() {
  return (
    <svg className="repx-glyph" viewBox="0 0 34 42" aria-hidden="true">
      {/* document sheet with folded corner — steel, the document accent */}
      <path d="M1 1 H24 L33 10 V41 H1 Z" className="repx-glyph-sheet" />
      <path d="M24 1 V10 H33" className="repx-glyph-fold" />
      <line x1="8" y1="18" x2="26" y2="18" className="repx-glyph-rule" />
      <line x1="8" y1="24" x2="26" y2="24" className="repx-glyph-rule" />
      <line x1="8" y1="30" x2="19" y2="30" className="repx-glyph-rule" />
    </svg>
  );
}

export default function ReportsLibrary() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".repx-reveal");
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
      { threshold: 0.15 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="repx" ref={mainRef}>
      <div className="repx-stage">
        {/* ── Head ── */}
        <header className="repx-head repx-reveal">
          <div className="repx-protocol-row">
            <span className="repx-protocol">Resources · Reports</span>
            <span className="repx-protocol-line" aria-hidden="true" />
            <span className="repx-stamp">KELWIN/OS · DOC REGISTRY</span>
          </div>
          <h1 className="repx-title">
            <span className="repx-title-1">Documents, not decks.</span>
            <span className="repx-title-2">Research, specs, and readouts.</span>
          </h1>
          <p className="repx-lede">
            Two document classes ship from the practice: research we author on
            the state of B2B GTM, and engagement readouts — published only
            when a client clears them for release. Everything indexed here is
            real, which is why the index grows slowly.
          </p>
          <div className="repx-key" aria-label="Registry key">
            <span className="repx-key-swatch" aria-hidden="true" />
            <span className="repx-key-label">
              Steel marks a document artifact — the same accent our print
              collateral carries
            </span>
          </div>
        </header>

        {/* ── Class A: research documents ── */}
        <section className="repx-class" aria-label="Research documents">
          <div className="repx-class-head repx-reveal">
            <span className="repx-class-chip">Class A</span>
            <h2 className="repx-class-title">Research documents</h2>
            <span className="repx-class-line" aria-hidden="true" />
            <span className="repx-class-note">Authored by the practice</span>
          </div>

          <div className="repx-cards">
            {RESEARCH.map((r, i) => (
              <article
                className="repx-card repx-reveal"
                key={r.n}
                style={{ ["--i" as string]: i }}
                aria-label={`${r.n} — ${r.title}`}
              >
                <div className="repx-card-glyph">
                  <DocGlyph />
                  <span className="repx-num">{r.n}</span>
                </div>

                <div className="repx-card-main">
                  <h3 className="repx-card-title">{r.title}</h3>
                  <p className="repx-card-abstract">{r.abstract}</p>
                  <div className="repx-card-contents" aria-label="Contents">
                    {r.contents.map((c, ci) => (
                      <span className="repx-content-item" key={c}>
                        {ci > 0 && <span className="repx-content-div" aria-hidden="true">·</span>}
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="repx-card-spec">
                  <dl className="repx-spec-list">
                    <div className="repx-spec-row">
                      <dt>Format</dt>
                      <dd>{r.format}</dd>
                    </div>
                    <div className="repx-spec-row">
                      <dt>Length</dt>
                      <dd>{r.pages}</dd>
                    </div>
                    <div className="repx-spec-row">
                      <dt>Cadence</dt>
                      <dd>{r.cadence}</dd>
                    </div>
                  </dl>
                  <span className="repx-status">{r.status}</span>
                  <ArrowLink
                    href={`mailto:audit@kelwin.co?subject=${r.subject}`}
                    label="Request on release"
                    tone="sand"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Class B: engagement readouts ── */}
        <section className="repx-class" aria-label="Engagement readouts">
          <div className="repx-class-head repx-reveal">
            <span className="repx-class-chip">Class B</span>
            <h2 className="repx-class-title">Engagement readouts</h2>
            <span className="repx-class-line" aria-hidden="true" />
            <span className="repx-class-note">Published with permission</span>
          </div>

          <div className="repx-readout-panel repx-reveal">
            <p className="repx-readout-body">
              A readout is the document an engagement produces: the system
              state we found, what was installed, and what the instrumentation
              showed after — including what didn&rsquo;t work. Clients own
              their readouts; we publish one only when it&rsquo;s cleared for
              release.
            </p>
            <div className="repx-terminal" role="status">
              <div className="repx-terminal-line">
                <span className="repx-terminal-prompt" aria-hidden="true">&gt;</span>
                readouts.index — no releases cleared yet
              </div>
              <div className="repx-terminal-line">
                <span className="repx-terminal-prompt" aria-hidden="true">&gt;</span>
                published as clients approve them
              </div>
              <div className="repx-terminal-line">
                <span className="repx-terminal-prompt" aria-hidden="true">&gt;</span>
                <span className="repx-cursor" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Foot / conversion ── */}
        <footer className="repx-foot repx-reveal">
          <p className="repx-coda">
            Your engagement&rsquo;s readout is yours to keep — publishing it is
            always your call.
          </p>
          <div className="repx-foot-actions">
            <DiagnosticMethodCTA
              href="/audit"
              label="Request the audit"
              variant="signal"
            />
            <ArrowLink
              href="mailto:audit@kelwin.co?subject=Document%20request"
              label="Request a document"
              tone="sand"
            />
          </div>
          <p className="repx-foot-note">
            Research documents ship to requesters first, then to the index.
          </p>
        </footer>
      </div>
    </main>
  );
}
