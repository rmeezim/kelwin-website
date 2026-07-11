"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ConvertPanel from "@/components/ui/ConvertPanel";
import "./FirmPages.css";

// ─── About — the firm, instrumented ───────────────────────────────────────
// Every artifact on this page exists only here: the firm registry spec
// sheet, the reset-loop vs compounding-line diagram (the company thesis,
// drawn), the founder memo on bone paper, the enforced-beliefs ledger,
// the operating week as one continuous tape instrument, and the family
// node map. Conversion thread: the diagram argues, the memo humanizes,
// the ConvertPanel closes.

const SPEC = [
  { k: "Founded", v: "2026 — deliberately late to the category" },
  { k: "Model", v: "Senior pods of 2–3, end to end" },
  { k: "Contracts", v: "Fixed scope, exit built in" },
  { k: "Retainers", v: "None. Zero. That's the point." },
  { k: "Systems", v: "Installed, documented, owned by you", patina: true },
  { k: "Replies", v: "A founder, within a working day" },
];

const BELIEFS = [
  {
    n: "B·01",
    title: "Diagnosis before prescription.",
    desc: "No engagement starts without the audit's readout. Building before diagnosing is how this industry sells the same fix to every different problem.",
  },
  {
    n: "B·02",
    title: "Assets, not retainers.",
    desc: "Everything we build is documented in your language and lives in your stack. Six transferable artifacts, yours outright — dependency is a design flaw.",
  },
  {
    n: "B·03",
    title: "The market can't repeat what it can't understand.",
    desc: "Most pipeline problems are narrative problems wearing a disguise. Clarity is infrastructure, not copywriting.",
  },
  {
    n: "B·04",
    title: "Compounding beats resetting.",
    desc: "A campaign that ends teaches nothing. Every quarter should deposit into the next — learning is the asset this industry keeps throwing away.",
  },
  {
    n: "B·05",
    title: "If it stops working the day we leave, we built it wrong.",
    desc: "The exit test. It's on the homepage, and it's the sentence we design every engagement backwards from.",
  },
];

const WEEK = [
  {
    day: "MON",
    time: "09:00",
    title: "Signal review",
    desc: "What the market did over the weekend. 25 minutes, no deck.",
  },
  {
    day: "TUE",
    time: "10:30",
    title: "Client working session",
    desc: "Language decided live on the document — not presented after.",
  },
  {
    day: "WED",
    time: "—",
    title: "No-meeting day",
    desc: "Systems get built. Notes get written. Calendars stay empty.",
  },
  {
    day: "THU",
    time: "16:00",
    title: "Kill review",
    desc: "What we stop doing this week. The hardest ritual to keep.",
    tone: "red" as const,
  },
  {
    day: "FRI",
    time: "15:00",
    title: "Readout ships",
    desc: "Every engagement, every week — what moved, in writing.",
    tone: "patina" as const,
  },
];

