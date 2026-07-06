"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import "./Methodology.css";

interface Phase {
  n: string;
  title: string;
  method: string;
  output: string;
}

// Copy preserved verbatim from the previous phase list.
const PHASES: Phase[] = [
  {
    n: "01",
    title: "Diagnose",
    method:
      "We start by finding what's actually broken. It's rarely the thing you've been told to fix — most teams are optimizing a symptom downstream of the real constraint.",
    output: "The real constraint, named — and the case for fixing it first.",
  },
  {
    n: "02",
    title: "Architect",
    method:
      "Then we design the system that decides what you build and what you ignore — the category you'll own, the language you'll use, the model the company runs on. Most firms skip this part.",
    output: "Your category defined, and the operating model written down.",
  },
  {
    n: "03",
    title: "Install",
    method:
      "Architecture that lives in a slide changes nothing. So we wire the system into how the company runs day to day — the motions, the words people actually use, the way a deal gets decided on a Tuesday.",
    output: "A working operating layer, in use across the team.",
  },
  {
    n: "04",
    title: "Calibrate",
    method:
      "A revenue system drifts the moment the market moves. So we stay on the signal — watching what's working, retuning what slips, and keeping your language ahead of the category.",
    output: "A standing signal review, and a system that keeps compounding.",
  },
];

export default function Methodology() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // Scroll drives the active phase. On desktop the section is a tall
  // runway with a sticky stage: the panel holds on screen while the four
  // phases tick through with scroll, then releases — no more content
  // drifting out of view mid-phase. On mobile (no pin) the old in-view
  // progress mapping applies. Hover/click/keyboard still jump phases;
  // reduced motion opts out and leaves the nodes operable as tabs.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const toIdx = (progress: number) =>
      Math.min(PHASES.length - 1, Math.max(0, Math.floor(progress * PHASES.length)));

    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const idx = toIdx(self.progress);
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
      return () => st.kill();
    });
    mm.add("(max-width: 900px)", () => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onUpdate: (self) => {
          const idx = toIdx(self.progress);
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  const select = (i: number) => setActive(i);

  const phase = PHASES[active];
  const af = active / (PHASES.length - 1);

  return (
    <section id="methodology" className="method-section" ref={sectionRef}>
      <div className="method-pin">
      <div className="method-stage">
        <div className="scaffold-row">
          <h2 className="scaffold-heading">
            <span className="line-1">How we install the system.</span>
            <span className="line-2">And how we keep it sharp.</span>
          </h2>
          <div className="scaffold-right">
            <p className="scaffold-body">
              The first three run once, in order. The fourth keeps running — a
              system left alone drifts the moment the market moves.
              <span className="coda">A system, not a project.</span>
            </p>
          </div>
          {/* Conversion path: the methodology convinces — the audit is
              step one, so the action sits with the argument. */}
          <div className="method-cta-row">
            <DiagnosticMethodCTA
              href="/audit"
              label="Begin with the audit"
              variant="signal"
            />
          </div>
        </div>

        {/* Signal pipeline — subway-map flow of the four phases. */}
        <div className={`mflow ${active === 3 ? "is-looping" : ""}`}>
          <div className="mflow-line" aria-hidden="true" style={{ ["--af" as string]: af }}>
            <span className="mflow-rail" />
            <span className="mflow-fill" />
            <span className="mflow-pulse" />
            {/* Feedback loop 04 → 01: the system never stops calibrating. */}
            <svg className="mflow-fb" viewBox="0 0 100 44" preserveAspectRatio="none">
              <path
                className="mflow-fb-path"
                d="M100 3 C 100 40, 0 40, 0 3"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className="mflow-fb-head"
                d="M-3 9 L0 3 L3 9"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="mflow-fb-label">Continuous</span>
          </div>

          <div className="mflow-nodes" role="tablist" aria-label="Methodology phases">
            {PHASES.map((p, i) => (
              <button
                key={p.n}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`mnode ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
                onClick={() => select(i)}
              >
                <span className="mnode-label">
                  <span className="mnode-num">{p.n}</span>
                  <span className="mnode-title">{p.title}</span>
                </span>
                <span className="mnode-dot" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {/* Synced readout — only the active phase's detail is shown. */}
        <div className="mdetail" key={active}>
          <span className="mdetail-ghost" aria-hidden="true">{phase.n}</span>
          <div className="mdetail-main">
            <span className="mdetail-kicker">
              Phase {phase.n} · <strong>{phase.title}</strong>
            </span>
            <p className="mdetail-method">{phase.method}</p>
          </div>
          <div className="mdetail-output">
            <span className="mdetail-output-label">Output</span>
            <span className="mdetail-output-value">{phase.output}</span>
          </div>
        </div>

      </div>
      </div>
    </section>
  );
}
