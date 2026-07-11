"use client";

import { useEffect, useRef } from "react";
import DotMatrixReading from "@/components/ui/DotMatrixReading";
import ConvertPanel from "@/components/ui/ConvertPanel";
import "./FirmPages.css";

// ─── Careers — the bench console ──────────────────────────────────────────
// Honest instead of aspirational, instrumented instead of listed: a live
// careers console (dot-matrix zero — the signature numeral spent on the
// most honest number on the site), the deal as a spec ledger, a pod
// Tuesday as a timeline, behaviors as an enforced ledger, and a
// two-column thrive/hate honesty grid. Converts to the bench list.

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
  },
  {
    time: "13:00",
    title: "Rewrite the message system",
    desc: "The morning's words, structured into the narrative OS.",
  },
  {
    time: "16:00",
    title: "Read the telemetry",
    desc: "Deliverability, replies, objections — did the market hear it?",
  },
  {
    time: "17:30",
    title: "Note ships to the client doc",
    desc: "What moved today, in writing. Then stop.",
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

const THRIVE = [
  { title: "You write to think", desc: "Your best reasoning happens in documents, and it shows." },
  { title: "You want the whole problem", desc: "Diagnose, build, and read the telemetry — the same head, end to end." },
  { title: "You like being findable", desc: "Your name goes on the readout. That feels like the point, not the risk." },
];

const AVOID = [
  { title: "You manage work instead of doing it", desc: "There is no layer here to manage from." },
  { title: "Decks are your native format", desc: "We write pages. Slides are for talks, rarely." },
  { title: "Activity feels like achievement", desc: "Pods are judged on what outlives the engagement." },
];

export default function FirmBench() {
  const mainRef = useRef<HTMLElement>(null);

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
      { threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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

        {/* ── 02 · A pod Tuesday — the day, instrumented ── */}
        <section className="fp3-section fp3-reveal" aria-label="A pod Tuesday">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The work</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/02 · A POD TUESDAY · ONE PERSON, ALL OF IT</span>
          </div>
          <div className="fp3-week fp3-day">
            {DAY.map((d, i) => (
              <div
                className={`fp3-week-slot fp3-reveal${d.tone ? ` is-${d.tone}` : ""}`}
                style={{ ["--i" as string]: i }}
                key={d.time}
              >
                <span className="fp3-week-time">{d.time}</span>
                <span className="fp3-week-title">{d.title}</span>
                <span className="fp3-week-desc">{d.desc}</span>
              </div>
            ))}
          </div>
          <p className="fp3-week-note">
            No bench of juniors, no account layer, nowhere to hide — which is
            exactly why the people who fit here love it.
          </p>
        </section>

        {/* ── 03 · How we behave ── */}
        <section className="fp3-section fp3-reveal" aria-label="How we behave">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">How we behave</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/03 · ENFORCED, NOT ASPIRATIONAL</span>
          </div>
          <ol className="fp3-ledger">
            {BEHAVIORS.map((b, i) => (
              <li
                className="fp3-row fp3-reveal"
                style={{ ["--i" as string]: i }}
                key={b.n}
              >
                <span className="fp3-row-num">{b.n}</span>
                <span className="fp3-row-body">
                  <span className="fp3-row-title">{b.title}</span>
                  <span className="fp3-row-desc">{b.desc}</span>
                </span>
                <span className="fp3-row-state">
                  <span className="fp3-mark-yes" aria-hidden="true" />
                  Enforced
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 04 · Honesty grid ── */}
        <section className="fp3-section fp3-reveal" aria-label="Who thrives here">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Read yourself in</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">BENCH/04 · BOTH DIRECTIONS</span>
          </div>
          <div className="fp3-cal is-plain">
            <div className="fp3-cal-col">
              <div className="fp3-cal-head is-yes">
                <span className="fp3-mark-yes" aria-hidden="true" />
                You&rsquo;ll like it here if
              </div>
              {THRIVE.map((r, i) => (
                <div className="fp3-cal-row fp3-reveal" style={{ ["--i" as string]: i }} key={r.title}>
                  <span className="fp3-cal-title">{r.title}</span>
                  <span className="fp3-cal-desc">{r.desc}</span>
                </div>
              ))}
            </div>
            <div className="fp3-cal-divider" aria-hidden="true" />
            <div className="fp3-cal-col">
              <div className="fp3-cal-head is-no">
                <span className="fp3-mark-no" aria-hidden="true" />
                You&rsquo;ll hate it here if
              </div>
              {AVOID.map((r, i) => (
                <div className="fp3-cal-row fp3-reveal" style={{ ["--i" as string]: i }} key={r.title}>
                  <span className="fp3-cal-title is-dim">{r.title}</span>
                  <span className="fp3-cal-desc">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Close — the bench ── */}
        <div className="fp3-section fp3-reveal">
          <ConvertPanel
            title="Don't wait for a listing."
            sub="Write to the founding team with the part of a revenue system you'd take personal responsibility for — not a CV summary. When a seat opens, the bench is read first."
            chips={["Senior pods", "Docs-first", "Comp published"]}
            primary={{
              href: "/contact?topic=careers&ref=Bench%20list",
              label: "Join the bench list",
            }}
            secondary={{ href: "/insights", label: "Read the field notes first" }}
          />
        </div>
      </div>
    </main>
  );
}
