# Kelwin homepage redesign — design sources

The source of the homepage redesign the founder reviewed over six rounds (2026-09 → 2026-10).
Every section of the homepage is approved as of the round-6 review. These are HTML/CSS/JS mockups,
not production code. The Next.js site in `src/` is unchanged by them.

## Current homepage (approved)

| # | Section | Slot |
|---|---|---|
| 01 | Hero — "The Operating Feed" | `hero/T` |
| 02 | The reframe | `reframe/U` |
| 03 | Structural evidence | `evidence/T` |
| 04 | The founder's letter | `letter/S` |
| 05 | The system | `system/T` |
| 06 | Operating principle | `principle/S` |
| 07 | The handover | `handover/U` |
| 08 | Methodology | `method/U` |
| 09 | Who it's for | `fit/U` |
| 10 | Final call to action | `cta/U` |
| 11 | Footer | `footer/U` |

The order lives in `story-order.json`. `site/home-r7.html` is that homepage stitched into one page. Serve
`site/` over HTTP to view it; it loads `fonts/`, `lib/` and `img/` relative to itself.

**On the bench:** `hero/Z` — "The Survey" (round-6 Option 4). The founder is keeping it as a swap
candidate. Never delete or overwrite it. To try it, use
`python3 tool/home.py --slot hero=Z --out home-z.html`, or set the hero slot to `Z` in `story-order.json`.

## Layout

- `site/frag/<section>/<SLOT>.{html,css,js,meta.json}` — one section design per slot. Older slots
  are the earlier rounds' versions, kept for reference.
- `site/base.css`, `site/kit-ac.css` — tokens, skins and the shared `.ac-*` kit (the cut-corner button is `.ac-btn`).
- `site/fonts`, `site/brand`, `site/lib`, `site/img` — self-hosted fonts, the logo, GSAP 3.12.5 + ScrollTrigger,
  and the `film-room.webp` stand-in plate. That plate is a placeholder until real footage is shot.
- `tool/` — the harness:
  - `mk.mjs <sec> <SLOT>` builds one section with shots and a lint check.
  - `home.py` stitches the homepage.
  - `walk.mjs <file>` walks it viewport by viewport.
  - `promote.py` copies a slot.
  - `assemble*.py` and `selector*.template.html` are the per-round review pages.
  - Run `npm install` in `tool/` for Playwright.
- `work/` — the SVG generators behind some sections (e.g. `handover-U/gen.mjs`).
- `CONTRACT.md` — the founder's binding rules:
  - no Plurel anywhere on the site;
  - no "Fig." labels;
  - cut-corner caps buttons;
  - no serif or italics;
  - no gradients outside the film.
- `STORY.md`, `ROUND*-NOTES.md` — the homepage story and the founder's verbatim notes from each round.
