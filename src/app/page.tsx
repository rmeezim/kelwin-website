"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/sections/HeroSection";
import DiagnosticReframe from "@/components/sections/DiagnosticReframe";
import RevenueOS from "@/components/sections/RevenueOS";
import FirstPrinciples from "@/components/sections/FirstPrinciples";
import OperatingPrincipleBand from "@/components/sections/OperatingPrincipleBand";
import Methodology from "@/components/sections/Methodology";
import ProtocolSeam from "@/components/ui/ProtocolSeam";

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
      <RevenueOS />
      <ProtocolSeam
        label="Protocol 02 / Operating Principles"
        reading="06 Principles · V2.4"
      />
      <FirstPrinciples />
      <ProtocolSeam
        label="Protocol 03 / System Implementation"
        reading="04 Phases · Continuous"
      />
      <OperatingPrincipleBand />
      <Methodology />
    </main>
  );
}
