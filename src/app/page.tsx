"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/sections/HeroSection";
import DiagnosticReframe from "@/components/sections/DiagnosticReframe";
import StructuralEvidence from "@/components/sections/StructuralEvidence";
import RevenueOS from "@/components/sections/RevenueOS";
import SystemArchitecture from "@/components/sections/SystemArchitecture";
import StateChange from "@/components/sections/StateChange";
import Methodology from "@/components/sections/Methodology";
import FitStrip from "@/components/sections/FitStrip";
import AssetInventory from "@/components/sections/AssetInventory";
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
      <HeroSection />
      <DiagnosticReframe />
      <StructuralEvidence />
      <RevenueOS />
      <SystemArchitecture />
      <StateChange />
      <Methodology />
      <FitStrip />
      <AssetInventory />
      <FinalCTA />
      <Footer />
    </main>
  );
}
