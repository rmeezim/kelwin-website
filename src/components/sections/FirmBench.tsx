"use client";

import { useEffect, useRef, useState } from "react";
import DotMatrixReading from "@/components/ui/DotMatrixReading";
import ArrowLink from "@/components/ui/ArrowLink";
import "./FirmPages.css";

// ─── Careers — system operators ───────────────────────────────────────────
// Joining an engineering pod, not a marketing team: the live console
// (dot-matrix zero), the deal, the pod architecture diagram (with the
// account-management layer struck out — NOT PRESENT), the operator
// capability radar (zeros where the industry has peaks), the Tuesday
// deployment log with expandable raw telemetry, the behavior protocol
// cards, and a bench-clearance request instead of a job-application form.

const DEAL = [
  { k: "Pods", v: "2–3 seniors, end to end" },
  { k: "Juniors", v: "None — nobody learns on a client's budget" },
  { k: "Writing", v: "The job. Documents before meetings" },
  { k: "Comp", v: "Published with every role, no ranges withheld" },
  { k: "Shape", v: "Remote-first, small on purpose", patina: true },
];

const DAY = [
  {
    time: "09:30",
    title: "Interview the client's best rep",
    desc: "Record the language that closes — the raw material.",
    raw: "capture: \"when the champion says 'security review' they mean 'budget review'\" — flagged for objection copy v4",
  },
  {
    time: "13:00",
    title: "Rewrite the message system",
    desc: "The morning's words, structured into the narrative OS.",
    raw: "message v4.1 draft — swapped 'platform' for the client's own word: 'ledger'. Committee variant queued.",
  },
  {
    time: "16:00",
    title: "Read the telemetry",
    desc: "Deliverability, replies, objections — did the market hear it?",
    raw: "segment B reply quality +31% · deliverability flat · segment C copy underperforms — killing it Thursday",
  },
  {
    time: "17:30",
    title: "Note ships to the client doc",
    desc: "What moved today, in writing. Then stop.",
    raw: "shipped 17:26 — two decisions recorded, one open question held for the working session",
    tone: "patina" as const,
  },
];

const BEHAVIORS = [
  {
    n: "H·01",
    title: "You own systems, not tasks.",
    desc: "Everyone on a pod is accountable to the thing the engagement leaves behind — not to hours logged against it.",
  },
  {
    n: "H·02",
    title: "Writing is the job.",
    desc: "If it isn't written down in the client's language, it didn't happen. The best people here are the best writers here.",
  },
  {
    n: "H·03",
    title: "Diagnose out loud.",
    desc: "We show clients our reasoning, including the uncertain parts. The same rule applies inside the firm.",
  },
  {
    n: "H·04",
    title: "No theater.",
    desc: "No status meetings that could be a readout, no decks that could be a page, no busyness worn as a badge.",
  },
];

// Capability radar — axes at 90/30/330/270/210/150 degrees, R=120,
// centered (170,170). Zeros are the point: bureaucracy tolerance and
// political theater collapse to the center.
const RADAR_RINGS = [
  "170,50 273.9,110 273.9,230 170,290 66.1,230 66.1,110",
  "170,90 239.3,130 239.3,210 170,250 100.7,210 100.7,130",
  "170,130 204.6,150 204.6,190 170,210 135.4,190 135.4,150",
];
const RADAR_SHAPE = "170,56 263.5,116 268.7,227 170,272 164.8,173 170,170";
const RADAR_AXES: { x: number; y: number; label: string; v: string; zero?: boolean; anchor: "start" | "middle" | "end" }[] = [
  { x: 170, y: 38, label: "SYSTEMS THINKING", v: "0.95", anchor: "middle" },
  { x: 284, y: 105, label: "AUTONOMY", v: "0.90", anchor: "start" },
  { x: 284, y: 240, label: "WRITING", v: "0.95", anchor: "start" },
  { x: 170, y: 306, label: "DIAGNOSIS, OUT LOUD", v: "0.85", anchor: "middle" },
  { x: 56, y: 240, label: "BUREAUCRACY", v: "0.05", zero: true, anchor: "end" },
  { x: 56, y: 105, label: "POLITICAL THEATER", v: "0.00", zero: true, anchor: "end" },
];

