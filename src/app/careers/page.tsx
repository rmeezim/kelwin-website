import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import FirmBench from "@/components/sections/FirmBench";

export const metadata: Metadata = {
  title: "Careers — Kelwin",
  description:
    "Kelwin hires the way it builds: slowly, on purpose. The careers console, the deal, a pod Tuesday, and the bench list for when a seat opens.",
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      {/* Dedicated Careers photograph: one line of footprints toward the lit ridge. */}
      <PageCommand
        protocol="The Firm · Careers"
        stamp="KELWIN/OS · THE BENCH"
        titleTop="We hire the way we build:"
        titleBottom="slowly, on purpose."
        lede="Kelwin runs on small senior pods, and every person on an engagement is accountable to the system it leaves behind. We add people rarely and deliberately — so this page is honest instead of aspirational."
        code="FILE 03 · BENCH"
        status="0 seats · bench open"
        image="/careers-footprints.webp"
        imagePosition="70% 50%"
      />
      <FirmBench />
      <Footer />
    </>
  );
}
