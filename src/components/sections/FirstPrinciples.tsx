"use client";

import { useEffect, useRef } from "react";
import "./FirstPrinciples.css";

interface Principle {
  tag: string;
  title: string;
  support: string;
  ledger: [{ label: string; value: string }, { label: string; value: string }];
  glyph: React.ReactNode;
}

const G_STROKE = "currentColor";
const G_WIDTH = 1.4;

const Glyph = {
  infrastructure: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <line x1="4" y1="3" x2="4" y2="20" />
      <line x1="9" y1="3" x2="9" y2="20" />
      <line x1="14" y1="3" x2="14" y2="20" />
      <line x1="19" y1="3" x2="19" y2="20" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  category: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="3" width="18" height="18" />
      <rect x="7" y="7" width="10" height="10" />
      <rect x="11" y="11" width="2" height="2" fill={G_STROKE} stroke="none" />
    </svg>
  ),
  ownership: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="8" r="4" />
      <line x1="12" y1="12" x2="12" y2="20" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  ),
  defensibility: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <path d="M12 3 L4 6 L4 13 C 4 17, 8 20, 12 21 C 16 20, 20 17, 20 13 L 20 6 Z" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
  precision: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  ),
  advocacy: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <path d="M3 5 L 21 5 L 21 16 L 13 16 L 9 20 L 9 16 L 3 16 Z" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="12" x2="14" y2="12" />
    </svg>
  ),
};

const DATA: Principle[] = [
  {
    tag: "Infrastructure",
    title: "Revenue is infrastructure, not activity.",
    support:
      "Most companies rebuild their pipeline from scratch every quarter. We build the part that carries forward.",
    ledger: [
      { label: "Asset class", value: "Structural" },
      { label: "Half-life",   value: "Permanent" },
    ],
    glyph: Glyph.infrastructure,
  },
  {
    tag: "Category",
    title: "You don’t enter a category. You define one.",
    support:
      "Compete inside a category someone else built and you’re always the alternative. We’d rather you set the standard.",
    ledger: [
      { label: "Position",     value: "Defining" },
      { label: "Market entry", value: "Original" },
    ],
    glyph: Glyph.category,
  },
  {
    tag: "Ownership",
    title: "The asset is yours.",
    support:
      "What we build, you keep — system, language, playbook. If it stops working the day we leave, we built it wrong.",
    ledger: [
      { label: "Asset transfer",     value: "Complete" },
      { label: "Deprecation risk",   value: "Zero"     },
    ],
    glyph: Glyph.ownership,
  },
  {
    tag: "Defensibility",
    title: "Clarity is the moat.",
    support:
      "Anyone can copy your features by next quarter. No one copies being the company a buyer understands in one sentence.",
    ledger: [
      { label: "Moat type",        value: "Clarity" },
      { label: "Replication cost", value: "∞"   },
    ],
    glyph: Glyph.defensibility,
  },
  {
    tag: "Precision",
    title: "Precision is the multiplier — not reach.",
    support:
      "Sending twice as much rarely closes twice as much — it just trains the market to ignore you. We do less, aimed sharper.",
    ledger: [
      { label: "Compression",     value: "12:1"  },
      { label: "Reach efficiency", value: "0.84" },
    ],
    glyph: Glyph.precision,
  },
  {
    tag: "Advocacy",
    title: "Build for the room you’re not in.",
    support:
      "The deal is won later — in a room you’ll never enter, when one person repeats your case to the people who sign.",
    ledger: [
      { label: "Decision room",     value: "Remote"      },
      { label: "Signal half-life",  value: "Multi-cycle" },
    ],
    glyph: Glyph.advocacy,
  },
];

// One dark world: the six principles render as a systematic hairline
// ledger — no pin, no card deck. Each row reveals once on entry via an
// IntersectionObserver; interaction is a quiet red live-edge on hover.
export default function FirstPrinciples() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(".pr-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="principles" className="principles-section" ref={sectionRef}>
      <div className="pr-stage">
        <header className="pr-head pr-reveal">
          <div className="pr-head-top">
            <span className="pr-eyebrow">
              <span className="pr-eyebrow-dash" aria-hidden="true"></span>
              Operating Principles
            </span>
            <span className="pr-head-meta">06 Principles · V2.4</span>
          </div>
          <h2 className="pr-heading">
            <span className="line-1">One operating system.</span>
            <span className="line-2">Six core principles.</span>
          </h2>
        </header>

        <ol className="pr-list">
          {DATA.map((d, i) => (
            <li
              className="pr-row pr-reveal"
              key={d.tag}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <div className="pr-index">
                <span className="pr-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="pr-glyph" aria-hidden="true">{d.glyph}</span>
              </div>
              <div className="pr-main">
                <span className="pr-tag">{d.tag}</span>
                <h3 className="pr-title">{d.title}</h3>
              </div>
              <p className="pr-support">{d.support}</p>
              <dl className="pr-ledger">
                {d.ledger.map((cell) => (
                  <div key={cell.label} className="pr-ledger-cell">
                    <dt className="pr-ledger-label">{cell.label}</dt>
                    <dd className="pr-ledger-value">{cell.value}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
