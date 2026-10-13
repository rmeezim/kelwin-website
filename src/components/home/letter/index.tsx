import Link from "next/link";
import type { CSSProperties } from "react";
import "./letter.css";

/* 04 · letter — Memo K-000, signed (approved mockup: design/redesign/site/frag/letter/S).
   The page's first pattern interrupt: the founder's memo set as a signed letter in type alone, with
   the movie it describes itemised in the margin in the reader's own symptoms (numbered 01–06 exactly
   as the handover numbers them). No drawing, no title block, no stamp, no rule.
   Grid (1440 stage): label row 1–12 · memo keys hang in col 1 · the letter reads in cols 2–8 ·
   col 9 is air · the margin sits in cols 10–12, top-aligned with paragraph 1.
   DOM order is the small-screen reading order: P1, P2, the margin, P3, signature, P.S.
   The markup is the final, resting state; ./behavior.ts plays the line-by-line reading entrance. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

const SYMPTOMS = [
  "The founder writes every message",
  "Dependent on the agency",
  "Random outbound activity",
  "SDRs chase raw volume",
  "No idea why replies stay low",
  "Campaigns reset every month",
];

const NOTES = [
  { href: "/insights/revenue-entropy", title: "Revenue entropy", meta: "June 2026 · 3 min" },
  { href: "/insights/the-17-percent-window", title: "The 17% window", meta: "June 2026 · 2 min" },
  { href: "/insights/deliverability-is-infrastructure", title: "Deliverability is infrastructure", meta: "May 2026 · 2 min" },
];

export default function Letter() {
  return (
    <section className="km km-letter ac-sec" data-surface="dark" aria-labelledby="km-letter-h">
      <div className="ac-wrap ac-grid km-letter__g">
        <div className="ac-labelrow km-letter__labelrow">
          <p className="ac-label">From the founder</p>
          <p className="ac-meta">Memo K-000</p>
        </div>

        <p className="ac-cap km-letter__key km-letter__key--subj">Subject</p>
        <h2 className="ac-h3 ac-h3--lg km-letter__subj" id="km-letter-h">
          <span className="ac-line">
            <span>Why Kelwin exists</span>
          </span>
        </h2>

        <p className="km-letter__p km-letter__p--1">I started Kelwin after watching the same movie too many times: a good company, a real product, a founder writing every important email themselves at 11pm&nbsp;— hiring an agency, getting a quarter of activity, and ending up exactly where they started, minus the budget.</p>
        <p className="km-letter__p km-letter__p--2">Nobody in that movie is lazy. The problem is structural: the learning leaves with the vendor, the language never gets written down, and every quarter starts from zero. So we built the firm we kept wishing existed&nbsp;— one that installs the system, then hands you the keys.</p>

        <div className="km-letter__margin" role="group" aria-labelledby="km-letter-m">
          <p className="ac-label ac-label--plain km-letter__mlabel" id="km-letter-m">
            Told from inside
          </p>
          <p className="km-letter__mcap">You’ve got SDRs, sequences, a tech stack that cost real money&nbsp;— and a pipeline chart that’s been flat for four quarters.</p>
          <ol className="km-letter__sym">
            {SYMPTOMS.map((s, i) => (
              <li key={s} style={v({ "--i": i })}>
                <span className="ac-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="km-letter__symt">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="km-letter__p km-letter__p--3">If you write to us, a person answers. That isn’t a feature. That’s&nbsp;the&nbsp;point.</p>

        <div className="km-letter__sign">
          <span className="km-letter__dash" aria-hidden="true" />
          <Link className="km-letter__name" href="/about">
            Rameez
          </Link>
          <p className="km-letter__role">Founder, Kelwin</p>
          <p className="km-letter__role">Founded 2026&nbsp;— deliberately late to the category.</p>
        </div>

        <p className="ac-cap km-letter__key km-letter__key--ps">P.S.</p>
        <div className="km-letter__ps">
          <Link className="ac-link km-letter__write" href="/contact">
            Write to the founding team
            <span className="km-letter__hit" aria-hidden="true" />
          </Link>
          <p className="ac-label ac-label--plain km-letter__nlabel" id="km-letter-n">
            Field notes, published
          </p>
          <ul className="km-letter__notes" aria-labelledby="km-letter-n">
            {NOTES.map((n, i) => (
              <li key={n.href} style={v({ "--i": i })}>
                <Link href={n.href}>
                  <span className="km-letter__nt">{n.title}</span>
                  <span className="ac-cap km-letter__nm">{n.meta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
