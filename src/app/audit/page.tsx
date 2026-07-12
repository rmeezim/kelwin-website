import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import PageCommand from "@/components/layout/PageCommand";
import AuditSpec from "@/components/sections/AuditSpec";
import QualifyFlow from "@/components/sections/QualifyFlow";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "The System Audit — Kelwin",
  description:
    "A fixed-scope diagnostic of the narrative, outbound, and intelligence layers under your revenue. Ten working days, a written readout you keep — whether or not we go further.",
};

// The audit page — every "Initiate System Audit" / "Audit Request" CTA on
// the site lands here. The spec sheet explains exactly what the audit is;
// the qualification waterfall below it is the actual intake: three gating
// questions, then straight to booking the strategic call. High-intent
// visitors self-qualify here; everyone earlier belongs on /contact.
export default function AuditPage() {
  return (
    <main>
      <Navbar />
      {/* Dedicated audit photograph: the gate — one way in, lit. */}
      <PageCommand
        protocol="The System Audit"
        stamp="KELWIN/OS · DIAGNOSTIC"
        titleTop="One way in."
        titleBottom="Three questions wide."
        lede="Every red button on this site lands here. The audit is fixed scope — ten working days, a written readout you keep — and it starts with three questions that qualify in both directions."
        code="AUDIT · GATE"
        status="Gate active"
        image="/audit-canyon.webp"
        imagePosition="66% 50%"
      />
      <AuditSpec />
      <QualifyFlow />
      <Footer />
    </main>
  );
}
