"use client";

import { useEffect, useRef, useState } from "react";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import "./ContactChannel.css";

// ─── Contact — the general channel ────────────────────────────────────────
// The deliberate second door. The audit path is for teams ready to be
// qualified; this channel is for everyone earlier than that. Company name +
// company email are required — the polite gate that keeps the channel
// usable for real requests without a CRM on the other side.
//
// Deep-linkable: /contact?topic=dossier&ref=CS·01 preselects the topic and
// pins a "regarding" reference (used by the case-dossier and research-doc
// request links on /reports, and the careers bench list).

const TOPICS = [
  "Understanding what Kelwin does",
  "Requesting a case dossier",
  "Requesting a research document",
  "Field notes & publications",
  "Exploring a future engagement",
  "Partnerships",
  "Press & speaking",
  "Careers & the bench list",
  "Something else",
];

const TOPIC_PARAM_MAP: Record<string, string> = {
  dossier: "Requesting a case dossier",
  research: "Requesting a research document",
  careers: "Careers & the bench list",
  engagement: "Exploring a future engagement",
};

export default function ContactChannel() {
  const mainRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [regarding, setRegarding] = useState<string | null>(null);

  // Prefill from query params (static export — parse client-side).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("topic");
    const ref = params.get("ref");
    if (t && TOPIC_PARAM_MAP[t]) setTopic(TOPIC_PARAM_MAP[t]);
    if (ref) setRegarding(ref);
    if (t || ref) {
      // Land the visitor on the form itself. Delayed until after layout
      // (fonts, reveals) settles so the scroll target is stable, then a
      // brief pulse on the pinned reference shows what got preselected.
      const timer = window.setTimeout(() => {
        document
          .getElementById("write")
          ?.scrollIntoView({ block: "start", behavior: "smooth" });
        window.setTimeout(() => {
          document
            .querySelector(".ctc-regarding")
            ?.classList.add("is-pulsing");
        }, 450);
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, []);

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
    const subject = `${topic}${regarding ? ` — ${regarding}` : ""} — ${company}`;
    const body = [
      message,
      "",
      "—",
      `Name: ${name}`,
      `Company: ${company}`,
      `Company email: ${email}`,
      `Topic: ${topic}`,
      regarding && `Regarding: ${regarding}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:audit@kelwin.co?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  const isDocRequest =
    topic === "Requesting a case dossier" ||
    topic === "Requesting a research document";

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
              Questions, document requests, partnerships, press — or
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

          {regarding && (
            <div className="ctc-regarding" role="note">
              <span className="ctc-regarding-label">Regarding</span>
              <span className="ctc-regarding-ref">{regarding}</span>
              <button
                type="button"
                className="ctc-regarding-clear"
                onClick={() => setRegarding(null)}
                aria-label="Remove reference"
              >
                ✕
              </button>
            </div>
          )}

          <form className="ctc-form" onSubmit={submit}>
            <div className="ctc-grid">
              <label className="ctc-field">
                <span className="ctc-label">
                  Name <span className="ctc-req">· required</span>
                </span>
                <input
                  className="ctc-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="ctc-field">
                <span className="ctc-label">
                  Company <span className="ctc-req">· required</span>
                </span>
                <input
                  className="ctc-input"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name"
                  autoComplete="organization"
                  required
                />
              </label>
            </div>

            <div className="ctc-grid">
              <label className="ctc-field">
                <span className="ctc-label">
                  Company email <span className="ctc-req">· required</span>
                </span>
                <input
                  className="ctc-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="work email"
                  required
                />
                <span className="ctc-hint">
                  We reply to company addresses — it keeps this channel usable
                  for the real requests.
                </span>
              </label>
              <label className="ctc-field">
                <span className="ctc-label">
                  Topic <span className="ctc-req">· required</span>
                </span>
                <div className="ctc-select-wrap">
                  <select
                    className="ctc-input ctc-select"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  >
                    {TOPICS.map((t) => (
                      <option value={t} key={t}>{t}</option>
                    ))}
                  </select>
                  <span className="ctc-select-arrow" aria-hidden="true">▾</span>
                </div>
                {isDocRequest && (
                  <span className="ctc-hint">
                    Cleared documents ship to your company inbox — usually
                    within two working days.
                  </span>
                )}
              </label>
            </div>

            <label className="ctc-field">
              <span className="ctc-label">
                {isDocRequest ? "Anything to add" : "What's on your mind"}
                {!isDocRequest && <span className="ctc-req"> · required</span>}
              </span>
              <textarea
                className="ctc-input ctc-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isDocRequest
                    ? "Optional — context for the request, or where to focus."
                    : "As rough as you like — bullet points are fine."
                }
                rows={6}
                required={!isDocRequest}
              />
            </label>

            <div className="ctc-submit-row">
              <button className="ctc-submit" type="submit">
                {isDocRequest ? "Request the document" : "Send the message"}
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
