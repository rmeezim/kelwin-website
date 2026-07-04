"use client";

import { useEffect, useRef, useState } from "react";
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
      "We start by finding what's actually broken. It's rarely the thing you've been told to fix; most teams are busy optimizing a symptom a few steps downstream of the real constraint.",
    output: "The real constraint, named — and the case for fixing it first.",
  },
  {
    n: "02",
    title: "Architect",
    method:
      "Then we design the system that decides what you build and what you ignore: the category you'll own, the language you'll use, the model the company runs on. Most firms skip this part. Most decks only gesture at it.",
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

const AUTOPLAY_MS = 3800;

export default function Methodology() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // Reveal-on-enter + drive autoplay only while the section is on screen.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView(e.isIntersecting)),
      { threshold: 0.35 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Autoplay: the console cycles through phases on its own until the user
  // takes over (hover/focus/click), then it stays put. `interacted` is state
  // so this effect re-runs and clears the interval the moment the user acts —
  // a ref alone would leave the stale interval ticking. Off for reduced motion.
  useEffect(() => {
    if (!inView || interacted) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % PHASES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [inView, interacted]);

  const select = (i: number) => {
    setInteracted(true);
    setActive(i);
  };

  const phase = PHASES[active];
  const af = active / (PHASES.length - 1);

  return (
    <section id="methodology" className="method-section" ref={sectionRef}>
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
                onMouseEnter={() => select(i)}
                onFocus={() => select(i)}
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

        <div className="method-cta-row">
          <DiagnosticMethodCTA href="/methodology" label="View the full methodology" variant="signal" />
        </div>
      </div>
    </section>
  );
}
