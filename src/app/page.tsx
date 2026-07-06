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
import Methodology from "@/components/sections/Methodology";
import FitStrip from "@/components/sections/FitStrip";
import AssetInventory from "@/components/sections/AssetInventory";
import FaqSection from "@/components/sections/FaqSection";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // One global refresh after all sections have mounted and laid out,
    // so each pinned/scrubbed trigger measures the final stacked layout.
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main>
      {/* Page-level navbar: sticky for the entire scroll, compacting into
          glass once scrolling starts. */}
      <Navbar />
      <HeroSection />
      <DiagnosticReframe />
      <StructuralEvidence />
      <RevenueOS />
      <SystemArchitecture />
      <StateChange />
      <OperatingPrincipleBand />
      <Methodology />
      <FitStrip />
      <AssetInventory />
      <FaqSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
