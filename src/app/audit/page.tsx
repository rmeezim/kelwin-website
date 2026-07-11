import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
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
      <AuditSpec />
      <QualifyFlow />
      <Footer />
    </main>
  );
}
