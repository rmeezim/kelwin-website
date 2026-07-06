import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubpageDoc from "@/components/sections/SubpageDoc";

export const metadata: Metadata = {
  title: "Insights — Kelwin",
  description:
    "Field notes from the install base — what we're learning about narrative, channels, and GTM intelligence.",
};

export default function InsightsPage() {
  return (
    <>
      <Navbar />
      <SubpageDoc
        protocol="Resources · Insights"
        title={["Field notes", "from the install base."]}
        lede="Working notes from live systems — not thought leadership. What we publish here is the operational residue of real installs: signal patterns, deliverability mechanics, narrative decisions and what they did to pipeline."
        blocks={[
          {
            kicker: "What ships here",
            bullets: [
              { title: "Signal patterns", desc: "Which buying signals preceded revenue — and which were noise." },
              { title: "Channel mechanics", desc: "Deliverability, routing, and orchestration findings from the field." },
              { title: "Narrative operations", desc: "Language decisions and the measurable difference they made." },
            ],
          },
        ]}
        terminal={[
          "insights.log — no public entries yet",
          "first field notes are in preparation",
        ]}
        cta={{
          label: "Begin with the audit",
          href: "/audit",
          note: "The fastest way to read our thinking is the audit readout itself.",
        }}
      />
      <Footer />
    </>
  );
}
