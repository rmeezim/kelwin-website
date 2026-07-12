"use client";

import { useEffect, useRef } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import ConvertPanel from "@/components/ui/ConvertPanel";
import "./FirmPages.css";

// ─── Who we work with — the targeting system ──────────────────────────────
// Qualification rendered as instrumentation: a 2×2 deployment matrix
// (one active zone, the rest restricted airspace), a representative
// deployment ticker (SPECIMEN-labeled — environments are typical, not
// live client data), industry tiles with abstract network topographies
// (the red line is the narrative cutting the noise), the three
// situations, and an anti-fit terminal that throws SYSTEM INCOMPATIBLE.

const ZONE_CRITERIA = [
  {
    title: "Sales-carried deals",
    desc: "A human closes. Committees, calls, contracts — the motion our system instruments.",
  },
  {
    title: "Real revenue, felt ceiling",
    desc: "The motion works; growth has stopped compounding. That's an architecture problem.",
  },
  {
    title: "Founder still in the building",
    desc: "The instincts exist — trapped in one head. We write them down as a system.",
  },
  {
    title: "Someone will own it",
    desc: "After handover an internal operator runs the system. Wanting that is the real gate.",
  },
];

// [EDIT ME] Founder: representative environments — keep these typical of
// the actual book. They render under a SPECIMEN chip, never as live data.
const TELEMETRY = [
  { node: "NODE 01", env: "Series B cybersecurity", obj: "Pipeline velocity", status: "CALIBRATING", tone: "sand" as const },
  { node: "NODE 02", env: "Enterprise SaaS · $40K ACV", obj: "Committee narrative", status: "INSTALLING", tone: "sand" as const },
  { node: "NODE 03", env: "FinTech infrastructure", obj: "Risk-review survival", status: "READOUT", tone: "patina" as const },
  { node: "NODE 04", env: "Dev tools · PLG + sales", obj: "Signal discipline", status: "CALIBRATING", tone: "sand" as const },
  { node: "NODE 05", env: "B2B services firm", obj: "Beyond-referral motion", status: "INSTALLING", tone: "sand" as const },
];

// Industry topographies — abstract network graphs; the red path is the
// narrative cutting a straight line through the sector's noise.
type Topo = { nodes: [number, number][]; edges: [number, number][]; cut: string };
const INDUSTRIES: {
  n: string; name: string; chips: string[]; breaks: string; topo: Topo;
}[] = [
  {
    n: "I·01",
    name: "Enterprise SaaS",
    chips: ["Sales-carried", "Committee buys"],
    breaks: "The story that wins the champion dies in the committee — seven stakeholders, seven versions of what you do.",
    topo: {
      nodes: [[30, 55], [70, 25], [95, 60], [70, 85], [120, 30], [130, 75], [160, 50], [105, 15], [150, 90], [175, 20]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3], [0, 2], [2, 4], [4, 5], [5, 6], [4, 6], [2, 5], [6, 9], [4, 7], [7, 1], [5, 8], [8, 6], [2, 7]],
      cut: "M8 92 L192 22",
    },
  },
  {
    n: "I·02",
    name: "Cybersecurity",
    chips: ["Trust-gated", "Crowded category"],
    breaks: "Every vendor promises the same three outcomes in the same words. Differentiation is a language problem before it's a product one.",
    topo: {
      nodes: [[25, 25], [75, 20], [125, 25], [175, 30], [30, 60], [80, 55], [130, 60], [180, 55], [25, 90], [75, 95], [125, 88], [170, 92]],
      edges: [[0, 5], [1, 4], [1, 6], [2, 5], [2, 7], [3, 6], [4, 9], [5, 8], [5, 10], [6, 9], [6, 11], [7, 10], [0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [8, 9], [9, 10], [10, 11]],
      cut: "M8 70 L192 40",
    },
  },
  {
    n: "I·03",
    name: "FinTech & payments",
    chips: ["Regulated", "Risk-averse buyer"],
    breaks: "Compliance vocabulary smothers the actual story, and deals stall in risk review because nobody armed the champion.",
    topo: {
      nodes: [[40, 20], [40, 45], [40, 70], [40, 95], [100, 20], [100, 45], [100, 70], [100, 95], [160, 20], [160, 45], [160, 70], [160, 95]],
      edges: [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [8, 9], [9, 10], [10, 11], [1, 5], [6, 10], [2, 6]],
      cut: "M8 85 L70 60 L130 45 L192 25",
    },
  },
  {
    n: "I·04",
    name: "Developer & data infrastructure",
    chips: ["Technical buyer", "PLG + sales"],
    breaks: "The buyer reads docs, not decks. Outbound only works when it sounds like engineering wrote it.",
    topo: {
      nodes: [[20, 40], [60, 30], [100, 40], [140, 30], [180, 40], [40, 80], [80, 90], [120, 80], [160, 90]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [0, 5], [1, 6], [2, 7], [3, 8], [1, 7]],
      cut: "M8 60 L192 60",
    },
  },
  {
    n: "I·05",
    name: "Professional & B2B services",
    chips: ["Relationship-led", "Referral ceiling"],
    breaks: "Growth stalls where the partners' networks end — the firm's knowledge never became a sellable narrative.",
    topo: {
      nodes: [[60, 55], [20, 25], [15, 70], [45, 95], [85, 20], [130, 60], [105, 95], [160, 25], [178, 80], [150, 98]],
      edges: [[0, 1], [0, 2], [0, 3], [0, 4], [5, 6], [5, 7], [5, 8], [5, 9], [0, 5]],
      cut: "M20 100 L60 55 L130 60 L192 30",
    },
  },
  {
    n: "I·06",
    name: "Industrial & deep tech",
    chips: ["Long cycle", "Legacy incumbents"],
    breaks: "Twelve-month deals drift: the narrative that opened the deal isn't the one that closes it.",
    topo: {
      nodes: [[15, 70], [45, 45], [75, 75], [105, 40], [135, 78], [165, 45], [190, 70]],
      edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [1, 3], [3, 5]],
      cut: "M15 58 L190 58",
    },
  },
];

