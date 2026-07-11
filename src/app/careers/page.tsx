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
      <main className="firm">
        <div className="firm-stage">
          {/* ── Head ── */}
          <header>
            <div className="firm-protocol-row">
              <span className="firm-protocol">The Firm · Careers</span>
              <span className="firm-protocol-line" aria-hidden="true" />
              <span className="firm-stamp">KELWIN/OS · THE BENCH</span>
            </div>
            <h1 className="firm-title">
              <span className="firm-title-1">We hire the way we build:</span>
              <span className="firm-title-2">slowly, on purpose.</span>
            </h1>
            <p className="firm-lede">
              Kelwin runs on small senior pods, and every person on an
              engagement is accountable to the system it leaves behind. That
              means we add people rarely, deliberately, and only when a seat
              is genuinely open — which is also why this page is honest
              instead of aspirational.
            </p>
          </header>

          {/* ── What it's actually like ── */}
          <section className="firm-section">
            <div className="firm-section-head">
              <span className="firm-kicker">What it&rsquo;s actually like</span>
              <span className="firm-section-line" aria-hidden="true" />
            </div>
            <p className="firm-prose">
              A pod is two or three senior people carrying one engagement end
              to end. On a given Tuesday that means interviewing a
              client&rsquo;s best rep in the morning, rewriting the language
              system after lunch, and reading deliverability telemetry before
              close — the same person, all three. There is no bench of
              juniors, no account layer, and nowhere to hide, which is exactly
              why the people who fit here love it.
            </p>
            <div className="firm-facts">
              <div className="firm-fact">
                <span className="firm-fact-k">Team</span>
                <span className="firm-fact-v">
                  Senior-only pods of two to three per engagement
                </span>
              </div>
              <div className="firm-fact">
                <span className="firm-fact-k">Craft</span>
                <span className="firm-fact-v">
                  Strategy, systems engineering, and narrative — often in one head
                </span>
              </div>
              <div className="firm-fact">
                <span className="firm-fact-k">Accountability</span>
                <span className="firm-fact-v">
                  To the asset that outlives the engagement
                </span>
              </div>
            </div>
          </section>

          {/* ── How we behave ── */}
          <section className="firm-section">
            <div className="firm-section-head">
              <span className="firm-kicker">How we behave</span>
              <span className="firm-section-line" aria-hidden="true" />
              <span className="firm-section-note">Enforced, not aspirational</span>
            </div>
            <ol className="firm-beliefs">
              {BEHAVIORS.map((b) => (
                <li className="firm-belief" key={b.n}>
                  <span className="firm-belief-num">{b.n}</span>
                  <span>
                    <span className="firm-belief-title">{b.title}</span>
                    <span className="firm-belief-desc">{b.desc}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Open roles ── */}
          <section className="firm-section" aria-label="Open roles">
            <div className="firm-section-head">
              <span className="firm-kicker">Open roles</span>
              <span className="firm-section-line" aria-hidden="true" />
              <span className="firm-section-note">Listed here first, always</span>
            </div>
            <div className="firm-terminal" role="status">
              <div className="firm-terminal-line">
                <span className="firm-terminal-prompt" aria-hidden="true">&gt;</span>
                careers.index — no open seats right now
              </div>
              <div className="firm-terminal-line">
                <span className="firm-terminal-prompt" aria-hidden="true">&gt;</span>
                next seats: strategy · systems engineering · narrative
              </div>
            </div>
          </section>

          {/* ── The bench list ── */}
          <section className="firm-section">
            <div className="firm-section-head">
              <span className="firm-kicker">The bench list</span>
              <span className="firm-section-line" aria-hidden="true" />
            </div>
            <p className="firm-prose">
              If the work described on this site is the work you want to do,
              don&rsquo;t wait for a listing. Write to the founding team and
              tell us <strong>what you&rsquo;d want to own</strong> — not a
              CV summary, just the part of a revenue system you&rsquo;d take
              personal responsibility for and why. When a seat opens, the
              bench list is where we look first.
            </p>
            <ArrowLink
              href="/contact?topic=careers&ref=Bench%20list"
              label="Join the bench list"
              tone="sand"
            />
          </section>

          <p className="firm-pull">
            Small teams don&rsquo;t have room for passengers — which is
            exactly what makes a seat here worth having.
          </p>

          {/* ── Foot ── */}
          <footer className="firm-foot">
            <p className="firm-coda">
              Meanwhile, the best way to learn how we think is to read what we
              publish.
            </p>
            <div className="firm-foot-actions">
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
