# Round 9 plan — fix the "AI-made" feel, add life, apply the answers

Sources: the founder's round-8 review and follow-ups (`ROUND8-NOTES.md`), the five-lens audit of the 16 interior
mockups (round-9 workspace `qa/r9-audit/`), the GoNimbly and Palantir recordings (`refs-r9/`), and the answers
Q1–Q8. Precedence stays: CLAUDE.md standing rules → round notes → this plan → STORY-INTERIOR.md.

## 1 · Why the interior reads AI-made (what the founder will be told)

The homepage was composed section by section over seven rounds. The interior was filled from one rulebook (kit
§12), so the rulebook's patterns repeat on all 16 pages and become the tell:

1. **Tiny grey code-font capitals carry words.** On the homepage, JetBrains Mono mostly carries numbers. On the
   interior it carries field names, column heads, status words and notes: up to 21 such labels on one Reports
   screen; Contact's field names are 12px mono capitals.
2. **Made-up reference codes** (FN·01, R·01–03, I·04, H·02, Q. 01–06, 01.1–03.4, "The Firm / 03"): the same device
   as the banned "Fig." numbering. Nobody uses them to find anything.
3. **One header recipe on every page**: label + numbered breadcrumb, h1, rule, lede, a three-row facts box, then a
   framed 1px drawing with corner marks, boxed codes and a "dimension" carrying a slogan ("ONE VOICE").
4. **Drawings illustrate ideas instead of showing things**: noise through a funnel, a knot untangling, a ring,
   grids with lightning bolts, progress bars that are all the same. All 1px, nothing solid, labels placed by
   arithmetic. The homepage draws real objects with one solid mass (slabs, bars, sheets).