const VIGNETTES = [
  {
    n: "01",
    tag: "The founder-seller",
    title: "You're still the best rep the company has — and it's a trap.",
    body: "Deals close when you're in the room. The narrative lives in your head, the important emails get written at 11pm, and every attempt to delegate the pitch has come back sounding like a stranger wrote it. Revenue is real; it just doesn't survive your absence.",
    turn: "What changes: your instincts get written down as a system — a language other people can carry into rooms you're not in.",
    install: "Narrative system — your instincts, written down",
    installHref: "/capabilities/narrative-systems",
    cue: "Sounds like your Tuesday? Start the audit",
  },
  {
    n: "02",
    tag: "The plateaued motion",
    title: "The playbook that got you here has stopped compounding.",
    body: "You've got SDRs, sequences, a tech stack that cost real money — and a pipeline chart that's been flat for four quarters. Every quarter starts with a new campaign and ends with the same retro. Nobody can say what was learned, because nothing was kept.",
    turn: "What changes: the resets stop. Signal, language, and learning start carrying forward — the quarter deposits instead of evaporating.",
    install: "Intelligence layer — the loop that compounds",
    installHref: "/capabilities/gtm-intelligence",
    cue: "Four flat quarters? Start the audit",
  },
  {
    n: "03",
    tag: "The misheard category",
    title: "Buyers keep filing you next to the wrong competitors.",
    body: "The product is genuinely different, and it doesn't matter — because the market maps you onto whatever it already knows. Committees compare you against incumbents you don't resemble, on criteria you'd never choose. Winning feels like arguing uphill in someone else's language.",
    turn: "What changes: the category gets architected — the problem named your way, so the comparison happens on your terms.",
    install: "Category architecture — the problem, named your way",
    installHref: "/capabilities/narrative-systems",
    cue: "Tired of the wrong shortlist? Start the audit",
  },
];

const ANTIFIT = [
  { probe: "pre-revenue", err: "no working motion to instrument — return at first revenue" },
  { probe: "pure self-serve / PLG", err: "assumes a sales-carried deal — different machinery, not ours" },
  { probe: "lead-list shopping", err: "renting activity is the disease we treat — we'd be selling it to you" },
  { probe: "outsource-it-forever", err: "nobody inside will own the system — dependency by design, declined" },
];

