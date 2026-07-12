import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
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
      {/* Dedicated contact photograph: two lights on a dark plain — the two doors. */}
      <PageCommand
        protocol="Contact · General channel"
        stamp="KELWIN/OS · INBOUND"
        titleTop="Two doors."
        titleBottom="Take the one that fits."
        lede="If you already suspect something structural is off, the audit is the serious door — fixed scope, qualification first. If you're still mapping the space, this channel exists so you don't have to pretend otherwise. Both land with the founding team."
        code="INBOUND · OPEN"
        status="A human answers"
        image="/contact-lights.webp"
        imagePosition="50% 46%"
      />
      <ContactChannel />
      <Footer />
    </>
  );
}
