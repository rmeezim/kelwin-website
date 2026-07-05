"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Navbar from "@/components/layout/Navbar";
import FadeIn from "@/components/motion/FadeIn";
import ScrambleText from "@/components/motion/ScrambleText";
import HeroCTA from "@/components/ui/HeroCTA";
import SecondaryHeroCTA from "@/components/ui/SecondaryHeroCTA";
import HeroHud from "@/components/sections/HeroHud";
import LocationTime from "@/components/sections/LocationTime";

export default function HeroSection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const reduced    = useReducedMotion();

  const [hudTop,    setHudTop]    = useState<number | string>("12%");
  const [hudHeight, setHudHeight] = useState<number | string>("55%");

  useLayoutEffect(() => {
    function measure() {
      const heading = headingRef.current;
      const cta     = ctaRef.current;
      const panel   = panelRef.current;
      if (!heading || !cta || !panel) return;

      const headingTop = heading.getBoundingClientRect().top;
      const ctaBottom  = cta.getBoundingClientRect().bottom;
      const panelTop   = panel.getBoundingClientRect().top;

      const top    = headingTop - panelTop;
      const height = ctaBottom  - headingTop;
      if (height > 0) { setHudTop(top); setHudHeight(height); }
    }

    // Measure synchronously before first paint so the HUD container has
    // its final size from t=0. Previously this was a `setTimeout(measure, 1600)`
    // to wait out font-load layout shift, which delayed the HUD's whole
    // entrance sequence by ~1.8 seconds. We get the same correctness now
    // by re-measuring on `document.fonts.ready` instead of guessing.
    measure();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const px = (v: number | string) =>
    typeof v === "number" ? `${v}px` : v;

  return (
    <section id="hero" className="relative bg-surface flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Centered content wrapper — caps horizontal sprawl on huge displays. */}
      <div className="max-w-[96rem] mx-auto w-full flex flex-col">

      {/* Main content row */}
      <div className="flex">

        {/* Left — text content */}
        <div className="relative z-10 flex flex-col w-full md:w-[58%] px-6 md:px-14 lg:px-20 py-14 md:py-20">

          {/* Location + Time — system status line, leads the page reveal */}
          <FadeIn delay={0} duration={0.5} y={0} className="mb-7 md:mb-8">
            <LocationTime />
          </FadeIn>

          {/* Heading — forced 3-line layout, per-line L→R scramble */}
          <div ref={headingRef}>
            <h1 className="font-heading font-normal text-cream leading-[0.95] tracking-[-0.03em] text-[clamp(2.52rem,6.48vw,6.12rem)] max-w-[720px]">
              <ScrambleText
                lines={["Revenue is an", "architectural", "problem."]}
                delay={100}
                duration={550}
                lineStagger={260}
              />
            </h1>
          </div>

          {/* Bronze rule */}
          <FadeIn delay={0.5} duration={0.6} y={0}>
            <div
              className="w-10 h-0.5 mt-[42px] mb-[24px]"
              style={{ backgroundColor: "#D4524E" }}
            />
          </FadeIn>

          {/* Subcopy — per-line L→R scramble. Operational, not manifesto:
              names who it's for, what we install, and what changes. */}
          <p
            className="font-body leading-[1.7] max-w-[660px]"
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(15px, calc(13px + 0.3vw), 17.5px)",
            }}
          >
            <ScrambleText
              text="Kelwin is the GTM systems partner for B2B teams whose growth works — but not predictably. We install the positioning, outbound, and intelligence beneath your pipeline, so revenue compounds instead of resetting each quarter."
              delay={700}
              duration={500}
              lineStagger={200}
              mode="cascade"
            />
          </p>

          {/* CTAs — flicker in (no slide) */}
          <div ref={ctaRef}>
            <motion.div
              className="mt-11 md:mt-14 flex items-center gap-8"
              initial={{ opacity: 0 }}
              animate={
                reduced
                  ? { opacity: 1 }
                  : { opacity: [0, 0.4, 0.08, 0.65, 0.2, 0.85, 0.45, 1] }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      delay: 1.75,
                      duration: 0.55,
                      times: [0, 0.14, 0.28, 0.44, 0.58, 0.72, 0.86, 1],
                      ease: "linear",
                    }
              }
            >
              <HeroCTA />
              <SecondaryHeroCTA />
            </motion.div>
          </div>
        </div>

        {/* Right — HUD panel */}
        <div ref={panelRef} className="hidden md:block md:w-[42%] relative">
          <div
            className="absolute left-0 overflow-hidden"
            style={{ top: px(hudTop), height: px(hudHeight), right: "15%" }}
          >
            <HeroHud />
          </div>
        </div>
      </div>

      </div>
    </section>
  );
}
