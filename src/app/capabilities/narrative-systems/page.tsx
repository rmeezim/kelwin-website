import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubpageDoc from "@/components/sections/SubpageDoc";

export const metadata: Metadata = {
  title: "Narrative Systems — Kelwin",
  description:
    "The message system, proof architecture, and category definition that decide what the market hears.",
};

export default function NarrativeSystemsPage() {
  return (
    <>
      <Navbar />
      <SubpageDoc
        protocol="Capability · 01"
        title={["Narrative Systems", undefined]}
        lede="Buyers decide most of the deal before your reps are in the room — which means the deal is decided by your narrative, not your activity. We build the narrative as a system: written down, versioned, and inherited by every channel you run."
        blocks={[
          {
            kicker: "The problem it solves",
            body: [
              "In most companies the story lives in fragments — a deck here, a founder's phrasing there, five sequences that each describe a different company. Every fragment competes with the others, and the market hears noise. Noise reads as risk, and risk stalls committees.",
            ],
          },
          {
            kicker: "What we build",
            bullets: [
              { title: "Message system", desc: "The core claims, their proof obligations, and the language every touch inherits." },
              { title: "Proof architecture", desc: "What must be evidenced, in what order, for a committee to say yes." },
              { title: "Category definition", desc: "The frame you own — so comparison happens on your terms." },
            ],
          },
          {
            kicker: "What changes",
            body: [
              "One narrative, everywhere. Email, social, phone, content, and events stop improvising and start compounding — each touch deposits into the same story instead of starting a new one. The output is a Narrative OS document your team owns: positioning, language system, and the message hierarchy every channel inherits.",
            ],
          },
        ]}
        cta={{
          label: "Begin with the audit",
          href: "/audit",
          note: "The audit reads your current narrative state before anything is rebuilt.",
        }}
      />
      <Footer />
    </>
  );
}
