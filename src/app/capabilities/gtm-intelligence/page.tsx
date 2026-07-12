import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import CapabilityDetail from "@/components/sections/CapabilityDetail";
import { INTELLIGENCE } from "../capability-data";

export const metadata: Metadata = {
  title: "GTM Intelligence — Kelwin",
  description:
    "Signal taxonomy, win/loss intelligence, resonance telemetry, and quarterly calibration — the memory and the loop that make every quarter deposit into the next.",
};

export default function GtmIntelligencePage() {
  return (
    <>
      <Navbar />
      {/* The star trails: reading the sky over time — the intelligence job. */}
      <PageCommand
        protocol="Capability C·03 · GTM Intelligence"
        stamp="KELWIN/OS · THE LOOP"
        titleTop="What gets measured"
        titleBottom="compounds."
        lede="Signals, win/loss intelligence, and resonance telemetry wired into one loop — so every quarter deposits into the next instead of resetting, and the learning your budget paid for stays yours."
        code="C·03 · INTELLIGENCE"
        status="Install + retainer"
        image="/lab-startrails.webp"
        imagePosition="30% 65%"
      />
      <CapabilityDetail data={INTELLIGENCE} />
      <Footer />
    </>
  );
}
