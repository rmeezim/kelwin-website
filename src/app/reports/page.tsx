import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import CaseStudies from "@/components/sections/CaseStudies";

export const metadata: Metadata = {
  title: "Reports — Kelwin",
  description:
    "Case dossiers from the install base — the state we found, what was installed, and what the instrumentation showed after. Published as clients clear them.",
};

export default function ReportsPage() {
  return (
    <>
      <Navbar />
      {/* Dedicated library photograph: the readout stack, on slate. */}
      <PageCommand
        protocol="Resources · Reports"
        stamp="KELWIN/OS · CASE DOSSIERS"
        titleTop="The work, in readouts."
        titleBottom="Not testimonials — telemetry."
        lede="Every engagement produces a readout: the state we found, what was installed, and what the instrumentation showed after — including what didn't work. This is where those readouts publish, as clients clear them."
        code="REGISTRY · R-SERIES"
        status="Publishes as cleared"
        image="/docs-paper.webp"
        imagePosition="62% 55%"
      />
      <CaseStudies />
      <Footer />
    </>
  );
}
