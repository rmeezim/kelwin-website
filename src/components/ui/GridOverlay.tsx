"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const W = 560;
const H = 620;
const COLS = 7;
const ROWS = 7;
const CW = W / COLS; // ~80
const CH = H / ROWS; // ~88.5

const GRID_COLOR = "var(--grid-line)";
const BRONZE = "#D18E53";
const NODE_COLOR = "var(--node-color)";
const FAINT = "var(--text-faint)";
const MUTED = "var(--text-muted)";

// Corner bracket helper
function CornerBracket({
  x,
  y,
  size = 14,
  flip = false,
}: {
  x: number;
  y: number;
  size?: number;
  flip?: boolean;
}) {
  const sx = flip ? -1 : 1;
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + sx * size}
        y2={y}
        stroke={BRONZE}
        strokeWidth={0.8}
        opacity={0.7}
      />
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={y + size}
        stroke={BRONZE}
        strokeWidth={0.8}
        opacity={0.7}
      />
    </g>
  );
}

// Small data node square
function DataNode({ x, y, size = 4 }: { x: number; y: number; size?: number }) {
  return (
    <rect
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      fill={NODE_COLOR}
    />
  );
}

export default function GridOverlay({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 1.4,
        delay: shouldReduceMotion ? 0 : 0.8,
        ease: "easeOut",
      }}
      className={cn("w-full h-full", className)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: ROWS + 1 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * CH}
            x2={W}
            y2={i * CH}
            stroke={GRID_COLOR}
            strokeWidth={0.5}
            strokeDasharray="3 7"
          />
        ))}

        {/* Vertical grid lines */}
        {Array.from({ length: COLS + 1 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={i * CW}
            y1={0}
            x2={i * CW}
            y2={H}
            stroke={GRID_COLOR}
            strokeWidth={0.5}
            strokeDasharray="3 7"
          />
        ))}

        {/* Top-left corner brackets */}
        <CornerBracket x={16} y={16} size={16} />
        <CornerBracket x={W - 16} y={16} size={16} flip />

        {/* Protocol 01 label — top center */}
        <g>
          <DataNode x={CW * 1} y={CH * 0} />
          <text
            x={CW * 1 + 10}
            y={CH * 0 - 6}
            fill={BRONZE}
            fontSize={9}
            letterSpacing="0.16em"
            fontFamily="var(--font-body)"
            fontWeight={500}
            textAnchor="start"
            opacity={0.9}
          >
            PROTOCOL 01
          </text>
          <DataNode x={CW * 3} y={CH * 0} size={3} />
        </g>

        {/* Plus marker — top right area */}
        <g opacity={0.5}>
          <line x1={CW * 6 - 6} y1={CH * 1} x2={CW * 6 + 6} y2={CH * 1} stroke={BRONZE} strokeWidth={0.8} />
          <line x1={CW * 6} y1={CH * 1 - 6} x2={CW * 6} y2={CH * 1 + 6} stroke={BRONZE} strokeWidth={0.8} />
        </g>

        {/* NARRATIVE INFRASTRUCTURE label */}
        <g>
          <DataNode x={CW * 0} y={CH * 2} />
          <line
            x1={CW * 0}
            y1={CH * 2}
            x2={CW * 0}
            y2={CH * 2 + 24}
            stroke={BRONZE}
            strokeWidth={0.6}
            opacity={0.4}
          />
          <text
            x={CW * 0 + 10}
            y={CH * 2 + 14}
            fill={MUTED}
            fontSize={9}
            letterSpacing="0.14em"
            fontFamily="var(--font-body)"
            fontWeight={500}
            textAnchor="start"
          >
            NARRATIVE
          </text>
          <text
            x={CW * 0 + 10}
            y={CH * 2 + 26}
            fill={MUTED}
            fontSize={9}
            letterSpacing="0.14em"
            fontFamily="var(--font-body)"
            fontWeight={500}
            textAnchor="start"
          >
            INFRASTRUCTURE
          </text>
        </g>

        {/* REVENUE ENGINE label */}
        <g>
          <DataNode x={CW * 5} y={CH * 1} size={3} />
          <text
            x={CW * 5 + 10}
            y={CH * 2 - 20}
            fill={FAINT}
            fontSize={9}
            letterSpacing="0.14em"
            fontFamily="var(--font-body)"
            fontWeight={500}
            textAnchor="start"
          >
            REVENUE
          </text>
          <text
            x={CW * 5 + 10}
            y={CH * 2 - 8}
            fill={FAINT}
            fontSize={9}
            letterSpacing="0.14em"
            fontFamily="var(--font-body)"
            fontWeight={500}
            textAnchor="start"
          >
            ENGINE
          </text>
        </g>

        {/* ENTROPY INDEX label */}
        <g>
          <DataNode x={CW * 0} y={CH * 4} />
          <text
            x={CW * 0 + 10}
            y={CH * 4 + 14}
            fill={BRONZE}
            fontSize={9}
            letterSpacing="0.14em"
            fontFamily="var(--font-body)"
            fontWeight={600}
            textAnchor="start"
            opacity={0.85}
          >
            ENTROPY INDEX
          </text>
          <text
            x={CW * 0 + 10}
            y={CH * 4 + 28}
            fill={BRONZE}
            fontSize={12}
            letterSpacing="0.08em"
            fontFamily="var(--font-body)"
            fontWeight={600}
            textAnchor="start"
            opacity={0.85}
          >
            72.4%
          </text>
        </g>

        {/* Bottom-right corner marker */}
        <DataNode x={W - 16} y={H - 60} size={3} />
        <CornerBracket x={W - 28} y={H - 28} size={14} flip />

        {/* Scattered subtle nodes */}
        <DataNode x={CW * 3} y={CH * 3} size={2.5} />
        <DataNode x={CW * 5} y={CH * 5} size={2.5} />
        <DataNode x={CW * 2} y={CH * 6} size={2.5} />
        <DataNode x={CW * 6} y={CH * 3} size={2} />
      </svg>
    </motion.div>
  );
}
