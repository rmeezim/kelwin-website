"use client";

import { useEffect, useRef, useState } from "react";
import "./FaqSection.css";

/* Objection-handling before the final CTA: the questions founders actually
   ask before booking, answered the way we'd answer on the call. Grounded in
   existing positioning only — no invented numbers, prices, or proof. */
const FAQS: { q: string; a: string }[] = [
  {
    q: "How is this different from hiring a lead generation agency?",
    a: "An agency rents you activity — campaigns, sequences, SDR hours — and the results stop the day the contract does. Kelwin installs infrastructure your team owns: the narrative system, the channel orchestration, and the intelligence layer stay with you, documented in your language and living in your stack.",
  },
  {
    q: "What exactly is the System Audit?",
    a: "A fixed-scope diagnostic that runs ten working days. We map how demand actually moves through your narrative, channels, and data, and name the constraint that's actually holding revenue — which is rarely the thing you've been told to fix. The readout is yours to keep whether or not we ever work together.",
  },
  {
    q: "How long does an install take?",
    a: "The audit readout sets the scope, so we don't quote a number before it. What's fixed is the shape: Diagnose, Architect, and Install run once, in order, and Calibrate becomes a standing cadence — because a revenue system drifts the moment the market moves.",
  },
  {
    q: "Do you replace our team, or work with it?",
    a: "We work through it. The system is installed into how your company already runs — the motions, the words your people use, the way deals actually get decided. Everything is documented so the motion survives team changes instead of living in one person's head.",
  },
  {
    q: "What happens when the engagement ends?",
    a: "The system stays. Six transferable assets — from the Narrative OS to the rebuild sequence — are yours outright, with zero deprecation designed in. If it stops working the day we leave, we built it wrong.",
  },
  {
    q: "How do we know if we're a fit?",
    a: "You're likely a fit if you're past first revenue, your GTM is founder-led or lean, and your deals are decided by committees rather than checkouts. If that's not you — pre-revenue, pure PLG, or shopping for a lead list — the audit will say so plainly. Qualifying in both directions is the point.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Same reveal pattern as the rest of the page: fade rows in on entry.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in"));
      },
      { threshold: 0.15 }
    );
    el.querySelectorAll(".faq-reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section id="faq" className="faq-section" ref={sectionRef}>
      <div className="faq-stage">
        <div className="faq-head faq-reveal">
          <h2 className="faq-heading">
            <span className="line-1">Straight answers,</span>
            <span className="line-2">before the call.</span>
          </h2>
          <p className="faq-lede">
            The questions founders ask before booking — answered the way
            we&apos;d answer them on the call.
          </p>
        </div>

        <div className="faq-list faq-reveal">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq-item${isOpen ? " is-open" : ""}`} key={item.q}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="faq-index">Q·{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-mark" aria-hidden="true" />
                </button>
                <div className="faq-a-wrap" id={`faq-a-${i}`} role="region">
                  <div className="faq-a-inner">
                    <p className="faq-a">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="faq-foot faq-reveal">
          Something we didn&apos;t cover?{" "}
          <a href="mailto:audit@kelwin.co" className="faq-foot-link">
            Ask the founding team directly
          </a>
          {" "}— no sequence, no SDR.
        </p>
      </div>
    </section>
  );
}
