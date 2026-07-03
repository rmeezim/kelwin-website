"use client";

import { useEffect, useRef } from "react";

// Bronze ring that follows the cursor with a slight lag (~85ms). Scales
// to 1.4× and brightens on hover over interactive elements. Hidden on
// touch and reduced-motion. Runs entirely off GPU-friendly transforms.
const INTERACTIVE = [
  "a", "button", "[role=button]",
  // Section-specific hot zones — every place the cursor should "lock in"
  // and read as targeting a clickable / interrogable surface.
  ".reframe-card",
  ".lx-stack-card",
  ".artifact-panel",
  ".phase",
  ".sys-jump-tick",
  ".rail-segment",
  ".lx-index-item",
  ".loop-dot",
  ".nei-spec-cta",
].join(", ");

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    let raf = 0;
    let hovering = false;

    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as Element | null;
      const isInteractive = !!el && !!el.closest(INTERACTIVE);
      if (isInteractive !== hovering) {
        hovering = isInteractive;
        ring!.classList.toggle("is-hover", hovering);
      }
    }

    function tick() {
      // Damped follow — 0.18/frame ≈ ~85ms lag at 60fps
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      ring!.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    }

    function onLeave() { ring!.style.opacity = "0"; }
    function onEnter() { ring!.style.opacity = "1"; }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ringRef} className="custom-cursor" aria-hidden="true" />;
}
