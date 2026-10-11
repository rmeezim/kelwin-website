# Kelwin Website — Claude Code Operating Rules

## Company Context
Kelwin is a premium B2B GTM Partner & Advisory firm. It designs, installs and runs revenue architectures as a service:
- the narrative, channel and market intelligence systems that turn fragmented growth into repeatable pipeline;
- after handover, the system is the client's, run by their operator or by Kelwin on retainer.

Kelwin is not a cheap lead-generation agency. It is a revenue infrastructure, narrative strategy and GTM systems partner.

## Founder's standing rules (binding — they outrank everything below)
1. **No Plurel anywhere on the Kelwin website.** That means no sister-company line, no pointer, no link, and no visible copy. Code comments don't count.
2. **No "Fig." numbering anywhere.** No `FIG. 0n` captions, no title-block boxes, no figure meta in label rows. Drawings stand on their own.
3. **Primary buttons are the cut corner ("C").**
   - One 45° cut at the bottom-right, all caps, weight 600, no arrow.
   - Every page.
4. **No serif and no italics anywhere.**
   - Browser-default `<em>`/`<i>` italics are restyled to `font-style: normal` and weight 600.
   - The `--font-serif` token resolves to a sans face.
5. **Flat colour.**
   - No gradients, glow shadows, glass/backdrop blur or grain, except inside the hero film (`.km-film`).
   - The page-level `.site-grain` overlay is legacy and is not drawn on the homepage.
6. **No static pictures in the v5 system.**
   - Build with type, grid, flat colour, rules, numbers, inline-SVG drawings and motion.
   - The one exception is the hero film (see Homepage).
7. **Never fabricate proof.**
   - Illustrative artifacts are labelled as specimens.
   - Unpublished content carries an explicit status.
8. **Hero.**
   - "The Operating Feed" (mockup slot `hero/T`) is the hero.
   - "The Survey" (`hero/Z`) is on the bench for a possible later swap. Never delete it from `design/redesign`.

## Design system v5 — "Cinematic Drafting" (approved 2026-10)
The founder approved this system over six review rounds. Its mockups and notes live in `design/redesign/`, and that folder is the visual source of truth:
- `site/frag/<section>/<slot>.*` holds the section designs.
- `story-order.json` holds the approved homepage order.
- `CONTRACT.md` and `ROUND*-NOTES.md` hold the founder's verbatim notes.

Production implements the system in `src/styles/km-base.css` (tokens, surfaces, film) and `src/styles/km-kit.css` (the shared `.ac-*` kit).

### Colour
Base colours:

| Name | Value |
|---|---|
| graphite | `#141517` |
| graphite-2 | `#1C1D20` |
| graphite-3 | `#26272B` |
| paper | `#FBFAF6` |
| paper-2 | `#F2F0E9` |
| ink | `#110F0A` |
| red | `#BF3A36` (deep `#8E2824` for hover) |
| signal | `#E8564E` (small live marks on graphite) |
| blush | `#F2C9BF` |
| fog | `#B9BCC2` |

Surfaces:
- Every section root sets `data-surface="dark|light|red"`.
- Inner elements may set their own surface.

Semantic tokens:
- Sections use only these: `--bg --panel --panel-2 --fg --fg-2 --fg-3 --line --line-2 --accent --accent-hover --accent-fg --signal --soft --cool --data-1..3 --ok`.
- Never hard-code hex or font names inside a section.

On the red surface the accents invert: paper is the action colour, and red text sits on a paper button.

### Type
- **Mona Sans for everything.** It is the self-hosted variable font with a width axis.
- **Display** (headlines, big numbers):
  - `font-family: var(--f-display); font-stretch: var(--display-stretch) /*110%*/; font-weight: var(--display-weight) /*430*/;`
  - tracking −0.018em;
  - never bold.
- **Accent phrase:** the same font at weight 300 (`--light-weight`) in `--fg-2`. Exactly one per headline, never italic.
- **Labels above headings:** 11px, caps, weight 500, tracking .18em, led by an 8px signal square (`.ac-label`).
- **Captions and indexes:** JetBrains Mono, caps, 11–12px at the kit's tracking (`.ac-idx` .10em, `.ac-cap` / `.ac-meta` .12em, as approved in the mockups). Mono values are never prose.
- **Body:** 400 weight, 17px (support 15px, lede 20px) at the 1440 stage, line-height 1.5–1.55.
- **Legibility floors (hard):**
  - reading copy ≥15px;
  - support copy ≥13.5px;
  - any text ≥11px;
  - meaningful text never below `--fg-3` contrast.

### Grid & rhythm
- At 1440: a 12-column grid, 64px margins, 24px gutter.
- Tokens scale fluidly below 1440. Above it the stage caps at 1440 and centres.
- Sections pad with `--ac-pad-y`. They are separated by margin-to-margin hairlines (`.ac-sec--ruled`), never by background swaps.

### Kit (reuse; never invent parallel components)
- **Head grammar** (`.ac-head`): label row → two-voice statement (one `.ac-line` per line, one `.ac-accent`) → 48×2 red rule → lede → doors / note.
- **Lists:**
  - ledger rows that open in place (`.ac-ledger/.ac-row`);
  - strips (`.ac-strips`);
  - spec list (`.ac-spec`).
