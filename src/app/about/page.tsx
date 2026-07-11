import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageCommand from "@/components/layout/PageCommand";
import FirmAbout from "@/components/sections/FirmAbout";

export const metadata: Metadata = {
  title: "About Us — Kelwin",
  description:
    "Kelwin is a GTM systems partner for B2B companies — revenue infrastructure you keep, not activity you rent. The firm registry, the founder's memo, and the operating week.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      {/* IMAGE SWAP: replace `image` with the dedicated About photograph
          (pre-dawn dune field, left negative space) when it lands. */}
      <PageCommand
        protocol="The Firm · About"
        stamp="KELWIN/OS · THE PEOPLE"
        titleTop="Built to end"
        titleBottom="the rebuild cycle."
        lede="Most B2B companies rebuild their go-to-market every couple of years — new agency, new playbook, new pipeline, same ceiling. Kelwin exists because that cycle is an architecture problem, not an effort problem."
        code="FILE 01 · THE FIRM"
        status="Operational"
        imagePosition="26% 42%"
      />
      <FirmAbout />
      <Footer />
    </>
  );
}
