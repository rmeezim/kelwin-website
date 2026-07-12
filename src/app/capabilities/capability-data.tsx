import type { CapabilityData } from "@/components/sections/CapabilityDetail";

// ─── The three capabilities, specified ────────────────────────────────────
// Shared data for the capability pages. Evidence stats are independently
// verified against their primary sources before publication (see the
// research log in the repo history) — every figure links out. If a source
// dies or a number is revised, fix it here the same day.

export const NARRATIVE: CapabilityData = {
  code: "C·01",
  name: "Narrative Systems",
  overviewTitle: ["The story is not copy.", "It's infrastructure."],
  overviewProse: (
    <>
      <p>
        Most of the buying journey happens without you in the room — inside
        committees, forwarded documents, and private comparisons. Whatever
        language you left behind is what argues for you. In most companies
        that language is fragments: a deck here, the founder&rsquo;s phrasing
        there, five sequences describing five different companies.
      </p>
      <p>
        Narrative Systems replaces the fragments with <strong>one versioned
        system</strong>: positioning, message architecture, sales language,
        and proof — written down, owned by you, inherited by every channel
        and every rep.
      </p>
    </>
  ),
  accent:
    "When the market can repeat your story without you, the story is doing the selling.",
  wires: [
    {
      code: "C·02",
      name: "GTM Infrastructure",
      href: "/capabilities/gtm-infrastructure",
      line: "Carries this language to buyers — deliverable, routed, on time.",
    },
    {
      code: "C·03",
      name: "GTM Intelligence",
      href: "/capabilities/gtm-intelligence",
      line: "Measures what resonates and feeds the next narrative version.",
    },
  ],
  services: [
    {
      n: "S·01",
      name: "Positioning & category design",
      desc: "The frame you own: the problem named your way, competitors re-mapped around it, the comparison moved onto your terms.",
      artifact: "Category brief",
    },
    {
      n: "S·02",
      name: "ICP message matrix",
      desc: "Core claims by segment and stakeholder — what the champion, the economic buyer, and the skeptic each need to hear, and in what order.",
      artifact: "Message matrix",
    },
    {
      n: "S·03",
      name: "Sales language system",
      desc: "Talk tracks, demo narrative, outbound and nurture language — one voice from first touch to signature, written to be spoken.",
      artifact: "Language system",
    },
    {
      n: "S·04",
      name: "Objection library & rebuttal architecture",
      desc: "Every recurring objection, what it actually means, and the tested answer — versioned as the market moves.",
      artifact: "Objection library",
    },
    {
      n: "S·05",
      name: "Proof & evidence architecture",
      desc: "What must be proven, in what order, for a committee to say yes — and which artifact carries each proof.",
      artifact: "Proof map",
    },
    {
      n: "S·06",
      name: "Committee-ready artifacts",
      desc: "Business-case one-pagers and champion armament built to be forwarded — the documents that sell in rooms you're not in.",
      artifact: "Champion kit",
    },
    {
      n: "S·07",
      name: "Narrative telemetry hooks",
      desc: "Message-version instrumentation wired into the intelligence layer, so the story learns from every send and every call.",
      artifact: "Telemetry spec",
    },
  ],
  stats: [], // filled from verified research
  install: {
    weeks: "Weeks 1–6 · fixed scope",
    items: [
      "Rep and customer language interviews — the raw material",
      "Positioning decided live with the founding team",
      "Message matrix, language system, and proof map drafted, tested, shipped",
      "Channel inheritance: every live sequence and page moved onto the system",
    ],
  },
  retainer: {
    cadence: "Monthly · on your system",
    items: [
      "Message versions tested against live telemetry",
      "Objection library updated as the market argues back",
      "New segments and launches written inside the system",
      "Quarterly narrative calibration with leadership",
    ],
  },
  convert: {
    title: "Your story is already being told.",
    sub: "The audit reads how the market currently repeats you — where the narrative fragments, and what it costs. Ten working days; the readout is yours either way.",
  },
};

