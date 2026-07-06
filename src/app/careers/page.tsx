import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SubpageDoc from "@/components/sections/SubpageDoc";

export const metadata: Metadata = {
  title: "Careers — Kelwin",
  description: "Kelwin hires the way it builds: slowly and deliberately. Open roles are listed here.",
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <SubpageDoc
        protocol="The Firm · Careers"
        title={["We hire the way we build:", "slowly, on purpose."]}
        lede="Kelwin runs on small senior pods, and every person on an engagement is accountable to the system it leaves behind. That means we add people rarely, and only when a seat is genuinely open."
        blocks={[
          {
            kicker: "Open roles",
            body: [
              "There are no open roles right now. When a seat opens — strategy, systems engineering, or narrative — it will be listed on this page before anywhere else.",
            ],
          },
          {
            kicker: "Speculative notes",
            body: [
              "If the work described on this site is the kind of work you want to do, a short note is welcome any time. No portal, no form — write to the founding team directly and tell us what you'd want to own.",
            ],
          },
        ]}
        terminal={[
          "careers.log — no open positions",
          "speculative notes → audit@kelwin.co · subject: Careers",
        ]}
      />
      <Footer />
    </>
  );
}
