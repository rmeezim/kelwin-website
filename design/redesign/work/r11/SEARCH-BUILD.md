# Being found: the builders' checklist

Round 11 · 19 October 2026 · our list for building what SEARCH.md describes. Not for the founder's review.

The plan in plain words is SEARCH.md; the pages and addresses are in SITEMAP.md. This file was the appendix of SEARCH.md
until this revision.

**Today.** Next.js 16.3.8 on the working branch (16.2.4 on `main` until the next deploy; SECURITY.md, Part 1), static
export (`output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`), built for GitHub Pages under the
base path `/kelwin-website` from a repository on a personal account. The repository is private since 19 October
2026, and GitHub Pages serves nothing from a private repository on the free plan, so the preview is dark and a deploy
from `main` has nowhere to publish until the hosting changes.

**Proposed by the work on what sits behind the site.** Cloudflare Workers with static assets for kelwin.co, a small
form handler on the same address, and the repository moved into a GitHub organization in Kelwin's name
(DECISIONS.md, decision 13). Where
an item differs by host, both are written. "Read at source" means checked in the Next.js documentation shipped in
`node_modules/next/dist/docs/`, in Next's own code, or in Cloudflare's documentation source.

## A0 · The cutover, one sequence with the work on what sits behind the site

**Done, and next (SITEMAP decision 2, settled; DECISIONS.md, decision 13).**
1. Done on 19 October 2026: the repository is private, on the founder's personal account. GitHub Pages stops serving
   on the free plan, so the preview is dark and the github.io addresses answer 404.
2. Next, if the founder agrees: he creates the Kelwin GitHub organization (with a passkey) on GitHub Team, and the
   repository moves into it with its history. A transfer also changes the github.io address; whether GitHub forwards
   the old Pages address is not checked, so we assume it doesn't.
3. Only if the founder chooses decision 13's interim preview: Pages from the private repository on GitHub Team (the
   site itself is still public there), with a "do not index" tag on every preview page through a build flag (A7).
4. What was public stays seen. Forks, clones, caches and crawls keep it. We promise no history rewrite.

**Before launch.**
5. Every dev-branch build deploys to a private preview address behind Cloudflare Access, with `X-Robots-Tag: noindex`
   on every response.

