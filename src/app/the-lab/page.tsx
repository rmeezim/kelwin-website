import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
      <LabConsole />
      <Footer />
    </>
  );
}
