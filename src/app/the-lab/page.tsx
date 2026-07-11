import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import LabConsole from "@/components/sections/LabConsole";

export const metadata: Metadata = {
  title: "The Lab — Kelwin",
  description:
    "Kelwin's R&D arm: AI-native GTM software trained on what real installs teach — signal detection, narrative telemetry, and routing in one console. In development; previews ship to the waitlist.",
};

export default function TheLabPage() {
  return (
    <>
      <Navbar />
      {/* Dedicated Lab photograph: star trails over the instrument ridge. */}
      <PageCommand
        protocol="The Lab · R&D"
        stamp="KELWIN/OS · BUILD 0.5"
        titleTop="Where the practice"
        titleBottom="becomes product."
        lede="The Lab is Kelwin's R&D arm: everything our installs teach us — signal patterns, narrative telemetry, routing logic — is being built into AI-native GTM software. The consulting keeps it honest; the product makes it permanent."
        code="KELWIN/OS · R&D"
        status="Build 0.5 · active"
        chips={[
          { label: "In development", live: true },
          { label: "AI-native" },
          { label: "Install-trained" },
        ]}
        image="/lab-startrails.webp"
        imagePosition="70% 45%"
      />
      <LabConsole />
      <Footer />
    </>
  );
}
