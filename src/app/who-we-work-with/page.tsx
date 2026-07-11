import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "@/components/sections/FirmPages.css";

export const metadata: Metadata = {
  title: "Who We Work With — Kelwin",
  description:
    "The companies Kelwin takes on — told as the situations they're actually in, not a persona grid. And the honest list of who we turn away.",
};

const VIGNETTES = [
  {
    n: "V·01",
    tag: "The founder-seller",
    title: "You're still the best rep the company has — and it's a trap.",
    body: "Deals close when you're in the room. The narrative lives in your head, the important emails get written at 11pm, and every attempt to delegate the pitch has come back sounding like a stranger wrote it. Revenue is real; it just doesn't survive your absence.",
    turn: "What changes: your instincts get written down as a system — a language other people can carry into rooms you're not in.",
  },
  {
    n: "V·02",
    tag: "The plateaued motion",
    title: "The playbook that got you here has stopped compounding.",
    body: "You've got SDRs, sequences, a tech stack that cost real money — and a pipeline chart that's been flat for four quarters. Every quarter starts with a new campaign and ends with the same retro. Nobody can say what was learned, because nothing was kept.",
    turn: "What changes: the resets stop. Signal, language, and learning start carrying forward — the quarter deposits instead of evaporating.",
  },
  {
    n: "V·03",
    tag: "The misheard category",
    title: "Buyers keep filing you next to the wrong competitors.",
    body: "The product is genuinely different, and it doesn't matter — because the market maps you onto whatever it already knows. Committees compare you against incumbents you don't resemble, on criteria you'd never choose. Winning feels like arguing uphill in someone else's language.",
    turn: "What changes: the category gets architected — the problem named your way, so the comparison happens on your terms.",
  },
];

const DECLINES = [
  {
    title: "Pre-revenue",
    desc: "There's no working motion to instrument yet. Come back at first revenue — we mean it.",
  },
  {
    title: "Pure self-serve / PLG",
    desc: "Our system assumes a sales-carried deal. Different machinery, honestly not ours.",
  },
  {
    title: "Lead-list shopping",
    desc: "Renting activity is the cycle we exist to end. We'd be selling you the disease.",
  },
];

export default function WhoWeWorkWithPage() {
  return (
    <>
      <Navbar />
      <main className="firm">
        <div className="firm-stage">
          {/* ── Head ── */}
          <header>
            <div className="firm-protocol-row">
              <span className="firm-protocol">The Firm · Fit</span>
              <span className="firm-protocol-line" aria-hidden="true" />
              <span className="firm-stamp">KELWIN/OS · QUALIFICATION</span>
            </div>
            <h1 className="firm-title">
              <span className="firm-title-1">Not for everyone.</span>
              <span className="firm-title-2">By design.</span>
            </h1>
            <p className="firm-lede">
              A revenue system only compounds inside a company built to carry
              it. Instead of a persona grid, here are the three situations we
              keep being hired into — told the way they actually feel from
              inside. If one reads like your Tuesday, we should talk.
            </p>
          </header>

          {/* ── Vignettes ── */}
          <section className="firm-section" aria-label="Who we work with">
            <div className="firm-section-head">
              <span className="firm-kicker">Three situations</span>
              <span className="firm-section-line" aria-hidden="true" />
              <span className="firm-section-note">Told from inside</span>
            </div>
            <div className="firm-vignettes">
              {VIGNETTES.map((v) => (
                <article className="firm-vignette" key={v.n}>
                  <div className="firm-vignette-head">
                    <span className="firm-vignette-num">{v.n}</span>
                    <span className="firm-vignette-tag">{v.tag}</span>
                  </div>
                  <h2 className="firm-vignette-title">{v.title}</h2>
                  <p className="firm-vignette-body">{v.body}</p>
                  <p className="firm-vignette-turn">{v.turn}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Where we say no ── */}
          <section className="firm-section" aria-label="Where we say no">
            <div className="firm-section-head">
              <span className="firm-kicker">Where we say no</span>
              <span className="firm-section-line" aria-hidden="true" />
              <span className="firm-section-note">In both directions</span>
            </div>
            <div className="firm-declines">
              {DECLINES.map((d) => (
                <div className="firm-decline" key={d.title}>
                  <span className="firm-decline-title">
                    <span className="firm-decline-mark" aria-hidden="true" />
                    {d.title}
                  </span>
                  <p className="firm-decline-desc">{d.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="firm-pull">
            Qualifying out costs you nothing — and it keeps the yes meaning
            something when we say it.
          </p>

          {/* ── Foot ── */}
          <footer className="firm-foot">
            <p className="firm-coda">
              If one of those three read like your company, the audit will
              read like your diagnosis.
            </p>
            <div className="firm-foot-actions">
              <DiagnosticMethodCTA
                href="/audit"
                label="See if the audit fits"
                variant="signal"
              />
              <ArrowLink href="/contact" label="Not sure? Ask us directly" tone="sand" />
            </div>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}
