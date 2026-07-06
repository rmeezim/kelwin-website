"use client";

import { useEffect, useRef } from "react";
import HeroCTA from "@/components/ui/HeroCTA";
import "./AuditSpec.css";

// ─── The System Audit — the offer as a visible product ────────────────────
// Per the site audit: don't just ask for the audit, show it. This section is
// the landing target for every "#audit" CTA on the page (hero, navbar, final
// band) and answers, in one screen: what it covers, what you provide, what
// you receive, how long it takes, who it's for, and what happens after.
//
// [EDIT ME] All specifics below are PLACEHOLDERS pending real offer facts —
// each is marked. Swap in the real scope/timeline/artifacts/contact before
// pushing hard on cold traffic.

interface SpecRow {
  n: string;
  label: string;
  body: React.ReactNode;
}

const ROWS: SpecRow[] = [
  {
    n: "01",
    label: "Scope",
    body: (
      <>
        The three layers under your revenue: how your market repeats your
        story, how demand actually moves across your channels, and what your
        GTM decisions are based on.
      </>
    ),
  },
  {
    n: "02",
    label: "You provide",
    body: (
      // [EDIT ME] placeholder inputs — confirm real session count + access
      <>
        Two 90‑minute working sessions and read‑only access to your CRM and
        channel stack. No prep decks, no homework.
      </>
    ),
  },
  {
    n: "03",
    label: "You receive",
    body: (
      // [EDIT ME] placeholder artifacts — confirm the real deliverable list
      <>
        A written diagnostic — narrative readout, channel orchestration map,
        intelligence gap report — and a sequenced rebuild plan.{" "}
        <em className="as-em">Yours to keep, either way.</em>
      </>
    ),
  },
  {
    n: "04",
    label: "Timeline",
    body: (
      // [EDIT ME] placeholder timeline — confirm real duration
      <>Ten working days, kickoff to readout. Fixed scope, fixed end date.</>
    ),
  },
  {
    n: "05",
    label: "Fit",
    body: (
      // [EDIT ME] placeholder ICP — sharpen to the real target profile
      <>
        For B2B teams past first revenue whose growth is real but not
        predictable. Not for pre‑revenue startups, pure self‑serve motions,
        or anyone shopping for a lead list.
      </>
    ),
  },
  {
    n: "06",
    label: "After",
    body: (
      <>
        A 60‑minute readout call. If installation makes sense, we scope it
        there. If not, the plan is still yours.
      </>
    ),
  },
];

export default function AuditSpec() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(".as-reveal");
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
    <section id="audit" className="auditspec" ref={sectionRef}>
      <div className="as-stage">
        <div className="as-grid">
          {/* ── Left: what this is + the action ── */}
          <div className="as-intro as-reveal">
            <div className="as-head-top">
              <span className="as-eyebrow">
                <span className="as-eyebrow-dash" aria-hidden="true" />
                The System Audit
              </span>
              <span className="as-meta">Audit/Spec · v1.0</span>
            </div>
            <h2 className="as-heading">
              <span className="line-1">Not a sales call.</span>{" "}
              <span className="line-2">A diagnostic with a deliverable.</span>
            </h2>
            <p className="as-sub">
              This is what happens when you request the audit — fixed scope,
              fixed timeline, and a readout you keep whether or not we go
              further.
            </p>

            {/* [EDIT ME] placeholder contact — swap for the real booking
                link (Cal.com / email) before outbound pushes. Uses the
                site-wide primary CTA (style #1). */}
            <div className="as-cta-row">
              <HeroCTA
                label="REQUEST THE AUDIT"
                href="mailto:audit@kelwin.co?subject=System%20Audit%20Request"
              />
              <span className="as-cta-note">
                Goes straight to the founding team — no sequence, no SDR.
              </span>
            </div>
          </div>

          {/* ── Right: the spec sheet ── */}
          <div className="as-sheet as-reveal">
            <span className="as-sheet-bracket as-sheet-tl" aria-hidden="true" />
            <span className="as-sheet-bracket as-sheet-br" aria-hidden="true" />
            {ROWS.map((row) => (
              <div className="as-row" key={row.n}>
                <div className="as-row-key">
                  <span className="as-row-n">{row.n}</span>
                  <span className="as-row-label">{row.label}</span>
                </div>
                <p className="as-row-body">{row.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
