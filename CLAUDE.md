# Kelwin Website — Claude Code Operating Rules

## Company Context
Kelwin is a premium B2B GTM Partner & Advisory firm. It helps serious B2B companies turn inconsistent growth into institutional revenue infrastructure. Kelwin is not positioned as a cheap lead generation agency. It is positioned as a revenue infrastructure, narrative strategy, outbound intelligence, and GTM systems partner.

## Brand Direction
The website must feel:
- Authoritative
- Premium
- Minimal
- Intelligent
- Dark, cinematic, technical
- Enterprise-grade
- Quietly futuristic
- Not playful
- Not SaaS-template generic
- Not crypto/gaming/cyberpunk

The visual direction is inspired by a dark command-center interface:
- ONE DARK WORLD: every section lives on the deep charcoal (#110F0A)
  surface — sections are separated by hairline rules and mono protocol
  labels, never by background-color swaps. The bone canvas (#ECE8DF) is
  reserved for rare inverted moments, not for whole sections.
- Fine grid lines
- Small protocol labels
- Thin borders
- Signal red (#BF3A36 / #D4524E on dark) leading accent, bronze
  (#D18E53) instrument trim
- Large elegant typography
- Subtle technical HUD details
- Slow, restrained motion

Kelwin is the sister company of Plurel (creative/performance division —
bone canvas, near-black ink, the same deep red, rounded & friendly).
Kelwin shares the bone canvas, ink, and signal red, but expresses them
with sharp corners, corner brackets, mono protocol labels, and dense
HUD instrumentation. Same ingredients, different posture.

## Color System (v2 — "Signal Red")
Use these tokens:
- Surface: #110F0A
- Near Black: #08090A
- Canvas: #ECE8DF
- Text Primary: #FFF8F5
- Text Muted: rgba(255,248,245,0.62)
- Text Faint: rgba(255,248,245,0.38)
- Signal Red: #BF3A36 (primary accent — action, live state, emphasis)
- Signal Red Bright: #D4524E (red for small elements on dark surfaces)
- Signal Red Deep: #97302D (hover/pressed shade on bone)
- Intelligence Bronze: #D18E53 (demoted to instrument trim — hairlines,
  calibration marks, secondary metadata; never signal duty)
- Border Subtle: rgba(255,248,245,0.12)
- Border Warm: rgba(209,142,83,0.32)

Red discipline:
- On bone/canvas, red is a poster: confident fills, CTAs, stat moments,
  the protocol seam strips between dark and light sections.
- On charcoal, red is a signal: thin 2px edges, live dots, underlines,
  one active element at a time — never a large fill or background.
- Small red text on charcoal uses #D4524E; raw #BF3A36 sinks below
  comfortable contrast on #110F0A.
- One red moment per viewport. Two competing reds means neither signals.
- Signature motif: dot-matrix (cell-built) numerals for one hero reading
  per section — technical, characterful, never used for body data.

## Typography
Use:
- Instrument Sans for headings and UI
- Inter for body copy if needed
- Large headings should be elegant, spacious, and premium
- Avoid overly rounded, childish, or startup-template typography

## Technical Stack
Use:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Motion for React animations
- Componentized architecture
- Server components by default
- Client components only where animation/interactivity requires it

## Code Quality Rules
- Build reusable components.
- Do not hardcode repeated visual patterns.
- Use semantic HTML.
- Keep accessibility in mind.
- Use responsive design from the beginning.
- Use clean file names.
- Avoid messy one-file landing pages.
- Avoid unnecessary packages.
- Use CSS variables/design tokens where appropriate.
- Keep animations subtle and performant.
- Respect prefers-reduced-motion.

## Homepage Sections
Build the homepage in this order:
1. Hero / system command interface
2. The Problem: revenue entropy
3. The Kelwin MFS Foundry
4. Kelwin Operating principles
5. System implementation methodology
6. Infrastructure Layer: narrative, data, deliverability, systems
7. Who Kelwin is for
8. Operating Model / Pod structure
9. The Lab / GTM intelligence product vision
10. Proof / credibility / founder note placeholder
11. Insights preview
12. Final CTA
13. Footer

## Animation Direction
Use restrained animations only:
- Soft fade-ins
- Slow line reveals
- Tiny grid pulses
- Hover states
- Cursor-following ambient light
- Subtle number/data transitions
- Section entrance animations
- No cartoon effects
- No bouncy animations
- No excessive parallax
- No heavy 3D

## Output Behavior
Before writing code, inspect the project.
Then propose a short implementation plan.
Then implement in small phases:
1. Foundation/design tokens
2. Layout shell
3. Hero section
4. Reusable components
5. Remaining homepage sections
6. Responsive optimization
7. QA and cleanup

After each phase:
- Summarize changed files
- Explain how to preview
- List any issues or decisions