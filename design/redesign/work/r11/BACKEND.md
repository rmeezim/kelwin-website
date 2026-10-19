# What sits behind the site: the services and the inbound machine

Round 11 · 19 October 2026 · for your yes

This answers two of your round-10 decisions:
- "Can the site store what visitors send? YES, SET THEM UP".
- The first of your three additions to the order of work: "Set up automations and link things together to make the
  website a fully fledged lead gen machine for inbound efforts."

It is stage 7 of the order you approved ("What has to be behind the site"). The blogging system is in BLOG.md, and
the security plan is in SECURITY.md, both beside this one. The pages and their forms are in SITEMAP.md; the sale that
follows a form is in LIFECYCLE.md.

**How sure the numbers are.** Most vendors' own pages would not open from here this round, and the web search
allowance ran out early. We did not route around either block. So:
- what each tool **does** was read at the source where we could (the vendors publish their documentation on GitHub);
- what each tool **costs** is our last-known figure from around mid-2026, **not re-checked**. Before anyone signs up,
  one person spends about an hour checking every price against the pages in Appendix E. If a price has moved by more
  than about $10 a month, we look at the runner-up again. Nothing else in this plan changes.

The sources are numbered in square brackets and listed at the end.

---

## 1 · The short answer

- **Move the site from GitHub Pages to Cloudflare.** GitHub Pages can't run a form, can't send the security settings
  you asked for in "fully secure", can't keep drafts private, and its own rules say it isn't meant to run a business
  [1]. Cloudflare can do all of it, free at our size, and still publishes only what you approve.
- **One small program of our own receives every form.** It checks for bots, saves what was sent before anything else
  happens, then sends it on: to the CRM, to the email list if the person asked, to the right inbox, and an instant
  acknowledgement to the visitor. CVs go into Kelwin's own private storage, never into an inbox.
- **Every enquiry becomes one record in the CRM within a minute,** with its answers, a score that sets how fast we
  reply, and where the visit came from. A strong audit request reaches your phone within a minute.
- **People answer people.** The machine makes our replies faster; it doesn't write them. No automated email pretends
  to be a person, and no follow-up runs past three emails (your approved rules).
- **Every Monday morning, one page of numbers** tells you what came in, what moved, and whether we kept our reply
  times.

### The stack, one choice per job

| Job | We recommend | Runner-up | A month at launch | By month 12 |
|---|---|---|---|---|
| Hosting | **Cloudflare** (the site's files, plus our form program) | Netlify Pro | $0 | $0–5 |
| Forms | **Our own form program on Cloudflare**, with Cloudflare's free bot check | Formspree or Basin, paid tier | $0 | $0 |
| Instant acknowledgements | **Resend** | Postmark | $0 | $0–20 |
| CRM | **HubSpot's free CRM**, to Starter when needed | Attio | $0 | about $30–40 |
| Email list | **Buttondown** | Kit (formerly ConvertKit) | about $9 | about $9 |
| Automations | **Nothing to buy:** our form program, a timer, and the tools' own links | Make | $0 | $0 |
| Calendar for the first call | **Cal.com**, free plan | HubSpot meetings | $0 | $0 |
| Visitor counts, without cookies | **Plausible** | Umami Cloud, free | about $9 | about $9–19 |
| Mailboxes | **Google Workspace** Business Starter | Microsoft 365 Business Basic | about $7–8.40 | about $14–25 |
| **These services, in all** | | | **about $25–27** | **about $60–120** |

The security plan adds about $15–16 a month at launch and about $23–25 by month 12 (a private GitHub organization,
the password manager and a spare admin seat), plus about $50–110 once for two security keys (SECURITY.md).
**Everything together: about $40–45 a month at launch, and about $85–145 by month 12,** plus the domain's yearly
renewal. Section 8 has the table. All prices are last known around mid-2026 and still to check.

**What we'd tell a buyer:** "Our own site runs the way we'd build yours: every enquiry lands in one record within a
minute, a person answers within a working day, and our mail passes every inbox check."

**What we need from you:** the accounts in Kelwin's name, in the order in section 6 (about two hours in all, spread
over two weeks), and four decisions at the end of this document.

---

## 2 · Hosting: leave GitHub Pages for Cloudflare

### What GitHub Pages can't do

| What the site now needs | GitHub Pages (today) | Cloudflare |
|---|---|---|
| Security settings sent with every page (who may frame it, which scripts may run, HTTPS only) | **No.** A static site can't set them itself [2], and Pages offers no way to | Yes, from one file in the project [3] |
| Somewhere for forms to post | **No** | Yes: a small program on the same address, 100,000 requests a day free [6] |
| Forwarding old addresses (for example /capabilities/) | Only pages that forward by themselves | Yes, from one file [4] |
| A private address to review drafts, and the sign-in for the notes editor | **No** | Yes, locked to the founding team with Cloudflare Access (free for up to 50 people, to check) |
| Running a business | GitHub's own words: Pages "is not intended for or allowed to be used as a free web-hosting service to run your online business" [1] | Allowed |
| A private project | Pages from a private project needs a paid GitHub plan | Free |
| Traffic | About 100 GB a month, a soft limit (to check) | Requests for the site's pages are "free and unlimited" [5] |

**Why not the others.**
- **Netlify Pro, about $20 a month (to check):** built-in forms with uploads, good previews. It's the runner-up, worth
  it only if we decide not to write our own form program. Its free plan pauses a site when its credits run out, and a
  bot flood could spend them.
- **Vercel:** its free plan is for personal, non-commercial use, and its paid plan sells server features a static
  site doesn't use.

### Recommendation: Cloudflare

**What.** kelwin.co is served by Cloudflare. The site stays exactly as it is built today: a set of finished pages.
Our form program runs beside it, at kelwin.co/api/. Cloudflare also holds the domain's records, the bot check, the
private CV storage, the small database that keeps each submission, and the timer that runs scheduled jobs.

**How things go live.** The same as today, by design. Only a change you approve on the live branch (`main`) goes live,
built and deployed by the same GitHub step. Every other change appears first at a private preview address that only
the founding team can open.

**What changes for you.**
- You review drafts at a private address instead of the public github.io preview.
- The github.io preview is dark since you made the project private on 19 October. The old preview addresses answer
  "not found". Nothing public links to them.
- When kelwin.co goes live, Cloudflare's own spare address for the site is switched off, so there's never a second
  public copy of Kelwin.

**Why.**
1. It is the only free host that can send the security settings, run the forms, keep drafts private and allow a
   business site.
2. Page traffic is free and unlimited [5], so a traffic spike can't take the site down or send a bill.
3. Cloudflare is moving its new features to this product, Workers; the older Pages product is maintained but no
   longer the recommended start [8].

**The number:** $0 a month. The first upgrade is $5 a month (Workers Paid), if the form program outgrows the free
allowance [7], for example if reading large CVs needs more computing time.

**The effort:** about a day for the hosting, and two to three days for the form program with its tests.