5. **Documents look like app windows**: a title bar, a mono caption describing itself ("THREE LISTENERS · FOUR
   COLUMNS"), a footer chip. The readout is redrawn seven ways; grey placeholder lines stand in for text.
6. **Everything after the first screen is medium-sized**: 42px headings, even annotation, nothing dominant.
7. **The writing says things twice or three times** (h1 → lede → facts box), every section head uses the same
   clipped slogan rhythm, sibling pages share sentence templates, pages narrate themselves ("The board, row by
   row…"), honesty disclaimers repeat, and pages end in stacks of "question? → LINK" rows.
8. **No human texture**: no picture, no voice, on any interior first screen.

## 2 · Kit rules (the interior kit is rewritten; R/site/kit-ac.css §12 → "interior, round 9", §13 "motion & imagery")

**Type voices**
- JetBrains Mono only for numerals, dates, durations, counts, units and source lines. At most 5 mono runs per screen.
  Never words-as-labels, never prose, never emails.
- New `.ac-key` for every key, column head, node label and state word: Mona 14px, weight 500, sentence case,
  tracking 0, `--fg-2`, line-height 20px. `.ac-spec > dt` takes this style.
- Small caps voices collapse to two: the section label (`.ac-label`, unchanged, approved) and mono numerals
  (12px, .08em, tabular).
- `.ac-link` text is at most 4 words; longer destinations and every email address use `.ac-go` (sentence case).

**Numbering**: plain 01–0n only where order is the content (method phases, readout parts, legal clauses, steps,
audit days). No letter prefixes, no decimal service codes on pages (they live only in the nav's Capabilities
plate), no range captions, no label-row breadcrumbs.

**The interior head** (GoNimbly order): optional idea kicker (`.ac-label`, never the page name, never a number) →
h1 two-voice (96–112px, the page's one accent) → one lede of at most two lines → at most one quiet action → the
**plate** directly beneath. No facts box (opt-in only where facts are the content: Audit). No breadcrumb meta.
The plate is one of three typed kinds, chosen per page:
- **Film** (`.ac-plate--film`): frosted footage, the hero film's treatment, margin to margin, 480–560px tall.
  Until real footage exists it is a labelled stand-in ("Stand-in · footage to come").
- **Sheet** (`.ac-plate--sheet`): the page's real document, typeset as a page (see Documents).
- **Measure** (`.ac-plate--measure`): a drawing with a real unit (the Audit's ten days). Only where the thing is a
  measured span.

**Scale**: every body section has one dominant element: a 64–96px statement, a 120–200px number, or a plate at
least 480px tall. Everything else steps down at least two sizes. Body section heads are plain claims with a verb
(not slogans), set large; the light accent weight stays in the h1. At most one 42px `.ac-shead` per page.

**Drawings** (where a page keeps one): one object the reader recognises, drawn with weight: 1px for construction,
1px `--fg-2` for outlines, and one filled mass (a bar, plane or block of 6–12px or more, at least 8% of the
drawing) for the subject. At most 3 labels, in 15px Mona, anchored to the part they name. Dimension lines only
with a unit and a number ("10 working days", "13 weeks"). Registration marks only on a framed plate holding a
real document. Squares: the 8px label marker and 5px leader anchors only. The three layer glyphs appear only in
the nav plate and the hero chapter strip — no icon sets, no sibling strip.

**Documents** (`.ac-sheet`, replaces `.ac-doc`'s window chrome): a page (portrait 1:1.414, or a spread) on paper,
real margins (≥48px at 1440), a running head ("Kelwin, LLC · System Audit readout" left, "Specimen" right), a
folio, numbered sections (1, 2…), body as paragraphs at 15–17px, exhibits captioned "Exhibit 2 · …". No title bar,
no self-describing caption, no footer chip, no callouts restating column heads, no greyed placeholder lines at
card scale (greeking only at icon size ≤120px). "Specimen" is said once, in the running head or label row.

**Lists**: no chips on rows; a status is a plain word in the support line ("Drafting"). At most one ruled list per
page. `.ac-spec` only in article source notes and the Audit facts. A key that would repeat on every row becomes a
column head or folds into the sentence.

**Forms** (`.ac-field`, one component for Contact, Careers, the Reports request and the Lab):
label above the input, Mona 18px weight 500 `--fg`, one per field; input Mona 22px on a 64px row with a 1px
`--line-2` underline that turns 2px `--fg` on focus; an optional 15px `--fg-2` hint under the input; placeholders
only for format examples; one "All fields required" line above the form instead of a flag per field; the submit
is a 56px control, outlined (no red on Contact or Careers). No window chrome, no mono keys, no numbered prompts,
no ruled-paper textareas.

**Closes**: one close per page — the door line (from the page's own argument, ≤12 words, never "The audit's X
shows…"), the red System Audit button, and the quiet "Talk to the team". No mini readout box, no hairline, no
sibling strip, no "question? → LINK" rows. Where one onward link earns a place, it is a plain destination
("Read the field notes →").

**Copy**
- The lede may not reuse a noun phrase from the h1; a facts row (where kept) must add a new fact.
- No sentence whose subject is the page, sheet, board or drawing; no instructions ("Choose a rule…").
- Section heads are claims a buyer could disagree with. At most one comma-tag or clipped pair per page.
- No ", so …" tails; at most one list of three per section; at most one antithesis per page; no rhetorical
  question links; no invented quotes (quotes only where buyer language is the deliverable).
- One statement per status per page ("None yet" once).
- Word budgets: header ≤60 visible words; a body section ≤120 at rest.
- Details from the letter (11pm, flat for four quarters, deliberately late) belong to the letter only.

## 3 · Motion and imagery (§13; prototyped in `proto-r9/`)
- **The turn** (Palantir, founder's ask): on every page change and on entering the site, a graphite panel with a
  slanted leading edge sweeps across, the Kelwin mark flickers on piece by piece (K3, K2, K1), and the panel
  sweeps off into the next page. ≈1.2s click to page. The mark is chrome (a loader), not an illustration.
- **The write-in** (GoNimbly): the page head's h1 writes itself in, letter by letter, each letter arriving in
  hard-stepped fragments, left to right (≈21ms per letter), starting as the panel lifts.
- **The plate rise** (GoNimbly): the head plate rises as a narrower rectangle and widens to the full measure.
- Everything else stays the kit's restrained entrances; the round-8 "red lands last" formula is retired.
- Reduced motion: none of it.
- **Imagery** (a change to standing rule 6, proposed to the founder, not yet in CLAUDE.md): frosted or graded
  footage and stills in head plates, and real team photographs on About. Never stock people as the team, never
  AI-generated photographs. Stand-ins until real footage: the hero's frosted film stand-in (film-room) and, where
  they fit a page, today's own site stills — always labelled.
- Alternative kept for comparison: GoNimbly's sheet slide (the next page slides in over the last).

## 4 · Answers applied (Q1–Q8)
- **Q1** Kelwin today is the founder alone, hiring. No title, no location, no team size, no "one architect".
  About: "Rameez, founder" and one background line (sales and marketing; today growth and digital strategy lead
  at a global private-equity group — naming the employer waits for his yes). The site keeps "the founding team"
  where the approved homepage uses it. Next seats: Systems Engineer, Narrative Architect, Engagement Manager,
  Market Intelligence Analyst, Associate, Client Partner.
- **Q2** A couple of audits have run; none can be published. First-person observation in the notes stays.
- **Q3** The readout's four parts are confirmed. The engagement opens: three questions → a 30-minute first call →
  the ten-day audit → the 60-minute readout call → a proposal call (scope, pricing, contract). Replies: one working
  day for bookings, two for everything else. The bench list goes to the careers address (careers@kelwin.co
  proposed; the founder confirms the mailbox).
- **Q4** The Lab: R&D that sharpens the installs and a product heading to a standalone AI intelligence platform for
  GTM, revenue strategy and revenue architecture. No instruments named; "coming soon" as a tease. Access by
  invitation, install clients first, best fit only. Funded by the advisory work. The Revenue Entropy Index 2026
  benchmark: Q4 2026. The Lab sits under The Firm in the nav (built).
- **Q5** (a)–(d) yes (b–d built in the live site's code on the dev branch).
- **Q6** 83% throughout; read times 3 / 2 / 2 min; no byline.
- **Q7** Engagement lifecycle: proposals from the ideas workflow, recommended one drafted on About and Audit,
  marked for his confirmation. Careers: juniors can be hired; a rough pay range with every role; remote-first and
  global.
- **Q8** "Kelwin, LLC" in both legal documents; the governing law and address stay an honest plain status line
  ("To be confirmed") instead of an "EDIT ME" token.

## 5 · Page by page
| Page | Founder | Changes |
|---|---|---|
| Narrative Systems | Approve + AI audit | Film plate (take 01); services as plain named rows (no codes, no roll-up drawing); the message matrix as an open, full-width table at reading scale (listener names large, plain seller language, no quote marks, no callouts); "How it runs" as two large statements (Runs once / Keeps running); own door line; no sibling strip, no mini readout box. |
| GTM Infrastructure | Approve + AI audit (diagrams) | Film plate (take 02); services without codes or Replaces/Ships keys; the Orchestration Rules as a large "When … then …" sheet, rule text 24–28px, no route graph; the runbook as type; own door line. |
| GTM Intelligence | Change | Film plate (take 03); the four questions as large lines; the quarter as one big "13 weeks" with the readout week called out (no tick ruler); the Rebuild Sequence as a ranked table on a sheet (Rank · Item · Last quarter · Decision · Why); the Lab line per Q4. |
| Who We Work With | Approve + AI audit | Film/still plate instead of the break chart; vignettes kept; "Breaks first in …, then spreads to … →" as one line; no thumbnails; markets without codes or chips (traits as one sentence), heading "Where it breaks, by market"; plain close. |
| About | Change | The picture area (founder portrait + team slots, honest placeholders "Photographs to come") replaces the rules matrix; the founder per Q1; the five rules as type (no chips); the week replaced by the recommended engagement lifecycle (draft, flagged); one close. |
| Insights | Change | An editorial index: large titles, one-sentence dek, "Narrative Systems · June 2026 · 3 min"; the first note larger (read first by position); "In the works" as one quiet block with plain status words; no codes, matrix, glyphs or chips. Entropy Index: Q4 2026. |
| The three notes | Approve | No byline; read times 3 / 2 / 2; facts box replaced by one meta line; layer names in words (no glyph sidebars). |
| Reports | Change | The readout set once as a real document (constraint sentence large, the four parts as spreads with one real-looking excerpt each, running head, folios) — the head plate is its first page; red "Request a System Audit"; a case-study request by email (honest: none cleared yet; first one sent when a client clears it); no EXAMPLE chips, no leaders, no bracket. |
| The System Audit | Approve | The confirmed sequence (first call → ten days → readout call → proposal) with the 60-minute readout call; no "Q. 01–06" meta; no skeleton bars above the mini-charts; keys retyped. |
| Talk to the team | Change | `.ac-field` form; no memo window, mono keys, date or triple labels; Lab topic copy per Q4. |
| Careers | Change | Still plate (stand-in); seats as a plain staffing list (Founder, then the six next seats, each with a plain status); the deal per Q7; the bench entry as `.ac-field` to the careers address; one close; "bench list" said twice at most. |
| The Lab | Change | Rebuilt per Q4: a still plate (stand-in), "An AI intelligence platform for GTM, revenue strategy and revenue architecture" — coming, by invitation; why it exists (sharpens installs, funded by the advisory work); the Entropy Index Q4 2026; close = red audit + a kit link "Ask for an invitation" (C5). No status board, no instrument list. |
| Privacy · Terms | Approve | "Kelwin, LLC"; "Governing law · to be confirmed" as plain status; codes/keys retyped by the kit. |

## 6 · New this round
- **Project pages** (the founder's short-term services): catalogue, placement and one template mockup, from the
  ideas workflow, for his choice.
- **Engagement lifecycle** (Q7): two or three structures, one recommended.
- **The turn, the write-in, the plate** across every mockup page, so the review site can be clicked through.
