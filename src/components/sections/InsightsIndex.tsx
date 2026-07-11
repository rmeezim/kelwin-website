"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "./InsightsIndex.css";

// ─── Insights — the field-notes front page ────────────────────────────────
// Conversion-first layout: every published note is a full card with a real
// hook (not a shrunken list row), arranged as a front page — the featured
// essay anchors left, the other notes stack beside it at equal visual
// dignity, so a visitor always has a next thing to read. The queue is a
// compact strip, and the page ends on a two-path conversion panel instead
// of trailing off.

interface Note {
  n: string;
  slug: string;
  title: string;
  dek: string;
  topics: string[];
  date: string;
  read: string;
}

const FEATURED: Note = {
  n: "FN·01",
  slug: "/insights/revenue-entropy",
  title: "Revenue entropy: why pipeline problems rarely start in the pipeline",
  dek: "Every founder we audit says some version of the same sentence: “we need more pipeline.” It's almost never the diagnosis — it's the symptom that three different structural failures share, and the treatment for each one is different.",
  topics: ["Diagnostics", "Narrative"],
  date: "June 2026",
  read: "6 min",
};

const PUBLISHED: Note[] = [
  {
    n: "FN·02",
    slug: "/insights/the-17-percent-window",
    title: "The 17% window",
    dek: "Buyers spend a sixth of the journey with sales. The deal is argued in the other 83% — by people you'll never meet, using whatever words you left them.",
    topics: ["Narrative"],
    date: "June 2026",
    read: "5 min",
  },
  {
    n: "FN·03",
    slug: "/insights/deliverability-is-infrastructure",
    title: "Deliverability is infrastructure",
    dek: "Before your message can be judged, it has to exist. For a growing share of B2B outbound, it doesn't — it dies in a filter while the dashboard says delivered.",
    topics: ["Channels"],
    date: "May 2026",
    read: "5 min",
  },
];

const QUEUE = [
  { n: "FN·04", title: "Signal over sequence", topic: "Intelligence", status: "In calibration" },
  { n: "FN·05", title: "The language committees repeat", topic: "Narrative", status: "Drafting" },
  { n: "FN·06", title: "Q1 resets are a choice", topic: "Systems", status: "Drafting" },
];

function NoteCard({ note, big }: { note: Note; big?: boolean }) {
  return (
    <Link
      href={note.slug}
      className={`insx-card${big ? " is-featured" : ""}`}
      aria-label={`Read: ${note.title}`}
    >
      <span className="insx-card-head">
        <span className="insx-num">{note.n}</span>
        {big && (
          <span className="insx-featured-flag">
            <span className="insx-flag-dot" aria-hidden="true" />
            Featured
          </span>
        )}
        <span className="insx-card-line" aria-hidden="true" />
        <span className="insx-card-meta">{note.date} · {note.read}</span>
      </span>
      <span className="insx-card-title">{note.title}</span>
      <span className="insx-card-dek">{note.dek}</span>
      <span className="insx-card-foot">
        <span className="insx-chips">
          {note.topics.map((t) => (
            <span className="insx-chip" key={t}>{t}</span>
          ))}
        </span>
        <span className="insx-read-cue">
          Read the note <span className="insx-read-arrow" aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  );
}

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
      { threshold: 0.12 }
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
            <span className="insx-stamp">KELWIN/OS · FIELD NOTES · VOL 01</span>
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
        </header>

        {/* ── Front page: featured + stack ── */}
        <section className="insx-front insx-reveal" aria-label="Published field notes">
          <NoteCard note={FEATURED} big />
          <div className="insx-front-stack">
            {PUBLISHED.map((n) => (
              <NoteCard note={n} key={n.n} />
            ))}
          </div>
        </section>

        {/* ── In the works — compact strip ── */}
        <section className="insx-queue insx-reveal" aria-label="Notes in preparation">
          <div className="insx-queue-head">
            <span className="insx-queue-label">In the works</span>
            <span className="insx-queue-line" aria-hidden="true" />
            <span className="insx-queue-note">Queued notes ship to the request list first</span>
          </div>
          <div className="insx-queue-grid">
            {QUEUE.map((q) => (
              <div className="insx-queue-card" key={q.n}>
                <span className="insx-num">{q.n}</span>
                <span className="insx-queue-title">{q.title}</span>
                <span className="insx-queue-meta">
                  <span className="insx-chip">{q.topic}</span>
                  <span className="insx-status">{q.status}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Conversion panel — the page ends on a decision, not a fade ── */}
        <section className="insx-convert insx-reveal" aria-label="Next step">
          <div className="insx-convert-main">
            <h2 className="insx-convert-title">
              Reading is research. The audit is diagnosis.
            </h2>
            <p className="insx-convert-sub">
              If a note reads like your quarter, the audit reads like your
              company — fixed scope, ten working days, readout yours to keep.
            </p>
          </div>
          <div className="insx-convert-actions">
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
        </section>
      </div>
    </main>
  );
}
