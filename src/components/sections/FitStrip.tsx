"use client";

import { useEffect, useRef } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import "./FitStrip.css";

// ─── Fit — the Qualification Gate ─────────────────────────────────────────
// "Not for everyone. By design." made structural: an instrument panel where
// inbound profiles pass one gate. Left, the schematic — five profile wires,
// three deflected to red terminals, two converging through the gate into a
// single patina line that compounds. Right, the ledger: the admit and
// decline criteria in full sentences. Vendors take anyone; partners qualify.

const ADMIT = [
  {
    index: "P·01",
    title: "Past first revenue",
    desc: "Growth is real, just not predictable — there's a working motion to instrument.",
  },
  {
    index: "P·02",
    title: "Ready to own the system",
    desc: "Founder-led or lean GTM teams that want assets, not rented activity.",
  },
  {
    index: "P·03",
    title: "Committee-decided sales",
    desc: "Narrative carries the deal — not a coupon at a checkout.",
  },
];

const DECLINE = [
  {
    index: "D·01",
    title: "Pre-revenue",
    desc: "There's no motion to instrument yet.",
  },
  {
    index: "D·02",
    title: "Pure self-serve / PLG",
    desc: "The system assumes a sales-carried deal.",
  },
  {
    index: "D·03",
    title: "Lead-list shopping",
    desc: "Renting activity is the cycle we exist to end.",
  },
];

/* Gate schematic geometry — five inputs, gate band at x≈226, three
   deflected stubs, two passes converging into one install line. */
const INPUTS = [
  { y: 44,  label: "PRE-REVENUE",       pass: false },
  { y: 108, label: "B2B · POST-REVENUE", pass: true },
  { y: 172, label: "PLG-ONLY",           pass: false },
  { y: 236, label: "FOUNDER-LED GTM",    pass: true },
  { y: 300, label: "LEAD-LIST BUYER",    pass: false },
];

export default function FitStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(".fit-reveal");
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
      { threshold: 0.2 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="fit" className="fitgate" ref={sectionRef}>
      <div className="fg-stage">
        <header className="fg-head fit-reveal">
          <div className="fg-head-top">
            <span className="fg-eyebrow">
              <span className="fg-eyebrow-dash" aria-hidden="true" />
              Fit
            </span>
            <span className="fg-meta">Qualification · strict</span>
          </div>
          <h2 className="fg-heading">
            <span className="line-1">Not for everyone.</span>{" "}
            <span className="line-2">By design.</span>
          </h2>
          <p className="fg-lede">
            A revenue system only compounds inside a company built to carry
            it. So every profile passes one gate before we say yes — and the
            gate works in both directions.
          </p>
        </header>

        <div className="fg-panel fit-reveal">
          <div className="fg-panel-head">
            <span className="fg-protocol">Qualification Gate</span>
            <span className="fg-panel-line" aria-hidden="true" />
            <span className="fg-stamp">Fit criteria · v1.0</span>
          </div>

          <div className="fg-grid">
            {/* ── Schematic ── */}
            <figure className="fg-diagram" aria-label="Qualification gate schematic: five inbound profiles, three declined, two admitted and converging into one installed system">
              <svg viewBox="0 0 460 344" className="fg-svg" aria-hidden="true">
                {/* input terminals + labels + inbound wires */}
                {INPUTS.map((p) => (
                  <g key={p.label}>
                    <rect
                      className="fg-in-term"
                      x="6"
                      y={p.y - 3.5}
                      width="7"
                      height="7"
                    />
                    <text className={`fg-label${p.pass ? "" : " is-declined"}`} x="16" y={p.y - 9}>
                      {p.label}
                    </text>
                    <path className="fg-wire" pathLength={1} d={`M14 ${p.y} H 224`} />
                  </g>
                ))}

                {/* gate band */}
                <g className="fg-gate">
                  <path className="fg-gate-line" d="M226 22 V 322" />
                  <path className="fg-gate-line" d="M240 22 V 322" />
                  {/* corner ticks */}
                  <path className="fg-gate-tick" d="M220 22 h26 M220 322 h26" />
                  <text className="fg-gate-label" x="233" y="14">GATE</text>
                </g>

                {/* declined stubs → red × terminals */}
                {INPUTS.filter((p) => !p.pass).map((p) => (
                  <g key={`x-${p.y}`}>
                    <path className="fg-wire-declined" pathLength={1} d={`M240 ${p.y} h 26`} />
                    <g className="fg-x" transform={`translate(274, ${p.y})`}>
                      <path d="M-4 -4 L4 4 M4 -4 L-4 4" />
                    </g>
                  </g>
                ))}

                {/* passing wires converge into the install line */}
                <path
                  className="fg-wire-pass"
                  pathLength={1}
                  d="M240 108 H 302 L 342 172 H 428"
                />
                <path
                  className="fg-wire-pass"
                  pathLength={1}
                  d="M240 236 H 302 L 342 172"
                />
                {/* travelling packet on the install line */}
                <path className="fg-flow" d="M240 108 H 302 L 342 172 H 428" />

                {/* install terminal */}
                <rect
                  className="fg-out-term"
                  x="428"
                  y="166"
                  width="11"
                  height="11"
                  transform="rotate(45 433.5 171.5)"
                />
                <text className="fg-label is-pass" x="428" y="196" textAnchor="end">
                  INSTALL · COMPOUNDS
                </text>
              </svg>
              <figcaption className="fg-caption">
                Illustrative — the profiles we decline, and the one path that
                compounds.
              </figcaption>
            </figure>

            {/* ── Ledger ── */}
            <div className="fg-ledger">
              <div className="fg-group">
                <span className="fg-group-label is-admit">Admit</span>
                <ul className="fg-list">
                  {ADMIT.map((c) => (
                    <li className="fg-row" key={c.index}>
                      <span className="fg-row-index">{c.index}</span>
                      <span className="fg-mark-yes" aria-hidden="true" />
                      <span className="fg-row-body">
                        <span className="fg-row-title">{c.title}</span>
                        <span className="fg-row-desc">{c.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="fg-group">
                <span className="fg-group-label is-decline">Decline</span>
                <ul className="fg-list">
                  {DECLINE.map((c) => (
                    <li className="fg-row is-declined" key={c.index}>
                      <span className="fg-row-index">{c.index}</span>
                      <span className="fg-mark-no" aria-hidden="true" />
                      <span className="fg-row-body">
                        <span className="fg-row-title">{c.title}</span>
                        <span className="fg-row-desc">{c.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <footer className="fg-verdict">
            <p className="fg-coda">Qualification runs in both directions.</p>
            <p className="fg-note">
              If we&apos;re not the right instrument, the audit readout says
              so — that&apos;s the point of it.
            </p>
            <ArrowLink href="/audit" label="Sound like you? Start with the audit" tone="sand" />
          </footer>
        </div>
      </div>
    </section>
  );
}
