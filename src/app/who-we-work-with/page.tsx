import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubpageDoc from "@/components/sections/SubpageDoc";

export const metadata: Metadata = {
  title: "Who We Work With — Kelwin",
  description:
    "The companies Kelwin takes on: B2B teams past first revenue, founder-led or lean GTM, complex committee sales.",
};

export default function WhoWeWorkWithPage() {
  return (
    <>
      <Navbar />
      <SubpageDoc
        protocol="The Firm · Fit"
        title={["Not for everyone.", "By design."]}
        lede="A revenue system only compounds when the company it's installed in can carry it. So we qualify in both directions — the profile below is the honest version of who gets the most out of working with us."
        blocks={[
          {
            kicker: "The profile",
            bullets: [
              { title: "Past first revenue", desc: "Growth is real — just not predictable. There's a working motion to instrument, not a blank page." },
              { title: "Founder-led or lean GTM", desc: "Teams ready to own the system rather than rent activity from a rotating cast of vendors." },
              { title: "Complex, considered sales", desc: "A committee decides, and the narrative carries the deal — not a coupon at checkout." },
            ],
          },
          {
            kicker: "Industries",
            body: [
              "The system is industry-agnostic by construction — narrative, channels, and intelligence exist in every considered B2B sale — but our work concentrates where deals are won by clarity rather than volume.",
            ],
            bullets: [
              { title: "[EDIT ME] Industry 01", desc: "e.g. B2B SaaS — platform and infrastructure vendors" },
              { title: "[EDIT ME] Industry 02", desc: "e.g. Professional & financial services" },
              { title: "[EDIT ME] Industry 03", desc: "e.g. Technical products with long sales cycles" },
            ],
          },
          {
            kicker: "Where we say no",
            body: [
              "Pre-revenue startups (there's no motion to instrument yet), pure self-serve or PLG-only models (the system we build assumes a sales-carried deal), and anyone shopping for a lead list — that's activity, and renting activity is the cycle we exist to end.",
            ],
          },
        ]}
        cta={{
          label: "See if the audit fits",
          href: "/audit",
          note: "If we're not the right instrument, the readout will say so — that's the point of it.",
        }}
      />
      <Footer />
    </>
  );
}
