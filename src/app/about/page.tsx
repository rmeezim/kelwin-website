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
      <main className="firm">
        <div className="firm-stage">
          {/* ── Head ── */}
          <header>
            <div className="firm-protocol-row">
              <span className="firm-protocol">The Firm · About</span>
              <span className="firm-protocol-line" aria-hidden="true" />
              <span className="firm-stamp">KELWIN/OS · THE PEOPLE</span>
            </div>
            <h1 className="firm-title">
              <span className="firm-title-1">Built to end</span>
              <span className="firm-title-2">the rebuild cycle.</span>
            </h1>
            <p className="firm-lede">
              Most B2B companies rebuild their go-to-market from scratch every
              couple of years — new agency, new playbook, new pipeline, same
              ceiling. Kelwin exists because we think that cycle is an
              architecture problem, not an effort problem.
            </p>
          </header>

          {/* ── Founder's note — the page's daylight moment ──
              [EDIT ME] Founder: this is written in your voice on purpose —
              adjust wording, keep the register. */}
          <section className="firm-note" aria-label="A note from the founder">
            <div className="firm-note-kicker">A note from the founder</div>
            <p>
              I started Kelwin after watching the same movie too many times: a
              good company, a real product, a founder writing every important
              email themselves at 11pm — hiring an agency, getting a quarter
              of activity, and ending up exactly where they started, minus the
              budget.
            </p>
            <p>
              Nobody in that movie is lazy. The problem is structural: the
              learning leaves with the vendor, the language never gets written
              down, and every quarter starts from zero. So we built the firm
              we kept wishing existed — one that installs the system, then
              hands you the keys.
            </p>
            <p>
              If you write to us, a person answers. That isn&rsquo;t a
              feature. That&rsquo;s the point.
            </p>
            <div className="firm-note-sign">
              <span className="firm-note-name">Rameez</span>
              <span className="firm-note-role">Founder, Kelwin</span>
            </div>
          </section>

          {/* ── What Kelwin is ── */}
          <section className="firm-section">
            <div className="firm-section-head">
              <span className="firm-kicker">What Kelwin is</span>
              <span className="firm-section-line" aria-hidden="true" />
            </div>
            <p className="firm-prose">
              Kelwin is a GTM systems partner and advisory firm for serious
              B2B companies. We are <strong>not a lead generation agency</strong>:
              agencies rent you activity — campaigns, sequences, SDR hours —
              that stops the day the contract does. We install revenue
              infrastructure your team owns and operates: the narrative system
              that decides what the market hears, the omnichannel motion that
              puts it in front of buyers, and the intelligence layer that
              feeds back what works.
            </p>
          </section>

          {/* ── Beliefs ── */}
          <section className="firm-section">
            <div className="firm-section-head">
              <span className="firm-kicker">What we believe</span>
              <span className="firm-section-line" aria-hidden="true" />
              <span className="firm-section-note">Five, held stubbornly</span>
            </div>
            <ol className="firm-beliefs">
              {BELIEFS.map((b) => (
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

          {/* ── The shape of the firm ── */}
          <section className="firm-section">
            <div className="firm-section-head">
              <span className="firm-kicker">The shape of the firm</span>
              <span className="firm-section-line" aria-hidden="true" />
            </div>
            <p className="firm-prose">
              Small on purpose. Engagements run as senior pods — the people
              who diagnose your system are the people who build it, and the
              people you meet are the people who answer your email. No
              account-management layer, no handoff to a delivery team
              you&rsquo;ve never met.
            </p>
            <div className="firm-facts">
              <div className="firm-fact">
                <span className="firm-fact-k">Structure</span>
                <span className="firm-fact-v">
                  Small senior pods — no juniors learning on your budget
                </span>
              </div>
              <div className="firm-fact">
                <span className="firm-fact-k">Scope</span>
                <span className="firm-fact-v">
                  Fixed scopes, written deliverables, an exit built in
                </span>
              </div>
              <div className="firm-fact">
                <span className="firm-fact-k">Ownership</span>
                <span className="firm-fact-v">
                  Everything documented in your language, in your stack
                </span>
              </div>
            </div>
          </section>

          {/* ── Sister company ── */}
          <section className="firm-section">
            <div className="firm-section-head">
              <span className="firm-kicker">The sister company</span>
              <span className="firm-section-line" aria-hidden="true" />
              <span className="firm-section-note">Plurel</span>
            </div>
            <p className="firm-prose">
              Kelwin is the sister company of <strong>Plurel</strong>, the
              creative and performance division. Plurel makes brands seen;
              Kelwin makes revenue systematic. The two share ingredients — the
              same craft standards, the same refusal of template work —
              expressed in different postures: Plurel warm and expressive,
              Kelwin precise and infrastructural. Same family, different
              instruments.
            </p>
          </section>

          {/* ── Where we're headed ── */}
          <section className="firm-section">
            <div className="firm-section-head">
              <span className="firm-kicker">Where we&rsquo;re headed</span>
              <span className="firm-section-line" aria-hidden="true" />
              <span className="firm-section-note">The Lab</span>
            </div>
            <p className="firm-prose">
              The advisory work funds a longer project: The Lab, a GTM
              intelligence product that turns what we learn across installs
              into standing instrumentation. It isn&rsquo;t public yet — when
              it is, it will be announced here first.
            </p>
          </section>

          <p className="firm-pull">
            People buy from people. The system just makes sure what those
            people say is worth repeating.
          </p>

          {/* ── Foot ── */}
          <footer className="firm-foot">
            <p className="firm-coda">
              The fastest way to know if we&rsquo;re your kind of firm is to
              watch us diagnose.
            </p>
            <div className="firm-foot-actions">
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
