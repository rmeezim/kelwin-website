"use client";

import { useEffect, useRef } from "react";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "./InsightsIndex.css";

// ─── Insights — the field-notes index ─────────────────────────────────────
// An editorial ledger, not a blog grid: one featured note in a bracketed
// specimen panel, then numbered entries on hairline rows. Every entry
// carries an honest status chip — nothing pretends to be live before it
// ships. Notes go to the request list first, so the page converts on the
// mailto and on the audit.

interface Note {
  n: string;
  title: string;
  dek: string;
  topic: string;
  status: string;
}

const FEATURED = {
  n: "FN·01",
  title: "Revenue entropy: why pipeline problems rarely start in the pipeline",
  dek: "The diagnostic we run before anything else — how unclear narrative, unrouted signal, and resetting campaigns all present as “not enough leads,” and how to read the difference before spending another quarter fixing the wrong layer.",
  topics: ["Diagnostics", "Narrative"],
  status: "First release · in preparation",
};

const NOTES: Note[] = [
  {
    n: "FN·02",
    title: "The 17% window",
    dek: "Buyers spend about a sixth of the journey with sales. What the narrative has to do in the other 83%.",
    topic: "Narrative",
    status: "Drafting",
  },
  {
    n: "FN·03",
    title: "Deliverability is infrastructure",
    dek: "Domains, authentication, warmup, list discipline — the mechanics that decide whether the message exists at all.",
    topic: "Channels",
    status: "Drafting",
  },
  {
    n: "FN·04",
    title: "Signal over sequence",
    dek: "What buyer-signal routing looks like in practice, and why volume-first sequencing keeps losing to it.",
    topic: "Intelligence",
    status: "In calibration",
  },
  {
    n: "FN·05",
    title: "The language committees repeat",
    dek: "How a deal is argued when you're not in the room — and how to write the words that survive the retelling.",
    topic: "Narrative",
    status: "Drafting",
  },
  {
    n: "FN·06",
    title: "Q1 resets are a choice",
    dek: "Instrumenting GTM so learning carries into the next cycle instead of evaporating with the campaign.",
    topic: "Systems",
    status: "Scheduled",
  },
  {
    n: "FN·07",
    title: "Notes from the audit bench",
    dek: "Patterns across recent system audits: the constraints that keep showing up, and the fixes that hold.",
    topic: "Diagnostics",
    status: "Recurring series",
  },
];

export default function InsightsIndex() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".insx-reveal");
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

  return (
    <main className="insx" ref={mainRef}>
      <div className="insx-stage">
        {/* ── Head ── */}
        <header className="insx-head insx-reveal">
          <div className="insx-protocol-row">
            <span className="insx-protocol">Resources · Insights</span>
            <span className="insx-protocol-line" aria-hidden="true" />
            <span className="insx-stamp">KELWIN/OS · FIELD NOTES</span>
          </div>
          <h1 className="insx-title">
            <span className="insx-title-1">Field notes</span>
            <span className="insx-title-2">from the install base.</span>
          </h1>
          <p className="insx-lede">
            Working notes from live systems — not thought leadership. What we
            publish here is the operational residue of real installs: signal
            patterns, deliverability mechanics, narrative decisions and what
            they did to pipeline.
          </p>
          <div className="insx-meta-strip" aria-label="Publication details">
            <span className="insx-meta-item">Cadence · as installs teach us</span>
            <span className="insx-meta-div" aria-hidden="true" />
            <span className="insx-meta-item">
              Topics · narrative / channels / intelligence / systems
            </span>
          </div>
        </header>

        {/* ── Featured note ── */}
        <article className="insx-featured insx-reveal" aria-label="Featured field note">
          <span className="insx-corner insx-corner-tl" aria-hidden="true" />
          <span className="insx-corner insx-corner-br" aria-hidden="true" />
          <div className="insx-featured-head">
            <span className="insx-num">{FEATURED.n}</span>
            <span className="insx-featured-flag">
              <span className="insx-flag-dot" aria-hidden="true" />
              Featured
            </span>
            <span className="insx-featured-line" aria-hidden="true" />
            <span className="insx-status">{FEATURED.status}</span>
          </div>
          <h2 className="insx-featured-title">{FEATURED.title}</h2>
          <p className="insx-featured-dek">{FEATURED.dek}</p>
          <div className="insx-featured-foot">
            <span className="insx-chips">
              {FEATURED.topics.map((t) => (
                <span className="insx-chip" key={t}>{t}</span>
              ))}
            </span>
            <ArrowLink
              href="mailto:audit@kelwin.co?subject=Field%20notes%20—%20send%20FN%C2%B701%20when%20it%20ships"
              label="Get it when it ships"
              tone="sand"
            />
          </div>
        </article>

        {/* ── Index ledger ── */}
        <section className="insx-ledger" aria-label="Field notes index">
          <div className="insx-colhead insx-reveal" aria-hidden="true">
            <span>№</span>
            <span>Note</span>
            <span className="insx-colhead-topic">Topic</span>
            <span className="insx-colhead-status">Status</span>
          </div>
          {NOTES.map((note, i) => (
            <article
              className="insx-row insx-reveal"
              key={note.n}
              style={{ ["--i" as string]: i }}
            >
              <span className="insx-num">{note.n}</span>
              <div className="insx-row-body">
                <h3 className="insx-row-title">{note.title}</h3>
                <p className="insx-row-dek">{note.dek}</p>
              </div>
              <span className="insx-chip insx-row-topic">{note.topic}</span>
              <span className="insx-status insx-row-status">{note.status}</span>
            </article>
          ))}
        </section>

        {/* ── Foot / conversion ── */}
        <footer className="insx-foot insx-reveal">
          <p className="insx-coda">
            The fastest way to read our thinking today is the audit readout
            itself.
          </p>
          <div className="insx-foot-actions">
            <DiagnosticMethodCTA
              href="/audit"
              label="Begin with the audit"
              variant="signal"
            />
            <ArrowLink
              href="mailto:audit@kelwin.co?subject=Field%20notes%20request%20list"
              label="Get notes as they ship"
              tone="sand"
            />
          </div>
          <p className="insx-foot-note">
            Notes go to the request list before they go anywhere else.
          </p>
        </footer>
      </div>
    </main>
  );
}
