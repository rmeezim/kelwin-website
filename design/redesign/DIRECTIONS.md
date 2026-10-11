# Kelwin redesign: three directions

Kelwin is rebuilt from zero as the proprietary, "almost Palantir" site of a serious systems company. It uses no photography except one frosted hero film, flat colour on a 12-column grid, and the Cinematic Red × Swiss Systems skin: Mona Sans wide for display, Mona Sans light for accents, JetBrains Mono for labels, on graphite, paper and ink with Plurel red. Each direction is a complete visual grammar for all 16 sections. **A** is the founder's own target (Plurel's architectural sibling) done at the highest level. **B** moves toward Legora-calm Swiss editorial. **C** moves toward Palantir-grade systems rigour.

Every section designer follows exactly one direction below. If something isn't covered here, choose whatever keeps the direction most recognisable at a glance.

---

> **Film calibration — applies to all three directions (founder's intent, set after this file was written):**
> the hero film must read as *translucent silhouettes* — heads and shoulders recognisable behind frosted glass, never
> abstract blobs. Keep `--film-blur` between 8px and 12px (the base default is 10px with `--film-frost .30`); tint,
> frost colour and brightness may differ per direction as specified below. Always check the render: if you can't
> tell there are people, the frost is too heavy.

> **FOUNDER LAYOUT & TYPE SPEC (latest — overrides any layout/type numbers below that disagree):**
>
> **Layout: Kelwin's own, not Plurel's.** Kelwin must feel like the same brand family as Plurel yet be clearly
> distinct, so its LAYOUT follows the founder's original Kelwin design (`refs/user-kelwin-intent.webp`), while Plurel
> contributes type and colour only. Kelwin's layout DNA, from that design:
> - full-bleed frosted film behind the hero, with the content stacked down the left (≈ cols 1–7): a red-square caps
>   label → a big left-aligned headline whose final phrase is the light accent → a short red rule (≈48×2px) →
>   a ≤ 3-line lede → a CTA pair (red filled primary in tracked caps with ↗ + an underlined tracked-caps secondary
>   with →);
> - a quiet annotation block anchored bottom-right (red square + caps label + two short lines), e.g. "A FIXED-SCOPE
>   DIAGNOSTIC · Ten working days. Clear findings. Actionable recommendations.";
> - nav: lockup left, nav items in tracked uppercase (no dot separators), outlined "AUDIT REQUEST ↗" right;
> - section heads echo the hero: caps label with red square, left-aligned two-tone headline, the short red rule.
> Do NOT copy Plurel's layout moves: its split hero (headline left, lede + CTA in a right column), its full-width
> film band beneath the headline, dot-separated sentence-case nav, and sentence-case buttons. Those are Plurel's.
> (Family devices such as mono "FIG." captions may stay where a direction uses them.)
>
> **Type (Plurel's live system, shared by Kelwin):** Mona Sans for almost everything; JetBrains Mono in caps only
> for small Swiss labels (indexes, captions).
> - Headlines: wide 110% (`--display-stretch`), weight **430** (`--display-weight`), tracking **−0.018em**
>   (`--display-tracking`). Never bold.
> - Accent phrase: same font, weight **300** (`--light-weight`), picked out by colour, never italic — exactly one
>   per headline.
> - Hero & section titles: 88–152px at the 1440 stage (Plurel spans 5.5–9.5rem on wide screens); smaller headings
>   32–42px. Body: weight 400, mostly 15px and 17px (lede up to 20px), line-height 1.5–1.55, 34–68 characters/line.
> - Small labels above headings: weight 500, ALL CAPS, 11px, widely tracked (`--label-tracking` .18em).
>   Captions & mono labels: 10–14px (mostly 11–13px), tracked ≈ .18em.
> - UI elements (nav, buttons, controls): weight 500 (`--ui-weight`), a little 600.

> **LOGO CORRECTION (founder-supplied master, traced exactly — overrides anything below that disagrees):**
> the Kelwin mark has **THREE solid pieces**, not four thin nested corners. In its 152×152 box (`brand/kelwin-mark.svg`):
> **K1** outer corner = top bar (0,0,152×45) + right bar (108,0,44×152) · **K2** middle L = top bar (0,60,94×38) + right
> bar (55,60,39×92) · **K3** small square (0,114,42×38). Bars are heavy (~25–30% of the box); the two L-shaped channels
> are ~10% (15 units). Any figure "built from the mark" must use these proportions. Where a direction speaks of K1–K4
> or "the four-layer mark", use K1–K3 — they map naturally to the three capabilities (Narrative Systems, GTM
> Infrastructure, GTM Intelligence). If content genuinely has four items (e.g. the stack's layers), extend the nested
> sequence by one more step at the same proportions and do NOT label that drawing as the logo.
>
> **FILM UPDATE (founder, after reviewing a render):** the frost was "a little too blurry" — keep `--film-blur` between
> **8px and 12px** (base default 10px; the base stylesheet now caps it at 12px whatever you set) and keep the new
> frosted-glass grain that base.css adds (`--film-grain`, default .5). Silhouettes should be clearly people.

## Shared ground (all three directions)

**Grid and tokens.** The stage is 1440px, with 64px margins, 24px gutters and 12 columns (col ≈ 87.3px). Column *n* starts at `64 + (n−1)·111.33px`. Use semantic tokens only (`--bg --fg --fg-2 --fg-3 --line --line-2 --panel --panel-2 --accent --signal --soft --cool …`). Never hard-code hex values or font names. Corners are square. Flat colour only: no gradients, glow, shadows or blur, except inside `.km-film`, where legibility scrims are allowed.

**The hero film** (all three). The hero's background is the `.km-film` stand-in: a video that keeps playing behind heavy frosted glass, so viewers only see translucent silhouettes of people at work. Each direction tunes it differently (see its hero rules). It is the only photographic image on the site. Each direction gets at most one deliberate reprise of it, as defined below. No film stills anywhere else.

**The Kelwin mark is the shared source of the signature devices.** The mark is a 100-unit square of four nested elements, all anchored to the bottom-left corner with 6-unit gaps. Draw it from `site/brand/kelwin-mark.svg` geometry. Scale, explode, extrude or outline it, but never distort its proportions.

| Element | Geometry (viewBox 100) | Canonical meaning (use consistently) |
|---|---|---|
| K1 | heavy outer corner: top bar 100×30 + right bar 30×100 | Layer 1 · Narrative |
| K2 | thin corner: 64×12 + 12×64 | Layer 2 · Data |
| K3 | thin corner: 46×12 + 12×46 | Layer 3 · Orchestration |
| K4 | solid square 28×28 at bottom-left | Layer 4 · Intelligence (the core) |

Each direction uses the mark differently: **A** uses it as *solid flat plates*, **B** as *hairline structure* and **C** as a *1px isometric assembly*.

**Conversion, two doors, always.** The red primary leads to the System Audit (/audit). The quiet secondary leads to contact. The nav's "Audit request ↗" also leads to /audit.

**Honesty.** Illustrative data is labelled SPECIMEN. Nothing is fabricated: no client logos, testimonials or results. Evidence figures are 17% (Gartner), 95:5 (Ehrenberg-Bass), 77% (Gartner) and 53% (CEB · HBR). Method phases are Diagnose → Architect → Install → Calibrate.

**Legibility floors.** Body ≥ 15px. Support ≥ 13.5px. Meaningful mono ≥ 11px with tracking ≤ 0.06em, at ≥ `--fg-3`. Decorative stamps ≥ 10px. No italics, no serif.

**Banned (today's site, which the founder finds generic).** Corner brackets (tl/br), HUD panels and readout widgets, radar charts, dot-matrix numerals, terminal blocks with blinking cursors, sand/clay/patina accents, glowing lines, bracketed CTAs.

**Motion basics.** The default CSS is the final state. Entrances run only under `html.is-play`. Scroll behaviour is demoed as an automatic sequence of ≤ 6s. Use `--ease-out` for entrances and `--ease-inout` for state changes. Never bounce or overshoot.

---

## A · Cinematic Figures

> Plurel's architectural sibling: graphite cinema, two-voice wide headlines, and in every act one numbered FIG. plate built from the nested corners of the Kelwin mark.

**Thesis.** This is the founder's own target (`refs/user-kelwin-intent.webp` and `refs/user-plurel.webp`), executed to the standard of a defense prime's in-house brand team. The page plays like a film in acts. Each act opens with a red-square label and a two-voice statement (wide medium, then light), and is proved by one numbered **FIG.** plate. The hero's frosted film is FIG. 01. Every later figure is a flat graphic made only from the mark's nested right angles, with a Plurel-style segmented control that switches it between two states. It uses Plurel's ingredients (dot-separated nav, outlined "Audit request ↗", red ↗ CTA, FIG. captions, film controls), set harder: a sharper type scale, a stricter grid and fewer words.

### Type (px at 1440)
- **Statements** use Mona Sans wide 110%, sentence case, two voices.
  - **Hero H1:** 120px, line-height 0.94, tracking −0.035em, max 3 lines. The final clause ("problem.") is weight 300 in `--fg-2`, and every other word is weight 500 in `--fg`.
  - **Section H2:** 80px, 0.98, −0.03em, exactly 2 lines. Line 1 is weight 500 in `--fg`; line 2 is weight 300 in `--fg-2` ("Most teams are fixing / the wrong layer."). Edit copy to ≤ 22 characters per line.
  - **Figure/strip titles H3:** 28–32px, wide 500, 1.1.
- **Numerals:** wide 500, 176px, 0.9, tabular, −0.04em. The unit or sign (%, :, Δ) is weight 300 at the same size. In 6-column cells, use 176px max. In 3-column strips, use 120px max.
- **Lede:** Mona 400 (normal width), 20px/1.5, `--fg-2`, max 44ch. **Body:** 17px/1.6 `--fg-2`. **Support:** 15px.
- **Labels:** an 8px solid square (`--signal` on graphite, `--accent` on paper, paper on red), then JetBrains Mono 12px uppercase, 0.06em, `--fg-2`, e.g. `■ GTM SYSTEMS PARTNER`.
- **FIG. captions:** mono 12px uppercase, `--fg-3`, e.g. `FIG. 04 · FOUR LAYERS, ONE SYSTEM`.
- **Nav:** Mona 400 15px sentence case, items joined by ` · `.
- **Buttons:**
  - **Primary:** flat red rectangle, 56px tall, 0 28px padding, Mona 500 17px sentence case, "Request a System Audit ↗".
  - **Secondary:** Mona 500 16px text with →, a 1px underline at 6px offset in `--line-2`, turning `--fg` on hover.
- **Segmented control:** 48px tall, 1px `--line-2` border, Mona 400 15px. The active segment is `--fg` fill with `--bg` text.

### Layout
- **Nav:** 96px tall. Lockup 24px high at col 1. Dot nav centred over cols 4–9. Outlined "Audit request ↗" (44px, 1px `--line-2`) right-aligned to col 12. A 1px `--line` hairline runs under the nav from margin to margin.
- **Section anatomy:**
  - Padding is 160px top and bottom.
  - **Label row:** the red-square label at col 1. `FIG. 0n` (when the act has a figure) is right-aligned to col 12 in mono.
  - **Statement:** 48px below, in cols 1–8.
  - **Lede (and CTA if any):** cols 9–12, baseline-aligned to the statement's last line.
  - **FIG. plate:** 96px below, spanning cols 1–12, or bleeding the full 1440 for hero and architecture.
- **Figure plate:** flat `--panel` fill, 480–560px tall, no border. A 56px caption band sits inside its bottom edge. The FIG. caption is at bottom-left (24px inset) and the segmented control is at bottom-right (24px inset).
- **Lists are strips, not cards.** Use 2–4 equal strips (cols 1–3 / 4–6 / 7–9 / 10–12, or 1–4 / 5–8 / 9–12) divided by full-height 1px `--line` verticals. Each strip has a mono index (`01`) at the top, an H3, then 15–17px body anchored to the bottom (Metalab rhythm).
- **Density:** medium-low. Each act has one statement, one figure and ≤ 4 supporting items. Keep ≥ 40% of each section empty.
- **Separation:** graphite-to-graphite acts are separated by a 1px `--line` rule from margin to margin plus the next label row. Surface changes are hard cuts.
- **Numbering:** only figures are numbered (FIG. 01 is the hero film, then FIG. 02 … in page order). Acts are labelled in words (`■ THE REFRAME`).

### Surface rhythm
- **Graphite ≈ 65%:** nav, hero, reframe, stack, architecture, state change, method, assets, FAQ, footer, interior.
- **Paper ≈ 20%:** evidence, fit, before/after. These are reading and comparison acts, and their figures use ink plus `--panel` plates.
- **Full red ≈ 15%:** exactly two planes, the principle band and the final CTA. They are never adjacent. On red, the accents invert: the CTA is a paper rectangle with red text, labels use paper squares, and figure lines are `--line` on red.
- **Red elsewhere:** CTA fills, label squares, and the one red element in each figure. Nothing else.

### Graphics (what replaces photography)
- **FIG. plates** built only from the mark's vocabulary: nested right-angle corners (one heavy, then thin), steps and solid squares. They keep the mark's bar proportions (30 / 12 / 28, 6-unit gaps), use flat fills (`--panel-2`, `--cool`, `--soft`, `--fg`), and have exactly **one red element**. By default that element is the K4 core square. When a figure has a selection, red moves to the selected element.
- **Typical figures:**
  - **Reframe:** "Surface" (the four corners scattered and misaligned) vs "Architecture" (nested).
  - **Evidence:** a proportional corner bar per numeral.
  - **Stack:** the mark exploded into K1–K4 with labels.
  - **Architecture:** the four elements rotated into a closed loop, with 8px `--cool` signal squares travelling.
  - **State change:** the staircase compounding.
  - **Method:** a four-step staircase climbing one step per phase.
  - **Assets:** the mark's parts laid out as a numbered parts tray.
- **Film:** the hero film is dark and warm (`--film-frost .34`, `--film-blur 20px`, a left-to-right legibility scrim inside `.km-film` only). **One reprise:** the interior page header shows the same film at a different crop (`--film-pos 70% 50%`), 640px tall.

### Signature device: the FIG. plate
Every act carries one numbered figure: a flat plate with a mono `FIG. 0n · TITLE` caption at bottom-left and a Plurel segmented control at bottom-right (Surface | Architecture, Before | After, Phase 1–4, layer names). The control switches the figure between states. FIG. 01 is the frosted hero film itself, with a "Pause film" control. FIG. 02 onward are nested-corner graphics with one red square. The plates and their controls are what make the site read as Plurel's sibling.

### Motion
- **Entrance (≤ 1.6s per act):**
  1. The label fades in (300ms).
  2. Statement lines rise out of masks (translateY 100%→0, 800ms `--ease-out`, 120ms stagger). The light clause lands 200ms after the medium line.
  3. The lede and CTA fade up 12px (600ms).
  4. The figure assembles: corners slide in from the top-right one at a time (700ms each, 120ms stagger), and the red core lands last (400ms). This last landing is the "installed" beat.
- **State change:** when the segmented control switches, the geometry translates and rescales to its new arrangement over 900ms `--ease-inout`. Demos auto-advance once at about 2.4s.
- **Numerals:** count up once (1.2s, tabular).
- **Ambient:** only the hero film (32s drift, silhouettes crossing) and a 1px progress hairline under the film control. Nothing else loops.
- **Interaction:** on CTA hover the fill goes to `--accent-hover` and ↗ moves 2px up-right. "Pause film" really pauses the film. Hovering a strip raises its title from `--fg-2` to `--fg`.
- **Live site:** each figure advances its state once when 50% visible. Reduced motion shows the final state.

### Do
- Keep the founder's hero composition intact and sharpen it:
  - nav with dot items, a hairline and the outlined "Audit request ↗"
  - `■ GTM SYSTEMS PARTNER`
  - the 3-line H1 ending in the light, muted "problem."
  - a 48×2px `--signal` rule
  - a 20px lede in cols 1–5
  - the red "Request a System Audit ↗" and the underlined secondary ("Talk to the team →")
  - at bottom-right (cols 10–12), `■ A FIXED-SCOPE DIAGNOSTIC` with "Ten working days. Clear findings. Actionable recommendations."
  - a bottom band below a hairline: `FIG. 01 · THE ROOM WHERE PIPELINE IS DECIDED` at left and the "Pause film" control at right
- Give each act one statement and one figure, and let the figure carry the argument.
- Build every figure from the mark's geometry only: flat fills, one red element.
- Use the light weight (plus `--fg-2`) for every second clause. Emphasis comes from weight, never from extra colours.

### Don't
- Use corner brackets, HUD panels, readouts, radar, dot-matrix numerals or terminal cursors.
- Add a third full-red plane, put two reds in a row, or use red as decoration inside figures.
- Use cards, bento grids or icons. Lists are hairline strips.
- Use uppercase statements (that is C's voice) or set statements below 64px.
- Use photography outside the hero film and its one interior reprise.
- Use rounded corners, gradients or glow.

### Section map
| Section | Surface | Composition |
|---|---|---|
| nav | graphite over film | Lockup · dot nav · outlined "Audit request ↗" · hairline. The Capabilities mega menu drops as a `--panel` sheet under the hairline: three capability strips (cols 1–4/5–8/9–12, vertical hairlines), each with a 40px mark glyph (its K-element in red), a mono `CAP. 0n`, a 28px wide title, a 4-line manifest and an arrow link |
| hero | graphite + dark film | As in "Do" above |
| reframe | graphite | Two-voice H2. FIG. 02 Surface \| Architecture. Three 4-col strips: struck symptom (1px line-through, `--fg-3`) → real layer in 24px wide 500 |
| evidence | paper | "Four numbers. / One diagnosis." A 2×2 grid of 6-col cells divided by hairlines, each with a 176px numeral, a proportional corner bar, a 15px reading and a mono source |
| stack | graphite | "Kelwin doesn't deliver work. / We install systems." FIG. 04: K1–K4 exploded, with a control switching Narrative/Data/Orchestration/Intelligence (red follows the selection). Four strips: what it is / in practice |
| architecture | graphite | Full-bleed FIG. 05: the four elements as a closed loop with travelling signal squares. The one red element is the Intelligence → Narrative return path |
| statechange | graphite | "Start compounding." with a 240px Δ (wide 500 + light). FIG. 06 compounding staircase, control Entropy \| System |
| principle | **red** | One sentence at 112px two-voice ("In a noisy market, / the clearest company wins."). A K1 corner outline in `--line` bleeds off the right edge |
| method | graphite | FIG. 07 staircase climbing one step per phase. Control Diagnose/Architect/Install/Calibrate auto-steps. Four strips with mono "Output" lines |
| fit | paper | "Not for everyone. / By design." Two 6-col ruled lists: Built for (`+` mono marks) and Not for (`−`) |
| assets | graphite | "When we leave, / the system stays." FIG. 08 parts tray: numbered nested-corner parts keyed to a strip list |
| beforeafter | paper | The segmented control Before \| After *is* the device: it switches six two-voice row pairs in place |
| faq | graphite | Two-voice H2 in cols 1–5. Questions in cols 7–12 as hairline rows with +, one open |
| cta | **red** | 120px two-voice "Initiate the / System Audit." A paper rectangle with red text "Request a System Audit ↗" and a paper text link to contact. Mono note "Deployment window open" at bottom-right |
| footer | graphite | Mono-headed sitemap columns plus a location/time readout above a giant Kelwin lockup (mark + wordmark) filling the margin-to-margin width, cropped by the bottom edge (Zellerfeld) |
| interior | graphite + film reprise | 640px film header with label, two-voice title, lede and `FIG. 01` caption. First body beat: a statement plus the capability manifest as strips |

### References
- [Founder reference](refs/user-kelwin-intent.webp): the hero target, kept and refined.
- [Founder reference: Plurel](refs/user-plurel.webp): the sibling grammar (dot nav, outlined ↗ button, red square label, medium/light headline, FIG. caption, film controls).
- [Grok: mission](https://mobbin.com/sites/sections/6857a406-9c8b-4b57-8247-c96e015c140b) (`refs/dirD-5.webp`): a bracketed mono label over a two-line headline whose second line is muted, with body copy and an outlined ↗ button placed bottom-right on a dark field. Use it for the bottom-right note and corner placement.
- [A24](https://mobbin.com/sites/sections/6273675b-53ef-400e-a5b4-77ff67a08a33) (`refs/dirD-7.webp`): large type stacked directly over a running film, with mono superscript metadata. Use it for the type-over-film hierarchy (our film is frosted).
- [Tailscale](https://mobbin.com/sites/sections/e72d1d36-a761-4557-b655-d2797beb7abb) (`refs/dirD-6.webp`): flat geometric tiles in two tones inside a solid plate. This shows a brand mark's geometry working as illustration. Kelwin uses nested corners instead of quarter-circles.
- [Zipline: highlights](https://mobbin.com/sites/sections/baf31b25-1858-463c-bf15-611d9c669092) (`refs/v2S2-20.webp`): two huge numerals with caps captions on a flat field. This is the 2×2 evidence cell.
- [Metalab: principles](https://mobbin.com/sites/sections/26e93485-a46d-464b-b795-f4eb9101403c) (`refs/v2S1-6.webp`): strips divided by vertical hairlines, index at top, label at bottom. Use this rhythm for every list.
- [Zellerfeld: footer](https://mobbin.com/sites/sections/18df6730-6569-49da-9c23-3bee32fbe638) (`refs/v2S1-26.webp`): a giant mark + wordmark lockup filling the footer under mono-headed columns.

---

## B · Quiet Ledger

> Legora-calm Swiss editorial: a daylight frosted film, paper-led reading, one continuous index spine, and ruled ledgers that open in place.

**Thesis.** This direction moves toward calm authority. Kelwin reads like the annual report of a sovereign fund or the research index of an AI lab. It is mostly paper, with very few words per screen. Everything is indexed and sourced, and every list is a hairline ledger that opens in place like Legora's accordions. The frosted film stays, but as *daylight*: milky glass with silhouettes moving behind it, so the first impression is quiet confidence rather than spectacle. The mark appears as structure. A single **index spine** runs the length of the page, and every section hangs from it at a right angle (the mark's corner, drawn as a hairline).

### Type (px at 1440)
- **Statements** pair a sentence with a *muted second sentence* at the same weight. This two-tone comes from colour, not weight: Mona Sans wide 110%, weight 500, sentence case.
  - **Hero H1:** 96px, line-height 1.0, tracking −0.03em. Sentence 1 is in `--fg` and sentence 2 in `--fg-3` ("Revenue is an architectural problem. We design the system that solves it."), 4 lines max.
  - **Section H2:** 56px, 1.06, −0.025em, sentence in `--fg` plus follow-up in `--fg-3`, ≤ 3 lines total.
- **Spine index:** Mona wide weight 300, 64px, `--fg-3`, tabular (`03`). The section name sits beneath it in mono 12px uppercase `--fg-2`.
- **Giant numerals (evidence only):** Mona wide weight 300, 200px, 0.9, tabular, `--fg`. The source is in mono 11px under a 1px top rule.
- **Ledger rows:**
  - **Title:** Mona 500 *normal width (100%)*, 24px/1.25.
  - **Descriptor:** Mona 400 17px `--fg-2`.
  - **Index:** mono 12px `--fg-3`.
  - **Toggle:** a 20px "+" drawn from two 1px lines, rotating to "−".
- **Body:** Mona 400 18px/1.65 `--fg-2`, measure cols 4–8 (≤ 62ch). **Support:** 15px.
- **Labels:** mono 12px uppercase 0.06em `--fg-3`. Red squares are not used, except a single 8px `--accent` marker in the hero label.
- **Nav:** Mona 400 15px. Menu items carry a "+" disclosure mark (Legora). The action is an outlined (1px `--fg`) "Audit request ↗", 40px tall.
- **Buttons:**
  - **Primary:** red rectangle 52px, Mona 500 16px sentence case, "Request a System Audit ↗".
  - **Secondary:** Mona 500 16px text with → and a 1px `--line-2` underline.

### Layout
- **The spine:** a 1px `--line` vertical at the col 3|4 gutter, `left: calc(var(--margin) + 3*var(--col) + 2.5*var(--gutter))` (≈ 386px). It runs uninterrupted from the hero's bottom edge to the footer, through every surface change, taking each surface's `--line`.
- **Section anatomy:**
  - Padding is 200px top and bottom.
  - **Opening rule:** a 1px `--line-2` horizontal from the spine to the right margin (cols 4–12), meeting the spine at a right angle. A 6px solid `--fg` square sits at the joint, echoing K4.
  - **Spine column (cols 1–3):** index numeral and section name only. On the live site it is sticky.
  - **Content:** statement in cols 4–10, body in cols 4–8, side notes and sources in cols 10–12.
- **Ledgers (the universal list):** cols 4–12. Mono index in col 4, title in cols 5–8, descriptor in cols 9–11, toggle/value right-aligned in col 12. Rows are separated by 1px `--line` with 28px vertical padding. **Exactly one row is open by default.**
- **Inset plates:** used at most once every three sections. A flat `--panel` block inset in cols 4–12 holds one typographic object (a quoted principle, a document specimen labelled SPECIMEN). This replaces Legora's inset photography.
- **Density:** the lowest of the three. One idea per section, ≤ 60 words of body per screen, ≥ 45% of each section empty.
- **Numbering:** sections are numbered 01–14 in the spine (hero unnumbered). Ledger rows use `N·01`. Decimal indices (1.0 / 2.0) are used for method phases only.

### Surface rhythm
- **Hero:** a daylight film. The section is `data-surface="light"` and the frost is the paper surface itself (see Graphics).
- **Paper ≈ 60%:** reframe, evidence, state change, principle, method, fit, before/after, FAQ.
- **Graphite ≈ 30%:** stack, architecture, assets, footer. These are the "chapters about the machine". Never more than two in a row.
- **Red ≈ 5%:** one red **inset panel** for the final CTA (Legora's dark CTA panel, made red), plus the primary buttons and the hero marker. **No full-red sections.** Never red text.

### Graphics (what replaces photography)
- Type, rules and numerals do almost all of the work. There are no figures, icons, isometrics or cells.
- **The one diagram** is in architecture: a quiet orthogonal hairline loop (Narrative → Channels → Signals → Intelligence → back to Narrative) in `--fg-3` 1px lines with mono node labels, set in cols 4–12. The single return path is `--accent`.
- **Evidence** may add a hairline unit rule under each numeral (100 ticks, n of them in `--fg`), never a chart.
- **The mark** appears as the spine's corner joint and as **stepped indents** in the stack ledger: row *n*'s title indents by (n−1) × 24px, the mark's step read as typography.
- **Film:** *daylight frost*. Set `.km-hero-B .km-film__frost { background-color: color-mix(in srgb, var(--bg) 64%, transparent); }` with `--film-bright: 1.05`, `--film-blur: 22px`, `--film-sat: .6`. Silhouettes read as soft warm-grey shadows behind milky glass, and the type is ink. **One reprise:** the interior page header (560px), same daylight frost.

### Signature device: the Index Spine
One continuous hairline at the col 3|4 gutter runs the whole page. Every section hangs from it with a right-angle opening rule (the logo's corner as a hairline, with a small square at the joint). A light wide index numeral and the mono section name sit in the spine column, and the content sits to its right, almost always as a ledger that opens in place. Pick up any screen and you can tell where you are in the argument.

### Motion
- **Character:** long durations, short distances, `--ease-out`.
- **Entrance:**
  1. The opening rule draws from the spine to the right margin (900ms).
  2. The index numeral fades in (400ms).
  3. The statement fades and rises 12px (700ms). The muted sentence follows 160ms later.
  4. Ledger rows reveal top-down: each rule draws (600ms) and its text fades in, at a 60ms stagger.
- **Numerals:** do not count. They fade in as their top rule draws (an editorial calm, distinct from A and C).
- **Ledger open:** height plus opacity over 360ms `--ease-inout`, with "+" rotating to "−". Demos open the second row at about 1.8s.
- **Ambient:** only the hero film, slowed to a 48s drift with silhouettes crossing about every 30s.
- **Interaction:** a hovered row fills `--panel` and its title shifts 8px right. Links underline from the left (300ms).
- **Live site:** the spine index is sticky and crossfades (300ms) as sections pass. Reduced motion shows the final state.

### Do
- Write every statement as a sentence plus a muted second sentence.
- Hang every section from the spine. Nothing except the index enters cols 1–3.
- Make every list a ledger, with one row open.
- Put a mono source under a hairline for every number.
- Spend whitespace: 200px section padding, and empty columns on purpose.
- For the hero, anchor the H1 to the lower-left (cols 1–9), with the lede in cols 1–5 and the two doors below. In cols 10–12, add a three-row quiet ledger: "Fixed scope" · "Ten working days" · "The readout is yours to keep".

### Don't
- Use figures, plates of geometry, isometric drawings, cells, crosshairs or title blocks (A's and C's devices).
- Add full-red sections or red text. Use the dark film frost (that's A).
- Use cards, bento, icons or boxes around content.
- Use uppercase display, or wide type below 40px (ledger titles are normal width).
- Use anything from today's site (brackets, HUD, dot-matrix, terminal).

### Section map
| Section | Surface | Composition |
|---|---|---|
| nav | over daylight film | Lockup left. Items right-aligned with "+" marks. Outlined "Audit request ↗". The mega menu opens as a paper sheet: the spine column reads "Capabilities", and three capability ledgers (mono heads, 4 manifest rows each) sit in cols 4–12 |
| hero | light (daylight film) | As in "Do" above. The spine starts at the hero's bottom edge |
| reframe | paper | `02 Reframe`. Two-tone H2. A three-row ledger of struck symptom → real layer, with one row open explaining it |
| evidence | paper | Four stacked numeral rows (Instrument): a 200px light numeral in cols 4–9, reading plus mono source in cols 10–12, rows divided by hairlines |
| stack | graphite | A four-row ledger with stepped indents (Narrative, Data, Orchestration, Intelligence). Each row opens to "What it is / In practice" |
| architecture | graphite | The one hairline loop diagram in cols 4–12, with a mono caption in the spine |
| statechange | paper | "Start compounding." A light 200px Δ in cols 4–6, and a two-column ledger Entropy \| Compounding in cols 7–12 |
| principle | paper | One sentence at 72px in cols 4–12 with a muted second half. Nothing else on the screen |
| method | paper | Four decimal columns (1.0 Diagnose · 2.0 Architect · 3.0 Install · 4.0 Calibrate) across cols 4–12, divided by vertical hairlines, each with its output in mono |
| fit | paper | Two ledgers stacked: "Built for" and "Not for", one row open in each |
| assets | graphite | Inventory ledger: item · format · right-aligned mono "YOURS" |
| beforeafter | paper | A two-column ledger "Without the system \| With the system", six rows, the left column in `--fg-3` |
| faq | paper | Legora FAQ ledger, one expanded |
| cta | paper + red inset panel | A red panel inset margin-to-margin (square), 520px tall. Two-tone statement in paper / paper 70%, a paper button with red text, and a paper text link to contact |
| footer | graphite | Contact lines (mono label over 32px Mona lines, Legora "Discover"), a sitemap ledger, a small lockup, and a mono location/time |
| interior | light (daylight film reprise) | 560px header, then the spine resumes. The overview statement and the service manifest as a ledger |

### References
- [Legora: assistant](https://mobbin.com/sites/sections/fc998a50-1d47-4ca5-baac-cf5e08bb7df8) (`refs/dirD-1.webp`): a small caps label, a two-line statement, and a quiet accordion with one row open, beside a calm inset plate. This is the core calm grammar.
- [Legora: latest](https://mobbin.com/sites/sections/96bf78ea-b1ce-4776-965e-c570af80d588) (`refs/dirD-3.webp`): label and date held in a narrow left column with content to the right under a single hairline. This is the index-spine posture.
- [Legora: FAQ](https://mobbin.com/sites/sections/b23738fd-71ca-42c3-88bb-1dedc285c3ab) (`refs/dirD-2.webp`): hairline question rows with + and one open. This is the ledger that opens in place.
- [Legora: product hero](https://mobbin.com/sites/sections/de997de8-3e43-4060-a258-2b2e10dea2ca) (`refs/dirD-4.webp`): a headline top-left, body and button anchored bottom-left, and generous emptiness. Use it for hero anchoring and pacing.
- [Cartesia: research](https://mobbin.com/sites/sections/b8608ed1-0d62-4162-92ba-539871655c72) (`refs/v2S3-18.webp`): index numerals in a fixed left column, with rows framed by full-height rules. This is the spine.
- [Instrument](https://mobbin.com/sites/sections/10b3f9ff-98d3-4526-b4e3-bc5efeb5724c) (`refs/v2S2-7.webp`): huge figures stacked as ruled rows with a narrow caption column. This is the evidence grammar.
- [Linear](https://mobbin.com/sites/sections/11fa0cf7-8a9c-41f1-b38f-66918fac01f4) (`refs/v2S2-11.webp`): decimal-indexed columns divided by hairlines. This is the method.
- [Legora: contact](https://mobbin.com/sites/sections/85d5fc55-bcd5-4aa3-8ba1-95bfb4ae6146) (`refs/dirD-8.webp`): small labels over large contact lines. Use it for the footer contact block.

---

## C · Systems Drawing Set

> Palantir-grade rigour: every section is a sheet from Kelwin's drawing set. A cell-built nav, framed graphite night plates, 1px isometric drawings of the four-layer mark, dimension callouts, title blocks, and one red plane marking the installed layer.

**Thesis.** This direction moves toward systems and instrument rigour. Kelwin documents its work the way a defense or infrastructure company documents an assembly: numbered sheets, a visible 12-column frame, cell rows, mono coordinates and exact 1px drawings. The drawing subject is Kelwin's own mark, extruded into an exploded isometric stack of its four elements (Narrative, Data, Orchestration, Intelligence). In every drawing one flat red plane marks the layer under discussion. The direction is dense where density earns it, always labelled, never decorative. Here "Revenue is an architectural problem" is literally drawn.

### Type (px at 1440)
- **Sheet titles:** Mona Sans wide 110%, weight 500, UPPERCASE.
  - **Hero:** 104px, line-height 0.94, tracking −0.01em, 3 lines ("REVENUE IS AN / ARCHITECTURAL / PROBLEM.").
  - **Sections:** 72px, 0.96, 2–3 lines.
  - Titles sit flush to the bottom-left of their title cell. When a statement has a turn (hero, reframe), its last line may drop to `--fg-3`. Otherwise titles are `--fg`.
- **Note-cell voice:** Mona weight 300, sentence case, 24px/1.4 `--fg-2`, cols 9–12. This is the counter-voice to the caps.
- **Cell numerals:** wide 500, 112px, 0.9, tabular, with a boxed mono unit chip (`[%]`, `[WD]`, `[×]`, 11px, 1px `--line-2`, 2px 6px padding).
- **Mono is the dominant small voice:** JetBrains Mono 11–12px uppercase, 0.04–0.06em, ≥ `--fg-3`. It carries sheet numbers (`SHEET 04/16`), cell IDs (`C4·R2`), coordinates (`X 0.42 · Y 0.18`), dimension values (`[17%]`), tabs (`[01] DIAGNOSE`) and lettered callouts (`A`–`F`).
- **Body:** Mona 400 15–16px/1.55, ≤ 4 cols. **Spec tables:** key in mono 12px `--fg-3`, value in Mona 400 15px `--fg`.
- **Buttons are cells:**
  - **Primary:** a filled red cell, ≥ 3 cols × 64px, with mono 12px uppercase "INITIATE SYSTEM AUDIT ↗" set bottom-left in the cell (16px inset).
  - **Secondary:** a 1px `--line-2` bordered cell, "CONTACT →".

### Layout
- **Nav:** a row of bordered cells 64px tall: lockup cell (cols 1–2), five menu cells (mono 12px uppercase), a mono UTC/coordinate cell, and "AUDIT REQUEST ↗" as a filled red cell at cols 11–12 (Mistral/Heron).
- **The frame:**
  - 1px `--line` verticals at both margins (x = 64 and x = 1376) run continuously down the page.
  - Each sheet opens with a 1px `--line-2` horizontal.
  - 9px "+" crosshairs sit at the frame corners and at 2–4 *chosen* column/row intersections per sheet, never all of them.
- **Module:** 12 cols × 96px rows. Content lives inside cells with a 24px inset. Cell borders (1px `--line`) are drawn only where a cell exists, never as wallpaper.
- **Sheet anatomy:**
  1. **Title row:** title cell (cols 1–8) and note cell (cols 9–12), divided by a vertical rule. A mono sheet label sits top-left in the title cell.
  2. **Body:** a drawing field (cols 1–8) over a faint construction grid (dashed 1px `--line` at each column line), and a spec column (cols 9–12) holding tabs, a spec table or copy.
  3. **Bottom band (48px):** a mono legend/ticker in cols 1–8 and a title block in cols 9–12: `SHEET 05/16 · REV C · SCALE 1:1 · KELWIN/GTM`.
- **Spacing:** sheets butt together (the frame continues), with 96px internal top padding and 0 between sheets.
- **Density:** the highest of the three. Up to 6 data points per sheet, plus annotations and spec tables, but the drawing field keeps ≥ 30% empty.
- **Numbering:** sheets are `SHEET 01–16`. Drawings are `FIG. n.n`. Callouts are lettered A–F and keyed to spec-table rows. Tabs are `[01]–[04]`, with the active tab inverted (`--fg` fill, `--bg` text).

### Surface rhythm
- **Graphite ≈ 70% ("night plates"):** nav, hero, reframe, stack, architecture, state change, method, assets, before/after, footer, interior. Drawings are 1px `--fg`/`--cool` lines on graphite.
- **Paper ≈ 20% ("document sheets"):** evidence, principle, fit, FAQ. These are the documents people read. Lines are ink.
- **Red ≈ 10%:** one full-red sheet, the final CTA. There, the drawing inverts to paper lines on red and the audit cell becomes paper with red text.
- **Red elsewhere:** exactly **one red element per sheet** besides the action cell: the red plane, a red callout tag (a filled red rectangle with a mono code and a 2-line label on a leader) *or* a red datum line, and never more than one of these.

### Graphics (what replaces photography)
- **Line drawings:** 1px inline-SVG isometric/axonometric drawings with iso angles exactly 30° and no fills except the red plane. They are drawn from the mark's four elements and use three to four master drawings, reused:
  1. **Exploded stack:** K1–K4 extruded as plates.
  2. **Section cut:** surface vs architecture.
  3. **Orthogonal routing plan:** bordered node cells, dashed 1px connectors and a closed loop (Cloudflare plan).
  4. **Phase gantt:** a gantt on a graph-paper grid with square markers.
- **Annotation kit:** dimension lines with end ticks and mono values; lettered callouts on orthogonal leaders; the parts list and title block.
- **Film:** *cool night frost* (`--film-sat .4`, `--film-frost .55`, `--film-bright .7`). Overlay the 12 column verticals in `--line`, crosshairs at four intersections, an `X / Y` mono readout at the top-right frame edge, and a title block bottom-right (`SHEET 01/16 · FIG. 1.0 · OBSERVED ROOM · LIVE`). **Never put reticles or tracking boxes on the people.** **No reprise:** the interior header is a drawing sheet.

### Signature device: the installed red plane
In every drawing, Kelwin's four-layer assembly is a 1px isometric line drawing. A single flat red plane (a parallelogram in iso, a rectangle in plan) slots into the layer under discussion. It is tagged with a mono dimension callout (`[L3 · ORCHESTRATION]`), and the sheet's title block frames it. When the tab or scroll changes, the plane moves to the next layer. Red always means "the layer Kelwin installs" or the action, nothing else.

### Motion
- **Character:** drafting order, `--ease-inout`, no overshoot.
- **Entrance:**
  1. Frame verticals and crosshairs fade in (300ms).
  2. Cell borders draw in raster order (40ms stagger).
  3. The drawing plots via stroke-dashoffset: construction lines, then outlines, then dimensions (1.6–2.4s).
  4. The red plane drops into its slot (opacity + 8px settle, 400ms).
  5. Mono values type on (24ms per character), and title-block coordinates tick to their final values.
- **Tabs:** `[01]→[04]` step every 1.2s in demos (scroll-linked on the live site). The red plane moves to the matching layer each time (600ms).
- **Ambient:** one mono readout (UTC or a coordinate) updates every 6s with a 200ms digit change, and the hero film continues. Nothing else loops.
- **Interaction:** an X/Y cursor readout follows on the frame edge. Hovering a spec row turns its lettered callout and leader `--accent`. Hovering a cell inverts it (`--fg` fill, `--bg` text).
- **Reduced motion:** the fully plotted final state.

### Do
- Make every section a numbered sheet with a title block, and give every drawing a `FIG. n.n` caption.
- Draw only Kelwin subjects (the mark's layers, signal routes, phases). Never draw buildings, machines, trees or people.
- Use one red element per sheet, and make it mean something.
- Key every lettered callout to a spec row. Label illustrative values SPECIMEN.
- Keep all lines 1px (construction lines dashed `--line`) and iso angles exact.
- Put documents on paper sheets and the machine on graphite.
- Hero: cell nav, cool-frosted film under the drafting overlay, title cell cols 1–8 bottom-left, and a note cell cols 9–12 with the 24px light lede, the red audit cell and the contact cell. Bottom band: ticker `NARRATIVE · DATA · ORCHESTRATION · INTELLIGENCE` and the title block.

### Don't
- Use corner brackets, radar charts, dot-matrix numerals, terminal cursors or glowing readouts. This is the direction most at risk of sliding back into today's HUD look, so the ban is absolute.
- Use Heron-style architecture, hatching, shading or a hand-drawn feel. Kelwin draws systems, not buildings.
- Use sentence-case display or light-weight statements (A's and B's voices).
- Use rounded cells, gradients or glow, or crosshairs at every intersection.
- Put targeting reticles or tracking boxes over the film's people.
- Add more than one full-red sheet, or two red elements in one sheet.

### Section map
| Section | Surface | Composition |
|---|---|---|
| nav | graphite | Cell nav. The mega menu opens as a sheet of cells under it: three capability cells (cols 1–4/5–8/9–12), each with a small line drawing (its layer plane red), an uppercase 20px wide title and 4 manifest rows as cell rows with mono IDs |
| hero | graphite + cool film | As in "Do" above |
| reframe | graphite | FIG. 2.1 section cut: left "SURFACE" (the three symptoms as tags on a flat line), right "ARCHITECTURE" (the cut through four layers, the red plane at the real layer). Spec table A–C: symptom → layer |
| evidence | paper | Four 3-col cells: 112px numeral + unit chip, 15px reading, mono source, and a dimension-line bar. Title block |
| stack | graphite | FIG. 4.1 exploded iso of K1–K4. Tabs `[01]–[04]` in cols 9–12 move the red plane. Spec table "What it is / In practice" |
| architecture | graphite | FIG. 5.1 orthogonal routing plan: node cells (Narrative, Channels, Signals, Intelligence) with dashed connectors closing the loop and one red route |
| statechange | graphite | A plot from an entropy scatter resolving into the mark's staircase, with Δ as a dimension callout. Title "START COMPOUNDING." |
| principle | paper | A nearly empty framed sheet: one uppercase line centred, and one red tick on the frame edge (Heron) |
| method | graphite | A full-width tab row `[01] DIAGNOSE … [04] CALIBRATE` (active inverted), over a phase gantt on graph-paper grid with square markers and mono phase labels |
| fit | paper | Two spec tables FIT / DECLINE in cells, with IDs `F-01…`/`D-01…` and `+`/`−` mono marks |
| assets | graphite | A parts list: Part No. · Item · Format · Owner = CLIENT, beside an exploded drawing with numbered leaders |
| beforeafter | graphite | A two-column spec comparison. The "WITH SYSTEM" column is raised as a `--panel` column (Linear) |
| faq | paper | `Q-01…` rows in cells, one open |
| cta | **red** | A red sheet: uppercase title, the assembly redrawn in paper lines, a paper audit cell with red text, an outlined paper contact cell, and the title block |
| footer | graphite | Cell footer: sitemap cells with mono heads, the lockup in a cell row, coordinates and UTC |
| interior | graphite | Sheet header with no film: title cell, note cell, a FIG. drawing of the capability (its layer plane red) and a title block. Then the manifest as a spec table |

### References
- [Heron AI: hero](https://mobbin.com/sites/sections/76dab96c-c33d-4d52-944b-7d32dc2274fa) (`refs/v2S2-12.webp`): nav as cells with a red action cell, a frame with crosshair corners and an X/Y readout, a caps title band beside a description cell, and a mono ticker.
- [Heron AI: key features](https://mobbin.com/sites/sections/1fe1d979-0175-41b8-9d0a-15ab35c48fa8) (`refs/v2S2-13.webp`): a `[01]–[05]` tab row with the active tab inverted, and a flat red plane slicing an isometric line drawing with dimension tags. This is the signature, applied to Kelwin's own assembly.
- [Rox: Revenue OS](https://mobbin.com/sites/sections/f81fe9bd-84ae-40e5-8ddd-6a406a3442fc) (`refs/v2S1-7.webp`): an exploded isometric layer stack on dark with a layer index. Borrow the exploded-stack grammar only.
- [Rivian: size it up](https://mobbin.com/sites/sections/1890ce54-01e1-4c4f-bdb7-1165d0818ddd) (`refs/v2S1-21.webp`): blueprint line work on graphite with lettered A–F callouts keyed to a ruled table. This is the night-plate annotation system.
- [Mistral AI: hero](https://mobbin.com/sites/sections/687e8d48-cc6e-422b-bacf-b6fae6802471) (`refs/v2S2-1.webp`): a page built from bordered cells, nav as cells with a filled action cell, and a headline flush to the bottom-left of its cell.
- [Cloudflare Workers](https://mobbin.com/sites/sections/3f43d4a8-c70c-4f82-a216-52bd0a30a932) (`refs/v2S2-16.webp`): an orthogonal system plan with mono-labelled node groups and dashed connectors. This is the architecture sheet.
- [Mercury: layers](https://mobbin.com/sites/sections/3a483a4e-ab5c-494e-9db9-c6d41660be22) (`refs/v2S2-29.webp`): LAYER 1–4 leader labels into an exploded stack, redrawn flat with no glow.
- [Heron AI: empty sheet](https://mobbin.com/sites/sections/a9d85ab3-0d19-447b-b151-40273c241f61) (`refs/v2S1-22.webp`): an almost empty frame with registration marks, one caps line and one red tick. This is the principle sheet.

---

## Telling them apart at a glance

| | A · Cinematic Figures | B · Quiet Ledger | C · Systems Drawing Set |
|---|---|---|---|
| Posture | Founder's target, Plurel's sibling, cinematic | Calm institutional editorial | Engineered, operational |
| Hero film | Dark warm frost, type over it | Daylight milky frost, ink type | Cool night frost under a drafting overlay |
| Display voice | Sentence case, medium + **light** clause | Sentence case, sentence + **muted** sentence | **UPPERCASE** sheet titles + light note cell |
| Mark used as | Solid flat plates (FIG.) | Hairline structure (spine corner, stepped indents) | 1px isometric assembly |
| Density | Medium-low | Lowest | Highest |
| Surfaces | Graphite-led; 2 full-red planes | Paper-led; one red inset panel | Graphite night plates; 1 red sheet |
| Lists | Hairline strips | Ledgers that open in place | Cells and spec tables |
| Signature | The FIG. plate + segmented control | The Index Spine | The installed red plane |
| Numerals | 176px wide 500, count up | 200px wide light, fade (no count) | 112px in cells + unit chip, type on |
| Kelwin-skin note | Light clause keeps `--fg-2`, so the two voices survive | Tone two-tone survives intact | Caps and frame survive intact |