**What we'd tell a buyer:** "Our site sits behind the same protection and security settings we'd expect of any
company we audit."

---

## 3 · The stack, one job at a time

### 3.1 Forms: our own small program

**What.** One program receives every form at kelwin.co/api/. For each submission it:
1. checks Cloudflare's bot check (Turnstile) on the server, a hidden field only bots fill, the time spent on the page,
   every field, the file if there is one, and how often this visitor and this email address have sent;
2. **saves the submission first,** so nothing is lost if a later step fails;
3. puts a CV into Kelwin's private storage, never into an email;
4. sends it on: to the CRM, to the list (only if the person asked), an alert to the right inbox, and the
   acknowledgement to the visitor;
5. tries any failed step again every 15 minutes, and tells the founding team if a step still fails after an hour;
6. deletes its own copy after 90 days, by which time the CRM holds the record.

**Why.** What visitors send stays in Kelwin's own accounts, not with a fourth company. One program feeds the CRM, the
list and the inboxes, so there's no paid connector to break. The forms stay our own design. And the security settings
can be strict, because forms post to our own address.

**The number:** $0 at our volume. Two to three days of the GTM engineer's time, then light upkeep. The security plan
reviews it before it goes live.

**Runner-up: Formspree or Basin on a paid tier with uploads, about $10–30 a month (to check).** Only if the GTM
engineer can't take the program before launch.

**What we'd tell a buyer:** "What you send us stays in our own accounts, and we delete CVs on a schedule we publish."

### 3.2 Instant acknowledgements: Resend

**What.** The form program sends each acknowledgement through Resend, from audit@kelwin.co or careers@kelwin.co,
signed with Kelwin's own keys so inboxes trust it.

**Why.** Free for about 3,000 emails a month (to check), which is far more than we need, and simple to connect. It
keeps acknowledgements apart from your own mailbox, so a bot flood can't touch the reputation of your own address.

**Runner-up: Postmark.** Excellent delivery, but its free tier is about 100 emails a month (to check); then about $15.

### 3.3 The CRM: HubSpot's free CRM

**What.** One HubSpot account in Kelwin's name. The form program writes to it directly, with a key that can only
touch people, companies, deals, notes and tasks. One pipeline serves both families of engagement (section 4.4).

**Never on the site:** HubSpot's tracking code. It sets cookies, and that would bring back a cookie banner. HubSpot
never runs in a visitor's browser.

**Why.** It costs nothing; it has the stages, tasks with phone reminders, a meetings tool and the connections the doors
need; and it is common among the companies Kelwin sells to, so working in it daily keeps the team fluent.

**HubSpot's own lead scoring needs a much dearer tier. We don't need it:** the form program works out the score and
writes it on the record (section 4.5).

**Move to Starter, about $15–20 a seat a month (to check), when any one of these happens:**
- a third person needs to work in the CRM (the free tier was last known to allow two, to check);
- the meetings link must lose HubSpot's branding;
- the fixed-scope engagements need their own pipeline.

**Runner-up: Attio.** Free for up to three people and pleasant to use, but no meetings tool and no marketing email.

**What we'd tell a buyer:** "Every enquiry is one record with its source, its answers and a due date: the discipline
we install for clients."

### 3.4 The email list: Buttondown

**What.** One list, with tags (notes, Lab, first report, Index, not yet), never five lists.
- Double opt-in: every sign-up confirms from their inbox, and the confirm link lands on kelwin.co/confirmed/.
- One-click unsubscribe in every email, the kind inboxes now ask for [14][15].
- It sends as notes@kelwin.co, signed with Kelwin's own keys.
- It makes a draft from the field-notes feed whenever a note publishes [13]. A person reads it and sends it.
- Read-tracking off.

**Why.** It's the smallest tool that does all of that, it writes in the same plain format as the field notes, and it
suits a firm that sells care with people's inboxes.

**The number:** about $9 a month from day one, because the feed-to-draft feature is on the paid tier [13]. Past 1,000
subscribers, about $29 (to check).

**Runner-up: Kit (formerly ConvertKit).** A larger free tier, but it is built for creators, and feels like it.

**What we'd tell a buyer:** "At most one email a month, only when a note publishes, and leaving takes one click."

### 3.5 Automations: nothing to buy

**What.** The form program, one timer on Cloudflare that runs every 15 minutes, and the tools' own links (HubSpot with
Cal.com and Google Calendar, Buttondown's notices of unsubscribes). Every rule is written down in section 4, with an
owner.

**Why.** Fewer accounts to secure, nothing to pay, nothing that runs that nobody can explain.

**Runner-up: Make, about $9 a month (to check),** if you want to change a rule yourself without a developer.

### 3.6 The calendar: Cal.com, shown only after the three questions

**What.** One event, "First call · 30 minutes", hidden from Cal.com's public pages, with a minimum notice.
- **At launch,** a person replies with times, as today.
- **Soon after launch,** the calendar appears on the audit page, but only after the three answers qualify the
  visitor and their details are sent. It opens filled in with their name, email and answers.
- A booking moves the CRM deal to "First call booked". Cal.com sends reminders a day and an hour before.
- If the calendar fails to load, the email booking stays, as today.

**Why.** It's free, it fills in the visitor's details, and it works with Google Calendar and Meet. Because the
calendar loads only after the visitor asks to book, it sets nothing in their browser before they ask.

**One honest limit.** The booking link ends up readable in the page, so someone could skip the questions. A booking
with no matching audit request is flagged to a person, who checks it before the call.

**Runner-up: HubSpot meetings.** Free and inside the CRM, but HubSpot-branded until Starter.

### 3.7 Visitor counts without cookies: Plausible

**What.** Plausible on kelwin.co, counting visits with no cookies, so no cookie banner. Goals on every door: audit
started, qualified, declined and sent; call booked; contact sent, by reason; application sent; report requested; Lab
waitlist; notes sign-up, by page; Engagements read to the end. A weekly email to the founding team.

**AI assistants.** We count visits from ChatGPT, Claude, Perplexity, Gemini and Copilot as their own line. Many
assistant apps send no source at all, so the reliable number is the one people give us: "An AI assistant" is an
answer to "How did you hear about us?" on the audit and Contact forms (SITEMAP).

**Why.** Mature, cookie-free, run by an EU company, and simple enough to read in a minute.

**The number:** about $9 a month; about $19 if we want step-by-step funnels or its reporting connection (to check).

**Runner-up: Umami Cloud,** free, with a shorter history (about six months, to check).

**What we'd tell a buyer:** "Our site counts visits without cookies; we know which pages bring audits, not who you
are."

### 3.8 Mailboxes and kelwin.co's mail settings: Google Workspace

**What.**
- **One paid seat:** your own working address.
- **audit@, careers@ and notes@** as shared inboxes (Google Groups, free), each with the right people as members.
- **security@** delivered to audit@, for the public security contact (SECURITY.md); **dmarc@** only receives reports.
- A contractor who must write as Kelwin gets a seat of their own, about $7–8.40 a month (to check).
- Plus one spare admin seat, kept offline, if you agree (SECURITY decision 3).

