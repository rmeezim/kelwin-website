"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ConvertPanel from "@/components/ui/ConvertPanel";
import "./FirmPages.css";

// ─── About — the doctrine ─────────────────────────────────────────────────
// The firm as a proprietary machine: origin telemetry (the broken GTM
// loop, plotted, with error states), a live-reading firm registry, the
// architects as spec sheets (portrait slots, one deliberately sealed),
// the founder memo, the operating beliefs as a mounted core stack, the
// cadence tape, and the family map. Converts on the audit.

const SPEC = [
  { k: "Founded", v: "2026 — deliberately late to the category" },
  { k: "Model", v: "Senior pods of 2–3, end to end" },
  { k: "Contracts", v: "Fixed scope, exit built in" },
  { k: "Engagements", v: "Install first, then an operating retainer — on a system you own" },
  { k: "Replies", v: "A founder, within a working day" },
];

// [EDIT ME] Founder: keep these two live readings true — they render as
// the registry's instruments and lose all power the day they're stale.
const REGISTRY_LIVE = {
  capacityLabel: "Pod capacity · committed",
  capacityPct: 50,
  windowLabel: "Next install window",
  windowValue: "Open",
};

const ARCHITECTS = [
  {
    n: "A·01",
    name: "Rameez",
    glyph: "R",
    designation: "Founder · Lead Narrative Architect",
    focus: "Category design, narrative systems, pipeline logic",
    status: "Deployed on active node",
    live: true,
  },
  {
    n: "A·02",
    name: "Position sealed",
    glyph: "▪",
    designation: "Systems Engineer — unassigned",
    focus: "Signal routing, deliverability, telemetry",
    status: "Bench reviews first",
    sealed: true,
  },
];

const STACK = [
  {
    n: "B·01",
    title: "Diagnosis before prescription",
    desc: "No engagement starts without the audit's readout — building before diagnosing sells the same fix to every different problem.",
  },
  {
    n: "B·02",
    title: "Assets first — then the retainer",
    desc: "Everything we install is documented in your language and lives in your stack. The operating retainer compounds a system you own — it never becomes the thing you rent.",
  },
  {
    n: "B·03",
    title: "Clarity is infrastructure",
    desc: "The market can't repeat what it can't understand. Most pipeline problems are narrative problems in disguise.",
  },
  {
    n: "B·04",
    title: "Compounding beats resetting",
    desc: "Every quarter deposits into the next — learning is the asset this industry keeps throwing away.",
  },
  {
    n: "B·05",
    title: "The exit test",
    desc: "If it stops working the day we leave, we built it wrong. Every engagement is designed backwards from this sentence.",
  },
];

