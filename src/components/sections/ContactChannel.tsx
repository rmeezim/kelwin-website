"use client";

import { useEffect, useRef, useState } from "react";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import "./ContactChannel.css";

// ─── Contact — the general channel ────────────────────────────────────────
// The deliberate second door. The audit path is for teams ready to be
// qualified; this channel is for everyone earlier than that — mapping the
// space, requesting information, press, partnerships. Stating the split
// out loud is the point: it self-segments visitors by intent instead of
// funnelling everyone through one "Get in touch" button.
//
// Static site — the form composes a mailto so the message goes straight to
// the team with no backend, which is also the brand promise: no CRM
// sequence on the other side.

const TOPICS = [
  "Understanding what Kelwin does",
  "Requesting information or a document",
  "Partnerships",
  "Press",
  "Something else",
];

export default function ContactChannel() {
  const mainRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".ctc-reveal");
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `General query — ${topic}${company ? ` — ${company}` : ""}`;
    const body = [
      message,
      "",
      "—",
      name && `Name: ${name}`,
      company && `Company: ${company}`,
      `Topic: ${topic}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:audit@kelwin.co?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="ctc" ref={mainRef}>
      <div className="ctc-stage">
        {/* ── Head ── */}
        <header className="ctc-head ctc-reveal">
          <div className="ctc-protocol-row">
            <span className="ctc-protocol">Contact · General channel</span>
            <span className="ctc-protocol-line" aria-hidden="true" />
            <span className="ctc-stamp">KELWIN/OS · INBOUND</span>
          </div>
          <h1 className="ctc-title">
            <span className="ctc-title-1">Two doors.</span>
            <span className="ctc-title-2">Take the one that fits.</span>
          </h1>
          <p className="ctc-lede">
            If you already suspect something structural is off, the audit is
            the serious door — fixed scope, qualification first. If
            you&rsquo;re still mapping the space, this channel exists so you
            don&rsquo;t have to pretend otherwise. Both land with the founding
            team.
          </p>
        </header>

        {/* ── The two doors ── */}
        <div className="ctc-doors ctc-reveal">
          <div className="ctc-door is-audit">
            <div className="ctc-door-head">
              <span className="ctc-door-num">D·01</span>
              <span className="ctc-door-tag is-audit">Ready to diagnose</span>
            </div>
            <h2 className="ctc-door-title">The system audit</h2>
            <p className="ctc-door-desc">
              You know the growth is there but not predictable. Qualification
              first, then a fixed-scope diagnostic — ten working days, readout
              yours to keep.
            </p>
            <div className="ctc-door-action">
              <DiagnosticMethodCTA
                href="/audit"
                label="Begin qualification"
                variant="signal"
              />
            </div>
          </div>

          <div className="ctc-door">
            <div className="ctc-door-head">
              <span className="ctc-door-num">D·02</span>
              <span className="ctc-door-tag">Still mapping</span>
            </div>
            <h2 className="ctc-door-title">A conversation</h2>
            <p className="ctc-door-desc">
              Questions, information requests, partnerships, press — or
              you&rsquo;re just not sure yet what you need. That&rsquo;s a
              valid state. Write below.
            </p>
            <div className="ctc-door-action">
              <a className="ctc-door-anchor" href="#write">
                Write to the team ↓
              </a>
            </div>
          </div>
        </div>

        {/* ── The form ── */}
        <section className="ctc-form-wrap ctc-reveal" id="write" aria-label="Write to the team">
          <div className="ctc-form-head">
            <span className="ctc-form-protocol">Message · Direct</span>
            <span className="ctc-form-line" aria-hidden="true" />
            <span className="ctc-form-stamp">No CRM · No sequence</span>
          </div>

          <form className="ctc-form" onSubmit={submit}>
            <div className="ctc-grid">
              <label className="ctc-field">
                <span className="ctc-label">Name</span>
                <input
                  className="ctc-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
              <label className="ctc-field">
                <span className="ctc-label">Company</span>
                <input
                  className="ctc-input"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company (optional)"
                  autoComplete="organization"
                />
              </label>
            </div>

            <label className="ctc-field">
              <span className="ctc-label">Topic</span>
              <div className="ctc-select-wrap">
                <select
                  className="ctc-input ctc-select"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {TOPICS.map((t) => (
                    <option value={t} key={t}>{t}</option>
                  ))}
                </select>
                <span className="ctc-select-arrow" aria-hidden="true">▾</span>
              </div>
            </label>

            <label className="ctc-field">
              <span className="ctc-label">What&rsquo;s on your mind</span>
              <textarea
                className="ctc-input ctc-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="As rough as you like — bullet points are fine."
                rows={6}
                required
              />
            </label>

            <div className="ctc-submit-row">
              <button className="ctc-submit" type="submit">
                <span className="ctc-submit-bracket" aria-hidden="true" />
                Send the message
                <span className="ctc-submit-arrow" aria-hidden="true">→</span>
              </button>
              <p className="ctc-submit-note">
                Opens your mail client, addressed to the founding team — no
                form-to-CRM pipeline on the other side. A human reads
                everything; expect a reply within two working days.
              </p>
            </div>
          </form>
        </section>

        {/* ── Direct line ── */}
        <footer className="ctc-foot ctc-reveal">
          <p className="ctc-coda">
            Prefer plain email? Same door, no form.
          </p>
          <a className="ctc-email" href="mailto:audit@kelwin.co">
            audit@kelwin.co
          </a>
        </footer>
      </div>
    </main>
  );
}
