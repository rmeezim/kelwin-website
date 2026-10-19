# Field notes: the blogging system

Round 11 · 19 October 2026 · for your yes

This answers the second of your three additions to the order of work: "Have a proper blogging system so we could
write the field notes (which are essentially just blogs that we can easily post on the website and share across
different platforms for people to read)." It also follows your sitemap note: "The insights would pretty much be the
blog page, and the field notes are individual blogs and our thoughts and research that we have done on our own".

What each page shows (Insights, a note, "How we research and write", the feed) is in SITEMAP.md. This document is
about how a note gets written, checked, published, emailed and shared. The services it uses (Cloudflare, Buttondown,
Plausible) are in BACKEND.md, and its security in SECURITY.md.

**How sure the facts are.** Most outside websites would not open from here this round. The editors we compared
publish their own code and documentation on GitHub, which did open, so what each editor does and needs was **read at
source**. What LinkedIn, X, Instagram and Google do with shared links is our own knowledge, to check before launch.
The sources are numbered in square brackets and listed at the end.

---

## 1 · The short answer

- **Each note is one plain text file in Kelwin's own project,** not in another company's database. Every change is
  recorded, and nothing ever needs exporting.
- **You write in an editor at kelwin.co/admin/,** on a laptop or a phone. It is Sveltia CMS: free, open source, and
  it saves straight into the project [1][2].
- **Every save is a private preview of the real page,** in the real design, at an address only the founding team can
  open.
- **Publish is your own button, and it is your go-ahead.** Nothing reaches the live site without it.
- **A note can be dated ahead.** It goes live at about 9 a.m. New York that morning, with nobody at a keyboard.
- **The site does the rest by itself:** the reading time, the feed, the search listing, the link-preview picture, the
  share links, the search markup, and a check on your standing rules before anything goes live.
- **The email is drafted for you.** Within 30 minutes of a note going live, a draft waits in Buttondown [6]. A person
  reads it and sends it. At most one email a month.
- **Sharing is kelwin.co first,** then LinkedIn, X and Instagram, from a private "share pack" the site builds for
  every note: the post texts, the tagged links, the picture and the Instagram slides.

**The number:** $0 a month added. The editor and its sign-in are free [1][3]; the email draft uses the Buttondown
tier BACKEND.md already budgets (about $9 a month). About four to six working days for us, and about an hour of your
time to set up.

**Runner-up: Decap CMS with Decap Turbo,** if copywriters must edit without their own GitHub accounts [4]. The two
editors read almost the same settings, so switching later is cheap.

**What we'd tell a buyer:** "Our field notes are dated, sourced and signed by the firm, and every one is published
first on our own site."

**Two related decisions are in SITEMAP.md,** and this system works with either answer: the byline (decision 4a,
proposed "By Kelwin", never a person) and the pace (decision 4b, proposed two notes a month for the first six
months). Four decisions of our own are at the end of this document.

---

## 2 · Your writing day

