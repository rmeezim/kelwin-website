"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// ── Particle positions (no Math.random — deterministic for SSR) ────
const CHAOS_POS = [
  { x: 12, y: 8  }, { x: 67, y: 15 }, { x: 34, y: 22 }, { x: 81, y: 5  },
  { x: 48, y: 38 }, { x: 23, y: 51 }, { x: 73, y: 44 }, { x: 8,  y: 67 },
  { x: 57, y: 61 }, { x: 89, y: 72 }, { x: 31, y: 79 }, { x: 62, y: 85 },
  { x: 15, y: 91 }, { x: 44, y: 96 }, { x: 77, y: 88 }, { x: 19, y: 33 },
  { x: 85, y: 28 }, { x: 52, y: 14 }, { x: 6,  y: 45 }, { x: 39, y: 57 },
  { x: 71, y: 33 }, { x: 25, y: 72 }, { x: 58, y: 76 }, { x: 92, y: 55 },
  { x: 3,  y: 19 }, { x: 46, y: 68 }, { x: 79, y: 62 }, { x: 33, y: 88 },
];

// 4 rows × 7 columns = 28. Rows span y=12–79 (full container height) so the
// organized formation matches the spatial footprint of the chaos phase and
// the terminal content — no visual contraction on organize.
const GRID_POS = [
  { x: 8,  y: 12 }, { x: 22, y: 12 }, { x: 36, y: 12 }, { x: 50, y: 12 }, { x: 64, y: 12 }, { x: 78, y: 12 }, { x: 92, y: 12 },
  { x: 8,  y: 34 }, { x: 22, y: 34 }, { x: 36, y: 34 }, { x: 50, y: 34 }, { x: 64, y: 34 }, { x: 78, y: 34 }, { x: 92, y: 34 },
  { x: 8,  y: 57 }, { x: 22, y: 57 }, { x: 36, y: 57 }, { x: 50, y: 57 }, { x: 64, y: 57 }, { x: 78, y: 57 }, { x: 92, y: 57 },
  { x: 8,  y: 79 }, { x: 22, y: 79 }, { x: 36, y: 79 }, { x: 50, y: 79 }, { x: 64, y: 79 }, { x: 78, y: 79 }, { x: 92, y: 79 },
];

// ── Terminal data ──────────────────────────────────────────────────
// `tone` overrides the sand bar fill — patina marks the one healthy/state
// reading so the cluster shows the palette's full instrument range.
const METRICS: { label: string; value: string; fill: number; tone?: string }[] = [
  { label: "ENTROPY IDX",  value: "72.4%", fill: 0.724 },
  { label: "ICP MATCH",    value: "91.0%", fill: 0.910 },
  { label: "SEQ. HEALTH",  value: "94.1%", fill: 0.941, tone: "rgba(124, 156, 138, 0.75)" },
  { label: "OUTBOUND VEL", value: "78.3%", fill: 0.783 },
];

const ALL_LOG_ENTRIES = [
  { time: "15:33:48", type: "SIGNAL", msg: "ICP match → Series B, 340 FTE" },
  { time: "15:33:50", type: "INTEL",  msg: 'Intent cluster: "GTM infrastructure"' },
  { time: "15:33:51", type: "STATUS", msg: "MFS Foundry cadence: ACTIVE" },
  { time: "15:33:53", type: "SIGNAL", msg: "Entropy delta: −4.2% (12h window)" },
  { time: "15:33:55", type: "INTEL",  msg: "Narrative resonance: STRONG" },
  { time: "15:33:57", type: "SYSTEM", msg: "Pipeline integrity: 94.1% ▲" },
  { time: "15:33:59", type: "SIGNAL", msg: 'New trigger: "revenue operations"' },
  { time: "15:34:01", type: "STATUS", msg: "Channel routing: NOMINAL" },
  { time: "15:34:04", type: "INTEL",  msg: "ICP score: 91/100 → QUALIFIED" },
  { time: "15:34:06", type: "SYSTEM", msg: "GTM architecture layer: SYNCED" },
  { time: "15:34:09", type: "SIGNAL", msg: "Sequence open rate: +12.4% (7d)" },
  { time: "15:34:11", type: "STATUS", msg: "Narrative layer: deployed" },
];

const TYPE_COLORS: Record<string, string> = {
  SIGNAL: "#D4524E",
  INTEL:  "rgba(251, 250, 246,0.65)",
  STATUS: "rgba(251, 250, 246,0.4)",
  SYSTEM: "rgba(251, 250, 246,0.35)",
};

