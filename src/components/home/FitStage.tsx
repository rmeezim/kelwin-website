"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  /** The drawing's design size at the 1440 stage, in px. */
  width: number;
  height: number;
  /** Never scale above this (default 1 — a drawing is never blown up past its design size). */
  maxScale?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Scales a fixed-coordinate drawing (absolute HTML callouts over an SVG, laid out in px on
 * the 1440 stage) to the width it is given, keeping its proportions. Use it only where the
 * drawing cannot be made fluid directly — inline SVG with a viewBox already scales — and
 * never where scaling would push text below the 11px floor: below that width, reflow the
 * drawing for the phone instead.
 */
export default function FitStage({ width, height, maxScale = 1, className, children }: Props) {
  const outer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const fit = () => {
      const k = Math.min(maxScale, el.clientWidth / width);
      el.style.setProperty("--fit-k", String(k));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, maxScale]);

  const outerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: `${width * maxScale}px`,
    aspectRatio: `${width} / ${height}`,
  } as CSSProperties;
  const innerStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    width: `${width}px`,
    height: `${height}px`,
    transform: "scale(var(--fit-k, 1))",
    transformOrigin: "0 0",
  } as CSSProperties;

  return (
    <div ref={outer} className={className} style={outerStyle}>
      <div style={innerStyle}>{children}</div>
    </div>
  );
}
