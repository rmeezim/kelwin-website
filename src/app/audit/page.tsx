import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import AuditSpec from "@/components/sections/AuditSpec";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "The System Audit — Kelwin",
  description:
    "A fixed-scope diagnostic of the narrative, outbound, and intelligence layers under your revenue. Ten working days, a written readout you keep — whether or not we go further.",
};

// The audit request page — every "Initiate System Audit" / "Audit Request"
// CTA on the site lands here. The spec sheet explains exactly what the
// audit is; its CTA is the actual request action.
export default function AuditPage() {
  return (
    <main>
      <Navbar />
      <AuditSpec />
      <Footer />
    </main>
  );
}
