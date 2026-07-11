"use client";

import { useEffect, useRef } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import "./LabConsole.css";

// ─── The Lab — R&D arm ────────────────────────────────────────────────────
// Where the practice becomes product: AI-native GTM software trained on
// what the installs teach. The centerpiece is a product-surface mock built
// entirely in code — the same instrument idiom as the site (mono labels,
// sand structure, clay data, patina state, one red routing moment) so the
// "software" and the "site" read as one system. Labeled Specimen; real
// build previews ship to the waitlist.

const SIGNALS = [
  { acct: "Meridian Data",   kind: "HIRING SURGE",   detail: "12 GTM roles opened · 30d", strength: 0.86, hot: true },
  { acct: "Northcell",       kind: "TECH CHANGE",    detail: "CRM migration detected",     strength: 0.71 },
  { acct: "Argon Systems",   kind: "FUNDING",        detail: "Series B · $40M announced",  strength: 0.64 },
  { acct: "Helioscope",      kind: "INTENT",         detail: "Category research cluster",  strength: 0.52 },
  { acct: "Vantor Labs",     kind: "CHAMPION MOVE",  detail: "VP RevOps joined from client", strength: 0.47 },
];

const QUEUE = [
  { t: "09:41", action: "Route Meridian → narrative track B", state: "QUEUED" },
  { t: "09:38", action: "Retune objection copy · security",   state: "SHIPPED" },
  { t: "09:31", action: "Suppress list decay segment",        state: "SHIPPED" },
];

const SPARK = "M0 34 L14 32 L28 33 L42 29 L56 30 L70 26 L84 27 L98 22 L112 24 L126 19 L140 20 L154 15 L168 16 L182 12 L196 9";

const PRINCIPLES = [
  {
    n: "P·01",
    title: "Trained on installs, not scraped noise",
    desc: "The models learn from instrumented engagements — what actually preceded revenue — not from generic firmographic sludge.",
  },
  {
    n: "P·02",
    title: "Signal to action in one surface",
    desc: "Detection, routing, and the narrative to send — one console. No swivel-chair between six tools that don't talk.",
  },
  {
    n: "P·03",
    title: "Your data stays your asset",
    desc: "Same rule as the consulting: everything the system learns about your market belongs to you, documented and exportable.",
  },
];

