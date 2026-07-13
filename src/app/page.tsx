"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import DiagnosticReframe from "@/components/sections/DiagnosticReframe";
import StructuralEvidence from "@/components/sections/StructuralEvidence";
import RevenueOS from "@/components/sections/RevenueOS";
import SystemArchitecture from "@/components/sections/SystemArchitecture";
import StateChange from "@/components/sections/StateChange";
import OperatingPrincipleBand from "@/components/sections/OperatingPrincipleBand";
import SectionBand from "@/components/ui/SectionBand";
import Methodology from "@/components/sections/Methodology";
import FitStrip from "@/components/sections/FitStrip";
import AssetInventory from "@/components/sections/AssetInventory";
import BeforeAfter from "@/components/sections/BeforeAfter";
import FaqSection from "@/components/sections/FaqSection";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero dim — as the diagnostic sheet slides up over the pinned hero,
    // a charcoal veil scrubs in beneath it so the hero recedes like a
    // surface falling into shadow. Ends exactly when the sheet reaches
    // the top of the viewport (== where the reframe's own pin begins).
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dim: gsap.core.Tween | undefined;
    if (!reduced) {
      dim = gsap.to(".cover-hero-dim", {
        opacity: 0.62,
        ease: "none",
        scrollTrigger: {
          trigger: ".cover-sheet",
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    // One global refresh after all sections have mounted and laid out,
    // so each pinned/scrubbed trigger measures the final stacked layout.
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      window.clearTimeout(t);
      if (dim) {
        dim.scrollTrigger?.kill();
        dim.kill();
      }
    };
  }, []);

  return (
    <main>
      {/* Page-level navbar: sticky for the entire scroll, compacting into
          glass once scrolling starts. */}
      <Navbar />
      {/* Cover stack: the hero pins in place (sticky) while the diagnostic
          section rides up over it like a sheet laid on the bench. Native
          scroll only — the sheet lands, then the reframe's own pinned
          cinematic takes over. Inert under prefers-reduced-motion. */}
      <div className="cover-stack">
        <div className="cover-hero">
          <HeroSection />
          <div className="cover-hero-dim" aria-hidden="true" />
        </div>
        <div className="cover-sheet">
          <DiagnosticReframe />
        </div>
      </div>
      <StructuralEvidence />
      {/* the stack, as geology — strata photograph introduces the
          four-layer infrastructure story */}
      <SectionBand
        image="/strata-layers.webp"
        position="50% 48%"
        caption="The stack · Four layers, one system"
        stamp="KELWIN/OS · INFRASTRUCTURE"
      />
      <RevenueOS />
      <SystemArchitecture />
      <StateChange />
      <OperatingPrincipleBand />
      <Methodology />
      <FitStrip />
      <AssetInventory />
      <BeforeAfter />
      <FaqSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
