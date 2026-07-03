"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Props {
  /** Element CSS-selector or ref the spine measures fill against. Defaults to its own parent. */
  triggerSelector?: string;
  /** ScrollTrigger start position. */
  start?: string;
  end?: string;
  variant?: "dark" | "cream";
  className?: string;
  width?: number;
}

/**
 * Spine — the dotted vertical track + solid bronze fill used in
 * Methodology. Extracted so First Principles' scroll progress rail
 * and any future cards can reuse it.
 */
export default function Spine({
  triggerSelector,
  start = "top center",
  end = "bottom center",
  variant = "cream",
  className,
  width = 1,
}: Props) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fill = fillRef.current;
    const wrap = wrapRef.current;
    if (!fill || !wrap) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = triggerSelector
      ? document.querySelector<HTMLElement>(triggerSelector) ?? wrap.parentElement!
      : wrap.parentElement!;

    gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });
    const tween = gsap.to(fill, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger, start, end, scrub: 0.4 },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [triggerSelector, start, end]);

  return (
    <div
      ref={wrapRef}
      className={`sys-spine is-${variant} ${className ?? ""}`}
      style={{ ["--spine-width" as string]: `${width}px` }}
      aria-hidden="true"
    >
      <span className="sys-spine-track" />
      <span ref={fillRef} className="sys-spine-fill" />
    </div>
  );
}
