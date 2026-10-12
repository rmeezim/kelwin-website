# Kelwin interior pages · story map (round 8)

**What this is.** The structure, flow and story of every interior page for the v5 redesign. It answers your round-7 call C7: *"redesign all the other pages … and restructure those pages … in terms of their visual flow, content coherence, and storytelling."* The homepage, the footer, the 404 and the nav bar stay as you approved them. This map covers every page a visitor reaches from them, and the two mega-menu plates you never reviewed.

**How it was made.** Five readers inventoried every interior page. Two designers then drew competing maps:
- **A** was organised around the buyer's next question.
- **B** was organised around proof and authority.

This file is the judged synthesis. **B is the spine:** one signature artifact per page, a different header shape on every page, every route kept, and the approved footer untouched. **A supplied the reading order and the rules:**
- the buyer's question sequence and its onward links;
- landing on the homepage's exact words;
- the stricter honesty rules (two readings at most per page, nothing fabricated left in);
- the recast of /reports and the move of research to /insights;
- no red on the low-intent pages;
- the gate's accessibility work.

**Precedence.** Your standing rules (CLAUDE.md) come first, then `ROUND2–7-NOTES.md`, then `STORY.md` (the homepage ★ lines), then `DIRECTION-AC.md`, then this file. Homepage, footer and Capabilities-plate copy stay verbatim unless §7 gets your yes.

**Copy tags**

| Tag | Meaning |
|---|---|
| **[K]** | Kept verbatim (source named) |
| **[R]** | Rewritten from existing copy |
| **[N]** | New, drafted here in Kelwin's voice, for your review |
| **(FS)** | Changes copy you already approved. Needs your yes. |
| **(FC)** | A fact only you can confirm. Built as drafted, flagged in review, never shipped unconfirmed. |

---

## 0 · The idea

The homepage makes the argument by the order it puts things in. The interior pages answer the questions that argument leaves open, by showing the work rather than describing it.

**What each page shows**
- **A capability page** holds a page of the document that layer delivers, filled in for Kelwin itself, so nothing on it belongs to a client.
- **/about** puts the person behind the letter's signature next to the five rules the firm runs by, and shows where each rule binds in the method.
- **/reports** shows a full readout as a specimen and says first that none has cleared yet.
- **/audit** draws the ten days to scale, then ends on the three questions.

**What every page does**
- Answers one question a serious buyer (a B2B founder or revenue leader) has at that point.
- Deepens the homepage rather than repeating it.
- Ends at one of the two doors.
- Never claims an install base, a team, a build or a result it can't show. Authority comes from being specific, sourced and candid.

### The question sequence (the reading order)

| # | The buyer's question | Page | Sent there by |
|---|---|---|---|
| 1 | "What exactly would you build in my company, and what would I hold?" | `/capabilities/narrative-systems` · `/gtm-infrastructure` · `/gtm-intelligence` | Nav Capabilities plate, footer, /who-we-work-with, /audit |
| 2 | "Is a company like mine what you're for?" | `/who-we-work-with` | Homepage fit "Three situations, told from inside" |
| 3 | "Who is behind this, and can I trust them?" | `/about` | Homepage letter signature "Rameez" |
| 4 | "Do they think clearly about my problem?" | `/insights` + three notes | Letter P.S. "Field notes, published", evidence door |
| 5 | "Show me proof. What do I actually get?" | `/reports` | Nav, /insights, /audit |
| 6 | "What does the first step ask of me, and how do I start?" | `/audit` | Every red button |
| 7 | "I'm not ready, or I need something specific." | `/contact` | Every quiet door |
| — | Side questions: "Are they hiring?" · "Are they a software company?" · "What happens to my data?" | `/careers` · `/the-lab` · `/privacy`, `/terms` | Nav, footer, /about |

---

## 1 · Rules every interior page follows

### 1.1 Frame
- Each page renders as `<main id="main" tabIndex={-1} className="km-page">`. That class also stops the legacy `.site-grain` overlay drawing.
- Every section sits in a `Slot`, and every section root sets `data-surface`.
- Behaviour follows `init(root, { reduced })` and returns a cleanup.
- Server components by default. Client components only for the gate, the forms, the self-check and the interactive drawings.
- Internal links use `next/link`, so they resolve under the `basePath`.
- One `h1` per page, which is the header statement.

### 1.2 The header: the approved Specimen sheet, title block retired
Built from `site/frag/interior/X`. The "Fig. 1.1 … Specimen" title block is gone, under standing rule 2.

**Header parts, in order**
1. Solid graphite nav. No photo, no film, no transparent bar.
2. Label row: ■ page label + mono breadcrumb meta (for example "Capabilities / 01"). This is the only label row on the page that carries meta. Body label rows carry none.
3. Two-voice statement, the `h1`: 96px at 1440 (64px floor), cols 1–9/10, exactly one `.ac-accent`.
4. 48×2 rule.
5. Lede: cols 1–6, 20px.
6. Facts ledger: three rows in cols 9–12, bottom-aligned with the lede. The keys belong to the page. Usually one row is the quiet door, for example "Starts with · The System Audit ↗".
7. **The band:** the page's own shape. It is a drawing, a document, a ruler or a board, inside a registration frame. It spans cols 1–12, 280–340px tall, with ≤4 callouts, ≤1 dimension and **exactly one red element**. Text-sheet headers have no band (contact, articles); legal uses a contents strip.
8. A ruled cut into the body.

**Rules**
- **No two pages share a band kind** (see §5).
- **No red button ever appears in a header.** The red stays on the drawing, as you approved for X.

### 1.3 Section heads, and a cap on slogans
- **Body sections** use: label row (■ label, no meta) → one-line `h3` → optional lede.
- **Two-voice statements per page:** at most **two** — the header `h1` plus one more (in a section or in the close). You said the homepage "tries too hard", and STORY.md capped big heads for the same reason. Interior pages follow the same restraint.

### 1.4 Closes ("the Door"), in five variants so no close becomes a template
Every Door states what the audit returns *for this page's subject*, using the audit's documented scope only. It never says the audit "instruments" anything.

| Code | Variant | What it is | Used on |
|---|---|---|---|
| **D1** | Decision band | Label + one sentence in display type (32–42px) on the left. Red **Request a System Audit** + quiet **Talk to the team** on the right. The page's small object above, and one onward link below a hairline. | The three capability pages · Reports · articles (compact) |
| **D2** | Statement close | A 64px two-voice line + lede + doors | About · Insights |
| **D3** | Gate close | The honest list on the left; the gate line and doors on the right | Who we work with |
| **SC** | Split close | Two things side by side on paper | The Lab |
| **QC** | Quiet close | Quiet links only, no red | Careers (after the form) · Contact · legal |

**Onward links.** One per page, written as the buyer's next question, for example "Who would you be working with? → About". This is A's spine made visible, kept small: an `.ac-link`, never a band.

**The red plane stays homepage-only.** It is the one decision moment you approved, and repeating it would cheapen it.

### 1.5 Surfaces and red
- **Graphite is the base.** Graphite→graphite seams are `.ac-sec--ruled`. Never more than three graphite sections in a row.
- **Paper means a document you could hold:** a specimen, the doctrine, a form, an article's body, legal text. Every page gets **exactly one** paper moment, and it is always named in the page spec.
- **Red is limited to:**
  - the label squares and the rule;
  - plus **one red per view**: a red button *or* a drawing's one red element, never both in the same view.
- **Every red button goes to /audit.** The only exception is /audit's own "Book the strategic call", which *is* the audit action.
- **Form submits are outlined** (`.ac-btn-o`) on /contact and /careers, following your C5 call on the Lab.
- **No red at all** on /contact and /careers (beyond label squares and the careers drawing). They are the low-intent and the hiring doors.

### 1.6 Specimens and status (never fabricate)
- **One shared `SpecimenTag`:** a mono "Specimen" chip plus one support line at ≥13.5px saying what is illustrative, for example "Specimen · illustrative rules. No client data."
- **What it covers:** every illustrative artifact on the interior carries one. That keeps Terms L·03 true.
- **Status words:**
  - nothing unbuilt is called live;
  - the allowed statuses are *In development · Drafting · In production · Not yet published · None yet*;
  - no date is shown unless you confirm it.

### 1.7 Readings (third-party figures)
- **At most two per page.** None of the homepage's four (17%, 95:5, 77%, 53%).
- **How each is shown:**
  - its unit in words;
  - source · year;
  - a link that opens in a new tab, with visually hidden text that says so;
  - hedged exactly as its source hedges it.
- **Before launch:** every kept link is re-verified. The research pass in commit `8a012cb` could not be re-checked from this sandbox.

