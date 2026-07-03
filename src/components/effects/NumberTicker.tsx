"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** Final numeric value to count up to. */
  value: number;
  /** Number of decimal places to preserve in the rendered value. */
  decimals?: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Optional prefix to render before the number (e.g. "v"). */
  prefix?: string;
  /** Optional suffix to render after the number (e.g. "%"). */
  suffix?: string;
  /** Optional inline style applied to the wrapper span. */
  className?: string;
}

// Counts the displayed number from 0 → `value` once scrolled into view.
// Uses IntersectionObserver to defer the count until the value is actually
// visible — pairs naturally with the meta-bar reveal pattern.
export default function NumberTicker({
  value,
  decimals = 0,
  duration = 1000,
  prefix = "",
  suffix = "",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Reduced-motion users land on the final value immediately, computed
  // via the lazy initializer to avoid setState in an effect.
  const [display, setDisplay] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? value
      : 0
  );
  const playedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      playedRef.current = true;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            const start = performance.now();
            const animate = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(value * eased);
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            io.unobserve(node);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(node);

    return () => io.disconnect();
  }, [value, duration]);

  const rendered = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
