"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
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
      const ctaTop     = cta.getBoundingClientRect().top;
      const panelTop   = panel.getBoundingClientRect().top;

      // End the panel above the CTA row (not below it) — the compacted
      // HUD leaves the hero's lower-right corner to the blueprint visual.
      const top    = headingTop - panelTop;
      const height = ctaTop - headingTop;
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

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    // The hero owns the first viewport outright: 100svh minus the navbar's
    // resting height (70px), since the navbar now lives at page level so it
    // can stay sticky for the whole scroll.
    <section id="hero" className="relative bg-surface flex flex-col overflow-x-hidden min-h-[calc(100svh-70px)]">
      {/* Key visual — a dune landscape at last light: the territory the site
          keeps mapping, rendered as a cinematic photograph. The image fades
          up from black on load; a heavy left-and-bottom charcoal scrim keeps
          the text column and the section seam legible while the warm ridge
          glows through on the right. Grain (site-wide) sits over it. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 1.3, ease: "easeOut" }}
      >
        {/* the photograph */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${basePath}/hero-dune.webp)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "72% 58%",
          }}
        />
        {/* scrim — left-heavy for the text, top for the navbar, bottom fade
            into the charcoal so the hero dissolves into the next section */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(103deg, rgba(17,15,10,0.96) 0%, rgba(17,15,10,0.86) 32%, rgba(17,15,10,0.52) 64%, rgba(17,15,10,0.34) 100%), linear-gradient(to bottom, rgba(17,15,10,0.62) 0%, rgba(17,15,10,0) 20%, rgba(17,15,10,0) 62%, rgba(17,15,10,0.9) 92%, rgba(17,15,10,1) 100%)",
          }}
        />
      </motion.div>
      {/* Centered content wrapper — caps horizontal sprawl on huge displays;
          flex-1 + justify-center holds the argument mid-viewport now that
          the section is full-height. */}
      <div className="max-w-[96rem] mx-auto w-full flex flex-col flex-1 justify-center">

      {/* Main content row */}
      <div className="flex">

        {/* Left — text content */}
        <div className="relative z-10 flex flex-col w-full md:w-[58%] px-6 md:px-14 lg:px-20 py-10 md:py-12">

          {/* Location + Time — system status line, leads the page reveal */}
          <FadeIn delay={0} duration={0.5} y={0} className="mb-6">
            <LocationTime />
          </FadeIn>

          {/* Heading — forced 3-line layout, per-line L→R scramble */}
          <div ref={headingRef}>
            <h1 className="font-heading font-normal text-cream leading-[0.95] tracking-[-0.03em] text-[clamp(2.4rem,6vw,5.6rem)] max-w-[720px]">
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
              className="w-10 h-0.5 mt-[30px] mb-[20px]"
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
              text="We are a GTM systems partner & advisory for B2B teams that want to turn narrative, omnichannel strategy, and market intelligence into repeatable pipeline systems."
              delay={700}
              duration={500}
              lineStagger={200}
              mode="cascade"
            />
          </p>

          {/* CTAs — flicker in (no slide) */}
          <div ref={ctaRef}>
            <motion.div
              className="mt-8 md:mt-9 flex items-center gap-8"
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
            {/* Expectation-setting micro-copy — tells a time-guarded exec
                exactly what the button starts (Gemini audit: CTA friction). */}
            <motion.p
              className="font-mono mt-4"
              style={{
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "var(--text-faint)",
                fontFamily: "var(--font-mono)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0 : 2.3, duration: 0.5 }}
            >
              A fixed-scope diagnostic — ten working days, and the readout is
              yours to keep.
            </motion.p>
          </div>
        </div>

        {/* Right — HUD panel */}
        <div ref={panelRef} className="hidden md:block md:w-[42%] relative">
          <div
            className="absolute overflow-hidden"
            style={{ top: px(hudTop), height: px(hudHeight), left: "4%", right: "17%" }}
          >
            <HeroHud />
          </div>
        </div>
      </div>

      </div>
    </section>
  );
}
