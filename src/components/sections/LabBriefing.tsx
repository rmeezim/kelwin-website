"use client";

import { useEffect, useRef } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import "./LabBriefing.css";

// ─── The Lab — a classified briefing, not a coming-soon page ──────────────
// Four movements: the manifesto (why GTM software is mathematically
// broken), the specimens (instrument captures treated as telemetry —
// identities redacted, one module sealed), the deployment protocols
// (a calculated rollout, no dates), and the Early Access Protocol (an
// application, not a subscribe form). Honesty system: nothing real is
// faked — what isn't public is redacted or sealed, and says so.

const THESES = [
  {
    n: "T·01",
    title: "The CRM records history. It doesn't produce revenue.",
    body: "Every incumbent GTM system is a system of record — evidence about the past, entered by hand, decaying on arrival. A more precise archive of your losses is not a growth strategy.",
  },
  {
    n: "T·02",
    title: "More activity is mathematically dead.",
    body: "Reply rates fall as volume rises, and every added sequence taxes the same finite pool of buyer attention. When the marginal email costs more in deliverability than it returns in pipeline, scaling activity is a losing equation. The only variable left with leverage is signal quality — who, when, and with what words.",
  },
  {
    n: "T·03",
    title: "Point solutions fragment the one thing that must compound.",
    body: "Data vendor, sequencer, enrichment, dialer, notes — six tools, zero shared memory. Whatever your motion learns is scattered across systems that don't talk to each other, so it rounds to zero every quarter. That is an architecture problem, and no feature release fixes architecture.",
  },
  {
    n: "T·04",
    title: "“AI-native” means trained on your revenue — or it's autocomplete.",
    body: "Generic models write the same sentences for you as for your competitors. The compounding asset is a system trained on what actually preceded your revenue: your objections, your winning language, your buyers' timing. That can't be bought off a shelf. It has to be installed, instrumented, and fed.",
  },
];

// Specimen data — synthetic accounts, identities redacted in render.
const SIGNALS = [
  { acct: "Meridian Data",  kind: "HIRING SURGE",  detail: "12 GTM roles opened · 30d",   strength: 0.86, hot: true },
  { acct: "Northcell Sys",  kind: "TECH CHANGE",   detail: "CRM migration detected",      strength: 0.71 },
  { acct: "Argon Systems",  kind: "FUNDING",       detail: "Series B · $40M announced",   strength: 0.64 },
  { acct: "Helioscope Co",  kind: "INTENT",        detail: "Category research cluster",   strength: 0.52 },
  { acct: "Vantor Labs",    kind: "CHAMPION MOVE", detail: "VP RevOps joined from client", strength: 0.47 },
];

const QUEUE = [
  { t: "09:41", action: "Route account → narrative track B", state: "QUEUED" },
  { t: "09:38", action: "Retune objection copy · security",  state: "SHIPPED" },
  { t: "09:31", action: "Suppress list decay segment",       state: "SHIPPED" },
];

const SPARK = "M0 34 L14 32 L28 33 L42 29 L56 30 L70 26 L84 27 L98 22 L112 24 L126 19 L140 20 L154 15 L168 16 L182 12 L196 9";

// Sealed specimen — deliberately unreadable until partner preview.
const SEALED_LINES = [
  '{ "resonance": 0.61, "segment": "committee", "drift": -0.08 }',
  '{ "objection": "security", "answer_v": 4, "hold": true }',
  '{ "window": "17d", "champion": "warm", "route": "track-B" }',
  '{ "entropy": 22.9, "trend": "down", "kept": ["language"] }',
];

