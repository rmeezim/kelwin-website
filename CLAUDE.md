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
- Black/deep charcoal background
- Fine grid lines
- Small protocol labels
- Thin borders
- Bronze/red accent details
- Large elegant typography
- Subtle technical HUD details
- Slow, restrained motion

## Color System
Use these tokens:
- Surface: #110F0A
- Near Black: #08090A
- Canvas: #ECE8DF
- Text Primary: #FFF8F5
- Text Muted: rgba(255,248,245,0.62)
- Text Faint: rgba(255,248,245,0.38)
- Intelligence Bronze: #D18E53
- Action Red: #BF3A36
- Border Subtle: rgba(255,248,245,0.12)
- Border Warm: rgba(209,142,83,0.32)

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
3. The Kelwin Methodology / MFS Foundry
4. Infrastructure Layer: narrative, data, deliverability, systems
5. Who Kelwin is for
6. Operating Model / Pod structure
7. The Lab / GTM intelligence product vision
8. Proof / credibility / founder note placeholder
9. Insights preview
10. Final CTA
11. Footer

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