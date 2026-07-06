"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const FLICKER_ANIMATE = {
  opacity: [0, 0.9, 0.05, 1, 0.38, 1],
  scaleX:  [0, 0.4, 0.4,  0.73, 0.9, 1],
};
const FLICKER_TRANSITION = {
  duration: 0.28,
  times: [0, 0.12, 0.26, 0.48, 0.72, 1],
  ease: "linear" as const,
};

export default function SecondaryHeroCTA() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="/insights"
      className="inline-flex items-center tracking-[0.08em] font-body font-medium select-none transition-colors duration-150 text-[clamp(0.72rem,0.85vw,0.85rem)]"
      style={{ color: hovered ? "#D4524E" : "rgba(251, 250, 246, 0.65)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="relative inline-block">
        EXPLORE INSIGHTS
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-signal-bright pointer-events-none"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={FLICKER_ANIMATE}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={FLICKER_TRANSITION}
              style={{ transformOrigin: "left" }}
            />
          )}
        </AnimatePresence>
      </span>
    </a>
  );
}
