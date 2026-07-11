import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArrowLink from "@/components/ui/ArrowLink";
import "@/components/sections/FirmPages.css";

export const metadata: Metadata = {
  title: "Careers — Kelwin",
  description:
    "Kelwin hires the way it builds: slowly, on purpose. What working in a pod is actually like, how we behave, and the bench list for when a seat opens.",
};

const CHAPTERS = [
  { n: "01", id: "work", label: "The work" },
  { n: "02", id: "behave", label: "How we behave" },
  { n: "03", id: "seats", label: "Open seats" },
  { n: "04", id: "bench", label: "The bench list" },
];

const BEHAVIORS = [
  {
    n: "H·01",
    title: "You own systems, not tasks.",
    desc: "Everyone on a pod is accountable to the thing the engagement leaves behind — not to hours logged against it.",
  },
  {
    n: "H·02",
    title: "Writing is the job.",
    desc: "If it isn't written down in the client's language, it didn't happen. The best people here are the best writers here.",
  },
  {
    n: "H·03",
    title: "Diagnose out loud.",
    desc: "We show clients our reasoning, including the uncertain parts. The same rule applies inside the firm.",
  },
  {
    n: "H·04",
    title: "No theater.",
    desc: "No status meetings that could be a readout, no decks that could be a page, no busyness worn as a badge.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="fp2">
        <div className="fp2-stage">
          {/* ── Hero ── */}
          <header>
            <div className="fp2-protocol-row">
              <span className="fp2-protocol">The Firm · Careers</span>
              <span className="fp2-protocol-line" aria-hidden="true" />
              <span className="fp2-stamp">KELWIN/OS · THE BENCH</span>
            </div>
            <h1 className="fp2-title">
              We hire the way we build: <em>slowly, on purpose.</em>
            </h1>
            <p className="fp2-lede">
              Kelwin runs on small senior pods, and every person on an
              engagement is accountable to the system it leaves behind. That
              means we add people rarely, deliberately, and only when a seat
              is genuinely open — which is also why this page is honest
              instead of aspirational.
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

          {/* ── 01 · The work ── */}
          <section className="fp2-chapter" id="work" aria-label="The work">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">01</span>
              <span className="fp2-rail-kicker">The work</span>
              <span className="fp2-rail-note">A pod Tuesday</span>
            </div>
            <div>
              <h2 className="fp2-h">
                Two or three people, one engagement, end to end.
              </h2>
              <p className="fp2-prose">
                On a given Tuesday that means interviewing a client&rsquo;s
                best rep in the morning, rewriting the language system after
                lunch, and reading deliverability telemetry before close — the
                same person, all three. There is no bench of juniors, no
                account layer, and nowhere to hide, which is exactly why the
                people who fit here love it.
              </p>
              <div className="fp2-facts">
                <div className="fp2-fact">
                  <span className="fp2-fact-v">2–3 per pod</span>
                  <span className="fp2-fact-k">senior-only, per engagement</span>
                </div>
                <div className="fp2-fact">
                  <span className="fp2-fact-v">Three crafts</span>
                  <span className="fp2-fact-k">
                    strategy, systems engineering, narrative — often in one head
                  </span>
                </div>
                <div className="fp2-fact">
                  <span className="fp2-fact-v">One test</span>
                  <span className="fp2-fact-k">
                    the asset that outlives the engagement
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 02 · How we behave ── */}
          <section className="fp2-chapter" id="behave" aria-label="How we behave">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">02</span>
              <span className="fp2-rail-kicker">How we behave</span>
              <span className="fp2-rail-note">Enforced, not aspirational</span>
            </div>
            <ol className="fp2-statements">
              {BEHAVIORS.map((b) => (
                <li className="fp2-statement" key={b.n}>
                  <span className="fp2-statement-num">{b.n}</span>
                  <span>
                    <span className="fp2-statement-title">{b.title}</span>
                    <span className="fp2-statement-desc">{b.desc}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* ── 03 · Open seats ── */}
          <section className="fp2-chapter" id="seats" aria-label="Open seats">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">03</span>
              <span className="fp2-rail-kicker">Open seats</span>
              <span className="fp2-rail-note">Listed here first</span>
            </div>
            <div>
              <div className="fp2-terminal" role="status">
                <div className="fp2-terminal-line">
                  <span className="fp2-terminal-prompt" aria-hidden="true">&gt;</span>
                  careers.index — no open seats right now
                </div>
                <div className="fp2-terminal-line">
                  <span className="fp2-terminal-prompt" aria-hidden="true">&gt;</span>
                  next seats: strategy · systems engineering · narrative
                </div>
              </div>
            </div>
          </section>

          {/* ── 04 · The bench list ── */}
          <section className="fp2-chapter" id="bench" aria-label="The bench list">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">04</span>
              <span className="fp2-rail-kicker">The bench list</span>
            </div>
            <div>
              <h2 className="fp2-h">Don&rsquo;t wait for a listing.</h2>
              <p className="fp2-prose">
                If the work described on this site is the work you want to do,
                write to the founding team and tell us{" "}
                <strong>what you&rsquo;d want to own</strong> — not a CV
                summary, just the part of a revenue system you&rsquo;d take
                personal responsibility for and why. When a seat opens, the
                bench list is where we look first.
              </p>
              <ArrowLink
                href="/contact?topic=careers&ref=Bench%20list"
                label="Join the bench list"
                tone="sand"
              />
            </div>
          </section>

          {/* ── Close ── */}
          <footer className="fp2-close">
            <p className="fp2-close-line">
              Small teams don&rsquo;t have room for passengers —{" "}
              <em>which is exactly what makes a seat here worth having.</em>
            </p>
            <div className="fp2-close-actions">
              <ArrowLink href="/insights" label="Read the field notes" tone="sand" />
              <ArrowLink href="/about" label="Meet the firm" tone="sand" />
            </div>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}
