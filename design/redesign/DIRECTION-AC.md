# Direction A×C · Cinematic Drafting

> Round 2's single design language. Every round-2 mockup (slot **X**, and any **Y / Z** alternatives) follows it.
> **Precedence:** the founder's verbatim notes in `R/ROUND2-NOTES.md` come first. This file comes next, then
> `R/CONTRACT.md` (tokens, file rules, lint) and `R/BRAND-FAMILY.md` (type and colour). `R/DIRECTIONS.md` is now
> background reading. Where it contradicts this file, this file wins.
> **Shared components:** `R/site/kit-ac.css` is inlined into every build. Use its `.ac-*` classes. Do not rebuild
> them per section, and do not restyle them except for placement.

---

## 1 · Name and thesis

**Cinematic Drafting: graphite cinema, drawn to scale.**

Kelwin reads like a film shot inside an engineering office. A provides the restraint: graphite, paper and one red,
two-voice wide statements, generous empty space, and a head grammar that always echoes the hero. C provides the
precision: every argument is proved by one exact 1px technical drawing (isometric planes, signal traces,
dimension lines, registration marks and a small title block) and is never wallpapered with cells, coordinates or
mono text. B brings calm in three named places: ledgers that open in place, the architecture loop with its
"How it closes" rows, and the quiet final call. The logo mark stops being an illustration device. In its place, Kelwin
gets its own vocabulary of eight drawn primitives that *morph*: scatter resolves into order, noise settles into a
signal, planes stack and loops close. Each section shows one drawing and one orchestrated moment, and can be read
in one obvious direction.

---

## 2 · What comes from where

### From A · Cinematic Figures (the spine of the blend)
- **The hero** (FIG. 01 · The room), reworked to the founder's layout (§3.4).
- **The head grammar** on every section: red-square caps label → two-voice wide statement → 48×2 red rule → lede →
  optional quiet note (§3.3). Section heads always echo the hero.
- **Two-voice statements:** sentence case, Mona Sans wide 430, with the final phrase in light 300 `--fg-2`. Exactly one
  accent per statement. C's UPPERCASE titles are retired.
- **Space:** ≥ 40% of every section is empty, the 12-column grid is honoured, and each act has ≤ 4 supporting items.
- **The FIG. plate:** a flat `--panel` block with the caption band inside its bottom edge (mono `FIG. 0n · Title`
  at left, a Plurel segmented control at right). This is the default home for a drawing.
- **Strips, not cards:** 2–4 equal columns divided by full-height 1px verticals, with the index at the top and body
  anchored at the bottom.
- **Actions:** a red filled rectangle in tracked caps with a drawn ↗, and an underlined tracked-caps secondary
  with a drawn →. On red surfaces the primary inverts (paper fill, red text).
