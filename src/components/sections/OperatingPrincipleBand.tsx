"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import "./OperatingPrincipleBand.css";

const PHRASE_ASSERTION = "In a noisy market, the clearest company wins";
const PHRASE_DISCLAIM  = ", not the loudest or the busiest.";
const PHRASE = `${PHRASE_ASSERTION}${PHRASE_DISCLAIM}`;

// Echo lines render 4 units of `phrase + dot` back to back. The wrap
// range below assumes one unit = 25% of total element width — change
// the count and the range must change to match.
const SMALL_REPETITIONS = 4;

// Wraps `value` to stay within [min, max]. The marquee's `baseX` grows
// without bound every frame; piping it through this lets the rendered
// translateX cycle in a fixed range and produce the seamless loop —
// the jump back to `min` is invisible because the content at -25%
// shows the same characters as the content at 0% (it's just a
// different unit of the 4 identical copies).
function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

function EchoLine({ x }: { x: MotionValue<string> }) {
  return (
    <motion.div
      className="principle-band__line principle-band__line--small"
      style={{ x }}
      aria-hidden="true"
    >
      {Array.from({ length: SMALL_REPETITIONS }).map((_, i) => (
        <Fragment key={i}>
          <span className="principle-band__phrase">{PHRASE}</span>
          <span className="principle-band__dot" aria-hidden="true" />
        </Fragment>
      ))}
    </motion.div>
  );
}

export default function OperatingPrincipleBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const mainRef    = useRef<HTMLDivElement>(null);
  const reduced    = useReducedMotion();

  const [mainRange, setMainRange] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  useLayoutEffect(() => {
    function measure() {
      const main = mainRef.current;
      if (!main) return;
      const viewportWidth = window.innerWidth;
      const mainWidth     = main.scrollWidth;
      setMainRange({ start: viewportWidth, end: -mainWidth });
    }
    measure();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ── Main line: scroll-tied single traversal as before ─────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mainX = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [mainRange.start, mainRange.end]
  );

  // ── Echo lines: scroll-velocity-influenced infinite marquee ───────
  // BASE_VELOCITY is the idle speed in percent-of-element-width per
  // second. With 4 units stacked, one full unit = 25%, so at value 4
  // the marquee cycles one phrase every ~6 seconds when the page is
  // still. Scroll velocity multiplies this — fast scrolling makes the
  // marquee accelerate; when the user stops, the spring decays the
  // velocity factor back to zero, so the marquee glides back to its
  // baseline pace rather than snapping.
  const BASE_VELOCITY = 2.25;

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // Map raw px/s scroll velocity to a 0–5× multiplier. `clamp: false`
  // means very fast scrolling can push the multiplier higher — that's
  // fine because the spring above already prevents sudden spikes.
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // Tracks which direction the marquee is currently flowing. Flipped
  // by the scroll direction in the animation frame below — scrolling
  // down keeps it +1 (right), scrolling up snaps it to -1 (left). The
  // direction persists when the user stops scrolling, so an upward
  // scroll leaves the marquee drifting left at idle baseline speed
  // until the user scrolls down again.
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    // Baseline drift in the current direction.
    let moveBy = directionFactor.current * BASE_VELOCITY * (delta / 1000);

    // Flip direction to match the scroll direction. The sign of
    // `velocityFactor` mirrors `scrollY` velocity — positive when
    // scrolling down, negative when scrolling up.
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    // Scroll boost — `directionFactor * moveBy * velocityFactor`
    // resolves to a positive boost in both directions (because the
    // two signs always match the current scroll direction). Gentle
    // scrolling barely accelerates; fast scrolling compounds.
    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  // Pipe baseX through wrap to keep the rendered translateX inside the
  // seamless-loop range. -25% → 0% is exactly one unit width.
  const echoX = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  return (
    <section
      ref={sectionRef}
      id="principle-band"
      className="principle-band"
      aria-label={PHRASE}
    >
      {/* Top echo — infinite JS-driven marquee, accelerates with scroll. */}
      <EchoLine x={echoX} />

      {/* Main line — scroll-tied single traversal, right → left. */}
      <motion.div
        ref={mainRef}
        className="principle-band__line principle-band__line--main"
        style={{ x: mainX }}
        aria-hidden="true"
      >
        <span className="principle-band__assertion">{PHRASE_ASSERTION}</span>
        <span className="principle-band__disclaim">{PHRASE_DISCLAIM}</span>
      </motion.div>

      {/* Bottom echo — shares `echoX` with the top echo so they stay
          perfectly synchronized. */}
      <EchoLine x={echoX} />
    </section>
  );
}