const WEEK = [
  { day: "MON", time: "09:00", title: "Signal review", desc: "What the market did over the weekend. 25 minutes, no deck." },
  { day: "TUE", time: "10:30", title: "Client working session", desc: "Language decided live on the document — not presented after." },
  { day: "WED", time: "—", title: "No-meeting day", desc: "Systems get built. Notes get written. Calendars stay empty." },
  { day: "THU", time: "16:00", title: "Kill review", desc: "What we stop doing this week. The hardest ritual to keep.", tone: "red" as const },
  { day: "FRI", time: "15:00", title: "Readout ships", desc: "Every engagement, every week — what moved, in writing.", tone: "patina" as const },
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
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="fp3" ref={mainRef}>
      <div className="fp3-stage">
        {/* ── 01 · Origin telemetry — why Kelwin exists, plotted ── */}
        <section className="fp3-section fp3-reveal" aria-label="Origin telemetry">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Origin telemetry</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/01 · WHY KELWIN EXISTS, PLOTTED</span>
          </div>
          <div className="fp3-loops">
            <div className="fp3-loops-half">
              <div className="fp3-loops-head is-loop">
                <span className="fp3-mark-no" aria-hidden="true" />
                The standard agency loop
              </div>
              <svg className="fp3-loop-svg" viewBox="0 0 420 290" aria-hidden="true">
                <circle className="fp3-draw is-loop-path" cx="210" cy="135" r="78" pathLength={1} />
                {/* clockwise flow markers */}
                <path className="fp3-flowtri fp3-fade" d="M-4 -5 L6 0 L-4 5 Z" transform="translate(265 80) rotate(45)" />
                <path className="fp3-flowtri fp3-fade" d="M-4 -5 L6 0 L-4 5 Z" transform="translate(265 190) rotate(135)" />
                <path className="fp3-flowtri fp3-fade" d="M-4 -5 L6 0 L-4 5 Z" transform="translate(155 80) rotate(-45)" />
                {/* the break — sits ON the ring at the lower-left leak point
                    (155,190 is on the r=78 circle), clear of the Q1=Q9 chip */}
                <g className="fp3-fade is-break">
                  <line x1="148" y1="183" x2="162" y2="197" />
                  <line x1="162" y1="183" x2="148" y2="197" />
                </g>
                <text className="fp3-svg-label" x="210" y="34" textAnchor="middle">Capital in</text>
                <text className="fp3-svg-label" x="304" y="139" textAnchor="start">Campaigns run</text>
                <text className="fp3-svg-label" x="210" y="242" textAnchor="middle">Knowledge lost</text>
                <text className="fp3-svg-label" x="116" y="139" textAnchor="end">Reset</text>
                {/* error states — pinned beneath the stage they annotate */}
                <g className="fp3-fade is-err">
                  <rect x="134" y="252" width="152" height="18" />
                  <text x="210" y="265" textAnchor="middle">ERR · LEARNING LOST</text>
                </g>
                <g className="fp3-fade is-err">
                  <rect x="20" y="150" width="96" height="18" />
                  <text x="68" y="163" textAnchor="middle">ERR · Q1 = Q9</text>
                </g>
              </svg>
              <p className="fp3-loops-cap">
                Capital in, campaigns run, knowledge lost, reset. The loop
                conserves nothing — every cycle pays full price to relearn
                what the last one knew.
              </p>
            </div>
            <div className="fp3-loops-divider" aria-hidden="true" />
            <div className="fp3-loops-half">
              <div className="fp3-loops-head is-line">
                <span className="fp3-mark-yes" aria-hidden="true" />
                The Kelwin compounding model
              </div>
              <svg className="fp3-loop-svg" viewBox="0 0 420 290" aria-hidden="true">
                <path
                  className="fp3-draw is-line-path"
                  d="M30 240 L105 240 L105 195 L180 195 L180 150 L255 150 L255 105 L330 105 L330 60 L392 60"
                  pathLength={1}
                />
                <path className="fp3-fade is-line-arrow" d="M384 53 l10 7 -10 7" />
                <circle className="fp3-fade is-node" cx="105" cy="240" r="3" />
                <circle className="fp3-fade is-node" cx="180" cy="195" r="3" />
                <circle className="fp3-fade is-node" cx="255" cy="150" r="3" />
                <circle className="fp3-fade is-node" cx="330" cy="105" r="3" />
                <text className="fp3-svg-label is-q" x="67" y="262" textAnchor="middle">Q1</text>
                <text className="fp3-svg-label is-q" x="142" y="217" textAnchor="middle">Q2</text>
                <text className="fp3-svg-label is-q" x="217" y="172" textAnchor="middle">Q3</text>
                <text className="fp3-svg-label is-q" x="292" y="127" textAnchor="middle">Q4</text>
                {/* what carries forward — annotated above each tread, in the
                    open air left of the climb */}
                <g className="fp3-fade">
                  <rect className="fp3-kept-mark" x="160" y="176" width="6" height="6" />
                  <text className="fp3-svg-label is-kept" x="152" y="184" textAnchor="end">language kept</text>
                  <rect className="fp3-kept-mark" x="235" y="131" width="6" height="6" />
                  <text className="fp3-svg-label is-kept" x="227" y="139" textAnchor="end">signal map kept</text>
                  <rect className="fp3-kept-mark" x="310" y="86" width="6" height="6" />
                  <text className="fp3-svg-label is-kept" x="302" y="94" textAnchor="end">objection intel kept</text>
                </g>
              </svg>
              <p className="fp3-loops-cap">
                Each quarter deposits into the next. That&rsquo;s the whole
                architecture — everything else on this site is implementation.
              </p>
            </div>
          </div>
        </section>

        {/* ── 02 · Registry — what Kelwin is + the live widget ── */}
        <section className="fp3-section fp3-reveal" aria-label="What Kelwin is">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">What Kelwin is</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/02 · REGISTRY</span>
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
                <span className="fp3-spec-live">
                  <span className="fp3-spec-live-dot" aria-hidden="true" />
                  LIVE
                </span>
              </div>
              <dl className="fp3-spec-rows">
                {SPEC.map((r) => (
                  <div className="fp3-spec-row" key={r.k}>
                    <dt className="fp3-spec-k">{r.k}</dt>
                    <dd className="fp3-spec-v">{r.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="fp3-spec-meters">
                <div className="fp3-meter">
                  <span className="fp3-meter-k">{REGISTRY_LIVE.capacityLabel}</span>
                  <span className="fp3-meter-track" aria-hidden="true">
                    <span
                      className="fp3-meter-fill"
                      style={{ ["--w" as string]: `${REGISTRY_LIVE.capacityPct}%` }}
                    />
                  </span>
                  <span className="fp3-meter-v">{REGISTRY_LIVE.capacityPct}%</span>
                </div>
                <div className="fp3-meter">
                  <span className="fp3-meter-k">{REGISTRY_LIVE.windowLabel}</span>
                  <span className="fp3-meter-track is-empty" aria-hidden="true" />
                  <span className="fp3-meter-v is-patina">{REGISTRY_LIVE.windowValue}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 · The architects ──
            IMAGE SLOT: when a portrait lands (high-contrast, dark
            background), replace .fp3-arch-ghost with
            <img className="fp3-arch-photo" src="/arch-rameez.webp" alt="" />
            — the duotone treatment is applied by CSS. */}
        <section className="fp3-section fp3-reveal" aria-label="The architects">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The architects</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/03 · OPERATORS, NOT HEADCOUNT</span>
          </div>
          <div className="fp3-arch">
            {ARCHITECTS.map((a, i) => (
              <article
                className={`fp3-arch-card fp3-reveal${a.sealed ? " is-sealed" : ""}`}
                style={{ ["--i" as string]: i }}
                key={a.n}
              >
                <div className="fp3-arch-portrait" aria-hidden="true">
                  <span className="fp3-arch-ghost">{a.glyph}</span>
                  <span className="fp3-arch-scan" />
                  {a.sealed && <span className="fp3-arch-sealed-chip">SEALED</span>}
                </div>
                <div className="fp3-arch-spec">
                  <div className="fp3-arch-head">
                    <span className="fp3-arch-n">{a.n}</span>
                    <span className="fp3-arch-name">{a.name}</span>
                  </div>
                  <dl className="fp3-arch-rows">
                    <div className="fp3-arch-row">
                      <dt>Designation</dt>
                      <dd>{a.designation}</dd>
                    </div>
                    <div className="fp3-arch-row">
                      <dt>Focus sub-systems</dt>
                      <dd>{a.focus}</dd>
                    </div>
                    <div className="fp3-arch-row">
                      <dt>Status</dt>
                      <dd className={a.live ? "is-live" : "is-sealed"}>
                        <span className="fp3-arch-dot" aria-hidden="true" />
                        {a.status}
                      </dd>
                    </div>
                  </dl>
                  {a.sealed && (
                    <Link href="/careers" className="fp3-arch-link">
                      Request clearance → the bench
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 04 · The memo — bone paper artifact ──
            [EDIT ME] Founder: written in your voice on purpose. */}
        <section className="fp3-section fp3-reveal" aria-label="A memo from the founder">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">From the founder</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/04 · K-000 · KEPT VERBATIM</span>
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

        {/* ── 05 · The core stack — beliefs, mounted ── */}
        <section className="fp3-section fp3-reveal" aria-label="The core stack">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The core stack</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/05 · THE CODE THE FIRM RUNS ON</span>
          </div>
          <div className="fp3-rack">
            <div className="fp3-rack-bar">
              <span className="fp3-spec-id">KELWIN/OS · CORE</span>
              <span className="fp3-spec-line" aria-hidden="true" />
              <span className="fp3-spec-stamp">5 MODULES · ALL MOUNTED</span>
            </div>
            {STACK.map((s, i) => (
              <div
                className="fp3-rack-unit fp3-reveal"
                style={{ ["--i" as string]: i }}
                key={s.n}
              >
                <span className="fp3-rack-led" aria-hidden="true" />
                <span className="fp3-rack-n">{s.n}</span>
                <span className="fp3-rack-body">
                  <span className="fp3-rack-title">{s.title}</span>
                  <span className="fp3-rack-desc">{s.desc}</span>
                </span>
                <span className="fp3-rack-state">MOUNTED</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 06 · The week — one continuous tape instrument ── */}
        <section className="fp3-section fp3-reveal" aria-label="The operating week">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The cadence</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/06 · A WEEK, INSTRUMENTED</span>
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

        {/* ── 07 · The family — node diagram ── */}
        <section className="fp3-section fp3-reveal" aria-label="The family">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The family</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIRM/07 · ONE STANDARD</span>
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