export default function FirmBench() {
  const mainRef = useRef<HTMLElement>(null);
  const [openLog, setOpenLog] = useState<number | null>(null);
  const [opName, setOpName] = useState("");
  const [opPost, setOpPost] = useState("");
  const [opLink, setOpLink] = useState("");
  const [opParams, setOpParams] = useState("");

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".fp3-reveal");
    const arm = (el: HTMLElement) => {
      el.classList.add("is-in");
      el.querySelectorAll(".dm-armed").forEach((d) => d.classList.add("dm-live"));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach(arm);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            arm(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function submitClearance(e: React.FormEvent) {
    e.preventDefault();
    const body = [
      opParams,
      "",
      "—",
      `Operator: ${opName}`,
      `Current post: ${opPost}`,
      `Work: ${opLink}`,
    ].join("\n");
    window.location.href = `mailto:audit@kelwin.co?subject=${encodeURIComponent(
      `Bench review — ${opName}`
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="fp3" ref={mainRef}>
      <div className="fp3-stage">
        {/* ── 01 · The console + the deal ── */}
        <section className="fp3-section fp3-reveal" aria-label="Open seats and the deal">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Open seats</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/01 · LISTED HERE FIRST</span>
          </div>
          <div className="fp3-bench-grid">
            <div className="fp3-console dm-armed">
              <div className="fp3-spec-bar">
                <span className="fp3-spec-id">CAREERS.INDEX</span>
                <span className="fp3-spec-line" aria-hidden="true" />
                <span className="fp3-console-live">
                  <span className="fp3-console-dot" aria-hidden="true" />
                  LIVE
                </span>
              </div>
              <div className="fp3-console-reading">
                <DotMatrixReading value="0" cell={11} label="Zero open seats" />
                <span className="fp3-console-reading-k">
                  Open seats right now — and we won&rsquo;t pretend otherwise
                </span>
              </div>
              <div className="fp3-terminal is-bare">
                <div className="fp3-terminal-line">
                  <span className="fp3-terminal-prompt" aria-hidden="true">&gt;</span>
                  next seats: strategy · systems engineering · narrative
                </div>
                <div className="fp3-terminal-line">
                  <span className="fp3-terminal-prompt" aria-hidden="true">&gt;</span>
                  bench list: OPEN — read first when a seat opens
                  <span className="fp3-terminal-cursor" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="fp3-spec">
              <div className="fp3-spec-bar">
                <span className="fp3-spec-id">THE DEAL</span>
                <span className="fp3-spec-line" aria-hidden="true" />
                <span className="fp3-spec-stamp">NON-NEGOTIABLE</span>
              </div>
              <dl className="fp3-spec-rows">
                {DEAL.map((r) => (
                  <div className="fp3-spec-row" key={r.k}>
                    <dt className="fp3-spec-k">{r.k}</dt>
                    <dd className="fp3-spec-v">
                      {r.patina && <span className="fp3-mark-yes" aria-hidden="true" />}
                      {r.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── 02 · Pod architecture ── */}
        <section className="fp3-section fp3-reveal" aria-label="Pod architecture">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Pod architecture</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/02 · NO LAYERS TO HIDE IN</span>
          </div>
          <div className="fp3-pod">
            <svg className="fp3-pod-svg" viewBox="0 0 560 300" aria-hidden="true">
              {/* information flows */}
              <line className="fp3-pod-edge" x1="140" y1="96" x2="140" y2="204" />
              <line className="fp3-pod-edge" x1="196" y1="76" x2="384" y2="140" />
              <line className="fp3-pod-edge" x1="196" y1="224" x2="384" y2="160" />
              {/* nodes */}
              <g className="fp3-pod-node">
                <rect x="56" y="52" width="168" height="48" />
                <text className="fp3-pod-name" x="140" y="72" textAnchor="middle">NARRATIVE ARCHITECT</text>
                <text className="fp3-pod-sub" x="140" y="88" textAnchor="middle">language · category · story</text>
              </g>
              <g className="fp3-pod-node">
                <rect x="56" y="200" width="168" height="48" />
                <text className="fp3-pod-name" x="140" y="220" textAnchor="middle">SYSTEMS ENGINEER</text>
                <text className="fp3-pod-sub" x="140" y="236" textAnchor="middle">signal · routing · telemetry</text>
              </g>
              <g className="fp3-pod-node is-client">
                <rect x="384" y="124" width="128" height="52" />
                <text className="fp3-pod-name" x="448" y="146" textAnchor="middle">CLIENT</text>
                <text className="fp3-pod-sub" x="448" y="162" textAnchor="middle">owns the system</text>
              </g>
              {/* edge labels */}
              <text className="fp3-pod-flow" x="128" y="155" textAnchor="end">shared memory</text>
              <text className="fp3-pod-flow" x="286" y="94" textAnchor="middle">language system →</text>
              <text className="fp3-pod-flow" x="286" y="212" textAnchor="middle">telemetry + readouts →</text>
              {/* the absent layer */}
              <g className="fp3-pod-absent">
                <rect x="236" y="126" width="120" height="48" />
                <text className="fp3-pod-absent-name" x="296" y="146" textAnchor="middle">ACCOUNT LAYER</text>
                <text className="fp3-pod-absent-tag" x="296" y="162" textAnchor="middle">NOT PRESENT</text>
                <line x1="242" y1="132" x2="350" y2="168" />
                <line x1="350" y1="132" x2="242" y2="168" />
              </g>
            </svg>
            <p className="fp3-pod-cap">
              Two or three seniors and the client — nothing in between. The
              people who diagnose the system build it, and the people you
              meet answer your email. The struck box is the org chart we
              refuse to have.
            </p>
          </div>
        </section>

        {/* ── 03 · The operator profile — capability radar ── */}
        <section className="fp3-section fp3-reveal" aria-label="Operator capability radar">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The operator profile</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/03 · NOTE THE ZEROS</span>
          </div>
          <div className="fp3-radar-wrap">
            <svg className="fp3-radar" viewBox="0 0 340 340" aria-hidden="true">
              {RADAR_RINGS.map((r) => (
                <polygon className="fp3-radar-ring" points={r} key={r} />
              ))}
              <line className="fp3-radar-axis" x1="170" y1="170" x2="170" y2="50" />
              <line className="fp3-radar-axis" x1="170" y1="170" x2="273.9" y2="110" />
              <line className="fp3-radar-axis" x1="170" y1="170" x2="273.9" y2="230" />
              <line className="fp3-radar-axis" x1="170" y1="170" x2="170" y2="290" />
              <line className="fp3-radar-axis" x1="170" y1="170" x2="66.1" y2="230" />
              <line className="fp3-radar-axis" x1="170" y1="170" x2="66.1" y2="110" />
              <polygon className="fp3-radar-shape" points={RADAR_SHAPE} />
              {RADAR_AXES.map((a) => (
                <text
                  className={`fp3-radar-label${a.zero ? " is-zero" : ""}`}
                  x={a.x}
                  y={a.y}
                  textAnchor={a.anchor}
                  key={a.label}
                >
                  {a.label} · {a.v}
                </text>
              ))}
            </svg>
            <div className="fp3-radar-side">
              <p className="fp3-radar-read">
                The profile is the org chart: spikes where the work is,
                zeros where the industry keeps its theater. If the two
                flat axes offend you, the bench isn&rsquo;t for you — and
                if they read like relief, it is.
              </p>
              <div className="fp3-radar-keys">
                <span className="fp3-radar-key">
                  <span className="fp3-mark-yes" aria-hidden="true" />
                  You write to think, want the whole problem, like being
                  findable.
                </span>
                <span className="fp3-radar-key">
                  <span className="fp3-mark-no" aria-hidden="true" />
                  You manage work instead of doing it, present instead of
                  writing, count activity as achievement.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 · Deployment log — expandable raw telemetry ── */}
        <section className="fp3-section fp3-reveal" aria-label="A pod Tuesday">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The deployment log</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/04 · A POD TUESDAY · TAP AN EVENT FOR RAW TELEMETRY</span>
          </div>
          <div className="fp3-shift">
            <div className="fp3-spec-bar">
              <span className="fp3-spec-id">TUESDAY.LOG</span>
              <span className="fp3-spec-line" aria-hidden="true" />
              <span className="fp3-spec-stamp">POD RUNTIME · UNEDITED</span>
            </div>
            {DAY.map((d, i) => (
              <div
                className={`fp3-shift-row fp3-reveal${d.tone ? ` is-${d.tone}` : ""}${openLog === i ? " is-open" : ""}`}
                style={{ ["--i" as string]: i }}
                key={d.time}
              >
                <button
                  type="button"
                  className="fp3-shift-btn"
                  aria-expanded={openLog === i}
                  onClick={() => setOpenLog(openLog === i ? null : i)}
                >
                  <span className="fp3-shift-time">{d.time}</span>
                  <span className="fp3-shift-node" aria-hidden="true" />
                  <span className="fp3-shift-body">
                    <span className="fp3-shift-title">{d.title}</span>
                    <span className="fp3-shift-desc">{d.desc}</span>
                  </span>
                  <span className="fp3-shift-caret" aria-hidden="true">▾</span>
                </button>
                <div className="fp3-shift-raw" hidden={openLog !== i}>
                  <span className="fp3-terminal-prompt" aria-hidden="true">&gt;</span>
                  {d.raw}
                </div>
              </div>
            ))}
            <div className="fp3-shift-eof" aria-hidden="true">
              <span className="fp3-terminal-prompt">&gt;</span>
              eof — same head, all four entries
              <span className="fp3-terminal-cursor" />
            </div>
          </div>
          <p className="fp3-week-note">
            No bench of juniors, no account layer, nowhere to hide — which is
            exactly why the people who fit here love it.
          </p>
        </section>

        {/* ── 05 · How we behave — protocol cards ── */}
        <section className="fp3-section fp3-reveal" aria-label="How we behave">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">How we behave</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/05 · ENFORCED, NOT ASPIRATIONAL</span>
          </div>
          <div className="fp3-protocards">
            {BEHAVIORS.map((b, i) => (
              <div
                className="fp3-protocard fp3-reveal"
                style={{ ["--i" as string]: i }}
                key={b.n}
              >
                <span className="fp3-protocard-ghost" aria-hidden="true">{b.n}</span>
                <span className="fp3-protocard-title">{b.title}</span>
                <span className="fp3-protocard-desc">{b.desc}</span>
                <span className="fp3-protocard-state">
                  <span className="fp3-mark-yes" aria-hidden="true" />
                  Enforced
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 06 · Bench clearance — the request, not an application ── */}
        <section className="fp3-section fp3-reveal" aria-label="Bench clearance request">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Bench clearance</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/06 · NOT A JOB APPLICATION</span>
          </div>
          <div className="fp3-clear">
            <div className="fp3-spec-bar">
              <span className="fp3-spec-id">CLEARANCE.REQUEST</span>
              <span className="fp3-spec-line" aria-hidden="true" />
              <span className="fp3-spec-stamp">READ FIRST WHEN A SEAT OPENS</span>
            </div>
            <p className="fp3-clear-lede">
              Don&rsquo;t send a CV summary. Submit parameters: who you are,
              where your work lives, and the part of a revenue system
              you&rsquo;d take personal responsibility for.
            </p>
            <form className="fp3-clear-form" onSubmit={submitClearance}>
              <div className="fp3-clear-grid">
                <label className="fp3-clear-field">
                  <span className="fp3-clear-k">
                    <span aria-hidden="true">&gt;</span> operator_name
                  </span>
                  <input
                    className="fp3-clear-input"
                    type="text"
                    value={opName}
                    onChange={(e) => setOpName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </label>
                <label className="fp3-clear-field">
                  <span className="fp3-clear-k">
                    <span aria-hidden="true">&gt;</span> current_post
                  </span>
                  <input
                    className="fp3-clear-input"
                    type="text"
                    value={opPost}
                    onChange={(e) => setOpPost(e.target.value)}
                    placeholder="Role · company"
                    required
                  />
                </label>
                <label className="fp3-clear-field">
                  <span className="fp3-clear-k">
                    <span aria-hidden="true">&gt;</span> work_sample
                  </span>
                  <input
                    className="fp3-clear-input"
                    type="url"
                    value={opLink}
                    onChange={(e) => setOpLink(e.target.value)}
                    placeholder="Portfolio, GitHub, or something you wrote"
                    required
                  />
                </label>
              </div>
              <label className="fp3-clear-field">
                <span className="fp3-clear-k">
                  <span aria-hidden="true">&gt;</span> parameters — what you&rsquo;d own
                </span>
                <textarea
                  className="fp3-clear-input fp3-clear-textarea"
                  value={opParams}
                  onChange={(e) => setOpParams(e.target.value)}
                  placeholder="The part of a revenue system you'd take personal responsibility for — and why that one."
                  rows={4}
                  required
                />
              </label>
              <div className="fp3-clear-foot">
                <button className="fp3-clear-submit" type="submit">
                  SUBMIT PARAMETERS FOR BENCH REVIEW
                  <span aria-hidden="true"> →</span>
                </button>
                <p className="fp3-clear-note">
                  Opens your mail client, addressed to the founding team —
                  no ATS, no pipeline software. A human reads everything.
                </p>
              </div>
            </form>
            <div className="fp3-clear-alt">
              <ArrowLink href="/insights" label="Read the field notes first" tone="sand" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