// Phase state machine:
// chaos    → particles drift with CSS @keyframes
// settling → drift animation stops; "transform 0.3s ease-out" eases the
//            transform snap back to zero BEFORE positions start moving.
//            This is a clean single-property transition with no animation
//            conflict — the only thing changing is the transform snap-back.
// order    → left/top CSS transitions move particles to grid positions
// terminal → particles fade out, terminal flickers in
type Phase = "chaos" | "settling" | "order" | "terminal";
type LogEntry = (typeof ALL_LOG_ENTRIES)[0] & { id: number };

export default function HeroHud() {
  const reduced = useReducedMotion();

  const [phase, setPhase]             = useState<Phase>(reduced ? "terminal" : "chaos");
  // HeroSection now measures the panel synchronously via `useLayoutEffect`
  // and re-measures on `document.fonts.ready`, so the container has its
  // final size from t=0 — no need to gate particle reveal on an artificial
  // wait. The HUD starts its sequence in parallel with the left-column
  // entrance so both sides come alive together.
  const containerReady = true;
  // Two static readout lines — no cycling. The panel reads as a live
  // instrument without the row-swap flicker competing with the blueprint.
  // Hand-picked for type variety: a signal and a system-health line.
  const [visibleLogs] = useState<LogEntry[]>(() =>
    [ALL_LOG_ENTRIES[0], ALL_LOG_ENTRIES[5]].map((e, i) => ({ ...e, id: i }))
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Phase state machine — runs immediately on mount.
  // settling (+2000ms): stops CSS drift, transition eases transform to 0.
  // order   (+2300ms): 300ms later, left/top transitions fire toward grid.
  // terminal(+3100ms): tightened from +3700ms — the original gap was sized
  //                    around the 1.8s pre-wait; with the wait gone we
  //                    don't need as much breathing room before the
  //                    terminal lands, so the "wow" arrives closer to when
  //                    the left-side CTAs finish flickering in (~t=2.3s).
  useEffect(() => {
    if (reduced) return;
    const t0 = setTimeout(() => setPhase("settling"), 2000);
    const t1 = setTimeout(() => setPhase("order"),    2300);
    const t2 = setTimeout(() => setPhase("terminal"), 3100);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <style>{`
        @keyframes entropyDrift {
          0%   { transform: translate(0px,   0px); }
          20%  { transform: translate(3px,  -2px); }
          40%  { transform: translate(-2px,  3px); }
          60%  { transform: translate(2px,   2px); }
          80%  { transform: translate(-3px, -1px); }
          100% { transform: translate(0px,   0px); }
        }
      `}</style>

      {/* ── PARTICLE LAYER ────────────────────────────────────────── */}
      <AnimatePresence>
        {phase !== "terminal" && (
          <motion.div
            className="absolute inset-0"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
          >
            {CHAOS_POS.map((chaos, i) => {
              const isOrder    = phase === "order";
              const isSettling = phase === "settling";
              const isChaos    = phase === "chaos";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: containerReady ? 1 : 0 }}
                  transition={{ delay: 0.4 + i * 0.04, duration: 0.3 }}
                  style={{
                    position: "absolute",
                    left: `${isOrder ? GRID_POS[i].x : chaos.x}%`,
                    top:  `${isOrder ? GRID_POS[i].y : chaos.y}%`,
                    width: 3,
                    height: 3,
                    borderRadius: "1px",
                    backgroundColor: "rgba(199, 180, 157,0.72)",
                    marginLeft: -1.5,
                    marginTop:  -1.5,
                    // Chaos: CSS keyframe drift runs freely
                    animationName:           isChaos ? "entropyDrift" : "none",
                    animationDuration:       `${3.2 + (i % 7) * 0.35}s`,
                    animationDelay:          `${(i * 0.19) % 2.8}s`,
                    animationIterationCount: "infinite",
                    animationTimingFunction: "ease-in-out",
                    // Settling: only "transform" transitions — eases the drift
                    // snap-back to zero cleanly before positions start moving.
                    // Order: left/top transitions fire toward grid positions.
                    // The 300ms gap between settling→order means the transform
                    // is already at zero before left/top begin, eliminating any
                    // snap artifact.
                    transition: isOrder
                      ? `left 1.0s cubic-bezier(0.65,0,0.35,1) ${i * 0.018}s, top 1.0s cubic-bezier(0.65,0,0.35,1) ${i * 0.018}s`
                      : isSettling
                      ? "transform 0.3s ease-out"
                      : "none",
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TERMINAL LAYER ────────────────────────────────────────── */}
      {phase === "terminal" && (
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.06, 0.72, 0.18, 0.88, 0.42, 1] }}
          transition={{
            delay: 0.3,
            duration: 0.55,
            times: [0, 0.14, 0.28, 0.44, 0.58, 0.72, 0.86, 1],
            ease: "linear",
          }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            lineHeight: 1.6,
            padding: "14px 16px 18px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* [1] Header bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, flexShrink: 0 }}>
            <span style={{ color: "#C7B49D", letterSpacing: "0.2em", fontSize: 12 }}>
              KELWIN/OS
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: "rgba(251, 250, 246,0.1)" }} />
            <span style={{ color: "rgba(212,82,78,0.9)", fontSize: 8 }}>●</span>
            <span style={{ color: "rgba(212,82,78,0.8)", letterSpacing: "0.18em", fontSize: 11 }}>
              SPECIMEN
            </span>
          </div>

          {/* [2] Metrics block */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{ flexShrink: 0 }}
          >
            {METRICS.map((m) => (
              <div
                key={m.label}
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}
              >
                <span style={{
                  width: 110,
                  color: "rgba(251, 250, 246,0.55)",
                  letterSpacing: "0.12em",
                  fontSize: 10,
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}>
                  {m.label}
                </span>
                <div style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: "rgba(251, 250, 246,0.08)",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${m.fill * 100}%`,
                    backgroundColor: m.tone ?? "rgba(199, 180, 157,0.55)",
                  }} />
                </div>
                <span style={{
                  width: 42,
                  textAlign: "right",
                  color: "rgba(251, 250, 246,0.88)",
                  letterSpacing: "0.1em",
                  fontSize: 10,
                  flexShrink: 0,
                }}>
                  {m.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* [3] Divider */}
          <div style={{ height: 1, backgroundColor: "rgba(251, 250, 246,0.08)", margin: "12px 0", flexShrink: 0 }} />

          {/* [4] Log feed — three static lines, natural height so the panel
              stays compact and the blueprint shows through below it. */}
          <div style={{ flexShrink: 0 }}>
            <AnimatePresence initial={false}>
              {visibleLogs.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.35 }}
                  style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}
                >
                  <span style={{ color: "rgba(251, 250, 246,0.38)", minWidth: 58, flexShrink: 0 }}>
                    {entry.time}
                  </span>
                  <span style={{ color: TYPE_COLORS[entry.type] ?? "rgba(251, 250, 246,0.5)", minWidth: 48, flexShrink: 0 }}>
                    {entry.type}
                  </span>
                  <span style={{ color: "rgba(251, 250, 246,0.68)", flex: 1 }}>
                    {entry.msg}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* [5] Anchor caption — ties the specimen to the real deliverable
              so the readout registers as product, not theater. */}
          <div
            style={{
              flexShrink: 0,
              paddingTop: 10,
              fontSize: 9.5,
              letterSpacing: "0.06em",
              lineHeight: 1.5,
              color: "rgba(251, 250, 246, 0.42)",
            }}
          >
            Illustrative readout — the signal classes your intelligence layer
            reports once installed.
          </div>

          {/* [6] Cursor — pinned to bottom by flex column */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, paddingTop: 10, flexShrink: 0 }}>
            <span style={{ color: "#D4524E", letterSpacing: "0.1em" }}>{">"}</span>
            <span style={{
              display: "inline-block",
              width: 7,
              height: 13,
              backgroundColor: "#D4524E",
              opacity: 0.85,
              animation: "blink 1.2s step-end infinite",
            }} />
          </div>

          {/* [6] Scan line */}
          <motion.span
            className="absolute top-0 h-full pointer-events-none"
            style={{
              width: 1,
              background: "linear-gradient(to bottom, transparent 0%, rgba(251, 250, 246,0.04) 35%, rgba(251, 250, 246,0.04) 65%, transparent 100%)",
              zIndex: 10,
            }}
            initial={{ left: "-1%" }}
            animate={{ left: "101%" }}
            transition={{ duration: 9, delay: 0.8, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
          />
        </motion.div>
      )}
    </div>
  );
}
