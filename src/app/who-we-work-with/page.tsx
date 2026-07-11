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

const CHAPTERS = [
  { n: "01", id: "situations", label: "Three situations" },
  { n: "02", id: "no", label: "Where we say no" },
  { n: "03", id: "gate", label: "The gate" },
];

const VIGNETTES = [
  {
    n: "01",
    tag: "The founder-seller",
    title: "You're still the best rep the company has — and it's a trap.",
    body: "Deals close when you're in the room. The narrative lives in your head, the important emails get written at 11pm, and every attempt to delegate the pitch has come back sounding like a stranger wrote it. Revenue is real; it just doesn't survive your absence.",
    turn: "What changes: your instincts get written down as a system — a language other people can carry into rooms you're not in.",
  },
  {
    n: "02",
    tag: "The plateaued motion",
    title: "The playbook that got you here has stopped compounding.",
    body: "You've got SDRs, sequences, a tech stack that cost real money — and a pipeline chart that's been flat for four quarters. Every quarter starts with a new campaign and ends with the same retro. Nobody can say what was learned, because nothing was kept.",
    turn: "What changes: the resets stop. Signal, language, and learning start carrying forward — the quarter deposits instead of evaporating.",
  },
  {
    n: "03",
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
      <main className="fp2">
        <div className="fp2-stage">
          {/* ── Hero ── */}
          <header>
            <div className="fp2-protocol-row">
              <span className="fp2-protocol">The Firm · Fit</span>
              <span className="fp2-protocol-line" aria-hidden="true" />
              <span className="fp2-stamp">KELWIN/OS · QUALIFICATION</span>
            </div>
            <h1 className="fp2-title">
              Not for everyone. <em>By design.</em>
            </h1>
            <p className="fp2-lede">
              A revenue system only compounds inside a company built to carry
              it. Instead of a persona grid, here are the three situations we
              keep being hired into — told the way they actually feel from
              inside. If one reads like your Tuesday, we should talk.
            </p>
            <nav className="fp2-toc" aria-label="Page chapters">
              {CHAPTERS.map((c) => (
                <a className="fp2-toc-item" href={`#${c.id}`} key={c.n}>
                  <span className="fp2-toc-num">{c.n}</span>
                  {c.label}
                </a>
              ))}
            </nav>
          </header>

          {/* ── 01 · Situations ── */}
          <section className="fp2-chapter" id="situations" aria-label="Three situations">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">01</span>
              <span className="fp2-rail-kicker">Three situations</span>
              <span className="fp2-rail-note">Told from inside</span>
            </div>
            <div className="fp2-vignettes">
              {VIGNETTES.map((v) => (
                <article className="fp2-vignette" key={v.n}>
                  <span className="fp2-vignette-ghost" aria-hidden="true">{v.n}</span>
                  <span className="fp2-vignette-tag">{v.tag}</span>
                  <h2 className="fp2-vignette-title">{v.title}</h2>
                  <p className="fp2-vignette-body">{v.body}</p>
                  <p className="fp2-vignette-turn"><span>{v.turn}</span></p>
                </article>
              ))}
            </div>
          </section>

          {/* ── 02 · Where we say no ── */}
          <section className="fp2-chapter" id="no" aria-label="Where we say no">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">02</span>
              <span className="fp2-rail-kicker">Where we say no</span>
              <span className="fp2-rail-note">In both directions</span>
            </div>
            <div>
              <h2 className="fp2-h">
                Three profiles we turn away — kindly, and every time.
              </h2>
              <div className="fp2-declines">
                {DECLINES.map((d) => (
                  <div className="fp2-decline" key={d.title}>
                    <span className="fp2-decline-title">
                      <span className="fp2-decline-mark" aria-hidden="true" />
                      {d.title}
                    </span>
                    <p className="fp2-decline-desc">{d.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 03 · The gate ── */}
          <section className="fp2-chapter" id="gate" aria-label="The gate">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">03</span>
              <span className="fp2-rail-kicker">The gate</span>
            </div>
            <div>
              <h2 className="fp2-h">
                Three questions decide it — and they work in both directions.
              </h2>
              <p className="fp2-prose">
                The audit intake asks where revenue is, how deals close, and
                what the problem feels like from inside. Qualifying out costs
                you nothing and keeps the yes meaning something when we say
                it. If you&rsquo;re not sure which side of the gate
                you&rsquo;re on, that&rsquo;s exactly what the general channel
                is for.
              </p>
            </div>
          </section>

          {/* ── Close ── */}
          <footer className="fp2-close">
            <p className="fp2-close-line">
              If one of those three read like your company,{" "}
              <em>the audit will read like your diagnosis.</em>
            </p>
            <div className="fp2-close-actions">
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
