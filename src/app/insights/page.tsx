import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
      <InsightsIndex />
      <Footer />
    </>
  );
}
