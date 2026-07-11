"use client";

import { useEffect, useRef } from "react";
import ConvertPanel from "@/components/ui/ConvertPanel";
import "./LabConsole.css";

// ─── The Lab — R&D arm ────────────────────────────────────────────────────
// Where the practice becomes product: AI-native GTM software trained on
// what the installs teach. Opens on a PageCommand photograph (page level),
// then runs the home section grammar over the Signal Console — a product
// surface mocked entirely in code (sand structure, clay data, patina
// state, one red routing moment) — a build log that shows the work
// actually moving, and the product principles. Labeled Specimen; real
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

// The build log — the page's proof of life. States use the shared accent
// jobs: patina = shipped, red = actively in build, taupe = queued.
const BUILDS = [
  { v: "0.5", title: "Account timelines — the deal, argued in one view", state: "IN BUILD", tone: "red" as const },
  { v: "0.4", title: "Routing queue autonomy — approved actions run unattended", state: "SHIPPED", tone: "patina" as const },
  { v: "0.3", title: "Narrative resonance scoring across live installs", state: "SHIPPED", tone: "patina" as const },
  { v: "0.2", title: "Entropy index — learning retained, as one number", state: "SHIPPED", tone: "patina" as const },
  { v: "0.1", title: "Signal taxonomy drawn from the first installs", state: "SHIPPED", tone: "patina" as const },
];

const ROADMAP = [
  { k: "Now", now: true, items: ["Console hardening", "Entropy calibration against live installs"] },
  { k: "Next", items: ["Narrative telemetry API", "Routing rules your operators can edit"] },
  { k: "Later", items: ["Standalone deployment — the console without the consulting"] },
];

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
        {/* ── 01 · The console — product surface, in code ── */}
        <section className="lab-section lab-reveal" aria-label="Product surface preview (specimen)">
          <div className="lab-eyebrow-row">
            <span className="lab-eyebrow">The console</span>
            <span className="lab-eyebrow-dash" aria-hidden="true" />
            <span className="lab-eyebrow-meta">LAB/01 · WHAT THE SOFTWARE SEES</span>
          </div>
          <div className="lab-shell">
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
          </div>
        </section>

        {/* ── 02 · Build log + roadmap — proof the work is moving ── */}
        <section className="lab-section lab-reveal" aria-label="Build log and roadmap">
          <div className="lab-eyebrow-row">
            <span className="lab-eyebrow">Build log</span>
            <span className="lab-eyebrow-dash" aria-hidden="true" />
            <span className="lab-eyebrow-meta">LAB/02 · SHIPPED IS THE ONLY STATUS THAT COUNTS</span>
          </div>
          <div className="lab-worklog">
            <div className="lab-log">
              <div className="lab-log-bar">
                <span className="lab-log-id">BUILD.LOG</span>
                <span className="lab-log-line" aria-hidden="true" />
                <span className="lab-log-stamp">NEWEST FIRST</span>
              </div>
              {BUILDS.map((b) => (
                <div className="lab-log-row" key={b.v}>
                  <span className="lab-log-v">{b.v}</span>
                  <span className="lab-log-title">{b.title}</span>
                  <span className={`lab-log-state is-${b.tone}`}>
                    <span className="lab-log-mark" aria-hidden="true" />
                    {b.state}
                  </span>
                </div>
              ))}
            </div>
            <div className="lab-road" aria-label="Roadmap">
              {ROADMAP.map((r) => (
                <div className={`lab-road-group${r.now ? " is-now" : ""}`} key={r.k}>
                  <span className="lab-road-k">{r.k}</span>
                  {r.items.map((it) => (
                    <span className="lab-road-item" key={it}>{it}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 03 · Principles ── */}
        <section className="lab-section lab-reveal" aria-label="Product principles">
          <div className="lab-eyebrow-row">
            <span className="lab-eyebrow">Product principles</span>
            <span className="lab-eyebrow-dash" aria-hidden="true" />
            <span className="lab-eyebrow-meta">LAB/03 · THREE, NON-NEGOTIABLE</span>
          </div>
          <div className="lab-principles">
            {PRINCIPLES.map((p) => (
              <div className="lab-principle" key={p.n}>
                <span className="lab-principle-num">{p.n}</span>
                <span className="lab-principle-title">{p.title}</span>
                <span className="lab-principle-desc">{p.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Close — the decision ── */}
        <div className="lab-section lab-reveal">
          <ConvertPanel
            title="The Lab is tomorrow. The audit is Tuesday."
            sub="Waitlist members see build previews first and shape what ships. And if pipeline is this quarter's problem, start with the audit — everything the Lab learns comes from those installs."
            chips={["Install-trained", "Previews ship to waitlist first", "Your data stays yours"]}
            primary={{ href: "/contact?topic=lab&ref=Lab%20waitlist", label: "Join the waitlist" }}
            secondary={{ href: "/audit", label: "Or start with the audit" }}
          />
        </div>
      </div>
    </main>
  );
}
