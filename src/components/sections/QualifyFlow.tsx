"use client";

import { useState } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import "./QualifyFlow.css";

// ─── Audit intake — the qualification waterfall ───────────────────────────
// Three questions gate the audit the way the Fit section promises: revenue
// stage, deal motion, felt constraint. Qualified visitors land on a booking
// step with their answers pre-written into the request; declined profiles
// get an honest no with useful exits (field notes, the general channel).
// The waterfall is the segmentation: serious buyers self-select here, and
// everyone else has /contact — nobody is forced through the wrong door.

interface Option {
  label: string;
  detail: string;
  declines?: string; // set → choosing this ends the flow with an honest no
}

interface Step {
  n: string;
  question: string;
  options: Option[];
}

const STEPS: Step[] = [
  {
    n: "01",
    question: "Where is revenue today?",
    options: [
      {
        label: "Pre-revenue",
        detail: "Product live or close, first customers still ahead.",
        declines:
          "There's no working motion to instrument yet. The audit reads a live system — it can't read one that hasn't started. When the first revenue is real, come straight back.",
      },
      {
        label: "Post-revenue — real, but lumpy",
        detail: "Deals close, but you can't predict next quarter from this one.",
      },
      {
        label: "Post-revenue — already predictable",
        detail: "The machine works; you want it calibrated and compounding.",
      },
    ],
  },
  {
    n: "02",
    question: "How do your deals close?",
    options: [
      {
        label: "Sales-led — a committee decides",
        detail: "Multiple stakeholders, narrative carries the deal.",
      },
      {
        label: "Hybrid — self-serve plus sales",
        detail: "Product motion up front, sales carries the expansion.",
      },
      {
        label: "Pure self-serve / PLG",
        detail: "Card at checkout, no sales conversation.",
        declines:
          "The system we install assumes a sales-carried deal — narrative argued in rooms, signal routed to humans. Pure self-serve deserves different machinery than ours.",
      },
    ],
  },
  {
    n: "03",
    question: "What does it feel like from inside?",
    options: [
      {
        label: "Not enough pipeline",
        detail: "The top of the funnel never fills reliably.",
      },
      {
        label: "Pipeline dies mid-funnel",
        detail: "Meetings happen; deals stall in committee.",
      },
      {
        label: "The message isn't landing",
        detail: "Activity is high, resonance is low.",
      },
      {
        label: "Honestly unsure",
        detail: "Something is off and you want it named.",
      },
    ],
  },
];

