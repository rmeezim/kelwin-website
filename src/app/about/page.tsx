import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "@/components/sections/FirmPages.css";

export const metadata: Metadata = {
  title: "About Us — Kelwin",
  description:
    "Kelwin is a GTM systems partner for B2B companies — revenue infrastructure you keep, not activity you rent. Built by people who got tired of the rebuild cycle.",
};

const CHAPTERS = [
  { n: "01", id: "letter", label: "The letter" },
  { n: "02", id: "what", label: "What Kelwin is" },
  { n: "03", id: "beliefs", label: "What we believe" },
  { n: "04", id: "shape", label: "The shape of the firm" },
  { n: "05", id: "family", label: "The family" },
];

const BELIEFS = [
  {
    n: "B·01",
    title: "Diagnosis before prescription.",
    desc: "No engagement starts without the audit's readout. Building before diagnosing is how this industry sells the same fix to every different problem.",
  },
  {
    n: "B·02",
    title: "Assets, not retainers.",
    desc: "Everything we build is documented in your language and lives in your stack. Six transferable artifacts, yours outright — dependency is a design flaw.",
  },
  {
    n: "B·03",
    title: "The market can't repeat what it can't understand.",
    desc: "Most pipeline problems are narrative problems wearing a disguise. Clarity is infrastructure, not copywriting.",
  },
  {
    n: "B·04",
    title: "Compounding beats resetting.",
    desc: "A campaign that ends teaches nothing. Every quarter should deposit into the next — learning is the asset this industry keeps throwing away.",
  },
  {
    n: "B·05",
    title: "If it stops working the day we leave, we built it wrong.",
    desc: "The exit test. It's on the homepage, and it's the sentence we design every engagement backwards from.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="fp2">
        <div className="fp2-stage">
          {/* ── Hero ── */}
          <header>
            <div className="fp2-protocol-row">
              <span className="fp2-protocol">The Firm · About</span>
              <span className="fp2-protocol-line" aria-hidden="true" />
              <span className="fp2-stamp">KELWIN/OS · THE PEOPLE</span>
            </div>
            <h1 className="fp2-title">
              Built to end <em>the rebuild cycle.</em>
            </h1>
            <p className="fp2-lede">
              Most B2B companies rebuild their go-to-market from scratch every
              couple of years — new agency, new playbook, new pipeline, same
              ceiling. Kelwin exists because we think that cycle is an
              architecture problem, not an effort problem.
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

          {/* ── 01 · The letter ──
              [EDIT ME] Founder: written in your voice on purpose — adjust
              the wording, keep the register. */}
          <section className="fp2-chapter" id="letter" aria-label="A letter from the founder">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">01</span>
              <span className="fp2-rail-kicker">The letter</span>
              <span className="fp2-rail-note">From the founder</span>
            </div>
            <div className="fp2-letter">
              <p>
                I started Kelwin after watching the same movie too many times:
                a good company, a real product, a founder writing every
                important email themselves at 11pm — hiring an agency, getting
                a quarter of activity, and ending up exactly where they
                started, minus the budget.
              </p>
              <p>
                Nobody in that movie is lazy. The problem is structural: the
                learning leaves with the vendor, the language never gets
                written down, and every quarter starts from zero. So we built
                the firm we kept wishing existed — one that installs the
                system, then hands you the keys.
              </p>
              <p>
                If you write to us, a person answers. That isn&rsquo;t a
                feature. That&rsquo;s the point.
              </p>
              <div className="fp2-letter-sign">
                <span className="fp2-letter-dash" aria-hidden="true" />
                <span className="fp2-letter-name">Rameez</span>
                <span className="fp2-letter-role">Founder, Kelwin</span>
              </div>
            </div>
          </section>

          {/* ── 02 · What Kelwin is ── */}
          <section className="fp2-chapter" id="what" aria-label="What Kelwin is">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">02</span>
              <span className="fp2-rail-kicker">What Kelwin is</span>
            </div>
            <div>
              <h2 className="fp2-h">
                A systems partner, not another agency.
              </h2>
              <p className="fp2-prose">
                Kelwin is a GTM systems partner and advisory firm for serious
                B2B companies. Agencies rent you activity — campaigns,
                sequences, SDR hours — that stops the day the contract does.
                We install <strong>revenue infrastructure your team owns and
                operates</strong>: the narrative system that decides what the
                market hears, the omnichannel motion that puts it in front of
                buyers, and the intelligence layer that feeds back what works.
              </p>
            </div>
          </section>

          {/* ── 03 · Beliefs ── */}
          <section className="fp2-chapter" id="beliefs" aria-label="What we believe">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">03</span>
              <span className="fp2-rail-kicker">What we believe</span>
              <span className="fp2-rail-note">Five, held stubbornly</span>
            </div>
            <ol className="fp2-statements">
              {BELIEFS.map((b) => (
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

          {/* ── 04 · Shape ── */}
          <section className="fp2-chapter" id="shape" aria-label="The shape of the firm">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">04</span>
              <span className="fp2-rail-kicker">The shape of the firm</span>
            </div>
            <div>
              <h2 className="fp2-h">Small on purpose.</h2>
              <p className="fp2-prose">
                Engagements run as senior pods — the people who diagnose your
                system are the people who build it, and the people you meet
                are the people who answer your email. No account-management
                layer, no handoff to a delivery team you&rsquo;ve never met.
              </p>
              <div className="fp2-facts">
                <div className="fp2-fact">
                  <span className="fp2-fact-v">2–3 seniors</span>
                  <span className="fp2-fact-k">
                    per pod — no juniors learning on your budget
                  </span>
                </div>
                <div className="fp2-fact">
                  <span className="fp2-fact-v">Fixed scope</span>
                  <span className="fp2-fact-k">
                    written deliverables, an exit built in
                  </span>
                </div>
                <div className="fp2-fact">
                  <span className="fp2-fact-v">Your stack</span>
                  <span className="fp2-fact-k">
                    everything documented in your language, owned by you
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── 05 · Family ── */}
          <section className="fp2-chapter" id="family" aria-label="The family">
            <div className="fp2-rail">
              <span className="fp2-rail-num" aria-hidden="true">05</span>
              <span className="fp2-rail-kicker">The family</span>
              <span className="fp2-rail-note">Plurel · The Lab</span>
            </div>
            <div>
              <h2 className="fp2-h">Two companies, one standard.</h2>
              <p className="fp2-prose">
                Kelwin is the sister company of <strong>Plurel</strong>, the
                creative and performance division. Plurel makes brands seen;
                Kelwin makes revenue systematic. Same craft standards, same
                refusal of template work — expressed in different postures:
                Plurel warm and expressive, Kelwin precise and infrastructural.
              </p>
              <p className="fp2-prose">
                The advisory work funds a longer project: <strong>The Lab</strong>,
                a GTM intelligence product that turns what we learn across
                installs into standing instrumentation. It isn&rsquo;t public
                yet — when it is, it will be announced here first.
              </p>
            </div>
          </section>

          {/* ── Close ── */}
          <footer className="fp2-close">
            <p className="fp2-close-line">
              People buy from people. <em>The system just makes sure what
              those people say is worth repeating.</em>
            </p>
            <div className="fp2-close-actions">
              <DiagnosticMethodCTA
                href="/audit"
                label="Begin with the audit"
                variant="signal"
              />
              <ArrowLink href="/contact" label="Or just say hello" tone="sand" />
            </div>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}
