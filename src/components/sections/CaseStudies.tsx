"use client";

import { useEffect, useRef } from "react";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "./CaseStudies.css";

// ─── Reports — case dossiers ──────────────────────────────────────────────
// Case studies presented as engagement readouts: the state we found (red ✕),
// what was installed (sand ▪), and what the instrumentation showed (patina
// metrics). Steel marks the document artifact itself. Every dossier is
// labeled SPECIMEN until clients clear real readouts for release — the
// format is the product being shown, and we don't publish invented proof.

interface CaseDossier {
  n: string;
  client: string;
  profile: { k: string; v: string }[];
  found: string[];
  installed: string[];
  readout: { value: string; label: string }[];
  window: string;
}

const CASES: CaseDossier[] = [
  {
    n: "CS·01",
    client: "Series B data-infrastructure vendor",
    profile: [
      { k: "Team", v: "340 FTE · NA/EU" },
      { k: "Motion", v: "Sales-led · committee deals" },
      { k: "Window", v: "Two quarters" },
    ],
    found: [
      "Founder writing every outbound message by hand",
      "Four SDRs chasing volume against a static list",
      "Campaigns reset monthly — no learning carried forward",
    ],
    installed: [
      "Narrative OS — category, language system, proof hierarchy",
      "ICP + signal map routing live buying triggers",
      "Omnichannel orchestration across email, social, phone",
      "Instrumentation layer with quarterly retune cadence",
    ],
    readout: [
      { value: "2.1×", label: "Qualified-opportunity rate" },
      { value: "31%", label: "Reply-to-meeting conversion" },
      { value: "90→14d", label: "Learning-cycle length" },
    ],
    window: "ENGAGEMENT · Q1–Q2",
  },
  {
    n: "CS·02",
    client: "Post-Series A cybersecurity platform",
    profile: [
      { k: "Team", v: "120 FTE · NA" },
      { k: "Motion", v: "Sales-led · security review cycles" },
      { k: "Window", v: "Three quarters" },
    ],
    found: [
      "Category unclear — buyers filed them against the wrong incumbents",
      "Channels run in silos: email, events, and SDRs never synchronized",
      "No feedback loop — wins and losses left no trace in the system",
    ],
    installed: [
      "Category narrative built for the security committee's risk argument",
      "Signal-based routing replacing calendar-based sequencing",
      "Closed learning loop — win/loss telemetry feeding the retune",
    ],
    readout: [
      { value: "1.4→3.2×", label: "Pipeline coverage" },
      { value: "+9pts", label: "Win rate, competitive deals" },
      { value: "−31%", label: "CAC payback period" },
    ],
    window: "ENGAGEMENT · Q2–Q4",
  },
];

const RESEARCH = [
  {
    n: "R·01",
    title: "The Revenue Entropy Index — 2026 benchmark",
    status: "In production · Q4 2026",
    subject: "Report%20request%3A%20R%C2%B701%20Revenue%20Entropy%20Index",
  },
  {
    n: "R·02",
    title: "Signal-Based Selling — the field spec",
    status: "In production",
    subject: "Report%20request%3A%20R%C2%B702%20Signal-Based%20Selling",
  },
  {
    n: "R·03",
    title: "The Deliverability Spec Sheet",
    status: "Drafting",
    subject: "Report%20request%3A%20R%C2%B703%20Deliverability%20Spec%20Sheet",
  },
];

function DocGlyph() {
  return (
    <svg className="cs-glyph" viewBox="0 0 34 42" aria-hidden="true">
      <path d="M1 1 H24 L33 10 V41 H1 Z" className="cs-glyph-sheet" />
      <path d="M24 1 V10 H33" className="cs-glyph-fold" />
      <line x1="8" y1="18" x2="26" y2="18" className="cs-glyph-rule" />
      <line x1="8" y1="24" x2="26" y2="24" className="cs-glyph-rule" />
      <line x1="8" y1="30" x2="19" y2="30" className="cs-glyph-rule" />
    </svg>
  );
}

