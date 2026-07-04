"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import "./Methodology.css";

export default function Methodology() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const sectionMaybe = sectionRef.current;
    if (!sectionMaybe) return;
    const section: HTMLElement = sectionMaybe;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const flow = section.querySelector<HTMLElement>("#methodFlow");
    if (flow) flow.classList.add("armed");

    const ctx = gsap.context(() => {
      gsap.set([".scaffold-heading", ".scaffold-right"], { y: 26, opacity: 0 });
      gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 74%", once: true },
      }).to([".scaffold-heading", ".scaffold-right"], {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });

      // Spine scroll-draws topward to bottom, scrubbed.
      gsap.set("#spineFill", { scaleY: 0, transformOrigin: "top center" });
      gsap.to("#spineFill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".method-spine",
          start: "top center",
          end: "bottom center",
          scrub: 0.4,
        },
      });

      // Each phase fades in + lights its node as it arrives.
      gsap.utils.toArray<HTMLElement>(".phase").forEach((ph) => {
        gsap.set(ph, { opacity: 0, y: 12 });
        ScrollTrigger.create({
          trigger: ph,
          start: "top 84%",
          once: true,
          onEnter: () => {
            gsap.to(ph, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
            ph.classList.add("is-in");
          },
        });
      });

      gsap.set(".method-cta-row", { opacity: 0, y: 12 });
      ScrollTrigger.create({
        trigger: ".method-cta-row",
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(".method-cta-row", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cursor tracking for the per-phase ghost-word overlay. Each phase
  // has a giant translucent word (DIAGNOSE / ARCHITECT / INSTALL /
  // CALIBRATE) that follows the cursor when the phase is hovered. We
  // set `--ghost-x` / `--ghost-y` (the cursor position relative to
  // the phase's top-left corner) on the phase element; the ghost-word
  // element reads them via CSS transform with a transition for the
  // smooth "spring lag" follow.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const phases = section.querySelectorAll<HTMLElement>(".phase");
    const cleanups: Array<() => void> = [];

    phases.forEach((phase) => {
      const onMove = (e: MouseEvent) => {
        const rect = phase.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        phase.style.setProperty("--ghost-x", `${x}px`);
        phase.style.setProperty("--ghost-y", `${y}px`);
      };
      phase.addEventListener("mousemove", onMove);
      cleanups.push(() => phase.removeEventListener("mousemove", onMove));
    });

    return () => cleanups.forEach((c) => c());
  }, []);

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
              The first three run once, in order. The fourth keeps running — a system left alone drifts the moment the market moves.
              <span className="coda">A system, not a project.</span>
            </p>
          </div>
        </div>

        <div className="method-flow" id="methodFlow">
          <div className="method-spine">
            <span className="spine-track"></span>
            <span className="spine-fill" id="spineFill"></span>
          </div>

          <article className="phase" data-i="0">
            <span className="phase-ghost-word" aria-hidden="true">DIAGNOSE</span>
            <span className="phase-node"></span>
            <div className="phase-index">
              <span className="phase-kicker">Phase</span>
              <span className="phase-num">01</span>
            </div>
            <div className="phase-body">
              <h3 className="phase-title">Diagnose</h3>
              <p className="phase-method">
                We start by finding what&apos;s actually broken. It&apos;s rarely the thing you&apos;ve been told to fix; most teams are busy optimizing a symptom a few steps downstream of the real constraint.
              </p>
            </div>
            <div className="phase-output">
              <span className="phase-output-label">Output</span>
              <span className="phase-output-value">The real constraint, named — and the case for fixing it first.</span>
            </div>
            <span className="phase-corner phase-corner-tr" aria-hidden="true"></span>
            <span className="phase-corner phase-corner-br" aria-hidden="true"></span>
          </article>

          <article className="phase" data-i="1">
            <span className="phase-ghost-word" aria-hidden="true">ARCHITECT</span>
            <span className="phase-node"></span>
            <div className="phase-index">
              <span className="phase-kicker">Phase</span>
              <span className="phase-num">02</span>
            </div>
            <div className="phase-body">
              <h3 className="phase-title">Architect</h3>
              <p className="phase-method">
                Then we design the system that decides what you build and what you ignore: the category you&apos;ll own, the language you&apos;ll use, the model the company runs on. Most firms skip this part. Most decks only gesture at it.
              </p>
            </div>
            <div className="phase-output">
              <span className="phase-output-label">Output</span>
              <span className="phase-output-value">Your category defined, and the operating model written down.</span>
            </div>
            <span className="phase-corner phase-corner-tr" aria-hidden="true"></span>
            <span className="phase-corner phase-corner-br" aria-hidden="true"></span>
          </article>

          <article className="phase" data-i="2">
            <span className="phase-ghost-word" aria-hidden="true">INSTALL</span>
            <span className="phase-node"></span>
            <div className="phase-index">
              <span className="phase-kicker">Phase</span>
              <span className="phase-num">03</span>
            </div>
            <div className="phase-body">
              <h3 className="phase-title">Install</h3>
              <p className="phase-method">
                Architecture that lives in a slide changes nothing. So we wire the system into how the company runs day to day — the motions, the words people actually use, the way a deal gets decided on a Tuesday.
              </p>
            </div>
            <div className="phase-output">
              <span className="phase-output-label">Output</span>
              <span className="phase-output-value">A working operating layer, in use across the team.</span>
            </div>
            <span className="phase-corner phase-corner-tr" aria-hidden="true"></span>
            <span className="phase-corner phase-corner-br" aria-hidden="true"></span>
          </article>

          <article className="phase" data-i="3">
            <span className="phase-ghost-word" aria-hidden="true">CALIBRATE</span>
            <span className="phase-node"></span>
            <div className="phase-index">
              <span className="phase-kicker">Phase</span>
              <span className="phase-num">04</span>
            </div>
            <div className="phase-body">
              <h3 className="phase-title">Calibrate</h3>
              <p className="phase-method">
                A revenue system drifts the moment the market moves. So we stay on the signal — watching what&apos;s working, retuning what slips, and keeping your language ahead of the category.
              </p>
            </div>
            <div className="phase-output">
              <span className="phase-output-label">Output</span>
              <span className="phase-output-value">A standing signal review, and a system that keeps compounding.</span>
            </div>
            <span className="phase-corner phase-corner-tr" aria-hidden="true"></span>
            <span className="phase-corner phase-corner-br" aria-hidden="true"></span>
          </article>
        </div>

        <div className="method-cta-row">
          <DiagnosticMethodCTA href="/methodology" label="View the full methodology" variant="signal" />
        </div>

      </div>
    </section>
  );
}