**The mail settings.** They prove to every inbox that mail from kelwin.co is really ours, and tell inboxes to refuse
fakes:
- SPF and DKIM on from the first day;
- DMARC starting at "report only", moving to "quarantine" around week 3 and "reject" around week 6, once the reports
  are clean. CISA's baseline for Google mail asks for "reject" [18];
- encrypted delivery enforced for mail coming to us (MTA-STS);
- the list's mail signed through its own subdomain, so a bad week for the list never touches audit@;
- **never Kelwin's own cold outreach from kelwin.co.** It goes from separate domains, the rule our own field note
  teaches.

**Mail can go live now, before the site.** "Reject" needs about six weeks of clean reports, and a new domain earns
its reputation slowly.

**Why Google:** the simplest administration, the most native links to the rest of this stack, and free shared
inboxes.

**Runner-up: Microsoft 365 Business Basic,** if you already live in Outlook.

**What we'd tell a buyer:** "Our own domain passes the checks we'd run in your audit: SPF, DKIM, DMARC at reject, and
encrypted delivery."

---

## 4 · The inbound machine

### 4.1 The rules it runs on

Your approved follow-up rules, plus two new ones at the end.
1. A lead that fits gets a person. Everyone else gets the writing.
2. No automated email pretends to be a person. Acknowledgements come from a role address and are signed "The Kelwin
   team".
3. No follow-up runs past three emails. After that, we write only through the list, and only to people who joined it.
4. Every list says how often it writes, and keeps to it.
5. Anyone who asks for the audit leaves the marketing emails and is treated as a prospective client.
6. Leaving takes one click, everywhere. Nothing suggests false urgency.
7. The two doors are never merged. Sign-ups are not a third door.
8. We promise only what we keep: one working day for the audit; one working day for a Contact message that names an
   engagement (the sitemap's proposal, now adopted by the lifecycle); two working days for anything else. We aim
   faster.
9. **New:** every submission is saved before anything else happens.
10. **New:** every automation has an owner, named in the tables below.

### 4.2 What every form carries

- **What the visitor typed,** with a one-line consent and a link to Privacy. No box is ever ticked in advance.
- **Four quiet facts about the visit,** held only in the page's memory while the visitor moves around the site (no
  cookie, nothing stored on their device) and sent with the form: the page the form is on, the page the visit
  started on, the site that sent them, and any campaign tags on the link. Privacy says so.
- **"How did you hear about us?"** on the audit and Contact forms, optional: a search engine · an AI assistant ·
  LinkedIn · a field note · someone told me · an event · other.
- The bot check and the hidden field, checked on our server and then thrown away.

### 4.3 Door by door

Each door below reads in the same order: what the visitor sends, where it goes, who hears about it, what the visitor
gets, where it sits in the CRM, and what follows, with the timing.

**Door 1 · The System Audit: a visitor who qualifies**

| | |
|---|---|
| They send | The three answers (plus the size question, if you agree to it: DECISIONS.md, decision 3); name, work email, company, website or LinkedIn, role; how they heard (optional) |
| It goes to | Saved first. Then the CRM: the person, their company, and a deal at **Audit requested**, holding the answers, the score, its band and the weakest part they named (4.5) |
| Who hears | **Band A:** you, on your phone, within a minute, and a CRM task due in one working hour. **Bands B and C:** whoever holds audit@ that day, by email and a CRM task. The email's subject reads "[Audit · A] Company · Role · weakest part" |
| What they get | On screen: "Request received", as the sitemap describes. Within a minute, from audit@: their three answers, so they can see what we read; what happens next and by when (times for the 30-minute first call within one working day; then ten working days; then the readout on a 60-minute call); a link to the capability their answers point to; how client data is handled. Signed "The Kelwin team". A reply reaches audit@ |
| CRM stage | Audit requested → First call booked |
| What follows | A person replies with times: band A within one working hour, B the same working day, C within one working day. If they don't answer within two working days of our times: one short personal nudge, then nothing. **Soon after launch,** the calendar replaces the times (3.6), with reminders a day and an hour before |

**Door 2 · The System Audit: not a fit yet ("Tell me when it fits")**

| | |
|---|---|
| They send | Their email; when they expect revenue (optional) |
| It goes to | The list, tagged "not yet", once they confirm; a CRM contact noting the reason (pre-revenue, or self-serve only) |
| Who hears | No one at once. It shows in the Monday numbers |
| What they get | "Check your inbox", then the confirm-your-address email |
| CRM stage | Contact: subscriber, "not yet" |
| What follows | The field notes. Then **one** check-in about six months later, signed "The Kelwin team": "Has revenue arrived? The three questions are here." Then nothing |

If you agree to the size question (DECISIONS.md, decision 3), a company that sells but is below a package's size isn't
told "not a fit". It sees "Start with one piece", which opens Contact with "A fixed-scope engagement" chosen, and
continues as door 3.

**Door 3 · Contact ("Talk to the team"), including "Ask about this engagement"**

| | |
|---|---|
| They send | Name, work email, company; the company's website or LinkedIn, and their own LinkedIn; the reason; their country, and where the company is based; company stage (optional); how they heard (optional); the message; an unticked "Also send me the field notes" |
| It goes to | Saved first. The CRM: the person and the company, then a deal or a task by reason (table below). The list only if the box was ticked |
| Who hears | The right inbox for the reason, by email and a CRM task. Press and partnerships are flagged for you |
| What they get | On screen: "Message sent", with the next step for their reason (sitemap). Within a minute, from audit@ (careers@ for a question about a role): received, and when to expect a reply. **Never a copy of their own message** (SECURITY.md explains why) |
| CRM stage | **Enquiry** for a package or a fixed-scope engagement, with the family and the engagement named; a task for everything else |
| What follows | A person replies: within one working day when an engagement is named, two otherwise; we aim for the same working day |

Every "Ask about…" button on the site opens this form with the reason already chosen, so it lands in the CRM with the
engagement named.

| Reason | Inbox | In the CRM | The reply's next step |
|---|---|---|---|
| Launch, Growth or Scaling | audit@ | Enquiry, family: retained, the package named | Points to the audit, where every package starts |
| A fixed-scope engagement (which one) | audit@ | Enquiry, family: fixed-scope, the engagement named | The 30-minute first call, then the free scope check |
| A question about the audit | audit@ | Task | An answer, and the three questions |
| The Lab | audit@ | Task, and the tag "Lab" | An answer, and the waitlist |
| Field notes and research | audit@ | Task | An answer, and the notes |
| A correction | audit@ | Task for the note's owner | Thanks; the note will show the date of any fix |
| Press or speaking | audit@, flagged for you | Task for you | Your call |
| A partnership | audit@, flagged for you | Task for you | Your call |
| A question about a role | careers@ | Nothing in the sales CRM | An answer within two working days |
| Something else | audit@ | Task | Sorted by whoever holds audit@ |

**Door 4 · Careers (an application)**

