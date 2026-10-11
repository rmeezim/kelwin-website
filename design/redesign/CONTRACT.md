> **ROUND 5 STANDING RULES (founder, binding):**
> 1. **No Plurel on the Kelwin website, anywhere** — no sister-company line, no pointer, no link (production included).
> 2. **No "Fig." numbering anywhere** — no `FIG. 0n | … | …` title-block boxes and no "Fig. 0n" captions or label-row
>    meta. He reads them as AI-generated, not proprietary. Drawings stand on their own.
> 3. Primary buttons are the founder's pick C: one 45° cut corner (bottom-right), caps at 600, no arrow (kit `.ac-btn`).
> 4. **Hero:** Option 1 "The Operating Feed" (hero/T) is live; Option 4 "The Survey" (hero/Z) is on the bench for a
>    later swap — never delete or overwrite hero/Z.

> **GSAP (founder-approved):** GSAP 3.12.5 + ScrollTrigger — the same build the live site uses — is available. Any
> fragment whose JS mentions `gsap` gets `lib/gsap.min.js` and `lib/ScrollTrigger.min.js` loaded automatically (no network).
> Use it where it earns its place (orchestrated timelines, morphs, pinned scrollytelling); CSS is still fine for simple
> entrances. Standalone mockups demo on a timeline that autoplays inside `KM.init`. In the stitched homepage the page
> carries `html.km-home`: there a section MAY use ScrollTrigger (scoped to its own root, `scrub`/`pin` as the story
> needs) instead of the timed demo. Keep `prefers-reduced-motion` → final state, and never let one section's triggers
> affect another's.

> **ROUND 2 (latest — outranks everything below where they disagree):** the founder reviewed round 1 and chose a
> BLENDED language — mostly A × C, with B touches where named. Read `R/ROUND2-NOTES.md` (his picks and notes, verbatim)
> and `R/DIRECTION-AC.md` (the blended system, once written). Round-2 options live in slots **X** (the blend), plus
> **Y** / **Z** where alternatives were requested; build with `node tool/mk.mjs <sec> X` (or `r2` for X,Y,Z).
> Round-2 hard rules: the logo mark is RETIRED as an illustration device — it appears only as the lockup (nav, footer)
> and the footer's large cropped mark (no red); no figure may be built from its nested-corner geometry. Text under
> 11px fails the lint. Shared components live in `R/site/kit-ac.css` (inlined into every build).

# Kelwin redesign — mockup contract (read fully before working)

Workspace root (call it R): /tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/redesign
Live site repo (read-only for you): /home/user/kelwin-website

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

## The brief (founder's words, latest wins)
- The current site looks generic. Redesign Kelwin's website FROM ABSOLUTE ZERO: a new design language based on
  new inspiration (Mobbin). Do not carry over the current site's layouts, devices, or visual grammar.
- It must look proprietary, modern and attractive — "almost Palantir": the in-house design team of a serious
  data / defense / infrastructure company, never a SaaS template.
- NO STATIC PICTURES. No photography or raster imagery anywhere — build with type, grid, flat colour, rules,
  numbers, inline-SVG diagrams/data-viz, and motion. ONE EXCEPTION, and it is required: the hero carries a
  background VIDEO that keeps playing, seen through heavy frosted glass so only translucent silhouettes of
  people at work come through ("a mix of Legora's website and Plurel"). Use the shared stand-in `.km-film`
  (see Token system). At most one other section may deliberately reprise the film (e.g. the final CTA).
- Founder references (Read them): R/refs/user-kelwin-intent.webp = the hero he was aiming for;
  R/refs/user-plurel.webp = Plurel, the sister company already built in this same type/palette system —
  borrowing from Plurel is welcome (dot-separated nav, outlined "audit ↗" nav button, red-square marker labels,
  two-tone headlines with a light-weight second clause, "FIG. 01 ·" mono captions, film controls such as
  "Pause film"); Legora previews R/refs/legora-1…5.webp = calm editorial pacing, two-tone headlines, restraint.