**At launch.**
6. kelwin.co on Workers static assets, with `NEXT_PUBLIC_BASE_PATH` empty and `metadataBase` set (A1).
7. The old github.io addresses stay 404. They were dark or hidden since step 2, and nothing public links to them. The
   alternative, only if the founder asks: a tiny separate public repository holding one forwarding page per old path
   (A13's pattern) and nothing else.
8. The launch-day checks in A18.

**The rule either way:** every address in SITEMAP section 4 is final before launch. No renames after.

## A1 · Domain and base address

- [ ] Serve the site at `https://kelwin.co/` with **no base path**: `NEXT_PUBLIC_BASE_PATH` empty in the publishing job
  on the day kelwin.co goes live.
- [ ] `metadataBase: new URL("https://kelwin.co")` in `src/app/layout.tsx`. Next.js joins every relative metadata
  address to it, and a relative image address without it fails the build (read at source, `generate-metadata.md`).
- [ ] `lang="en"` stays on `<html>`. No hreflang: one language, one version of each page.

## A2 · Titles and descriptions

- [ ] Root layout: `title: { template: "%s · Kelwin", default: "Kelwin · GTM systems partner" }` (the phrase as the
  founder approves it on the message sheet). The template applies to child pages, not to the page that defines it
  (read at source).
- [ ] Each page sets only its own part, in buyer words (Appendix B). About 60 characters at most (inferred; Google's
  title guide not checked).
- [ ] Rewrite every description from the approved copy, one or two sentences. Today's are stale: Contact "no CRM, no
  sequence"; Privacy "No cookies, no trackers, no analytics"; The Lab "the Early Access Protocol"; About "the founder's
  memo"; Careers "the bench list".
- [ ] No title or description carries the legal suffix, names a person or shows a price.
- [ ] Where a title needs a word the voice keeps for something else, use it only as Appendix B lists, after the voice
  work approves it.

## A3 · Canonical addresses

- [ ] Every page: `alternates: { canonical: "/<path>/" }`, with the trailing slash, matching sitemap.xml and the
  internal links.
- [ ] Links with a chosen reason (`/contact/?topic=launch`, `/contact/?topic=correction`) carry the plain `/contact/`
  canonical.
- [ ] The `/capabilities/` forward names `/` as its canonical (A13).

## A4 · sitemap.xml

- [ ] `src/app/sitemap.ts`, static by default, written as a file by the export (read at source: `sitemap.md`,
  `static-exports.md`).
- [ ] Only pages meant to be found, by their canonical address (Appendix B, "yes").
- [ ] `lastModified` from real dates: each note's updated date, and each page's last real content change from one data
  file. Never the build date on every page. Google ignores `priority` and `changefreq` (as reported).
- [ ] Leave out `/confirmed/`, `/admin/`, the 404 page, the `/capabilities/` forward, the confirmation screens,
  `/preview/*` and the feed.

## A5 · robots.txt

- [ ] `src/app/robots.ts`, static by default (read at source: `robots.md`). Draft in Appendix C.
- [ ] Allow everything; name the sitemap.
- [ ] Never block `/confirmed/` or `/admin/` here. A blocked crawler can't see their "do not index".
- [ ] If the founder declines training crawlers (decision 3), add one group per training crawler (GPTBot, ClaudeBot,
  Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent) with `Disallow: /`. Search crawlers stay allowed
  either way.
- [ ] **On Cloudflare:** the managed robots.txt and the "Block AI bots" setting must be off, or set to match decision 3.
  When on, the managed file adds rules blocking GPTBot, ClaudeBot, CCBot and Google-Extended (read at source,
  Cloudflare's documentation). The optional line `Content-Signal: search=yes, ai-input=yes, ai-train=yes` states the
  same choice; obeying it is voluntary (read at source).

## A6 · llms.txt

- [ ] `public/llms.txt`, written by hand, about 40 lines, from the approved facts (draft in Appendix C).
- [ ] It says nothing the site doesn't: no prices, no names, no terms still being set (the pilot options, the revenue
  share).
- [ ] It carries Scaling's status exactly as DECISIONS.md, decision 2 sets it, and the term as the offer words it.
- [ ] Reviewed whenever a listed page changes. "None published yet" changes the day the first report clears.
- [ ] Lowest priority: dropped first if launch is tight.

## A7 · "Do not index"

- [ ] `/confirmed/`: `robots: { index: false, follow: true }` in its metadata, **and on Workers** an
  `X-Robots-Tag: noindex` header for `/confirmed/*` from `public/_headers`.
- [ ] `/admin/` (the notes editor): the same tag and header. It also gets its own narrow security policy (the blogging
  system's plan).
- [ ] Preview deployments and the `*.workers.dev` address: `X-Robots-Tag: noindex` on every response, or the
  `workers.dev` route disabled (`workers_dev = false`) and preview addresses kept behind Cloudflare Access.
- [ ] The export writes plain-text payload files beside every page (`index.txt`, `__next.*.txt`; seen in a local build's
  `out/`). They can be fetched as text and may be crawled (inferred). On Workers, send `X-Robots-Tag: noindex` for
  them. Check whether `_headers` can match by file ending; if not, the Worker adds the header to paths ending `.txt`,
  except `robots.txt`, `llms.txt`, `.well-known/security.txt` and the IndexNow key file.
- [ ] On GitHub Pages (no headers): page tags only. The preview's "do not index" comes from a build flag and is **off
  on kelwin.co**, or kelwin.co hides itself.

## A8 · Code for machines (structured data)

- [ ] JSON-LD in a `<script type="application/ld+json">` from the page or layout, built with
  `JSON.stringify(data).replace(/</g, "\\u003c")`, so every `<` is written as `\u003c` (read at source: `json-ld.md`).
- [ ] **On every page** (from the root layout), the firm:
  - `@type: Organization`, `@id: https://kelwin.co/#org`, `name: Kelwin`, `url: https://kelwin.co/`;
  - `logo`: a square image of the mark that Google can fetch (size not checked against Google's logo rules);
  - `description`: the approved one line;
  - `email: audit@kelwin.co`;
  - `address`: `PostalAddress` with `addressLocality: New York`, `addressRegion: NY`, `addressCountry: US`, and no
    street;
  - `foundingDate`, once confirmed;
  - `sameAs`: the LinkedIn company page now; X, Instagram and Crunchbase as they arrive.
  - **Never** `legalName`, `founder`, `employee`, `numberOfEmployees`, `aggregateRating` or `review`.
- [ ] **Homepage:** `WebSite` with `name: Kelwin` and `url` (Google's site-name guide, as reported). No search action.
- [ ] **Capability pages, each package section on Engagements, and each fixed-scope engagement:** `Service` with
  `name` in buyer words, `description` (the page's opening sentence), `provider: { "@id": "https://kelwin.co/#org" }`,
  `url`. No `offers`, no price. **Scaling's `description` carries its status** as DECISIONS.md, decision 2 sets it
  ("not yet taking clients", as proposed, or "by arrangement"), or Scaling has no `Service` if it is left off.
- [ ] **Field notes:** `BlogPosting` with `headline`, `description`, `datePublished` and `dateModified` (the dates the
  page shows), `author: { "@type": "Organization", "name": "Kelwin", "url": "https://kelwin.co/about/" }`,
  `publisher: { "@id": "https://kelwin.co/#org" }`, `image` (the preview card), `articleSection` (the topic),
  `mainEntityOfPage` (Google's article guide, as reported). The author is the firm. The page shows no byline (the
  founder's round-8 decision), so nothing visible disagrees with it.
- [ ] **Reports,** once real: `Article`, the same fields, the client unnamed unless they approved it.
- [ ] **BreadcrumbList only where the page shows a visible trail** in its label row (for example Engagements ›
  Fixed-scope engagements › Email deliverability). If the design shows no trail on a page, that page carries no
  breadcrumb code.
- [ ] **Not used:** `FAQPage` (no Google feature since 7 May 2026, as reported), `LocalBusiness` or
  `ProfessionalService` (a place customers visit), `Review`, `AggregateRating`, `JobPosting` (unless role pages come
  forward).
- [ ] Check every kind of page with Google's Rich Results Test and the Schema Markup Validator.

## A9 · Preview cards

- [ ] One per page: `opengraph-image` per route, generated at build time (static by default; read at source,
  `opengraph-image.md`), or one shared generator fed the headline.
- [ ] **The font.** Next's image generator "only supports ttf, otf and woff" (read at source, `image-response.md`), and
  it can't set the variable width axis. The site ships only `src/app/fonts/MonaSans.woff2`. Add a static TTF or OTF
  instance of Mona Sans at the display width (110%) and weight (430), used only by the card generator. Mona Sans is
  published under the SIL Open Font License (our knowledge), which allows a static instance; confirm in the font's own
  licence file. Check one card's output before launch.
- [ ] Made from the page's headline in type and flat color. No photographs, no gradients.
- [ ] `og:title`, `og:description`, `og:url` (the canonical address), `og:type` (`website`, or `article` for notes and
  reports), `og:site_name: Kelwin`; `twitter:card: summary_large_image`.
- [ ] Image 1200×630 (inferred; to check). After launch, check a shared link in LinkedIn's Post Inspector.

## A10 · The feed

- [ ] `/insights/feed.xml` from a GET route handler, written at build time (read at source: `static-exports.md`).
- [ ] For each note: title, link, a stable id, the published date, the opening paragraph (not the whole note), author
  "Kelwin".
- [ ] `<link rel="alternate" type="application/rss+xml">` in the head of Insights and every note.

## A11 · The field-note page

- [ ] The published date and, only if changed, the updated date, each in a `<time datetime>`.
- [ ] No byline (the founder's round-8 decision). A link to `/insights/standards/`, which says who drafts and checks
  the notes.
- [ ] Read time; the topic (The system, Narrative Systems, GTM Infrastructure, GTM Intelligence); a sources list with
  links and the date each was read; three related notes (same topic first, then newest).
- [ ] Share links as plain addresses (LinkedIn's share address, X's post address, `mailto:`, copy link). No
  third-party share scripts.
- [ ] "Report an error" → `/contact/?topic=correction`.
- [ ] The sign-up; the red audit door; quiet links to the matching fixed-scope engagement and the capability page.
- [ ] On each capability page, the notes list renders only when its topic has a note. Its link reads "All field notes"
  → `/insights/` until the filters exist (nine notes), then "All notes on [capability]" → the filter.

## A12 · Text for machines

- [ ] Fix the five joined headlines: one space between line pieces in the shared headline code (homepage: "Most teams
  are fixing the wrong layer.", "Four numbers. One diagnosis.", "Three layers. One closed loop.", "If we leave, the
  system stays."; audit: "Straight answers, before the call."). Check the exported HTML's text, not the screen.
- [ ] Every fact in a drawing, film or animation also in text nearby.
- [ ] Rows that open in place keep their content in the HTML, hidden by CSS until opened, never added by script on
  click.
- [ ] No text that appears only after a script runs. Check by reading the exported HTML in `out/`.
- [ ] **The contact form reads `?topic=` in the browser.** Keep that in a small client component wrapped in
  `<Suspense>`, with the form's labels, reasons and text rendered on the server. A page-level `useSearchParams` in a
  static export pushes the page to the client and the form's text drops out of the exported HTML.
- [ ] Internal links are real `<a href>` links through `next/link`, with text that says where they go. Every page
  meant to be found is linked from at least one other page.
- [ ] Specimen blocks: the word "Specimen" in the same block as any illustrative number, and `data-nosnippet` on the
  block (as reported).
- [ ] Pictures that carry meaning get a plain alt text ("Stand-in: a frosted crop of the hero film"); decorative ones
  get `alt=""`. Text in drawings stays real text in inline SVG.

## A13 · Forwards and addresses

- [ ] Every address in SITEMAP section 4 is final before launch. `/projects/` was never public and needs no forward.
- [ ] **`/capabilities/`** forwards at once to `/#s-system`. Next's `redirect()` writes
  `<meta http-equiv="refresh" content="1;url=…">`, a one-second, temporary refresh; only `permanentRedirect()` writes
  `0` (read at source: `next/dist/server/app-render/make-get-server-inserted-html.js`). So build it with
  `permanentRedirect("/#s-system")`, or a hand-written page with `<meta http-equiv="refresh" content="0;url=/#s-system">`,
  a canonical to `/` and a visible link. Check the exported `out/capabilities/index.html` for `content="0;`.
- [ ] **On Workers**, write it as a real 301 in `public/_redirects` instead (Cloudflare's default status is 302, as
  reported), and keep the HTML page as the fallback. Whether `_redirects` is honored on Workers static assets is
  reported by one source only; check.

## A14 · Page not found

- [ ] `not-found.tsx` is exported as `404.html`.
- [ ] **On Workers:** `assets.not_found_handling = "404-page"` in the Wrangler config, or unknown addresses don't get
  the page (Cloudflare's documentation source, read at source in this round's review). On GitHub Pages, `404.html` is
  served for unknown addresses (as reported).
- [ ] **On Workers:** `assets.html_handling` set so `/about` redirects to `/about/` and `/about/` serves
  `about/index.html`, matching `trailingSlash: true` and the canonical addresses. The default, `auto-trailing-slash`,
  should do this for folder-style output; check against `out/`, or set `force-trailing-slash`.
- [ ] After launch, `curl -I https://kelwin.co/made-up-address/` answers 404, not 200.
- [ ] Its line "…go straight to where every engagement begins." is reworded (SITEMAP section 6).

## A15 · Speed

- [ ] Targets, on real visits: main content within 2.5 s, a response to a tap within 200 ms, layout shift 0.1 or less
  (web.dev, as reported).
- [ ] The page turn: as the look decision sets it. Measured on the look work's films: click to uncovered page about
  1.37 s at 1440 and 1.28 s on a 390 phone; on arrival from outside, the lift about 0.70–0.79 s after the load starts.
  We recommend no turn on arrival from outside.
- [ ] Entrance animations never leave the headline invisible.
- [ ] The hero film and the globe load after the headline.
- [ ] Every image has a set width and height. The export doesn't optimize images, so serve sized WebP files by hand.
- [ ] PageSpeed Insights before launch; Search Console's speed report once there is enough traffic.

## A16 · Consoles, sending new pages, analytics, security file

- [ ] Google Search Console: verify kelwin.co as a domain (a DNS record); submit the sitemap.
- [ ] Bing Webmaster Tools: verify (it can import from Search Console); submit the sitemap.
- [ ] IndexNow: send changed addresses to Bing and the others on every publish. It doesn't reach Google. **It needs a
  key file served at the root** (`public/<key>.txt`, whose content is the key), kept out of the noindex rule in A7.
- [ ] Analytics: the "AI assistants" source group (chatgpt.com, chat.openai.com, claude.ai, perplexity.ai,
  gemini.google.com, copilot.microsoft.com, duck.ai, meta.ai, chat.mistral.ai, grok.com, chat.deepseek.com,
  notebooklm.google.com; Matomo's list, read at source); record `utm_source=chatgpt.com` if it appears (not checked).
- [ ] Forms: "An AI assistant (ChatGPT, Claude, Perplexity, Gemini, Copilot)" in "How did you hear about us?" on the
  audit and contact forms, stored in the CRM. "A correction" as a contact reason, stored as its own kind in the CRM.
- [ ] **security.txt** at `public/.well-known/security.txt` (draft in Appendix C). Check that the export copies the
  `.well-known` folder into `out/` and that the host serves it.

## A17 · The new host's own settings (Cloudflare)

- [ ] The managed robots.txt and AI-bot blocking set to match decision 3 (A5).
- [ ] `workers_dev = false`, or `X-Robots-Tag: noindex` on the `*.workers.dev` address, so it is not a second public
  copy (A7).
- [ ] Preview addresses behind Cloudflare Access, with `X-Robots-Tag: noindex`.
- [ ] `not_found_handling` and `html_handling` as in A14.
- [ ] `_headers` carries the security plan's headers, plus the noindex rules in A7.

## A18 · Before go-live

- [ ] Every page has its own title, description, canonical and preview card.
- [ ] sitemap.xml lists exactly the pages in Appendix B marked "yes"; robots.txt, llms.txt, security.txt and the
  IndexNow key are at the root (security.txt under `.well-known/`).
- [ ] No page shows the legal suffix, names a person or shows a price, in its text, its code for machines or its
  preview card.
- [ ] The Rich Results Test passes for the homepage, one capability page, one fixed-scope engagement and one note.
- [ ] The 404 check passes; `/about` redirects to `/about/`; `/confirmed/`, `/admin/` and the `.txt` payloads send
  noindex; the `workers.dev` address is off or hidden; the preview's "do not index" flag is off on kelwin.co.
- [ ] Search Console and Bing Webmaster Tools verified, the sitemap submitted to both.
- [ ] Two weeks after launch: in Search Console, look for any `.txt` address or `workers.dev` address listed, and fix
  the rule that let it through.

## Appendix B · Page by page

Titles are drafts in buyer words, written with each page's copy; " · Kelwin" is added by the template. "Code" names
the structured data beyond the firm's block on every page. "Breadcrumb" applies only if the page shows a visible
trail (A8).

| Address | Draft title | Code | In sitemap.xml |
|---|---|---|---|
| / | Kelwin · GTM systems partner | WebSite | Yes |
| /capabilities/narrative-systems/ | Narrative Systems: positioning, messages and proof as one system | Service, Breadcrumb | Yes |
| /capabilities/gtm-infrastructure/ | GTM Infrastructure: CRM, signals, outreach and deliverability | Service, Breadcrumb | Yes |
| /capabilities/gtm-intelligence/ | GTM Intelligence: what's working, reviewed every quarter | Service, Breadcrumb | Yes |
| /capabilities/ | (forward) | — | No |
| /engagements/ | Engagements: how working with Kelwin works | Service (one per engagement; Scaling per DECISIONS.md, decision 2), Breadcrumb | Yes |
| /engagements/fixed-scope/ | Fixed-scope engagements (the family's final name): one part of the system, on its own | Breadcrumb | Yes |
| /engagements/email-deliverability/ | Email deliverability audit and repair \* | Service, Breadcrumb | Yes |
| /engagements/positioning-and-messaging/ | B2B positioning and messaging | Service, Breadcrumb | Yes |
| /engagements/icp-and-signal-map/ | Ideal customer profile and buying signals | Service, Breadcrumb | Yes |
| /engagements/crm-setup-plan/ | CRM setup plan: pipeline stages, fields and clean-up rules \* | Service, Breadcrumb | Yes |
| /engagements/operating-model/ | The operating model: your GTM plan, written down | Service, Breadcrumb | Yes |
| /engagements/win-loss-interviews/ | Win/loss interviews with your recent buyers | Service, Breadcrumb | Yes |
| /engagements/cold-email/ | Cold email setup, built for your team to run \* | Service, Breadcrumb | Yes, if launched |
| /engagements/conference-activation/ | Conference activation: meetings set before the show \* | Service, Breadcrumb | Yes, if launched |
| /engagements/executive-dinners/ | Executive dinners for your target accounts | Service, Breadcrumb | Once its page exists |
| /about/ | About Kelwin | Breadcrumb | Yes |
| /who-we-work-with/ | Who we work with | Breadcrumb | Yes |
| /careers/ | Careers | Breadcrumb | Yes |
| /the-lab/ | The Lab: the platform we're building | Breadcrumb | Yes |
| /insights/ | Field notes | Breadcrumb | Yes |
| /insights/revenue-entropy/ | Its headline | BlogPosting, Breadcrumb | Yes |
| /insights/the-17-percent-window/ | Its headline | BlogPosting, Breadcrumb | Yes |
| /insights/deliverability-is-infrastructure/ | Its headline | BlogPosting, Breadcrumb | Yes |
| /insights/agency-hire-fractional-or-partner/ | An agency, a hire, a fractional leader or a partner: how to choose | BlogPosting, Breadcrumb | Yes |
| /insights/standards/ | How we research and write | Breadcrumb | Yes |
| /insights/glossary/ (soon after) | Glossary of Kelwin's terms | Breadcrumb | Yes, once live |
| /insights/feed.xml | (the feed) | — | No |
| /reports/ | Reports: Kelwin's client case studies \* | Breadcrumb | Yes |
| /contact/ | Talk to the team | Breadcrumb | Yes |
| /audit/ | The System Audit: a review of how you sell, with no fee | Service, Breadcrumb | Yes |
| /privacy/ | Privacy | — | Yes |
| /terms/ | Terms | — | Yes |
| /confirmed/ | Sign-up confirmed | — (do not index) | No |
| /admin/ | (the notes editor) | — (do not index) | No |
| (page not found) | Page not found | — | No |

**\* Titles that need a word the voice keeps for something else.** Each is for the voice work to approve or replace.

| Title | The word | Why search needs it | The voice's rule |
|---|---|---|---|
| Email deliverability audit and repair | "audit" | Buyers type "email deliverability audit" | "Audit" names only the System Audit. Proposed: in the title only, never in the page's copy |
| CRM setup plan | "setup" | Buyers type "CRM setup"; the name was approved in round 10 | The voice's rule is on "set up" as our task verb, not on a name the founder approved. Kept; every document now uses it |
| Cold email setup, built for your team to run | "setup" | Buyers type "cold email setup" | As above. Alternative: "Cold email, built for your team to run" |
| Conference activation: meetings set before the show | "meetings" | Buyers look for meetings at a show | No "meetings" in a headline. Alternative: "Conference activation, before the show" |
| Reports: Kelwin's client case studies | "case studies" | Buyers type "case studies"; the founder calls them that | "Case study" is on the never list. Proposed: in the title only; the page says "Reports" |

## Appendix C · Drafts

### robots.txt (for kelwin.co)

```
# kelwin.co · robots.txt
# Search engines and AI assistants are welcome to read the public site.
User-agent: *
Allow: /

Sitemap: https://kelwin.co/sitemap.xml
```

### llms.txt

Facts in square brackets to confirm. The summary's wording comes from the voice work and the message sheet, and must
match the site word for word.

```
# Kelwin

> Kelwin is a GTM systems partner for B2B companies. We build and run the system behind what their buyers hear, whom
> they approach and why their deals close. It lives in their own accounts and documents.

- Its three parts, run as one system: Narrative Systems, GTM Infrastructure and GTM Intelligence.

- Name: Kelwin. Registered in Delaware. Address: New York, New York, USA. Founded [year to confirm].
- Who it is for: B2B companies with real revenue whose growth has to be rebuilt every few quarters. Not for
  pre-revenue companies, or products bought only at a checkout.
- How work starts: the System Audit, with no fee: a 30-minute first call, ten working days, then the readout
  presented on a 60-minute call.
- Launch, Growth and Scaling [the retained engagements, the name in DECISIONS.md, decision 1]: the whole system, run
  on a retainer. Six months is recommended; the first three are the pilot, which ends at day 90 with a written
  readout. Month to month is also possible. [Scaling: as DECISIONS.md, decision 2 sets it, for example "not yet
  taking clients".]
- Fixed-scope engagements [the family's final name]: one part of the system at a fixed fee, set in a written scope.
  Each begins with a free scope check.
- Prices are not published. The starting price is given on the first call.
- Kelwin speaks as a firm. Client case studies (Reports) are published only with the client's written approval.
- Contact: audit@kelwin.co for the System Audit; https://kelwin.co/contact/ for anything else.

## The firm
- [About](https://kelwin.co/about/): what Kelwin believes and how the firm is built
- [Engagements](https://kelwin.co/engagements/): how working with Kelwin works, and Launch, Growth and Scaling
- [Who we work with](https://kelwin.co/who-we-work-with/): the situations Kelwin is built for, and who it turns away

## What Kelwin builds
- [Narrative Systems](https://kelwin.co/capabilities/narrative-systems/): positioning, messages and proof as one written system
- [GTM Infrastructure](https://kelwin.co/capabilities/gtm-infrastructure/): which accounts to approach, and when, built into the client's own CRM and tools
- [GTM Intelligence](https://kelwin.co/capabilities/gtm-intelligence/): the weekly and quarterly review of what is working

## Ways to start
- [The System Audit](https://kelwin.co/audit/): ten working days, a written readout presented on a call
- [Fixed-scope engagements](https://kelwin.co/engagements/fixed-scope/): one part of the system, on its own
- [Email deliverability](https://kelwin.co/engagements/email-deliverability/)
- [one line per fixed-scope engagement that launches]

## Field notes
- [Revenue entropy](https://kelwin.co/insights/revenue-entropy/): why pipeline problems rarely start in the pipeline
- [The 17% window](https://kelwin.co/insights/the-17-percent-window/): why the buyer's champion has to retell your pitch
- [Deliverability is infrastructure](https://kelwin.co/insights/deliverability-is-infrastructure/): how replies fall while every send shows as delivered
- [How to choose help](https://kelwin.co/insights/agency-hire-fractional-or-partner/): an agency, a hire, a fractional leader or a partner
- [How we research and write](https://kelwin.co/insights/standards/)

## Optional
- [Reports](https://kelwin.co/reports/): client case studies; none published yet
- [The Lab](https://kelwin.co/the-lab/): the platform Kelwin is building; waitlist open
- [Careers](https://kelwin.co/careers/)
- [Privacy](https://kelwin.co/privacy/) · [Terms](https://kelwin.co/terms/)
```

### security.txt (at /.well-known/security.txt)

```
Contact: mailto:security@kelwin.co
Expires: [one year after launch, as an ISO 8601 date]
Preferred-Languages: en
Canonical: https://kelwin.co/.well-known/security.txt
Policy: https://kelwin.co/engagements/#security
```

`security@kelwin.co` is the alias BACKEND.md (3.8) sets up, delivered to audit@ and read by whoever holds it that
day. The Policy line points to "Security and access" on Engagements; its anchor
follows the built page.

## Sources

- Next.js 16.2.4 documentation in `node_modules/next/dist/docs/01-app/` (read at source): static exports, JSON-LD,
  sitemap, robots, Open Graph images, `ImageResponse`, generateMetadata.
- Next.js code: `node_modules/next/dist/server/app-render/make-get-server-inserted-html.js` (read at source): the
  refresh delay is `0` for a permanent redirect and `1` otherwise.
- Cloudflare's documentation source on raw.githubusercontent.com (read at source in this round's review): Workers
  static assets (`not_found_handling`, `html_handling`), and the managed robots.txt and content signals
  (github.com/cloudflare/cloudflare-docs, bots/additional-configurations/managed-robots-txt.mdx).
- Cloudflare redirects and headers: developers.cloudflare.com/pages/configuration/redirects/;
  developers.cloudflare.com/pages/platform/headers/ (as reported).
- GitHub Pages custom 404: docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site
  (as reported). GitHub Pages and response headers: github.com/orgs/community/discussions/84963 (as reported).
- Google's guides on structured data, sitemaps, site names and redirects: the list in SEARCH.md's sources (as
  reported).
- The community list of AI crawlers: github.com/ai-robots-txt/ai.robots.txt (read at source).
- Matomo's list of AI-assistant addresses: github.com/matomo-org/searchengine-and-social-list, AIAssistants.yml (read
  at source).
- security.txt: RFC 9116, rfc-editor.org/rfc/rfc9116 (our knowledge; not opened this round).
- The repository itself: `next.config.ts`, the publishing job, `src/app/layout.tsx`, `src/app/fonts/`, every page's
  metadata, and a local export's `out/` folder.

---

## Reconciled in round 11

Changes made when this round's five pieces of work were put together (19 October 2026). The decisions
now sit in DECISIONS.md.
- "Today" and A0 follow the facts: Next.js 16.3.8 on the working branch; the repository private since 19 October, the
  preview dark, and a deploy from `main` with nowhere to publish until the hosting changes. GitHub Team, not GitHub
  Pro, for the organization (one plan name with SECURITY.md and BACKEND.md).
- llms.txt: the summary is the message sheet's sentence word for word (the old one used "the system their revenue runs
  on" and "runs it with their team", both retired by the voice); the term drops "at a higher fee"; GTM
  Infrastructure's line no longer says "lists" or "set up".
- Scaling's status, the family names and the byline follow DECISIONS.md (no byline: the founder's round-8 decision).
- Win/loss is in the sitemap at launch. The CRM setup plan keeps its approved name. security@ is settled.
