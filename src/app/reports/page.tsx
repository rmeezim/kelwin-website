import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
      <CaseStudies />
      <Footer />
    </>
  );
}
