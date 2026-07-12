import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import CapabilityDetail from "@/components/sections/CapabilityDetail";
import { NARRATIVE } from "../capability-data";

export const metadata: Metadata = {
  title: "Narrative Systems — Kelwin",
  description:
    "Positioning, message architecture, sales language, and proof — built as one versioned system every channel inherits. The full service manifest, the evidence, and how the engagement lands.",
};

export default function NarrativeSystemsPage() {
  return (
    <>
      <Navbar />
      {/* The beacon: one clear signal in a dark field — the narrative job. */}
      <PageCommand
        protocol="Capability C·01 · Narrative Systems"
        stamp="KELWIN/OS · WHAT THE MARKET HEARS"
        titleTop="Decide what the market"
        titleBottom="hears."
        lede="Buyers run most of the journey without you in the room. Narrative Systems makes what they hear deliberate — positioning, language, and proof built as one versioned system that every channel and every rep inherits."
        code="C·01 · NARRATIVE"
        status="Install + retainer"
        image="/band-beacon.webp"
        imagePosition="42% 62%"
      />
      <CapabilityDetail data={NARRATIVE} />
      <Footer />
    </>
  );
}