const PROTOCOLS = [
  {
    n: "P/01",
    name: "Instrument",
    state: "ACTIVE",
    tone: "patina" as const,
    desc: "Detection and measurement against live installs — the console reads the market and scores what it sees.",
    items: [
      { v: "0.5", t: "Account timelines — the deal, argued in one view", live: true },
      { v: "0.4", t: "Routing queue autonomy" },
      { v: "0.3", t: "Narrative resonance scoring" },
      { v: "0.2", t: "Entropy index" },
      { v: "0.1", t: "Signal taxonomy from the first installs" },
    ],
  },
  {
    n: "P/02",
    name: "Interface",
    state: "STAGED",
    tone: "sand" as const,
    desc: "The operator's controls: a narrative telemetry API, and routing rules your team edits without us in the room.",
  },
  {
    n: "P/03",
    name: "Autonomy",
    state: "STAGED",
    tone: "sand" as const,
    desc: "Approved actions execute unattended — the queue clears itself, reviewed by exception instead of by meeting.",
  },
  {
    n: "P/04",
    name: "Standalone",
    state: "SEALED",
    tone: "red" as const,
    desc: "The console without the consulting. Unsealed when the instruments have proven themselves across cohort one — not before.",
  },
];

const EAP_ASKS = [
  "A sales-carried B2B motion with live pipeline to instrument",
  "Read access to the signals we measure — anonymized, exportable, yours",
  "One named operator in a working session, twice a month",
  "Tolerance for rough edges — this is a build, not a product",
];

const EAP_RETURNS = [
  "Live captures before anyone outside the pods sees them",
  "A hand on what ships — partner requests outrank our roadmap",
  "Founding terms when the console stands alone",
  "A direct line to the people building it, not a support queue",
];

