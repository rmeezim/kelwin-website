import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import CapabilityDetail from "@/components/sections/CapabilityDetail";
import { INFRASTRUCTURE } from "../capability-data";

export const metadata: Metadata = {
  title: "GTM Infrastructure — Kelwin",
  description:
    "Deliverability engineering, data pipelines, outbound engines, omnichannel orchestration, and CRM architecture — the documented machine that carries your story to buyers.",
};

export default function GtmInfrastructurePage() {
  return (
    <>
      <Navbar />
      {/* The strata: the stack, as geology — the infrastructure job. */}
      <PageCommand
        protocol="Capability C·02 · GTM Infrastructure"
        stamp="KELWIN/OS · THE MACHINE"
        titleTop="The machine that carries"
        titleBottom="the message."
        lede="Deliverability, data, sequencing, orchestration, CRM — the unglamorous engineering that decides whether your story ever reaches a buyer. Built in your stack, documented in your language, yours when we leave."
        code="C·02 · INFRASTRUCTURE"
        status="Install + retainer"
        image="/strata-layers.webp"
        imagePosition="50% 30%"
      />
      <CapabilityDetail data={INFRASTRUCTURE} />
      <Footer />
    </>
  );
}
