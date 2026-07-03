"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface StreamEntry {
  time: string;
  code: string;
  value: string;
}

interface InternalEntry extends StreamEntry {
  id: number;
}

interface Props {
  entries: StreamEntry[];
  cycleMs?: number;
  visibleCount?: number;
  header?: string;
  variant?: "dark" | "cream";
  /** When true, renders as a bottom-left floating module inside a SectionHUD. */
  floating?: boolean;
  className?: string;
}

/**
 * DiagnosticStream — the cycling timestamp + code + value log feed,
 * extracted from Diagnostic / Hero so it can drop into any section.
 * Hands an ever-fresh window of entries to AnimatePresence.
 */
export default function DiagnosticStream({
  entries,
  cycleMs = 2400,
  visibleCount = 3,
  header,
  variant = "dark",
  floating = false,
  className,
}: Props) {
  const [visible, setVisible] = useState<InternalEntry[]>(() =>
    entries.slice(0, visibleCount).map((e, i) => ({ ...e, id: i }))
  );
  const indexRef = useRef(visibleCount);

  useEffect(() => {
    if (entries.length === 0) return;
    const id = window.setInterval(() => {
      const next = entries[indexRef.current % entries.length];
      indexRef.current += 1;
      const entry: InternalEntry = { ...next, id: indexRef.current };
      setVisible((prev) => [...prev.slice(1), entry]);
    }, cycleMs);
    return () => window.clearInterval(id);
  }, [entries, cycleMs]);

  const classes = [
    "sys-stream",
    `is-${variant}`,
    floating ? "is-floating" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-hidden="true">
      {header && <div className="sys-stream-header">{header}</div>}
      <div className="sys-stream-body">
        <AnimatePresence initial={false}>
          {visible.map((entry) => (
            <motion.div
              key={entry.id}
              className="sys-stream-row"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35 }}
            >
              <span className="sys-stream-time">{entry.time}</span>
              <span className="sys-stream-code">{entry.code}</span>
              <span className="sys-stream-value">{entry.value}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