| | |
|---|---|
| They send | Name, email, the role (filled in from the role's own link), LinkedIn, a link to their work, socials (optional), a message, a CV (PDF or Word, up to 10 MB), and a separate unticked box to stay in the talent pool for 12 months |
| It goes to | The CV into Kelwin's private storage. A row in the **talent pool**, a private sheet in Kelwin's Google account. **Not the sales CRM**: an applicant isn't a lead |
| Who hears | careers@, with a short summary and a link to the CV that opens only for a signed-in member of the hiring team. The CV is never attached to an email |
| What they get | On screen: "Application received". Within a minute, from careers@: received, and what happens next, and "We reply either way" (decision 3, settled as proposed) |
| CRM stage | None |
| What follows | A person reviews it, with a first look within five working days. The CV is deleted on the date Privacy states (SECURITY decision 4) |

**Door 5 · Reports, now ("Send me the first report")**

| | |
|---|---|
| They send | Their email |
| It goes to | The list, tagged "first report", once they confirm; a CRM contact |
| Who hears | No one at once. The Monday numbers |
| What they get | "Check your inbox", then the confirm-your-address email |
| CRM stage | Contact: subscriber, "first report" |
| What follows | **One email when the first report is cleared for publication.** Nothing else, unless they also chose the notes |

**Door 6 · Reports, later (asking for a full report)**

| | |
|---|---|
| They send | Name, work email, company, role, consent |
| It goes to | The CRM: the person, the company, and a task, "Check and send report X", due in one working day |
| Who hears | audit@, by email and the task |
| What they get | Within a minute, from audit@: "A member of the team will send the full report within one working day" (sitemap) |
| CRM stage | Contact: "report requested". A deal only if they reply |
| What follows | At most three emails. **Day 0–1:** a person checks the requester isn't a competitor, then sends the report as a link that expires after 14 days, marked with the requester's company. **Day 7:** the field note on the same subject, once. **Day 10, only for a company that fits:** a short personal note offering the audit. Then stop. Terms gains a line: full reports are confidential, for the requester's own use |

**Door 7 · The Lab waitlist**

| | |
|---|---|
| They send | Work email, name, company, role; "What would you want it to do first?" (optional); an unticked "Also send me the field notes" |
| It goes to | The CRM at once, tagged "Lab waitlist" (the sitemap's rule; Privacy says so). The list, tagged "Lab", once they confirm |
| Who hears | A daily summary to the founding team at 9:00 a.m. New York, never an instant alert. Each month a person reviews the waitlist for companies that fit (sitemap) |
| What they get | "One click confirms your place on the waitlist", then the confirm email, then /confirmed/ with the Lab's own line |
| CRM stage | Contact: "Lab waitlist". No deal and no sales email: they asked about the Lab, not for a pitch |
| What follows | An email only when the Lab page changes, **at most once a quarter**, plus first word when early access opens (decision 4, settled as proposed) |

**Door 8 · Field-notes sign-up ("Get new field notes")**

| | |
|---|---|
| They send | Their email (Insights, the end of every note, or its own link, kelwin.co/insights/#notes) |
| It goes to | The list, tagged "notes", once they confirm; a CRM contact once confirmed |
| Who hears | No one at once. The Monday numbers |
| What they get | "Check your inbox", the confirm email, then a short welcome with the latest note |
| CRM stage | Contact: subscriber, "notes" |
| What follows | At most one email a month, only when notes have published (BLOG.md) |

**Door 9 · The Index notice ("Tell me when the Index is out")**

| | |
|---|---|
| They send | Their email |
| It goes to | The list, tagged "Index", once they confirm |
| Who hears | No one at once |
| What they get | The confirm email |
| CRM stage | Contact: subscriber, "Index" |
| What follows | One email when the Index is published. No date anywhere until then |

**Everywhere:** a sign-up from someone who later asks for the audit gains the tag "in conversation", and the list's
emails skip that tag. The tag comes off only if the conversation ends and the person agreed to stay on the notes.

### 4.4 One pipeline in the CRM, for both families

You asked for one premium sales process for the packages and the fixed-scope engagements alike. LIFECYCLE.md sets
its nine steps; the CRM follows them, in one pipeline (which is also what HubSpot's free tier allows).

| # | Stage | It enters when | Who moves it |
|---|---|---|---|
| 1 | **Audit requested**, or **Enquiry** (an engagement named on Contact) | The form is sent | The form program |
| 2 | **First call booked** | The calendar is booked, or a time is agreed | The calendar, through the form program; or a person |
| 3 | **First call held** | After the 30 minutes; the recap goes out within one working day | A person |
| 4 | **Diagnosis**: the System Audit (ten working days) or the scope check (up to three) | Agreed on the call, and access has arrived | A person |
| 5 | **Readout presented** (60 minutes, or 30) | The readout call; the written readout follows | A person |
| 6 | **Plan to decide** | The dated plan is agreed | A person |
| 7 | **Proposal presented** | Within 5 working days of the readout (2 for a fixed-scope engagement) | A person |
| 8 | **Signed** (won) | The contract is signed; the welcome note goes out within one working day | A person |
| 9 | **Not now** (lost, with a reason) | At any point | A person; a check-in task is set for about 90 days later |

Questions during the sale (security, insurance, references) are tasks on the deal, not a stage. On every deal:
the family and the engagement named; the three answers, the score and its band; the weakest part they named; how
they heard; their country and where the company is based; the first page, the source and the campaign.

### 4.5 Lead scoring: how fast we answer, never whether

The three questions already decide who qualifies. **The score never turns anyone away.** It only sets how fast we
answer and who answers. The visitor never sees it.

| What the answers say | Points |
|---|---|
| "Where is revenue today?": real, but lumpy | 2 |
| "Where is revenue today?": already predictable | 3 |
| "How do your deals close?": sales-led, a committee decides | 3 |
| "How do your deals close?": hybrid, self-serve plus sales | 2 |
| Role: founder, CEO or another chief, VP, "Head of" | 2 |
| Role: director | 1 |
| A work email on the company's own domain, matching the website given | 1 |
| A free mailbox (Gmail, Outlook and the like) | 0, and flagged for a person to check |
| They heard from someone who told them, or from a field note | 1 |
| The visit passed through Engagements or a capability page | 1 |

- **Band A, 9 to 11 points:** a phone alert to you; you take the first call; a reply within one working hour.
- **Band B, 6 to 8:** a reply the same working day.
- **Band C, 5 or less:** a reply within one working day. On the call, a fixed-scope engagement may fit better.

The third question, "What does it feel like from inside?", adds no points. It names the weakest part, which sets the
link in the acknowledgement and how we prepare the call: "not enough pipeline" points to GTM Infrastructure;
"pipeline dies mid-funnel" to Narrative Systems, then GTM Intelligence; "the message isn't landing" to Narrative
Systems; "honestly unsure" to the whole system, which is what the audit is for.

**Why speed matters this much:** in an audit of 2,241 US companies, firms that answered within an hour were nearly 7
times as likely to qualify the lead as firms that answered an hour later [16]. Our own GTM Intelligence page cites it.

**We review the bands after the first 20 audit requests,** against the calls that went well, and adjust.
Contact messages use the same role and email points, plus the reason.

**Capacity.** LIFECYCLE.md caps free audits at two a month. The Monday numbers show audits booked this month against
that cap, so a third strong request is a conversation about timing, not a surprise.

### 4.6 Alerts

| What happens | Who hears | How | When |
|---|---|---|---|
| An audit request, band A | You | Email to audit@ with "A" in the subject; a phone alert in the founding team's Google Chat space (part of Workspace), with HubSpot's phone app as the backup; a CRM task due in one working hour | Within a minute |
| An audit request, band B or C | Whoever holds audit@ that day | Email and a CRM task | Within a minute |
| A first call booked | The person taking it | A calendar invitation with the answers in it | At booking |
| A Contact message | The inbox for its reason; press and partnerships flagged for you | Email and a task | Within a minute |
| An application | careers@ | Email with the protected CV link | Within a minute |
| A report request (later) | audit@ | Email and a task due in one working day | Within a minute |
| The Lab waitlist | The founding team | A daily summary | 9:00 a.m. New York |
| Sign-ups (notes, Index, not yet, first report) | — | The Monday numbers only | Mondays |
| **A reply past its time** | Its owner, and you | HubSpot's reminder, and the Chat space | Each working morning |
| **The machine itself:** a form step failing for over an hour, the site not answering, a rise in mail failures | The founding team | The Chat space | As it happens |

"A working day" means Monday to Friday, New York time, except US public holidays (LIFECYCLE.md).

### 4.7 Reply times, in one place

| Door | What the site promises | What we aim for |
|---|---|---|
| The audit | One working day (approved) | Band A: one working hour. B: the same working day. C: one working day |
| Contact, an engagement named | One working day (the sitemap's proposal, adopted) | The same working day |
| Contact, anything else | Two working days (approved) | One working day |
| Careers | An acknowledgement at once; a reply either way, within ten working days | A first look within five working days |
| A full report (later) | Within one working day (sitemap) | The same |
| The lists | At most one email a month (notes); at most once a quarter (Lab) | Kept |
| A request to see or delete data | As Privacy will state | Ten working days; the law's limit is one month for Europe (the lawyer confirms) |

### 4.8 The Monday numbers

**What.** A one-page email to the founding team every Monday at 8:45 a.m. New York, also posted in the Chat space.
Our timer builds it from Plausible, HubSpot, Buttondown, the calendar's booking notices and the form program's own
records. It costs nothing. Each line shows this week, last week and the four-week average.

| Line | From |
|---|---|
| Visits and the top five sources, with AI assistants as their own line | Plausible |
| The audit: started → qualified → sent, and declined | Plausible and the form program |
| Audit requests by band, and by the weakest part named | The CRM |
| **Audits booked this month, against the cap of two** | The CRM |
| First calls booked, and held | The calendar and the CRM |
| **The median time to our first reply,** and any reply that missed its time | The CRM's tasks |
| Contact messages, by reason | The CRM |
| Deals open by stage, and any that moved | The CRM |
| Report requests (later) | The CRM |
| Applications, by role | The talent pool |
| The list: new sign-ups by tag, the share who confirmed, unsubscribes | Buttondown |
| The Lab waitlist: new entries, and any from companies that fit | The CRM |
| "How did you hear about us?", tallied, with "An AI assistant" shown | The CRM |
| The machine's health: failed steps, spam blocked, the share of our mail passing its checks | The form program and the mail reports |

**Each month:** which pages and which notes led to audits. **Each quarter:** the review the order of work already
plans ("which pages bring audits, and which don't"), plus a look at the score bands.

### 4.9 What stays with a person, and why

Every reply to a buyer who fits, every follow-up after the first acknowledgement, every list send, and every report
sent. A firm that sells high-touch work is judged by who writes back. The speed comes from the alerts, not from
automated emails.

---

## 5 · What the Privacy page must then say

Today's Privacy page promises "no cookies, runs no analytics", that forms only open the visitor's mail program, and
that nothing is entered "into a CRM, marketing platform, or automated sequence". **All three stop being true the day
the first form connects,** so the new page goes live the same day, after a US lawyer has read it. It must say:

1. **Who we are:** Kelwin, New York, New York, USA, and how to reach us about privacy.
2. **Each form, in turn:** what it asks for, why, where it goes and how long we keep it (SECURITY.md has the table).
3. **The four quiet facts every form records** about the visit (4.2), and that they come from the page's memory,
   not a cookie.
4. **The services we use, by name,** and what each holds: Cloudflare (hosting, the bot check, the form program, CV
   storage); Google Workspace (mailboxes); HubSpot (the CRM); Buttondown (the list); Resend (acknowledgements);
   Cal.com (the calendar); Plausible (cookie-free counts).
5. **The Lab waitlist enters the CRM before the person confirms their address;** the list only after.
6. **The score:** we sort enquiries to decide how fast we reply, never to decide who is served, and we don't buy
   data about anyone.
7. **CVs:** private storage, who can open them, the formats we accept, and the date they're deleted.
8. **Cookies:** none that need consent. The bot check runs without one in the mode we use; the calendar loads only
   when a visitor asks to book. We check both in a clean browser before launch, and if either sets one, this
   promise changes before go-live.
9. **The local clock in the footer** reads the visitor's time-zone setting in their own browser; nothing is sent.
10. **AI-assistant visits** are counted as a source, with no personal data.
11. **Rights:** to see, correct, delete or take a copy of their data, and to object; how to ask; when we answer. The
    lawful reason for each use (SECURITY.md).
12. **Data leaving Europe:** how each service covers it, and whether Kelwin needs a representative in the EU or the
    UK (a question for the lawyer).
13. **The lists:** double opt-in, the date of consent kept, one-click leave, and the postal address in every email.
14. **Changes:** the effective date, and what changed.

**Terms gains two lines:** full reports are confidential and for the requester's own use; and the field notes may be
quoted with a link.

---

## 6 · The accounts you create, in Kelwin's name, in this order

You create these, because they must be in Kelwin's name. We set up everything inside them with you. Each one gets a
security key or passkey from day one (never text-message codes), its recovery codes on paper, and the GTM engineer
invited with the smallest role that works (SECURITY.md).

| # | When | Account | Why this order | Your time |
|---|---|---|---|---|
| 1 | This week | **The password manager** (Bitwarden Teams), and order **two security keys** | Every login below goes into it from the start. Use the phone's passkey or an authenticator app until the keys arrive | 20 minutes |
| 2 | This week | **The GitHub organization**, on GitHub Team | The project is private on your personal account since 19 October; on the free plan its live branch can't be protected. We move it in (DECISIONS.md, decision 13) | 15 minutes |
| 3 | This week | **The registrar** that holds kelwin.co: not a new account, but secure it | Two-step sign-in, the transfer lock, auto-renew, and a recovery email outside kelwin.co | 15 minutes |
| 4 | Week 1 | **Google Workspace**, Business Starter: your seat, then the spare admin seat | Every account after this one is opened with a kelwin.co address | 30 minutes, with us |
| 5 | Week 1 | **Cloudflare** | Then you change kelwin.co's nameservers at the registrar to Cloudflare's | 15 minutes, with us |
| 6 | Week 2 | **HubSpot**, **Buttondown**, **Plausible**, **Resend**, **Cal.com** | Each needs the mail and the domain settings from steps 4–5 | 30 minutes |
| 7 | Before launch | **Google Search Console** and **Bing Webmaster Tools**, and a free uptime monitor | Verified through the domain's settings, which we add | 15 minutes, with us |

Also: make sure Kelwin's LinkedIn company page has at least two admins, each with two-step sign-in.

---

## 7 · The set-up, step by step, with you

| When | You | Us |
|---|---|---|
| **This week** | Accounts 1–3; the free GitHub settings in SECURITY.md (about ten minutes) | Move the project into the organization (it is already private); protect the live branch |
| **Week 1** | Accounts 4–5 | audit@, careers@, notes@, security@ and dmarc@; SPF, DKIM, DMARC at "report only"; encrypted-delivery settings; Google's mail-reputation reports; the domain's protections on Cloudflare; the private preview address; deploys to Cloudflare, preview only |
| **Week 2** | Account 6; invite the GTM engineer | The CRM pipeline and fields; the list, its tags and the /confirmed/ pages; the bot check; private CV storage with its deletion rule; the talent-pool sheet |
| **Weeks 2–4** | Approve the words of each acknowledgement | Build and test the form program on the private preview; the alerts; the Monday numbers; the blogging system (BLOG.md) |
| **Week 3** | — | DMARC to "quarantine" |
| **Week 6** | — | DMARC to "reject" |
| **With each page group in stage 6** | Approve the page | Connect each form as its page is built: Contact and the audit, then Careers, Reports, The Lab, Insights |
| **Before go-live** | A US lawyer reads Privacy and Terms | The new Privacy page; the security settings tried on the private preview; the price check (Appendix E); a test entry through every door |
| **Go-live, on your go-ahead** | The go-ahead | kelwin.co on Cloudflare; the old preview addresses answer "not found"; Search Console and Bing; the main security policy in "report only" for two weeks, then enforced (SECURITY.md) |
| **Soon after** | — | The calendar step on the audit page |
| **About six weeks after launch** | — | The last step of the HTTPS setting (SECURITY.md) |

---

## 8 · What it costs

All last known around mid-2026, **not re-checked**. The pages to check are in Appendix E.

| Line | At launch | By month 12 | What makes it go up |
|---|---|---|---|
| Cloudflare: hosting, the form program, storage, the database, the bot check, the private preview | $0 | $0–5 | Over 100,000 form-program requests a day, or CV checks that need more computing: Workers Paid, $5 [7] |
| Acknowledgements (Resend) | $0 | $0–20 | Past about 3,000 emails a month |
| CRM (HubSpot) | $0 | about $30–40 | Starter for two seats: a third person, unbranded meetings, or a second pipeline |
| Email list (Buttondown) | about $9 | about $9 | Past 1,000 subscribers: about $29 |
| Calendar (Cal.com) | $0 | $0 | A shared team calendar: about $12–15 a person |
| Visitor counts (Plausible) | about $9 | about $9–19 | Funnels or the reporting connection, or past 10,000 page views a month |
| Mailboxes (Google Workspace) | about $7–8.40 | about $14–25 | A seat for each person who writes as Kelwin |
| **These services** | **about $25–27** | **about $60–120** | |
| Security (SECURITY.md): GitHub Team, the password manager, the spare admin seat | about $15–16 | about $23–25 | One GitHub and one password-manager seat per person with access |
| **Everything, a month** | **about $40–45** | **about $85–145** | |
| Once | about $50–110 for two security keys | about $50–110 a pair for each later admin | |
| Each year | the domain's renewal | — | — |
| Later, optional | Kelwin's logo beside its emails in Gmail (BIMI): about $1,000+ a year, and it needs a registered trademark or a year of the logo in use | | |

---

## Appendix A · Hosting, for the builders

- **Product:** Cloudflare Workers with static assets, `assets.directory = "out"`. Only `/api/*` runs the Worker
  (`run_worker_first = ["/api/*"]`); every other request is an asset, free and unlimited, and never invokes the
  Worker [5]. On the free tier, requests that do invoke the Worker get a 429 once the daily limit is spent, which is
  one more reason to keep pages off it [5].
- **Files in `public/`:** `_headers` (SECURITY.md, Appendix A) [3]; `_redirects` for `/capabilities/` and any retired
  address, with an explicit `301` [4]. Neither file applies to the Worker's own responses, which set their own headers
  and redirects [3][4].
- **Trailing slashes and 404s:** `assets.html_handling` set so `/about` redirects to `/about/`;
  `not_found_handling = "404-page"`. Check after launch that unknown addresses answer 404, not 200 (SEARCH-BUILD.md).
- **Base path:** `NEXT_PUBLIC_BASE_PATH` becomes empty at kelwin.co; links built with `next/link` and relative asset
  paths keep working (CLAUDE.md). `metadataBase` set to `https://kelwin.co`.
- **Deploys:** the existing GitHub Actions file on `main` keeps building; its last step changes from the Pages upload
  to `wrangler deploy`, with a Cloudflare API token scoped to this one Worker and its routes, stored as a GitHub
  secret in a `production` environment limited to `main`. The post-build step that writes each page's script rule
  (SECURITY.md) runs between `next build` and the deploy. **Deploy only from this clean build, never by uploading a
  local folder** (SECURITY.md, finding 10).
- **Previews:** pull requests and the working branch build with drafts included and deploy a preview version. The
  plan: Workers preview addresses with an alias per branch, behind Cloudflare Access (to test in set-up). Fallback: a
  second Worker on `preview.kelwin.co`, behind Access. Either way, `X-Robots-Tag: noindex` on every preview response.
- **The spare address:** `workers_dev = false` on the production Worker at go-live, so no second public copy exists.
- **The old preview:** the github.io addresses answer 404 since the project went private (19 October). Only if
  you ask: a tiny separate public repository with one forwarding page per old path.
- **Cloudflare plan:** Free. Turn on: the Free Managed Ruleset, DNSSEC, Certificate Transparency alerts to audit@,
  "Always use HTTPS", the minimum TLS version at 1.2. Leave off: managed robots.txt and "Block AI bots", or set them
  to match SITEMAP decision 3.

## Appendix B · The form program, for the builders

**Addresses:** `POST /api/audit`, `/api/contact`, `/api/careers`, `/api/signup` (notes, Lab, first report, Index, not
yet; the tag in the body), `/api/report`; `POST /api/hooks/buttondown` and `/api/hooks/cal` (signed notices);
`POST /api/csp-report`; `GET /api/health`.

**For each submission, in order:**
1. Refuse unless `Origin` is `https://kelwin.co` (and the preview address on preview builds). Cap the body: 64 KB, or
   10 MB for Careers.
2. Check the Turnstile token with Siteverify, on the server, every time; tokens can be forged, expire after 300
   seconds and work once [9]. Use the managed widget, never Pre-Clearance (it sets a cookie; SECURITY.md).
3. Honeypot filled, or under 3 seconds on the page: answer "received", then drop it silently.
4. Rate limits per IP and per email address with the Workers rate-limiting binding (eventually consistent, so treat it
   as a brake, not a counter) [10].
5. Validate every field: lengths, formats, required fields, an email that parses; `https://` only for LinkedIn and
   work links.
6. Work out the score and band (4.5) for the audit and Contact.
7. **Save the raw submission to D1** with a random ID and the state of each later step.
8. Careers: check the file (SECURITY.md: PDF signature `%PDF-`; DOCX a zip with `word/document.xml` and no
   `vbaProject.bin`), store it in a private R2 bucket under a random name, and keep the original name only as text.
   An R2 lifecycle rule deletes CVs on schedule [11].
9. Send on, each step recorded in D1: HubSpot (create or update the contact by email, then the company, then the deal
   or task, with the properties in Appendix C); Buttondown (only if asked; Buttondown sends the confirm email); the
   alert email to the right group; the acknowledgement through Resend (never echoing free text, at most one per
   address per day).
10. Answer `{"ok":true}` with `Content-Type: application/json`, `X-Content-Type-Options: nosniff`,
    `Cache-Control: no-store`. No CORS headers, because forms post to our own address.

**The timer:** one Cron Trigger every 15 minutes runs everything scheduled, so the free plan's cron limit never
binds: retries (any step not done after 15 minutes, again each run; an alert after an hour); the 9:00 Lab summary;
the morning list of replies past their time; the Monday numbers at 8:45 New York; the 90-day deletion of raw copies;
the six-month "not yet" check-in list.

**Booking notices:** a Cal.com booking whose email has no open "Audit requested" deal is flagged to a person.

**Logs:** the submission ID, the door, the outcome and the time. Never a name, an email, a message or a file
(SECURITY.md).

**Secrets:** Turnstile secret, HubSpot key, Buttondown key, Resend key, the Cal.com and Buttondown signing secrets,
the Chat webhook: all as Worker secrets, never in the repository.

**Computing time:** the free plan gives 10 ms of computing per request [6]. Opening a 10 MB Word file may come close.
Measure on the preview; if it does, Workers Paid ($5).

**One switch:** an environment setting that makes every form show "Write to audit@kelwin.co" instead of posting, for
an incident or an outage (SECURITY.md).

## Appendix C · The CRM and the list, for the builders

- **HubSpot key:** a private app, with only the scopes for contacts, companies, deals, notes and tasks. Check at
  set-up that private apps are allowed on the free tier, the free tier's user limit, and any cap on custom fields
  (Appendix E). If fields are capped, keep about six as fields and put the rest in a note on the record.
- **Contact and deal fields:** family (retained, fixed-scope); engagement named; Q1, Q2, Q3 answers (and the size
  answer, if adopted); score; band; weakest part; how heard; country; company based in; form page; first page;
  referrer; campaign source, medium and name; consent wording and date; list tags; "in conversation".
- **Pipeline:** the nine stages in 4.4, in that order.
- **Buttondown:** one list; tags `notes`, `lab`, `first-report`, `index`, `not-yet`, `in-conversation`; double opt-in
  on; the confirm page set to `https://kelwin.co/confirmed/?tag=…`; read-tracking off; sending domain authenticated on
  a subdomain; notices of confirmations and unsubscribes signed and sent to `/api/hooks/buttondown`, which marks the
  CRM record. Unsubscribes are kept as a do-not-contact list.
- **Talent pool:** a Google Sheet in Kelwin's Drive, shared with named people only. Every cell that starts with `=`,
  `+`, `-`, `@`, a tab or a carriage return is written with a leading single quote (SECURITY.md).

## Appendix D · kelwin.co's mail records, for the builders

| Record | Value, in outline | What it does |
|---|---|---|
| MX | Google's mail servers | Mail to kelwin.co arrives in Workspace |
| SPF (TXT on kelwin.co) | `v=spf1 include:_spf.google.com -all` | Only Google sends as kelwin.co itself. Resend and Buttondown use their own bounce subdomains, so they stay out of this record and under its ten-lookup limit |
| DKIM | `google._domainkey` (2048-bit); Resend's and Buttondown's keys on their own names | Proves the mail came from us, unchanged |
| DMARC (`_dmarc`) | `v=DMARC1; p=none; rua=mailto:<Cloudflare's report address>,mailto:dmarc@kelwin.co`, then `p=quarantine` (week 3), then `p=reject; sp=reject` (week 6) | Tells inboxes to refuse fakes; the reports show who sends as us [12][18] |
| MTA-STS and TLS reports | `_mta-sts` TXT, a policy file at `https://mta-sts.kelwin.co/.well-known/mta-sts.txt` (testing, then enforce), `_smtp._tls` TXT | Mail to us travels encrypted |
| Subdomains that never send | `v=spf1 -all` and a null MX | Nobody can send as anything.kelwin.co |
| BIMI | Later | Needs DMARC at quarantine or reject, and a paid certificate |

**Checks:** Google Postmaster Tools; Cloudflare's DMARC reports, read weekly [12]; once a month, a test send to Gmail
and Outlook, checking that SPF, DKIM and DMARC pass. Google's and Yahoo's sender rules (authenticated mail, complaints
below 0.3%, one-click unsubscribe) are strictest near 5,000 messages a day [14][15]; we meet them at any volume.

## Appendix E · The price check before sign-up

None of these pages could be opened this round. Check each figure in sections 1, 3 and 8, and date the check:
- **Hosting:** cloudflare.com/plans/developer-platform/ · developers.cloudflare.com/workers/platform/pricing/ ·
  netlify.com/pricing/ · vercel.com/pricing
- **Forms (runner-ups):** formspree.io/plans · usebasin.com/pricing
- **Sending:** resend.com/pricing · postmarkapp.com/pricing
- **CRM:** hubspot.com/pricing/crm (also the free tier's user limit, custom fields and private apps) ·
  attio.com/pricing
- **List:** buttondown.com/pricing (also: which tier has feed-to-email and sending from our own domain) ·
  kit.com/pricing
- **Automations:** make.com/en/pricing
- **Calendar:** cal.com/pricing
- **Visitor counts:** plausible.io/#pricing (also: which tier has the reporting connection and funnels) ·
  umami.is/pricing
- **Mail:** workspace.google.com/pricing · microsoft.com/microsoft-365/business/compare-all-microsoft-365-business-products
- **Security lines:** github.com/pricing · bitwarden.com/pricing/business/ · yubico.com/store/

---

## Sources

How each was read: **read at source** means the publisher's own documentation files, read on 18–19 October 2026;
**as reported** means a search engine's summary, 18 October 2026, because the page itself would not open; **our
knowledge** means last known around mid-2026, not re-checked.

1. GitHub, "GitHub Pages limits" (not for running an online business; not for sensitive transactions):
   https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits (read at source, from
   github.com/github/docs).
2. Next.js 16, "Static exports" (headers are not supported in a static export):
   https://nextjs.org/docs/app/guides/static-exports (read at source, in the site's own copy of the documentation).
3. Cloudflare, Workers static assets, headers (the `_headers` file; it does not apply to the Worker's own responses):
   https://developers.cloudflare.com/workers/static-assets/headers/ (read at source, from
   github.com/cloudflare/cloudflare-docs).
4. Cloudflare, Workers static assets, redirects (the `_redirects` file; not applied to the Worker's own responses):
   https://developers.cloudflare.com/workers/static-assets/redirects/ (read at source, 19 October 2026).
5. Cloudflare, Workers static assets, billing and limitations ("Requests to static assets are free and unlimited";
   the free tier's 429 on Worker-first routes):
   https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ (read at source, 19 October 2026).
6. Cloudflare, Workers limits (100,000 requests a day on the free plan; 10 ms of computing per request):
   https://developers.cloudflare.com/workers/platform/limits/ (read at source); also as reported:
   https://pocketlantern.dev/briefs/cloudflare-workers-free-tier-100k-requests-per-day-limit-2026
7. Workers Paid at $5 a month (as reported; one source lists $20, likely a different plan):
   https://www.budgetforge.dev/tools/cloudflare-workers-pricing-2026 ;
   https://eastondev.com/blog/en/posts/dev/20251201-cloudflare-pricing-compare/ . Check at
   https://www.cloudflare.com/plans/developer-platform/
8. Cloudflare's direction from Pages to Workers (as reported): https://developers.cloudflare.com/workers/wrangler/deprecations/ ;
   https://mecanik.dev/en/posts/cloudflare-pages-vs-workers-which-to-use-in-2026/ ;
   https://cogley.jp/articles/cloudflare-pages-to-workers-migration
9. Cloudflare Turnstile, server-side validation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
   (read at source).
10. Cloudflare Workers rate limiting: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
    (read at source).
11. Cloudflare R2 object lifecycles: https://developers.cloudflare.com/r2/buckets/object-lifecycles/ (read at source).
12. Cloudflare DMARC Management (free with Cloudflare DNS): https://developers.cloudflare.com/dmarc-management/
    (read at source).
13. Buttondown, RSS-to-email (checks every 30 minutes; send or draft; a paid feature):
    https://github.com/buttondown/docs/blob/main/content/pages/rss-to-email.mdoc (read at source).
14. Google, email sender guidelines: https://support.google.com/a/answer/81126 (as cited in Kelwin's deliverability
    field note; not re-opened).
15. Yahoo, sender best practices: https://senders.yahooinc.com/best-practices/ (as cited in the same note; not
    re-opened).
16. Oldroyd, McElheran and Elkington, "The Short Life of Online Sales Leads", Harvard Business Review, March 2011:
    https://hbr.org/2011/03/the-short-life-of-online-sales-leads (as cited on GTM Intelligence; not re-opened).
17. Plausible, proxying through Cloudflare (its current two-part snippet): https://plausible.io/docs/proxy/guides/cloudflare
    (read at source, from github.com/plausible/docs).
18. CISA, SCuBA baseline for Google Workspace mail (SPF, DKIM, DMARC at reject):
    https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/gmail.md (read at source).

**Standards named from our knowledge:** SPF (RFC 7208), DKIM (RFC 6376), DMARC (RFC 7489), one-click unsubscribe
(RFC 8058), MTA-STS (RFC 8461), TLS reports (RFC 8460), at https://www.rfc-editor.org/

**Kelwin's own documents, read directly:** ROUND10-NOTES.md and ROUND11-PLAN.md; this round's SITEMAP.md,
LIFECYCLE.md, SEARCH-BUILD.md and OFFER.md; the round-10 NEXT-STEPS.md; the site's audit questions
(`QualifyFlow.tsx`), Privacy page and deploy script. Our own research notes for this stream, with every vendor
comparison, stay in the working folder.

---

## Decisions for the founder

**Reconciled:** decision 1 is now part of DECISIONS.md, decision 12 (with the security keys and the spare admin);
decision 2 is part of decision 6 (who does what); decisions 3 and 4 are settled as proposed.

**1. Approve the services, and move the site to Cloudflare?**
- **Proposed:** yes. Cloudflare for hosting, our own form program, Resend, HubSpot's free CRM, Buttondown, Cal.com,
  Plausible and Google Workspace, about $25–27 a month at launch for these services. You create the accounts in
  section 6; we set up everything inside them with you.
- **Why:** GitHub Pages can't run forms, send the security settings or keep drafts private, and its own terms say it
  isn't for running a business. This stack does all of it, keeps what visitors send in Kelwin's own accounts, and
  needs no paid connector.

**2. Who answers what, each working day?**
- **Proposed:** you take band-A audit requests (the phone alert; a reply within one working hour). One named
  contractor holds audit@ from 9 a.m. to 6 p.m. New York for everything else, and hands you anything that needs you.
  careers@ goes to you and that role's reviewer. Acknowledgements are signed "The Kelwin team"; a personal reply is
  signed with the writer's first name and "Kelwin".
- **Why:** you are on sales calls 12–15 hours a day. Without a named owner, a strong lead waits behind a full
  calendar, and the one-working-day promise breaks. The site names no one, but an email to one buyer is from a
  person, and should read like it.

**3. Careers: a reply to every applicant, either way?**
- **Proposed:** yes, within ten working days, as a short note a person sends. The acknowledgement then says "We reply
  either way."
- **Why:** it is what a premium firm does, it costs a few minutes an application, and silence is what applicants
  remember. If you'd rather not commit, the acknowledgement says only "received", and nothing more.

**4. The Lab waitlist: at most one email a quarter?**
- **Proposed:** yes. An email only when the Lab page changes, at most once a quarter, plus first word when early
  access opens. Each month a person looks at the waitlist for companies that fit; no one on it gets a sales email.
- **Why:** you said "As the vision or the idea for the product becomes much clearer, we can tease a bit more through
  the waitlist", so "one email when invitations open" was too little. A fixed ceiling keeps the waitlist a promise we
  can keep.

---

## Reconciled in round 11

Changes made when this round's five pieces of work were put together (19 October 2026). The decisions
now sit in DECISIONS.md.
- The project is private since 19 October and the github.io preview is dark (sections 2, 6, 7, Appendix A). Moving it
  into the organization is DECISIONS.md, decision 13.
- The one-working-day reply for a message that names an engagement is adopted by the lifecycle (4.1, 4.7).
- Careers "We reply either way" (decision 3) and the Lab's quarterly email (decision 4) are settled as proposed.
- The size question now points to DECISIONS.md, decision 3.
