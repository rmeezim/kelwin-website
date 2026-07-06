import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubpageDoc from "@/components/sections/SubpageDoc";

export const metadata: Metadata = {
  title: "Reports — Kelwin",
  description:
    "Engagement readouts, published with client permission — system state before and after the install.",
};

export default function ReportsPage() {
  return (
    <>
      <Navbar />
      <SubpageDoc
        protocol="Resources · Reports"
        title={["Readouts,", "published with permission."]}
        lede="A report here is an engagement readout: the system state we found, what was installed, and what the instrumentation showed after. We publish them only as clients clear them for release — which means this index grows slowly, and everything on it is real."
        blocks={[
          {
            kicker: "What a report contains",
            bullets: [
              { title: "The diagnosis", desc: "The constraint the audit named, in the client's own numbers." },
              { title: "The install", desc: "What was built across narrative, channels, and intelligence." },
              { title: "The readout", desc: "What the system reported after — including what didn't work." },
            ],
          },
        ]}
        terminal={[
          "reports.index — no releases cleared yet",
          "readouts are published as clients approve them",
        ]}
        cta={{
          label: "Request the audit",
          href: "/audit",
          note: "Your engagement's readout is yours to keep — publishing it is always your call.",
        }}
      />
      <Footer />
    </>
  );
}
