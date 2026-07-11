import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReportsLibrary from "@/components/sections/ReportsLibrary";

export const metadata: Metadata = {
  title: "Reports — Kelwin",
  description:
    "The Kelwin document registry — research on the state of B2B GTM, field specs, and engagement readouts published with client permission.",
};

export default function ReportsPage() {
  return (
    <>
      <Navbar />
      <ReportsLibrary />
      <Footer />
    </>
  );
}