export default function QualifyFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [declined, setDeclined] = useState<string | null>(null);

  const done = step >= STEPS.length;

  function choose(opt: Option) {
    if (opt.declines) {
      setAnswers([...answers, opt.label]);
      setDeclined(opt.declines);
      return;
    }
    setAnswers([...answers, opt.label]);
    setStep(step + 1);
  }

  function back() {
    if (declined) {
      setDeclined(null);
      setAnswers(answers.slice(0, -1));
      return;
    }
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  }

  function restart() {
    setStep(0);
    setAnswers([]);
    setDeclined(null);
  }

  const bookingHref = (() => {
    const subject = "Audit qualification — booking the strategic call";
    const body = [
      "Qualification summary:",
      ...STEPS.map((s, i) => `- ${s.question} → ${answers[i] ?? "—"}`),
      "",
      "Preferred times for the call:",
      "",
    ].join("\n");
    return `mailto:audit@kelwin.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  })();

  return (
    <section className="qf" id="qualify" aria-label="Audit qualification">
      <div className="qf-stage">
        {/* The on-ramp — tells a first-time visitor exactly what this is
            and how little it costs before a single word of spec. */}
        <div className="qf-intro">
          <h2 className="qf-intro-title">
            Qualify yourself <span>in three taps.</span>
          </h2>
          <p className="qf-intro-sub">
            No form, no email, nothing to read first — the gate answers in
            about forty seconds, and it works in both directions.
          </p>
          <div className="qf-intro-path" aria-hidden="true">
            <span className="qf-intro-step">01 · REVENUE</span>
            <span className="qf-intro-link" />
            <span className="qf-intro-step">02 · MOTION</span>
            <span className="qf-intro-link" />
            <span className="qf-intro-step">03 · CONSTRAINT</span>
            <span className="qf-intro-link" />
            <span className="qf-intro-step is-book">BOOK THE CALL</span>
          </div>
        </div>
        <div className="qf-panel">
          <div className="qf-head">
            <span className="qf-protocol">Audit intake · Qualification</span>
            <span className="qf-head-line" aria-hidden="true" />
            <span className="qf-stamp">
              {declined
                ? "GATE · CLOSED"
                : done
                ? "GATE · PASSED"
                : `STEP ${STEPS[step].n} / 03`}
            </span>
          </div>

          {/* Progress rail — same diamond vocabulary as the methodology. */}
          <div className="qf-rail" aria-hidden="true">
            {STEPS.map((s, i) => (
              <span
                key={s.n}
                className={`qf-dot ${
                  declined
                    ? i < answers.length - 1
                      ? "is-done"
                      : i === answers.length - 1
                      ? "is-declined"
                      : ""
                    : i < step
                    ? "is-done"
                    : i === step && !done
                    ? "is-active"
                    : done
                    ? "is-done"
                    : ""
                }`}
              />
            ))}
            <span className={`qf-dot is-terminal ${done && !declined ? "is-done" : ""}`} />
          </div>

          {/* ── Declined ── */}
          {declined ? (
            <div className="qf-body" key="declined">
              <h3 className="qf-question">Not a fit yet — by design.</h3>
              <p className="qf-decline-copy">{declined}</p>
              <p className="qf-decline-sub">
                The gate works in both directions: qualifying out now costs
                you nothing and keeps the audit meaningful for when it fits.
              </p>
              <div className="qf-decline-actions">
                <ArrowLink href="/insights" label="Read the field notes meanwhile" tone="sand" />
                <ArrowLink href="/contact" label="Talk to the team anyway" tone="sand" />
              </div>
              <div className="qf-controls">
                <button className="qf-back" type="button" onClick={back}>
                  ← Change last answer
                </button>
                <button className="qf-back" type="button" onClick={restart}>
                  Restart
                </button>
              </div>
            </div>
          ) : done ? (
            /* ── Qualified — booking ── */
            <div className="qf-body" key="qualified">
              <h3 className="qf-question">Qualified. Let&rsquo;s put it on a calendar.</h3>
              <ul className="qf-summary">
                {STEPS.map((s, i) => (
                  <li className="qf-summary-row" key={s.n}>
                    <span className="qf-summary-q">{s.question}</span>
                    <span className="qf-summary-a">
                      <span className="qf-summary-mark" aria-hidden="true" />
                      {answers[i]}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="qf-book-row">
                <a className="qf-book" href={bookingHref}>
                  <span aria-hidden="true" className="qf-book-brackets" />
                  Book the strategic call
                  <span className="qf-book-arrow" aria-hidden="true">→</span>
                </a>
                <p className="qf-book-note">
                  Your answers travel with the request — we reply with times
                  within one working day. Thirty minutes, founding team, no
                  SDR handoff.
                </p>
              </div>
              <div className="qf-controls">
                <button className="qf-back" type="button" onClick={back}>
                  ← Change last answer
                </button>
              </div>
            </div>
          ) : (
            /* ── Active step ── */
            <div className="qf-body" key={step}>
              <h3 className="qf-question">{STEPS[step].question}</h3>
              <div className="qf-options" role="group" aria-label={STEPS[step].question}>
                {STEPS[step].options.map((opt, oi) => (
                  <button
                    key={opt.label}
                    type="button"
                    className="qf-option"
                    onClick={() => choose(opt)}
                  >
                    <span className="qf-option-ix" aria-hidden="true">
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="qf-option-body">
                      <span className="qf-option-label">{opt.label}</span>
                      <span className="qf-option-detail">{opt.detail}</span>
                    </span>
                    <span className="qf-option-arrow" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
              {step > 0 && (
                <div className="qf-controls">
                  <button className="qf-back" type="button" onClick={back}>
                    ← Back
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="qf-under-note">
          Not ready for any of this?{" "}
          <a href="/contact" className="qf-under-link">The general channel</a>{" "}
          takes questions with no qualification at all.
        </p>
      </div>
    </section>
  );
}
