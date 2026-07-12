import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import LabBriefing from "@/components/sections/LabBriefing";

export const metadata: Metadata = {
  title: "The Lab — Kelwin",
  description:
    "A briefing on the end of GTM software: Kelwin's thesis, the instruments being built against it, and the Early Access Protocol for operators who want in before the market does.",
};

export default function TheLabPage() {
  return (
    <>
      <Navbar />
      {/* Dedicated Lab photograph: star trails over the instrument ridge. */}
      <PageCommand
        protocol="The Lab · R&D Briefing"
        stamp="K-LAB · CONTROLLED CIRCULATION"
        titleTop="A briefing on the end"
        titleBottom="of GTM software."
        lede="What follows is Kelwin's working thesis, the instruments we're building against it, and the protocol for getting access before the market does. Read it as a memo, not a launch page."
        code="K-LAB/BRIEF · 01"
        status="Build 0.5 · active"
        chips={[
          { label: "In development", live: true },
          { label: "AI-native" },
          { label: "Install-trained" },
        ]}
        image="/lab-startrails.webp"
        imagePosition="70% 45%"
      />
      <LabBriefing />
      <Footer />
    </>
  );
}
