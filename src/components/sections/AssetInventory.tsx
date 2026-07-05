"use client";

import { useEffect, useRef } from "react";
import "./AssetInventory.css";

// ─── Asset Inventory — "When we leave, the system stays." ─────────────────
// The claim "the asset is yours" made tangible: six artifacts a buyer can
// picture owning, shelved as specimen dossiers. Sits directly before the
// final CTA — the last thing a visitor sees before the ask is the concrete
// inventory of what they'd own.

interface Asset {
  index: string;
  title: string;
  desc: string;
}

const ASSETS: Asset[] = [
  {
    index: "A·01",
    title: "Narrative OS",
    desc: "Positioning, language system, and the message hierarchy every channel inherits.",
  },
  {
    index: "A·02",
    title: "ICP & Signal Map",
    desc: "Who to reach — and the live signals that say when.",
  },
  {
    index: "A·03",
    title: "Channel Playbooks",
    desc: "The plays for email, LinkedIn, phone, content, paid, and events.",
  },
  {
    index: "A·04",
    title: "Orchestration Rules",
    desc: "The logic that routes every next-best touch.",
  },
  {
    index: "A·05",
    title: "Signal Dashboard",
    desc: "The readouts your GTM decisions run on.",
  },
  {
    index: "A·06",
    title: "Rebuild Sequence",
    desc: "The prioritized plan, re-scored every quarter.",
  },
];

export default function AssetInventory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(".ai-reveal");
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
    <section id="assets" className="assetinv" ref={sectionRef}>
      <div className="ai-stage">
        <header className="ai-head ai-reveal">
          <div className="ai-head-top">
            <span className="ai-eyebrow">
              <span className="ai-eyebrow-dash" aria-hidden="true" />
              The Asset Inventory
            </span>
            <span className="ai-meta">Transfer · complete</span>
          </div>
          <h2 className="ai-heading">
            <span className="line-1">When we leave,</span>{" "}
            <span className="line-2">the system stays.</span>
          </h2>
          <p className="ai-sub">
            Everything we install lives in your stack and is documented in
            your language. Six artifacts, yours outright.
          </p>
        </header>

        <div className="ai-grid">
          {ASSETS.map((a, i) => (
            <article
              className="ai-card ai-reveal"
              key={a.index}
              style={{ ["--i" as string]: i }}
            >
              <span className="ai-bracket ai-bracket-tl" aria-hidden="true" />
              <span className="ai-bracket ai-bracket-br" aria-hidden="true" />
              <div className="ai-card-top">
                <span className="ai-index">{a.index}</span>
                {/* dossier glyph — a document with a folded corner */}
                <svg className="ai-glyph" viewBox="0 0 20 24" aria-hidden="true">
                  <path d="M1 1 H 13 L 19 7 V 23 H 1 Z" />
                  <path d="M13 1 V 7 H 19" />
                  <line x1="5" y1="12" x2="15" y2="12" />
                  <line x1="5" y1="16" x2="12" y2="16" />
                </svg>
              </div>
              <h3 className="ai-title">{a.title}</h3>
              <p className="ai-desc">{a.desc}</p>
            </article>
          ))}
        </div>

        <div className="ai-foot ai-reveal">
          <p className="ai-coda">
            If it stops working the day we leave, we built it wrong.
          </p>
          <span className="ai-foot-meta">
            Asset transfer · Complete &nbsp;·&nbsp; Deprecation risk · Zero
          </span>
        </div>
      </div>
    </section>
  );
}
