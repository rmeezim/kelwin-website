import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import InsightsIndex from "@/components/sections/InsightsIndex";

export const metadata: Metadata = {
  title: "Insights — Kelwin",
  description:
    "Field notes from the install base — what we're learning about narrative, channels, and GTM intelligence.",
};

export default function InsightsPage() {
  return (
    <>
      <Navbar />
      {/* Dedicated library photograph: deckle-edged paper on dark slate. */}
      <PageCommand
        protocol="Resources · Insights"
        stamp="KELWIN/OS · FIELD NOTES · VOL 01"
        titleTop="Field notes"
        titleBottom="from the install base."
        lede="Working notes from live systems — not thought leadership. What we publish here is the operational residue of real installs: signal patterns, deliverability mechanics, narrative decisions and what they did to pipeline."
        code="FIELD NOTES · VOL 01"
        status="Publishing"
        image="/docs-paper.webp"
        imagePosition="78% 30%"
      />
      <InsightsIndex />
      <Footer />
    </>
  );
}
