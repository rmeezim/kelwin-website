import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalDoc from "@/components/sections/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy Policy — Kelwin",
  description:
    "What Kelwin collects (very little), what happens when you write to us, and your rights. No cookies, no trackers, no analytics.",
};

// [EDIT ME · LEGAL REVIEW] Careful draft, not legal advice — have counsel
// confirm before relying on it. It is written to match how the site
// actually works today (static, no cookies, no analytics, mailto forms);
// if you ever add analytics, a CRM, or a booking tool, this page must
// change the same day.

const SECTIONS = [
  {
    n: "L·01",
    title: "The short version",
    paras: [
      "This website sets no cookies, runs no analytics, and embeds no trackers. The forms on this site do not send data to us over the network — they open your own email client, and nothing leaves your device until you press send. What we hold about you is what you choose to email us. That's the complete system.",
    ],
  },
  {
    n: "L·02",
    title: "What we collect, and how",
    paras: [
      "When you write to us — through the contact form, the audit qualification, the bench clearance request, or plain email — we receive whatever you include: typically your name, company, company email address, and your message. This arrives as ordinary email and is stored in our email account. We do not enter it into a CRM, marketing platform, or automated sequence.",
      "The website itself collects nothing. There is no account system, no comment system, and no form that posts to a server we run.",
    ],
  },
  {
    n: "L·03",
    title: "Hosting logs",
    paras: [
      "The site is served by GitHub Pages (GitHub, Inc.). Like nearly all web hosts, GitHub may log technical request data — such as IP addresses — for security and operational purposes. That logging is governed by GitHub's own privacy statement; we do not receive or use it.",
    ],
  },
  {
    n: "L·04",
    title: "How we use what you send",
    paras: [
      "To reply to you, to prepare for and run an engagement you've asked about, and to keep a record of the correspondence. If you asked to receive something ongoing — field notes, Lab previews, the bench list — we use your address for exactly that and nothing else.",
      "We do not sell, rent, or share your information with third parties for their marketing. We do not enrich, profile, or score it.",
    ],
  },
  {
    n: "L·05",
    title: "Retention",
    paras: [
      "We keep correspondence as long as it's useful for the relationship it belongs to, or as long as the law requires. Ask us to delete your correspondence and we will, unless a legal obligation requires keeping it.",
    ],
  },
  {
    n: "L·06",
    title: "Your rights",
    paras: [
      "Depending on where you live, you may have rights to access, correct, delete, or receive a copy of your personal data, and to object to or restrict certain processing. Because our entire system is an email inbox, exercising them is simple: write to audit@kelwin.co and we'll act on it within a reasonable time, and in any case within the window your local law sets.",
    ],
  },
  {
    n: "L·07",
    title: "Client engagement data",
    paras: [
      "Inside an engagement, access to your systems is governed by the engagement agreement, not this policy — read-only where possible, documented, and returned or destroyed at exit. Anything the Lab learns from engagement telemetry is used in anonymized, aggregated form only, as the engagement agreement spells out.",
    ],
  },
  {
    n: "L·08",
    title: "Changes to this policy",
    paras: [
      "If the site ever starts collecting more than described here — analytics, a booking tool, a real form backend — this policy changes the same day, the effective date above changes with it, and the material change is noted here.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <LegalDoc
        title="Privacy policy"
        docId="LEGAL · K-PRIV/01"
        effective="JULY 2026"
        intro="Kelwin's whole data practice fits on one page, because the honest answer to 'what do you collect?' is: almost nothing. Here is the complete list."
        sections={SECTIONS}
      />
      <Footer />
    </>
  );
}
