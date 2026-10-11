# Kelwin homepage · Round 3 story (final)

## What changed and why

You said the page tried too hard and had no real story. Two reviewers read our draft like a busy revenue leader
and found the same problem in new forms. This version fixes it:

1. **The story is in the words.** Each section's first line picks up the one before it, so the headlines alone
   read top to bottom.
2. **Fewer slogans.** Only three sections keep the big two-line headline.
3. **"Stop resetting, start compounding" is one drawing.** The system section opens on the broken loop from your
   About page, then builds the three layers into it until the loop closes.
4. **Setup and payoff.** Your letter lists six familiar problems in its margin. The handover strikes each one out
   as its asset changes hands.
5. **Honest numbers.** The evidence has no axis; tap a number and it is explained in its own unit.
6. **A clearer ask.** The final sheet says what the audit needs from you, what happens after the click, and "if
   not, the plan is still yours".

Twelve decisions need you (§7). The urgent one is D8: confirm the audit's days, sessions, access and fee.

---

## The Audit, Run on the Reader

**Thesis.** The homepage behaves like a Kelwin engagement instead of describing one. It diagnoses before it
prescribes. It builds one system inside the reader's own broken loop. It hands that system over before it asks for
anything, qualifies in both directions, and only then asks for the first step: a small, fixed audit whose readout
he keeps either way. **The page never claims to be different. It only orders things differently**, and the order
makes the case. (The founder's memo does name agencies. That is his lived story, kept verbatim, not a positioning
claim.)

> **Precedence.** `ROUND3-NOTES.md` (the founder's words) comes first, then this file, then `DIRECTION-AC.md`
> (the visual language, unchanged), then `CONTRACT.md`. Where this file changes a section's layout, this file wins.
> **This file amends DIRECTION-AC §6.1 ("Do not use pins") for exactly one section, `system`.** GSAP 3.12.5 +
> ScrollTrigger is founder-approved in `CONTRACT.md` and is already a dependency of the live repo, so the pin adds
> no package. Production may use either ScrollTrigger or `position: sticky` with Motion's `useScroll` (also already
> installed). The assembly order is in `story-order.json`, which `python3 tool/home.py` reads.

---

## 0 · At a glance

The page goes from 14 sections to 11 beats.

| # | id | Verdict | Archetype (no two neighbours share one) | Surface | The one red |
|---|---|---|---|---|---|
| 01 | `hero` | **Keep**, with one control removed (D12) | Cinematic full-bleed | Graphite + film | Primary button |
| 02 | `reframe` | **Keep**, with three small edits | Head + figure plate + caption band + toggle (**the only one**) | Graphite | The datum |
| 03 | `evidence` | **Re-lay** (new artifact) | Numeral wall that is also the control, over one fixed readout | Paper | The 17% bar |
| 04 | `letter` | **New** | Typographic letter with a marginal list. Still. | Graphite | — |
| 05 | `system` | **Merge** (stack + architecture + statechange) | Pinned scrollytelling, one frame at a time (**the only pin**) | Graphite | The break (✕), which becomes the return path |
| 06 | `principle` | **Keep, moved** after the pin | Centred poster sheet | Paper | Output tick |
| 07 | `handover` | **Merge** (assets + beforeafter + FAQ 04/05) | Split-surface sheet deck | Graphite \| paper | Datum tick |
| 08 | `method` | **Re-lay** (approved idea, new head) | Descending gantt that bleeds off the right edge; the statement sits on the diagonal | Graphite | Diagnose bar |
| 09 | `fit` | **Keep the ledgers**, new rows, no fork, no statement | Sticky lede column + two ledgers whose heads are the headline. Still. | Paper | — |
| 10 | `cta` | **Rework** (middle ground with round 1 A) | Red poster + one document | **Red** | The plane |
| 11 | `footer` | **Keep + his fix** | Index + cropped mark. Still. | Graphite | — |
| — | `faq` | **Moves to /audit** with his fix (D4) | Rendered this round for review only, not in the homepage order | — | — |

**Page budgets** (each is a hard cap, checked in review):

