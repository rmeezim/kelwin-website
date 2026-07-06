import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubpageDoc from "@/components/sections/SubpageDoc";

export const metadata: Metadata = {
  title: "GTM Intelligence — Kelwin",
  description:
    "The instrumentation and calibration layer: measure what the motion reports, retune quarterly, keep the system compounding.",
};

export default function GtmIntelligencePage() {
  return (
    <>
      <Navbar />
      <SubpageDoc
        protocol="Capability · 03"
        title={["GTM Intelligence", "& Calibration"]}
        lede="A revenue system drifts the moment the market moves. The intelligence layer is what makes the whole install compound instead of decay: instrumentation that reports what's working, and a standing calibration cadence that feeds it back into the narrative and the channels."
        blocks={[
          {
            kicker: "The problem it solves",
            body: [
              "Most teams measure activity — sends, dials, meetings — and stay blind to causes. Without a feedback layer, learning evaporates between quarters: reps rotate, campaigns end, and the company re-learns the same lessons at full price.",
            ],
          },
          {
            kicker: "What we build",
            bullets: [
              { title: "Instrumentation", desc: "The readouts that matter — signal quality, sequence health, narrative resonance — wired into your stack." },
              { title: "Quarterly retune", desc: "A standing calibration review: what slipped, what compounds, what the language should say next." },
              { title: "The returning signal", desc: "Findings route back into narrative and channels — the loop that closes the system." },
            ],
          },
          {
            kicker: "What changes",
            body: [
              "The system gets smarter with age instead of staler. Every cycle's learning is captured as an asset — not a memory — so the curve bends upward: this is the layer that turns the sawtooth reset pattern into a compounding one.",
            ],
          },
        ]}
        cta={{
          label: "Begin with the audit",
          href: "/audit",
          note: "The audit installs the first readout — you keep it either way.",
        }}
      />
      <Footer />
    </>
  );
}
