import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubpageDoc from "@/components/sections/SubpageDoc";

export const metadata: Metadata = {
  title: "GTM Infrastructure — Kelwin",
  description:
    "Signal-based, omnichannel go-to-market infrastructure — email, social, phone, content, and events orchestrated as one system.",
};

export default function GtmInfrastructurePage() {
  return (
    <>
      <Navbar />
      <SubpageDoc
        protocol="Capability · 02"
        title={["Omnichannel", "GTM Infrastructure"]}
        lede="Demand doesn't live in one channel, so a motion built on one channel leaks. We install the orchestration layer that reads buying signals and routes the next-best touch across email, social, phone, content, and events — one system, not five silos."
        blocks={[
          {
            kicker: "The problem it solves",
            body: [
              "Single-channel outbound is a volume game with a decaying ceiling: deliverability erodes, response rates fall, and every quarter starts from zero. Buyers move across channels; a motion that can't follow the signal is optimizing a symptom.",
            ],
          },
          {
            kicker: "What we build",
            bullets: [
              { title: "Signal layer", desc: "ICP, intent, and engagement signals unified into one qualification view." },
              { title: "Orchestration", desc: "Routing logic that decides the next-best touch — and which channel carries it." },
              { title: "Channel playbooks", desc: "The plays for email, LinkedIn, phone, content, paid, and events — documented, yours." },
              { title: "Deliverability architecture", desc: "The unglamorous plumbing that keeps the motion out of spam folders." },
            ],
          },
          {
            kicker: "What changes",
            body: [
              "Effort follows signal instead of a static sequence. When a channel cools, the system reroutes rather than shouting louder — and because every play is documented in your stack, the motion survives team changes instead of living in one SDR's head.",
            ],
          },
        ]}
        cta={{
          label: "Begin with the audit",
          href: "/audit",
          note: "The audit maps how demand actually moves across your channels first.",
        }}
      />
      <Footer />
    </>
  );
}