export default function CaseStudies() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".cs-reveal");
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
      { threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="cs" ref={mainRef}>
      <div className="cs-stage">
        {/* ── Head ── */}
        <header className="cs-head cs-reveal">
          <div className="cs-protocol-row">
            <span className="cs-protocol">Resources · Reports</span>
            <span className="cs-protocol-line" aria-hidden="true" />
            <span className="cs-stamp">KELWIN/OS · CASE DOSSIERS</span>
          </div>
          <h1 className="cs-title">
            <span className="cs-title-1">The work, in readouts.</span>
            <span className="cs-title-2">Not testimonials — telemetry.</span>
          </h1>
          <p className="cs-lede">
            Every engagement produces a readout: the state we found, what was
            installed, and what the instrumentation showed after — including
            what didn&rsquo;t work. This is where those readouts publish, as
            clients clear them.
          </p>
          {/* Specimen honesty — the format is real; these numbers aren't yet. */}
          <div className="cs-key" aria-label="Index status">
            <span className="cs-key-chip">Specimen format</span>
            <span className="cs-key-label">
              The dossiers below show the exact structure every readout
              follows. Figures are illustrative until clients clear real ones
              for release — we don&rsquo;t publish invented proof.
            </span>
          </div>
        </header>

        {/* ── Case dossiers ── */}
        <section className="cs-cases" aria-label="Case study dossiers">
          {CASES.map((c, i) => (
            <article
              className="cs-dossier cs-reveal"
              key={c.n}
              style={{ ["--i" as string]: i }}
              aria-label={`${c.n} — ${c.client} (specimen)`}
            >
              {/* Dossier head */}
              <div className="cs-dossier-head">
                <div className="cs-dossier-id">
                  <DocGlyph />
                  <span className="cs-num">{c.n}</span>
                </div>
                <div className="cs-dossier-title">
                  <h2 className="cs-client">{c.client}</h2>
                  <div className="cs-profile">
                    {c.profile.map((p) => (
                      <span className="cs-profile-item" key={p.k}>
                        <span className="cs-profile-k">{p.k}</span>
                        <span className="cs-profile-v">{p.v}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="cs-dossier-meta">
                  <span className="cs-specimen-chip">Specimen</span>
                  <span className="cs-window">{c.window}</span>
                </div>
              </div>

              {/* Three phases: found → installed → readout */}
              <div className="cs-phases">
                <div className="cs-phase">
                  <span className="cs-phase-label is-found">Found</span>
                  <ul className="cs-list">
                    {c.found.map((f) => (
                      <li className="cs-item" key={f}>
                        <span className="cs-mark-no" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="cs-phase">
                  <span className="cs-phase-label">Installed</span>
                  <ul className="cs-list">
                    {c.installed.map((s) => (
                      <li className="cs-item" key={s}>
                        <span className="cs-mark-mid" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="cs-phase is-readout">
                  <span className="cs-phase-label is-after">Readout</span>
                  <div className="cs-metrics">
                    {c.readout.map((m) => (
                      <div className="cs-metric" key={m.label}>
                        <span className="cs-metric-value">{m.value}</span>
                        <span className="cs-metric-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cs-dossier-foot">
                <span className="cs-foot-note">
                  Cleared dossiers ship to your company inbox.
                </span>
                <ArrowLink
                  href={`/contact?topic=dossier&ref=${encodeURIComponent(c.n)}`}
                  label="Request the full dossier"
                  tone="sand"
                />
              </div>
            </article>
          ))}
        </section>

        {/* ── Clearance status ── */}
        <div className="cs-terminal cs-reveal" role="status">
          <div className="cs-terminal-line">
            <span className="cs-terminal-prompt" aria-hidden="true">&gt;</span>
            readouts.index — first client releases pending clearance
          </div>
          <div className="cs-terminal-line">
            <span className="cs-terminal-prompt" aria-hidden="true">&gt;</span>
            specimen dossiers are replaced as real readouts publish
          </div>
          <div className="cs-terminal-line">
            <span className="cs-terminal-prompt" aria-hidden="true">&gt;</span>
            <span className="cs-cursor" aria-hidden="true" />
          </div>
        </div>

        {/* ── Research documents (condensed registry) ── */}
        <section className="cs-research cs-reveal" aria-label="Research documents">
          <div className="cs-research-head">
            <span className="cs-research-label">Also from the practice</span>
            <span className="cs-research-line" aria-hidden="true" />
            <span className="cs-research-note">Research documents</span>
          </div>
          <ul className="cs-research-list">
            {RESEARCH.map((r) => (
              <li className="cs-research-row" key={r.n}>
                <span className="cs-num">{r.n}</span>
                <span className="cs-research-title">{r.title}</span>
                <span className="cs-research-status">{r.status}</span>
                <a
                  className="cs-research-req"
                  href={`/contact?topic=research&ref=${encodeURIComponent(r.n)}`}
                >
                  Request →
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Foot / conversion ── */}
        <footer className="cs-foot cs-reveal">
          <p className="cs-coda">
            Your engagement&rsquo;s readout is yours to keep — publishing it is
            always your call.
          </p>
          <div className="cs-foot-actions">
            <DiagnosticMethodCTA
              href="/audit"
              label="Start your own readout"
              variant="signal"
            />
            <ArrowLink href="/contact" label="Talk to the team first" tone="sand" />
          </div>
        </footer>
      </div>
    </main>
  );
}
