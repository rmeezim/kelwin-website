"use client";

import { useEffect, useRef } from "react";

/**
 * AmbientGrid — site-wide cursor-reactive dot grid.
 * A near-invisible 32px dot pattern fills the viewport. A bronze radial
 * halo follows the cursor, brightening the dots inside its radius so the
 * surface reads as "reactive" without competing with content. Sits at
 * z-index 0 with pointer-events: none. Disabled on touch + reduced-motion.
 */
export default function AmbientGrid() {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const halo = haloRef.current;
    if (!halo) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      // Damped follow — 0.12/frame ≈ ~130ms lag (slower than CustomCursor's
      // 85ms) so the halo trails one beat behind the cursor and reads as
      // ambient, not chasing.
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      halo.style.setProperty("--mx", `${current.x}px`);
      halo.style.setProperty("--my", `${current.y}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ambient-grid" aria-hidden="true">
      <div className="ambient-grid-dots" />
      <div ref={haloRef} className="ambient-grid-halo" />
    </div>
  );
}