- **Figures:**
  - plate + caption band (`.ac-plate/.ac-capband`);
  - registration marks (`.ac-reg`);
  - callouts (`.ac-callout`);
  - dimension lines (`.ac-dim`);
  - 1px drawing classes for inline SVG (`.ac-s*`, `.ac-f-*`, `.ac-t-*`).
- **Controls:**
  - segmented control (`.ac-seg`);
  - `+`/`−` toggle (`.ac-toggle`);
  - chips (`.ac-chip`).
- **Actions, exactly three:**
  - `.ac-btn` is the cut-corner primary (red; paper on red surfaces).
  - `.ac-btn-o` is the outlined nav action ↗.
  - `.ac-link` is the underlined secondary →.
- **Brand:** the lockup and mark render as CSS masks (`.km-logo`, `.km-logo-mark`), never a typed "KELWIN". The mark is three solid pieces (K1–K3), not nested thin corners. It is never used as an illustration device.

### Motion
- **Entrances** play once, when a section scrolls into view.
  - Each homepage section sits in a `.km-slot` (the `Slot` client component), which gains `.is-play`.
  - Keyframe entrances are declared under `html.km-motion` and stay paused until the slot plays, so nothing flashes.
- **Behaviour.** A section's behaviour is an `init(root, { reduced })` function that returns a cleanup. That cleanup clears timers, removes listeners and kills GSAP, and React strict mode runs it twice in dev.
- **Feel:** slow and restrained. Fades, rises, line plots, hairline draws, hard film cuts.
  - No bounce, no heavy parallax, no 3D, no scroll-jacking.
  - GSAP + ScrollTrigger only where it earns its place, scoped to its own section.
- **`prefers-reduced-motion`** gives the final state immediately: no `.km-motion`, timers off, film still.

## Homepage (approved, in order)
| # | Section | Component | Mockup |
|---|---|---|---|
| 01 | Hero — The Operating Feed | `home/hero` | `hero/T` |
| 02 | The reframe | `home/reframe` | `reframe/U` |
| 03 | Structural evidence | `home/evidence` | `evidence/T` |
| 04 | The founder's letter | `home/letter` | `letter/S` |
| 05 | The system | `home/system` | `system/T` |
| 06 | Operating principle | `home/principle` | `principle/S` |
| 07 | The handover | `home/handover` | `handover/U` |
| 08 | Methodology (`#methodology`) | `home/method` | `method/U` |
| 09 | Who it's for | `home/fit` | `fit/U` |
| 10 | Final call to action | `home/cta` | `cta/U` |
| 11 | Footer (site-wide) | `layout/Footer` | `footer/U` |

**Hero film.**
- The hero's framed feed cuts between three takes, one per capability:
  - 01 Narrative Systems;
  - 02 GTM Infrastructure;
  - 03 GTM Intelligence.
- Until real footage is shot, each take is a crop of the frosted stand-in plate (`.km-film`), a placeholder.
- The takes are configured in one place so a real `<video>` per take drops in without layout changes.

**Copy.**
- Homepage copy is the approved mockup copy, verbatim.
- Change it only on the founder's instruction.

## Interior pages (legacy v4 until their own review rounds)
Interior pages still carry v4 "Warm Instrument" bodies:
- Instrument Sans / Inter;
- sand `#C7B49D` structure;
- clay `#A65A45` data;
- patina `#5E7D6C` state;
- steel `#6E8091` documents only;
- PageCommand photograph headers;
- ConvertPanel closers.

They share the v5 chrome: the Navbar, the Footer, and the cut-corner primary button.

When maintaining them, keep to their v4 patterns. Don't start new v4 work, and don't carry v4 devices into v5 sections. They will be redesigned in v5 through the same mockup → founder review → build loop.

## Conversion architecture (two doors, always)
- `/audit` is the high-intent path: a 3-question qualification waterfall that gates, then books the strategic call. Every red CTA leads to `/audit`.
- `/contact` is the low-intent general channel: questions, info requests, press, through a no-CRM mailto form. The hero secondary action leads to `/contact`.
- Never collapse the two doors into one "Get in touch".

## Technical Stack
- Next.js App Router (static export to GitHub Pages under a `basePath`), TypeScript, Tailwind CSS v4, plain co-located CSS for section styles.
- Motion for React and GSAP where animation needs them. Server components by default; client components only for behaviour.
- **Internal links use `next/link`.** Assets are imported or referenced relative from CSS, so they resolve under the `basePath`. A raw `href="/x"` or `url(/x)` breaks on GitHub Pages.
- Deploys run from `main` only (`.github/workflows/deploy-pages.yml`). Never push to `main` without the founder's go-ahead.

## Code Quality Rules
- Build reusable components, and don't hardcode repeated visual patterns.
- Semantic HTML, accessibility (focus states, labels, keyboard), responsive from the start (320 → 2560, no horizontal overflow).
- Clean file names; no one-file landing pages; no unnecessary packages.
- CSS variables and design tokens; subtle, performant animation; respect `prefers-reduced-motion`.

## Output Behavior
Before writing code, inspect the project. Then propose a short implementation plan and implement in small phases.

After each phase:
- summarize changed files;
- explain how to preview;
- list any issues or decisions.