| Device | Cap | Where |
|---|---|---|
| Pin | 1 | `system` |
| Plate + caption band + segmented control | 1 | `reframe` |
| Standard two-line 88px head (`.ac-head`) | 3 | `reframe`, `evidence`, `handover` |
| Counter | 1 | `system` (`Carried forward · 00 → 04`) |
| Dashed → solid gesture | 1 | `handover` |
| Ambient loop | 1, plus the film | `method` packet |
| The word "compound(ing)" in rendered copy | 2 | reframe plate, the system's *Compounding pipeline* callout. The nav's approved descriptor is the only other use. |
| Red asks to /audit | 2 | hero, cta (plus the nav's outlined *Audit request*) |
| Quiet ask to /audit | 1 | system tail |
| Still beats (reveal only) | 3 | `letter`, `fit`, `footer` |

---

## 1 · The story in four movements (scaffolding only: never rendered)

The movement names are **not** printed on the page. Round 3's act markers are retired, because they misfired
against the method's phases and nobody reads a 12px meta label. The movements are how we build the page, not what
the visitor sees.

- **I · Name the problem** (hero, reframe, evidence, letter). Four beats, each in a different register, and none
  repeating another:
  - the hero makes the claim;
  - the reframe names the wrong **layer**;
  - the evidence shows what the **market** has published;
  - the letter tells the **lived cost** and itemises six symptoms in its margin, which a founder and a revenue
    leader will both recognise.

  The letter's line *"one that installs the system, then hands you the keys"* previews the next two movements.
- **II · Show the system** (system, principle).
  - The pin opens on the reader's own broken loop and builds the three layers into it, layer by layer, until the
    return path closes it. This is reached at about 34% of the scroll.
  - The principle poster then lands as what the closed loop emits: one signal out of noise.
- **III · Hand it over** (handover, method).
  - The six symptoms from the letter are struck through as the six assets cross to his side.
  - Then the order of work, with the handover marked on the track, and the endless line labelled *yours*.
- **IV · Qualify, then invite** (fit, cta, footer).
  - The gate works both ways and has no button.
  - *Someone will own it* faces *Outsource-it-forever*.
  - Then one red plane. Its object is phase 01, with what it asks of him and the risk reverser printed on it.

---

## 2 · The page in rendered text only (the continuity check)

This is the page read with only the words it renders, in order. Each beat picks up the last one's thread.
**Builders must not change any line marked ★ without re-running this read.**

1. **hero.** *Revenue is an architectural problem.* · *Kelwin designs the narrative, market intelligence and
   outbound systems that turn fragmented growth into repeatable pipeline.*
2. **reframe.** ★ *Most teams are fixing the wrong layer.* (picks up "architectural") · *Most firms treat the
   surface — campaigns, conversion, reps. Kelwin diagnoses the architecture that produces it.* · *Fix the surface,
   and it returns. Fix the architecture, and it compounds.*
3. **evidence.** ★ *Four numbers. One diagnosis.* (picks up "diagnoses") · ★ *Every one gets blamed on the
   pipeline. Not one of them moves with more activity.* · *Buyers spend just 17% of the journey with sales.*
4. **letter.** *Why Kelwin exists* · ★ *…hiring an agency, getting a quarter of activity, and ending up exactly
   where they started, minus the budget.* (picks up "more activity") · the margin, *Told from inside*: *The founder
   writes every message · Dependent on the agency · Random outbound activity · SDRs chase raw volume · No idea why
   replies stay low · Campaigns reset every month* · ★ *…one that installs the system, then hands you the keys.*
5. **system.** ★ *Three layers. One closed loop.* · ★ *Capital in, campaigns run, knowledge lost, reset. The loop
   conserves nothing — every cycle pays full price to relearn what the last one knew.* (the letter's "every quarter
   starts from zero", drawn) · *Narrative Systems → GTM Infrastructure → GTM Intelligence → The return* ·
   *Carried forward · 04* · *Find your weakest layer → If we're not the fix, the audit says so — and points you
   somewhere better.*
6. **principle.** *In a noisy market, the clearest company wins.* · ★ *Not the loudest. Not the busiest.* (answers
   "more activity" and the letter's "nobody in that movie is lazy")
7. **handover.** *When we leave, the system stays.* · ★ *Same team, same market.* (picks up the principle's "noisy
   market") · the six symptoms from the letter, **struck**, each followed by what replaces it · *If it stops working
   the day we leave, we built it wrong.*
8. **method.** ★ *It starts with the audit.* (the exit has been shown, so now the entry) · *Diagnose · The real
   constraint, named — in a written readout.* · *Handover* · *Calibrate · yours, run by your operator or with us on
   retainer* · *Install first, then an operating retainer — on a system you own.*
9. **fit.** ★ *The audit is a gate, and it works in both directions — who we say yes to, and the honest list of
   who we send away.* (picks up "It starts with the audit") · *Built for: … Someone will own it.* · *Not for: …
   Outsource-it-forever.*
10. **cta.** ★ *Sound like you?* (answers the ledgers) · *Request the System Audit.* · *Three questions → a
    30-minute call with the founding team → Day 01.* · *If not, the plan is still yours.*
11. **footer.** The index.

---

## 3 · Section by section

Each entry gives the verdict and sources, the section's job, the rendered handoff, its content, the archetype, the
motion, the surface and red, which founder or review notes it resolves, and a build brief.

### 01 · `hero` · KEEP (approved), with one control removed

- **Source:** round-2 hero X (*FIG. 01 · The Room, Re-set*) and nav X (*The drawn plate*), both approved.
- **Job:** the claim and the setting, the room where pipeline is decided. The thesis is said once here, and after
  this the page stops asserting.
- **Rendered handoff:** none needed. It opens the page.
- **Content (approved, verbatim):**
  - Label `■ GTM systems partner`. Statement: *Revenue is an / architectural problem.*
  - Lede: *Kelwin designs the narrative, market intelligence and outbound systems that turn fragmented growth into
    repeatable pipeline.* The naming of the three layers is decision **D10**.
  - Doors: red *Request a System Audit ↗* (/audit) and *Talk to the team →* (/contact).
  - Bottom-left note: *A fixed-scope diagnostic · Ten working days. Clear findings. Actionable recommendations.*
  - Band: *FIG. 01 · The room where pipeline is decided*, the ruler, the timecode and *Pause film*.
  - **The Close | Wide segmented control is removed (D12).**
  - The nav's mega menu introduces the page's single count of three: Narrative Systems · GTM Infrastructure · GTM
    Intelligence.
- **Archetype:** cinematic full-bleed, read on a Z diagonal from the statement at mid-left to the action at
  bottom-right.
- **Motion (approved):** the statement lines rise, the registration marks register and the ruler ticks in. The film
  is ambient.
- **Surface and red:** graphite + film. Red is the primary button.
- **Resolves:** review 2. The first two viewports both ended in a band with a mono caption at left and a toggle at
  right, which is the exact signature the founder called templated. The hero gives up the least valuable control on
  the page, so the reframe keeps the only one. *Pause film* stays, because WCAG 2.2.2 requires a way to pause moving
  media.
- **Build brief:**
  - Port `hero/X` to `hero/S`, renaming the prefix (`.km-hero-X` → `.km-hero-S`, keyframes included).
  - Delete the `.ac-seg` and its JS handler, and lock the film to the *Wide* framing, which is the approved resting
    state.
  - The ruler, timecode and *Pause film* keep their right alignment. Do not stretch the ruler into the freed space.
  - Change nothing else.

### 02 · `reframe` · KEEP (approved), with three small edits

- **Source:** round-2 reframe X (*Surface, cut to architecture*), approved.
- **Job:** names the misdiagnosis at his own layer: symptoms sit at the surface, causes sit in the architecture. It
  is also the first time the three layers appear, framed as a diagnosis rather than a service menu. It is the page's
  establishing diagram, which is why it keeps the page's one plate.
- **Rendered handoff:** the statement picks up the hero's "architectural", and its lede hands the word "diagnoses"
  to the evidence head.
- **Content (approved):**
  - Label `■ The reframe`. Statement: *Most teams are fixing / the wrong layer.*
  - Lede: *Most firms treat the surface — campaigns, conversion, reps. Kelwin diagnoses the architecture that
    produces it.* Link: *See the diagnostic method →*.
  - FIG. 02 plate: *Fix the surface, / and it returns. / Fix the architecture, / and it compounds.* This is the first
    of the page's two uses of "compound".
  - Three strips, each striking its symptom and naming its layer, with the approved one-line causes.
- **Archetype:** head + figure plate + caption band + segmented control. **Only this section uses it.**
- **Motion (approved):** going from Surface to Architecture, the warped LATTICE resolves into the true grid and the
  red datum seats on the real layer.
- **Surface and red:** graphite. Red is the datum.
- **Resolves:** the recurring note. The repetition was this layout copied from section to section, so it now
  appears once.
- **Build brief:** port X to S and make three edits.
  1. **Label-row meta:** remove `Fig. 02` from the label row. The plate's own `FIG. 02` caption stays.
  2. **(D2)** Rename level 02 from `Orchestration` to `GTM infrastructure`, in both the plate label and strip 02
     (*A sales execution problem.* struck → *GTM infrastructure.*). The cause line is unchanged.
  3. **Link:** change the `href` from `/methodology` (which doesn't exist and 404s on the static export) to
     `/#methodology`, the method section's anchor. The live nav and footer already use this anchor.

  If the founder declines D2, ship edits 1 and 3 only.

### 03 · `evidence` · RE-LAID OUT: the four readings, as an explorer (his note)

- **Source:**
  - The approved round-2 head copy and its labels (`01 · Visibility`, `02 · Timing`, `03 · Complexity`,
    `04 · Experience`, in the live order).
  - The four readings exactly as in `src/components/sections/StructuralEvidence.tsx`: `claim`, `so`, `detail` and
    `source`.
  - The published field note *The 17% window* (`/insights/the-17-percent-window`, June 2026, 5 min).
  - **Retired:** the FIELD dots, the plate, the caption band, the segmented control, the journey axis, both
    proportional slivers, the dimension brackets and every count-up.
- **Job:** authority from research rather than logos. The market's own published readings show where deals are
  actually won, and that none of it moves with more activity. The section claims only what the four readings
  support.
- **Rendered handoff:** the lede's second sentence, which replaces "Every one is measuring something structural":
  *Not one of them moves with more activity.* It is true of all four readings, it doesn't repeat the hero's
  "structural", and the letter picks it up in its first sentence ("a quarter of activity").
- **Content:**
  - Label `■ The structural read`. No meta.
  - Statement: *Four numbers. / One diagnosis.*
  - Lede: *Every one gets blamed on the pipeline. Not one of them moves with more activity.*
  - The numeral row is also the control (live order, approved labels):

    | Cell | Label | Numeral | Bar shows | Bar words (15px, under the bar) | Source |
    |---|---|---|---|---|---|
    | 01 | Visibility | **17%** | 17 of 100 | *Share of the purchase spent with sales — every vendor combined.* | Gartner |
    | 02 | Timing | **95:5** | 5 of 100 filled; the empty track is labelled *95 not buying* | *Share of your market buying right now.* | Ehrenberg-Bass |
    | 03 | Complexity | **77%** | 77 of 100 | *Share of buyers who found the purchase hard.* | Gartner |
    | 04 | Experience | **53%** | 53 of 100 | *Share of loyalty that comes from the buying experience.* | CEB · HBR |

  - The readout for the active cell shows its `claim`, its `so` and its `detail`, all verbatim from the live
    component, plus its source.
  - Door: *Field note · The 17% window · 5 min →* (/insights/the-17-percent-window).
  - Show source names only. **Add no years** that the live component doesn't carry.
- **Archetype:** a data wall plus an interactive explorer, an archetype used nowhere else on the page:
  - four big numerals in one row, which are themselves the control;
  - one fixed-height readout beneath them;
  - no axis, ticks or hairline verticals.
- **Motion:** plays once, at 40% visible.
  1. The numerals rise 12px from their masks, left to right, at a 120ms stagger. They don't count.
  2. Cell 01 takes its active rule.
  3. The readout writes in: claim, then so-what, then detail (fades of 300ms each).
  4. The red 17% bar extends (700ms).

  Pressing another numeral crossfades the readout (360ms) and re-extends the bar from 0 to that reading's value
  (600ms). **There is no auto-stepping on the live site.** The standalone mockup demos the control once, stepping
  17 → 95:5 → 77 → 53 → 17 inside 6s.
- **Surface and red:** paper. The 17% bar is red only while 01 is active, which is also the resting state. The other
  bars are ink.
- **Resolves:**
  - **The founder's note.** He said the section was "not authoritative / not interactive" and that he couldn't
    tell "what the dots are doing". Now every number names its own unit in words, it is sourced, and the numbers
    themselves are the controls.
  - **Both reviews' integrity problems.** The false line "none of the four is taken where your sales team works"
    is deleted. Two units never share an axis. The 17% no longer claims a position in time. The 53% no longer
    sits under "after they sign".
  - **Review 2's archetype echo.** The horizontal time track now belongs only to the method.
- **Build brief:**
  - **Head:** standard `.ac-head`. Statement in cols 1–8, lede in cols 1–6. No note column.
  - **Numeral row** (80px below the lede, cols 1–12): four `<button aria-pressed>` cells on cols 1–3 / 4–6 /
    7–9 / 10–12, with roving focus on the arrow keys. Each cell, top to bottom:
    - `.ac-idx` label `01 · Visibility`;
    - the numeral as `.ac-num` at **144px**, with its unit (`%`, `:5`) at .5em in light 300. Verify that `95:5`
      fits 310px; the floor is 128px.
    - **Active cell:** a 2px `--fg` top rule, with the numeral in `--fg`.
    - **Inactive cells:** the numeral in `--fg-2`, never `--fg-3`, so the wall reads in full at first glance.
  - **Readout** (48px below the row, cols 1–12, **fixed height of about 240px**, so nothing reflows on press):
    - **Cols 1–7:** the claim (24px Mona 500, `--fg`), the so-what (17px, `--fg-2`) and the detail (15px,
      `--fg-2`, ≤ 3 lines).
    - **Cols 9–12, the MEASURE bar:** a 1px track with end ticks at 0 and 100 only, and a 10px bar.
      - The value (`17 / 100`) is mono 12px at the fill's end.
      - The bar words sit beneath (15px).
      - Then `Source · Gartner` (`.ac-cap`) and the field-note link (`.ac-link`).
  - **Words at rest:** about 105, within the 120 cap.
  - **Mobile:** the numerals sit in a 2×2 grid at 88px, with the readout below.
  - **Reduced motion:** the final state, with 01 active.
  - **Lead primitive:** MEASURE, as a single proportion bar. This variant is distinct from the method's gantt.

### 04 · `letter` · NEW: Memo K-000, with the movie itemised

- **Source:**
  - Founder memo **K-000**, verbatim, from `FirmAbout.tsx` (marked `[EDIT ME] written in your voice on purpose`,
    so it needs **D1**).
  - The /about registry line *Founded 2026 — deliberately late to the category*.
  - The `FIT/03 · Told from inside` label and the first sentence of vignette 02, *The plateaued motion*, both from
    `FirmFit.tsx`.
  - The six "befores" from beforeafter X.
  - The three published field notes listed in `InsightsIndex.tsx`.
- **Job:** the inciting incident, and the page's human voice.
  - **For founders:** the memo, in his own words.
  - **For revenue leaders:** the margin, in their own symptoms. It also sets up the handover, whose strike-throughs
    pay these exact six lines off.
  - It is the honest version of CLAUDE.md's "founder note" slot: no fabricated proof, just why the firm exists and
    what it has published.
- **Rendered handoff:** the memo's first sentence (*"…hiring an agency, getting a quarter of activity, and ending
  up exactly where they started, minus the budget"*) picks up the evidence's *more activity*. Its paragraph 2
  closes on *"one that installs the system, then hands you the keys"*, which leads straight into the system and,
  later, the handover.
- **Content:**
  - Label `■ From the founder`. Meta `Memo K-000`.
  - Subject: *Why Kelwin exists*.
  - The three paragraphs, verbatim (D1):
    1. *I started Kelwin after watching the same movie too many times: a good company, a real product, a founder
       writing every important email themselves at 11pm — hiring an agency, getting a quarter of activity, and
       ending up exactly where they started, minus the budget.*
    2. *Nobody in that movie is lazy. The problem is structural: the learning leaves with the vendor, the language
       never gets written down, and every quarter starts from zero. So we built the firm we kept wishing existed —
       one that installs the system, then hands you the keys.*
    3. *If you write to us, a person answers. That isn't a feature. That's the point.*
  - Signature: a drawn dash, then *Rameez* (linking to /about), *Founder, Kelwin*, and *Founded 2026 — deliberately
    late to the category.* The /about foot *Drafted late on a Tuesday. Unchanged since.* is dropped here. It is a
    nice line, but it is a word the page doesn't need.
  - **P.S.**
    - *Write to the founding team →* (/contact).
    - The reading list *Field notes, published*, three rows:
      - *Revenue entropy* · June 2026 · 6 min;
      - *The 17% window* · June 2026 · 5 min;
      - *Deliverability is infrastructure* · May 2026 · 5 min.
  - **Margin** (cols 10–12, top-aligned with paragraph 1):
    - Caps label `Told from inside`.
    - Caption (15px, `--fg-2`): *You've got SDRs, sequences, a tech stack that cost real money — and a pipeline
      chart that's been flat for four quarters.*
    - Then the six symptoms, **unstruck**, with mono indices **identical to the handover's**: `01` *The founder
      writes every message* · `02` *Dependent on the agency* · `03` *Random outbound activity* · `04` *SDRs chase
      raw volume* · `05` *No idea why replies stay low* · `06` *Campaigns reset every month*.
- **Archetype:** a typographic letter with a marginal list. It has no drawing, no title block, no stamp and no
  two-voice statement. It is the page's first pattern interrupt.
- **Motion: still.** The paragraphs rise line by line from their masks in reading order, the margin rows fade in at
  an 80ms cascade, and the signature dash draws last. Nothing else moves and nothing loops.
- **Surface and red:** graphite, with a ruled cut into the system below, which is also graphite. There is no red
  beyond the label square.
- **Resolves:**
  - The founder's statechange note ("afterthought… very similar to the previous section… tell a story"). The
    "reset" now has a voice here and a full-scale drawing in the system's first frame.
  - Review 1: the founder-only protagonist, the trust gaps (founding year, signature link, the published notes) and
    the letter that over-performed.
  - Review 2: the letter is pure type, so it is a real pattern interrupt.
- **Build brief:**
  - **Label row:** cols 1–12.
  - **Subject:** Mona wide 430 at 42px (`.ac-h3--lg`), in cols 2–8, 48px below the label row.
  - **Body:** cols 2–8, 40px below the subject, at most about 60ch. It is set in the accent voice, Mona 400
    **22px/1.55** `--fg`, with 28px between paragraphs.
  - **Signature:** a 48×1 dash, then *Rameez* (Mona 500 20px, a plain link to /about with an underline on hover
    only), then *Founder, Kelwin* (15px, `--fg-2`), then the Founded line (15px, `--fg-2`).
  - **P.S.:** 32px below the signature. The `.ac-link`, then the three-row reading list. The rows are hairline
    divided; each row has its title (15px, `--fg`) and `June 2026 · 6 min` (mono 12px, `--fg-3`), and the whole row
    is a link.
  - **Margin:** cols 10–12.
    - The label.
    - The caption, at most 4 lines.
    - 24px below the caption, the six rows (`.ac-idx` + 17px `--fg`), hairline divided.
  - **Height and space:** about 850–950px, with at least 50% of it empty.
  - **Mobile:** the margin list drops in after paragraph 2, so the symptoms stay next to the movie.
  - **Reduced motion:** the final state.
  - **Meta:** flag `needs founder sign-off (D1, D11)` in `letter/S.meta.json`.

### 05 · `system` · MERGE: the loop, closed (the only pin)

- **Source:**
  - **Approved stack X:** the STRATA slabs, the *In practice* copy and *The loop that learns*.
  - **Approved architecture X:** the statement *Three layers. / One closed loop.*, the loop, the step D copy, *One
    cycle · one quarter*, *Compounding pipeline*, the dashed *Reroute effort*, and B's big light node numerals.
  - **Statechange:** the accretion rings and *Carried forward*.
  - **/about's origin telemetry** (`FirmAbout.tsx`): *Capital in · Campaigns run · Knowledge lost · Reset*,
    `ERR · Q1 = Q9`, and the caption *"Capital in, campaigns run, knowledge lost, reset. The loop conserves
    nothing — every cycle pays full price to relearn what the last one knew."*
  - **The nav:** the capability names, the descriptor *The machine that carries it to buyers*, and the glyph
    mapping (Narrative = CONTOUR, Infrastructure = TRACE, Intelligence = ORBIT).
  - **/about's ConvertPanel:** *if we're not the fix, the readout says so and points you somewhere better.* The
    tail adapts it, using "audit" because "the readout" is not introduced until the method.
- **Job:** the mechanism, shown inside the reader's own broken loop.
  - It starts as the loop most teams run, which leaks at *Knowledge lost* and resets empty-handed.
  - It ends as three layers he will own, plus a return path that carries each quarter forward.
  - The same counter gives the opposite result. This is the founder's statechange idea, at full scale and in the
    page's most-watched position, rather than as an afterthought.
- **Rendered handoff:** frame 0's caption is the /about line quoted above. It is the letter's "every quarter starts
  from zero", drawn.
- **Content, frame by frame** (one frame visible at a time):

  | Frame | Pinned scroll | Panel (cols 8–12) | Drawing (cols 1–7) |
  |---|---|---|---|
  | 0 · The loop most teams run | 0–280px | Label `■ The revenue operating system` · statement *Three layers. / One closed loop.* (64px, two voices) · caption (17px) | A vertical route through three nodes: *Capital in* → *Campaigns run* → *Knowledge lost*. A red ✕ (two 1px hairlines) sits at *Knowledge lost*, and a dashed return runs up the right side, labelled *Reset*. Readout `Carried forward · 00` and stamp `ERR · Q1 = Q9`. Scrubbed: a packet runs the route three times and drops out at the ✕ each time. The readout stays `00`. |
  | 1 · Narrative Systems | 280–560 | Big light `01` · **Narrative Systems** · *The words buyers repeat* · *We rewrite what your site, deck and reps say until a buyer can repeat it without you.* | Slab 01 drops onto node 1, and *Capital in* gives way to *Narrative Systems*. Its inscription (CONTOUR): five jittery lines settle into straight text rules. |
  | 2 · GTM Infrastructure | 560–840 | `02` · **GTM Infrastructure** · *The machine that carries it to buyers* · *We build the data pipeline into your CRM, install the plays and triggers in your stack, and run the first cycles with your team.* | Slab 02 drops onto node 2, and *Campaigns run* gives way to *GTM Infrastructure*. Its inscription (TRACE): a three-node route draws across the slab. |
  | 3 · GTM Intelligence | 840–1120 | `03` · **GTM Intelligence** · *The loop that learns* · *Every touch is instrumented, so intelligence observes what actually works.* | Slab 03 drops onto node 3, and *Knowledge lost* gives way to *GTM Intelligence*. Its inscription (ORBIT): an open ring closes, and **the red ✕ dissolves into that closed ring.** The break is now a node that keeps what it learns. |
  | 4 · The return | 1120–1600 | **The return** · *One cycle · one quarter* · *What intelligence learns flows back each quarter, retuning the narrative and rerouting effort.* | The dashed *Reset* segment, in the same position and shape, **draws solid red** from Intelligence up to Narrative, with its draw length tied to scroll. A dashed branch, *Reroute effort*, drops to Infrastructure. Over the frame a packet completes four laps (scrubbed). Each lap adds one ring to the Intelligence slab and steps the readout `01 → 04`. The ERR stamp is gone. The stack compresses (56 → 32px). Big light numerals `01 02 03` sit beside the slabs, and *Compounding pipeline* exits at the bottom right. |

  - **Tail** (normal scroll, after the unpin, cols 8–12): the quiet door *Find your weakest layer →* (/audit), with
    *If we're not the fix, the audit says so — and points you somewhere better.* (15px, `--fg-2`) beneath it.
- **Archetype:** pinned scrollytelling with **one frame at a time**, which is not a list:
  - inactive steps are hidden, not dimmed;
  - each step crossfades in place (400ms);
  - a thin five-segment progress rail sits above the panel.

  So it can't read as the approved stack X (a drawing beside a dim/bright ledger).
- **Motion:**
  - **Frames 0 and 4** are scrubbed: their packet laps, the red return's draw length, the rings and the readout all
    follow scroll position.
  - **Frames 1–3** trigger at their thresholds. In each, the slab drops (−24px → 0, 700ms), then **its own
    inscription morph** plays. Each morph is different: the noise settles, the route draws, the ring closes. They
    are not three identical drops.
  - Scrolling up reverses everything.
  - After the unpin the loop rests closed. **There is no ambient packet**, because the method owns the page's only
    ambient loop.
- **Surface and red:** graphite. Red is **one element that moves**: the ✕ at the break (frames 0–2) dissolves in
  frame 3, and the red then draws as the return path in frame 4. Red never appears in two places at once.
- **Resolves:**
  - **Founder's notes:** stack and architecture were approved but sat as adjacent twins, and they contradicted each
    other (four layers against three). Statechange was "an afterthought" with a repeated layout.
  - **Review 1:** the descriptive headline, the layer-named steps, no A–D codes, and a pin cap of about 1,600px.
  - **Review 2:**
    - the broken loop is now frame 0 at full scale;
    - compounding is shown by deposits, not by circulation;
    - D is tied to scroll, so a fast scroller still sees it;
    - one step shows at a time;
    - the B chart's numerals and *Reroute effort* are kept;
    - the slabs now differ from the reframe's single cut block.
- **Build brief:**
  - **Pin:** ScrollTrigger, `pin: true`, scoped to the section root, **only under `html.km-home`**, with
    `end: "+=1600"` and `scrub: 0.6` for frames 0 and 4. Frame thresholds are as in the table: frame 4 has the most
    distance (480px).
  - **Stage:** 100vh, content vertically centred, with the content box ≤ 760px tall.
  - **Drawing** (cols 1–7):
    - Three true-iso rectangular slabs, 12px thick, 56px apart when exploded.
    - The TRACE runs vertically through the slab centres, with 7px nodes.
    - The return route on the right side has identical geometry in frame 0 (dashed, *Reset*) and frame 4 (solid red).
    - **Callouts, ≤ 5 at any moment:** frame 0 uses its four loop labels. Frames 1–4 use the three layer names,
      *Reroute effort* and *Compounding pipeline* (5 at frame 4).
    - **Dimension:** one, *One cycle · one quarter*, along the return.
    - **Readout:** mono 12px under the drawing: `Carried forward · 00`.
    - **Title block** (bottom-left of the drawing): `FIG. 03 | Revenue OS | Specimen`.
  - **Panel** (cols 8–12, about 533px):
    - The progress rail: five 32px 1px segments, with the active one in `--fg` and no numbers.
    - One step block at a time, made of:
      - an index numeral (96px, light 300, `--fg-2`);
      - the layer name (`.ac-h3--lg`, 42px);
      - the subtitle (17px, `--fg-2`);
      - the line (17px, `--fg`).
    - Frame 0's block holds the label, the statement (64px; "One closed loop." measures about 481px at 64px) and
      the caption.
  - **Tail:** 96px below the pin.
  - **Standalone `m-system-S.html`:** a **contact sheet of the five frames** at 0.5 scale (3 + 2 layout, each frame
    captioned with its name), ≤ 1400px tall. It must never be an auto-playing demo: the founder reviews the real
    scroll in `home.html`. Record this in `meta.notes`.
  - **Mobile, and reduced motion:** no pin. Show, stacked:
    1. frame 0's drawing with its caption;
    2. the three layer blocks as a plain list;
    3. the frame-4 drawing (4 rings, `Carried forward · 04`, the red return) with the return text.
  - **Fallback for D2 (declined):** four slabs, with Data and Orchestration both tagged GTM Infrastructure.

### 06 · `principle` · KEEP (approved), moved after the pin

- **Source:** round-2 principle X (*Signal / noise sheet*), approved.
- **Job:** the point of view, and the release after the page's longest beat. Its drawing takes noise in and emits
  one clean signal out to a red tick, so straight after the pin it reads as what the closed loop produces.
- **Rendered handoff:** its approved support line, *Not the loudest. Not the busiest.*, answers both the evidence's
  *more activity* and the letter's *nobody in that movie is lazy*. Visually, the pin's last frame sends
  *Compounding pipeline* out to the right, and this sheet's output line exits right to its tick.
- **Content (approved, verbatim):**
  - Label `■ Operating principle`.
  - Statement: *In a noisy market, / the clearest / company wins.* Support line: *Not the loudest. Not the
    busiest.*
  - Annotations: A · Input · market noise → B · Output · one signal.
- **Archetype:** a centred manifesto poster on a framed sheet with four registration marks.
- **Motion (approved):** the noise bundle settles into one clean line, which exits to the red tick.
- **Surface and red:** paper. Red is the output tick.
- **Resolves:** review 2's pacing problem. Previously the letter and principle were two quiet, centred beats back to
  back, and the system and handover were two heavy beats touching. Both pairs are now separated.
- **Build brief:** port X to S. The only edit is to remove `Fig. 07` from the label-row meta.

### 07 · `handover` · MERGE: the handover, struck through

- **Source:**
  - **Approved assets X:** the six FOLIO sheets, the capability grouping, each sheet's tag, *Kelwin's side*, the
    *Handover* datum and the legend.
  - **Approved beforeafter X:** the six before → after shifts and *Same team, same market*.
  - **FAQ 05:** the handover test.
  - **FAQ 04:** *documented, so it survives team changes.*
  - **`FirmAbout.tsx`:** *Each quarter deposits into the next.* This replaces the after line *Learning that
    compounds each cycle*, keeping "compound" at two uses.
- **Job:** the payoff. The six lines he read in the letter's margin are struck through, one by one, as the asset
  that ends each one crosses from Kelwin's side of the page to his. The story ends with him holding documents, not
  with Kelwin's results.
- **Rendered handoff:** the lede's first words, *Same team, same market.*, pick up the principle's *noisy market*.
  The struck lines are the letter's own words.
- **Content:**
  - Label `■ What you own`. No meta.
  - Statement: *When we leave, / the system stays.*
  - Lede: *Same team, same market. What changes is the system underneath — six assets in your language, documented
    so they survive team changes.*
  - Note: `■ The handover test` · *If it stops working the day we leave, we built it wrong.*
  - The six assets, grouped two per capability. Each before is **word for word** the letter's margin line, with the
    same index:

    | Cap. | Asset (tag) | Before (struck) | After |
    |---|---|---|---|
    | 01 Narrative systems | 01 Narrative OS (Document) | The founder writes every message | A reusable narrative system |
    | 01 Narrative systems | 02 Channel Playbooks (Playbook set) | Dependent on the agency | The system and docs stay in-house |
    | 02 GTM infrastructure | 03 ICP & Signal Map (Living dataset) | Random outbound activity | Clear ICP and account logic |
    | 02 GTM infrastructure | 04 Orchestration Rules (Routing logic) | SDRs chase raw volume | The team follows buyer signal |
    | 03 GTM intelligence | 05 Signal Dashboard (Instrumentation) | No idea why replies stay low | Objections and patterns, named |
    | 03 GTM intelligence | 06 Rebuild Sequence (Quarterly plan) | Campaigns reset every month | Each quarter deposits into the next |

  - Legend: dashed = *Drafted by Kelwin*; solid = *Owned by you*. End cap `Yours · 06 of 06`, which is static and not
    a counter.
- **Archetype:** a split-surface sheet deck. Kelwin's side is graphite from the left page edge to the end of col 3.
  His side is paper from col 4 to the right edge. **The handover datum is that surface edge.**
- **Motion:** plays once, at 40% visible. **This is the page's most generous moment, on purpose.**
  1. The six dashed sheets, stacked on the graphite side, deal across the edge one at a time (600ms each, 160ms
     stagger).
  2. As each crosses, its edge turns **solid** (the page's only dashed → solid) and its ink inverts to the paper
     side.
  3. On landing, its before line strikes through (a 300ms line draw) and its after line rises in.
  4. `Yours · 06 of 06` fades in after the sixth sheet.

  Hover or focus on an item lifts its sheet 8px.
- **Surface and red:** graphite \| paper. Red is one 8px tick on the datum, where the sheets cross.
- **Resolves:**
  - **Founder's notes:** the plates, caption bands and toggles of assets and beforeafter are gone, and the six
    shifts now each have a cause (an asset).
  - **Review 1:** a setup and payoff the visitor can actually read.
  - **Review 2:** FAQ 04 is now answered in the lede.
- **Build brief:**
  - **Graphite band** (left page edge → end of col 3, about 374px):
    - At the top, the caps label `Kelwin's side`.
    - At tray height, the stack: six 64×90 sheets, offset 4px, dashed, in paper strokes.
    - At the foot, the legend.
  - **Datum:** the graphite/paper edge, labelled `Handover`, with the red tick.
  - **Head** (paper side): the label row in cols 4–12, the statement in cols 4–12 (88px fits 977px), the lede in
    cols 4–8, and the note in cols 10–12.
  - **Tray:** cols 4–6 / 7–9 / 10–12, starting 80px below the head. Each column has:
    - a caps header (`Cap. 01 · Narrative systems`) and a hairline bracket;
    - two items. Each item is a FOLIO glyph (64×90, four text rules, a mono index in its corner, and its
      `.ac-cap` tag beneath) with its text to the right:
      - the name (`.ac-h4`, 24px);
      - the before (15px, `--fg-3`), struck by **an SVG line, not `text-decoration`**, so the strike can animate;
      - the after (17px, `--fg`).
  - **Title block** (bottom-right, merged with the end cap): `FIG. 04 | Handover | Yours 06/06`.
  - **Height:** about 1100–1200px.
  - **Mobile:** the graphite band becomes a top strip with the stack laid horizontally, the datum turns
    horizontal, and the tray becomes one column.
  - **Reduced motion:** the final state, with all six handed over and every before struck.

### 08 · `method` · RE-LAID OUT: it starts with the audit

- **Source:**
  - **Approved method X:** the phase gantt idea, the phase names and outputs, and the lede.
  - **`FirmAbout.tsx` registry:** *Install first, then an operating retainer — on a system you own.*
  - **`FirmFit.tsx`:** *After handover an internal operator runs the system.*
  - **`AuditSpec.tsx`:** the written readout.
- **Job:** the order of work, and who runs what. The first step is small, fixed and lit. The endless line is
  labelled as **his**, run by his operator or by Kelwin on retainer. The handover promise and the line that never
  ends then stop contradicting each other.
- **Rendered handoff:** the statement *It starts with the audit.* The handover has just shown the exit, so the
  method shows the entry.
- **Content:**
  - Label `■ The method`. The section anchor is `id="methodology"`, so the reframe link, the live nav and the footer
    all land here.
  - Statement (one line, 64px, two voices): *It starts with **the audit.*** "the audit." is the accent. It replaces
    *We install the system. / Then keep it sharp.* (D5).
  - Lede (approved, trimmed): *The first three phases run once, in order. The fourth keeps running — a system left
    alone drifts the moment the market moves.*
  - The phases:

    | Row | Index | Phase | Output | Bar |
    |---|---|---|---|---|
    | 1 | `01 · Start` | **Diagnose** | *The real constraint, named — in a written readout.* (the first mention of "readout") | Red, labelled `10 working days · the System Audit` (D8) |
    | 2 | `02` | **Architect** | *Operating model, written down.* | `--fg-2` |
    | 3 | `03` | **Install** | *In use across the team.* | `--fg-2` |
    | — | — | **Handover** | — | A vertical datum. **The same word as the handover section's datum.** |
    | 4 | `04 · Continuous` | **Calibrate** | *A standing signal review — yours, run by your operator or with us on retainer.* | `--fg`, running off the right edge, with the callout `Yours` and the packet |

  - Under the track (15px, `--fg-2`, cols 1–7): *Install first, then an operating retainer — on a system you own.*
  - There is **no door and no note.** The ask comes two beats later. *Phase 01 is the System Audit* is now the
    statement itself.
  - The cell `Indicative` sits at the ruler's left end.
- **Archetype:** a horizontal track that breaks the grid, as a descending gantt. The statement sits at the track's
  top-left, so the rows continue its diagonal down to the bottom right. The lede sits beside row 1. The Calibrate
  bar runs off the right edge of the screen.
- **Motion:**
  1. The ruler calibrates edge to edge (ticks at a 20ms stagger, about 1.2s).
  2. The bars extend phase by phase (700ms each), Diagnose first and in red.
  3. The Handover datum draws down (400ms).
  4. Calibrate extends from the datum past the edge.
  5. A 6px packet then travels along Calibrate and off the page, at ≥ 8s per lap. **This is the page's only ambient
     loop besides the film.**
- **Surface and red:** graphite. Red is the Diagnose bar (D3), so the page's lit step is the one he can take.
- **Resolves:**
  - **The founder's method note** ("we are repeating the layout… introduce new layouts"): the plate, caption band,
    tabs and standard head are gone.
  - **Both reviews' "the exit vs the endless bar" contradiction:** the Handover datum and the *yours* label resolve
    it.
  - **Review 1:** the slogan head is replaced by a plain one-line head about the first step.
  - **Review 1 (trust):** the pod line leaves the homepage until /about shows a pod (D11).
- **Build brief:**
  - **Statement:** at the top-left of the track (cols 1–7), 64px, one line.
  - **Track** (starting 64px below the statement, about 480px tall, full viewport width): the ruler (4px minor ticks,
    8px major every fifth, 12px mono values at the majors) spans the viewport edge to edge.
  - **Four gantt rows** of about 104px each, descending:
    - **Diagnose** starts at col 1 and is 2 cols long: 10px, red, with its dimension label.
    - **Architect** starts at col 3.
    - **Install** starts at col 6 and ends at col 8.
    - **The datum** is a vertical 1px `--fg-2` line at the start of col 9, spanning the track, labelled `Handover`
      at its top.
    - **Calibrate** starts at the datum and runs past the viewport edge, with the callout `Yours`.
  - **Row labels:** index (`.ac-idx`), name (32px `.ac-h3`) and output (15px, `--fg-2`), set **directly above each
    bar's start**.
  - **Lede:** cols 5–9, top-aligned with row 1's label.
  - **Title block:** `FIG. 05 | Phase track | Indicative`.
  - **Mobile:** a horizontal swipe track inside its own container (scroll-snap per phase), with the datum between
    cards 3 and 4 and the Calibrate bar running off the last card.
  - **Reduced motion:** the final state, with no packet.
  - **Meta:** flag `10 working days` as `needs founder sign-off (D8)` in `method/S.meta.json`.

### 09 · `fit` · KEEP the ledgers: new rows, no fork, no statement, no button

- **Source:**
  - **Approved fit X:** the ledger structure, F-03, D-02 and D-03 verbatim.
  - **`FirmFit.tsx`:** `ZONE_CRITERIA` (*Real revenue, felt ceiling*; *Someone will own it*) and `ANTIFIT`
    (*outsource-it-forever*).
  - **`QualifyFlow.tsx`:** *it works in both directions*.
  - **/who-we-work-with's lede:** *the honest list of who we send away*.
  - **Removed:** the TRACE fork, its FIG. 09 cells, the 88px statement, the red button and the dead closing row.
- **Job:** the gate, both ways. The two open rows face each other. *Someone will own it* is the yes, and
  *Outsource-it-forever* is the no. Together they prove the handover promise from the decline side, which is the
  most credible kind of selectivity.
- **Rendered handoff:** the lede, *The audit is a gate, and it works in both directions — who we say yes to, and the
  honest list of who we send away.*, picks up the method's *It starts with the audit*.
- **Content:**
  - Label `■ Who it's for`.
  - The sticky column holds the lede (20px) and a quiet link, *Three situations, told from inside →*
    (/who-we-work-with). That link is where the founder-seller, the plateaued motion and the misheard category live.
  - **Built for** · *We say yes when* · `03`:
    - **F-01 Real revenue, felt ceiling** · *The motion works.* · *Growth is real, just not predictable yet.
      There's a motion we can measure, then make repeatable.*
    - **F-02 Someone will own it** (open) · *An operator inside.* · *After handover an internal operator runs the
      system. Wanting that is the real gate.*
    - **F-03 Committee-decided sales** · *Narrative carries the deal.* · *Several people sign. What they repeat to
      each other decides it, not a coupon at a checkout.*
  - **Not for** · *We decline when* · `03`:
    - **D-01 Outsource-it-forever** (open) · *Dependency by design.* · *Nobody inside will own the system —
      dependency by design, declined.*
    - **D-02 Lead-list shopping** · *Buying lists, not a system.* · *Renting activity is the cycle we exist to end.
      A list vendor is the better call.*
    - **D-03 Pure self-serve / PLG** · *The product sells itself.* · *The system assumes a sales-carried deal.*
  - *Past first revenue* and *Pre-revenue* leave the homepage, because "real revenue" implies both. Pre-revenue is
    still declined by question 01 of the /audit gate.
- **Archetype:** a sticky lede column beside two ledgers. **The 42px ledger heads are the headline**, so there is no
  two-voice statement.
- **Motion: still.** The rows cascade in (80ms), and the two open rows expand (360ms). There is no drawing and
  nothing loops.
- **Surface and red:** paper. There is no red beyond the label square, which saves it for the plane that follows.
- **Resolves:**
  - **The founder's note** about the "animated line on the left… confusing": the line is removed, and the two big
    heads carry the gate on their own.
  - **His round-2 note** on the readability of *Built for* / *Not for*: kept at 42px.
  - **Review 1:** sharper real criteria, and no founder-only bias (the old F-02 body *Founder-led or lean GTM
    teams* is gone).
  - **Review 2:** with no statement, the sticky column no longer has to hold an 88px line, and the dead *Sound like
    you?* row becomes the CTA's label.
- **Build brief:**
  - **Sticky column:** cols 1–4, `position: sticky; top: 128px` inside the section (this is not a pin). It holds the
    label, the lede and the link.
  - **Ledgers:** cols 6–12. The heads are `.ac-h3--lg` (42px), with `+` / `−` mono marks and the `03` counts.
  - **Rows:** `.ac-ledger`, with exactly one `.is-open` per ledger (F-02 and D-01). **Open rows show body text only**
    under the row head, with no sub-headline (his FAQ note applies here too).
  - **Height:** about 950–1050px.
  - **Reduced motion:** the final state.

### 10 · `cta` · REWORK: Sound like you? (the middle ground)

- **Source:**
  - **Round 2, *Ten Days, Measured*:** the lede and the separated doors.
  - **Round 1 A, *The Core, Installed*:** the solid paper object with the big red `10`, and its band *Phase 01 / 04 ·
    Diagnose*. It returns as a **document**, not as the mark's core square (mark geometry stays banned), and it is
    **not** a button.
  - **`AuditSpec.tsx`:**
    - row 01, scope;
    - row 02, *two 90-minute working sessions and read-only access to your CRM and channel stack*;
    - row 04, *Ten working days, kickoff to readout*;
    - row 06, *If installation makes sense, we scope it there. If not, the plan is still yours.*
  - **`QualifyFlow.tsx`:** three questions, then the call. *Thirty minutes, founding team, no SDR handoff.*
- **Job:** the decision. There is one red door, framed as phase 01 of a plan he has already seen. The page prints
  what the audit asks of him, what happens after the click, and the risk reverser.
- **Rendered handoff:** the label *Sound like you?* answers the ledgers directly above it. This is the line that
  sat dead in fit.
- **Content:**
  - Label `■ Sound like you?` (paper square). No meta.
  - Statement (112px): *Request the / System Audit.* "Initiate" is retired as a sci-fi verb (D5).
  - Lede: *One diagnostic maps the architecture underneath your pipeline. What we build, you keep.*
  - Doors: paper *Request a System Audit ↗* (/audit) and *Talk to the team →* (/contact).
  - Path line under the doors (15px Mona, paper at 80%): *Three questions → a 30-minute call with the founding team
    → Day 01.*
  - **The readout sheet (the object):**
    - mono header `Phase 01 of 04 · Diagnose`, the only mono line in the section;
    - **`10`** in red ink, with *working days, kickoff to readout* beneath it;
    - three printed rows:
      - *Scope · Three layers, fixed up front*;
      - *You provide · Two sessions, read-only CRM access* (D8);
      - *After · If an install makes sense, we scope it. If not, the plan is still yours.*
    - along its foot, ten day ticks, with `01` *Kickoff* and `10` *Readout*.
  - **No *Deployment window open* chip (D7).** There is **no fee row** until D8 supplies one.
- **Archetype:** a red poster plus one document. The hierarchy is statement > button > sheet > rows.
- **Motion** (ends by about 2.0s; nothing loops):
  1. The statement lands.
  2. **The doors and path line rise with the head** (+700ms), so the action is never late.
  3. The sheet rises through a clip from its foot (750ms).
  4. Its ten ticks ink in at a 40ms stagger.

  There is no count-up and no dashed → solid; that gesture belongs to the handover.
- **Surface and red:** **red**, the page's only red plane. The accents invert to paper. Paper objects carry red ink:
  the button text and the sheet's `10`.
- **Resolves:**
  - **The founder's CTA note** ("the original… seems more engaging… reach some middle ground"): the solid
    proprietary object returns, while his round-2 ask to separate the button from the ten days holds.
  - **Review 1:** what the audit asks of him, the path after the click, the risk reverser, the verb, and the chip.
  - **Review 2:** the doors arrive first, the sheet is capped in size, and the sheet can never look clickable.
- **Build brief:**
  - **Statement:** `.ac-statement--xl` (112px) in cols 1–8. Lede in cols 1–6. The doors and path line sit in the head
    grammar's door position.
  - **Sheet:** cols 10–12, **280 × 396** (1:1.414), paper fill and ink type.
    - **Bottom-aligned with the path line.** Its top must sit no higher than the cap height of the statement's
      second line.
    - No arrow, no hover state and no pointer cursor.
    - Padding 24px.
    - The `10` is `.ac-num` at **144px** in `--accent`.
    - The rows are a three-row `.ac-spec`, stacked with an 11px label above a 15px value and hairline divided.
    - The foot is a 10-tick MEASURE ruler with 12px mono values at its ends only.
  - **If the sheet out-shouts the button,** shrink it. Never move it up.
  - **Reduced motion:** the final state.
  - **Meta:** flag `10`, *Two sessions* and *read-only CRM access* as `needs founder sign-off (D8)` in
    `cta/S.meta.json`.

### 11 · `footer` · KEEP + his fix

- **Source:** round-2 footer X (*The mark, buried*), approved apart from the crop depth.
- **Job:** the coda and the index. It is the only place the mark appears large. Insights, Reports, The Lab and
  Careers live here and in the nav rather than as extra homepage beats.
- **Rendered handoff:** none needed. After the decision comes the index.
- **Content (approved):**
  - **Capabilities:** Narrative Systems, GTM Infrastructure, GTM Intelligence, The System Audit ↗.
  - **The Firm:** About Us, Who We Work With, The Lab, Careers.
  - **Resources:** Insights, Reports, Methodology, Talk to the Team →.
  - **Contact:** audit@kelwin.co, London live time, Sister company of Plurel, Built in-house, no template.
  - **Legal row:** © 2026 Kelwin · Privacy · Terms · Audit request ↗.
- **Archetype:** a quiet index over a cropped mark.
- **Motion: still.** The mark rises once into its crop, as its reveal.
- **Surface and red:** graphite. There is no red.
- **Resolves:** the founder's note ("not… buried this much… one-third or something, so at least some of the
  smallest square… is a little bit visible").
- **Build brief:** port X to S and make these changes.
  - **The geometry:** the smallest square is the bottom-left rect of the mark (`y 114–152` in the 152-unit
    viewBox), so it sits in the bottom 25% of the lockup's height. A literal one-third crop would hide it
    completely, so we honour his visible intent instead.
  - **The crop:** set `--lk-vis: calc(var(--lk-h) * .83)`. The edge then cuts the lockup at about y 126/152: about
    17% is buried, and roughly the top third of the smallest square shows.
  - **The rise keyframe:** `@keyframes km-footer-S-rise { from { transform: translateY(86%) } }`. The start must
    hide more than the 83% that is visible, or the mark starts already showing. The round-3 draft had this
    backwards.
  - **The link:** Methodology → `/#methodology`.
  - **For review only:** the standalone `m-footer-S.html` shows the 80% and 83% crops side by side, captioned *The
    smallest square sits in the bottom quarter of the mark; a one-third crop hides it completely.* The founder
    chooses with the geometry in view (D6).

### Off-page · `faq` → /audit (D4), rendered this round for review

- **Source:** round-2 FAQ X. Its six questions and answers are kept verbatim, **minus the verdict line under each
  question** (*Infrastructure you own.*, *Ten working days, fixed scope.*, and so on).
- **Job:** the detail-reader's answers, kept on the page where detail-readers already are: /audit, after
  `AuditSpec`. Q1 ("How is this different from a lead generation agency?") is a direct claim the homepage no longer
  makes. On /audit it is simply an answer.
- **Resolves:** the founder's FAQ note ("those headings under each question… overpower the question itself…
  ugly"). The fix is shown rendered, not sidestepped.
- **Build brief:**
  - Build `faq/S` with `node tool/mk.mjs faq S` for the review sheet only. **It is not in `story-order.json`.**
  - The approved ledger layout stays, with one row open.
  - Each answer opens as plain 17px body text directly under its question, with no sub-headline.
  - The head's red button becomes an `.ac-link` (*Request a System Audit →*), because /audit is already the audit
    page.

---

## 4 · Cuts, and why

| Cut | Why |
|---|---|
| `faq` (from the homepage) | It moves to /audit with his fix (above). On the homepage each question is now answered where it comes up: Q2 by the CTA sheet, Q3 by the method, Q4 by the handover lede, Q5 by the handover test, Q6 by the fit ledgers. Q1 is the direct claim the page now makes by arrangement instead. |
| `statechange` | Its idea is promoted, not lost. *Stop resetting* becomes the system's frame 0 (the /about loop, `ERR · Q1 = Q9`, `Carried forward · 00`). *Start compounding* becomes frame 4: the same loop, the same counter, `04`, with rings deposited. The Entropy \| System plate and toggle are retired. |
| `stack`, `architecture` | Merged into `system`. They were adjacent twins and disagreed on the layer count. |
| `assets`, `beforeafter` | Merged into `handover`. The six shifts map one-to-one onto the six assets. The headline *Same activity. / Different system.* is retired (D5), and its lede survives. |
| Evidence's FIELD dots, journey axis, slivers, brackets and count-ups | His note, plus the integrity problems both reviews found. |
| Fit's TRACE fork, statement, red button and closing row | His note (the confusing line). Two red asks back to back weaken both. The dead row's words become the CTA label. |
| Act markers (`I · Diagnose`…) and `FIG. 0n` in label rows | They broke against the method's phases, and nobody reads a 12px meta label. FIG numbers stay only in title blocks (01 hero · 02 reframe · 03 system · 04 handover · 05 method). |
| The letter's marginal loop drawing, its stamp and its Q counter | The drawing was a performance beside 130 words of reading. The broken loop now has its full-scale home in the system's frame 0. |
| Extra counters and second gestures | Only one counter (the system's), one dashed → solid (the handover's) and one ambient packet (the method's) remain. |
| *We don't deliver work. / We install systems.*, the *Built to compound* note, *We install the system. / Then keep it sharp.*, *Initiate* | These were slogans that stated the difference outright (D5). |
| The pod line *Senior pod of 2–3, no juniors* and the method's door | The pod line invites a click to /about, which shows one named architect and a sealed seat (D11). The method's door was a third audit ask, two beats before the real one. |
| The hero's Close \| Wide control | D12. It stopped the first two viewports ending in the same band-plus-toggle signature. |
| *Deployment window open* on the CTA | D7. It is a live claim that can go stale, and on a sales page it reads as manufactured urgency. It stays on /about's registry. |
| Not added: a proof or logo wall, a Lab teaser, an Insights rail or a pod section | Kelwin has no cleared client results (the /reports dossiers are labelled Specimen), so a proof beat would mean inventing them. Credibility comes instead from sourced readings, three dated field notes and a signed memo with a founding year. The legacy CLAUDE.md list is still covered: problem → reframe, evidence and letter; MFS and infrastructure → system; principles → principle; methodology → method; who it's for → fit; founder note → letter; insights → the letter's reading list; final CTA → cta. The pod structure waits for D11. |

---

## 5 · What the arrangement says (without saying it)

1. **Diagnosis before prescription.** Four beats diagnose (the claim, the layer, the market, the lived cost) before
   anything Kelwin installs appears. Even then, the first thing drawn is the reader's own broken loop, not a
   service.
2. **One system, not a menu.** What Kelwin does appears once, as one machine built into the loop he already runs.
   There is no service grid anywhere on the page.
3. **Resetting vs compounding, in one drawing.** It is the same loop and the same counter: `Carried forward · 00`
   becomes `04`, and the red break becomes the red return. No adjective is needed.
4. **Ownership, set up and paid off.** The six symptoms he reads in the founder's margin are struck out, word for
   word, as six assets cross from Kelwin's side of the page to his.
5. **The exit before the entry.** *When we leave* comes before *It starts with the audit*. On the method's track, the
   handover is marked before the endless phase, and that phase is labelled *yours*.
6. **Selective, not hungry.** The gate has no button. *Someone will own it* sits opposite *Outsource-it-forever*:
   Kelwin declines exactly the client who would make it a permanent vendor. There are only two red asks on the whole
   page.
7. **A small, fixed first step.** The only lit bar in the plan is phase 01. The CTA's object is that same phase,
   with what it asks of him, what happens after the click, and *if not, the plan is still yours*.
8. **Honest authority.** Every figure names its source and its unit. The firm's own dated field notes are listed,
   the founder signs with a founding year, and there are no logos, testimonials or results.
9. **Senior and human.** The founder speaks once, where the problem is named. *A person answers*. The call is with
   the founding team, with no SDR handoff.
10. **Clarity practised, not claimed.** There is one count of three layers, one pin, one plate, one red plane, three
    standard heads and two uses of "compound". The page behaves like the clearest company it describes.

---

## 6 · Pacing

```
 #  beat        surface  density          archetype                              the one moment                          red
01  hero        G+film   ▮▮░░░ low        cinematic full-bleed                   lines rise · film (ambient)             button
02  reframe     G        ▮▮▮░░ medium     head+plate+band+toggle (ONLY)          mesh resolves                           datum
03  evidence    P        ▮▮▮▮░ high       numeral wall = control, fixed readout  numerals rise · one bar fills           17% bar
04  letter      G        ▮▮░░░ low        typographic letter + margin list       still (lines rise)                      —
05  system      G [PIN]  ▮▮▮▮░ high       pinned, one frame at a time            loop breaks → layers drop → loop closes ✕ → return path
06  principle   P        ▮░░░░ minimal    centred poster sheet                   noise settles                           output tick
07  handover    G|P      ▮▮▮▮░ med-high   split-surface sheet deck               sheets cross · befores struck           datum tick
08  method      G        ▮▮░░░ airy       descending gantt, statement on diag.   ruler · bars · packet (ambient)         Diagnose bar
09  fit         P        ▮▮▮░░ medium     sticky lede + two ledgers              still (rows cascade)                    —
10  cta         R        ▮▮░░░ low        red poster + one document              sheet rises · ticks ink                 the plane
11  footer      G        ▮▮▮░░ medium     index + cropped mark                   still (mark rises once)                 —

scroll ≈ 12,800px (start of each beat): hero 0% · reframe 8% · evidence 18% · letter 27% · system 34% (pinned 34–47%)
        · principle 55% · handover 62% · method 71% · fit 78% · cta 86% · footer 93%
doors   red→/audit: hero, cta (+ the nav's outlined "Audit request ↗")
        quiet→/audit: system tail (~53%)
        soft→/contact: hero secondary, letter P.S. (~30%), cta secondary, footer
        reading: evidence field note, letter reading list, reframe → #methodology, fit → /who-we-work-with
loops   film (hero) · method packet. Nothing else loops; the system's laps are scrubbed by scroll.
```

**Rhythm notes:**

- **Density.** It alternates low · med · HIGH · low · PIN · min · med-high · airy · med · low · med. No two heavy
  beats touch.
- **Surfaces.** They run G G P G G P G|P G P R G. No more than two graphite beats sit in a row (letter → system has
  a ruled cut), and red appears only at the decision.
- **Pattern interrupts:**
  - 03, where the numbers are the controls;
  - 04, a human voice with no headline;
  - 05, where the scroll mechanic changes;
  - 07, where the surface splits;
  - 10, the red plane.
- **The single pin sits at about 34–47%**, where attention usually drops, and it carries the page's most important
  idea.
- **The mechanism arrives at about 34%.** This is earlier than the draft's 39%, and equal to the order review 1
  proposed.
- **Scanning:**
  - a Z in the hero and the CTA;
  - left to right across the numeral row, then down to the readout;
  - a reading column plus a margin in the letter;
  - a drawing ↔ frame split in the pin;
  - centred in the principle;
  - edge to tray in the handover;
  - a diagonal in the method;
  - a sticky F in fit.
- **After the method** there are three beats (fit, cta, footer). Round 2 had six.

---

## 7 · Decisions for the founder (sign-off needed)

| # | Decision | Default in the build |
|---|---|---|
| D1 | Memo K-000 appears on the homepage verbatim and signed, in your voice (it is marked `[EDIT ME]` on /about). | Verbatim. The *Founded 2026* line replaces the "Drafted late on a Tuesday" foot. |
| D2 | **One count of three.** The system shows three layers (Data and Orchestration become *GTM Infrastructure*), and the reframe's level 02 becomes *GTM infrastructure*. | Three. The fallback is four slabs, two of them tagged GTM Infrastructure. |
| D3 | The method's red moves from Calibrate to Diagnose. | Diagnose is red. |
| D4 | The FAQ leaves the homepage and moves to /audit, with your no-subheading fix (rendered this round). | Moved. |
| D5 | These lines are retired: *Same activity. / Different system.*; *We don't deliver work. / We install systems.*; *We install the system. / Then keep it sharp.* (now *It starts with the audit.*); and *Initiate* (now *Request*). | Retired. |
| D6 | Footer crop: 83% visible (about 17% buried), shown beside 80%. "One-third" would hide the smallest square entirely. | 83%. |
| D7 | *Deployment window open* comes off the homepage CTA and stays on /about's registry. | Off. |
| **D8** | **The audit's facts.** Confirm the **ten working days**, the **two 90-minute sessions** and the **read-only CRM + channel-stack access** (all marked `[EDIT ME]` in `AuditSpec.tsx`). Choose a **fee posture**: state the fee, or say "fixed fee, quoted before kickoff". | Built with the current AuditSpec values, flagged in meta. **No fee line** until you choose. Nothing goes to production until this is signed. |
| D9 | **Audience.** Is the homepage for founders, revenue leaders, or both? | Both: the memo speaks to founders; the margin, the system and fit speak to revenue leaders. |
| D10 | **The hero lede's layer names.** *"narrative, market intelligence and outbound systems"* differs from the nav's *Narrative Systems · GTM Infrastructure · GTM Intelligence*, and "outbound" is the one agency word on the page. | Kept verbatim (approved). We recommend aligning it. |
| D11 | **Trust lines.** One real line of your background under the signature? The pod line (*senior pods of 2–3, no juniors*) returns only once /about shows the pod. | No background line. Pod line off. |
| D12 | The hero's Close \| Wide control is removed, so the reframe owns the page's only toggle. *Pause film* stays. | Removed. |

---

## 8 · How the two reviews were resolved

Review 1 is the skeptical-CRO read; review 2 is the design read. Each high and medium problem is listed with what
we did. Where we kept a choice, the reason is given.

| Problem (review · severity) | Resolution |
|---|---|
| **R1 · high.** Five beats make the same "structural" claim before anything is shown, and the CRO leaves at about 40s. | **Partly adopted; one choice kept.** The principle moves out of Act I. Each remaining beat has a different job (claim / layer / market / lived cost), and the evidence lede loses "structural". The mechanism now arrives at about 34%. **Kept:** evidence stays its own beat instead of merging into the principle as a footnote row. The founder asked for this section to become *more* authoritative and interactive, not smaller, and he approved the four numbers twice. The cost is no worse than R1's own order, which also had four beats before the system. |
| **R1 · high / R2 · high.** The evidence argument is false on its own data, and it mixes units. | **Adopted.** The false line is deleted. There is no axis, no slivers and no count-ups. Each reading names its unit in words. The handoff is now *Not one of them moves with more activity*, which is true of all four. **On "recycled stats":** they are kept but made honest, with sources, units and Kelwin's own field note beside them. |
| **R2 · high.** The evidence axis repeats the method's track. | **Adopted.** A numeral wall plus a readout explorer. The horizontal track belongs to the method alone. |
| **R1 · high.** A founder-only protagonist. | **Adopted.** The letter's margin carries vignette 02 and the six operator symptoms. Fit drops *Founder-led*. Audience is D9. |
| **R1 · high / R2 · medium.** The CTA rests on placeholders and leaves out the fee, access, path and risk reverser. | **Adopted, with one choice kept.** The sheet prints *You provide*, the path line and *If not, the plan is still yours*. The fee is D8, and nothing about it is invented. **Kept:** the `10` stays as the sheet's numeral. It is the founder's own public claim (in the approved hero note, the /audit header and the /about ConvertPanel), and it is what made round 1 A the object he wanted back. It is flagged D8, and nothing ships until D8 is signed. The method's head no longer depends on the number. |
| **R1 · high / R2 · medium.** "When we leave" is contradicted by a Calibrate bar that never ends. | **Adopted.** A *Handover* datum on the track, the *Yours* callout, the Calibrate output *yours, run by your operator or with us on retainer*, and the /about line *Install first, then an operating retainer — on a system you own.* |
| **R1 · high.** The handoff lines are not rendered. | **Adopted.** Every handoff is now rendered copy (§2), mostly in each section's first or lede line. Where possible, a section reuses words from the beat before it. |
| **R2 · high.** Statechange shrinks to a margin drawing, and the packet in D shows circulation rather than compounding. | **Adopted.** The broken loop is the pin's frame 0, at full scale. The same counter accumulates in frame 4, and each lap deposits a ring. The letter has no drawing. |
| **R2 · high.** Pacing: the two quiet beats sit together, and the two heavy beats sit together. | **Adopted.** R2's order. The principle moves after the pin, with its handoff shown in §2. |
| **R2 · high.** The pin looks like stack X, is demoed by auto-play, repeats identical slab drops, puts D on a timer and duplicates the reframe's cut. | **Adopted.** One frame at a time with a progress rail. Each step has its own inscription morph. D is scrubbed and has the most distance. B's numerals and *Reroute effort* are kept. The standalone is a five-frame contact sheet, and the real scroll is reviewed in `home.html`. |
| **R1 · medium / R2 · medium.** The page states the difference outright (*We don't deliver work*, and so on), and uses "compound" about six times. | **Adopted.** *Three layers. / One closed loop.* The note is cut. Fit has no statement. "Compound" appears twice. The thesis now reads "never claims, only orders". |
| **R1 · medium / R2 · medium.** The aphorism cadence and the head template repeat six times. | **Adopted.** The standard 88px head appears on 3 sections. The system's statement lives inside the pin at 64px. The method has a one-line head on its diagonal. Fit opens on its ledger heads. Quiet notes are down to one (the handover test). |
| **R1 · medium / R2 · medium.** The act markers misfire, and there are three four-step sequences. | **Adopted (R1's fix rather than R2's).** The act markers are removed from the page. The system steps are named by layer, with no verbs and no A–D codes, so the method is the only verb-led sequence. *Phase 01 of 04 · Diagnose* appears once, on the CTA sheet, where it matches the method's track. |
| **R1 · medium.** The letter's rhyme is for the designer, and the letter performs too much. | **Adopted.** The letter is still. The rhyme is now textual (the six symptoms, struck later) and adjacent (the loop sits in the very next beat). |
| **R1 · medium.** The motion budget is still a template. | **Adopted.** Three still beats; one counter; one dashed → solid; one ambient loop besides the film; a pin of 1,600px. |
| **R1 · medium.** The fit criteria aren't selective. | **Adopted.** *Real revenue, felt ceiling*, *Someone will own it* and *Outsource-it-forever*, with F-02 and D-01 open, facing each other. |
| **R1 · medium.** No reason to trust: a first name only, an unstated founding year, a deflating pod line, and the notes reduced to one link. | **Adopted.** The signature links to /about, with *Founded 2026 — deliberately late to the category* beneath it. The three dated notes are in the P.S. The pod line is off (D11). A background line is D11. |
| **R1 · medium.** The diagnosis is circular. | **Adopted.** The system tail reads *If we're not the fix, the audit says so*. The CTA sheet reads *If not, the plan is still yours*. Fit has *the honest list of who we send away*. |
| **R2 · medium.** The hero and reframe both end in a band + toggle. | **Adopted.** D12. |
| **R2 · medium.** The fit sticky column can't hold the 88px statement, and the closing row is dead. | **Adopted.** No statement. The dead row becomes the CTA label. |
| **R2 · medium.** The CTA sheet out-shouts the button, and the button arrives last. | **Adopted, minus one option.** The doors arrive with the head. The sheet is 280px and bottom-aligned, with no affordance. **Not adopted:** R2's optional dashed → solid on the sheet, because R1's motion budget reserves that gesture for the handover. |
| **Lows** (R1: compound count, readout order, hero naming, chip, /methodology 404; R2: footer keyframe, the FAQ sidestep, ScrollTrigger, the naming overclaim) | **All adopted:** compound ×2; "readout" first appears in the method's Diagnose row; D10; D7; `/#methodology`; `translateY(86%)` plus a side-by-side crop review; `faq/S` on /audit. ScrollTrigger is kept because it is founder-approved and already a live dependency, and §6.1 is amended for one section. "Named identically" is softened to "one count of three": the reframe keeps *Narrative architecture* as its diagnostic name, and every other place uses the nav names. |

---

## 9 · Build rules for round 3 (slot S)

1. **Files and selectors:**
   - Write `R/site/frag/<id>/S.{html,css,js,meta.json}`.
   - Selectors begin `.km-<id>-S`, and keyframes are named `km-<id>-S-…`.
   - Build with `node tool/mk.mjs <id> S`. Assemble with `python3 tool/home.py`, which reads `story-order.json`.
   - The new ids are `letter`, `system` and `handover`. `faq/S` is built for review only and is not in the order.
   - Kept sections (`hero`, `reframe`, `principle`, `footer`) are **ports of X**: copy the files, rename the prefix,
     and apply only the edits listed in §3.
   - Never edit X files.
2. **Archetype lock:** each section uses the archetype in §0, and no other. **Only `reframe` may use `.ac-plate` +
   `.ac-capband` + `.ac-seg`.**
3. **Heads:**
   - The standard `.ac-head` appears in **reframe, evidence and handover only**.
   - The system's statement lives inside the pin. The method's statement is one line on its track. Fit has none.
   - The hero, letter, principle and CTA each speak in their own form.
   - **Label-row meta** carries no act markers and no `FIG. 0n`. It is empty except for the letter's `Memo K-000`.
4. **Motion:**
   - Orchestrated moments are allowed only where §6 lists one. The letter, fit and footer are still (reveal only).
   - **The only pin is `system`:** ScrollTrigger, scoped to its root, only under `html.km-home`, `end: "+=1600"`.
   - **Budgets:**
     - one counter (the system's);
     - one dashed → solid (the handover's);
     - one ambient loop besides the film (the method's packet, ≥ 8s per lap);
     - no count-ups anywhere.
   - Standalone mockups demo in ≤ 6s, **except `system`, which is a static five-frame contact sheet.**
   - Under reduced motion, the final state renders synchronously, with no loops and no timers.
5. **Red map:** each section has exactly the one red listed in §0, plus the label square and the rule (where the
   section has a rule).
6. **Rendered handoffs:** the ★ lines in §2 are load-bearing copy. Change one only by re-running the §2 read.
7. **Truth:**
   - Copy only from the sources named in each entry.
   - Add no new numbers, and no years that the live components don't carry.
   - The memo is used verbatim. The `needs founder sign-off` flags go in meta: letter (D1, D11), method and cta (D8).
   - No logos, testimonials or results. The pin's drawing is labelled `Specimen`.
8. **Mark policy:** unchanged. The mark appears only in the nav lockup and the footer's cropped mark. No figure may be
   built from nested corners or staircases.
9. **Mobile (≤ 760px):**
   - The pin turns off and its frames stack.
   - The evidence numerals sit in a 2×2 grid.
   - The letter's margin follows paragraph 2.
   - The handover split stacks.
   - The method becomes a swipe track inside its own container.
   - The fit column stops being sticky.
   - 16px gutters, and no horizontal page scroll.
