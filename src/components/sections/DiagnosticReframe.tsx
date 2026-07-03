"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "motion/react";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import "./DiagnosticReframe.css";

interface LogEntry {
  time: string;
  code: string;
  value: string;
  id: number;
}

// Diagnostic stream entries — cycled every ~2.4s as ambient "the system
// is actively analyzing your GTM architecture" telemetry. Mix of section-
// thematic codes (narrative/outbound/intelligence) and generic metrics.
const LOG_ENTRIES: Omit<LogEntry, "id">[] = [
  { time: "14:23:47", code: "SCAN.SURFACE",          value: "OK" },
  { time: "14:23:50", code: "MAP.ARCHITECTURE",      value: "3 LAYERS" },
  { time: "14:23:52", code: "ENTROPY.DELTA",         value: "+0.024" },
  { time: "14:23:55", code: "NARRATIVE.AUDIT",       value: "COMPLETE" },
  { time: "14:23:58", code: "OUTBOUND.PROTOCOL",     value: "NOMINAL" },
  { time: "14:24:01", code: "GTM.INTEL.SAMPLED",     value: "247 NODES" },
  { time: "14:24:04", code: "STRUCTURAL.SCAN",       value: "LIVE" },
  { time: "14:24:07", code: "SIGNAL.FIDELITY",       value: "89.3%" },
  { time: "14:24:10", code: "COHERENCE.INDEX",       value: "0.847" },
  { time: "14:24:13", code: "DIAGNOSTIC.LAYER",      value: "ACTIVE" },
  { time: "14:24:16", code: "POSITIONING.CLARITY",   value: "64%" },
  { time: "14:24:19", code: "CATEGORY.DEFENSE",      value: "62%" },
];

