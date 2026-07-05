"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useAnimation } from "motion/react";

const FLICKER_OPACITY  = [0, 0.9, 0.05, 1, 0.38, 1];
const FLICKER_TIMES    = [0, 0.10, 0.22, 0.42, 0.65, 1];
const FLICKER_DURATION = 0.14;

const SIGNAL       = "#BF3A36";
const SIGNAL_HOVER = "#A8302C"; // settled deeper shade while hovered
const CREAM        = "#FBFAF6";

const CAP_REST  = 8;  // bracket arm length at rest (viewBox units)
const CAP_HOVER = 11; // extends inward on hover

export default function HeroCTA() {
  const [hovered, setHovered] = useState(false);
  const hoveredRef  = useRef(false); // guards async post-flicker callback
  const fillControls = useAnimation();

  const handleEnter = async () => {
    hoveredRef.current = true;
    setHovered(true);
    await fillControls.start({
      opacity: FLICKER_OPACITY,
      transition: { duration: FLICKER_DURATION, times: FLICKER_TIMES, ease: "linear" },
    });
    // Only darken if the cursor hasn't already left during the flicker.
    if (hoveredRef.current) {
      fillControls.start({
        backgroundColor: SIGNAL_HOVER,
        transition: { duration: 0.25, ease: "easeOut" },
      });
    }
  };

  const handleLeave = () => {
    hoveredRef.current = false;
    setHovered(false);
    fillControls.start({
      opacity: 1,
      backgroundColor: SIGNAL,
      transition: { duration: 0.2, ease: "easeOut" },
    });
  };

  // Bracket arms extend after the flicker on enter; retract immediately on leave.
  const capTransition = hovered
    ? { duration: FLICKER_DURATION, delay: 0, ease: "linear" as const }
    : { duration: 0.2, ease: "easeOut" as const };

  return (
    <Link
      href="/audit"
      className="relative inline-flex items-center tracking-[0.08em] font-body font-semibold group select-none gap-[clamp(0.5rem,0.7vw,0.75rem)] text-[clamp(0.78rem,0.95vw,0.95rem)] px-[clamp(1rem,1.6vw,1.75rem)] py-[clamp(0.65rem,0.95vw,1rem)]"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Signal-red fill — always present; flickers then deepens on hover */}
      <motion.span
        className="absolute pointer-events-none"
        style={{ top: 5, right: 5, bottom: 5, left: 5 }}
        initial={{ opacity: 1, backgroundColor: SIGNAL }}
        animate={fillControls}
      />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        overflow="visible"
        aria-hidden="true"
      >
        {/* Static verticals */}
        <line x1="0"   y1="0" x2="0"   y2="100" stroke={SIGNAL} strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="100" y2="100" stroke={SIGNAL} strokeWidth="2.4" vectorEffect="non-scaling-stroke" />

        {/* Corner caps — extend inward after flicker, retract immediately on leave */}
        <motion.line
          x1={0} y1={0} y2={0}
          initial={{ x2: CAP_REST }}
          animate={{ x2: hovered ? CAP_HOVER : CAP_REST }}
          transition={capTransition}
          stroke={SIGNAL} strokeWidth="2.4" vectorEffect="non-scaling-stroke"
        />
        <motion.line
          x2={100} y1={0} y2={0}
          initial={{ x1: 100 - CAP_REST }}
          animate={{ x1: hovered ? 100 - CAP_HOVER : 100 - CAP_REST }}
          transition={capTransition}
          stroke={SIGNAL} strokeWidth="2.4" vectorEffect="non-scaling-stroke"
        />
        <motion.line
          x1={0} y1={100} y2={100}
          initial={{ x2: CAP_REST }}
          animate={{ x2: hovered ? CAP_HOVER : CAP_REST }}
          transition={capTransition}
          stroke={SIGNAL} strokeWidth="2.4" vectorEffect="non-scaling-stroke"
        />
        <motion.line
          x2={100} y1={100} y2={100}
          initial={{ x1: 100 - CAP_REST }}
          animate={{ x1: hovered ? 100 - CAP_HOVER : 100 - CAP_REST }}
          transition={capTransition}
          stroke={SIGNAL} strokeWidth="2.4" vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span className="relative z-10" style={{ color: CREAM }}>
        INITIATE SYSTEM AUDIT
      </span>
      <span
        className="relative z-10 transition-transform duration-200 group-hover:translate-x-1"
        style={{ color: CREAM }}
      >
        →
      </span>
    </Link>
  );
}
