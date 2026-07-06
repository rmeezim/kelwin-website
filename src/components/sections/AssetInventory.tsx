"use client";

import { useEffect, useRef } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import "./AssetInventory.css";

// ─── Asset Inventory — the Transfer Manifest ──────────────────────────────
// "When we leave, the system stays" written like a handover document: a
// manifest ledger of the six artifacts with their format and destination,
// beside a Transfer Terms instrument card. Contract posture, not brochure
// posture — the last thing a visitor reads before the ask is a list of
// what they'd own.

interface Asset {
  index: string;
  title: string;
  desc: string;
  format: string;
}

const ASSETS: Asset[] = [
  {
    index: "A·01",
    title: "Narrative OS",
    desc: "Positioning, language system, and the message hierarchy every channel inherits.",
    format: "Document",
  },
  {
    index: "A·02",
    title: "ICP & Signal Map",
    desc: "Who to reach — and the live signals that say when.",
    format: "Living dataset",
  },
  {
    index: "A·03",
    title: "Channel Playbooks",
    desc: "The plays for email, LinkedIn, phone, content, paid, and events.",
    format: "Playbook set",
  },
  {
    index: "A·04",
    title: "Orchestration Rules",
    desc: "The logic that routes every next-best touch.",
    format: "Routing logic",
  },
  {
    index: "A·05",
    title: "Signal Dashboard",
    desc: "The readouts your GTM decisions run on.",
    format: "Instrumentation",
  },
  {
    index: "A·06",
    title: "Rebuild Sequence",
    desc: "The prioritized plan, re-scored every quarter.",
    format: "Quarterly plan",
  },
];

const TERMS = [
  { label: "Ownership", value: "Yours, outright" },
  { label: "Format", value: "Living documents, in your stack" },
  { label: "Handover", value: "Included — the final phase" },
  { label: "Deprecation risk", value: "Zero", patina: true },
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
      { threshold: 0.12 }
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
            your language. Six artifacts, listed the way they&apos;d appear
            on the handover manifest.
          </p>
        </header>

        <div className="ai-body ai-reveal">
          {/* ── Manifest ledger ── */}
          <div className="ai-manifest">
            <div className="ai-mhead" aria-hidden="true">
              <span>Ref</span>
              <span>Asset</span>
              <span className="ai-mhead-format">Format</span>
              <span className="ai-mhead-to">Transfers to</span>
            </div>
            {ASSETS.map((a, i) => (
              <article
                className="ai-row ai-reveal"
                key={a.index}
                style={{ ["--i" as string]: i }}
              >
                <span className="ai-row-index">{a.index}</span>
                <div className="ai-row-main">
                  <h3 className="ai-row-title">{a.title}</h3>
                  <p className="ai-row-desc">{a.desc}</p>
                </div>
                <span className="ai-row-format">{a.format}</span>
                <span className="ai-row-to">
                  <span className="ai-row-to-mark" aria-hidden="true" />
                  You
                </span>
                <span className="ai-row-sweep" aria-hidden="true" />
              </article>
            ))}
          </div>

          {/* ── Transfer terms ── */}
          <aside className="ai-terms">
            <div className="ai-terms-head">
              <span className="ai-terms-protocol">Transfer Terms</span>
              <span className="ai-terms-line" aria-hidden="true" />
            </div>
            <dl className="ai-terms-list">
              {TERMS.map((t) => (
                <div className="ai-term" key={t.label}>
                  <dt>{t.label}</dt>
                  <dd className={t.patina ? "is-patina" : undefined}>
                    {t.patina && <span className="ai-term-mark" aria-hidden="true" />}
                    {t.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="ai-terms-coda">
              If it stops working the day we leave, we built it wrong.
            </p>
            <ArrowLink href="/audit" label="See what the audit returns" tone="sand" />
          </aside>
        </div>
      </div>
    </section>
  );
}