export default function DiagnosticReframe() {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Live log feed — three visible at a time, oldest exits on top, newest
  // enters on bottom, AnimatePresence handles the transitions.
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>(() =>
    LOG_ENTRIES.slice(0, 3).map((e, i) => ({ ...e, id: i }))
  );
  const logIndexRef = useRef(3);

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = LOG_ENTRIES[logIndexRef.current % LOG_ENTRIES.length];
      const entry: LogEntry = { ...next, id: logIndexRef.current };
      logIndexRef.current += 1;
      setVisibleLogs((prev) => [...prev.slice(1), entry]);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapEl: HTMLDivElement = wrap;

    wrap.classList.add("js-ready");

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const wrapBg    = wrapEl.querySelector<HTMLDivElement>(".reframe-bg-fill")!;
      const section   = wrapEl.querySelector<HTMLElement>(".section-reframe")!;
      const headline  = section.querySelector<HTMLElement>(".headline-display")!;
      const line1     = section.querySelector<HTMLElement>(".headline-display .line-1")!;
      const line2     = section.querySelector<HTMLElement>(".headline-display .line-2")!;
      const grid      = section.querySelector<HTMLElement>(".reframe-grid")!;
      const cards     = section.querySelectorAll<HTMLElement>(".reframe-card");
      const connectorLine    = section.querySelector<HTMLElement>(".connector-line")!;
      const connectorMarkers = section.querySelectorAll<HTMLElement>(".connector-marker");

      // Split each headline line into per-character spans (words kept atomic
      // via .tw-word nowrap wrappers) so the typewriter can fade chars in
      // one-by-one without breaking word wrap.
      function splitIntoChars(line: HTMLElement): HTMLSpanElement[] {
        const text = line.textContent || "";
        line.textContent = "";
        const chars: HTMLSpanElement[] = [];
        const parts = text.split(/(\s+)/);
        parts.forEach((part) => {
          if (part.length === 0) return;
          if (/^\s+$/.test(part)) {
            line.appendChild(document.createTextNode(part));
            return;
          }
          const wordSpan = document.createElement("span");
          wordSpan.className = "tw-word";
          Array.from(part).forEach((c) => {
            const charSpan = document.createElement("span");
            charSpan.className = "tw-char";
            charSpan.textContent = c;
            wordSpan.appendChild(charSpan);
            chars.push(charSpan);
          });
          line.appendChild(wordSpan);
        });
        return chars;
      }

      const line1Chars = splitIntoChars(line1);
      const line2Chars = splitIntoChars(line2);
      let typewriterPlayed = false;
      let typewriterTweens: gsap.core.Tween[] = [];
      let caretScrollCleanup: (() => void) | null = null;

      // HUD counter — T+hh:mm:ss elapsed since section first entered.
      // Drives the top-right status readout in the dark-phase overlay.
      const hudCounter = wrapEl.querySelector<HTMLElement>(".hud-counter");
      let counterStartMs = 0;
      let counterInterval: number | null = null;
      let counterStarted = false;

      function startHudCounter() {
        if (counterStarted) return;
        counterStarted = true;
        counterStartMs = Date.now();
        if (hudCounter) hudCounter.textContent = "T+00:00:00";
        counterInterval = window.setInterval(() => {
          if (!hudCounter) return;
          const elapsed = Math.floor((Date.now() - counterStartMs) / 1000);
          const hh = String(Math.floor(elapsed / 3600)).padStart(2, "0");
          const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
          const ss = String(elapsed % 60).padStart(2, "0");
          hudCounter.textContent = `T+${hh}:${mm}:${ss}`;
        }, 1000);
      }

      function stopHudCounter() {
        if (counterInterval !== null) {
          window.clearInterval(counterInterval);
          counterInterval = null;
        }
      }

      function runTypewriter() {
        // True typewriter: each char snaps on instantly (no fade), one at a
        // time, with a blinking bronze caret following the typing position.
        // The caret is the unlock — it transforms "popping chars" into
        // unmistakable "the system is typing this live."
        typewriterTweens.forEach((t) => t.kill());
        typewriterTweens = [];

        const CHAR_MS    = 25;   // ms between successive char strikes
        const LINE_GAP   = 120;  // ms between line1 finishing and line2 starting
        const FADE_MS    = 360;  // caret fade-out duration
        const SAFETY_MS  = 4000; // max time caret stays blinking after typing,
                                 // if the user hasn't scrolled (AFK guard)
        const SCROLL_PX  = 6;    // scroll distance that counts as "user moved on"

        // Caret — a single bronze block that moves through the DOM as it
        // chases the typing cursor. One element, repositioned between chars.
        const caret = document.createElement("span");
        caret.className = "tw-caret is-blinking";
        caret.setAttribute("aria-hidden", "true");
        line1.insertBefore(caret, line1.firstChild);
        // Blink driven by CSS `animation: blink 1.2s step-end infinite` —
        // same hard square-wave on/off as the HUD terminal cursor. No
        // smooth pulse; the snap is the whole point.

        function placeCaretAfter(node: HTMLElement) {
          const parent = node.parentNode;
          if (!parent) return;
          if (node.nextSibling) {
            parent.insertBefore(caret, node.nextSibling);
          } else {
            parent.appendChild(caret);
          }
        }

        // Line 1 — each char snaps on at its scheduled tick; caret follows.
        line1Chars.forEach((c, i) => {
          typewriterTweens.push(
            gsap.delayedCall((i * CHAR_MS) / 1000, () => {
              gsap.set(c, { opacity: 1 });
              placeCaretAfter(c);
            })
          );
        });

        // Hand caret over to line 2 at the gap, before line 2 starts striking.
        const line1EndMs   = line1Chars.length * CHAR_MS;
        const line2StartMs = line1EndMs + LINE_GAP;
        typewriterTweens.push(
          gsap.delayedCall(line2StartMs / 1000, () => {
            line2.insertBefore(caret, line2.firstChild);
          })
        );

        // Line 2 — same pattern.
        line2Chars.forEach((c, i) => {
          typewriterTweens.push(
            gsap.delayedCall((line2StartMs + i * CHAR_MS) / 1000, () => {
              gsap.set(c, { opacity: 1 });
              placeCaretAfter(c);
            })
          );
        });

        // After the last strike, leave the caret blinking — "system ready,
        // waiting for input." Dismiss when the user scrolls past the entry
        // point, or after SAFETY_MS as a fallback for idle visitors.
        const totalTypeMs = line2StartMs + line2Chars.length * CHAR_MS;
        typewriterTweens.push(
          gsap.delayedCall(totalTypeMs / 1000, () => {
            let dismissed = false;
            const startScrollY = window.scrollY;

            function fadeCaret() {
              if (dismissed) return;
              dismissed = true;
              if (caretScrollCleanup) {
                caretScrollCleanup();
                caretScrollCleanup = null;
              }
              // Capture the caret's current animated opacity, freeze it as
              // inline style, then fade from there. Avoids the snap that
              // would happen if we just yanked the CSS animation off.
              const frozen = parseFloat(getComputedStyle(caret).opacity) || 1;
              caret.classList.remove("is-blinking");
              gsap.set(caret, { opacity: frozen });
              gsap.to(caret, {
                opacity: 0,
                duration: FADE_MS / 1000,
                ease: "power2.out",
                onComplete: () => {
                  if (caret.parentNode) caret.parentNode.removeChild(caret);
                },
              });
            }

            function onScroll() {
              if (Math.abs(window.scrollY - startScrollY) > SCROLL_PX) {
                fadeCaret();
              }
            }

            window.addEventListener("scroll", onScroll, { passive: true });
            caretScrollCleanup = () =>
              window.removeEventListener("scroll", onScroll);

            typewriterTweens.push(
              gsap.delayedCall(SAFETY_MS / 1000, fadeCaret)
            );
          })
        );
      }

      function computeOffsets() {
        gsap.set(headline, { x: 0, y: 0, scale: 1 });
        gsap.set([line1, line2], { x: 0, y: 0 });

        const range = document.createRange();
        range.selectNodeContents(line1);
        const line1TextRect = range.getBoundingClientRect();
        range.selectNodeContents(line2);
        const line2TextRect = range.getBoundingClientRect();
        range.detach();

        const headlineRect = headline.getBoundingClientRect();
        const wrapRect     = wrapEl.getBoundingClientRect();

        const elementCenterX = headlineRect.left + headlineRect.width / 2;
        const line1CenterX   = line1TextRect.left + line1TextRect.width / 2;
        const line2CenterX   = line2TextRect.left + line2TextRect.width / 2;

        const headlineOffsetInWrap = headlineRect.top - wrapRect.top;
        const headlineCenterInWrap = headlineOffsetInWrap + headlineRect.height / 2;

        const vcX = document.documentElement.clientWidth / 2;
        const vcY = window.innerHeight / 2;
        const SCALE = 1.25;

        const elemTransY = vcY - headlineCenterInWrap;

        const line1Tx = (vcX / SCALE) - line1CenterX + (1 - 1 / SCALE) * elementCenterX;
        const line2Tx = (vcX / SCALE) - line2CenterX + (1 - 1 / SCALE) * elementCenterX;

        return { elemTransY, line1Tx, line2Tx };
      }

      function applyInitialState() {
        const o = computeOffsets();
        gsap.set(headline, { y: o.elemTransY, scale: 1.25, color: "#F4F0E7", transformOrigin: "center center" });
        gsap.set(line1, { x: o.line1Tx });
        gsap.set(line2, { x: o.line2Tx, color: "#9C948A" });
        gsap.set(".section-label, .reframe-cta, .reframe-right, .grid-label-cell, .reframe-meta-bar", { opacity: 0, y: 16 });
        gsap.set(cards, { opacity: 0, y: 24 });
        gsap.set(grid, { "--hairline-top": 0, "--hairline-bot": 0 });
        gsap.set(connectorMarkers, { opacity: 0 });
        gsap.set(wrapBg, { backgroundColor: "#110F0A" });
        gsap.set([".reframe-hud-overlay", ".reframe-pulse-layer"], { opacity: 1 });
        // Hide chars only before typewriter has played. After it plays once
        // we leave them visible so re-entry from below doesn't blank them.
        if (!typewriterPlayed) {
          gsap.set([...line1Chars, ...line2Chars], { opacity: 0 });
        }
      }

      const mm = gsap.matchMedia();

      // ── DESKTOP cinematic ──────────────────────────────────────────────
      mm.add("(min-width: 769px)", () => {
        applyInitialState();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapEl,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onEnter: () => {
              // Typewriter fires once, on its own clock — independent of
              // scroll. Lets the user "watch the system write" before the
              // scroll-driven shrink + bg crossfade takes over.
              if (!typewriterPlayed) {
                typewriterPlayed = true;
                runTypewriter();
              }
              startHudCounter();
            },
            onRefresh: () => {
              if (tl.scrollTrigger && tl.scrollTrigger.progress === 0) applyInitialState();
            },
          },
          defaults: { ease: "power2.inOut" },
        });

        // Headline shrink + bg crossfade pushed to scroll-progress 0.18
        // (was 0.10) so typewriter has breathing room before settle begins.
        // Duration shortened to 0.22 so end-point (0.40) is unchanged and
        // downstream cues at 0.42+ still chain correctly.
        tl.to(wrapBg,    { backgroundColor: "#F4F0E7", duration: 0.22 }, 0.18);
        tl.to(headline,  { y: 0, scale: 1, color: "#0A0805", duration: 0.22 }, 0.18);
        tl.to(line1,     { x: 0, duration: 0.22 }, 0.18);
        tl.to(line2,     { x: 0, color: "#A8A09A", duration: 0.22 }, 0.18);

        // Dark-phase HUD overlay + pulse layer fade out faster than the bg
        // crossfade — ends at 0.28, well before bg finishes going cream at
        // 0.40. The bronze instrumentation belongs to the dark workspace;
        // once the settled state arrives, the connector + cards take over
        // as the permanent furniture.
        tl.to([".reframe-hud-overlay", ".reframe-pulse-layer"], { opacity: 0, duration: 0.10, ease: "power2.out" }, 0.18);

        tl.to(".section-label", { opacity: 1, y: 0, duration: 0.10 }, 0.42);
        tl.to(".reframe-right", { opacity: 1, y: 0, duration: 0.12 }, 0.46);
        tl.to(".reframe-cta",   { opacity: 1, y: 0, duration: 0.10 }, 0.50);

        // The two card-frame hairlines (top + bottom of grid) and the
        // meta-bar's top hairline all draw in together at 0.55 — three
        // parallel horizontal lines that form the structural frame the
        // cards then fill in. Visually unified architectural reveal.
        tl.to(grid, { "--hairline-top": 1, "--hairline-bot": 1, duration: 0.12, ease: "power2.out" }, 0.55);
        tl.to(".reframe-meta-bar", { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.55);
        tl.to(".grid-label-cell", { opacity: 1, y: 0, duration: 0.10 }, 0.58);
        tl.to(connectorLine, { clipPath: "inset(0 0% 0 0)", duration: 0.14, ease: "power2.out" }, 0.55);

        tl.to(cards[0],            { opacity: 1, y: 0, duration: 0.08 }, 0.68);
        tl.to(connectorMarkers[0], { opacity: 1, duration: 0.04 }, 0.68);
        tl.to(cards[1],            { opacity: 1, y: 0, duration: 0.08 }, 0.74);
        tl.to(connectorMarkers[1], { opacity: 1, duration: 0.04 }, 0.74);
        tl.to(cards[2],            { opacity: 1, y: 0, duration: 0.08 }, 0.80);
        tl.to(connectorMarkers[2], { opacity: 1, duration: 0.04 }, 0.80);

        // Page may load already scrolled into / past the section. If the
        // pin is mid-progress, onEnter won't fire — kick the typewriter
        // manually so the headline doesn't sit invisible.
        requestAnimationFrame(() => {
          const st = tl.scrollTrigger;
          if (st && st.progress > 0 && !typewriterPlayed) {
            typewriterPlayed = true;
            gsap.set([...line1Chars, ...line2Chars], { opacity: 1 });
          }
        });

        // ── Cursor-reactive pulse rings ──────────────────────────────
        // Each ring is an SVG path made of N points around a circle. On
        // every frame, we recompute each point: if it's near the cursor,
        // we push it gently TOWARD the cursor — so the ring bulges where
        // it meets the obstacle, like a wave hitting a block. Far from
        // the cursor, the ring is a clean circle. Animation (radius +
        // opacity over the cycle) is also driven here in JS, replacing
        // the previous CSS @keyframes.
        const pulseSvg    = wrapEl.querySelector<SVGSVGElement>(".hud-pulse-svg");
        const pulsePaths  = wrapEl.querySelectorAll<SVGPathElement>(".hud-pulse-ring");
        const cursorSVG   = { x: -10000, y: -10000 };  // SVG viewBox coords
        const RING_DELAYS = [0, 5000];                 // ms offsets — half-cycle
        const CYCLE_MS    = 10000;                     // 10s per ring cycle
        const RING_POINTS = 80;                        // path resolution
        const DEFORM_THRESH = 95;                      // SVG units (~90px)
        const DEFORM_MAX    = 12;                      // SVG units (~11px)
        const animStartMs = performance.now();
        let cursorRaf     = 0;

        function onCursorMove(e: MouseEvent) {
          if (!pulseSvg) return;
          const rect = pulseSvg.getBoundingClientRect();
          if (rect.width === 0) return;
          cursorSVG.x = ((e.clientX - rect.left) / rect.width)  * 1000;
          cursorSVG.y = ((e.clientY - rect.top)  / rect.height) * 1000;
        }

        function onCursorLeave() {
          // Park cursor far outside the SVG so no point is in deform range.
          cursorSVG.x = -10000;
          cursorSVG.y = -10000;
        }

        function buildRingPath(radius: number): string {
          const parts: string[] = [];
          for (let i = 0; i < RING_POINTS; i++) {
            const angle = (i / RING_POINTS) * Math.PI * 2;
            let px = 500 + radius * Math.cos(angle);
            let py = 500 + radius * Math.sin(angle);

            const dx = cursorSVG.x - px;
            const dy = cursorSVG.y - py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.01 && dist < DEFORM_THRESH) {
              // smoothstep falloff — strong near cursor, gentle at edge
              const t = 1 - dist / DEFORM_THRESH;
              const eased = t * t * (3 - 2 * t);
              const disp = DEFORM_MAX * eased;
              px += (dx / dist) * disp;
              py += (dy / dist) * disp;
            }
            parts.push(`${i === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`);
          }
          parts.push("Z");
          return parts.join(" ");
        }

        function tickPulse() {
          const now = performance.now();
          pulsePaths.forEach((path, i) => {
            const raw = (now - animStartMs - RING_DELAYS[i]) % CYCLE_MS;
            const phase = (raw < 0 ? raw + CYCLE_MS : raw) / CYCLE_MS;
            // Ease-out radius growth — matches the prior CSS cubic-bezier
            // (slow start, fast settle outward). Max radius reduced 20%
            // so rings no longer reach the bottom-center scroll prompt.
            const eased = 1 - Math.pow(1 - phase, 3);
            const radius = 80 + eased * 304;
            // Opacity: ramp up first 10%, fade out over remaining 90%.
            const opacity = phase < 0.1
              ? (phase / 0.1) * 0.42
              : (1 - (phase - 0.1) / 0.9) * 0.42;

            path.setAttribute("d", buildRingPath(radius));
            path.style.opacity = opacity.toFixed(3);
          });
          cursorRaf = requestAnimationFrame(tickPulse);
        }

        wrapEl.addEventListener("mousemove", onCursorMove);
        wrapEl.addEventListener("mouseleave", onCursorLeave);
        cursorRaf = requestAnimationFrame(tickPulse);

        // ── Cursor-following glow inside each card ───────────────────
        // Updates --cursor-x / --cursor-y CSS variables on the hovered
        // card; the .card-glow pseudo-positioned div uses them to render
        // a radial bronze gradient that follows the mouse inside the card.
        const cardGlowCleanups: Array<() => void> = [];
        cards.forEach((card) => {
          const onMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width)  * 100;
            const y = ((e.clientY - rect.top)  / rect.height) * 100;
            card.style.setProperty("--cursor-x", `${x}%`);
            card.style.setProperty("--cursor-y", `${y}%`);
          };
          card.addEventListener("mousemove", onMove);
          cardGlowCleanups.push(() => card.removeEventListener("mousemove", onMove));
        });

        return () => {
          if (caretScrollCleanup) {
            caretScrollCleanup();
            caretScrollCleanup = null;
          }
          stopHudCounter();
          wrapEl.removeEventListener("mousemove", onCursorMove);
          wrapEl.removeEventListener("mouseleave", onCursorLeave);
          if (cursorRaf) cancelAnimationFrame(cursorRaf);
          cardGlowCleanups.forEach((fn) => fn());
          typewriterTweens.forEach((t) => t.kill());
          typewriterTweens = [];
          tl.scrollTrigger && tl.scrollTrigger.kill();
          tl.kill();
          gsap.set(
            [headline, line1, line2, wrapBg, ".section-label", ".reframe-cta", ".reframe-right", ".grid-label-cell", ".reframe-meta-bar", cards, connectorMarkers, grid, connectorLine, ".reframe-hud-overlay", ".reframe-pulse-layer"],
            { clearProps: "all" }
          );
        };
      });

      // ── MOBILE simple reveal ───────────────────────────────────────────
      mm.add("(max-width: 768px)", () => {
        gsap.set(wrapBg, { backgroundColor: "#F4F0E7" });
        gsap.set(".section-label, .headline-display, .reframe-cta, .reframe-right, .grid-label-cell, .reframe-meta-bar", { opacity: 0, y: 12 });
        gsap.set(cards, { opacity: 0, y: 20 });
        gsap.set(grid, { "--hairline-top": 1, "--hairline-bot": 1 });
        gsap.set(connectorLine, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(connectorMarkers, { opacity: 1 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrapEl, start: "top 80%", toggleActions: "play none none none" },
          defaults: { duration: 0.55, ease: "power2.out" },
        });

        tl.to(".section-label",     { opacity: 1, y: 0 })
          .to(".headline-display",  { opacity: 1, y: 0 }, "<+0.05")
          .to(".reframe-cta",       { opacity: 1, y: 0 }, "<+0.10")
          .to(".reframe-right",     { opacity: 1, y: 0 }, "<+0.05")
          .to(".grid-label-cell",   { opacity: 1, y: 0 }, "<+0.10")
          .to(cards[0],             { opacity: 1, y: 0 }, "<+0.10")
          .to(cards[1],             { opacity: 1, y: 0 }, "<+0.08")
          .to(cards[2],             { opacity: 1, y: 0 }, "<+0.08")
          .to(".reframe-meta-bar",  { opacity: 1, y: 0 }, "<+0.08");

        return () => {
          tl.scrollTrigger && tl.scrollTrigger.kill();
          tl.kill();
        };
      });

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="reframe-pin-wrap" ref={wrapRef}>
      <div className="reframe-bg-fill" aria-hidden="true"></div>

      {/* ── PULSE LAYER ────────────────────────────────────────────────
          Concentric bronze rings emanating from viewport center, like a
          sonar ping. Lives behind the headline (z-index 0, below section
          content). Continuous slow cycle; fades out with the rest of the
          dark-phase furniture at scroll-progress 0.18.                  */}
      <div className="reframe-pulse-layer" aria-hidden="true">
        <svg className="hud-pulse-svg" viewBox="0 0 1000 1000">
          {/* Two rings only (was three) — staggered half a cycle apart so
              never more than two visible at once. Paths (not circles) so
              each ring's geometry can be deformed per-frame where the
              cursor is near. Animation driven entirely in JS.            */}
          <path className="hud-pulse-ring hud-pulse-ring-1" />
          <path className="hud-pulse-ring hud-pulse-ring-2" />
        </svg>
      </div>

      {/* ── DARK-PHASE HUD OVERLAY ──────────────────────────────────────
          Decorative system instrumentation that frames the typewriter
          phase as a calibrated "diagnostic display." All elements fade
          out together at scroll-progress 0.18, in sync with the bg
          crossfade — they belong to the dark phase only.            */}
      <div className="reframe-hud-overlay" aria-hidden="true">
        <span className="hud-corner hud-corner-tl"></span>
        <span className="hud-corner hud-corner-tr"></span>
        <span className="hud-corner hud-corner-bl"></span>
        <span className="hud-corner hud-corner-br"></span>

        <div className="hud-header-tl">
          <div className="hud-header-row">
            <span className="hud-dot"></span>
            <span className="hud-label-primary">KELWIN/OS · DIAGNOSTIC.REFRAME</span>
          </div>
          <div className="hud-header-row hud-header-row-secondary">
            <span className="hud-label-secondary">PROTOCOL 01 · ACTIVE</span>
          </div>
        </div>

        <div className="hud-status-tr">
          <div className="hud-label-primary">ANALYSIS MODE · ACTIVE</div>
          <div className="hud-counter">T+00:00:00</div>
        </div>

        <div className="hud-scroll-prompt">
          <div className="hud-scroll-track">
            <span className="hud-scroll-dot"></span>
          </div>
          <div className="hud-scroll-label">Scroll</div>
        </div>

        {/* Diagnostic stream — live log feed (upper-left, below header).
            Echoes the hero HUD's log vocabulary: timestamp + code + value.
            Cycles every 2.4s; AnimatePresence handles enter/exit. */}
        <div className="hud-log-feed">
          <div className="hud-log-header">Diagnostic Stream</div>
          <div className="hud-log-body">
            <AnimatePresence initial={false}>
              {visibleLogs.map((entry) => (
                <motion.div
                  key={entry.id}
                  className="hud-log-row"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="hud-log-time">{entry.time}</span>
                  <span className="hud-log-code">{entry.code}</span>
                  <span className="hud-log-value">{entry.value}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <section className="section-reframe" id="reframe">
        <div className="reframe-top">
          <div className="reframe-left">
            <h2 className="headline-display">
              <span className="line-1">What looks like a pipeline problem</span>
              <span className="line-2">is rarely a pipeline problem.</span>
            </h2>
            <DiagnosticMethodCTA
              href="#methodology"
              label="View the Diagnostic Method"
              className="reframe-cta"
            />
          </div>

          <div className="reframe-right">
            <p className="reframe-body">
              Most firms diagnose at the surface — campaigns, conversion rates, rep performance. Kelwin diagnoses the architecture underneath. Surface diagnosis treats what is visible. Structural diagnosis treats what produces it.
              <span className="body-coda">The first returns. The second compounds.</span>
            </p>
          </div>
        </div>

        <div className="connector-strip" aria-hidden="true">
          <div className="connector-line">
            {/* Comet pulse traveling left → right along the dashed line.
                Clipped by the connector-line's clip-path so it only shows
                once the line itself has drawn in. */}
            <span className="connector-pulse"></span>
          </div>
          <div className="connector-marker m1">
            <span className="connector-marker-label">Narrative</span>
          </div>
          <div className="connector-marker m2">
            <span className="connector-marker-label">Protocol</span>
          </div>
          <div className="connector-marker m3">
            <span className="connector-marker-label">Intelligence</span>
          </div>
        </div>

        <div className="reframe-grid">
          <div className="grid-label-cell">
            <div className="grid-label-eyebrow">
              <span className="eyebrow-dash" aria-hidden="true"></span>
              <span>Anatomy</span>
            </div>
            <h3 className="grid-label-headline">
              The three layers of misdiagnosis
            </h3>
          </div>

          <div className="reframe-card card-1">
            <span className="card-glow" aria-hidden="true"></span>
            <div className="card-number">01</div>
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M4 6h16M4 11h12M4 16h8" />
              <path d="M19 13l3 3-3 3" />
            </svg>
            <div className="card-label-top">What the market sees</div>
            <div className="card-claim">A pipeline problem.</div>
            <div className="card-divider"></div>
            <div className="card-label-bottom">The structural truth</div>
            <div className="card-truth">A narrative architecture problem. The market cannot repeat what it does not understand — and pipelines built on unclear positioning fail at the source.</div>
            <span className="card-corner card-corner-tl" aria-hidden="true"></span>
            <span className="card-corner card-corner-tr" aria-hidden="true"></span>
            <span className="card-corner card-corner-bl" aria-hidden="true"></span>
            <span className="card-corner card-corner-br" aria-hidden="true"></span>
          </div>

          <div className="reframe-card card-2">
            <span className="card-glow" aria-hidden="true"></span>
            <div className="card-number">02</div>
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter">
              <rect x="3" y="4" width="18" height="4" />
              <rect x="3" y="10" width="12" height="4" />
              <rect x="3" y="16" width="15" height="4" />
              <circle cx="20" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <div className="card-label-top">What the market sees</div>
            <div className="card-claim">A sales execution problem.</div>
            <div className="card-divider"></div>
            <div className="card-label-bottom">The structural truth</div>
            <div className="card-truth">An outbound protocol problem. Reps execute what the system installs — never more, never less. Replacing the rep before the protocol replaces nothing.</div>
            <span className="card-corner card-corner-tl" aria-hidden="true"></span>
            <span className="card-corner card-corner-tr" aria-hidden="true"></span>
            <span className="card-corner card-corner-bl" aria-hidden="true"></span>
            <span className="card-corner card-corner-br" aria-hidden="true"></span>
          </div>

          <div className="reframe-card card-3">
            <span className="card-glow" aria-hidden="true"></span>
            <div className="card-number">03</div>
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M3 18l5-5 4 3 6-8" />
              <path d="M14 8h4v4" />
              <path d="M3 21h18" />
            </svg>
            <div className="card-label-top">What the market sees</div>
            <div className="card-claim">A tooling or tech-stack problem.</div>
            <div className="card-divider"></div>
            <div className="card-label-bottom">The structural truth</div>
            <div className="card-truth">A GTM intelligence problem. Tools amplify what your data already knows — and expose what it doesn&apos;t. A new platform on a blind dataset multiplies the blindness.</div>
            <span className="card-corner card-corner-tl" aria-hidden="true"></span>
            <span className="card-corner card-corner-tr" aria-hidden="true"></span>
            <span className="card-corner card-corner-bl" aria-hidden="true"></span>
            <span className="card-corner card-corner-br" aria-hidden="true"></span>
          </div>
        </div>

        {/* Metadata footer bar — small monospace status line that frames
            the cards as outputs of a versioned, calibrated diagnostic
            system. Same vocabulary as the dark-phase HUD. */}
        <div className="reframe-meta-bar">
          <span className="meta-segment">Diagnostic Methodology · <strong>v2.4</strong></span>
          <span className="meta-segment">Calibrated <strong>Q1·2026</strong></span>
          <span className="meta-segment">Coherence <strong>0.847</strong></span>
        </div>
      </section>
    </div>
  );
}
