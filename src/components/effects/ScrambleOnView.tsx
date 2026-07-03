"use client";

import { useEffect, useRef, useState } from "react";
import ScrambleText from "@/components/motion/ScrambleText";

interface Props {
  text: string;
  delay?: number;
  duration?: number;
  lineStagger?: number;
  mode?: "sequential" | "cascade";
  threshold?: number;
}

// Wraps ScrambleText with an IntersectionObserver so the scramble effect
// fires only when the element actually scrolls into view (rather than
// silently completing on mount for off-screen elements). Until visible,
// renders the plain text in the final layout — no layout shift on swap.
export default function ScrambleOnView({
  text,
  delay = 0,
  duration = 600,
  lineStagger = 240,
  mode = "cascade",
  threshold = 0.5,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (visible) return; // reduced-motion init already resolved it
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(node);
          }
        }),
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold, visible]);

  return (
    <span ref={ref}>
      {visible ? (
        <ScrambleText
          text={text}
          delay={delay}
          duration={duration}
          lineStagger={lineStagger}
          mode={mode}
        />
      ) : (
        text
      )}
    </span>
  );
}
