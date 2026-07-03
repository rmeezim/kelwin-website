"use client";

import { useEffect, useRef, useState } from "react";
import DiagnosticStream, { type StreamEntry } from "@/components/ui/DiagnosticStream";

interface Props {
  /** Primary header label, e.g. "KELWIN/OS · REVENUE.OS" */
  systemLabel: string;
  /** Smaller secondary line, e.g. "PROTOCOL 02 · INSTALLING" */
  secondaryLabel?: string;
  /** Top-right mode badge, e.g. "INSTALL MODE · ACTIVE" */
  modeLabel?: string;
  /** Bottom-center scroll prompt — defaults to true */
  showScroll?: boolean;
  /** Optional bottom-left diagnostic stream entries */
  streamHeader?: string;
  streamEntries?: StreamEntry[];
  streamCycleMs?: number;
  /** Cream or dark variant — controls stroke + text color */
  variant?: "dark" | "cream";
  /** Pass false to skip the T+ counter (e.g. when the section already has one) */
  showCounter?: boolean;
}

/**
 * SectionHUD — the command-center frame ported across sections.
 * Renders absolutely-positioned corner brackets, top-left header,
 * top-right status with T+ counter, optional scroll prompt, optional
 * diagnostic stream. Must be the child of a `position: relative` ancestor.
 */
export default function SectionHUD({
  systemLabel,
  secondaryLabel,
  modeLabel,
  showScroll = true,
  streamHeader,
  streamEntries,
  streamCycleMs = 2400,
  variant = "dark",
  showCounter = true,
}: Props) {
  const counterRef = useRef<HTMLSpanElement>(null);
  // Initial state matches server (no window) and first client render so
  // hydration is clean. The reduced-motion branch arms in the effect after
  // mount instead of in the lazy initializer.
  const [armed, setArmed] = useState<boolean>(false);

  // T+ counter — fires once the HUD wrap enters the viewport. Reduced-
  // motion users skip the IO and arm immediately on mount.
  useEffect(() => {
    if (!showCounter) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setArmed(true);
      return;
    }
    if (armed) return;
    const el = counterRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setArmed(true);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [showCounter, armed]);

  useEffect(() => {
    if (!armed) return;
    const el = counterRef.current;
    if (!el) return;
    const start = Date.now();
    el.textContent = "T+00:00:00";
    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const hh = String(Math.floor(elapsed / 3600)).padStart(2, "0");
      const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
      const ss = String(elapsed % 60).padStart(2, "0");
      el.textContent = `T+${hh}:${mm}:${ss}`;
    }, 1000);
    return () => window.clearInterval(id);
  }, [armed]);

  return (
    <div className={`sys-hud is-${variant}`} aria-hidden="true">
      <span className="sys-corner sys-corner-tl" />
      <span className="sys-corner sys-corner-tr" />
      <span className="sys-corner sys-corner-bl" />
      <span className="sys-corner sys-corner-br" />

      <div className="sys-header">
        <div className="sys-header-row">
          <span className="sys-dot" />
          <span className="sys-label-primary">{systemLabel}</span>
        </div>
        {secondaryLabel && (
          <div className="sys-header-row sys-header-secondary">
            <span className="sys-label-secondary">{secondaryLabel}</span>
          </div>
        )}
      </div>

      {(modeLabel || showCounter) && (
        <div className="sys-status">
          {modeLabel && <div className="sys-label-primary">{modeLabel}</div>}
          {showCounter && (
            <span ref={counterRef} className="sys-counter">
              T+00:00:00
            </span>
          )}
        </div>
      )}

      {showScroll && (
        <div className="sys-scroll-prompt">
          <div className="sys-scroll-track">
            <span className="sys-scroll-dot" />
          </div>
          <div className="sys-scroll-label">Scroll</div>
        </div>
      )}

      {streamEntries && streamEntries.length > 0 && (
        <DiagnosticStream
          entries={streamEntries}
          cycleMs={streamCycleMs}
          variant={variant}
          floating
          header={streamHeader ?? "Diagnostic Stream"}
        />
      )}
    </div>
  );
}