export const INFRASTRUCTURE: CapabilityData = {
  code: "C·02",
  name: "GTM Infrastructure",
  overviewTitle: ["A message that never arrives", "never mattered."],
  overviewProse: (
    <>
      <p>
        Before your narrative can be judged, it has to exist — in an inbox, a
        feed, a call. A meaningful share of legitimate B2B email never gets
        that far, and most outbound stacks are six disconnected tools with no
        shared memory, run by whoever configured them last.
      </p>
      <p>
        GTM Infrastructure is the <strong>engineering layer</strong>:
        deliverability, data pipelines, sequencing, orchestration, and CRM
        architecture built as one documented machine in your stack — so the
        story travels, the signal routes, and the record stays true.
      </p>
    </>
  ),
  accent:
    "The unglamorous layer is the one that decides whether anything else works.",
  wires: [
    {
      code: "C·01",
      name: "Narrative Systems",
      href: "/capabilities/narrative-systems",
      line: "Supplies the language this machine carries — one voice, every channel.",
    },
    {
      code: "C·03",
      name: "GTM Intelligence",
      href: "/capabilities/gtm-intelligence",
      line: "Reads this machine's telemetry and routes the next action.",
    },
  ],
  services: [
    {
      n: "S·01",
      name: "Deliverability engineering",
      desc: "Domain architecture, SPF/DKIM/DMARC, warmup, placement monitoring, and reputation repair — the physics of reaching an inbox.",
      artifact: "Deliverability runbook",
    },
    {
      n: "S·02",
      name: "Data pipeline & enrichment",
      desc: "Sourcing, enrichment, verification, and refresh — list quality run as a system, not a one-time purchase.",
      artifact: "Data pipeline spec",
    },
    {
      n: "S·03",
      name: "Outbound engine build",
      desc: "Sequencer architecture, sending infrastructure, inbox rotation, and throttling — volume that scales without burning domains.",
      artifact: "Engine config",
    },
    {
      n: "S·04",
      name: "Omnichannel orchestration",
      desc: "Email, LinkedIn, phone, content, and events routed by signal instead of calendar — each channel doing the job it's best at.",
      artifact: "Orchestration map",
    },
    {
      n: "S·05",
      name: "CRM architecture & hygiene automation",
      desc: "Objects, stages, dedupe, decay handling, and enrichment sync — the record system that stays true without manual policing.",
      artifact: "CRM blueprint",
    },
    {
      n: "S·06",
      name: "Pipeline instrumentation",
      desc: "Stage math, conversion tracking, and attribution you can defend in a board meeting.",
      artifact: "Instrumentation sheet",
    },
    {
      n: "S·07",
      name: "Playbooks & operator documentation",
      desc: "Everything above written in your team's language — runnable, hireable-against, and yours when we leave the room.",
      artifact: "Operator playbook",
    },
  ],
  stats: [], // filled from verified research
  install: {
    weeks: "Weeks 1–8 · fixed scope",
    items: [
      "Deliverability and stack audit — what's actually reaching buyers",
      "Domain, data, and CRM architecture rebuilt to spec",
      "Engine and orchestration configured, tested at low volume",
      "Runbooks and playbooks documented, operators trained",
    ],
  },
  retainer: {
    cadence: "Monthly · on your machine",
    items: [
      "Placement and reputation monitoring, incidents handled",
      "Data pipeline refresh and decay management",
      "Orchestration tuned as signal patterns shift",
      "Capacity scaled ahead of demand, never after it",
    ],
  },
  convert: {
    title: "Find out what's actually arriving.",
    sub: "The audit instruments your current stack first — placement, data decay, orchestration gaps — so the rebuild starts from evidence, not assumption.",
  },
};

export const INTELLIGENCE: CapabilityData = {
  code: "C·03",
  name: "GTM Intelligence",
  overviewTitle: ["What gets measured", "compounds."],
  overviewProse: (
    <>
      <p>
        Every quarter your motion produces evidence — what resonated, who
        moved, why deals died. In most companies that evidence evaporates:
        scattered across tools, trapped in reps&rsquo; heads, reset by the
        next campaign. The learning your budget paid for rounds to zero.
      </p>
      <p>
        GTM Intelligence is the <strong>memory and the loop</strong>: signal
        taxonomy, win/loss intelligence, resonance telemetry, and a quarterly
        calibration program that turns evidence into the next quarter&rsquo;s
        advantage — documented, owned by you, compounding.
      </p>
    </>
  ),
  accent:
    "The firms that keep their learning don't need to be lucky twice.",
  wires: [
    {
      code: "C·01",
      name: "Narrative Systems",
      href: "/capabilities/narrative-systems",
      line: "Receives what resonates — the story versions itself on evidence.",
    },
    {
      code: "C·02",
      name: "GTM Infrastructure",
      href: "/capabilities/gtm-infrastructure",
      line: "Executes what the signals decide — routing, timing, channel.",
    },
  ],
  services: [
    {
      n: "S·01",
      name: "Signal taxonomy & intent monitoring",
      desc: "Which signals actually precede revenue in your motion — hiring, funding, tech change, intent — monitored and scored.",
      artifact: "Signal taxonomy",
    },
    {
      n: "S·02",
      name: "Account prioritization model",
      desc: "In-market accounts first: attention routed by evidence instead of alphabetical territory lists.",
      artifact: "Prioritization model",
    },
    {
      n: "S·03",
      name: "Win/loss & objection intelligence",
      desc: "Structured interviews and deal telemetry — why you actually win, why you actually lose, in the buyer's words.",
      artifact: "Win/loss dossiers",
    },
    {
      n: "S·04",
      name: "Narrative resonance telemetry",
      desc: "Message versions tested across channels — reply quality and meeting rate, not vanity opens.",
      artifact: "Resonance reports",
    },
    {
      n: "S·05",
      name: "Pipeline analytics & entropy index",
      desc: "Learning retained across cycles, expressed as one number leadership actually watches.",
      artifact: "Entropy index",
    },
    {
      n: "S·06",
      name: "Competitive & market intelligence",
      desc: "Category moves, pricing shifts, and narrative drift — briefed monthly, wired into the objection library.",
      artifact: "Market brief",
    },
    {
      n: "S·07",
      name: "Quarterly calibration program",
      desc: "The loop closed on a schedule: what compounded, what dies, what ships next quarter — decided on telemetry.",
      artifact: "Calibration readout",
    },
  ],
  stats: [], // filled from verified research
  install: {
    weeks: "Weeks 1–6 · fixed scope",
    items: [
      "Signal taxonomy built from your closed-won history",
      "Win/loss program stood up — first dossiers delivered",
      "Resonance telemetry wired into live channels",
      "Entropy baseline measured and reviewed with leadership",
    ],
  },
  retainer: {
    cadence: "Monthly + quarterly · on your data",
    items: [
      "Signal monitoring and prioritization refresh",
      "Ongoing win/loss interviews and dossier updates",
      "Monthly market brief into the narrative system",
      "Quarterly calibration readout with leadership",
    ],
  },
  convert: {
    title: "Your pipeline is already talking.",
    sub: "The audit is the first listen — ten working days instrumenting what your motion already knows but nobody wrote down. The readout is yours to keep.",
  },
};
