import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalDoc from "@/components/sections/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of Service — Kelwin",
  description:
    "The terms that govern use of the Kelwin website — content, specimens, intellectual property, and the boundary between this site and an engagement agreement.",
};

// [EDIT ME · LEGAL REVIEW] Careful draft, not legal advice — have counsel
// confirm, and set the governing-law jurisdiction in L·08 before relying
// on this page.

const SECTIONS = [
  {
    n: "L·01",
    title: "What these terms cover",
    paras: [
      "These terms govern your use of this website. They do not govern consulting engagements, audits, or Lab participation — each of those runs on its own written agreement, and where the two differ, the engagement agreement wins.",
      "By using the site you accept these terms. If you don't accept them, don't use the site.",
    ],
  },
  {
    n: "L·02",
    title: "The content is information, not advice",
    paras: [
      "Everything published here — field notes, methodology descriptions, diagnostics, dashboards — is general information about how we think and work. It is not consulting advice for your situation, and acting on it is your own decision. If you want advice that accounts for your company, that's what the audit is for.",
    ],
  },
  {
    n: "L·03",
    title: "Specimens and illustrative artifacts",
    paras: [
      "Artifacts labeled 'Specimen' — console readouts, case dossier figures, telemetry captures, representative deployment environments — show the real structure of our work with illustrative data. They are labeled precisely so you don't mistake them for live client results. We don't publish invented proof, and specimens are not promises of outcomes.",
    ],
  },
  {
    n: "L·04",
    title: "Intellectual property",
    paras: [
      "The site's content, design, diagrams, and text belong to Kelwin. You may read, link to, and quote it with attribution. You may not republish substantial portions, scrape it into datasets or model training corpora, or pass the frameworks off as your own commercial offering without written permission.",
    ],
  },
  {
    n: "L·05",
    title: "Acceptable use",
    paras: [
      "Don't attempt to disrupt the site, probe or attack its hosting, misrepresent your identity when writing to us, or use our channels to send spam. The contact channels exist for genuine correspondence; we reserve the right to ignore anything else.",
    ],
  },
  {
    n: "L·06",
    title: "No warranties",
    paras: [
      "The site is provided as-is and as-available. We work to keep it accurate and online, but we make no warranties — express or implied — about availability, accuracy, or fitness for a particular purpose. Content may change or be removed at any time.",
    ],
  },
  {
    n: "L·07",
    title: "Limitation of liability",
    paras: [
      "To the maximum extent the law allows, Kelwin is not liable for indirect, incidental, or consequential damages arising from your use of this website or reliance on its content. Nothing in these terms limits liability that cannot lawfully be limited.",
    ],
  },
  {
    n: "L·08",
    title: "Governing law",
    paras: [
      "These terms are governed by the laws of [JURISDICTION — EDIT ME], and disputes arising from them belong to the courts of that jurisdiction, unless mandatory local law says otherwise.",
    ],
  },
  {
    n: "L·09",
    title: "Changes",
    paras: [
      "We may update these terms; the effective date above moves when we do. Continued use of the site after a change means you accept the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <LegalDoc
        title="Terms of service"
        docId="LEGAL · K-TERMS/01"
        effective="JULY 2026"
        intro="The short, readable version of what governs this website — including the honesty rule behind every artifact labeled 'Specimen'."
        sections={SECTIONS}
      />
      <Footer />
    </>
  );
}