- The Kelwin logo (nested right-angle corners stepping down-left + "Kelwin" wordmark) — use the real lockup,
  never a typed "KELWIN" or a placeholder glyph: `<span class="km-logo" role="img" aria-label="Kelwin"></span>`
  (height via --logo-h, takes currentColor) or the mark alone `<span class="km-logo-mark" aria-hidden="true"></span>`.
  The nested-corner geometry is a legitimate source for signature devices.
- Copy can stay as it is or be modified a little (it lives in each section's source component — read it).
- Colour & type to test — "Cinematic Red × Swiss Systems" (shared with Kelwin's sister company Plurel):
  Mona Sans for all type, the WIDE (110%) cut for headlines and big numbers, the LIGHT weight for accents;
  JetBrains Mono for small Swiss-style labels and metadata; Plurel red #BF3A36 (deep #8E2824 on hover),
  graphite #141517 for dark sections, paper #FBFAF6 and ink #110F0A for light ones; blush #F2C9BF,
  fog #B9BCC2 and signal #E8564E as accents; ALL FLAT COLOUR, NO GRADIENTS, on a 12-COLUMN GRID.
  Every mockup is also rendered in a second skin (today's Kelwin palette & type) so the founder can compare
  colour/type independently of layout — your markup must hold up in both.
- Kelwin is a premium B2B GTM partner & advisory (revenue infrastructure, narrative systems, GTM intelligence).
  Two conversion doors always: red primary → System Audit (/audit); quiet secondary → contact.

## Token system (R/site/base.css — read it, never edit it)
- Section root: `<section class="km km-<sec>-<opt>" data-surface="dark|light|red">`. Any inner element may
  set its own data-surface (e.g. a paper panel inside a graphite section, a red band).
- Use ONLY the semantic tokens: --bg --panel --panel-2 --fg --fg-2 --fg-3 --line --line-2 --accent
  --accent-hover --accent-fg --signal --soft --cool --data-1/2/3 --ok, fonts --f-display --f-body --f-mono,
  and --display-stretch --display-weight --light-weight --body-weight --strong-weight.
  Display text = `font-family: var(--f-display); font-stretch: var(--display-stretch); font-weight: var(--display-weight)`.
  Accent/light text = `font-weight: var(--light-weight)`. Never hard-code hex colours or font names.
- Grid: 1440 stage, --margin 64px, --gutter 24px, 12 columns (--col ≈ 87.3px). Lay out on it:
  `display:grid; grid-template-columns: repeat(12, 1fr); column-gap: var(--gutter)` inside `padding-inline: var(--margin)`.
- Flat colour only: no gradients, no shadows that read as glow, no blur/glass, no grain — EXCEPT inside `.km-film`.
  Patterns (dot grids, hatching) = inline SVG.
- The film: first child of the section →
  `<div class="km-film" aria-hidden="true"><div class="km-film__plate"></div><div class="km-film__walker"></div><div class="km-film__frost"></div></div>`
  Tune on .km-film with --film-blur (10px, capped at 12px) --film-frost (.30) --film-bright (.92) --film-sat (.85) --film-grain (.5) --film-pos.
  You may add your own legibility scrim element inside .km-film (gradients allowed there only) and film UI
  (caption, Pause film control) outside it. It plays continuously (ambient), independent of `.is-play`.

## Files you write (per section `<sec>`, option `<opt>` ∈ A,B,C)
- `R/site/frag/<sec>/<opt>.html` — markup only, one root as above.
- `R/site/frag/<sec>/<opt>.css` — every selector begins with `.km-<sec>-<opt>` or `.is-play .km-<sec>-<opt>`;
  keyframes named `km-<sec>-<opt>-…`.
- `R/site/frag/<sec>/<opt>.js` — optional, vanilla, no libraries, no network:
  `window.KM = { init(root, { reduced }) { … } };` (canvas is allowed for generative graphics).
- `R/site/frag/<sec>/<opt>.meta.json` — schema below.
Never edit base.css, tool/, or another section's files (direction-coherence reviewers excepted).

## Rendering rules
- Stage 1440px wide; height natural, aim 720–1100px, hard max 1400px (crop long sections to a representative
  slice; say so in meta.notes). Include a navbar only where the section brief says so.
- Default CSS = FINAL resting state, fully visible. Entrance animation only under `html.is-play`
  (added ~200ms after fonts load) with `animation: … both`. Reduced motion = no `.is-play` = final state.
- Scroll-linked behaviour (pins, scrubs, covers, scroll steppers) is demoed as an automatic time-based
  sequence ≤ 6s and described in meta.motion ("on the live site: …"). Ambient loops only if slow (≥ 6s) and quiet.
- Never fabricate proof: no fake client logos, testimonials or results; illustrative data is labelled SPECIMEN.
- Legibility floors: body ≥ 15px; support ≥ 13.5px; caps labels & mono captions ≥ 11px when they carry meaning
  (tracked ≈ .18em per the Plurel system); decorative stamps ≥ 10px. No italics, no serif. Red is the signature — use it with intent (action, the one
  number that matters, a deliberate full-red moment), never as confetti.
- Corners: square by default (Swiss systems); any radius must be a deliberate direction choice.

## meta.json schema
{
  "title": "option name, 2–4 words",
  "direction": "A | B | C",
  "summary": "one sentence: what this option is and why it beats today",
  "reference": { "site": "…", "mobbin_url": "https://mobbin.com/…", "ref_file": "refs/<sec>-<opt>.webp",
                 "borrowed": "the composition/idea taken from the reference",
                 "kelwin": "what changed to make it Kelwin" },
  "motion": ["entrance: …", "ambient: …", "interaction: …", "on the live site: …"],
  "demoMs": 3500,
  "notes": "optional"
}

## Tool
`cd R && node tool/mk.mjs <sec> <A|B|C|all>` builds `R/site/m-<sec>-<opt>.html`, renders and lints it, and writes
`R/site/shots/<sec>-<opt>.png` (Swiss skin, final), `…-mid.png` (Swiss, entrance), `….k.png` (Kelwin skin),
`….json` (lint). Exit 1 = FAIL. Always Read the PNGs and judge with your own eyes — the lint is mechanical only.

## Mobbin
Load with ToolSearch: `select:mcp__Mobbin__search_sections,mcp__Mobbin__search_screens`. On EVERY call pass
output_destination "code" and task_intent exactly:
"Redesign a premium B2B advisory firm's marketing website using section references adapted to its own dark technical design language."
Previews come back inline in the same order as the JSON list; each is followed by `[Image: source: /path/….webp]`
— copy that local file for a reference you use (mobbin.com itself is blocked here; never curl image_url).
If a result carries `ai_usage_notice`, return its text verbatim to your caller. Photo-led references are fine
as COMPOSITION inspiration, but the Kelwin adaptation must replace the photo with type/diagram/data/colour.

## Quality bar (critics score 1–10 on each)
1. Proprietary, from zero — nothing reads as a template block or as today's Kelwin site. Precision, restraint,
   density where it earns it, ONE signature device per section.
2. True to its direction (R/DIRECTIONS.md) and recognisably adapted from its Mobbin reference.
3. Distinct from its sibling options — a different composition, not a recolour.
4. Swiss rigour — sits on the 12-col grid, confident type scale (wide display vs light accents vs mono labels),
   strong hierarchy, generous space, floors met, works in BOTH skins.
5. Motion — purposeful, slow, one orchestrated moment; no bounce, no gimmick.
6. Craft — aligned, consistent padding, nothing clipped/overlapping, SVG crisp, flat colour, nothing broken.
7. Conversion — the section's job (sections.json) is unmistakable; CTAs keep the two-door rule.
