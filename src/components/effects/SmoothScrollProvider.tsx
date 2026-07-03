"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Global smooth scroll wrapper. Mounts a single Lenis instance for the
// entire page and synchronises it with GSAP's ScrollTrigger so the
// existing pin/scrub timelines (RevenueOS, DiagnosticReframe, hero HUD)
// continue to fire correctly. Disabled under `prefers-reduced-motion`
// and on touch input — native momentum stays intact there.
export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    // Bridge Lenis → ScrollTrigger so pinned/scrubbed sections stay in sync.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both animation systems share a clock.
    function rafHandler(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(rafHandler);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafHandler);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