### 1.8 Motion
- **Per page:** one orchestrated moment (the header band's morph, played once at 40% visible), plus at most two play-once body moments.
- **None of these:** pins, count-ups, pulses, blinks or marquees.
- **Ambient loops:** one on the whole interior — the approved slow drift on Narrative's clean line (≥12s).
- **Reduced motion:** draws the final state synchronously, with no timers.

### 1.9 Phones (the round-7 C1 lesson)
- **Recompose, don't shrink:**
  - every drawing gets its own composition at ≤767px;
  - ≤3 strokes per bundle below 600px;
  - callouts become a keyed list under the drawing;
  - 1px non-scaling strokes;
  - nothing jitters.
- **Review widths:** every band is reviewed at 320, 390, 834, 1024 and 1440 before it is built.
- **Floors and limits:**
  - no text under 11px;
  - no horizontal overflow from 320 to 2560;
  - no reading content hidden behind tabs on phones.

### 1.10 Voice for new copy
- **Write:** short declarative sentences, "you/your", British spelling in new copy (existing strings stay as written).
- **Never in new copy:**
  - "not X — Y" formulas in statements;
  - "on purpose";
  - "compound" (the homepage budget plus the nav's one approved use is the site total; B·02's existing sentence is kept verbatim);
  - OS, registry, node, clearance, restricted, probe or telemetry used as decoration;
  - stamps;
  - slogans stacked on slogans.
- **One em-dash per sentence at most.**
- **Reuse:** where a homepage word exists for a thing, use it.
- **Names:**
  - one count of three: **Narrative Systems · GTM Infrastructure · GTM Intelligence**;
  - two assets per layer, named as on the handover: **Narrative OS, Channel Playbooks · ICP & Signal Map, Orchestration Rules · Signal Dashboard, Rebuild Sequence**;
  - four phases: **Diagnose · Architect · Install · Calibrate**, with **Handover** as the datum.
- **Doors:**
  - red: **Request a System Audit**;
  - quiet: **Talk to the team**;
  - in a facts ledger: **The System Audit ↗**.
- **No Plurel anywhere.** No "Fig." anywhere. No typed "KELWIN".

### 1.11 What retires everywhere
**Components and their styles**
- `PageCommand` (and every photo it uses: dune-predawn, careers-footprints, ind-\*, band-beacon, strata-layers, lab-startrails, audit-canyon, contact-lights, docs-paper), and its gradient scrims.
- `ConvertPanel`, sand `ArrowLink`, `FirmPages.css` (`.fp3`), `CapabilityDetail`, `InsightsIndex`, `CaseStudies`, `LabBriefing`, `FirmAbout`, `FirmFit`, `FirmBench`, `AuditSpec`, `DotMatrixReading`.
- HeroCTA's default label "INITIATE SYSTEM AUDIT".
- Page-level IntersectionObserver reveals.

**Type, colour and devices**
- Instrument Sans and Inter.
- Sand, clay, patina, steel and taupe hex inside sections.
- Red-mono eyebrows with dashes.
- Every "KELWIN/OS · …", "FILE 0n", "FIRM/0n", "C·0n/0n", "K-LAB/BRIEF", "L·0n", "K-PRIV/01" meta.
- Blur, scanlines, hatching and drop shadows.
- Text under 11px, and mono used as prose.

**Rebuilt in the kit, behaviour kept:** QualifyFlow (the gate), ContactChannel (the form), ArticleDoc, LegalDoc.

---

## 2 · Information architecture

### 2.1 Pages: every route stays, no new route

| Route | Verdict | Single job | Signature artifact |
|---|---|---|---|
| `/capabilities/narrative-systems` | Rebuild on approved header X | What gets built in this layer, and what you hold | The message matrix, filled in for Kelwin (specimen) |
| `/capabilities/gtm-infrastructure` | Rebuild, repositioned off "outbound" | The machine, in your stack, documented | The Orchestration Rules sheet (specimen) |
| `/capabilities/gtm-intelligence` | Rebuild | How the system learns each quarter, and who runs it | A Rebuild Sequence, re-scored (specimen) |
| `/audit` | Rebuild the header, readout and gate; the approved FAQ stays | Turn high intent into a booked call | The ten days to scale, then the gate |
| `/contact` | Rebuild | A person answers: the low-intent door | The memo you write back |
| `/who-we-work-with` | Rebuild, promise first | Recognise your situation, or your decline | The break chart |
| `/about` | Rebuild around the person and the doctrine | The firm behind the signature | Where the five rules bind |
| `/careers` | Rebuild, honest zero-state | No seats today; the bench list | The seat plan |
| `/the-lab` | Rebuild as R&D with true status (§7 Q4) | Instruments under the service | The status board |
| `/insights` | Rebuild; absorbs the research documents now on /reports | How Kelwin thinks, one layer at a time | The register |
| `/insights/revenue-entropy` · `/the-17-percent-window` · `/deliverability-is-infrastructure` | Rebuild on one article template | One argument, sourced, ending at its layer | One drawn figure each |
| `/reports` | **Job changed:** the readout format, as a specimen, plus the publication rule. The two invented case dossiers are cut. | Show me proof, honestly | The annotated readout (specimen) |
| `/privacy` · `/terms` | Restyle only; text verbatim apart from flagged syncs | Plain documents, visibly in draft until counsel signs | The contents strip |
| 404 | **Unchanged** (approved, C6). It is the reference for `km-page` + `Slot` + head grammar. | — | — |

**Considered and not added**
- **`/capabilities/` index.** The homepage System section already is the one-page view of the stack, and the nav rail already sends people to `/#s-system`. The header breadcrumb "Capabilities / 0n" stays plain text. `/capabilities/` keeps falling to the approved 404, and nothing links to it.
- **`/methodology` as a page.** Design A proposed one. It is not added:
  - it would partly redraw the homepage method (the gantt already carries the Handover datum and the dotted "With us on retainer" lane);
  - it would change the approved footer's link;
  - instead, each capability page carries "How it runs" for its layer, and /audit deepens Diagnose;
  - Methodology stays the homepage anchor `/#methodology`.
- **Research documents (R·01–R·03)** move from /reports to /insights, so all unpublished writing lives on one list and /reports is only about the readout.

### 2.2 Nav (the approved bar, plus round-7 C2 and C3 as in the working tree)

**Bar**
- Unchanged: five items, the outlined "Audit request ↗", the + marks, and C2's condensed translucent desktop bar once scrolled.
- **On `/audit`:** no item lights (today "Capabilities" lights, which is misleading). The outlined "Audit request ↗" takes `aria-current="page"` and jumps to `#qualify`.

**Capabilities plate.** Approved copy and behaviour stay; the round-7 C3 paper door applies. One flagged rename (FS):
- 02.2 "Outbound engine build" → **"Data pipeline & signal map"**. R4 flagged this item as the one that reads "we run your outbound". The new name uses the homepage's own words ("We build the data pipeline into your CRM") and the asset's name ("ICP & Signal Map").

**The Firm plate** (never reviewed; new copy). It gets a foot band like the Capabilities plate, so plate heights stop jumping.

| Strip | Title | Descriptor | Glyph (a mini of the page's band) |
|---|---|---|---|
| F·01 | About Us [K] | The founder, the rules the firm runs by, and how it's built today. [N] | Mini rule matrix (LATTICE). Replaces the corner-bracket glyph, which echoed the logo. |
| F·02 | Who We Work With [K] | Three situations we're built for, and who we send away. [N] | Three mini elevations |
| F·03 | Careers [K] | No open seats today. The bench list is open. [N] | Mini seat plan |
| Band | Rail: "The founder's letter — why Kelwin exists, in his words. →" (/#s-letter) [N] | | Paper door: The System Audit [K] |

**Resources plate** (never reviewed; new copy). Same foot band.

| Strip | Title | Descriptor | Glyph |
|---|---|---|---|
| R·01 | Insights [K] | Field notes on how revenue systems break, one layer at a time. [N] | Register rows |
| R·02 | Reports [K] | What a readout looks like, and the ones clients clear. [N] | Sheet deal |
| R·03 | **Talk to the team** [R] (was "Get in touch", which had no tag) | Questions, documents, press. A person answers. [N] | Line into a point |
| Band | "Every engagement opens with a fixed-scope audit." [K approved nav/S band] | | Paper door: The System Audit [K] |

**Other nav decisions**
- **The Lab** keeps its top-level slot by default (approved chrome). §7 Q4 asks whether it moves under The Firm, as the footer files it.
- **Navbar.css** drops every PageCommand special case:
  - the 68px header over `.pgc`;
  - the transparent resting bar;
  - the phone + marks hidden over `.pgc`.
- **The stale `Navbar.tsx` comment** "Each plate's one red is the System Audit door" is updated.

### 2.3 Footer
Unchanged (approved footer/U, verbatim). Every route it links survives. Methodology stays `/#methodology`.

### 2.4 How a serious buyer moves
1. **The founder, from the letter.** "Rameez" → /about (the person, then the rules, then the week) → onward to field notes → /reports (the readout specimen) → red → /audit (ten days → what you keep → FAQ → the gate → booking).
2. **The revenue leader, evaluating one layer.** Nav → GTM Infrastructure (the untangled route, the rules sheet) → the Door ("the audit's channel orchestration map") → /audit. Or across: "Read by GTM Intelligence →".
3. **The sceptic, looking for proof.** Nav → Reports ("Cleared for publication · None yet", then the full readout specimen) → Insights (sourced notes) → About (who wrote them) → /audit.
4. **Not ready yet.**
   - The hero's "Talk to the team" or the letter P.S. → /contact (the memo).
   - Declined at the gate → the field notes, or Talk to the team.
5. **The candidate.** Nav → Careers (the seat plan, then the bench list). Or /about's "The firm today" row → Careers.

### 2.5 Landing on the homepage's own words (continuity)

| Homepage, approved | Lands on | First words there |
|---|---|---|
| Letter signature "Rameez" + "Founded 2026 — deliberately late to the category." | /about | H1 "The firm behind / the signature." · facts "Founded · 2026 — deliberately late to the category." |
| Letter "If you write to us, a person answers." + P.S. "Write to the founding team" | /contact | H1 "Write to us. / A person answers." |
| Letter "Field notes, published" + three notes | /insights | H1 "Field notes, / published." |
| Evidence door "Field note · The 17% window · 5 min" | /insights/the-17-percent-window | Its title, with the Gartner source now linked |
| Fit link "Three situations, told from inside" | /who-we-work-with | H1 "Three situations, / told from inside." |
| Fit lede "…the honest list of who we send away" | /who-we-work-with close | "■ Who we send away" |
| Method "Diagnose · The real constraint, named — in a written readout." | /audit | H1 "The real constraint, / named in writing." |
| CTA "Three questions → a 30-minute call with the founding team → Day 01" + "Phase 01 / 04 · Diagnose" + the ten-tick ruler | /audit | Meta "Phase 01 / 04 · Diagnose" · the ruler drawn large · the gate "Three questions, then a call." |
| System tail "Find your weakest layer" | /audit | "The readout names your weakest layer first." · the gate's "Where the audit looks first" |
| Handover's six assets | Capability pages | Facts "Output · <the layer's two assets>" and a page of one of them |
| Method "Calibrate · yours, run by your operator or with us on retainer" | Capability pages | Each page's "How it runs" |
| Nav glyphs CONTOUR · TRACE · ORBIT | Capability pages | The same primitive, drawn large in a new variant |

### 2.6 Body cross-links (excluding nav and footer; + marks a link that doesn't exist today)
- **Narrative Systems:** siblings · + 17% note · + /#methodology · doors
- **GTM Infrastructure:** siblings · + deliverability note · + /#methodology · doors
- **GTM Intelligence:** siblings · + revenue-entropy note · + /the-lab · + /#methodology · doors
- **/audit:**
  - + the three capability pages (one per readout part)
  - + /reports (the full specimen)
  - /insights and /contact (decline)
  - #qualify
- **/contact:** + /audit (quiet) · + /privacy at the point of collection
- **/who-we-work-with:**
  - all three capability pages (+ GTM Infrastructure, never linked before)
  - + /insights (pre-revenue)
  - + /about
  - doors (+ the "not sure" line is now a link)
- **/about:** + /#s-letter · /careers · + /the-lab · + /insights · doors
- **/careers:** + /about · + /contact?topic=careers · + /audit (quiet) · + /privacy
- **/the-lab:** + /capabilities/gtm-intelligence · /contact?topic=lab · + /privacy · doors
- **/insights:** three notes · + /reports · + /contact?topic=research|notes · doors
- **Each note:** + its layer page · + next note · + sources · doors
- **/reports:** + /insights · doors
- **/privacy ↔ /terms:** + each other. Terms L·02's "the audit" + → /audit.

Three gaps close: GTM Infrastructure had no inbound link from /who-we-work-with, /reports had no inbound link from the page body anywhere, and no note linked to its layer.

---

## 3 · Templates

### 3.1 The capability page (used three times, with three shapes)

**One spine, five slots.** The slot order and every layout differ per page (§5):
1. **head**: header X;
2. **services**: what we install;
3. **specimen**: a page of one asset, on paper;
4. **runs**: how it runs through the method;
5. **door**: D1.

**Header X facts ledger.** It keeps its approved keys and changes two values (FS):
- **Engagement** · Scoped at the readout. Replaces "6-week install, then retainer": the approved FAQ Q3 says no number is quoted before the audit, and the capability pages contradicted it.
- **Output** · <the layer's two homepage assets> — yours. Replaces "Seven artifacts you own".
- **Starts with** · The System Audit ↗ [K X].

**Taxonomy (one system, matching the nav).**
- **Services:** each layer shows **four**, named exactly as the nav's 0n.1–0n.4. Each "Ships" an artifact that rolls up into one of the layer's **two** assets.
- **The 21 overlapping services on today's pages fold in as follows:**

  | Folded service | Where it goes |
  |---|---|
  | Narrative telemetry hooks | 03.3 |
  | Objection library | 01.3. Objection *intelligence* stays in 03.2. |
  | Pipeline instrumentation and pipeline analytics | The Signal Dashboard |
  | Quarterly calibration | 03.4, as where the method's Calibrate lives |
  | Entropy index | Leaves the menu and goes to the Lab with its status |
  | Champion kit | 01.4 |
  | Data pipeline + outbound engine | 02.2 |
  | Operator playbook | The Handover phase |

- **Numbering:** C·0n and S·0n retire; 0n.1–0n.4 stay.

**Removed from all three pages:**
- the install durations ("Weeks 1–6/1–8 · fixed scope") and the "Fixed-scope install" chip;
- Phase I/II blocks that made the retainer read as mandatory;
- the 3×2 stat-card grids;
- "SOURCED, NOT INVENTED" and "EVERY LINE SHIPS AN ARTIFACT";
- "yours when we leave" (you approved "If", not "when");
- every claim that the audit "instruments" anything.

### 3.2 The article page
**Head (text sheet, no band)**
- Label "■ <Layer>" + meta "Field note · <Month Year>".
- The title as a two-voice `h1` at 64–72px; the standfirst as the lede.
- Facts:
  - Written by · Rameez, founder (FC);
  - Reading · <n> min (§7 Q6);
  - About · <layer page> ↗.

**Body (paper, the page's one paper moment)**
- A reading column in cols 3–8 (about 66ch, 17–18px) on the real 12-column grid, aligned to the page margins.
- The margin (cols 10–12) holds:
  - the layer glyph;
  - numbered source sidenotes;
  - "What to look for" notes in 15px Mona, replacing the mono "Field reading" panels. First-person experience claims carry the wording §7 Q2 settles.
- One drawn figure spans cols 1–12 at the point where the argument turns, and plays once.
- At most one pull quote, in the accent voice (weight 300, `--fg-2`). It never repeats adjacent text.
- `<em>` renders at weight 600, never italic.
- **Fix the missing space after bold lead-ins.** 6 of the 10 lead-ins across the three notes render as "failure.The".

**Foot (graphite)**
- Sources as an `.ac-spec`: source · year · link ↗ (announced "opens in a new tab").
- "This note is about · <Layer> →" and "Next note →" (cycles 01→02→03).
- A compact D1 with a per-note line.
- The shared coda "If this note reads like your quarter…" retires.

### 3.3 The legal page (/privacy, /terms)
**Head (graphite)**
- Label "■ Legal" + meta "Privacy policy" or "Terms of service".
- `h1` [R]:
  - Privacy: "Privacy policy. / What we collect: almost nothing." (from its own intro, which is verified true);
  - Terms: "Terms of service. / The short, readable version." (from its own intro).
- Lede: the existing intro [K].
- Facts:
  - Effective · July 2026 [K];
  - **Status · Draft, pending legal review** [N] (rule 7; §7 Q8);
  - Questions · audit@kelwin.co [K].
- Band: a **contents strip**. The clause index runs as `.ac-idx` 01–09 links. There is no drawing: the legal pages are where the site rests.

**Body and close**
- **Body (paper):** clauses verbatim in a reading column, numbered plainly in the margin. "L·0n" and "K-PRIV/01" retire.
- **Close (QC):** "Questions about this document → audit@kelwin.co" · the other legal page →.
- **Phone:** the contents strip becomes an `.ac-toggle` list.

---

## 4 · Page by page

Each section is given as **job · content · presentation**. Paper (P) and graphite (G) are marked; "ruled" means a ruled graphite→graphite seam.

### 4.1 `/capabilities/narrative-systems` · "Decide what the market hears"
- **Job:** show what a narrative system physically is, and what you'd own.
- **Visitor's question:** "What would you do to our positioning and messaging, what do we walk away with, and how is this different from a messaging consultant?"
- **Story:** four pieces of work become one document every channel inherits. Here is a page of it, filled in for the firm you're reading.
- **Metadata description [R]:** "Positioning, message architecture, sales language and proof, built as one documented system every channel inherits — and what you own at the end."

**0 · Header X (G) [K X, title block removed]**
- **Header copy**
  - Label "■ Narrative Systems" · "Capabilities / 01".
  - H1 "Decide what / *the market hears.*"
  - Lede "Buyers run most of the journey without you in the room. We make what they hear deliberate."
  - Facts: Engagement · Scoped at the readout (FS) · Output · Narrative OS and Channel Playbooks — yours (FS) · Starts with · The System Audit ↗.
- **Band: CONTOUR [K X]**
  - The drawing: five jittery lines settle through a filter into one clean line that meets the frame at the **red output tick**.
  - Labels: flags 01.1 Positioning · 01.2 Message matrix · 01.3 Sales language · 01.4 Proof & evidence; dimension "One voice".
  - Ambient: a ≥12s phase drift on the clean line only.
- **The C1 guard**
  - The bundle stays a bundle inside the band and passes through a drawn filter bracket that carries the four flags. It never fills a poster sheet the way the homepage principle figure does.
  - The settle is computed on a fixed viewBox, so it can't fragment.
  - At ≤767px: three lines, the filter at 40% width, and the flags as a keyed list under the band.

**1 · What we install (G, ruled) · strips ×4 [K X body]**
- Label "■ What we install".
- Statement "The story is not copy. / *It's infrastructure.*" [K X]. This is the page's second statement.
- Support line [R]: "Four services, each shipping into one of two assets you own."
- Four strips reuse the flag codes, so the drawing is the map and the strips are its legend.

  | Code | Strip | Line [K X] | Ships [K X] | Rolls up to [N] |
  |---|---|---|---|---|
  | 01.1 | Positioning | The problem named your way, with competitors re-mapped around it. | Category brief | Narrative OS |
  | 01.2 | Message matrix | What the champion, the buyer and the skeptic each need to hear. | Message matrix | Narrative OS |
  | 01.3 | Sales language | Talk tracks, demo narrative and objection answers in one voice. | Language system | Channel Playbooks |
  | 01.4 | Proof & evidence | What must be proven, and in what order, for a committee to say yes. | Proof map | Narrative OS |

**2 · A page from the Narrative OS (P) · document specimen, the signature artifact**
- **Head**
  - Label "■ A page from the Narrative OS".
  - `h3` [N] "The message matrix, filled in for Kelwin."
  - Lede [N]: "Every Narrative OS starts from this sheet: what each person in the deal needs to hear, in what order, and the proof that carries it. This one is filled in for the firm you're reading, so nothing on it belongs to a client."
- **The sheet:** a 1px-ruled document. The four columns are the traits from your 17% note [N]: *The problem, named · The mechanism · The proof · If it fails*. The rows match strip 01.2. Cells are built from approved Kelwin lines:

  | | The problem, named | The mechanism | The proof | If it fails |
  |---|---|---|---|---|
  | **Champion** (the founder) | "Growth is real, just not predictable yet." | "Three layers installed in our stack, then run." | "A written readout before anything is built." | "The readout is ours either way." |
  | **Economic buyer** (the CFO) | "Every quarter pays to relearn the last one." | "Each quarter deposits into the next." | "Six assets we own outright." | "If it stops working the day they leave, they built it wrong." |
  | **Skeptic** (head of sales) | "We've hired agencies before." | "Nothing rented. The system stays in our stack." | "If they're not the fix, the audit says so." | "Ten working days, fixed scope." |

- **Callouts (4)** [N]: Named in the buyer's words · Retells in one sentence · Ordered for a committee · Answers the risk question.
- **The one red:** a single underline beneath the Champion's mechanism cell, the sentence that has to survive being retold.
- **Margin readings (cols 10–12),** the "why a row per listener" [K figures, R wording]:
  - "6–10 · decision makers in a typical complex B2B purchase · Gartner, 2019 ↗"
  - "81% → 31% · likelihood of purchase as the buying group grows from one person to six or more · CEB, Harvard Business Review, 2015 ↗"
  - "Field note · The 17% window →"
- **Under the sheet** [R, handover asset 02]: "**Channel Playbooks** — the same claims, written into the plays for email, LinkedIn, phone, content, paid and events."
- **SpecimenTag:** "Specimen · the structure every Narrative OS uses, filled in with Kelwin's own positioning. No client data."
- **Behaviour**
  - Motion: the rules draw, then the cells typeset row by row, once.
  - Phone: three stacked listener cards, all visible.

**3 · How it runs (G) · phase track**
- **Head:** label "■ How it runs"; `h3` [N] "From the readout to your operator."
- **Five columns on one hairline,** with Handover as a datum and Calibrate running off the right edge, where it splits into two lanes. The phase outputs are [N]:

  | Phase | Output in this layer |
  |---|---|
  | Diagnose | How the market repeats you today: the narrative readout. |
  | Architect | Positioning and the message matrix, decided with your leadership. |
  | Install | Site, deck, sequences and talk tracks moved onto the system. |
  | Handover | Narrative OS and Channel Playbooks, in your stack, in your language. |
  | Calibrate | Message versions retuned each quarter on what buyers repeat back. |

- **The two lanes** [N] (FC scope):
  - *Your operator* — edits the Narrative OS as the market argues back; writes new segments and launches inside the system.
  - *With us on retainer* — we write and ship the next version, and keep the objection answers current.
  - Under both: "Who owns it · You, in both lanes."
- **Link:** "The method, on one page → /#methodology".
- **Presentation:** typographic, with no bars, so it reads differently from the homepage gantt.

**4 · Door (G, ruled) · D1**
- Label "■ Starts with the audit".
- Line [N] (FC deliverable): "The audit's narrative readout shows how your market repeats you today, and where the story comes apart."
- Object: a mini readout sheet → /reports.
- Doors: red · quiet.
- Sibling strip with glyphs [R from today's wires]:
  - "Carried by · GTM Infrastructure →"
  - "Measured by · GTM Intelligence →"

### 4.2 `/capabilities/gtm-infrastructure` · "The machine that carries it to buyers"
- **Job:** show a RevOps-minded buyer what gets built in their stack — owned, documented, and clearly not an outbound shop.
- **Visitor's question:** "What would you build in our CRM, data and routing? Will it be ours, or another agency running our outbound?"
- **Story:** a tangle of tools becomes one documented route. Here is what's built, the rules it runs on as your operator would hold them, and who keeps it running.
- **Metadata description [R]:** "Data pipelines, routing and CRM architecture built as one documented machine in your stack — the infrastructure that carries your story to the right buyer." ("Outbound engines" is gone.)

**0 · Header (G)**
- **Header copy**
  - Label "■ GTM Infrastructure" · "Capabilities / 02".
  - H1 [R, the approved nav and homepage job] "The machine that / *carries it to buyers.*"
  - Lede [R, from the homepage "What it is"]: "Data pipelines, routing and CRM architecture, built as one documented machine in your stack — so the right account hears the story at the right moment, and the record stays true."
  - Facts: Engagement · Scoped at the readout · Output · ICP & Signal Map and Orchestration Rules — yours · Starts with · The System Audit ↗.
- **Band: TRACE, the "untangle" variant**
  - A knot of disconnected tool nodes untangles into one orthogonal route (same vertex count, ≤6 nodes): Signal → Data pipeline → CRM → Routing rule → Channel → **The buyer**.
  - Flags: 02.1 Deliverability engineering (at Channel) · 02.2 Data pipeline & signal map (at Data) · 02.3 Omnichannel orchestration (at Routing) · 02.4 CRM & data hygiene automation (at CRM).
  - Dimension "One documented route".
  - **Red:** the buyer node, which latches when one packet completes a single traversal. There is no loop.
  - It differs from homepage slab 02 (an iso inscription) and hero take 02: this is a plan view with the untangle morph.
  - Phone: the route runs vertically.

**1 · What we build (G, ruled) · ledger that opens in place, 02.1 resting open**
- **Head:** label "■ What we build"; statement [N] "Built in your stack. / *Documented in your language.*"
- **Rows** [R lines; N "Replaces"]:

  | Row | Line | Replaces | Ships → asset | Reading |
  |---|---|---|---|---|
  | 02.1 Deliverability engineering | Domain architecture, authentication and placement monitoring, so what the machine sends arrives. | Sending from the main domain and hoping. | Deliverability runbook → Orchestration Rules | "1 in 6 · legitimate marketing emails that never reach the inbox (global) · Validity, 2025 ↗" · "Field note · Deliverability is infrastructure →" |
  | 02.2 Data pipeline & signal map (FS) | Who to reach and the live signals that say when, sourced, verified and kept fresh as a system. | A list bought once and worked top to bottom. | ICP & Signal Map | — |
  | 02.3 Omnichannel orchestration | Email, LinkedIn, phone, content and events, routed by signal instead of calendar. | Sequences on a timer. | Orchestration Rules | — |
  | 02.4 CRM & data hygiene automation | Objects, stages, dedupe and decay handled by the system, so the record stays true without manual policing. | A CRM nobody trusts. | CRM blueprint (the record under both assets) | "28% · of a seller's week spent actually selling (7,775 sellers surveyed) · Salesforce, State of Sales, 2022 ↗" |

- **Cut:**
  - "Outbound engine build", inbox rotation, throttling, "volume that scales without burning domains", list-sourcing language, warmup as a volume tactic and "capacity scaled ahead of demand";
  - Litmus $36:$1, both Pitchbox figures and Gartner $12.9M;
  - "six disconnected tools" and the aphorisms.

**2 · A page from the Orchestration Rules (P) · figure + rule table, the signature artifact**
- **Head**
  - Label "■ A page from the Orchestration Rules".
  - `h3` [N] "The rules, as your operator holds them."
  - Lede [R, handover asset 04]: "The logic that routes every next-best touch, written as rules your team can read, edit and hire against."
- **Left (cols 1–5):**
  - a "Before any rule fires" `.ac-spec` [R from the deliverability note]: Sending domains separated and aged · SPF, DKIM and DMARC aligned · Suppression honoured · Records verified before send;
  - beneath it, a small ink TRACE.
- **Right (cols 6–12): the rule table** [N]:

  | # | When | Then | Channel | Owner |
  |---|---|---|---|---|
  | 1 | An account in the ICP opens a sales-leadership or RevOps role | It moves to this quarter's priority list, and the account owner gets a brief | Email, then LinkedIn | Account owner |
  | 2 | A second person from a priority account replies or books | The champion gets the committee one-pager from the Narrative OS | Email | Account owner |
  | 3 | A deal sits in security review for ten working days | The risk-review pack goes to the champion, and a technical call is offered | Email | AE + SE |
  | 4 | A reply names a competitor | The objection is logged and answered from the Narrative OS | CRM task | Account owner |
  | 5 | A sending domain's complaint rate rises | Sending pauses on that domain, and the operator is alerted | — | Operator |

  Rules 1, 2 and 4 visibly cite other assets, which shows the three layers wired together.
- **The one red:** rule 2's index square (it is lit at rest).
- **Interaction:** each rule row is a real button (`aria-pressed`). Focusing or choosing one plots its route on the small TRACE. The rule text is always visible, and the drawing is decorative.
- **SpecimenTag:** "Specimen · illustrative rules. Every install writes its own from the ICP & Signal Map."

**3 · How it runs (G) · runbook (vertical, numbered, with a sticky label column)**
- **Head:** label "■ How it runs"; `h3` [N] "Built once. Kept running."
- **Phases** [N]:

  | Phase | Output in this layer |
  |---|---|
  | Diagnose | Where the machine leaks today: the channel orchestration map. |
  | Architect | The route, the data model and the CRM blueprint, decided with your RevOps lead. |
  | Install | Built in your stack and run at low volume with your team before it scales. |
  | Handover | ICP & Signal Map, Orchestration Rules and the runbook; your operators trained. |
  | Calibrate | Placement, data decay and routing tuned as signals shift. |

- **Run-sheet, two columns** [R from today's Phase II] (FC scope):
  - *Each month* — Inbox placement and domain reputation watched; incidents handled · The data pipeline refreshed, decayed records cleared.
  - *Each quarter* — Routing rules retuned as signal patterns shift · Capacity planned ahead of demand.
- **Foot** [N]: "Your operator runs these from the runbook, or we do on retainer. Either way, the machine stays in your stack." → /#methodology.

**4 · Door (G, ruled) · D1**
- Line [N] (FC deliverable): "The audit's channel orchestration map shows how demand moves across your channels today, and where it leaks."
- Object: a mini map sheet.
- Doors: red · quiet.
- Siblings:
  - "Carries · Narrative Systems →"
  - "Read by · GTM Intelligence →"

### 4.3 `/capabilities/gtm-intelligence` · "The loop that learns"
- **Job:** show what gets watched, who reads it and what changes each quarter, and make clear this isn't a dashboard project.
- **Visitor's question:** "How would you make our GTM learn — what's measured, who looks at it, what changes each quarter, and who runs it after?"
- **Story:** four questions the system answers every quarter. Here is the cadence, a quarter's plan being re-scored, and the meeting that does it.
- **Metadata description [R]:** "Signal taxonomy, win/loss, resonance and a quarterly calibration — the loop that feeds what works back into narrative and infrastructure."

**0 · Header (G)**
- **Header copy**
  - Label "■ GTM Intelligence" · "Capabilities / 03".
  - H1 [K homepage job] "The loop / *that learns.*" This retires the old H1 "What gets measured compounds." and its duplicate H2.
  - Lede [K homepage "What it is" + "In practice"]: "The observation layer that feeds what works back into narrative and infrastructure. We instrument every touch, then sit with you each quarter and retune the system against what the signal says."
  - Facts: Engagement · Scoped at the readout · Output · Signal Dashboard and Rebuild Sequence — yours · Starts with · The System Audit ↗.
- **Band: ORBIT, the "stations" variant**
  - One open ring in plan view with four stations: 03.1 Signal taxonomy (what's watched) · 03.2 Win/loss (why deals move) · 03.3 Resonance (what lands) · 03.4 Quarterly calibration.
  - A node rides the ring once, and when it reaches 03.4 the gap closes.
  - **Red:** the closing arc.
  - It differs from homepage slab 03 (an iso inscription) through flat stations and callouts. It is deliberately not the accretion rings you rejected in round 3.

**1 · Four questions (G, ruled) · question → instrument table**
- **Head:** label "■ What we install"; statement [N] "Four questions, / *answered every quarter.*"
- **Table** [R from today's services; nav names K]:

  | The question | Service | Ships | Feeds |
  |---|---|---|---|
  | "Which signals actually come before revenue?" | 03.1 Signal taxonomy & intent monitoring | Signal taxonomy (account priorities fold in here) | Signal Dashboard |
  | "Why do we really win and lose?" | 03.2 Win/loss & objection intelligence | Win/loss interviews, in the buyer's words | Signal Dashboard; the objection answers in the Narrative OS |
  | "Which message version is landing?" | 03.3 Narrative resonance telemetry | Resonance report: reply quality and meetings, not opens | The next narrative version |
  | "What changes next quarter?" | 03.4 Quarterly calibration program | Calibration readout | Rebuild Sequence |

- **Quiet line** [N]: "The instruments that will automate parts of this are being built at The Lab, and are in development →" (/the-lab).
- **Removed:** the "Entropy index" as a sold deliverable.

**2 · The quarter (G) · calendar ruler (13 weeks)**
- **Head:** label "■ How it runs"; `h3` [N, echoes approved FAQ Q3] "Calibrate is a standing cadence."
- **The ruler:**
  - a tick for the weekly signal review;
  - dashed win/loss marks as deals close or die;
  - week 13 marked "Calibration readout".
  - **Red:** the week-13 tick.
- **Right column, the quarterly review** (a numbered standing agenda) [R] (FC scope):
  1. What the signal says — monitoring and priorities refreshed.
  2. Why deals moved — new win/loss interviews.
  3. What held, what to stop — message versions and plays compared.
  4. What ships next quarter — the Rebuild Sequence re-scored.
- **Foot** [N]: "In the room: your operator and your leadership. On retainer, we run it. Before the first quarter, the install builds the signal taxonomy from your closed-won history, stands up the win/loss interviews and puts the dashboard in your stack."

**3 · A page from the Rebuild Sequence (P) · slope chart, the signature artifact**
- **Head:** label "■ A page from the Rebuild Sequence"; `h3` [N] "One quarter, re-scored."
- **The chart:** two columns, *Last quarter* | *This quarter*, with ink lines joining each item's rank. States are words, not colours [N]:

  | Item | Last | This | State |
  |---|---|---|---|
  | Committee one-pager for security buyers | 4 | 1 | Up — note: "win/loss named security review as the stall" (**the one red line**) |
  | Win/loss interviews on lost deals | 2 | 2 | Kept |
  | Route hiring-signal accounts to AEs | 3 | 3 | Kept |
  | Retire the "platform" message | 1 | — | Shipped |
  | Second-segment narrative | — | 4 | New |
  | Weekly list refresh | 5 | — | Cut — note: "no lift in the signal" |

- **Below** [K handover asset 05]: "**Signal Dashboard** — the readouts your GTM decisions run on."
- **Margin:**
  - "45% · of sales leaders highly confident in their forecast accuracy · Gartner, 2020 ↗" (the unverified 47% sub-claim is dropped);
  - "Field note · Revenue entropy →".
- **SpecimenTag:** "Specimen · an illustrative quarter. No client data, and no figures that read as results."

**4 · Door (G, ruled) · D1**
- Line [N] (FC deliverable): "The audit's intelligence gap report shows what your GTM decisions rest on today, and what nobody is measuring."
- Doors: red · quiet.
- Siblings:
  - "Feeds · Narrative Systems →"
  - "Reads · GTM Infrastructure →"

### 4.4 `/audit` · "The real constraint, named in writing"
- **Job:** turn high intent into a booked call without selling, in forward order.
- **Visitor's question:** "What exactly do I get in ten days, what does it ask of me, am I a fit, and how do I book?"
- **Story:** the ten days, drawn → what you keep → straight answers → three questions → a call. **The page ends on the gate,** so the FAQ's red now moves *forward* to it, where today it sends you back up.
- **Metadata:** title "The System Audit — Kelwin" [K]. Description [R]: "A fixed-scope diagnostic of the narrative, channel and intelligence layers under your revenue. Ten working days, a written readout you keep — whether or not we go further." ("Outbound" becomes "channel", as in the approved hero.)
- **Nav:** no item lights. The outlined "Audit request ↗" takes `aria-current` and jumps to `#qualify`, so a high-intent visitor is one tap from the gate.

**0 · Header (G)**
- **Header copy**
  - Label "■ The System Audit" · "Phase 01 / 04 · Diagnose" [K, homepage CTA].
  - H1 [N, picks up the method's Diagnose output] "The real constraint, / *named in writing.*"
  - Lede [R]: "Ten working days, fixed scope. We read your narrative, channels and data, and you get a written readout naming the constraint and the order to fix it in — yours whether or not we go further."
  - Facts:
    - You provide · Two 90-minute sessions and read-only access to your CRM and channel stack [K, D8];
    - You receive · A written readout and a sequenced rebuild plan [K AuditSpec 03] (FC);
    - Starts with · **Three questions ↓** → #qualify [N].
- **Band: the ten days, to scale (MEASURE)**
  - The homepage CTA's ten-tick ruler, drawn large and annotated: Day 01 "Kickoff", Day 10 "Readout" [K].
  - A "Read-only access" bar runs the length of the window.
  - A bracket over days 02–09: "Two 90-minute working sessions, scheduled with you" [R]. No specific days are drawn, because none are confirmed.
  - A dotted continuation past day 10: "After the readout · If installation makes sense, we scope it there. If not, the plan is still yours." [K]
  - **Red:** the Day 10 tick.
  - Motion: the ruler calibrates, then fills.
  - Phone: stays horizontal (ten ticks fit at 390); callouts stack below.

**1 · What you keep (P) · four sheets**
- **Head:** label "■ What you keep"; `h3` [N] "One readout, four parts."
- **Four FOLIO sheets deal from a stack,** each with what the audit reads [K AuditSpec 01, split per layer] and what it returns [K AuditSpec 03] (FC):
  - 01 **Narrative readout** — how your market repeats your story → Narrative Systems
  - 02 **Channel orchestration map** — how demand actually moves across your channels → GTM Infrastructure
  - 03 **Intelligence gap report** — what your GTM decisions are based on → GTM Intelligence
  - 04 **Sequenced rebuild plan** — the order to fix things in. Yours either way.
- **Below the sheets**
  - Line [N]: "The readout names your weakest layer first."
  - Link [N]: "See the shape of a full readout, as a specimen → /reports".
  - "A 60-minute readout call" appears only if you confirm it (FC).
- SpecimenTag on the sheets: "Specimen · structure only."

**2 · Straight answers (G) · the approved FAQ, verbatim [K]**
- Ledger behaviour [K]: one row open at a time; 01 rests open; the orchestrated open at 1.6s is cancelled by the first click; closed answers are inert.
- Its red "Request a System Audit" → `/audit#qualify` now moves forward.
- Its quiet "Something we didn't cover? Ask the founding team →" [K].

**3 · Three questions (G, ruled) · the gate, `#qualify`, the page's conversion moment**
- **Head**
  - Label "■ Three questions"; `h3` [R, from the homepage CTA path] "Three questions, then a call."
  - Lede [R]: "One tap each. Your answers travel with the request, and the gate works in both directions."
- **The flow**
  - Q01–Q03 copy and the decline logic are kept [K]: pre-revenue and pure self-serve/PLG decline; Q03 is diagnostic only.
  - One question per screen.
  - Progress: "Question 1 of 3" as text plus a three-tick mini ruler.
  - Answer rows: label plus detail at ≥13.5px, with a drawn arrow on hover.
- **Q03 adds "Where the audit looks first"** [N]. It is a starting point, and the audit still reads all three layers:
  - Not enough pipeline → GTM Infrastructure;
  - Pipeline dies mid-funnel → Narrative Systems;
  - The message isn't landing → Narrative Systems;
  - Honestly unsure → "All three. That's what the audit is for."
- **Declined state**
  - `h3` [R] "Not a fit yet."
  - The option's own reason [K].
  - [R] "Saying so now costs you nothing. When it changes, the audit will be here."
  - Exits: "Read the field notes meanwhile →" · "Talk to the team anyway →" [K].
  - Controls: "← Change last answer" · "Restart" [K].
- **Qualified state**
  - `h3` [R] "Qualified. Let's find a time." (there is no calendar).
  - The three-line summary [K], plus the layer line.
  - The owner line [N]: "On the call we'll ask one more thing: who inside will own the system." This pays off F-02 without breaking the three-question promise.
  - **Red "Book the strategic call"** [K]. The mailto subject and body format are unchanged.
  - Note [R], in body type rather than mono: "This opens your own mail app with your answers filled in, addressed to audit@kelwin.co. We reply with times within one working day (FC). Thirty minutes, no SDR handoff."
  - After the click [N]: "Your mail app should have opened with the request ready. Nothing is sent until you press send. If it didn't open, copy the address: audit@kelwin.co" [Copy].
- **Under the gate** [R]: "Not ready for any of this? Talk to the team — no qualification needed."
- **Accessibility**
  - Focus moves to each new question's heading.
  - An `aria-live="polite"` region announces the step and the result.
  - Answers persist in the URL hash, so refresh and Back keep progress.

**Cut from today's /audit**
- The photo header.
- "One way in. / Three questions wide." and "Every red button on this site lands here." (false).
- "No form, no email", "forty seconds" and "QUALIFY IN 40 SECONDS".
- AuditSpec, whose rows are redistributed into the lede, facts, band, sheets and gate:
  - its "not predictable" Fit row, which contradicted the gate;
  - "Audit/Spec v1.0";
  - the italic `<em>`.
- The diamond rail, the red decorative chip and "GATE ACTIVE".
- The legacy `#audit` anchor.

### 4.5 `/contact` · "Write to us. A person answers."
- **Job:** the low-intent general channel. It should feel first-class and human, and route specific requests.
- **Visitor's question:** "Who reads this, how fast, and will I end up in a sequence? Can I ask for X?"
- **Story:** the letter said a person answers. Here is where your message goes and what happens to it, and the other door, said once and quietly.
- **Metadata:** title [R] "Talk to the team — Kelwin" (CLAUDE.md retires "Get in touch"). Description [K].

**0 · Header (G) · text sheet, no band (the form is this page's object)**
- Label "■ Talk to the team" · "Contact".
- H1 [N, from the letter's approved line] "Write to us. / *A person answers.*"
- Lede [N]: "Questions, a document, press, the Lab — or you're not sure yet what you need. This is the channel. It goes to one inbox, a person reads it, and nothing you send enters a CRM or a sequence."
- Facts:
  - Read by · The founder (FC, §7 Q1);
  - Reply · Within two working days [K] (FC, §7 Q3);
  - Ready to diagnose? · The System Audit ↗ [N].
- The second door is said once, quietly. The D·01/D·02 cards and the triple "two doors" statement are cut.

**1 · The memo (P) · form as a document, `#write`**
- **Fields**
  - The fields are laid out as memo header lines. Each keeps a real visible `<label>`:
    - To · Kelwin, audit@kelwin.co (static);
    - From · Your name;
    - Company;
    - Reply to · Company email, with its hint [K];
    - About · Topic;
    - Regarding · the ref chip [K];
    - then the message, whose label, placeholder and required state change by topic [K].
  - Required markers are text ("required"), never colour alone.
- **Topics, grouped** with `<optgroup>` [R]:

  | Group | Topics |
  |---|---|
  | Working with Kelwin | Understanding what Kelwin does (the default) · Exploring a future engagement |
  | Documents & notes | Requesting a research document · Requesting a readout (was "case dossier") · Field notes & publications |
  | The Lab | Early access application |
  | Everything else | Partnerships · Press & speaking · Careers & the bench list · Something else |

- **Deep links**
  - The `?topic=` / `?ref=` contract is kept. **`notes` is added** → Field notes & publications.
  - `dossier` now maps to "Requesting a readout".
  - Unknown topics fall back; the visitor's own choice wins.
- **Honest hints** [R]. They replace "Cleared documents ship… within two working days":
  - research: "Research documents go out the day they're released. Our reply will tell you where yours stands."
  - readout: "Client readouts publish only with the client's consent, and none has cleared yet. Tell us what you'd want to see, and we'll send the readout specimen."
  - Lab: "Applications are read by the people building it. We reply either way."
- **Submit**
  - Outlined `.ac-btn-o`. Labels by topic: "Send the message" [K] · "Ask for the document" [R] · "Submit the application" [K].
  - Note [R]: "This opens your own mail app with the message filled in. Nothing leaves your device until you press send. How we handle what you send: Privacy →."
  - After submit [N]: a confirmation state with a copy-address fallback.
- **Behaviour:** the deep-link scroll and Regarding highlight are kept; the highlight is static under reduced motion.

**2 · Coda (G)**
- [R] "Prefer plain email? audit@kelwin.co" [Copy].
- A quiet line [N]: "Already suspect something structural? The audit is the faster door: three questions, then a 30-minute call →" (/audit).
- **No red on this page.** Its conversion is the message.

### 4.6 `/who-we-work-with` · "Three situations, told from inside"
- **Job:** let a buyer find himself, or his decline, quickly and kindly.
- **Visitor's question:** "Is a company like mine what Kelwin is for, or will they turn me away?"
- **Story:** the promise first (three situations and where each breaks), then the markets where they're sharpest, then who's sent away, then how the audit checks it.
- **Metadata description [N]:** "The three situations Kelwin is built for, told from inside; where each one breaks; the markets where they're sharpest; and who we send away."

**0 · Header (G)**
- **Header copy**
  - Label "■ Who we work with" · "The Firm / 02".
  - H1 [K, the homepage link's own words] "Three situations, / *told from inside.*"
  - Lede [R]: "A revenue system only pays off inside a company that can carry it. These are the three situations it's built for, told the way they feel from inside, followed by who we send away." ("…we keep being hired into" is cut.)
  - Facts:
    - Built for · Real revenue, felt ceiling · Committee-decided sales [K F titles];
    - The real gate · Someone inside will own it [R F-02];
    - Not sure? · Talk to the team ↗.
- **Band: the break chart**
  - Three flat elevations, one per situation. Each has three bands named by layer glyph: Narrative Systems / GTM Infrastructure / GTM Intelligence.
  - A 1px fracture opens in the band that breaks first; a dashed fracture marks where it spreads.
  - Callouts:
    - 01 The founder-seller — breaks first: Narrative Systems, spreads to Infrastructure;
    - 02 The plateaued motion — breaks first: GTM Intelligence, spreads to Infrastructure;
    - 03 The misheard category — breaks first: Narrative Systems.
  - **Red:** one fracture at a time. At rest it's 01's. Focusing or hovering a situation row below moves it.
  - Motion: elevations draw, then the fractures open in sequence, once. Nothing cycles.
  - Phone: three narrow elevations still fit at 390, with labels below.
- **Clarity check:** you rejected an unexplained animated line in round 3, so every band is labelled in words. The chart must read as "where it breaks" without the animation.

**1 · The three situations (G, ruled) · case-file rows**
- **Anchors:** `#founder-seller` · `#plateaued-motion` · `#misheard-category`.
- **Content**
  - Vignettes 01 and 03 [K]: tag, H3, body and "What changes".
  - Vignette 02: H3 and body [K], except the first sentence [R]: "The team is hired, the tools are paid for, and the pipeline chart has been flat for four quarters." (The old line repeated the letter's margin word for word.)
  - **"First install" → "Breaks first"** [R]. Each names its layers and links to their pages; all three layers now appear.
  - Section foot, once [N]: "The audit decides which layer comes first, before anything is built." This resolves the tension with doctrine B·01.
  - The three per-row audit cues ("Sounds like your Tuesday?" and so on) are cut.
- **Presentation:** wide three-zone rows:
  - cols 1–3: index, name and a 48px mini elevation;
  - cols 4–9: the story;
  - cols 10–12: What changes, then Breaks first.

**2 · Where it breaks, by market (P) · ledger that opens in place**
- **Head**
  - Label "■ Where it breaks"; `h3` [N] "The same three situations, in six markets."
  - Lede [N]: "Committee-decided deals make all three sharper. These are the markets where they show up most."
- **Rows:** six sectors with their two chips [K]; each opens to its "where it breaks" line [K]. Two changes:
  - I·01 [R]: "The story that wins the champion dies in the committee, where every stakeholder carries a different version of what you do." ("Seven stakeholders" was an unsourced count.)
  - I·04 adds [N]: "Product-led with a sales-carried expansion is in scope. Card-at-checkout with no sales conversation is not." This resolves the hybrid/pure-PLG contradiction.
- **Cut:** photos, the pending AI image, the network graphs (the noise-cut-by-one-line idea belongs to the homepage principle) and "Specialist, not generalist".

**3 · Close (G, ruled) · D3 gate close**
- **Left (cols 1–6): label "■ Who we send away"**, every reason visible:

  | Code | Title · body | Instead [N] |
  |---|---|---|
  | D-01 | Rent-it-forever · "We'll run it on retainer, but if nobody inside will own it, we decline." [K] | Find the owner first. Then the system has somewhere to live. |
  | D-02 | Lead-list shopping · "Renting activity is the cycle we exist to end. A list vendor is the better call." [K] | — |
  | D-03 | Pure self-serve / PLG · "The system assumes a sales-carried deal." [K] | Different machinery, built for checkout. |
  | D-04 | Pre-revenue · "There's no working motion to instrument yet. When the first revenue is real, come straight back." [R, from the gate] | Read the field notes meanwhile → |

- **Right (cols 8–12)**
  - "The audit is a gate, and it works in both directions." [K, homepage fit]
  - [R] "Its three questions check where revenue is today, how your deals close, and what it feels like from inside."
  - Red Request a System Audit.
  - Quiet "Not sure which side you're on? Talk to the team →" [R].
- **Onward:** "Who would you be working with? → About".

**Cut from today's page:** the photo header, the hatched "deployment zones" matrix, the "representative environments" ticker, the "fit.probe" terminal, the stale F-02 and D-01 wording, and the split-sentence ConvertPanel.

### 4.7 `/about` · "The firm behind the signature"
- **Job:** prove the person who signed the letter is real and senior, and show the rules he holds every engagement to, without inventing a team.
- **Visitor's question:** "Who is actually behind this, can I trust them with my revenue system, and how would they work with us?"
- **Story:** the letter was signed by a person. Here is the person, the five rules he runs the firm by, and the week an engagement runs on. Then the first step.
- **Metadata description [N]:** "Who founded Kelwin, the five rules every engagement is built on, and how the firm is built today."

**0 · Header (G)**
- **Header copy**
  - Label "■ About" · "The Firm / 01".
  - H1 [N] "The firm behind / *the signature.*"
  - Lede [N]: "Kelwin was founded in 2026 by Rameez. It designs, installs and runs revenue systems that its clients keep. It stays small, so the person who diagnoses your system is the person who answers your email."
  - Facts:
    - Founded · 2026 — deliberately late to the category [K, letter];
    - Led by · Rameez, Founder · Lead Narrative Architect [K] (FC);
    - Starts with · The System Audit ↗.
- **Band: "The five rules, where they bind" (LATTICE)**
  - Rows: the five rules (01–05, short titles).
  - Columns: Diagnose · Architect · Install · Handover · Calibrate [K phase names].
  - A filled 7px square seats where each rule binds:
    - 01 → Diagnose;
    - 02 → Handover and Calibrate;
    - 03 → Architect;
    - 04 → Calibrate;
    - 05 → Handover.
  - Dimension "Runs once" over Diagnose–Install.
  - **Red:** the 05 × Handover cell, the exit test, which ties back to the homepage handover.
  - Motion: the warped mesh resolves to a true grid (1.4s), cells seat row by row, and the red cell lands last.
  - Phone: five rule rows, each followed by its phase chips. There is no 5×5 grid at 390.

**1 · The founder (G, ruled) · signature sheet**
- **Left (cols 1–7)**
  - "Rameez" in display type (about 128px), then the role in the light accent, then a short dash echoing the letter's signature.
  - **No portrait** (rule 6; §7 Q1).
  - A background line appears **only if you supply it** (D11). No placeholder ever renders.
- **Right (cols 8–12): `.ac-spec`** [N] (FC each):

  | Key | Value |
  |---|---|
  | On an engagement | Runs the audit's working sessions, writes the readout, and leads the architecture and the install. |
  | The firm today | One architect. The next seat, a Systems Engineer, opens when the work needs it. → Careers |
  | Write to him | audit@kelwin.co |
  | Based | London |

- **Link:** "The letter that started it → /#s-letter". The memo is **not** reprinted; the homepage owns it.
- **Motion:** a still beat, reveal only.

**2 · What we believe (P) · tenet sheet (the legend of the header matrix)**
- **Head:** label "■ What we believe"; `h3` [N] "The rules every engagement is built on."
- **Five tenets,** all open, in a static two-column sheet. Each has a 32px title, its body, and a "Binds at · <phase>" chip aligned to the matrix above:

  | # | Title | Body | Binds at |
  |---|---|---|---|
  | 01 | Diagnosis before prescription [K] | "No engagement starts without the audit's readout — building before diagnosing sells the same fix to every different problem." [K] | Diagnose |
  | 02 | Assets first — then the retainer [K] | "Everything we install is documented in your language and lives in your stack. The operating retainer compounds a system you own — it never becomes the thing you rent." [K, the approved service model] | Handover, Calibrate |
  | 03 | Clarity is infrastructure [K] | "Most pipeline problems are narrative problems in disguise. We write the language down before we build anything that carries it." [R] | Architect |
  | 04 | Learning is the asset [R, was "Compounding beats resetting"] | "What an engagement learns is written into the system, so next quarter starts where this one ended." [R] | Calibrate |
  | 05 | The exit test [K] | "If it stops working the day we leave, we built it wrong. Every engagement is designed backwards from this sentence." [K] | Handover |

- **Presentation:** 05 is set largest. **Red:** the 05 index square.

**3 · The week (G) · calendar ruler, `#week`** (FC, §7 Q7. It ships only if this is how your engagements run; otherwise the page goes from the tenets to the Door.)
- **Head:** label "■ The week"; `h3` [N] "The week an engagement runs on."
- **Days:**

  | Day | Ritual | Line |
  |---|---|---|
  | Mon 09:00 | Signal review | "What the market did over the weekend. 25 minutes, no deck." [K] |
  | Tue 10:30 | Client working session | "Language decided live on the document — not presented after." [K] |
  | Wed | No-meeting day | "Systems get built. Notes get written. Calendars stay empty." [K] |
  | Thu 16:00 | Kill review | "What we stop doing this week. The hardest ritual to keep." [K] |
  | Fri 15:00 | The written note | "What moved this week, in writing." [R]. Drops "Every engagement, every week", which implied a client book. |

- **Note** [R]: "An engagement runs on this week. The Friday note is where you read what moved." This replaces the dead "Friday readout from the methodology" reference.
- **Presentation:** a five-day MEASURE ruler with hour ticks 08–18. Each ritual is a node at its hour; Wednesday is drawn empty. **Red:** Thursday's node. Nodes latch left to right once.
- **Phone:** a vertical list with times.

**4 · Door (G, ruled) · D2 statement close**
- Statement [N] "Start where / *every engagement starts.*"
- Lede [N]: "The System Audit: ten working days, fixed scope, and a written readout you keep."
- Doors: red · quiet.
- Foot row [N]: "The Lab · Kelwin's R&D, in development → What it's building".
- Onward: "How does Kelwin think? → Field notes".

**Cut from today's page:**
- the photo header and the origin "telemetry" loop (the homepage system owns it);
- the registry with its LIVE meters, "Senior pods of 2–3" and "Deployed on active node";
- the blurred portraits and memo K-000 reprinted;
- the OS rack and MOUNTED tags;
- the typed "KELWIN" node and "The advisory work funds The Lab" (§7 Q4);
- the ConvertPanel.

### 4.8 `/careers` · "No open seats today"
- **Job:** an honest empty state and a way onto the list. It is also a quiet seniority signal for buyers.
- **Visitor's question:** "Are they hiring, what is the work held to, and how do I get on their radar?"
- **Story:** no seats today. Here is how the firm will grow, what every seat is held to, and how to be read first.
- **Metadata description [N]:** "No open seats today. The seat that opens next, the standards every seat is held to, and how to join the bench list."

**0 · Header (G)**
- **Header copy**
  - Label "■ Careers" · "The Firm / 03".
  - H1 [N] "No open seats today. / *The bench list is open.*"
  - Lede [R]: "Kelwin adds a person only when the work needs a seat it can't fill, and only senior people: nobody learns on a client's budget. When a seat opens, the bench list is read first."
  - Facts:
    - Open seats · None right now [K];
    - Next seat · Systems Engineer (FC);
    - Bench list · Open, read first when a seat opens [K] → #bench.
- **Band: the seat plan (LATTICE floor, plan view)**
  - Seat 01 filled: "Founder · Lead Narrative Architect".
  - Seat 02 dashed: "Systems Engineer · opens next". **Red:** its outline.
  - A third, fainter seat only if you name it (FC).
  - Each seat has one straight line to an edge labelled "Your team", with nothing in between. Dimension "No layer between".
  - Motion: the grid resolves, Seat 01 latches, the lines draw.
  - Phone: rotated vertical.

**1 · What every seat is held to (G, ruled) · two-column spec**
- **Left:** H·01–H·04, titles and bodies [K], with "Enforced" cut. H·01 [R]: "Everyone is accountable to the thing the engagement leaves behind — not to hours logged against it." (was "Everyone on a pod").
- **Right, the deal** [K] (FC each):
  - Juniors · None — nobody learns on a client's budget;
  - Writing · The job. Documents before meetings;
  - Comp · Published with every role, no ranges withheld;
  - Shape · Remote-first, London-based [R].
- **Link:** "The week an engagement runs on → /about#week" (only if that section ships).

**2 · Join the bench list (P) · form as a document, `#bench`, the page's conversion moment**
- **Head**
  - Label "■ The bench list"; `h3` [N] "Be read first when a seat opens."
  - Lede [R]: "Skip the CV summary. Tell us who you are, where your work lives, and the part of a revenue system you'd take personal responsibility for."
- **Fields** [R], each with a real label and required:
  - Name;
  - Current role and company;
  - Something you've made — a link, or a few lines about it. This is a textarea, so a writing sample no longer fails `type=url`;
  - The part of a revenue system you'd own, and why that one.
- **Submit:** outlined `.ac-btn-o` "Join the bench list" [R]. **Not red.**
  - Mailto subject "Bench list — {name}" [R]; recipient (FC, §7 Q3).
  - Note [R]: "This opens your own mail app with your answers filled in. Nothing is sent from this page, and a person reads every one. How we handle it: Privacy →."
  - After submit [N]: "Your mail app should have opened. If it didn't, send it to <address>." [Copy].
- **Quiet close (QC)**
  - "Questions first? Talk to the team →" (/contact?topic=careers)
  - "Here to buy, not to join? Request a System Audit →" (quiet, by design: no red on a hiring page)
  - Onward: "Who's at Kelwin today? → About"

**Cut:** the CAREERS.INDEX console and the dot-matrix "0", the pod diagram and the radar (both described a team that doesn't exist, and both had render bugs), **TUESDAY.LOG with "+31%"** (fabricated proof), "the people who fit here love it", the pseudo-code field labels, and the red submit.

**Same-day sync:** Privacy L·02 "the bench clearance request" → "the bench list request".

### 4.9 `/the-lab` · "The instruments under the service"
The default positioning is set by §7 Q4.

- **Job:** answer "are they a software company, does it exist, and what happens to my data?" honestly, and route interest correctly.
- **Visitor's question:** "What is The Lab, does it exist yet, and does it matter to my engagement?"
- **Story:** the service is the product. The Lab builds the instruments the service runs on. Here is how far along each one is, what stays yours, and how a client can help shape it.
- **Metadata description [N]:** "Kelwin's R&D: the instruments being built for the systems it installs, each shown at its true stage, and what stays yours."

**0 · Header (G)**
- **Header copy**
  - Label "■ The Lab" · "R&D".
  - H1 [N] "The instruments / *under the service.*"
  - Lede [R]: "The Lab is Kelwin's R&D. It builds the tools our architects use to diagnose, install and calibrate revenue systems. Everything on this page is in development, and says how far along it is."
  - Facts:
    - Status · In development [K];
    - Access · By application, install clients first (FC);
    - Your data · Anonymised and aggregated only, under your engagement agreement ↗ (/privacy) [K Privacy L·07].
- **Band: the status board (MEASURE)**
  - Rows: Signal taxonomy · Account timelines · Routing queue · Narrative resonance scoring · Entropy index.
  - Ruler: Concept · Prototype · Used on engagements · Released.
  - Each bar ends at its **true** stage (FC).
  - **Red:** at most one, the furthest bar's end tick.
  - There are no captures, no blur and no version numbers (they contradicted each other).

**1 · Why build them (G, ruled) · short essay, three paragraphs [R from T·01, T·03, T·04]**
- "A CRM records what happened. It doesn't decide what happens next."
- "Data vendor, sequencer, enrichment, dialer, notes: five tools with no shared memory. Whatever a motion learns is scattered across them." (The count is fixed.)
- "A generic model writes the same sentences for you as for your competitors. The useful instrument is one trained on what an engagement teaches — anonymised and aggregated, as the engagement agreement spells out."
- Conclusion [R]: "So the Lab builds instruments for each layer we install, inside a system the client owns." This replaces the four-verb model that competed with the three layers.
- **Cut:** "the end of GTM software", "a filing cabinet wearing a dashboard", "mathematically dead" (T·02 re-argued the homepage evidence) and "or it's autocomplete".

**2 · The instruments (G, ruled) · ledger that opens in place (the board's legend)**
- Each row: what it reads [R] · its stage · used on engagements: yes / not yet (FC).
  - Signal taxonomy — which signals come before revenue;
  - Account timelines — the whole deal, in one view;
  - Routing queue — proposes the next touch for an operator to approve;
  - Narrative resonance scoring — which message versions buyers repeat;
  - Entropy index — how much a motion keeps from one quarter to the next.
- **Line** [N]: "Today the intelligence layer is delivered by the method and the people running it. These instruments are being built to make that work faster. → GTM Intelligence". This reconciles the Lab with the capability page.

**3 · Early access and the audit (P) · split close**
- **Left (cols 1–7): "Early access" as terms**
  - *Asks* [K, lightly edited]:
    - A sales-carried B2B motion with live pipeline to instrument;
    - Read access to the signals we measure — anonymised, exportable, yours;
    - One named operator in a working session, twice a month;
    - Tolerance for rough edges while it's being built [R].
  - *Returns* [R]: A first look at each instrument · A hand in what ships · A direct line to the people building it.
  - *Your data* [R, Privacy L·07]:
    - Stays yours: the system, the assets, your data, your documents;
    - The Lab keeps: anonymised, aggregated patterns, as your engagement agreement spells out.
  - Quiet `.ac-link` **"Apply for early access →"** → `/contact?topic=lab&ref=Early%20Access%20Protocol` [K, round-7 C5].
  - Note [R] (FC): "Audit and install clients are offered places first. If the fit isn't there yet, we say so."
- **Right (cols 9–12)**
  - [N] "The service comes first, and it starts with the audit."
  - Red Request a System Audit + quiet Talk to the team. This is the page's one red door, which the C5 working-tree comment intended.
  - Onward: "Where these instruments are used → GTM Intelligence".

**Held for §7 Q4:** P/04 "The console without the consulting", "Founding terms when the console stands alone", "partner requests outrank our roadmap", "cohort one capped small", "Build 0.5" and "The advisory work funds The Lab".

**Cut:**
- "CONTROLLED CIRCULATION", "SEALED", "IDENTITIES REDACTED", "PARTNER PREVIEW ONLY";
- the synthetic company names (still readable in the DOM) and the sealed JSON;
- **S·02 "LIVE CAPTURE … +31% reply quality"** and "Nothing here is a mockup";
- the seven numbering systems and the three infinite loops.

### 4.10 `/insights` · "Field notes, published"
- **Job:** show first-party thinking a buyer can read in minutes, honestly dated and sourced, one layer at a time.
- **Visitor's question:** "Does this firm think clearly about my problem, and is there something I can read before I talk to anyone?"
- **Story:** every note diagnoses a layer. Here is the register, the note to read first, and what's being written.
- **Metadata description [R]:** "Short field notes on how revenue systems break — each starting from a symptom you can check, each diagnosing one layer, with sources." ("From the install base" is cut.)

**0 · Header (G)**
- **Header copy**
  - Label "■ Insights" · "Resources / 01".
  - H1 [K, the letter's label] "Field notes, / *published.*"
  - Lede [N]: "Short notes on how revenue systems break. Each starts from a symptom you can check in your own company this week, and names its sources."
  - Facts:
    - Published · Three notes, May–June 2026 [K];
    - In the works · Three notes, three longer documents;
    - New notes · By email when they ship ↗ (/contact?topic=notes).
- **Band: the register**
  - Rows: the three published notes, each with a symptom line [N], its title as a real `h2` link, and date · read time [K] (§7 Q6).
  - Three columns headed by the layer glyphs (Narrative Systems · GTM Infrastructure · GTM Intelligence). A filled square marks the layer each note diagnoses:
    - FN·01 Revenue entropy — "We need more pipeline." — all three;
    - FN·02 The 17% window — "Buyers can't retell you." — Narrative Systems;
    - FN·03 Deliverability is infrastructure — "The dashboard says 'delivered'." — GTM Infrastructure.
  - **Red:** the "Read first" tag on FN·01.
  - The page shows honestly that Intelligence has only the diagnostic note so far.
  - Phone: list rows with layer chips.

**1 · Read first (P) · excerpt sheet**
- FN·01's standfirst and first paragraph [K], with a byline "Rameez · June 2026" (FC) and "Read the note →".
- Margin: "Diagnoses · all three layers" and a small split-line teaser of the note's figure.
- The band carries no deks, so nothing duplicates the standfirst.

**2 · In the works (G, ruled) · static status ledger**
- **Rows** [K titles, R statuses]:
  - FN·04 "Signal over sequence" · GTM Intelligence · Drafting
  - FN·05 "The language committees repeat" · Narrative Systems · Drafting
  - FN·06 "Q1 resets are a choice" · GTM Intelligence · Drafting
  - R·01 "The Revenue Entropy Index — 2026 benchmark" · status per §7 Q4 (no date until you confirm one)
  - R·02 "Signal-Based Selling — the field spec" · In production
  - R·03 "The Deliverability Spec Sheet" · Drafting
- **Each row:** "Send it to me when it's ready →" (`/contact?topic=notes` or `topic=research&ref=R·0n`).
- **Note** [N]: "No publication dates until they're written." "In calibration" and the "Systems" topic retire.

**3 · Door (G, ruled) · D2 statement close**
- Statement [N] "The notes name the layer. / *The audit finds yours.*"
- Lede [N]: "Ten working days on your own system, and a written readout you keep."
- Doors: red · quiet.
- Onward: "What does a readout look like? → Reports".

**Cut:** the photo, "from the install base", "Working notes from live systems — not thought leadership", the blinking Featured dot, "Reading is research. The audit is diagnosis." and the 1140px off-grid stage.

### 4.11 The three notes (template §3.2)
Slugs, titles, dates and metadata titles survive.

**`/insights/revenue-entropy`**
- **Head:** layer "Diagnosis · all three layers". H1 [K, split] "Revenue entropy: / *why pipeline problems rarely start in the pipeline.*"
- **Figure: "One symptom, three causes"** (under "Three failures, one symptom"):
  - one line, "We need more pipeline", splits into three branches:
    - Narrative failure → Narrative Systems;
    - Signal failure → GTM Infrastructure;
    - Memory failure → GTM Intelligence.
  - The note's three discriminating questions follow as a self-check [K questions], with Yes/No toggles. A "No" lights its layer's glyph. Nothing is stored.
  - The bullet list stays in the markup.
- **Define "revenue entropy" once, here,** as Kelwin's term. The Lab's instrument and R·01 link to this definition.
- **Edits**
  - The pull quote that repeats paragraph 2 is cut.
  - "Every founder we audit" and "In the audits we've run" are re-voiced per §7 Q2.
- **Close line** [N]: "The audit's first job is to say which of the three it is."

**`/insights/the-17-percent-window`**
- **Head:** layer Narrative Systems. H1 [K] "The 17% window." + accent [N] "*Where the deal is argued.*" The head grammar needs one accent; the title itself is unchanged.
- **Figure: "The retelling"** (after "What survives retelling"), set in type:
  - four hops: Demo → Champion → CFO → Committee;
  - two sentences taken from the note itself travel through them:
    - "They install X, which produces Y" survives every hop;
    - "They help us grow faster" loses words hop by hop until nothing is left.
  - It deliberately avoids CONTOUR and the homepage's 17/100 bar.
- **Fixes**
  - One framing throughout: 17% with all suppliers combined, about 5% for any one, and the deal argued in "the other 83%". The standfirst's "95%" goes (§7 Q6).
  - Link the Gartner source (the URL already exists in `capability-data.tsx`).
  - Metadata: "any supplier's" → "every vendor combined".
  - The "strongest single predictor of close… in deals we've instrumented" finding is re-voiced as a stated observation or cut (§7 Q2).
  - "Which pages the CFO's office reads" → "which other roles at the account start engaging".
- **Close line** [N] (FC): "The audit's narrative readout checks whether your champion can retell you."

**`/insights/deliverability-is-infrastructure`**
- **Head:** layer GTM Infrastructure (the "Outbound" chip is dropped). H1 [K, split] "Deliverability / *is infrastructure.*"
- **Figure: "Delivered isn't arrived"**
  - A dashboard tile reads "Delivered" across 100 sends. Beneath it, a MEASURE bar: 83.5 inbox · 6.7 spam · 9.8 missing (Validity, 2025, legitimate marketing email, global; linked).
  - **Red:** the missing segment.
- "The floor, specified" becomes an `.ac-spec` of four rows [K text], which is what the note says it is.
- **Fixes**
  - Add the Google and Yahoo 2024 sender-requirement sources, with the bulk-sender qualifier.
  - Add the caveat that open rates are unreliable since Apple Mail Privacy Protection.
  - Re-voice "domains we audit" and "the pattern we see most" (§7 Q2).
- **Close line** [N] (FC): "The audit reads your sending setup alongside the rest of your channel stack."

### 4.12 `/reports` · "What a readout looks like"
- **Job:** the honest proof surface. It turns "nothing cleared yet" into a demonstration of the deliverable.
- **Visitor's question:** "Show me proof. Who have you done this for, and can I see a real one?"
- **Story:** readouts belong to clients and publish only with their say-so, and none has cleared. Here is exactly what one looks like, and how to get your own.
- **One meaning of "readout" site-wide:** the audit's written diagnostic, the homepage's meaning. "Case dossiers" with outcome metrics retire.
- **Metadata description [N]:** "The format of a Kelwin readout, shown in full as a specimen. Client readouts are published only with the client's consent, and none has cleared yet."

**0 · Header (G)**
- **Header copy**
  - Label "■ Reports" · "Resources / 02".
  - H1 [N] "What a readout / *looks like.*"
  - Lede [N]: "Every audit ends in a written readout, and it belongs to the client. We publish one only when a client asks us to, and none has cleared yet. Until one does, this page shows the format in full, as a specimen."
  - Facts:
    - Cleared for publication · None yet;
    - This page shows · The format, as a specimen;
    - Your own · Starts with the System Audit ↗.
- **Band: the sheet deal (FOLIO)**
  - Six section sheets deal from a stack into a row: The constraint · Narrative readout · Channel orchestration map · Intelligence gap report · Rebuild sequence · Next step.
  - Each sheet has its own furniture.
  - **Red:** the tag on sheet 01.
  - It differs from the homepage handover: no datum, no dashed→solid.

**1 · The readout, annotated (P) · full document specimen, the signature artifact**
- **Layout:** one long sheet in cols 2–9, callouts in cols 10–12. Each section shows its format, plus one example marked "Example" (FC structure, §7 Q3):

  | # | Section | Format [N] | Example |
  |---|---|---|---|
  | 01 | The constraint, named | One sentence: the layer holding revenue back, and the evidence for it. | "The committee can't repeat what you do in one sentence, so deals stall at the second meeting." |
  | 02 | Narrative readout | How your market repeats you today, in buyers' words, across site, deck, sequences and calls. | Three one-line descriptions of the company (founder, seller, engineer) that don't match — the revenue-entropy self-check |
  | 03 | Channel orchestration map | Every channel you run, what triggers each touch, and where demand leaks. | A mini TRACE with two leaks marked |
  | 04 | Intelligence gap report | What your GTM decisions rest on today, and what nobody is measuring. | Three columns: Known · Not written down · Not measured |
  | 05 | Rebuild sequence | The order to fix things in, and what each step needs. Yours either way. | Four quarter columns |
  | 06 | Next step | — | "If installation makes sense, we scope it there. If not, the plan is still yours." [K] |

- **Callouts** [N]: One sentence, no hedging · In your buyers' words · Where it leaks · Ordered by what unblocks the rest.
- **SpecimenTag:** "Specimen · the format only. The examples are written to show the structure. No client data, no figures."

**2 · How publishing works (G) · spec list**
- Yours by default · Your readout is yours to keep [K sense]
- Published only with written consent [R]
- Names and figures removed on request [N] (FC)
- When one clears, it appears here first [N]

**3 · Door (G, ruled) · D1**
- Line [R]: "Your readout is yours to keep. Publishing it is always your call."
- Red Request a System Audit + quiet "Talk to the team first" [K].
- Link: "Field notes, and the research in progress → /insights".

**Cut:**
- CS·01 and CS·02 entirely: six invented metrics, real-looking client profiles and 2026 engagement windows;
- "Not testimonials — telemetry.", the "readouts.index" terminal and its cursor;
- "Request the full dossier" and "Cleared dossiers ship to your company inbox";
- "install base".

The research rows move to /insights.

### 4.13 `/privacy` and `/terms` (template §3.3)

| Clause | Treatment |
|---|---|
| Privacy L·01–L·08 | Verbatim [K]. L·02 sync: "the bench clearance request" → "the bench list request". |
| Terms L·01, L·02, L·04–L·07, L·09 | Verbatim [K]. L·02's "the audit" now links to /audit. |
| Terms L·03 | List sync [R]: "console readouts, case dossier figures, telemetry captures, representative deployment environments" → "the readout specimen, the message matrix, orchestration rules and Rebuild Sequence specimens, and any artifact marked Specimen". The rest of the clause stays [K]. After this redesign the clause is true. |
| Terms L·08 | `[JURISDICTION — EDIT ME]` is a **go-live blocker** (§7 Q8). Both pages show "Status · Draft, pending legal review" until counsel signs. |

### 4.14 404
Unchanged (approved C6).

---

## 5 · Layout-variety matrix

**Header band kinds** (one per page)

| Code | Band | Code | Band |
|---|---|---|---|
| CT | Contour | SE | Seat plan |
| TR | Trace, untangling | SB | Status board |
| OR | Orbit with stations | RG | Register |
| RU | Ten-day ruler | DL | Sheet deal |
| BC | Break chart | TX | Text sheet, no band |
| MX | Rule matrix | IX | Contents strip |

**Body archetypes**

| Code | Archetype | Code | Archetype |
|---|---|---|---|
| ST | Strips | GT | The gate |
| LG | Ledger that opens in place | FM | Form as a document |
| QA | Question → instrument table | CF | Case-file rows |
| DS | Document specimen | SG | Signature sheet |
| FG | Figure + rule table | TN | Tenet sheet |
| PT | Horizontal phase track | SP | Spec list |
| RB | Vertical runbook | ES | Short essay |
| CL | Calendar ruler | EX | Excerpt sheet |
| FS | Sheet set | RD | Reading spread |
| FQ | The approved FAQ | CO | Coda line |

**Closes:** D1 decision band · D2 statement · D3 gate close · SC split close · QC quiet close.

**Surfaces:** G graphite · P paper. `|` marks a ruled graphite→graphite seam.

| Page | Head | §1 | §2 | §3 | §4 | Signature device | Paper is |
|---|---|---|---|---|---|---|---|
| Narrative Systems | CT G | ST \|G | DS P | PT G | D1 \|G | Kelwin's own message matrix | the specimen |
| GTM Infrastructure | TR G | LG \|G | FG P | RB G | D1 \|G | The Orchestration Rules sheet | the specimen |
| GTM Intelligence | OR G | QA \|G | CL G | DS P | D1 \|G | A Rebuild Sequence, re-scored | the specimen |
| /audit | RU G | FS P | FQ G | GT \|G | — | The ten days to scale + the gate | what you keep |
| /contact | TX G | FM P | CO G | — | — | The memo | the form |
| /who-we-work-with | BC G | CF \|G | LG P | D3 \|G | — | The break chart | the markets |
| /about | MX G | SG \|G | TN P | CL G | D2 \|G | Where the five rules bind | the doctrine |
| /careers | SE G | SP \|G | FM P (+QC) | — | — | The seat plan | the bench form |
| /the-lab | SB G | ES \|G | LG \|G | SC P | — | The status board | the early-access terms |
| /insights | RG G | EX P | LG \|G | D2 \|G | — | The register | the excerpt |
| Article ×3 | TX G | RD + one figure P | SP G (sources) | D1 \|G (compact) | — | One figure per note | the body |
| /reports | DL G | DS P | SP G | D1 \|G | — | The annotated readout | the specimen |
| Legal ×2 | IX G | RD P | QC G | — | — | The contents strip | the text |
| 404 | approved | — | — | — | — | — | — |

**The checks**

- **No two adjacent sections share an archetype** on any page.
- **Headers.** The grammar is shared, as approved, but every page's band is a different kind. The two text-sheet pages (contact, articles) differ in what they carry: the contact form follows directly, the articles carry a reading spread.
- **The three capability pages** share their slots but differ at every position:

  | Slot | Narrative | Infrastructure | Intelligence |
  |---|---|---|---|
  | Services | Strips | Ledger | Question table |
  | Specimen | Matrix document | Rules figure | Slope chart |
  | How it runs | Horizontal track | Vertical runbook | Quarter calendar |
  | Paper position | 2 | 2 | 3 |
  | Ambient | Drift | One traversal | None |

- **Surfaces.** Every page has exactly one paper moment, always a document, form, doctrine, excerpt or text. No page runs more than three graphite sections in a row, and every graphite→graphite seam is ruled.
- **Statements.** Each page has at most two two-voice statements (the `h1` plus one). Pages with only one: /audit's gate head, /contact, /careers, /reports and the legal pages. The approved FAQ keeps its own.
- **Motion.** Each page has one header morph and at most two body play-once moments.
  - Still beats: /about's founder and tenets, /who-we-work-with's case files, /careers' spec, the Lab essay, the legal pages, and every document specimen after its typeset.
  - One ambient loop on the whole interior (Narrative's clean line). No pins.
- **Red.** One red ask per page, always "Request a System Audit", plus the band's single red element.
  - /contact and /careers carry no red ask.
  - On /audit the booking red appears only in the qualified state, below the FAQ's red, never in the same view.

**Phone lengths at 390px (targets)**

| Page | Today | Target |
|---|---|---|
| /about | 8,589 | ≈4,600 |
| /who-we-work-with | 9,703 | ≈5,200 |
| /careers | 6,616 | ≈3,400 |
| Capability pages | 7,100–7,300 | ≈4,800 each |
| /the-lab | ≈7,700 | ≈4,000 |
| /insights | — | ≈3,000 |
| Each article | — | ≈4,500 |
| /reports | 3,261 | ≈3,600 |
| /audit | — | ≈5,500 |
| /contact | — | ≈2,800 |

---

## 6 · Honesty ledger (never fabricate proof)

| Claim (where) | Decision | Why |
|---|---|---|
| "Founded 2026 — deliberately late to the category" (About) | **Keep** | Approved letter line |
| "Senior pods of 2–3", "Two or three seniors and the client", "Everyone on a pod" (About, Careers) | **Cut** | D11 reasoning. Replaced by "One architect today; the next seat opens when the work needs it" (FC) |
| "the people who fit here love it", "Enforced" (Careers) | **Cut** | Staff sentiment with no staff |
| TUESDAY.LOG "POD RUNTIME · UNEDITED", "+31%", quoted client captures (Careers) | **Cut** | Fabricated proof |
| Radar scores 0.95…0.00 (Careers) | **Cut** | False precision |
| LIVE pod-capacity meter, "Next install window: Open" (About) | **Cut** | Hard-coded, goes stale (D7 logic) |
| "Deployed on active node"; "FIRM REGISTRY · K-001" (About) | **Cut** | Implies clients; invented registry |
| Every PageCommand status ("Operational", "Gate open/active", "Publishing", "A human answers", "Publishes as cleared", "Build 0.5 · active") | **Cut** | Live claims with nothing live behind them |
| The week (Mon signal review … Fri note) (About) | **Keep only if confirmed** (§7 Q7) | A practice claim. The "every engagement, every week" wording is cut. |
| "The advisory work funds The Lab" | **Held** (§7 Q4) | Business-model claim |
| Fit ticker "representative environments", NODE 01–05, "$40K ACV" | **Cut** | Reads as a feed of live clients |
| "the three situations we keep being hired into" | **Re-voice** ("built for") | Implies a history |
| "Specialist, not generalist"; "seven stakeholders" | **Cut / soften** | Unsupported |
| Stale F-02 and "outsource-it-forever" wording | **Replace** with the approved P2 wording, verbatim | Contradicted the retainer |
| "First install" prescriptions | **Replace** with "Breaks first · the audit decides which comes first" | Diagnosis before prescription |
| 18 capability statistics | **Keep 5:** Narrative 6–10 and 81%→31%; Infrastructure 1 in 6 and 28%; Intelligence 45% (the 47% sub-claim dropped). **Cut 13:** 95:5 and 17% (the homepage owns them), Bain ~90%, 6sense ~70% and 84% (wording mismatch), Litmus $36:$1, Pitchbox 8.5% and +32.7% (SEO-outreach data, lead-gen register), Gartner $12.9M, HBR 2011 7×, Gartner 2014 "up to 50%", McKinsey 23× (self-reported), Forrester 60–73%. | Two per page at most, chosen for architecture. Re-verify every kept link before launch. |
| Glosses ("most of the game", "directionally decisive", "Hygiene isn't housekeeping…", "six disconnected tools") | **Cut** | Opinion dressed as data |
| "Weeks 1–6 / 1–8 · fixed scope"; "Fixed-scope install"; header X "6-week install, then retainer" | **Replace** with "Scoped at the readout" (FS) | Contradicts the approved FAQ Q3 |
| "Seven artifacts you own"; 21 page artifacts | **Replace** with the two homepage assets per layer (FS) | One taxonomy |
| Entropy index, resonance scoring, signal taxonomy sold as finished deliverables | **The Entropy index leaves the menu** for the Lab, with its stage. The other two stay as services delivered by the method. | Rule 7 |
| "The audit instruments your stack / placement" (capability closes) | **Cut**; the audit "reads" | Outside the documented read-only scope |
| "install base", "live systems", "real installs" (Insights, nav, metadata) | **Cut** | No cleared installs |
| "Every founder we audit", "In the audits we've run", "every win/loss interview we've run", "domains we audit", "the pattern we see most" (notes) | **Re-voice** as your first-person observation, with no implied count (§7 Q2) | Published writing; your call |
| The 17% note's "strongest single predictor of close" finding | **Cut**, or re-voice as a stated hypothesis (§7 Q2) | Reads as invented research |
| 95% vs 83%; "any supplier's" (17% note) | **Fix** (§7 Q6) | Internal contradiction |
| Read times 6/5/5 min (actually about 3/2/2) | **Your call** (§7 Q6) | Shown on the approved homepage letter and evidence door |
| Gartner 17%, Google/Yahoo 2024 rules (notes) | **Keep, add sources** | Accurate but unlinked |
| /reports CS·01 and CS·02 metrics, profiles and 2026 windows | **Cut**; replaced by a structure-only readout specimen with no figures | The site's biggest fabrication risk |
| "Not testimonials — telemetry"; "Case dossiers from the install base" | **Cut** | — |
| "Cleared dossiers/documents ship … within two working days"; "Queued notes ship to the request list first" | **Replace** with status-honest hints | Nothing exists to ship |
| R·01 "Revenue Entropy Index — 2026 benchmark · Q4 2026" | **Status per §7 Q4**; no date shown until confirmed | A benchmark needs a dataset, and the date is now |
| Lab "working build", "Nothing here is a mockup", "LIVE CAPTURE", "+31%", synthetic names, sealed JSON, version numbers, queue events | **Cut**; replaced by the true-stage status board (§7 Q4) | Breaches rule 7 and Terms L·03 today |
| Lab "Standalone console", "Founding terms", "partner requests outrank our roadmap", "cohort one capped small" | **Held** (§7 Q4) | Positioning and programme commitments |
| /audit "Every red button lands here", "No form, no email", "40 seconds" | **Cut** | False or unmeasured |
| Audit deliverables (four parts), "60-minute readout call", "No prep decks, no homework" | **Shown as drafted, flagged** (§7 Q3) | The rest of D8 |
| D8 facts: ten working days, two 90-minute sessions, read-only access, no fee | **Keep** | Confirmed. Never a fee line without your choice. |
| Reply times: one / two working days; "a founder, within a working day" | **Two deliberate numbers** — bookings one working day, general channel two; /about states none (§7 Q3) | Two doors, two speeds, each said once |
| "founding team" / "founders" | **Interior pages say "the founder" / "Rameez"**; approved homepage CTA and FAQ copy untouched pending §7 Q1 | D11 |
| "No CRM · no sequence"; mailto-only forms | **Keep**, said once per page | True today. Any booking tool, backend, analytics, CDN font, hosted video or storage rewrites Privacy L·01–L·03 the same day. |
| Terms L·03 "every illustrative artifact is labelled Specimen" | **Made true** | Every interior specimen carries the shared tag; list synced |
| Terms L·08 placeholder; legal pages shown as final | **Go-live blocker**; "Draft, pending legal review" shown | Rule 7 |
| Message matrix, rules sheet, Rebuild Sequence, readout specimen | **New, labelled Specimen** | The matrix uses Kelwin itself, so it holds no fiction |

---

## 7 · Questions only you can answer

1. **Who is Kelwin today? (D11)**
   - Is it you alone, or are there other senior people?
   - The interior says "Rameez" and "the founder", and /about says "One architect today". The approved homepage CTA and FAQ say "the founding team": keep that or change it?
   - One line of your background for /about, or none?
   - Confirm "Founder · Lead Narrative Architect" and "Based · London".
   - No portrait (rule 6) unless you grant one exception.
   - Is the next seat only a Systems Engineer?
2. **Track record.**
   - Have any audits or installs run yet, even unpublishable ones?
   - If not, your notes' "we audit / we've run / we see" lines become your own first-person observation, and the 17% note's "predictor of close" finding is cut (or kept as a stated hypothesis). Which?
3. **The rest of D8, and replies.**
   - Confirm the readout's four parts (narrative readout, channel orchestration map, intelligence gap report, sequenced rebuild plan) and whether there is a 60-minute readout call. /audit and the /reports specimen are built on them.
   - Reply times: one working day for audit bookings, two for everything else?
   - Bench-list mail: audit@ or a careers address?
4. **The Lab.**
   - Is it R&D that sharpens the installs (the default here), or a product heading to a standalone console?
   - Which instruments exist today, and at which stage (concept, prototype, used on engagements, released)?
   - Do install clients get access first?
   - Does the advisory work fund it?
   - Is the Entropy Index benchmark still on for Q4 2026?
   - Should The Lab stay top-level in the nav (default), or move under The Firm as the footer files it?
5. **Approved copy that would change (yes / no each).**
   - (a) Header X facts: "6-week install, then retainer" → "Scoped at the readout"; "Seven artifacts you own" → the layer's two assets.
   - (b) Nav 02.2 "Outbound engine build" → "Data pipeline & signal map".
   - (c) The Firm and Resources plate copy (§2.2; never reviewed, live today), including "Get in touch" → "Talk to the team".
   - (d) One quiet "Inside this layer →" link in each open System ledger row on the homepage. Today the homepage never reaches a capability page.
6. **Your published notes.**
   - Fix 95% → 83% in the 17% note?
   - The read times show 6/5/5 min but read in about 3/2/2. They appear on the homepage letter and evidence door too: correct them, or keep them?
   - Byline "Rameez, founder" on each note?
7. **How you work.**
   - Is the week on /about (Mon signal review … Thu kill review, Fri written note) how your engagements will run?
   - Careers policies: no juniors, pay published with every role, remote-first and London-based?
8. **Legal (go-live blocker).**
   - We need the governing-law jurisdiction for Terms L·08, and the legal entity name and address, from you or counsel.
   - Until then, both legal pages show "Draft, pending legal review". Agreed?

---

## 8 · Build notes

**Retire:** everything in §1.11, plus the photos in `/public` used only by these pages (confirm none is used by the homepage before deleting).

**New shared components**
- `InteriorHead` (Specimen sheet with a band slot and a facts ledger).
- `SectionHead` (label + `h3` + optional lede).
- `Door` (D1, D2, D3, SC, QC).
- `SiblingStrip`.
- `SpecimenTag`.
- `Readings`.
- `MailtoConfirm` (shared by /contact, /careers and the /audit booking).
- `MemoForm`.
- `ReadingSpread` (with margin notes).
- `StatusBoard`.
- `Register`.

**Data**
- `capability-data.tsx` shrinks to: 4 services, 2 assets, ≤2 readings, the phase outputs and the specimen content per layer.
- The nav plate reads its service rows from it, so the nav always quotes the pages.

**Contracts to keep**
- Every route.
- Anchors:
  - kept: `#qualify`, `#write`;
  - new: `#bench`, `#week`, `#founder-seller`, `#plateaued-motion`, `#misheard-category`;
  - used: `/#s-letter`, `/#s-system`, `/#methodology`.
- `?topic=` keys: `dossier`, `research`, `careers`, `engagement`, `lab`, plus the new `notes`. `?ref=` chips stay escaped, length-capped and removable. The `topic=lab` copy switch stays in sync with the Lab page.
- Mailto subject and body formats, and the gate's logic.
- `main#main` as the skip target.
- The reduced-motion final states.
- No Plurel, no Fig., no photos.

**Legal syncs, same day**
- Privacy L·02 "bench list request".
- Terms L·03's list.
- The legal pages link to each other.
- A Privacy link at every form's point of collection.

**Metadata.** Titles are kept, except /contact's ("Talk to the team — Kelwin"). Descriptions are rewritten on every page that named retired devices or claims.

**Mockup order for round 8** (most decisions first):
1. /about
2. /audit
3. Narrative Systems
4. /who-we-work-with
5. /reports
6. GTM Infrastructure
7. GTM Intelligence
8. /insights + one note
9. /careers
10. /the-lab
11. /contact
12. legal
