"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import "./FitStrip.css";

// ─── Fit strip — "Not for everyone. By design." ───────────────────────────
// A compact self-qualification band: three lines each side, so a cold
// visitor knows in five seconds whether this page is for them. Saying who
// it's NOT for is the positioning move — vendors take anyone; partners
// qualify. Mirrors the FIT row on /audit at homepage-skim level.

const BUILT_FOR = [
  "B2B companies past first revenue — growth is real, just not predictable",
  "Founder-led or lean GTM teams ready to own the system, not rent activity",
  "Complex sales, where a committee decides and narrative carries the deal",
];

const NOT_FOR = [
  "Pre-revenue startups",
  "Pure self-serve / PLG motions",
  "Anyone shopping for a lead list",
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
      { threshold: 0.25 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="fit" className="fitstrip" ref={sectionRef}>
      <div className="fit-stage">
        <div className="fit-grid">
          <header className="fit-head fit-reveal">
            <div className="fit-head-top">
              <span className="fit-eyebrow">
                <span className="fit-eyebrow-dash" aria-hidden="true" />
                Fit
              </span>
              <span className="fit-meta">Qualification · strict</span>
            </div>
            <h2 className="fit-heading">
              <span className="line-1">Not for everyone.</span>{" "}
              <span className="line-2">By design.</span>
            </h2>
            <Link className="fit-link" href="/audit">
              Sound like you? Start with the audit
              <span aria-hidden="true">→</span>
            </Link>
          </header>

          <div className="fit-cols fit-reveal">
            <div className="fit-col">
              <span className="fit-col-label">Built for</span>
              <ul className="fit-list">
                {BUILT_FOR.map((item) => (
                  <li className="fit-item" key={item}>
                    <span className="fit-mark fit-mark-yes" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="fit-col">
              <span className="fit-col-label fit-col-label-not">Not for</span>
              <ul className="fit-list">
                {NOT_FOR.map((item) => (
                  <li className="fit-item fit-item-not" key={item}>
                    <span className="fit-mark fit-mark-no" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
