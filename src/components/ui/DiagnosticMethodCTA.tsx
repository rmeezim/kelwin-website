"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

// Bracketed CTA — same vocabulary as HeroCTA (full vertical brackets +
// corner caps). The fill is always present, so the button reads as a
// solid tactile target at rest. On hover, the fill flickers around full
// opacity (oscillating without fully clearing) so the user gets a clear
// tactile feedback signal without losing the visible button surface.
//
// Two color variants:
//   "obsidian" — dark fill, cream text (default).
//   "bronze"   — bronze fill, dark text.
const OBSIDIAN = "#0A0805";
const CREAM    = "#F4F0E7";
const BRONZE   = "#D18E53";

// Flicker pattern — same opacity ramp and timing as HeroCTA's primary
// audit button, so all three bracketed CTAs share one tactile vocabulary.
// The fill is always present at rest; on hover it strobes through this
// sequence and lands back at full opacity.
const FLICKER_OPACITY  = [0, 0.9, 0.05, 1, 0.38, 1];
const FLICKER_TIMES    = [0, 0.10, 0.22, 0.42, 0.65, 1];
const FLICKER_DURATION = 0.14;

interface Props {
  href: string;
  label: string;
  className?: string;
  variant?: "obsidian" | "bronze";
}

export default function DiagnosticMethodCTA({
  href,
  label,
  className,
  variant = "obsidian",
}: Props) {
  const [hovered, setHovered] = useState(false);

  // Variant palette — text is always the "on-fill" color since the fill
  // is always present.
  const stroke = variant === "bronze" ? BRONZE : OBSIDIAN;
  const fill   = variant === "bronze" ? BRONZE : OBSIDIAN;
  const text   = variant === "bronze" ? OBSIDIAN : CREAM;

  return (
    <Link
      href={href}
      className={`relative inline-flex items-center tracking-[0.08em] font-body font-semibold uppercase select-none px-[15px] py-[9px] text-[12px] ${className || ""}`}
      style={{ color: text }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Fill — always present, inset 4px on every side so it sits inside
          the brackets with breathing room (matching HeroCTA's layered look). */}
      <motion.span
        className="absolute pointer-events-none"
        style={{ top: 4, right: 4, bottom: 4, left: 4, backgroundColor: fill }}
        animate={hovered ? { opacity: FLICKER_OPACITY } : { opacity: 1 }}
        transition={
          hovered
            ? { duration: FLICKER_DURATION, times: FLICKER_TIMES, ease: "linear" }
            : { duration: 0.18 }
        }
      />

      {/* Brackets — static frame in the variant's stroke color. */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        overflow="visible"
        aria-hidden="true"
      >
        <line x1="0"   y1="0" x2="0"   y2="100" stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="100" y2="100" stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <line x1={0}   y1={0}   x2={5}  y2={0}   stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <line x1={95}  y1={0}   x2={100} y2={0}  stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <line x1={0}   y1={100} x2={5}  y2={100} stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        <line x1={95}  y1={100} x2={100} y2={100} stroke={stroke} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>

      <span className="relative z-10">{label}</span>
    </Link>
  );
}