export default function LabBriefing() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".lb-reveal");
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
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="lb" ref={mainRef}>
      <div className="lb-stage">
        {/* ── 01 · The manifesto ── */}
        <section className="lb-section lb-reveal" aria-label="The thesis">
          <div className="lb-eyebrow-row">
            <span className="lb-eyebrow">The thesis</span>
            <span className="lb-eyebrow-dash" aria-hidden="true" />
            <span className="lb-eyebrow-meta">K-LAB/BRIEF · 01 · POSITION</span>
          </div>
          <div className="lb-brief">
            <div className="lb-brief-bar">
              <span className="lb-brief-class">
                <span className="lb-brief-chip">CONTROLLED</span>
                CIRCULATION · EARLY ACCESS LIST
              </span>
              <span className="lb-brief-line" aria-hidden="true" />
              <span className="lb-brief-stamp">READ AS A MEMO, NOT A LAUNCH PAGE</span>
            </div>
            <p className="lb-brief-open">
              GTM software didn&rsquo;t fail because it lacked features.{" "}
              <span>It failed because it&rsquo;s a filing cabinet wearing a
              dashboard.</span>
            </p>
            <ol className="lb-theses">
              {THESES.map((t, i) => (
                <li
                  className="lb-thesis lb-reveal"
                  style={{ ["--i" as string]: i }}
                  key={t.n}
                >
                  <span className="lb-thesis-n">{t.n}</span>
                  <span className="lb-thesis-body">
                    <span className="lb-thesis-title">{t.title}</span>
                    <span className="lb-thesis-desc">{t.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="lb-brief-close">
              <span className="lb-brief-close-dash" aria-hidden="true" />
              The conclusion is architectural: one system that detects,
              decides, writes, and remembers — trained on the installs,
              owned with the operator. That is what The Lab is building.
            </p>
          </div>
        </section>

        {/* ── 02 · The specimens ── */}
        <section className="lb-section lb-reveal" aria-label="Instrument specimens">
          <div className="lb-eyebrow-row">
            <span className="lb-eyebrow">The instruments</span>
            <span className="lb-eyebrow-dash" aria-hidden="true" />
            <span className="lb-eyebrow-meta">K-LAB/BRIEF · 02 · TELEMETRY CAPTURES</span>
          </div>

          <div className="lb-specimens">
            {/* S·01 — Signal Processing Engine */}
            <article className="lb-spec lb-spec-s1 lb-reveal" style={{ ["--i" as string]: 0 }}>
              <div className="lb-spec-bar">
                <span className="lb-spec-id">S·01</span>
                <span className="lb-spec-name">SIGNAL PROCESSING ENGINE</span>
                <span className="lb-spec-v">V0.4</span>
                <span className="lb-spec-line" aria-hidden="true" />
                <span className="lb-spec-chip is-red">IDENTITIES REDACTED</span>
              </div>
              <ul className="lb-feed">
                {SIGNALS.map((s) => (
                  <li className={`lb-sig${s.hot ? " is-hot" : ""}`} key={s.acct}>
                    <span className="lb-redact" aria-label="Account name redacted">
                      {s.acct}
                    </span>
                    <span className={`lb-sig-kind${s.hot ? " is-hot" : ""}`}>{s.kind}</span>
                    <span className="lb-sig-detail">{s.detail}</span>
                    <span className="lb-sig-meter" aria-hidden="true">
                      <span
                        className="lb-sig-fill"
                        style={{ ["--w" as string]: `${s.strength * 100}%` }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="lb-spec-foot">
                Capture from the working build against synthetic accounts —
                the format is real, the names never were.
              </p>
            </article>

            {/* S·02 — Narrative Entropy Tracker */}
            <article className="lb-spec lb-reveal" style={{ ["--i" as string]: 1 }}>
              <div className="lb-spec-bar">
                <span className="lb-spec-id">S·02</span>
                <span className="lb-spec-name">NARRATIVE ENTROPY TRACKER</span>
                <span className="lb-spec-v">V0.3</span>
                <span className="lb-spec-line" aria-hidden="true" />
                <span className="lb-spec-chip">LIVE CAPTURE</span>
              </div>
              <div className="lb-gauge">
                <span className="lb-gauge-value">23.4</span>
                <span className="lb-gauge-delta">▼ 4.2 this quarter</span>
              </div>
              <div className="lb-gauge-track" aria-hidden="true">
                <span className="lb-gauge-fill" />
                <span className="lb-gauge-mark" />
              </div>
              <svg className="lb-spark" viewBox="0 0 196 40" aria-hidden="true">
                <path className="lb-spark-line" pathLength={1} d={SPARK} />
                <circle className="lb-spark-tip" cx="196" cy="9" r="2.8" />
              </svg>
              <div className="lb-spark-foot">
                <span>Message v4.1 resonance</span>
                <span className="lb-spark-up">+31% reply quality</span>
              </div>
            </article>

            {/* S·04 — sealed */}
            <article className="lb-spec lb-spec-sealed lb-reveal" style={{ ["--i" as string]: 2 }}>
              <div className="lb-spec-bar">
                <span className="lb-spec-id">S·04</span>
                <span className="lb-spec-name">NARRATIVE TELEMETRY API</span>
                <span className="lb-spec-v">V0.1</span>
                <span className="lb-spec-line" aria-hidden="true" />
                <span className="lb-spec-chip is-red">SEALED</span>
              </div>
              <div className="lb-sealed-body" aria-hidden="true">
                {SEALED_LINES.map((l) => (
                  <span className="lb-sealed-line" key={l}>{l}</span>
                ))}
                <span className="lb-sealed-overlay">
                  <span className="lb-sealed-mark" aria-hidden="true" />
                  PARTNER PREVIEW ONLY
                </span>
              </div>
              <p className="lb-spec-foot">
                Unsealed for cohort one. Everyone else waits for P/02.
              </p>
            </article>

            {/* S·03 — Autonomous Routing Queue */}
            <article className="lb-spec lb-spec-s3 lb-reveal" style={{ ["--i" as string]: 3 }}>
              <div className="lb-spec-bar">
                <span className="lb-spec-id">S·03</span>
                <span className="lb-spec-name">AUTONOMOUS ROUTING QUEUE</span>
                <span className="lb-spec-v">V0.5</span>
                <span className="lb-spec-line" aria-hidden="true" />
                <span className="lb-spec-chip">REVIEWED BY EXCEPTION</span>
              </div>
              <ul className="lb-queue">
                {QUEUE.map((q) => (
                  <li className="lb-queue-row" key={q.t}>
                    <span className="lb-queue-t">{q.t}</span>
                    <span className="lb-queue-action">{q.action}</span>
                    <span className={`lb-queue-state${q.state === "SHIPPED" ? " is-done" : ""}`}>
                      {q.state}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="lb-queue-cursor" aria-hidden="true">
                <span className="lb-prompt">&gt;</span>
                <span className="lb-cursor" />
              </div>
            </article>
          </div>
          <p className="lb-specimens-note">
            Specimens are captures of the working build. Nothing here is a
            mockup — and nothing here is a promise. What partners see runs
            against their own pipeline.
          </p>
        </section>

        {/* ── 03 · Deployment protocols ── */}
        <section className="lb-section lb-reveal" aria-label="Deployment protocols">
          <div className="lb-eyebrow-row">
            <span className="lb-eyebrow">Deployment protocols</span>
            <span className="lb-eyebrow-dash" aria-hidden="true" />
            <span className="lb-eyebrow-meta">K-LAB/BRIEF · 03 · NO DATES, ON PURPOSE</span>
          </div>
          <div className="lb-protocols">
            {PROTOCOLS.map((p, i) => (
              <div
                className={`lb-protocol lb-reveal is-${p.tone}`}
                style={{ ["--i" as string]: i }}
                key={p.n}
              >
                <span className="lb-protocol-spine" aria-hidden="true">
                  <span className="lb-protocol-node" />
                </span>
                <div className="lb-protocol-head">
                  <span className="lb-protocol-n">{p.n}</span>
                  <span className="lb-protocol-name">{p.name}</span>
                  <span className="lb-protocol-state">{p.state}</span>
                </div>
                <div className="lb-protocol-body">
                  <p className="lb-protocol-desc">{p.desc}</p>
                  {p.items && (
                    <ul className="lb-protocol-items">
                      {p.items.map((it) => (
                        <li className={`lb-protocol-item${it.live ? " is-live" : ""}`} key={it.v}>
                          <span className="lb-protocol-item-v">{it.v}</span>
                          {it.t}
                          <span className="lb-protocol-item-mark" aria-hidden="true" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 04 · Early Access Protocol — the application ── */}
        <section className="lb-section lb-reveal" aria-label="Early access protocol">
          <div className="lb-eyebrow-row">
            <span className="lb-eyebrow">Early access</span>
            <span className="lb-eyebrow-dash" aria-hidden="true" />
            <span className="lb-eyebrow-meta">K-LAB/BRIEF · 04 · APPLICATION, NOT A SUBSCRIBE FORM</span>
          </div>
          <div className="lb-eap">
            <div className="lb-eap-bar">
              <span className="lb-spec-id">EAP-1</span>
              <span className="lb-spec-name">EARLY ACCESS PROTOCOL</span>
              <span className="lb-spec-line" aria-hidden="true" />
              <span className="lb-spec-chip">COHORT ONE · CAPPED SMALL, ON PURPOSE</span>
            </div>
            <div className="lb-eap-grid">
              <div className="lb-eap-col">
                <span className="lb-eap-k">What it asks of you</span>
                <ul className="lb-eap-list">
                  {EAP_ASKS.map((a) => (
                    <li className="lb-eap-item" key={a}>
                      <span className="lb-eap-tick" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lb-eap-divider" aria-hidden="true" />
              <div className="lb-eap-col">
                <span className="lb-eap-k is-return">What it returns</span>
                <ul className="lb-eap-list">
                  {EAP_RETURNS.map((r) => (
                    <li className="lb-eap-item" key={r}>
                      <span className="lb-eap-tick is-patina" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lb-eap-foot">
              <div className="lb-eap-actions">
                <DiagnosticMethodCTA
                  href="/contact?topic=lab&ref=Early%20Access%20Protocol"
                  label="Apply for early access"
                  variant="signal"
                />
                <ArrowLink
                  href="/audit"
                  label="Fastest way in: start with the audit"
                  tone="sand"
                />
              </div>
              <p className="lb-eap-note">
                Install clients enter the cohort first — the system is trained
                on what installs teach. Applications go straight to the
                builders; if the fit isn&rsquo;t there yet, we say so and hold
                your name for cohort two.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