export default function LabConsole() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".lab-reveal");
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
    <main className="lab" ref={mainRef}>
      <div className="lab-stage">
        {/* ── Head ── */}
        <header className="lab-head lab-reveal">
          <div className="lab-protocol-row">
            <span className="lab-protocol">The Lab · R&amp;D</span>
            <span className="lab-protocol-line" aria-hidden="true" />
            <span className="lab-stamp">KELWIN/OS · BUILD 0.4</span>
          </div>
          <h1 className="lab-title">
            <span className="lab-title-1">Where the practice</span>
            <span className="lab-title-2">becomes product.</span>
          </h1>
          <p className="lab-lede">
            The Lab is Kelwin&rsquo;s R&amp;D arm: everything our installs
            teach us — signal patterns, narrative telemetry, routing logic —
            is being built into AI-native GTM software. The consulting keeps
            it honest; the product makes it permanent.
          </p>
          <div className="lab-chips" aria-label="Program status">
            <span className="lab-chip is-live">
              <span className="lab-chip-dot" aria-hidden="true" />
              In development
            </span>
            <span className="lab-chip">AI-native</span>
            <span className="lab-chip">Install-trained</span>
          </div>
        </header>

        {/* ── The console — product surface, in code ── */}
        <section
          className="lab-shell lab-reveal"
          aria-label="Product surface preview (specimen)"
        >
          {/* window chrome */}
          <div className="lab-bar">
            <span className="lab-bar-id">
              <span className="lab-bar-glyph" aria-hidden="true" />
              KELWIN/OS · SIGNAL CONSOLE
            </span>
            <span className="lab-bar-line" aria-hidden="true" />
            <span className="lab-bar-spec">Specimen · previews ship to the waitlist</span>
            <span className="lab-bar-live">
              <span className="lab-live-dot" aria-hidden="true" />
              LIVE
            </span>
          </div>

          <div className="lab-grid">
            {/* Signal feed */}
            <div className="lab-mod lab-mod-feed">
              <div className="lab-mod-head">
                <span className="lab-mod-title">Signal feed</span>
                <span className="lab-mod-meta">Last 24h · 5 of 38</span>
              </div>
              <ul className="lab-feed">
                {SIGNALS.map((s) => (
                  <li className={`lab-sig${s.hot ? " is-hot" : ""}`} key={s.acct}>
                    <span className="lab-sig-acct">{s.acct}</span>
                    <span className={`lab-sig-kind${s.hot ? " is-hot" : ""}`}>{s.kind}</span>
                    <span className="lab-sig-detail">{s.detail}</span>
                    <span className="lab-sig-meter" aria-hidden="true">
                      <span
                        className="lab-sig-fill"
                        style={{ ["--w" as string]: `${s.strength * 100}%` }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entropy gauge */}
            <div className="lab-mod lab-mod-gauge">
              <div className="lab-mod-head">
                <span className="lab-mod-title">Revenue entropy</span>
                <span className="lab-mod-meta">Target &lt; 30</span>
              </div>
              <div className="lab-gauge">
                <span className="lab-gauge-value">23.4</span>
                <span className="lab-gauge-delta">▼ 4.2 this quarter</span>
              </div>
              <div className="lab-gauge-track" aria-hidden="true">
                <span className="lab-gauge-fill" />
                <span className="lab-gauge-mark" />
              </div>
              <p className="lab-gauge-note">
                Learning retained across cycles — the number the whole system
                exists to push down.
              </p>
            </div>

            {/* Narrative resonance sparkline */}
            <div className="lab-mod lab-mod-spark">
              <div className="lab-mod-head">
                <span className="lab-mod-title">Narrative resonance</span>
                <span className="lab-mod-meta">12 weeks</span>
              </div>
              <svg className="lab-spark" viewBox="0 0 196 40" aria-hidden="true">
                <path className="lab-spark-line" pathLength={1} d={SPARK} />
                <circle className="lab-spark-tip" cx="196" cy="9" r="2.8" />
              </svg>
              <div className="lab-spark-foot">
                <span>Message v4.1</span>
                <span className="lab-spark-up">+31% reply quality</span>
              </div>
            </div>

            {/* Routing queue */}
            <div className="lab-mod lab-mod-queue">
              <div className="lab-mod-head">
                <span className="lab-mod-title">Routing queue</span>
                <span className="lab-mod-meta">Autonomous · reviewed</span>
              </div>
              <ul className="lab-queue">
                {QUEUE.map((q) => (
                  <li className="lab-queue-row" key={q.t}>
                    <span className="lab-queue-t">{q.t}</span>
                    <span className="lab-queue-action">{q.action}</span>
                    <span
                      className={`lab-queue-state${q.state === "SHIPPED" ? " is-done" : ""}`}
                    >
                      {q.state}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="lab-queue-cursor" aria-hidden="true">
                <span className="lab-prompt">&gt;</span>
                <span className="lab-cursor" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Principles ── */}
        <section className="lab-principles lab-reveal" aria-label="Product principles">
          {PRINCIPLES.map((p) => (
            <div className="lab-principle" key={p.n}>
              <span className="lab-principle-num">{p.n}</span>
              <span className="lab-principle-title">{p.title}</span>
              <span className="lab-principle-desc">{p.desc}</span>
            </div>
          ))}
        </section>

        {/* ── Waitlist ── */}
        <footer className="lab-foot lab-reveal">
          <p className="lab-close-line">
            The Lab is tomorrow. <span>The audit is Tuesday.</span>
          </p>
          <div className="lab-foot-actions">
            <DiagnosticMethodCTA
              href="/contact?topic=lab&ref=Lab%20waitlist"
              label="Join the waitlist"
              variant="signal"
            />
            <ArrowLink href="/audit" label="Or start with the audit" tone="sand" />
          </div>
          <p className="lab-foot-note">
            Waitlist members see build previews first and shape what ships.
          </p>
        </footer>
      </div>
    </main>
  );
}