export default function FirmAbout() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".fp3-reveal");
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
    <main className="fp3" ref={mainRef}>
      <div className="fp3-stage">
        {/* ── 01 · Registry — what Kelwin is + the spec sheet ── */}
        <section className="fp3-section fp3-reveal" aria-label="What Kelwin is">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">What Kelwin is</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/01 · REGISTRY</span>
          </div>
          <div className="fp3-registry">
            <div className="fp3-registry-copy">
              <h2 className="fp3-h">
                A systems partner,
                <span> not another agency.</span>
              </h2>
              <p className="fp3-prose">
                Agencies rent you activity — campaigns, sequences, SDR hours —
                that stops the day the contract does. Kelwin installs{" "}
                <strong>revenue infrastructure your team owns and operates</strong>:
                the narrative system that decides what the market hears, the
                omnichannel motion that puts it in front of buyers, and the
                intelligence layer that feeds back what works.
              </p>
              <p className="fp3-accent">
                <span className="fp3-accent-dash" aria-hidden="true" />
                We exist to end the rebuild cycle — new agency, new playbook,
                same ceiling.
              </p>
            </div>
            <div className="fp3-spec">
              <span className="fp3-corner fp3-corner-tl" aria-hidden="true" />
              <span className="fp3-corner fp3-corner-br" aria-hidden="true" />
              <div className="fp3-spec-bar">
                <span className="fp3-spec-id">FIRM REGISTRY · K-001</span>
                <span className="fp3-spec-line" aria-hidden="true" />
                <span className="fp3-spec-stamp">VERIFIED</span>
              </div>
              <dl className="fp3-spec-rows">
                {SPEC.map((r) => (
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

        {/* ── 02 · The argument, drawn — reset loop vs compounding line ── */}
        <section className="fp3-section fp3-reveal" aria-label="The reset loop versus the compounding line">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The argument</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/02 · TWO WAYS A QUARTER CAN END</span>
          </div>
          <div className="fp3-loops">
            <div className="fp3-loops-half">
              <div className="fp3-loops-head is-loop">
                <span className="fp3-mark-no" aria-hidden="true" />
                The reset loop
              </div>
              <svg className="fp3-loop-svg" viewBox="0 0 420 260" aria-hidden="true">
                {/* the cycle */}
                <circle className="fp3-draw is-loop-path" cx="210" cy="132" r="82" pathLength={1} />
                {/* direction chevrons */}
                <path className="fp3-fade" d="M286 100 l7 9 -11 3" />
                <path className="fp3-fade" d="M134 166 l-7 -9 11 -3" />
                {/* the break — where the learning leaves */}
                <g className="fp3-fade is-break">
                  <line x1="262" y1="62" x2="280" y2="80" />
                  <line x1="280" y1="62" x2="262" y2="80" />
                </g>
                <text className="fp3-svg-label" x="210" y="30" textAnchor="middle">New agency</text>
                <text className="fp3-svg-label" x="310" y="136" textAnchor="start">Activity spike</text>
                <text className="fp3-svg-label" x="210" y="240" textAnchor="middle">Plateau</text>
                <text className="fp3-svg-label" x="110" y="136" textAnchor="end">Contract ends</text>
                <text className="fp3-svg-label is-red" x="288" y="54" textAnchor="start">learning lost</text>
              </svg>
              <p className="fp3-loops-cap">
                Q1 = Q5 = Q9. The loop conserves nothing — every cycle pays
                full price to relearn what the last one knew.
              </p>
            </div>
            <div className="fp3-loops-divider" aria-hidden="true" />
            <div className="fp3-loops-half">
              <div className="fp3-loops-head is-line">
                <span className="fp3-mark-yes" aria-hidden="true" />
                The compounding line
              </div>
              <svg className="fp3-loop-svg" viewBox="0 0 420 260" aria-hidden="true">
                <path
                  className="fp3-draw is-line-path"
                  d="M30 225 L105 225 L105 180 L180 180 L180 135 L255 135 L255 90 L330 90 L330 45 L392 45"
                  pathLength={1}
                />
                <path className="fp3-fade is-line-arrow" d="M384 38 l10 7 -10 7" />
                <circle className="fp3-fade is-node" cx="105" cy="225" r="3" />
                <circle className="fp3-fade is-node" cx="180" cy="180" r="3" />
                <circle className="fp3-fade is-node" cx="255" cy="135" r="3" />
                <circle className="fp3-fade is-node" cx="330" cy="90" r="3" />
                <text className="fp3-svg-label is-q" x="67" y="247" textAnchor="middle">Q1</text>
                <text className="fp3-svg-label is-q" x="142" y="202" textAnchor="middle">Q2</text>
                <text className="fp3-svg-label is-q" x="217" y="157" textAnchor="middle">Q3</text>
                <text className="fp3-svg-label is-q" x="292" y="112" textAnchor="middle">Q4</text>
                <g className="fp3-fade">
                  <rect className="fp3-kept-mark" x="113" y="158" width="6" height="6" />
                  <text className="fp3-svg-label is-kept" x="125" y="165" textAnchor="start">language kept</text>
                  <rect className="fp3-kept-mark" x="188" y="113" width="6" height="6" />
                  <text className="fp3-svg-label is-kept" x="200" y="120" textAnchor="start">signal map kept</text>
                  <rect className="fp3-kept-mark" x="263" y="68" width="6" height="6" />
                  <text className="fp3-svg-label is-kept" x="275" y="75" textAnchor="start">objection intel kept</text>
                </g>
              </svg>
              <p className="fp3-loops-cap">
                Each quarter deposits into the next. That&rsquo;s the whole
                architecture — everything else on this site is implementation.
              </p>
            </div>
          </div>
        </section>

        {/* ── 03 · The memo — bone paper artifact ──
            [EDIT ME] Founder: written in your voice on purpose — adjust
            wording, keep the register. */}
        <section className="fp3-section fp3-reveal" aria-label="A memo from the founder">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">From the founder</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/03 · K-000 · KEPT VERBATIM</span>
          </div>
          <div className="fp3-memo">
            <div className="fp3-memo-bar">
              <span className="fp3-memo-id">INTERNAL MEMO · K-000</span>
              <span className="fp3-memo-chip">FOUNDER COPY</span>
            </div>
            <p className="fp3-memo-subject">
              <span>Subject:</span> Why Kelwin exists
            </p>
            <div className="fp3-memo-body">
              <p>
                I started Kelwin after watching the same movie too many times:
                a good company, a real product, a founder writing every
                important email themselves at 11pm — hiring an agency, getting
                a quarter of activity, and ending up exactly where they
                started, minus the budget.
              </p>
              <p>
                Nobody in that movie is lazy. The problem is structural: the
                learning leaves with the vendor, the language never gets
                written down, and every quarter starts from zero. So we built
                the firm we kept wishing existed — one that installs the
                system, then hands you the keys.
              </p>
              <p>
                If you write to us, a person answers. That isn&rsquo;t a
                feature. That&rsquo;s the point.
              </p>
            </div>
            <div className="fp3-memo-sign">
              <span className="fp3-memo-dash" aria-hidden="true" />
              <span className="fp3-memo-name">Rameez</span>
              <span className="fp3-memo-role">Founder, Kelwin</span>
            </div>
            <div className="fp3-memo-foot">
              Drafted late on a Tuesday. Unchanged since.
            </div>
          </div>
        </section>

        {/* ── 04 · Beliefs — the enforced ledger ── */}
        <section className="fp3-section fp3-reveal" aria-label="Operating beliefs">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Operating beliefs</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/04 · FIVE · HELD STUBBORNLY</span>
          </div>
          <ol className="fp3-ledger">
            {BELIEFS.map((b, i) => (
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

        {/* ── 05 · The week — one continuous tape instrument ── */}
        <section className="fp3-section fp3-reveal" aria-label="The operating week">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The cadence</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/05 · A WEEK, INSTRUMENTED</span>
          </div>
          <div className="fp3-tape">
            {WEEK.map((w, i) => (
              <div
                className={`fp3-tape-cell fp3-reveal${w.tone ? ` is-${w.tone}` : ""}`}
                style={{ ["--i" as string]: i }}
                key={w.day}
              >
                <span className="fp3-tape-top">
                  <span className="fp3-tape-day">{w.day}</span>
                  <span className="fp3-tape-ticks" aria-hidden="true" />
                  <span className="fp3-tape-time">{w.time}</span>
                </span>
                <span className="fp3-tape-title">{w.title}</span>
                <span className="fp3-tape-desc">{w.desc}</span>
              </div>
            ))}
          </div>
          <p className="fp3-week-note">
            The same cadence runs inside client engagements — you&rsquo;ll
            recognize the Friday readout from the methodology.
          </p>
        </section>

        {/* ── 06 · The family — node diagram ── */}
        <section className="fp3-section fp3-reveal" aria-label="The family">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The family</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/06 · ONE STANDARD</span>
          </div>
          <div className="fp3-family">
            <div className="fp3-family-node">
              <span className="fp3-family-glyph is-plurel" aria-hidden="true" />
              <span className="fp3-family-name">PLUREL</span>
              <span className="fp3-family-role">Creative &amp; performance division</span>
              <span className="fp3-family-line1">Makes brands seen.</span>
            </div>
            <span className="fp3-family-link" aria-hidden="true" />
            <div className="fp3-family-node is-kelwin">
              <span className="fp3-family-glyph is-kelwin" aria-hidden="true" />
              <span className="fp3-family-name">KELWIN</span>
              <span className="fp3-family-role">Revenue systems &amp; advisory</span>
              <span className="fp3-family-line1">Makes revenue systematic.</span>
            </div>
            <span className="fp3-family-link" aria-hidden="true" />
            <Link href="/the-lab" className="fp3-family-node is-lab">
              <span className="fp3-family-glyph is-lab" aria-hidden="true" />
              <span className="fp3-family-name">THE LAB</span>
              <span className="fp3-family-role">R&amp;D · in development</span>
              <span className="fp3-family-line1">Makes the learning permanent. →</span>
            </Link>
          </div>
          <p className="fp3-family-note">
            Same craft standards, same refusal of template work — Plurel warm
            and expressive, Kelwin precise and infrastructural. The advisory
            work funds The Lab; The Lab makes the advisory sharper.
          </p>
        </section>

        {/* ── Close — the decision ── */}
        <div className="fp3-section fp3-reveal">
          <ConvertPanel
            title="You've read how we think."
            sub="The audit shows what we'd do — with your pipeline, your language, your numbers. Ten working days, and if we're not the fix, the readout says so and points you somewhere better."
            chips={["Fixed scope", "10 working days", "Readout yours to keep"]}
            primary={{ href: "/audit", label: "Begin with the audit" }}
            secondary={{ href: "/contact", label: "Or write to the team" }}
          />
        </div>
      </div>
    </main>
  );
}
