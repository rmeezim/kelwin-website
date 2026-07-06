import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubpageDoc from "@/components/sections/SubpageDoc";

export const metadata: Metadata = {
  title: "About Us — Kelwin",
  description:
    "Kelwin is a GTM systems partner for B2B companies — revenue infrastructure you keep, not activity you rent.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <SubpageDoc
        protocol="The Firm · About"
        title={["Built to end", "the rebuild cycle."]}
        lede="Most B2B companies rebuild their go-to-market from scratch every couple of years — new agency, new playbook, new pipeline, same ceiling. Kelwin exists because we think that cycle is an architecture problem, not an effort problem."
        blocks={[
          {
            kicker: "What Kelwin is",
            body: [
              "Kelwin is a GTM systems partner and advisory firm for serious B2B companies. We are not a lead generation agency: agencies rent you activity — campaigns, sequences, SDR hours — that stops the day the contract does. We install revenue infrastructure your team owns and operates: the narrative system that decides what the market hears, the omnichannel motion that puts it in front of buyers, and the intelligence layer that feeds back what works.",
            ],
          },
          {
            kicker: "How we operate",
            body: [
              "Small senior pods, fixed scopes, and everything documented in your language and living in your stack. Every engagement begins the same way — with the System Audit — so the work starts from a diagnosis rather than a pitch. When we leave, the system stays; if it stops working the day we leave, we built it wrong.",
            ],
            bullets: [
              { title: "Diagnosis before prescription", desc: "No engagement starts without the audit's readout." },
              { title: "Assets, not retainers", desc: "Six transferable artifacts, yours outright." },
              { title: "One system, compounding", desc: "Each quarter deposits into the next — no resets." },
            ],
          },
          {
            kicker: "The sister company",
            body: [
              "Kelwin is the sister company of Plurel, the creative and performance division. Plurel makes brands seen; Kelwin makes revenue systematic. The two share ingredients — the same craft standards, the same refusal of template work — expressed in different postures: Plurel warm and expressive, Kelwin precise and infrastructural.",
            ],
          },
          {
            kicker: "Where we're headed",
            body: [
              "The advisory work funds a longer project: The Lab, a GTM intelligence product that turns what we learn across installs into standing instrumentation. It isn't public yet — when it is, it will be announced here first.",
            ],
          },
        ]}
        cta={{
          label: "Begin with the audit",
          href: "/audit",
          note: "Fixed scope · ten working days · the readout is yours to keep.",
        }}
      />
      <Footer />
    </>
  );
}
