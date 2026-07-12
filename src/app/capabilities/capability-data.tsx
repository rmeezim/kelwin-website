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
  stats: [
    {
      figure: "95:5",
      claim:
        "Up to 95% of category buyers aren't in-market at any one time — roughly 5% in a given quarter. The narrative has to build memory with buyers who aren't ready yet (published as a heuristic, not a measurement).",
      source: "Ehrenberg-Bass · B2B Institute",
      year: "2021",
      url: "https://marketingscience.info/news-and-insights/advertising-effectiveness-and-the-95-5-rule-most-b2b-buyers-are-not-in-the-market-right-now",
    },
    {
      figure: "17%",
      claim:
        "Share of the buying journey committees spend meeting all potential suppliers combined — any single rep may get 5–6%. Your documents argue in rooms you never enter.",
      source: "Gartner",
      year: "2019",
      url: "https://www.gartner.com/en/sales/insights/b2b-buying-journey",
    },
    {
      figure: "6–10",
      claim:
        "Decision makers in a typical complex B2B purchase — each armed with 4–5 independently gathered pieces of information the group must deconflict.",
      source: "Gartner",
      year: "2019",
      url: "https://www.gartner.com/en/sales/insights/b2b-buying-journey",
    },
    {
      figure: "81% → 31%",
      claim:
        "Purchase likelihood collapses as the buying group grows from one person to six or more. Consensus dies without shared language (CEB research; 5.4 formal sign-offs on average).",
      source: "CEB · Harvard Business Review",
      year: "2015",
      url: "https://hbr.org/2015/03/making-the-consensus-sale",
    },
    {
      figure: "~70%",
      claim:
        "How far through the purchase buyers are before they engage sellers at all — and 81% already hold a preferred vendor at first contact (2,509 buyers surveyed).",
      source: "6sense Research",
      year: "2024",
      url: "https://6sense.com/science-of-b2b/2024-buyer-experience-report/",
    },
    {
      figure: "80–90%",
      claim:
        "Buyers who start with a “day-one list” of vendors before doing any research — and roughly 90% ultimately choose from that list (1,208 buyers surveyed).",
      source: "Bain & Company × Google",
      year: "2022",
      url: "https://hbr.org/2022/09/what-b2bs-need-to-know-about-their-buyers",
    },
  ],
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
  stats: [
    {
      figure: "1 in 6",
      claim:
        "Legitimate marketing emails that never reach the inbox — global average placement fell to 83.5% in 2024, with 6.7% landing in spam and 9.8% going missing entirely.",
      source: "Validity",
      year: "2025",
      url: "https://www.validity.com/resource-center/2025-email-deliverability-benchmark-report/",
    },
    {
      figure: "$36 : $1",
      claim:
        "Average return per dollar spent on email — the highest-ROI channel there is, when it actually arrives (survey of 2,000+ marketers).",
      source: "Litmus",
      year: "2020",
      url: "https://www.litmus.com/resources/email-marketing-roi",
    },
    {
      figure: "28%",
      claim:
        "Share of the week reps actually spend selling. The rest disappears into deal management and data entry — the tax of a disconnected stack (7,775 sellers surveyed).",
      source: "Salesforce",
      year: "2022",
      url: "https://www.salesforce.com/news/stories/sales-research-2023/",
    },
    {
      figure: "$12.9M",
      claim:
        "Average annual cost of poor data quality per organization, per a Gartner survey of large enterprises. Hygiene isn't housekeeping — it's a P&L line.",
      source: "Gartner",
      year: "2021",
      url: "https://www.gartner.com/smarterwithgartner/how-to-improve-your-data-quality",
    },
    {
      figure: "8.5%",
      claim:
        "Outreach emails that get any reply at all, across 12 million sends — and a single follow-up may lift replies by ~66%. Volume without engineering is noise.",
      source: "Backlinko × Pitchbox",
      year: "2019",
      url: "https://backlinko.com/email-outreach-study",
    },
    {
      figure: "+32.7%",
      claim:
        "More replies for personalized message bodies — +30.5% for personalized subject lines — across the same 12M-email dataset (correlational, but directionally decisive).",
      source: "Backlinko × Pitchbox",
      year: "2019",
      url: "https://backlinko.com/email-outreach-study",
    },
  ],
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
  stats: [
    {
      figure: "84%",
      claim:
        "Deals won by the first vendor a buyer contacts. Knowing who's in-market before they call is most of the game (900+ B2B buyers surveyed).",
      source: "6sense Research",
      year: "2023",
      url: "https://6sense.com/newsroom/84-of-b2b-deals-are-decided-before-marketers-even-know-about-them/",
    },
    {
      figure: "7×",
      claim:
        "More likely to qualify a lead when contacting within an hour versus even an hour later — and 60× versus waiting 24 hours (audit of 2,241 companies).",
      source: "Harvard Business Review",
      year: "2011",
      url: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
    },
    {
      figure: "up to 50%",
      claim:
        "Win-rate improvement seen by companies running comprehensive win/loss analysis programs — alongside 15–30% revenue gains (Gartner tech go-to-market research).",
      source: "Gartner",
      year: "2014",
      url: "https://www.gartner.com/en/documents/2742417",
    },
    {
      figure: "23×",
      claim:
        "More likely to clearly outperform competitors on new-customer acquisition when customer analytics is used intensively — and 9× on customer loyalty.",
      source: "McKinsey & Company",
      year: "2014",
      url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/five-facts-how-customer-analytics-boosts-corporate-performance",
    },
    {
      figure: "45%",
      claim:
        "Sales leaders and sellers with high confidence in their organization's forecast accuracy — and only 47% trust their own data quality.",
      source: "Gartner",
      year: "2020",
      url: "https://www.gartner.com/en/newsroom/press-releases/2020-02-12-gartner-says-less-than-50--of-sales-leaders-and-selle",
    },
    {
      figure: "60–73%",
      claim:
        "Share of enterprise data that goes unused for analytics. The evidence your motion produces mostly evaporates — unless something is built to keep it.",
      source: "Forrester",
      year: "2016",
      url: "https://www.forrester.com/blogs/hadoop-is-datas-darling-for-a-reason/",
    },
  ],
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