function TopoGraph({ topo }: { topo: Topo }) {
  return (
    <svg className="fp3-topo" viewBox="0 0 200 110" aria-hidden="true">
      {topo.edges.map(([a, b], i) => (
        <line
          key={i}
          x1={topo.nodes[a][0]} y1={topo.nodes[a][1]}
          x2={topo.nodes[b][0]} y2={topo.nodes[b][1]}
        />
      ))}
      {topo.nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" />
      ))}
      <path className="fp3-topo-cut" d={topo.cut} pathLength={1} />
    </svg>
  );
}

export default function FirmFit() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".fp3-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="fp3" ref={mainRef}>
      <div className="fp3-stage">
        {/* ── 01 · The deployment matrix ── */}
        <section className="fp3-section fp3-reveal" aria-label="Qualification matrix">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Deployment zones</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIT/01 · ONE ZONE, THREE RESTRICTED</span>
          </div>
          <div className="fp3-mtxwrap">
            <div className="fp3-mtx">
              <span className="fp3-mtx-yaxis">DEAL COMPLEXITY ▲</span>
              <div className="fp3-mtx-grid">
                <div className="fp3-mtx-cell is-restricted">
                  <span className="fp3-mtx-tag">RESTRICTED</span>
                  <span className="fp3-mtx-why">Complex + self-serve — a contradiction that resolves itself</span>
                </div>
                <div className="fp3-mtx-cell is-active">
                  <span className="fp3-corner fp3-corner-tl" aria-hidden="true" />
                  <span className="fp3-corner fp3-corner-br" aria-hidden="true" />
                  <span className="fp3-mtx-zone">
                    <span className="fp3-mtx-dot" aria-hidden="true" />
                    DEPLOYMENT ZONE
                  </span>
                  <span className="fp3-mtx-desc">
                    Committee deals, human-closed, real revenue, felt ceiling
                    — where the system compounds.
                  </span>
                </div>
                <div className="fp3-mtx-cell is-restricted">
                  <span className="fp3-mtx-tag">RESTRICTED</span>
                  <span className="fp3-mtx-why">Pure PLG — different machinery, honestly not ours</span>
                </div>
                <div className="fp3-mtx-cell is-restricted">
                  <span className="fp3-mtx-tag">RESTRICTED</span>
                  <span className="fp3-mtx-why">Simple transactional — doesn&rsquo;t need infrastructure</span>
                </div>
              </div>
              <span className="fp3-mtx-xaxis">
                <span>◀ PRODUCT-LED</span>
                <span>GTM MOTION</span>
                <span>SALES-LED ▶</span>
              </span>
            </div>
            <div className="fp3-mtx-criteria">
              <span className="fp3-mtx-criteria-k">
                <span className="fp3-mark-yes" aria-hidden="true" />
                Zone criteria
              </span>
              {ZONE_CRITERIA.map((c, i) => (
                <div className="fp3-mtx-crit fp3-reveal" style={{ ["--i" as string]: i }} key={c.title}>
                  <span className="fp3-mtx-crit-title">{c.title}</span>
                  <span className="fp3-mtx-crit-desc">{c.desc}</span>
                </div>
              ))}
              <ArrowLink href="/audit" label="Run the three questions" tone="sand" />
            </div>
          </div>
        </section>

        {/* ── 02 · Deployment telemetry — representative, and it says so ── */}
        <section className="fp3-section fp3-reveal" aria-label="Deployment telemetry">
          <div className="fp3-ticker">
            <div className="fp3-ticker-bar">
              <span className="fp3-spec-id">DEPLOYMENT TELEMETRY</span>
              <span className="fp3-spec-line" aria-hidden="true" />
              <span className="fp3-ticker-chip">REPRESENTATIVE ENVIRONMENTS · SPECIMEN</span>
            </div>
            <div className="fp3-ticker-track" aria-hidden="true">
              <div className="fp3-ticker-run">
                {[...TELEMETRY, ...TELEMETRY].map((t, i) => (
                  <span className="fp3-ticker-item" key={i}>
                    <span className="fp3-ticker-node">{t.node}</span>
                    {t.env} · OBJECTIVE: {t.obj} ·
                    <span className={`fp3-ticker-status is-${t.tone}`}>
                      <span className="fp3-ticker-mark" /> {t.status}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 · Industry topographies ── */}
        <section className="fp3-section fp3-reveal" aria-label="Industries we serve">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Industry topographies</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIT/02 · SPECIALIST, NOT GENERALIST</span>
          </div>
          <div className="fp3-inds">
            {INDUSTRIES.map((ind, i) => (
              <div
                className="fp3-ind fp3-reveal"
                style={{ ["--i" as string]: i }}
                key={ind.n}
              >
                <span className="fp3-ind-head">
                  <span className="fp3-ind-num">{ind.n}</span>
                  <span className="fp3-ind-chips">
                    {ind.chips.map((c) => (
                      <span className="fp3-ind-chip" key={c}>{c}</span>
                    ))}
                  </span>
                </span>
                <TopoGraph topo={ind.topo} />
                <span className="fp3-ind-name">{ind.name}</span>
                <span className="fp3-ind-break">
                  <span className="fp3-ind-break-k">Where it breaks</span>
                  {ind.breaks}
                </span>
              </div>
            ))}
          </div>
          <p className="fp3-accent">
            <span className="fp3-accent-dash" aria-hidden="true" />
            The tangle is the sector&rsquo;s noise. The red line is a
            narrative cutting straight through it — same system underneath,
            different noise to cut.
          </p>
        </section>

        {/* ── 04 · Three situations — told from inside ── */}
        <section className="fp3-section fp3-reveal" aria-label="Three situations">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Three situations</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIT/03 · TOLD FROM INSIDE</span>
          </div>
          <div className="fp3-vigs">
            {VIGNETTES.map((v, i) => (
              <article
                className="fp3-vig fp3-reveal"
                style={{ ["--i" as string]: i }}
                key={v.n}
              >
                {i === 0 && (
                  <>
                    <span className="fp3-corner fp3-corner-tl" aria-hidden="true" />
                    <span className="fp3-corner fp3-corner-br" aria-hidden="true" />
                  </>
                )}
                <span className="fp3-vig-ghost" aria-hidden="true">{v.n}</span>
                <span className="fp3-vig-tag">{v.tag}</span>
                <h2 className="fp3-vig-title">{v.title}</h2>
                <p className="fp3-vig-body">{v.body}</p>
                <p className="fp3-vig-turn">
                  <span className="fp3-vig-turn-dash" aria-hidden="true" />
                  {v.turn}
                </p>
                <div className="fp3-vig-foot">
                  <a className="fp3-vig-install" href={v.installHref}>
                    <span className="fp3-vig-install-k">First install</span>
                    <span className="fp3-vig-install-v">{v.install}</span>
                  </a>
                  <ArrowLink href="/audit" label={v.cue} tone="sand" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 05 · The anti-fit terminal ── */}
        <section className="fp3-section fp3-reveal" aria-label="Where we say no">
          <div className="fp3-eyebrow-row">
            <span className="fp3-eyebrow">Anti-fit</span>
            <span className="fp3-eyebrow-dash" aria-hidden="true" />
            <span className="fp3-eyebrow-meta">FIT/04 · HOVER A PROBE — THE SYSTEM ANSWERS</span>
          </div>
          <div className="fp3-terminal fp3-antifit" role="note">
            {ANTIFIT.map((a) => (
              <div className="fp3-antifit-row" tabIndex={0} key={a.probe}>
                <div className="fp3-terminal-line">
                  <span className="fp3-terminal-prompt" aria-hidden="true">&gt;</span>
                  fit.probe — {a.probe}
                </div>
                <div className="fp3-antifit-err">
                  ERROR: SYSTEM INCOMPATIBLE — {a.err}
                </div>
              </div>
            ))}
            <div className="fp3-terminal-line is-quiet">
              <span className="fp3-terminal-prompt" aria-hidden="true">&gt;</span>
              unsure which side you&rsquo;re on: the general channel stays
              open<span className="fp3-terminal-cursor" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* ── Close — the decision ── */}
        <div className="fp3-section fp3-reveal">
          <ConvertPanel
            title="If you're in the zone,"
            sub="the audit reads like your diagnosis — ten working days against your numbers, your calls, your language. It gates before it books, so when it says go, it means it."
            chips={["3-question gate", "Fixed scope", "Honest in both directions"]}
            primary={{ href: "/audit", label: "See if the audit fits" }}
            secondary={{ href: "/contact", label: "Not sure? Ask us directly" }}
          />
        </div>
      </div>
    </main>
  );
}
