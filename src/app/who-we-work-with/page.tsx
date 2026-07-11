import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import FirmFit from "@/components/sections/FirmFit";

export const metadata: Metadata = {
  title: "Who We Work With — Kelwin",
  description:
    "A fit calibration that reads in both directions, the three situations Kelwin keeps being hired into, and the honest list of who we send away.",
};

export default function WhoWeWorkWithPage() {
  return (
    <>
      <Navbar />
      {/* Dedicated interior photograph: pre-dawn dune field, ridge crop. */}
      <PageCommand
        protocol="The Firm · Fit"
        stamp="KELWIN/OS · QUALIFICATION"
        titleTop="Not for everyone."
        titleBottom="By design."
        lede="A revenue system only compounds inside a company built to carry it. Here are the three situations we keep being hired into — told the way they feel from inside — and the honest list of who we send away."
        code="FILE 02 · FIT"
        status="Gate open"
        image="/dune-predawn.webp"
        imagePosition="86% 55%"
      />
      <FirmFit />
      <Footer />
    </>
  );
}