1. **Open kelwin.co/admin/** on a laptop or a phone, and sign in with GitHub. After the first time, it's one click.
2. **Field notes → New.** Fill in:
   - the title;
   - the summary: one or two sentences, the line people see in search and under a shared link;
   - the topic: The system, Narrative Systems, GTM Infrastructure or GTM Intelligence;
   - the sources, each with its link.
3. **Write the note.** Headings, lists, bold, quotes and links work as in any editor. From a short menu you can add:
   - a "field reading" panel, as today's notes have;
   - one of the site's approved drawings, chosen by name;
   - a "Specimen" figure, which can't be saved without its label;
   - a real photograph, which can't be saved without a description for screen readers and a tick for "real, ours or
     licensed; not stock, not AI-made".
4. **Save.** It's a draft, and nothing is public. A few minutes later, a private link shows the note on the real site,
   in the real design.
5. **Read it, change it, save again.** The preview updates. Send the private link to a copywriter if you want a second
   read.
6. **Set the date.** Today: live a few minutes after Publish. A later day: live at about 9 a.m. New York that morning.
7. **Publish.** If one of the rules isn't met, you'll see what's missing in plain words ("Source 2 has no link"), and
   the note waits until it's fixed.
8. **On the day it goes live,** an email draft is waiting in Buttondown within about 30 minutes. If it's this month's
   email, read it on your phone and send it (section 5).
9. **Open the note's share pack.** Copy the LinkedIn text and the link, and post from the company page. The X thread
   and the Instagram slides follow over the next two days (section 4).
10. **Optional, a week or two later:** the adapted LinkedIn article, with its "First published at kelwin.co" line.

**When a copywriter drafts the note** (as SITEMAP decision 4b proposes): they write in a shared Google Doc in Kelwin's
Drive. The GTM engineer moves it into the editor and saves it. You read the private preview, about ten minutes, and
press Publish, or send it back with notes.

**What you never have to do:** touch code, resize a picture, count a reading time, make a preview card, or remember a
link.

---

## 3 · What each note page includes

**What a reader sees** (SITEMAP.md, "Insights is the blog"), top to bottom:
- the topic, the headline, and one sentence on what the note argues;
- the byline as you decide it (SITEMAP decision 4a), linked to About;
- the date, and "Updated" only when the content really changed, with one line saying what changed;
- the reading time, counted from the words, never typed;
- the note itself: every outside number with its source beside it, every Kelwin term defined once, every fact in a
  drawing also written in the text, every illustrative figure labeled "Specimen";
- the sources, each with its link and the date we read it;
- "How we research and write", and "Report an error";
- three related notes;
- share links for LinkedIn, X, email and "copy link", plus the phone's own share button. Plain links: no share
  buttons from other companies, no counters, no cookies;
- "Get new field notes", the sign-up;
- the red audit door, with the matching fixed-scope engagement and capability page as quiet links.

**What machines read, made automatically from the same file:**
- **one fixed address** for the note, named as the original wherever the note is reposted;
- **a link-preview picture,** 1200 × 630, made when the site is built: graphite, the "Field note" label with its small
  red square, the headline in Mona Sans, and the Kelwin lockup. No photograph, no gradient, no figure number;
- **search markup** naming the note as an article, with the firm, Kelwin, as its author, never a person;
- **its line in the site's list for search engines,** with the date it last changed;
- **its entry in the feed:** the title, the date, the opening paragraph and the link. Openings only, so kelwin.co stays
  the original (SITEMAP.md).

**One source for every detail.** Today a note's reading time is typed by hand in up to four places, and they already
disagree:

| Note | On the note | On Insights | On the homepage |
|---|---|---|---|
| Revenue entropy | 3 min | 6 min | 3 min |
| The 17% window | 2 min | 5 min | 2 min |
| Deliverability is infrastructure | 2 min | 5 min | 2 min |

From now on, the note page, the Insights list, the homepage's links and any other mention read the same file. The
homepage keeps its approved, hand-picked links; only their dates and reading times come from the notes.

---

## 4 · Sharing on LinkedIn, X and Instagram

**The rule: kelwin.co first, always.** Search engines decide which copy of a text is the original, and a LinkedIn
article can't point back to ours the way a web page can (our knowledge, to check). So the note goes live on kelwin.co
first, the search engines see it there, and everything else is a short post that links to it.

| When | Where | What | Why |
|---|---|---|---|
| Day 0, about 9 a.m. | kelwin.co | The note goes live | The original, first |
| Day 0 | Google and Bing | We ask both to read the new address | So our copy is seen first |
| Day 0, within 30 minutes | Buttondown | The email draft appears; if it's this month's email, a person sends it | Section 5 |
| Day 0–1 | Kelwin's LinkedIn company page | A native post: the note's argument in three to five lines, then the link | It reads well in the feed, and sends readers to the original |
| Day 1–2 | X, once the account's link arrives | A short thread, with the link in the last post | The same |
| Day 1–3 | Instagram, once the account's link arrives | A carousel of the note's key lines, 4:5, with a caption; the profile's link points to kelwin.co/insights/ | Links in Instagram captions can't be clicked (our knowledge) |
| Day 7–14, optional | LinkedIn, as an article from the company page | An adapted version: a shorter opening, and a first line "First published at kelwin.co", with the link. It ends on the link | Only after the original has been in the search engines for a week or more (decision 4) |

**The share pack: one private page per note.** Built from the note's file, it exists only on the private preview,
never on the live site. It holds:
- the LinkedIn text and the X text, written into the note's file by you or a copywriter;
- the link for each platform, tagged so the Monday numbers show which platform brought readers;
- the 1200 × 630 card;
- the Instagram slides at 1080 × 1350: the headline, then three to five lines from the note, in the house type and
  flat color, with no photograph;
- a copy button beside each text, and a download button beside each picture.

No design tool is needed to share a note, and every platform shows the same words as the site.

**Before posting on LinkedIn:** paste the link into LinkedIn's Post Inspector once, so the preview shows the right
picture. LinkedIn keeps an old preview for about a week otherwise (our knowledge).

**Not recommended:**
- full copies on Medium or Substack, which compete with our own page;
- posting tools that publish for us, at least at launch. Each is one more account with the right to post as Kelwin.

**Later:** a LinkedIn newsletter from the company page notifies its followers (our knowledge). Worth a look once the
notes have a following. It would run beside the email list, never instead of it.

**What we'd tell a buyer:** "Everything we post points back to the note on our own site, where it was published
first."

---

## 5 · The newsletter send

- **Drafted from the feed.** Buttondown checks the feed every 30 minutes and makes a draft for each new note; it can
  send by itself, but we set it to draft, so nothing is ever sent by a machine alone [6]. Its "skip old items" setting
  stops it emailing the three notes already published [6].
- **What the email carries** (decision 3, proposed): the note's headline and opening, then "Read the full note on
  kelwin.co". The same as the feed, so kelwin.co stays the original and every reader lands on the page with the
  sources, the sign-up and the audit.
- **Who it goes to:** the "notes" tag only, from notes@kelwin.co, never to anyone marked "in conversation" (BACKEND.md).
  One-click unsubscribe and Kelwin's postal address in every email.
- **How often:** at most one email a month (SITEMAP.md). If two notes publish in the same month, one email carries both:
  a person adds the second note's opening to the first draft and deletes the other. About five minutes.
- **Who sends it:** a person, on the day, after reading it on a phone.

**What we'd tell a buyer:** "One email when a note publishes, at most once a month, and leaving takes one click."

---

## 6 · Who can do what

| Person | At launch | Later, if you want |
|---|---|---|
| You | Write, preview, publish. Your Publish is the go-ahead | — |
| The GTM engineer | Set-up and upkeep. Moves copywriters' drafts into the editor. Publishes only when you're away, with your written OK | — |
| Copywriters | Draft in shared Google Docs; read the private previews; no access to the project | Their own GitHub seat (about $4 a month each, to check), so they can save drafts in the editor. Only you publish |

**What keeps it safe** (the detail is in SECURITY.md):
- **Nothing in a note can run code.** Pasted HTML or scripts show as plain text or are dropped.
- **The editor runs no outside script,** and has its own strict security settings.
- **The live branch is protected:** a change reaches it only as a proposal that passes the checks, and only your
  Publish takes it live.
- **Only people in Kelwin's GitHub organization can sign in,** with a security key.
- **Previews are private** and hidden from search engines.
- **Photographs lose their location data** when the site is built.

---

## 7 · What we build, and how long

| # | What | Effort |
|---|---|---|
| 1 | The note files: the three published notes moved in word for word, with the checks, the reading time, and one source for Insights and the homepage | 1–1.5 days |
| 2 | The note page built from the file: its fixed address, the search markup, the preview picture, the search listing, the feed | 1–1.5 days |
| 3 | The editor at /admin/: its settings (field notes, and the "In the works" list), the block menu, and the sign-in | 0.5–1 day |
| 4 | A private preview for every draft, linked from the editor; the live branch protected; the daily 9 a.m. build | 0.5–1 day |
| 5 | Share links on each note, and the private share pack | 0.5–1 day |
| 6 | Buttondown's feed-to-draft, and one test send | 0.25 day |
| 7 | A one-page guide, "How to publish a field note", and one rehearsal with you: a throwaway note from draft, to dated, to live, to email, to shared, then deleted | 0.5 day |

**The order.** Steps 1–3 can start now; they don't depend on the new design of Insights, which comes later in
stage 6, and the new design reads the same files. Step 4 needs the move to Cloudflare (BACKEND.md), because GitHub
Pages has no private previews.

**What it costs:**

| Item | A month | Later, if needed |
|---|---|---|
| Sveltia CMS | $0 [1] | — |
| Its sign-in, on Kelwin's Cloudflare account | $0 [3] | Inside Cloudflare's $5 upgrade, if that is ever taken (BACKEND.md) |
| Builds, including the daily one and the previews | $0: about 200 minutes a month, inside GitHub's included minutes for a private project (to check) | — |
| Buttondown's feed-to-draft | Inside the about-$9 tier already budgeted | The next tier past 1,000 subscribers |
| **Added by the blog** | **$0** | |

**The upgrade paths:**
- copywriters edit without GitHub accounts: Decap CMS with Decap Turbo [4][5];
- editing directly on the page: TinaCMS with its hosted service, at a price to check [8];
- a content team in several languages: a hosted content system such as Sanity, at about $15 a seat (to check).

---

## 8 · Risks, and how we'd notice

| Risk | How we'd notice | What we do |
|---|---|---|
| An editor update breaks it (Sveltia releases often and isn't at version 1.0 yet [2]) | The monthly check on the preview | We pin one version and update once a month after trying it; or switch to Decap with the same files |
| Most of Sveltia's work comes from one maintainer [2] | Releases slow down | Decap stays the named fallback |
| The 9 a.m. build runs late or fails | The note isn't live at 9; GitHub emails a failure | Run the build by hand: one click |
| The LinkedIn article outranks kelwin.co | Google's report on the site, a month later | Keep the order: wait a week or more, adapt the text, link back |
| LinkedIn shows an old preview picture | Post Inspector, before posting | Refresh it there |
| A writer's GitHub login is stolen | GitHub's security alerts | Security keys; the protected live branch; nothing in a note can run code |

---

## Appendix A · The note file, for the builders

One file per note: `content/insights/<address>.md`. The file name is the note's address and is fixed once published.

| Field | Filled by | What it is | Checked when the site is built |
|---|---|---|---|
| `title` | Writer | The headline | Required. A warning past about 70 characters |
| `summary` | Writer | One or two sentences: the line under the headline, the search description, the preview text, the email's opening | Required, 120–200 characters |
| `topic` | Writer, from a list | The system · Narrative Systems · GTM Infrastructure · GTM Intelligence (SITEMAP.md) | Exactly one |
| `engagement` | Writer, optional | The fixed-scope engagement the note leads to, for the quiet link at the end | One of the published engagement pages |
| `date` | Writer | Publish date and time, New York. A future date means scheduled | Required |
| `updated` | Writer, only for a real change | Shown as "Updated" with the date | Later than `date` |
| `change_note` | Writer | What changed, shown under the date | Required when `updated` is set |
| `status` | Writer | `draft`, `published` or `retired` (the page stays, with a line saying why) | Drafts never reach the live site |
| `sources` | Writer | Title, publisher, date published, date read, link | Each needs a link |
| `share.linkedin`, `share.x`, `share.instagram` | Writer or copywriter | The post texts; the slide lines | X: about 250 characters, leaving room for the link |
| `picture` | Optional | A real photograph, its description, and the real-picture tick | Founder rule 6 |

**Never fields, so they can't be got wrong:** the byline (fixed in the page design, as SITEMAP decision 4a sets it),
the reading time (about 230 words a minute, rounded up), the address, the preview picture and the markup.

**"In the works"** becomes one small settings file in the editor: a title, a topic and a status per line ("Drafting",
"In calibration"), never a date.

**The three published notes** move in word for word. They show only a month today; the markup needs a full date, so
we take the day each was first published from the project's history, or you give it.

```yaml
---
title: "…the headline…"
summary: "…one or two sentences, 120–200 characters…"
topic: GTM Intelligence
engagement: win-loss-interviews
date: 2026-11-10T09:00:00-05:00
status: published
sources:
  - title: "…"
    publisher: "…"
    published: 2026-05
    read: 2026-10-19
    url: "https://…"
share:
  linkedin: "…three to five lines for the company page…"
  x: "…one line…"
  instagram: ["…headline…", "…line…", "…line…"]
---

The note, in Markdown.
```

## Appendix B · The editor and its sign-in, for the builders

- **Editor:** `@sveltia/cms`, pinned to one version (0.248.0 on 17 October 2026 [2]), served from `public/admin/` on
  kelwin.co, never from a public CDN. `config.yml` beside it:
  - `backend: github`, the repository in the Kelwin organization, `branch: main`, `base_url` set to the sign-in
    helper;
  - `publish_mode: preview`: each save opens a pull request with a preview link (added in 0.241.0, 15 October 2026
    [2]);
  - auto-merge once the checks pass (added in 0.248.0 [2]), which needs "Allow auto-merge" on in the repository;
  - `allow_incomplete_drafts: false`;
  - collections: `insights` (folder `content/insights/`, Markdown with front matter) and `in-the-works` (one file);
  - media saved beside each note.
- **Sign-in helper:** `sveltia-cms-auth` on a Worker in Kelwin's Cloudflare account [3]. Settings:
  `GITHUB_CLIENT_ID`; `GITHUB_CLIENT_SECRET` as an encrypted secret; `ALLOWED_DOMAINS=kelwin.co`, which its own
  documentation calls "both an anti-abuse and a security measure" [3]. The GitHub sign-in app belongs to the Kelwin
  organization; its callback is `<helper>/callback`.
- **What the sign-in grants:** the helper asks GitHub for the `repo,user` scopes by default [3], which reach every
  repository the signed-in account can reach. So the accounts that write hold only Kelwin's work, and the organization
  allows outside apps only one by one (SECURITY.md, the writing tool).
- **/admin/** has its own security settings, never appears in search, and loads no outside script (SECURITY.md,
  Appendix A).
- **The live branch:** a ruleset on `main` requiring a pull request, the build and rule checks, the package check and
  the secret check, one approval, and no force-push or deletion. Your account sits on the bypass list for pull requests
  only, so your own Publish merges once the checks pass, and nobody, you included, can push to `main` directly. Test
  at set-up that the checks still gate a bypassed merge; if they don't, the deploy step runs the same checks and
  refuses to deploy.
- **Why not Decap now:** an older editor; with Turbo, the repository's content passes through its servers [4][5].
  **Why not Keystatic:** it needs Node.js for its sign-in routes, which a static site can't run [7]. **Why not
  TinaCMS:** it needs its hosted service or a server and a database [8]. **Why not Pages CMS:** a third-party app with
  write access to the repository, and no real preview [9].

## Appendix C · The build, for the builders

- **Loader:** our own, small. It reads `content/insights/*.md`, parses the top with `yaml`, checks it with `zod`,
  and renders with `remark-parse`, `remark-gfm`, `remark-directive`, `remark-rehype` and `hast-util-to-jsx-runtime`,
  **with raw HTML off**. Internal links become `next/link`, so they keep working under any base path (CLAUDE.md).
  Outside links get `rel="noopener noreferrer"`. Images: location data stripped, about 2 MB at most.
- **Why not `@next/mdx`:** no front matter by default, and its Turbopack plugin takes only simple settings [10]. In
  MDX, a sentence like "<5% reply" can break the build. **Why not Velite or Content Collections:** one more tool for
  a few files a month.
- **Routes:** `app/insights/[slug]/page.tsx` with `generateStaticParams` and `dynamicParams = false` [10];
  `opengraph-image.tsx` beside it, made at build time [10]. The image tool reads TTF, OTF, WOFF and WOFF2 [11]; the
  site's Mona Sans is a variable font, so we give the tool a fixed cut at the display width and weight.
- **The feed:** `app/insights/feed.xml/route.ts`, a GET route written at build time [10], RSS 2.0 through the `feed`
  library [12]: title, link, a stable ID, the date, the opening paragraph, author "Kelwin". A
  `<link rel="alternate" type="application/rss+xml">` in the head of Insights and every note. Check in the first
  build that `trailingSlash: true` still writes `feed.xml` as a file (SEARCH-BUILD.md).
- **Search listing:** each published note at its address, `lastmod` from `updated`, else `date`. Drafts,
  future-dated notes and share packs left out.
- **Markup:** `BlogPosting` with `author` the Organization "Kelwin", `publisher` Kelwin, both dates, the preview
  image, `keywords` from the topic, `citation` from the sources; a `BreadcrumbList` (Insights › the note); `<` escaped
  inside the JSON (SEARCH-BUILD.md). If the short llms.txt is adopted, each published note is added to it.
- **The daily build:** `schedule: - cron: "5 13 * * *"` in the deploy file (9:05 a.m. New York in summer, 8:05 in
  winter). GitHub runs scheduled builds "only on the default branch", and turns them off after 60 days without
  activity in a public repository; that stops mattering once the project is private [13]. Timed builds can start some
  minutes late. The loader compares each note's `date` with the build time. Then ask Bing to read the new address
  (IndexNow), as SEARCH-BUILD.md plans.
- **Previews:** a pull-request job builds with drafts included, deploys a preview version (BACKEND.md, Appendix A),
  and posts a commit status whose name contains "deploy" with the address, so the editor links to it.
- **Rule checks, each failing the build with a plain message:** the sister-company name the founder ruled out; "Fig."
  numbering; Kelwin's name followed by a legal suffix; an image without its description; a Specimen block without its
  label; a source without a link; a summary out of range; `updated` without `change_note`; a topic not on the list; a
  photograph without the real-picture tick; any script inside a page that isn't on the reviewed list (SECURITY.md).
- **Share pack:** a route built only in preview builds, `/share/<address>/`, with the texts, the links tagged
  `utm_source` (linkedin, x, instagram, email), `utm_medium` (social, email) and `utm_campaign` (the note's address),
  the card and the slides.

## Appendix D · The options we compared

| Option | Fits a static site? | A month to start | The catch |
|---|---|---|---|
| **Sveltia CMS** (recommended) | Yes: one page plus a free sign-in helper [1][3] | $0 | Fast-moving, not yet at version 1.0 [2] |
| Decap CMS (+ Turbo) | Yes [4] | $0; Turbo has a free plan of 2,500 requests a day [5] | An older editor; with Turbo, content passes through their servers [4] |
| TinaCMS | Only with its hosted service, or a server and a database [8] | Free for a small team, then paid (to check) | The best on-page editing, but a hosted layer and its own data format |
| Keystatic | No: it needs Node.js for its sign-in routes [7] | Its cloud: free up to 3 users, Pro from $10 [7] | Would need a second, server-run copy of the site |
| Pages CMS | Yes; the editor is their hosted app [9] | No price stated [9] | A small outside app holds write access to the project |
| Sanity, Contentful, Storyblok, Hygraph | Yes, with a rebuild on publish | Free tiers, then about $15 a seat to $300+ a month (to check) | Notes in their database; a true preview needs a second, server-run copy [10]; more accounts to secure |
| Notion | Read when the site is built | Free or about $10–12 a seat (to check) | Images come back as links that expire; its layout doesn't carry over; no review, no real preview [14] |

**Verdict:** Sveltia, because only it and Decap fit a static site without a server or an outside company in the
middle, and Sveltia has the newer editor, works on a phone, and signs in through Kelwin's own Cloudflare account.
Notion and Google Docs remain fine places to draft.

---

## Sources

How each was read: **read at source** means the publisher's own code or documentation, read on GitHub or in the npm
registry on 18–19 October 2026. Platform behavior (LinkedIn, X, Instagram, Google on duplicate copies) is our own
knowledge from around mid-2026, not re-checked; the page to check is given.

1. Sveltia CMS, repository and README: https://github.com/sveltia/sveltia-cms (read at source).
2. Sveltia CMS releases: preview mode and review stages in v0.241.0 (15 October 2026); auto-merge when checks pass in
   v0.248.0 (17 October 2026); 745 releases since March 2023, 64 in September 2026:
   https://github.com/sveltia/sveltia-cms/releases (read at source; release counts from
   https://registry.npmjs.org/@sveltia/cms).
3. Sveltia CMS sign-in helper (`ALLOWED_DOMAINS`; default `repo,user` scopes): https://github.com/sveltia/sveltia-cms-auth
   (read at source).
4. Decap CMS, README and 3.17 release notes (Decap Turbo generally available, 14 October 2026; renamed from Netlify
   CMS): https://github.com/decaporg/decap-cms (read at source).
5. Decap docs source, Turbo overview and billing (2,500 and 20,000 requests a day):
   https://github.com/decaporg/decap-website/blob/main/content/docs/turbo-overview.md ;
   https://github.com/decaporg/decap-website/blob/main/content/docs/turbo-billing.md (read at source).
6. Buttondown docs source, RSS-to-email (every 30 minutes; send or draft; skip old items; a paid feature):
   https://github.com/buttondown/docs/blob/main/content/pages/rss-to-email.mdoc (read at source).
7. Keystatic docs source, GitHub mode ("Make sure the host can run Node.js") and Keystatic Cloud:
   https://github.com/Thinkmill/keystatic/blob/main/docs/src/content/pages/github-mode.mdoc ;
   https://github.com/Thinkmill/keystatic/blob/main/docs/src/content/pages/cloud.mdoc (read at source).
8. TinaCMS, README and docs source (TinaCloud; self-hosting needs a backend and a database):
   https://github.com/tinacms/tinacms ; https://github.com/tinacms/docs/tree/main/content/docs (read at source).
   Prices: https://tina.io/pricing (to check).
9. Pages CMS, README: https://github.com/pages-cms/pages-cms (read at source).
10. Next.js 16 documentation, in the site's own copy: static exports (GET routes written at build time; Draft Mode not
    supported), MDX (no front matter by default; Turbopack plugin limits), `opengraph-image` (made at build time;
    1200 × 630): https://nextjs.org/docs/app/guides/static-exports ; https://nextjs.org/docs/app/guides/mdx ;
    https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image (read at source).
11. Satori, the image tool behind those pictures ("Satori supports four font formats: TTF, OTF, WOFF and WOFF2"):
    https://github.com/vercel/satori (read at source, 19 October 2026).
12. `feed`, README (RSS 2.0, Atom 1.0, JSON Feed): https://github.com/jpmonette/feed (read at source).
13. GitHub docs source, events that trigger builds (schedule: default branch only; 60-day rule in public
    repositories):
    https://github.com/github/docs/blob/main/content/actions/reference/workflows-and-actions/events-that-trigger-workflows.md
    (read at source).
14. Notion's JavaScript SDK (two API versions; rate-limit retries): https://github.com/makenotion/notion-sdk-js (read at
    source). Expiring file links: https://developers.notion.com/reference/file-object (our knowledge, to check).

**To check before launch (our knowledge):** Google on duplicate copies and the original:
https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls · LinkedIn's share link and
Post Inspector: https://www.linkedin.com/post-inspector/ · X's post link format: https://developer.x.com/ · Instagram
links in captions: https://help.instagram.com/ · Buttondown's tiers: https://buttondown.com/pricing · GitHub's
included build minutes: https://github.com/pricing · Mona Sans's license (SIL Open Font License):
https://github.com/github/mona-sans

**Kelwin's own documents, read directly:** ROUND10-NOTES.md; this round's SITEMAP.md (Insights, a field note, the
feed, the standards page, decisions 4a and 4b) and SEARCH-BUILD.md; the site's three published notes, the Insights
page and the homepage's note links (for the reading times).

---

## Decisions for the founder

**1. The editor: Sveltia CMS?**
- **Proposed:** yes. Notes as plain files in Kelwin's own project, written at kelwin.co/admin/, with a private preview
  of every draft and your Publish as the go-ahead.
- **Why:** it fits the site as built, with no server and no outside company holding the notes; it works on a phone;
  it costs nothing; and if it ever stalls, Decap reads the same files. Choose Decap with Turbo instead only if several
  copywriters must save drafts without GitHub accounts.

**2. Who can publish at launch?**
- **Proposed:** only you. The GTM engineer publishes only when you're away, with your written OK. Copywriters draft in
  shared Google Docs and read the private previews, without access to the project.
- **Why:** Publish is your go-ahead, so it should stay yours. It also keeps the number of people who can change the
  live site to two, and the GitHub seats to two (about $4 a month each, to check).

**3. The email: the opening and a link, or the full note?**
- **Proposed:** the headline, the opening and "Read the full note on kelwin.co".
- **Why:** it matches the feed, which carries openings only so that kelwin.co stays the original (SITEMAP.md). Every
  reader lands on the page with the sources, the sign-up and the audit, and the visit counts in the Monday numbers.
  The full note in the email reads more easily in the inbox, but it would need a second, full-text feed or a key that
  lets the site write to Buttondown.

**4. An adapted LinkedIn article, a week or two after each note?**
- **Proposed:** yes, from the company page: a shorter opening, a first line "First published at kelwin.co", and the
  link at the end.
- **Why:** LinkedIn articles reach people who never click a link, and a week's wait lets the search engines see
  kelwin.co as the original first. The alternative is short posts with links only, which is safe but reaches fewer
  people.