- **Named compositions kept from A:** the hanging-plate mega menu, the reframe, the evidence 2×2, the method's
  minimalism, the handover kit, the before/after two plates, the FAQ, the full-red final CTA, and the footer
  (with the founder's fixes in §5.3).

### From C · Systems Drawing Set (precision, under quota)
C contributes **how things are drawn**, not how much is drawn.
- **1px technical drawing:** true isometric (30°) or orthographic plan and elevation. Strokes are 1px with
  `vector-effect: non-scaling-stroke` and no fills, except occlusion (`--ac-occlude`) and the one red face.
- **Annotation:** lettered or coded callouts on straight leaders, dimension lines with end ticks and a value, and
  registration marks (+) at frame corners.
- **Title-block discipline:** each drawing gets one small title block (≤ 4 cells: `FIG. 0n` · title · state ·
  `Specimen`).
- **Drafting-order motion:** construction lines, then outlines, then dimensions, then the red element settles.
- **Named compositions kept from C:** the stack's "drawing left, detail right" split; the principle's signal/noise
  sheet; the method's phase-gantt animation; the light drafting touches in the hero.

**C quotas (hard limits, enforced in review):**

| Rule | Limit |
|---|---|
| Drawings per section | **1** (the nav's three capability glyphs count as one set) |
| Callouts visible at once, per drawing | **≤ 5**. For an inventory of 6+, tag each item in place (01–06), not with leaders |
| Dimension lines per drawing | **≤ 2** |
| Registration marks per section | **≤ 6** (four frame corners + ≤ 2 chosen points), never a crosshair at every intersection |
| Title blocks per section | **≤ 1**, **≤ 4 cells** |
| Annotation words per drawing | **≤ 25** (callout labels ≤ 4 words each) |
| Mono text | **One line only, ≤ 40 characters, never a sentence.** No mono paragraphs, no mono body, no mono spec values |
| Annotation size | callout labels **Mona 14px** (`--ac-anno`); mono codes and dimension values **≥ 12px**; indices **≥ 11px** |
| Mono tracking | 12px ≤ .12em · 11px ≤ .10em · annotation codes .06em (wide tracking destroys small mono) |
| Frame | a drawing sits in a **plate OR a registration frame, never both**. No page-long margin verticals, no cell borders as wallpaper |
| Construction grid | dashed 1px `--line`, inside the drawing field only, and optional |

**Retired from C:** uppercase display, the cell nav, cell buttons, `SHEET 04/14`, `REV C`, cell IDs (`C9·R1`),
X/Y coordinate readouts (the hero may keep one timecode), the 48px bottom band of cells, the "KELWIN/GTM" title
cell with the mark, spec tables in mono, and full-height frame verticals.

**Reading path (the founder's main complaint about C).** Every section has one obvious way in and one way through:
label → statement → lede → **figure, starting at its `01` / left / top** → supporting list (`01` first) → action.
The first element of any sequence carries index `01`, and the entrance motion *starts there and travels the reading
path*, so motion teaches the order. There is one control per section (a segmented control **or** a ledger), and
its active state is visible in the final render.

### From B · Quiet Ledger (only where the founder named it)
- **Ledgers that open in place:** fit (the founder's pick), the stack's detail column, the architecture's "How it
  closes", and the FAQ. Rows are separated by 1px `--line`, with a mono index, a Mona 500 title at 24px (normal
  width, for readability), a descriptor, and a drawn `+` that rotates to `−`. Exactly one row is open by default.
- **The architecture chart:** B's orthogonal loop (Narrative → Channels → Intelligence → back), with big light
  numerals at the nodes, a dashed "reroute effort" path, and the red return path, set inside A's clean plate.
- **The final CTA's calm:** one statement, two doors and a three-row terms ledger, with nothing else.
- **Not taken from B:** the index spine, the 64px spine numerals, the daylight film, or the paper-led surface rhythm.

---

## 3 · Type and layout

### 3.1 Type (Plurel's live system, see BRAND-FAMILY.md; px at the 1440 stage)
| Role | Spec | Kit |
|---|---|---|
| Hero statement | Mona wide 110%, 430, **116px**, lh .96, `--display-tracking`, **two lines** | `.ac-statement--hero` |
| Section statement | same face, **88px** (max 96), lh .98, two lines, ≤ 24 characters per line | `.ac-statement` |
| Manifesto statement (principle, CTA) | same face, **112px**, 2–4 lines | `.ac-statement--xl` |
| Accent phrase | weight 300, `--fg-2`, never italic, **exactly one per statement** | `.ac-accent` |
| H3 (strip or ledger-group heads, "Built for") | Mona wide 430, 32px (42px when it heads a list) | `.ac-h3`, `.ac-h3--lg` |
| H4 (ledger row titles) | Mona 500, normal width, 24px / 1.25 | `.ac-h4` |
| Big numeral | Mona wide 430, 176px (120px in 3-col cells), tabular, −.04em; unit in 300 | `.ac-num`, `.ac-num__u` |
| Lede | Mona 400, 20px / 1.5, `--fg-2`, ≤ 46ch, ≤ 3 lines | `.ac-lede` |
| Body / support | 17px / 1.55 and 15px / 1.55, `--fg-2` | `.ac-body`, `.ac-support` |
| Caps label | Mona 500, 11px, `--label-tracking` (.18em), uppercase, `--fg-2`, 8px `--signal` square | `.ac-label` |
| Mono caption / FIG. / meta | JetBrains Mono 12px caps, .12em, `--fg-3` | `.ac-cap`, `.ac-meta` |
| Index | mono 11px, .10em, `--fg-3`, tabular | `.ac-idx` |
| Callout label / code | Mona 14px `--fg-2` / mono 12px in a 22px box | `.ac-callout__t`, `.ac-callout__code` |
| Buttons / nav / controls | Mona 500, 12–13px, tracked caps | `.ac-btn`, `.ac-btn-o`, `.ac-link`, `.ac-seg` |

Floors: nothing under 11px anywhere (the round-2 lint fails it). Statements never go below 64px and are never bold.

### 3.2 Grid and rhythm
- The stage is 1440px, with `--margin` 64, `--gutter` 24 and 12 columns. Lay out with `.ac-wrap` + `.ac-grid`, placing
  children with `.ac-col` and `style="--c:<start>; --s:<span>"`.
- Section padding is `--ac-pad-y` (128px) top and bottom, or 160px (`.ac-sec--lg`) for principle and CTA. When two
  graphite sections meet, a margin-to-margin hairline (`.ac-sec--ruled`) marks the cut. Surface changes are hard cuts.
- The figure sits 64–96px below the head. A FIG. plate is 440–520px tall with a 56px caption band inside it.
- Density stays medium-low: ≤ 4 strips or ≤ 6 ledger rows, ≤ 25 words per item, ≤ 120 visible words of body copy
  per section, and ≥ 40% empty.

### 3.3 The head grammar (every section; `.ac-head`)
```html
<div class="ac-head ac-wrap">                                   <!-- 12-col grid -->
  <div class="ac-labelrow"><p class="ac-label">The reframe</p><p class="ac-meta">Fig. 02</p></div>
  <h2 class="ac-statement">
    <span class="ac-line"><span>Most teams are fixing</span></span>
    <span class="ac-line ac-accent"><span>the wrong layer.</span></span>
  </h2>
  <span class="ac-rule" aria-hidden="true"></span>
  <p class="ac-lede">Most firms diagnose the surface …</p>
  <div class="ac-doors"><a class="ac-link" href="/methodology">See the diagnostic method</a></div>   <!-- optional -->
  <aside class="ac-note"><p class="ac-label">Built to compound</p><p class="ac-note__t">Services end. Architecture compounds.</p></aside> <!-- optional -->
</div>
```
Placement defaults: the label row spans 1–12 (`FIG. 0n` sits at the right); the statement spans cols 1–11 and sits
36px below the label; the rule sits 36px below the statement; the lede spans cols 1–6, 28px below the rule; the
doors sit 36px below the lede; the note spans cols 10–12, bottom-aligned with the lede and doors. The order is
always label → statement → rule → lede → note.

### 3.4 The hero (founder's layout, two lines)
- The nav is 96px over the film (§5.3 nav row). The film is the A dark warm frost, `--film-blur` 10–12px,
  silhouettes clearly people.
- **Headline in TWO lines:** `Revenue is an` / `architectural <accent>problem.</accent>` at 116px, left-aligned at
  col 1. It is **vertically centred** in the space between the nav hairline and the band hairline (optically about
  46% down). The `■ GTM systems partner` label sits 36px above it and the red rule 40px below it.
- **Bottom-right (cols 8–12),** bottom-aligned 48px above the band: the lede (18–20px, ≤ 3 lines), then the door pair
  (red "Request a System Audit ↗" + "Talk to the team →").
- **Bottom-left (cols 1–4):** the quiet note `■ A fixed-scope diagnostic` · "Ten working days. Clear findings.
  Actionable recommendations."
- **Band (88px):** `FIG. 01 · The room where pipeline is decided` on the left; the Close | Wide segmented control
  and Pause film on the right.
- **A little C (≤ 3 touches):** ① registration marks at the four corners of the content frame (nav hairline × margins,
  band hairline × margins); ② the film-progress hairline becomes a calibrated tick ruler (MEASURE) in the band;
  ③ one mono film timecode beside Pause film. Do **not** add column verticals, reticles or tracking boxes over the people.
- **Kelwin, not Plurel:** Plurel places its lede and CTA top-right beside the headline. Kelwin places them
  bottom-right, so the eye reads diagonally from the statement at mid-left down to the action at bottom-right. Keep
  that diagonal.

---

## 4 · The mark policy

1. The nested-corner logo symbol is **retired as illustration.** It appears in exactly three places:
   - the **nav lockup** (`.km-logo`, 24px);
   - the **footer lockup** (small);
   - the footer's **large mark, cropped by the bottom edge**: about 50% of its height visible, one flat tone
     (`--fg` or `--fg-3`), **no red piece**, and no animation beyond a single slow rise on entrance.
2. **No figure may be built from** nested L-corners, stepped or staircase corners, an L-chevron in isometric, nested
   squares, or a "core square" seated in a corner. This bans A's K1–K3 plates, C's iso L-slabs, the mark as a FAQ
   toggle or plate badge, the mark in title blocks, and staircases of right angles.
3. Squares remain legitimate **as typographic punctuation and nodes**: the 8px label square, 7px trace nodes, 3–8px
   field points. They must never be composed into a corner or a nested set.
4. The lint fails any `.km-logo-mark` outside the footer. Review also fails mark *geometry* drawn by hand.

---

## 5 · Shape and motion vocabulary (replaces the mark)

Eight proprietary primitives. Each has one form and one signature **morph**. They are all drawn with 1px strokes
in tokens, with at most one red element. Mix them only as "lead + one quiet supporting touch"; never stack two leads
in a section.

### 5.1 The primitives
| # | Primitive | Form (draw it like this) | Morph / motion (its one signature move) | Never |
|---|---|---|---|---|
| P1 | **TRACE** · signal lines | Orthogonal 1px routes (90° turns only), 7px square nodes (outlined, `--ac-occlude` fill), ≤ 1 open chevron per segment, dashed (2 4) = indirect. ≤ 6 nodes | **Draws along its path** segment by segment (pathLength 1, 900–1400ms `--ease-inout`); each node **latches** (outline → filled, 200ms) as the line reaches it; then **one 6px packet** travels at constant speed (≥ 6s per lap, linear). Variant morph: a knotted route **untangles** into the orthogonal route (same vertex count) | diagonal spaghetti, more than one packet, glow |
| P2 | **STRATA** · isometric slabs | Thin **rectangular** slabs in true iso (30°), 8–16px thick, 40–72px apart when exploded, hidden edges occluded. Each slab carries **one top-face inscription** that names its job: text rules (narrative), a point grid (data), a mini trace (orchestration), a ring (intelligence) | **Planes stack:** slabs drop in one at a time (−24px → 0 + fade, 700ms, 140ms stagger), then the stack **compresses** from exploded to assembled spacing (600ms) while a dimension line re-measures. Selection moves the single red top face (400ms crossfade) and lifts that slab 8px | L-shaped or stepped slabs, hatching, shading, perspective |
| P3 | **FIELD** · point cloud | 60–240 points (6px squares up to 100 points, 3px above), seeded positions. States: scatter, lattice (10×10), column, ring | **Scatter resolves into order:** each point interpolates from its seeded random position to its lattice target (1200–1600ms `--ease-inout`, stagger by distance 0–400ms). Re-morphs between states in 900ms. Highlighted subset in `--fg`; at most one subset red | dot-matrix numerals (forming digits from dots is banned), endless drifting particles |
| P4 | **ORBIT** · rings and arcs | Concentric 1px circles on one centre, on a modular radius step; arcs for portions; an open ring has a gap; one node may ride a ring | **Loops close and rings accrete:** an arc sweeps (dashoffset, 1200ms), a gap closes (40° → 0°), new rings draw outward one by one (600ms, 160ms stagger) and stay. Ambient optional: one node orbiting ≥ 12s per lap | radar sweeps, polar polygons, tick bezels that read as a dial or reticle |
| P5 | **MEASURE** · bars and ticks | Calibrated rulers (4px minor, 8px major ticks every 5th), horizontal bars 8–12px high, a baseline axis with 12px mono values at major ticks | **Calibrates then fills:** ticks draw left → right (20ms stagger), bars extend from their origin (scaleX, 700ms, in sequence), values count to final (1000ms, tabular). Variant morph: irregular tick spacing settles into regular spacing | pies or donuts, 3D bars, gridlines everywhere |
| P6 | **CONTOUR** · waveform and contour lines | 1–12 open 1px curves stacked at fixed spacing, smooth cubic paths, never filled | **Noise settles into signal:** amplitude decays and frequency settles from left to right as if through a filter (1600–2000ms, JS sample interpolation). Ambient optional: a slow phase drift on the clean line only (≥ 10s) | equaliser bars, oscilloscope glow |
| P7 | **LATTICE** · the resolving grid | A 1px mesh 8–16 cells wide, in plan or as one iso plane. The warped state has displaced vertices and a few missing cells; the true state is orthogonal | **Warp resolves to true:** vertices interpolate to the grid (1400ms `--ease-inout`), then a single datum line or cell group seats (draws 400ms) | Tron floors, vanishing-point perspective |
| P8 | **FOLIO** · sheets | Flat 1px document rectangles (1:1.414), each with 3–6 text rules and a mono tag. Dashed edge = draft or ours; solid edge = yours | **Deal and collate:** sheets deal out from a stack into a row (translate, 600ms, 100ms stagger), then cross a handover datum one by one. Each sheet's edge turns from dashed to solid as it crosses, and the sheets collate into a tray | page curl, skeuomorphic paper, shadows |

**Capability glyphs:** the same mapping is used everywhere (nav, interior headers, footer sitemap if used). Each
glyph is a 96×64 1px drawing of its primitive in miniature:
- **Narrative Systems = CONTOUR:** five jittery lines on the left converge into one clean line ("what the market hears,
  made deliberate").
- **GTM Infrastructure = TRACE:** an orthogonal route with 3 nodes and one packet ("the machine that carries it").
- **GTM Intelligence = ORBIT:** an open ring closing, with a node riding it ("the loop that makes it compound").

Interior pages that are not capabilities take: The Firm = LATTICE · Who we work with = TRACE (fork) ·
Methodology = MEASURE · Insights and Reports = FOLIO · The Lab = FIELD.

### 5.2 Assignment table (lead device per section, in page order)
No two adjacent sections share a lead. A primitive leads at most twice on the home page, and each reuse is a
different variant. Two sections are deliberately drawing-free (before/after, FAQ) so the page breathes.

| # | Section | Base pick | Surface | **Lead device** (variant) | The one orchestrated moment | The one red |
|---|---|---|---|---|---|---|
| 01 | nav | A hanging plate × C capability sheet | graphite over film | **Capability glyphs** (CONTOUR · TRACE · ORBIT, mini) | the open column's glyph draws itself (600ms) | "Request a System Audit ↗" |
| 02 | hero | A · FIG. 01 The room (+ a little C) | graphite + film | **FILM** + registration marks; band ruler (MEASURE-lite) | statement lines rise; marks register; ruler ticks in | primary button |
| 03 | reframe | A · Surface, then architecture | graphite | **LATTICE** (section cut: warped surface over true grid) | Surface → Architecture: mesh **resolves**, datum seats on the real layer | the datum line |
| 04 | evidence | A · Four into one (new centre figure) | paper | **FIELD** (100-point unit field) | scatter → 10×10 lattice, then highlights 17 → 95:5 → 77 → 53 in step with the numeral cells | the 17-point subset |
| 05 | stack | C · Stepped assembly (blended A + B + C) | graphite | **STRATA** (four rectangular slabs with inscriptions) | slabs **stack and compress**; red face moves with the ledger selection | selected slab's top face |
| 06 | architecture | A · clean plate + B chart + "How it closes" + C callouts | graphite (`--ruled`) | **TRACE** (closed orthogonal loop) | the loop **draws** node by node, nodes latch, the packet laps, the return path closes it last | return path (Intelligence → Narrative) |
| 07 | statechange | A × C | graphite (`--ruled`) | **ORBIT** (accretion rings) + Δ numeral | Q1–Q3 a ring draws and **collapses** (reset); from Q4 rings **accrete** outward and stay | the Q4 "installed" ring |
| 08 | principle | C · Signal / noise sheet | paper | **CONTOUR** (noise in, one signal out) | the noise bundle **settles** into one clean line that exits to the red tick | the output tick at the frame edge |
| 09 | method | A · Phase climb × C gantt | graphite | **MEASURE** (phase gantt under four phase columns) | ruler **calibrates**, bars extend phase by phase, the active column steps 01 → 04 | the continuous Calibrate bar |
| 10 | fit | B · Two ledgers, one gate (+ C) | paper | **TRACE** (fork variant: one line, one gate, two branches) | the line draws to the gate, **forks** to "Built for" and "Not for", and rows reveal | the CTA button |
| 11 | assets | A · Handover kit (+ C) | graphite | **FOLIO** (six sheets across a handover datum) | Installed → Handed over: sheets **deal across** the datum, edges go solid, collate into "Yours" | the handover datum tick |
| 12 | beforeafter | A · Two-plate operating state | paper | **Type: switch plate** (Before \| After), no drawing | rows switch in place (text crossfade + rule redraw, 60ms stagger) | none (paper and ink only) |
| 13 | faq | A · The core, answered | graphite | **Type: ledger** (opens in place), no drawing | the open row expands (360ms) | the primary button |
| 14 | cta | A · Installed × B calm | **red** | **MEASURE** (ten-tick ruler = ten working days) | the statement lands, then ten ticks draw (40ms stagger) and the terms ledger settles | the red plane itself (accents invert to paper) |
| 15 | footer | A · The mark, installed (no red) | graphite | **The cropped mark** (lockup policy, §4) | the mark rises once into its crop | none |
| — | interior | new "Specimen sheet" (§5.3) | graphite | **The page's primitive**, large (Narrative = CONTOUR) | the specimen morphs on load (e.g. noise → signal) | primary button or the specimen's one red line, never both |

### 5.3 Section briefs (founder fix list, in short)
- **nav:** A's resting bar (lockup, tracked caps items, outlined `AUDIT REQUEST ↗`, hairline). The mega menu hangs
  from the hairline as a `--panel` plate. It has three capability columns (cols 1–4 / 5–8 / 9–12, vertical
  hairlines). Each column holds its glyph, `CAP. 01`, a 28–32px wide title, a one-line descriptor and four service
  rows. A bottom band holds a small title block, the audit note and the red audit button. No mark glyphs.
- **hero:** §3.4.
- **reframe:** keep A's head and strips; FIG. 02 becomes a LATTICE section cut. Surface state: a warped mesh with the
  three symptom tags (Pipeline · Sales execution · Tooling). Architecture state: the true grid with three labelled
  levels (Narrative architecture · Orchestration · GTM intelligence) and the red datum on the real layer. Segmented
  control Surface | Architecture.
- **evidence:** keep A exactly (2×2 numerals, sources, caption band) and replace only the centre figure with the
  FIELD. The active numeral cell gets a 1px top rule in `--fg` as the field shows its share.
- **stack:** head (A) on top. Drawing left (cols 1–7) with four STRATA slabs: L1 Narrative, L2 Data, L3
  Orchestration, L4 Intelligence, as ≤ 4 callouts in Mona 14px plus 1 dimension line. Detail right (cols 9–12) is
  B's four-row ledger, the open row showing *What it is / In practice*. Drop C's tab stack, spec cells and CTA cell.
- **architecture:** A's plate spanning cols 1–12. B's loop goes in cols 1–8: nodes 01 Narrative / 02 Channels /
  03 Intelligence, market signal in at left, compounding pipeline out at right, dashed reroute, red return path. B's
  "How it closes" ledger (Define · Activate · Measure · Retune) goes in cols 9–12. C lettered callouts A–D key the
  ledger rows to loop segments. The selected row brightens its segment to `--fg`.
- **statechange:** "Stop resetting. / Start compounding." plus a Δ numeral (wide 430 + light). FIG. 06 is ORBIT
  accretion with Q labels on one radius line and one dimension line "carried forward". Control: Entropy | System.
  No staircase.
- **principle:** C's composition on paper: a framed sheet with four registration marks, the statement in sentence-case
  two voices (2–4 lines, 88–112px) between a CONTOUR noise bundle (`A · Input`) and the clean output line
  (`B · Output`) ending in the red tick. Support line: "Not the loudest. Not the busiest." No bottom cell band.
- **method:** four phase columns (01 Diagnose · 02 Architect · 03 Install · 04 Calibrate). Each has an index, a
  32px name, one sentence (≤ 22 words) and an Output line. The gantt aligns to the same four columns under one tick
  ruler, so the columns *are* the tabs. Read left → right. No spec column and no duplicate tab row.
- **fit:** head (A). The TRACE fork enters at the left and passes a gate node (`The audit`). It branches to
  **"Built for"** and **"Not for"**, both set as `.ac-h3--lg` (42px) with `+` / `−` mono marks and counts, so they
  are readable at a glance. Two B ledgers (3 rows each, one open each) with mono IDs `F-01` / `D-01`. Closing row:
  "Sound like you?" + red primary + secondary.
- **assets:** A's head and strip list (6 assets grouped under the 3 capabilities). FIG. 10 is FOLIO: six tagged
  sheets (01–06) cross a vertical handover datum. Control: Installed | Handed over. No nested-corner parts tray.
- **beforeafter:** A as picked. Remove the mark from the After plate. Row labels ≥ 11px mono.
- **faq:** A as picked. The mark toggles become `.ac-toggle` (+ / −). One row open.
- **cta:** A's red plane with B's calm. "Initiate the / System Audit." (112px). **Separate the two things:**
  ① the primary paper button + secondary link sit under the lede in the head grammar's door position, on their own;
  ② the "10 working days" block becomes its own quiet column (cols 9–12): the ten-tick MEASURE ruler with
  "10 working days" in 32px wide type, then a three-row terms ledger (Fixed scope · Ten working days · The readout is
  yours). Hierarchy: statement > button > terms.
- **footer:** A's mono-headed sitemap columns and location/time, with the large mark cropped at ≈ 50% by the bottom
  edge (§4). The legal row sits above the crop. No red, and no FIG. caption.
- **interior ("Specimen sheet", from scratch; must not resemble the hero):** graphite, **no film**, solid nav.
  ① A breadcrumb row (mono `Capabilities / 01`) with the label. ② A top-aligned two-voice statement (96px, cols 1–10),
  rule, lede (cols 1–6), and a note (cols 10–12) as a 3-row facts ledger: *Engagement · Output · Starts with*.
  ③ A full-width **specimen band** (cols 1–12, 280–340px, registration frame, no plate): the page's primitive drawn
  large, ≤ 4 callouts keyed to its services, ≤ 1 dimension, and a title block at bottom-right. ④ The first body beat
  (overview + service strips). Y/Z alternatives may move the specimen beside the title or set the header on paper, but
  never use the film or a bottom-left title over a full-bleed backdrop.

---

## 6 · Motion, surfaces and red

### 6.1 Motion rules
| Kind | Duration | Easing |
|---|---|---|
| Hover (colour, arrow nudge 2–3px) | 200–250ms | `--ease-out` |
| UI state (segmented control, ledger open) | 360–600ms | `--ease-inout` |
| Entrance pieces (fade, rise 12px, line rise from mask) | 300–800ms | `--ease-out` |
| Drawing plot (construction → outline → dimensions) | 900–2400ms total | `--ease-inout` |
| **Morph** (the primitive's signature move) | 900–2000ms | `--ease-inout` |
| Packets, film | constant | linear |
No bounce, overshoot, spring, parallax or 3D camera moves.

**Choreography per section.** The kit runs the head automatically under `html.is-play`:
- label 0ms;
- statement line 1 +80ms, line 2 +280ms;
- rule +520ms;
- lede +600ms;
- doors and note +700ms;
- shift the whole head with `--ac-d0`.

The section's **one orchestrated moment** follows: the drawing plots from 600–900ms and its morph lands by ≈ 3.2s.
Supporting rows then cascade with an 80ms stagger. Everything else stays quiet: fades only, with no second morph
and no competing loop.

**Demo.** The default CSS is the final state. Entrances run only under `html.is-play`. A scroll or state sequence
is demoed automatically within ≤ 6s, and a state switch runs once at ≈ 2.4s. Describe the live behaviour in
`meta.motion`.

**Live site.**
- Each figure plays once when 40% visible (IntersectionObserver). Do not use pins.
- Stepped sequences (stack layers, method phases, evidence readings) auto-step every 1.2–1.6s while in view and
  stop for good on the first user interaction.
- At most **one ambient loop per section** (TRACE packet, ORBIT node or CONTOUR phase drift), with a cycle of ≥ 8s.
  The film is the only other ambient motion on the page.

**Reduced motion.** There is no `.is-play`, so the page shows the final state. `KM.init(root, {reduced:true})` must
render the final drawing synchronously, start no loops and use no timers.

**Implementation.**
- Use `pathLength="1"` + `.ac-plot` for line drawing.
- Use a seeded PRNG (e.g. mulberry32) for every scatter, so renders are repeatable.
- Morph SVG paths only between equal command counts. Otherwise interpolate sample arrays in JS (rAF).
- Prefer SVG (≤ 300 nodes). Canvas is allowed for FIELD, using `devicePixelRatio`.
- Keyframes are named `km-<sec>-X-…`. The kit's keyframes are `ac-…`.

### 6.2 Surface rhythm (home page)
`nav G · hero G+film · reframe G · evidence P · stack G · architecture G · statechange G · principle P · method G ·
fit P · assets G · beforeafter P · faq G · cta R · footer G` (interior G).
That is graphite ≈ 65%, paper ≈ 28% and red ≈ 7%: one full-red plane, the CTA. Never run more than three graphite
sections in a row, and mark graphite→graphite cuts with `.ac-sec--ruled`. The second half alternates
P/G/P/G/P/G as deliberate pacing. Paper sections use ink lines and `--panel` plates.

### 6.3 Red discipline
- **Always allowed (family punctuation):** the 8px label square and the 48×2 rule.
- **Beyond those, one red moment per section:** either the primary button **or** the drawing's single red element
  (the table in §5.2 names it). If a section has a primary button, its drawing uses `--fg` for selection.
- The **red plane** appears exactly once (the CTA). On it, the accents invert: paper button with red text, paper
  label squares, paper and `--line` drawing strokes.
- Red never decorates, never fills large areas inside figures, and is never used for text except on the CTA plane's
  button.
- Use small red on graphite via `--signal` (lines, ticks, squares) and red fills via `--accent`.

---

## 7 · Kit reference (`site/kit-ac.css`)
| Need | Classes |
|---|---|
| Section and grid | `.ac-sec` `.ac-sec--lg` `.ac-sec--ruled` · `.ac-wrap` `.ac-grid` `.ac-col` (`--c`, `--s`) |
| Head grammar | `.ac-head` › `.ac-labelrow` `.ac-label` `.ac-meta` · `.ac-statement` (`--hero`, `--xl`) › `.ac-line` › `span` · `.ac-accent` · `.ac-rule` · `.ac-lede` · `.ac-doors` · `.ac-note` › `.ac-note__t` |
| Type | `.ac-h3` (`--lg`) `.ac-h4` `.ac-body` `.ac-support` `.ac-idx` `.ac-cap` `.ac-num` › `.ac-num__u` `.ac-chip` `.ac-sr` |
| Actions | `.ac-btn` (primary, drawn ↗) · `.ac-btn-o` (outlined nav action ↗) · `.ac-link` (underlined →; `.ac-link--ne` for ↗) |
| Controls | `.ac-seg` › `button[aria-selected|aria-pressed]` · `.ac-toggle` (+ → −) |
| Lists | `.ac-strips` (`--n`) › `.ac-strip` › `.ac-strip__foot` · `.ac-ledger` › `.ac-row` (`.is-open`) › `.ac-row__head` + `.ac-row__more` › `.ac-row__in` · `.ac-spec` (dl) |
| Figure | `.ac-plate` (`--bare`) › `.ac-field` (`--h`) + `.ac-capband` (`--ruled`) › `.ac-cap` + `.ac-seg` · `.ac-tblock` · `.ac-reg` (`--tl --tr --bl --br`, or `--x`/`--y`) · `.ac-frame` |
| Annotation (HTML) | `.ac-callout` (`--x --y --len`; `--l` for label-left) › `.ac-callout__code` + `.ac-callout__t` · `.ac-dim` (`--x --y --w`) / `.ac-dim--v` (`--h`) › `.ac-dim__v` |
| Drawing (SVG) | `.ac-svg` · strokes `.ac-s` `.ac-s-fg` `.ac-s-mute` `.ac-s-faint` `.ac-s-dash` `.ac-s-red` · fills `.ac-f-occ` `.ac-f-fg` `.ac-f-red` · `.ac-node` (`.is-on`) · text `.ac-t-code` `.ac-t-label` (+ `.ac-t-fg` `.ac-t-mid` `.ac-t-end` `.ac-t-knock`) · `.ac-glyph` |
| Motion | `.ac-plot` (`--d`, `--t`) · `.ac-in` · `.ac-up` · `.ac-drop` · `.ac-cascade` › `*` (`--i`) · `.ac-cold` · `--ac-d0` on `.ac-head` |

## 8 · Hand-in checklist
1. The head grammar is intact and the statement has exactly two lines (principle and CTA may run longer), with one
   light accent.
2. The section has one drawing and it uses its assigned primitive. Callouts ≤ 5, dimension lines ≤ 2, ≤ 25
   annotation words, one title block, and no mono sentences.
3. No mark geometry anywhere (footer excepted), and no nested corners, staircases or core squares.
4. One red moment, matching §5.2. Label square and rule are present.
5. There is one obvious reading path with a visible `01` start, and the motion travels it. There is one control.
6. Floors are met: body 17 / support 15 / annotation 14 Mona / mono 12 / index 11, and nothing is under 11px. The
   build passes in both skins.
7. The default CSS is the final state, reduced motion is correct, and the demo is ≤ 6s.
8. Read your own PNGs: the C precision is visible, but the page breathes with ≥ 40% empty space.
