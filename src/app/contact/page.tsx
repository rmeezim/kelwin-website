import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactChannel from "@/components/sections/ContactChannel";

export const metadata: Metadata = {
  title: "Get in Touch — Kelwin",
  description:
    "The general channel — questions, information requests, partnerships, press. Straight to the founding team; no CRM, no sequence.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactChannel />
      <Footer />
    </>
  );
}
