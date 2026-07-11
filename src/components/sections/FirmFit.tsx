"use client";

import { useEffect, useRef } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import ConvertPanel from "@/components/ui/ConvertPanel";
import "./FirmPages.css";

// ─── Who we work with — the fit instrument ────────────────────────────────
// A qualification page that behaves like one: a calibration panel that
// reads in both directions (patina = in range, red = out of range), the
// three situations as dossier panels that each end on their own audit
// cue, and the gate as a terminal. Conversion-first: every block hands
// the reader a way to say "this is me" and act on it.

const IN_RANGE = [
  {
    title: "Sales-carried deals",
    desc: "A human closes. Committees, calls, contracts — the motion our system instruments.",
  },
  {
    title: "Real revenue, felt ceiling",
    desc: "The motion works; growth has stopped compounding. That's an architecture problem.",
  },
  {
    title: "Founder still in the building",
    desc: "The instincts exist — they're just trapped in one head. We write them down as a system.",
  },
  {
    title: "Someone will own it",
    desc: "After handover an internal operator runs the system. Wanting that is the real gate.",
  },
];

const OUT_OF_RANGE = [
  {
    title: "Pre-revenue",
    desc: "There's no working motion to instrument yet. Come back at first revenue — we mean it.",
  },
  {
    title: "Pure self-serve / PLG",
    desc: "Our system assumes a sales-carried deal. Different machinery, honestly not ours.",
  },
  {
    title: "Lead-list shopping",
    desc: "Renting activity is the cycle we exist to end. We'd be selling you the disease.",
  },
  {
    title: "Outsource-it-forever",
    desc: "If nobody inside will ever own the system, dependency isn't a risk — it's the plan. Not with us.",
  },
];

const VIGNETTES = [
  {
    n: "01",
    tag: "The founder-seller",
    title: "You're still the best rep the company has — and it's a trap.",
    body: "Deals close when you're in the room. The narrative lives in your head, the important emails get written at 11pm, and every attempt to delegate the pitch has come back sounding like a stranger wrote it. Revenue is real; it just doesn't survive your absence.",
    turn: "What changes: your instincts get written down as a system — a language other people can carry into rooms you're not in.",
    install: "Narrative system — your instincts, written down",
    installHref: "/capabilities/narrative-systems",
    cue: "Sounds like your Tuesday? Start the audit",
  },
  {
    n: "02",
    tag: "The plateaued motion",
    title: "The playbook that got you here has stopped compounding.",
    body: "You've got SDRs, sequences, a tech stack that cost real money — and a pipeline chart that's been flat for four quarters. Every quarter starts with a new campaign and ends with the same retro. Nobody can say what was learned, because nothing was kept.",
    turn: "What changes: the resets stop. Signal, language, and learning start carrying forward — the quarter deposits instead of evaporating.",
    install: "Intelligence layer — the loop that compounds",
    installHref: "/capabilities/gtm-intelligence",
    cue: "Four flat quarters? Start the audit",
  },
  {
    n: "03",
    tag: "The misheard category",
    title: "Buyers keep filing you next to the wrong competitors.",
    body: "The product is genuinely different, and it doesn't matter — because the market maps you onto whatever it already knows. Committees compare you against incumbents you don't resemble, on criteria you'd never choose. Winning feels like arguing uphill in someone else's language.",
    turn: "What changes: the category gets architected — the problem named your way, so the comparison happens on your terms.",
    install: "Category architecture — the problem, named your way",
    installHref: "/capabilities/narrative-systems",
    cue: "Tired of the wrong shortlist? Start the audit",
  },
];

