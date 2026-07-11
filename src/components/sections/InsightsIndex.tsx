"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "./InsightsIndex.css";

// ─── Insights — the field-notes journal ───────────────────────────────────
// A publication, not a blog grid: one featured essay in a bracketed panel,
// then published notes as readable index rows (title, standfirst excerpt,
// topic, date, read time), then the editorial queue. Published rows link to
// full ArticleDoc pages; queued work stays visibly unpublished — status
// chips, never fake links.

interface PublishedNote {
  n: string;
  slug: string;
  title: string;
  dek: string;
  topic: string;
  date: string;
  read: string;
}

interface QueuedNote {
  n: string;
  title: string;
  dek: string;
  topic: string;
  status: string;
}

const FEATURED = {
  n: "FN·01",
  slug: "/insights/revenue-entropy",
  title: "Revenue entropy: why pipeline problems rarely start in the pipeline",
  dek: "Every founder we audit says some version of the same sentence: “we need more pipeline.” It's almost never the diagnosis — it's the symptom that three different structural failures share, and the treatment for each one is different.",
  topics: ["Diagnostics", "Narrative"],
  date: "June 2026",
  read: "6 min read",
};

const PUBLISHED: PublishedNote[] = [
  {
    n: "FN·02",
    slug: "/insights/the-17-percent-window",
    title: "The 17% window",
    dek: "Buyers spend a sixth of the journey with sales — split across every vendor in the deal. The deal is argued in the other 83%, by people you'll never meet, using whatever words you left them.",
    topic: "Narrative",
    date: "June 2026",
    read: "5 min",
  },
  {
    n: "FN·03",
    slug: "/insights/deliverability-is-infrastructure",
    title: "Deliverability is infrastructure",
    dek: "Before your message can be judged, it has to exist. For a growing share of B2B outbound, it doesn't — it dies in a filter while the dashboard reports it as delivered.",
    topic: "Channels",
    date: "May 2026",
    read: "5 min",
  },
];

const QUEUE: QueuedNote[] = [
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
    status: "Drafting",
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
          <div className="insx-meta-strip" aria-label="Publication details">
            <span className="insx-meta-item">Cadence · as installs teach us</span>
            <span className="insx-meta-div" aria-hidden="true" />
            <span className="insx-meta-item">
              Topics · narrative / channels / intelligence / systems
            </span>
          </div>
        </header>

        {/* ── Featured essay ── */}
        <Link
          href={FEATURED.slug}
          className="insx-featured insx-reveal"
          aria-label={`Read: ${FEATURED.title}`}
        >
          <span className="insx-corner insx-corner-tl" aria-hidden="true" />
          <span className="insx-corner insx-corner-br" aria-hidden="true" />
          <div className="insx-featured-head">
            <span className="insx-num">{FEATURED.n}</span>
            <span className="insx-featured-flag">
              <span className="insx-flag-dot" aria-hidden="true" />
              Featured
            </span>
            <span className="insx-featured-line" aria-hidden="true" />
            <span className="insx-status">
              {FEATURED.date} · {FEATURED.read}
            </span>
          </div>
          <h2 className="insx-featured-title">{FEATURED.title}</h2>
          <p className="insx-featured-dek">{FEATURED.dek}</p>
          <div className="insx-featured-foot">
            <span className="insx-chips">
              {FEATURED.topics.map((t) => (
                <span className="insx-chip" key={t}>{t}</span>
              ))}
            </span>
            <span className="insx-read-cue" aria-hidden="true">
              Read the note <span className="insx-read-arrow">→</span>
            </span>
          </div>
        </Link>

        {/* ── Published notes ── */}
        <section className="insx-ledger" aria-label="Published field notes">
          <div className="insx-group-head insx-reveal">
            <span className="insx-group-label">Published</span>
            <span className="insx-group-line" aria-hidden="true" />
          </div>
          {PUBLISHED.map((note, i) => (
            <Link
              href={note.slug}
              className="insx-row is-link insx-reveal"
              key={note.n}
              style={{ ["--i" as string]: i }}
              aria-label={`Read: ${note.title}`}
            >
              <span className="insx-num">{note.n}</span>
              <span className="insx-row-body">
                <span className="insx-row-title">
                  {note.title}
                  <span className="insx-row-arrow" aria-hidden="true">→</span>
                </span>
                <span className="insx-row-dek">{note.dek}</span>
              </span>
              <span className="insx-chip insx-row-topic">{note.topic}</span>
              <span className="insx-status insx-row-status">
                {note.date} · {note.read}
              </span>
            </Link>
          ))}
        </section>

        {/* ── Editorial queue ── */}
        <section className="insx-ledger" aria-label="Notes in preparation">
          <div className="insx-group-head insx-reveal">
            <span className="insx-group-label is-queue">In the works</span>
            <span className="insx-group-line" aria-hidden="true" />
            <span className="insx-group-note">
              Queued notes ship to the request list first
            </span>
          </div>
          {QUEUE.map((note, i) => (
            <article
              className="insx-row is-queued insx-reveal"
              key={note.n}
              style={{ ["--i" as string]: i }}
            >
              <span className="insx-num">{note.n}</span>
              <span className="insx-row-body">
                <span className="insx-row-title">{note.title}</span>
                <span className="insx-row-dek">{note.dek}</span>
              </span>
              <span className="insx-chip insx-row-topic">{note.topic}</span>
              <span className="insx-status insx-row-status">{note.status}</span>
            </article>
          ))}
        </section>

        {/* ── Foot / conversion ── */}
        <footer className="insx-foot insx-reveal">
          <p className="insx-coda">
            The fastest way to read our thinking is a note. The fastest way to
            use it is the audit.
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