export default function FirmFit() {
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
        {/* ── 01 · Calibration — reads in both directions ── */}
        <section className="fp3-section fp3-reveal" aria-label="Fit calibration">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Fit calibration</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIT/01 · READS IN BOTH DIRECTIONS</span>
          </div>
          <div className="fp3-cal">
            <span className="fp3-corner fp3-corner-tl" aria-hidden="true" />
            <span className="fp3-corner fp3-corner-br" aria-hidden="true" />
            <div className="fp3-cal-col">
              <div className="fp3-cal-head is-yes">
                <span className="fp3-mark-yes" aria-hidden="true" />
                In range
              </div>
              {IN_RANGE.map((r, i) => (
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
                Out of range
              </div>
              {OUT_OF_RANGE.map((r, i) => (
                <div className="fp3-cal-row fp3-reveal" style={{ ["--i" as string]: i }} key={r.title}>
                  <span className="fp3-cal-title is-dim">{r.title}</span>
                  <span className="fp3-cal-desc">{r.desc}</span>
                </div>
              ))}
            </div>
            <div className="fp3-cal-foot">
              <span className="fp3-cal-foot-note">
                The audit intake asks these three ways. Qualifying out costs
                nothing — the no protects both calendars.
              </span>
              <ArrowLink href="/audit" label="Run the three questions" tone="sand" />
            </div>
          </div>
        </section>

        {/* ── 02 · Three situations — told from inside ── */}
        <section className="fp3-section fp3-reveal" aria-label="Three situations">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Three situations</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIT/02 · TOLD FROM INSIDE</span>
          </div>
          <div className="fp3-vigs">
            {VIGNETTES.map((v, i) => (
              <article
                className="fp3-vig fp3-reveal"
                style={{ ["--i" as string]: i }}
                key={v.n}
              >
                {i === 0 && (
                  <>
                    <span className="fp3-corner fp3-corner-tl" aria-hidden="true" />
                    <span className="fp3-corner fp3-corner-br" aria-hidden="true" />
                  </>
                )}
                <span className="fp3-vig-ghost" aria-hidden="true">{v.n}</span>
                <span className="fp3-vig-tag">{v.tag}</span>
                <h2 className="fp3-vig-title">{v.title}</h2>
                <p className="fp3-vig-body">{v.body}</p>
                <p className="fp3-vig-turn">
                  <span className="fp3-vig-turn-dash" aria-hidden="true" />
                  {v.turn}
                </p>
                <div className="fp3-vig-foot">
                  <a className="fp3-vig-install" href={v.installHref}>
                    <span className="fp3-vig-install-k">First install</span>
                    <span className="fp3-vig-install-v">{v.install}</span>
                  </a>
                  <ArrowLink href="/audit" label={v.cue} tone="sand" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 03 · The gate — terminal ── */}
        <section className="fp3-section fp3-reveal" aria-label="The gate">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">The gate</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIT/03 · THREE QUESTIONS</span>
          </div>
          <div className="fp3-terminal" role="note">
            <div className="fp3-terminal-line">
              <span className="fp3-terminal-prompt" aria-hidden="true">&gt;</span>
              gate.check — where revenue is · how deals close · what the
              constraint feels like from inside
            </div>
            <div className="fp3-terminal-line">
              <span className="fp3-terminal-prompt" aria-hidden="true">&gt;</span>
              qualifying out costs nothing, and the yes means something when
              we say it
            </div>
            <div className="fp3-terminal-line">
              <span className="fp3-terminal-prompt" aria-hidden="true">&gt;</span>
              unsure which side you&rsquo;re on: the general channel stays
              open<span className="fp3-terminal-cursor" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* ── Close — the decision ── */}
        <div className="fp3-section fp3-reveal">
          <ConvertPanel
            title="If one of those read like your Tuesday,"
            sub="the audit reads like your diagnosis — ten working days against your numbers, your calls, your language. It gates before it books, so when it says go, it means it."
            chips={["3-question gate", "Fixed scope", "Honest in both directions"]}
            primary={{ href: "/audit", label: "See if the audit fits" }}
            secondary={{ href: "/contact", label: "Not sure? Ask us directly" }}
          />
        </div>
      </div>
    </main>
  );
}
