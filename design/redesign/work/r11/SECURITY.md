# Security: what we make hard, and how we'd notice

Round 11 · 19 October 2026 · for your yes

**Handling.** The project's files are private since 19 October 2026 (finding 1, closed), and the public preview is
dark, so the two weaknesses still on `main` (findings 3 and 4) can't be reached until a deploy, which will carry their
fixes. This file describes each weakness in general terms only; keep it out of any public copy.

This answers the third of your additions to the order of work: "Make the website fully secure so there are no chances
of potential cyberattacks or cybersecurity-related risks." It also covers the security side of "Can the site store
what visitors send? YES, SET THEM UP".

It builds on BACKEND.md (the services and the forms) and BLOG.md (the editor for field notes), and on a security
review of today's code that we ran and then checked a second time, by trying to make each finding happen on a real
build in a real browser. The verified findings are near the end.

**How sure the facts are.** Most outside websites would not open from here this round. OWASP, Mozilla, GitHub,
Cloudflare and CISA publish their guidance as files on GitHub, which did open, so the technical plan is **read at
source**. Four things we **tested ourselves** on the site's own build. The law and every price are our own knowledge
from around mid-2026, not re-checked: the law goes to the lawyer, and the prices to the one-hour check in
BACKEND.md. The sources are numbered in square brackets and listed at the end.

---

## An honest word on "fully secure"

No website, and no company, can be made impossible to attack. Anyone who promises that is selling something. What
serious firms do, and what this plan does:
- **close the usual ways in;**
- **make every account very hard to take over:** each one opens only with a physical key;
- **keep as little of visitors' data as the work needs,** for as short a time as we can;
- **notice within a day** if something is wrong, and know what to do in the first hour.

For a firm of Kelwin's size, the attacks that actually happen are, most likely first (our knowledge):
1. **A stolen login.** A phishing email, a reused password, a SIM swap. Whoever holds the domain, the mailbox or
   GitHub holds the site.
2. **Someone sending email as kelwin.co.** Fake invoices to clients, fake replies to prospects.
3. **Form abuse.** Spam, fake audit requests, our forms used to send mail to strangers.
4. **A poisoned building block.** A hijacked software package or build step that changes the site as it is built.
5. **A harmful file.** A CV that carries malware.

Breaking into the website itself comes lower on that list. It is a set of finished pages, and today it loads nothing
from other companies.

---

## 1 · The short answer

### The ten things, in order

| # | What | Why | Cost | Who |
|---|---|---|---|---|
| 1 | **Lock every account:** security keys or passkeys on Google, GitHub, Cloudflare and the registrar; one password manager; recovery codes on paper | A stolen login is the most likely attack, and it gets around everything else | About $50–110 once for two keys; about $4 a person a month for the password manager | You, with us |
| 2 | **Move the project, private since 19 October, into a GitHub organization** in Kelwin's name, on GitHub Team | Finding 1 is closed, but a private project on GitHub's free plan can't protect its live branch [17] | About $4 a person a month | You decide (DECISIONS.md, decision 13); we move it |
| 3 | **Move to Cloudflare and send the security settings with every page,** including a rule that lists exactly which scripts each page may run | GitHub Pages can't send them. Our rule passed on every page of today's site, with nothing broken | $0 | Us |
| 4 | **Make kelwin.co's mail impossible to fake:** SPF, DKIM, then DMARC at "reject" | Stops fake invoices sent in our name. "We sell exactly this, so our own setup must pass" (NEXT-STEPS) | $0 | You add the mailbox; we set the records |
| 5 | **Guard every form on our own server** | Stops spam and floods, and stops our forms being used to send mail to strangers | $0 | Us |
| 6 | **Handle CVs with care:** PDF or Word only, the real file type checked, private storage, opened only in a browser viewer, deleted on schedule | A CV is the one door that brings a file onto our laptops | $0 | Us; you set how long we keep them |
| 7 | **Guard the build:** an up-to-date Next.js, install scripts off, weekly update alerts, pinned build steps, a check for leaked keys | A hijacked package is how sites get poisoned today | $0 | Us |
| 8 | **Lock the domain:** transfer lock, auto-renew, two-step sign-in at the registrar, signed DNS, certificate alerts | Whoever holds the domain holds the site and the mail | $0 | You at the registrar; us at Cloudflare |
| 9 | **Watch it:** uptime and certificate checks, weekly mail reports, a public security contact | We hear about a problem before a buyer does | $0 | Us |
| 10 | **Write down what we keep and what we'd do:** retention per door, a new Privacy page read by a lawyer, a one-page incident plan | It keeps the promises the pages make, and it's what the law asks | The lawyer's time | Us drafting; the lawyer reviewing |

**The number:** about $15–16 a month at launch (GitHub Team and the password manager for one person, and a spare
Google admin seat), about $23–25 once the GTM engineer joins, and about $50–110 once for your two security keys. All
last known around mid-2026, to check. BACKEND.md has the full budget.

**What we'd tell a buyer:** "Our own site and accounts are run to the standard we'd hold yours to: every login on a
security key, mail that can't be faked in our name, and nothing you send us kept longer than we say."

**What we need from you:** DECISIONS.md, decision 13 this week, and the GitHub settings in Part 3 that the free plan
still allows (about five minutes). The keys, the password manager and the spare admin are part of DECISIONS.md,
decision 12.

---

## Part 1 · What we fixed in the code now

Made on the working branch on 19 October 2026. None of it is on the live site yet. It goes there with the next
deploy, after your go-ahead. No page looks different, except seven places that get back a missing space: six
sentences in the three field notes and one label on the Careers form. No new software was added. The code checks pass, and the site builds.

| Finding | The fix | Where | How it was checked | Status |
|---|---|---|---|---|
| 3 · A crafted link could crash the live Contact page | The page ignores any topic it doesn't know | `src/components/sections/ContactChannel.tsx` | Twelve crafted links tried again on today's build (every built-in name such a link could use): no error, the default topic | Done before this round; live with the next deploy |
| 2 and 7 · Next.js 16.2.4 behind on security fixes; build tools with notices | Next.js 16.3.8, held to that exact version, with its matching checking tool. The build tools are updated with it. We installed exactly the package list we had tested | `package.json`, `package-lock.json` | The package check finds no known flaw in anything that ships (it found 30 notices on Next.js before). Five notices remain in one checking tool we use only while writing code. No fixed version exists yet, and none of it reaches a visitor. The same 19 pages build. The seven places read as written again (six sentences in the field notes, such as "failure. The market…", and a label on the Careers form). Checked side by side with today's site: the same styles on every page, and no other change to any page's words or layout | Done on the working branch · commit: [ ] |
| 4 · A crafted link could pin any sentence on the Contact page | Only the six references the site itself links are shown: the Lab's application, the two case dossiers and the three research documents. Anything else is ignored: no pinned text, no jump down the page, nothing added to the email | `src/components/sections/ContactChannel.tsx` | 16 crafted links on today's build. The six real ones still show, jump to the form and pulse. The fake invoice line, a 5,000-character string and "Pay now" are ignored. The page stays 1,440 px wide, with no errors. The real links on the Reports and Lab pages all match the list | Done on the working branch · commit: [ ] |
| 5 · The deploy script had more access than it needs | The run as a whole can only read. The build step, which runs every outside package, can read the code and the Pages settings, and nothing more. Only the deploy step can publish. The access key is no longer left on disk. All five building blocks are pinned to an exact, checked version. The set-up step no longer asks to switch Pages on, since it is already on | The deploy script (`deploy-pages.yml`) | The five versions checked against GitHub today. Each block's own guide confirms the access it needs. The file reads correctly. It runs only once it reaches the live branch, so its first live run is the real test. If that run fails, the live site stays as it was, and we fix it the same day | Done on the working branch · commit: [ ] |

**Why not the newest Next.js (16.4.2):** it came out four days ago, and new releases are where hijacked packages
hide. 16.3.8 is the first version that clears every notice, and it has been out since 30 September. We take 16.4
once it has been out two weeks.

**When Reports is rebuilt:** its new request links must join the list in finding 4, or their reference won't show.

**Checked with motion on,** by machine, in Chrome's engine at desktop width, all 17 pages. The entrances played on
every page. The hero film cut through its three takes with exactly the same timing as before the update (the two
versions run side by side). The menu bar condensed on scroll. No errors, and no sideways scrolling.

**Before any of this reaches the live site:** a look by eye on a laptop and a phone, and your go-ahead, as always.

---

## Part 2 · What we do at launch

### 2.1 Hosting, and the security settings sent with every page

**What they are.** With every page, a server can send instructions the browser obeys: which scripts may run, whether
another site may show our page inside its own, that kelwin.co is HTTPS only, and so on. GitHub Pages can't send any
of them. Cloudflare sends them from one file in the project [1].

**What we send** (Appendix A has the file):
- **the script rule:** pages run only scripts we wrote or approved. It is the main defense against a slipped-in
  script that reads what visitors type into the forms [2][3];
- **no framing:** no other site may show our pages inside its own, so nobody can dress up our forms;
- **HTTPS only,** stepped up over six weeks (below);
- **forms post only to our own address;**
- **less said to other sites** about which page a visitor came from;
- **device features off:** camera, microphone, location and payments, which no page needs.

**The script rule, made strict.** Next.js writes small scripts into every page. The usual answer is a one-time code
on each page view, but that needs a server, and Next's own guide says plainly that static pages can't have one [4].
So a step after the build fingerprints each page's own scripts and writes that page's rule into it. The step approves
only two kinds of script: the framework's own data, recognized by its exact shape, and our two small scripts, from a
reviewed list. **Anything else stops the build.** That is the second net under the field notes, which already can't
carry code (BLOG.md).

**What we tested on today's site** (Appendix B):
- the rule on all 19 pages: no page broke, motion ran everywhere, and nothing was blocked that should run;
- a script planted in the Contact page: the browser blocked it, and the build step refused to build;
- another site framing the Contact page: refused;
- Next.js's own experimental feature for this: it broke every page, so we don't use it.

**One known gap:** styles keep a looser rule, because the design sets many styles inline. Injected styles can't run
code, so this is a smaller risk (our knowledge).

**HTTPS only, in steps.** Browsers can be told to use only HTTPS for kelwin.co, and finally to have that built in. The
built-in list's own advice is to step up slowly, because "removal tends to be slow and painful" [5]:
1. launch day: five minutes;
2. after a quiet week: one week;
3. a week later: one month;
4. about six weeks after launch: two years, and we ask for kelwin.co to be built into browsers.

Before step 1, every kelwin.co address must answer on HTTPS, including the mail-policy address and the preview.

**Two weeks in "report only."** For the first two weeks after launch, the main policy only reports what it would have
blocked, as Mozilla and OWASP advise [2][3]. Framing is still blocked from day one by an older setting, and each
page's script rule is on from day one, since it already passed on every page.

**What we'd tell a buyer:** "Our pages run only the scripts we wrote, can't be framed by another site, and are served
over HTTPS only."

### 2.2 Forms

Every check runs on our own server, not only in the visitor's browser.

| Check | What it stops |
|---|---|
| Cloudflare's bot check (Turnstile), verified on the server every time. Cloudflare's own words: "The client-side widget alone does not protect your forms" [6] | Bots |
| A hidden field only bots fill, and a minimum time on the page | Simple bots and scripted sends |
| Field rules: lengths, formats, a real email address, `https://` links only | Junk, and oversize text |
| Limits per visitor and per email address [7] | Floods and repeats |
| Only kelwin.co may post to our forms | Forged sends from other sites |
| A size cap: 10 MB for Careers, 64 KB for everything else | Huge sends |
| Cloudflare's free firewall rules, "available on all Cloudflare plans" [8] | Known attack patterns |

**Five abuses that are easy to miss:**
1. **Our acknowledgement used to send spam.** A bot types a stranger's address and a message full of links; our reply
   would carry it to them from kelwin.co. So **acknowledgements never repeat what the visitor wrote,** are sent only
   after the bot check passes, and go at most once a day to any address. The audit's acknowledgement shows the three
   answers, which are choices from a list, not free text.
2. **Our list used to flood someone's inbox.** Double opt-in keeps a victim off the list, and the per-address limit
   stops repeated confirmation emails.
3. **Visitor text breaking our alert emails.** A visitor's address goes only in "Reply-To", once it has been checked,
   and anything they typed is made inert before it goes into an email.
4. **Spreadsheet formulas.** The talent pool is a sheet, and CRM exports end up in sheets. A cell that starts with
   "=", "+", "-" or "@" can run as a formula when opened, so OWASP's fix is to start such a cell with a single quote
   [9]. We do that before anything is written to a sheet.
5. **Phishing links aimed at us.** An alert email shows any link a visitor sent as plain text, with the real address
   visible, never as a button. (Finding 4 was the same family, on the page itself.)

**What we log:** a submission number, the door, the outcome and the time. Never a name, an email, a message or a
file.

**What we'd tell a buyer:** "Every form is checked on our server, not just in your browser, and nothing you type is
written into our logs."

### 2.3 Uploads: CVs

| OWASP's rule [10] | What we do |
|---|---|
| Allow only the types the business needs. Its own example: "cv upload, allow docx and pdf" | PDF and Word (.docx) only. Older Word files, files with macros, archives and everything else are refused |
| The browser's file type "cannot be trusted, as it is trivial to spoof"; check the file itself | We read the file's first bytes. A Word file must not contain the part that holds macros |
| Use "a random string as a filename" | Stored under a random name; the original name kept only as text |
| Set a size limit | 10 MB |
| Store files away from the website | Kelwin's private storage on Cloudflare, never public. A CV's link opens only for a signed-in member of the hiring team |
| "Beware of data leakage… by public services" | No CV is ever sent to a public virus scanner, which would share it with strangers |

**Scanning, honestly.** Cloudflare's own upload scanning is only for its largest customers, as a paid extra [11]. So
the protection is in how files are opened:
1. PDFs open in the browser's own viewer, which keeps a file sealed off from the laptop.
2. Word files open in Google Docs, which does not run Word's macros.
3. No one downloads a CV to the desktop, or clicks "Enable editing" or "Enable content".

**Who and how long.** You and one named reviewer per role, each signed in as themselves. A storage rule deletes each
CV on its date; Cloudflare removes it within about a day of that date [12]. How long is decision 4. The form asks
applicants to leave out a photo, their date of birth and health details.

**What we'd tell an applicant:** "Your CV goes into private storage only the hiring team can open, and it is deleted
on the date we tell you."

### 2.4 The writing tool for field notes

BLOG.md chose Sveltia CMS at kelwin.co/admin/, signed in through GitHub by a small helper on Kelwin's Cloudflare
account. Reading its code showed one important thing: **by default, signing in gives the editor a key to every
project the signed-in GitHub account can reach,** not just the website [13][14]. So:
1. **The accounts that write hold only Kelwin's work.** Nothing personal sits behind them.
2. **The live branch is protected.** A stolen key could propose a change, but couldn't publish it.
3. **The editor page runs no outside script** and has its own strict settings. Outside scripts are the usual way such
   a key gets stolen.
4. **The helper only answers for kelwin.co,** which its own documentation calls "both an anti-abuse and a security
   measure" [13].
5. **The organization approves outside apps one by one,** and requires two-step sign-in of every member.
6. **Stronger, if wanted later:** sign in with a key limited to this one project, which GitHub allows, at the cost of a
   new key every 90 days [15]. We'll revisit it when copywriters start saving drafts themselves.

### 2.5 Accounts

**The rules.**
1. **A security key or a passkey wherever it is offered. Never text-message codes.** CISA's baseline for Google
   accounts: phishing-resistant sign-in "SHALL be required for all users", and "SMS or Voice SHALL NOT be used" [16].
   OWASP says text codes "should not be used to protect applications that hold Personally Identifiable Information"
   [18], which is what our forms collect.
2. **Two keys per person:** one on the key ring, one in a safe place. Losing one must never lock anyone out.
3. **Recovery codes on paper,** never kept in the mailbox they would recover.
4. **One password manager for the firm** (Bitwarden Teams, decision 2), with a shared vault for the service accounts.
   Each contractor sees only what their work needs.
5. **Everyone signs in as themselves.** No shared logins.
6. **The smallest role that works,** and access removed **the day** someone stops working with us.

| Account | How you sign in | The settings |
|---|---|---|
| The domain's registrar | Two-step, a key if offered | Transfer lock on; auto-renew on, two years ahead; recovery email **outside** kelwin.co, because if the domain lapsed, its mail would stop too |
| Google Workspace | Security keys only, enforced | Two super admins: yours, and a spare kept offline with its own key (decision 3). Contractors are never admins [16] |
| Cloudflare | Security key | You are the only super admin; the GTM engineer gets a narrower role; the deploy key reaches only the site |
| GitHub | Passkey or security key | The organization on GitHub Team; two-step required of every member; the live branch protected |
| HubSpot, Buttondown, Plausible, Cal.com, Resend | Two-step | Each connection key limited to what it does, for example a send-only key for Resend |
| Kelwin's LinkedIn page | Two-step on each admin's profile | At least two admins |
| The password manager | Security key | Its recovery sheet kept with the spare keys |

**Who gets what:**

| Person | Domain | Google | Cloudflare | GitHub | HubSpot |
|---|---|---|---|---|---|
| You | Owner | Super admin | Super admin | Owner | Super admin |
| The GTM engineer | None | User | The site and storage only | Write; can't approve their own changes to the live branch | Admin for set-up, then a normal seat |
| Copywriters | None | User, or none | None | None at launch (BLOG.md) | None |
| Systems architects, the revenue specialist | None | User | None | None | A seat if they work deals |

**When someone stops working with us, the same day:** remove them from every account above and the password manager;
change any shared password they could see and any key they made; remove their devices from Google; note the date in
the access list.

**What we'd tell a buyer:** "Every account that touches your data needs a physical security key to open, and access
ends the day someone leaves the work."

### 2.6 The domain, DNS and email

**The domain.**
- Signed DNS (DNSSEC), so nobody can quietly redirect kelwin.co. Cloudflare signs it and gives you one record to add
  at the registrar [19]. **The trap:** before ever changing nameservers again, remove that record first, or the site
  disappears for many visitors [19].
- **Certificate alerts:** Cloudflare emails us whenever a certificate is issued for kelwin.co. "Alerts are turned off
  by default", so we turn them on, to audit@ [20].
- A record naming the only certificate issuers allowed for kelwin.co.

**The mail** (BACKEND.md has the records):
- SPF lists only Google and fails everything else; CISA asks for exactly that [21];
- DKIM on for Google and for each service that sends for us [21];
- DMARC from "report only" to "quarantine" to **"reject"** over about six weeks, with the reports read in Cloudflare's
  free DMARC tool [22]. CISA: "The DMARC message rejection option SHALL be p=reject" [21];
- the list's mail from its own subdomain, so a bad week for the list never touches audit@;
- subdomains that never send mail say so, so nobody can send as them;
- encrypted delivery enforced for mail coming to us.

**And one habit:** any change to bank details, ours or a client's, is confirmed by a phone call to a number we
already have. A fake invoice is the most common way small firms lose money to email fraud (our knowledge).

**What we'd tell a buyer:** "Mail that claims to be from kelwin.co and isn't gets rejected by your mail server before
you see it."

### 2.7 The build: the building blocks

| What | Why |
|---|---|
| Install from the locked list of packages, as today | It stops with an error if the list and the lock disagree, and never changes either [23] |
| **Install scripts off** | OWASP calls it "the safest option" [24]; hijacked packages often strike at install. Tested here: the site builds identically without them (Appendix B) |
| An exact version for Next.js | A surprise version never arrives in a routine build |
| **Weekly update alerts,** security fixes at once | GitHub waits three days before proposing an ordinary update; we set seven, and security fixes still come at once [25] |
| A package check in every build | It stops the build on a high or critical flaw in what ships |
| **Build steps pinned to exact versions** | GitHub: pinning is how you stop "a bad actor adding a backdoor to the action's repository" [26] |
| **The least access for each step** | GitHub: "set the default permission… to read access only… then increase, as required, for individual jobs" [26] |
| **A check for leaked keys** (gitleaks) on every change | GitHub's own secret scanning is free only on public projects; on a private one it is a paid extra [17][27] |
| The Cloudflare deploy key reaches only the site | A leaked key can't reach the rest of the account; it is changed when anyone leaves |
| The form program's keys kept as Cloudflare secrets | Hidden in Cloudflare's dashboard, never in the project [28] |
| Deploy only from the deploy script's clean build | Never by uploading a local folder (finding 10) |

**Why now:** in 2025, a widely used GitHub build step had its version labels moved to code that leaked keys, and
several popular npm packages were hijacked (our knowledge [29]). A site that only builds fixed pages is still changed
for every visitor if its build is.

### 2.8 Monitoring: how we'd notice

| What | How | Cost |
|---|---|---|
| Is the site up? Are the forms up? | An outside check every 5 minutes on the homepage, the audit page and the form program, with phone alerts | $0 on a free uptime service; we check its terms allow a business |
| Did a form fail? | The form program's own retries, and its alert after an hour; a marked test entry through every door once a week | $0 |
| Certificates | Cloudflare renews them; certificate alerts on [20] | $0 |
| The domain's renewal | Auto-renew, and a calendar reminder 60 days before | $0 |
| Who sends mail as us | Cloudflare's DMARC reports, read weekly [22] | $0 |
| The settings themselves | Once a month: Mozilla's HTTP Observatory for the page settings [2]; internet.nl for mail and signed DNS | $0 |
| Blocked scripts on our pages | The policy's own reports, sent to the form program, rate-limited | $0 |
| Sign-ins | Google's alerts for suspicious sign-ins; GitHub's and the update alerts' emails | $0 |
| **A public security contact** | A standard file at kelwin.co/.well-known/security.txt naming security@kelwin.co, delivered to audit@, and pointing to "Security and access" on Engagements | $0 |

The security file names no person. The "Security and access" section on Engagements (SITEMAP.md) is built from this
plan, and claims no certification Kelwin doesn't hold.

### 2.9 Privacy, and how long we keep things

**What each door keeps.** The periods are proposals for you and the lawyer.

| Door | What it collects | Where it goes | Kept for | The lawful reason in Europe (lawyer to confirm) |
|---|---|---|---|---|
| The System Audit | The answers; name, work email, company, website or LinkedIn, role; how heard | The form program's copy (90 days); the CRM; audit@ | 24 months after the last contact without an engagement; as a client record for as long as the accountant advises | Steps before a contract, at their request |
| Contact | Name, work email, company, both LinkedIns, the reason, their country, where the company is based, the message | The CRM; the inbox for the reason; the list only if ticked | 24 months after the last contact | Legitimate interest: answering them |
| Careers | Name, email, role, CV, LinkedIn, work link, socials, message, consent | Private CV storage; the talent-pool sheet; careers@ (a link, never the file) | Decision 4 | Steps before a contract; consent for the talent pool |
| Reports | Email (now); name, work email, company, role (later) | The list; the CRM | Until they leave, or 24 months with no activity | Consent |
| The Lab waitlist | Name, work email, company, role; optional answer | The CRM; the list | Until they leave, or 12 months after the platform launches | Consent |
| Field notes, the Index, "not yet" | Email | The list; the CRM once confirmed | Until they leave | Consent, confirmed from their inbox |
| Visitor counts | No personal data, no cookies | Plausible | Plausible's own period | Not personal data |
| The form program's logs | A number, the door, the outcome, the time | Cloudflare | Cloudflare's short default | Legitimate interest: security |

People who leave the list are kept only on a do-not-contact list, so nobody deleted is ever mailed again by mistake.

**The law, in plain words** (our knowledge, for the lawyer to confirm):
- **Europe and the UK.** The GDPR applies when a US firm offers its services to people there, as Kelwin's pages do. It
  asks for: a notice where data is collected; a lawful reason for each use; answers to requests to see, correct or
  delete data within one month; a written data agreement with every service that holds data for us; a lawful route
  for data leaving Europe; and telling the regulator within 72 hours of a breach that risks people's rights. **One
  question for the lawyer:** whether Kelwin needs a representative in the EU or the UK [30].
- **California.** Its privacy law applies above about $25 million a year in revenue (adjusted for inflation), or
  100,000 California consumers, or half of revenue from selling data. Kelwin is likely below all three; we build so it
  could comply later [31].
- **New York.** The SHIELD Act asks any business holding New Yorkers' private information for "reasonable safeguards"
  and prompt notice of a breach, at any size. This plan is those safeguards [32].
- **Delaware.** Its privacy law starts at 35,000 consumers; likely not yet [33].
- **List mail.** CAN-SPAM: a postal address in every email (New York, New York works), unsubscribes honored within 10
  business days, honest subject lines [34]. Canada and Europe: consent before marketing email, which double opt-in
  with the date kept covers [35].
- **Job applications.** US employers with 15 or more employees must keep applications for one year [36]. Kelwin works
  with contractors today, but the lawyer should confirm the CV period before it is published.

**Cookies.** No cookie banner is needed while nothing optional is stored in visitors' browsers: Plausible sets none,
HubSpot's tracking code is never on the site, and we use the bot check's normal mode, because its "Pre-Clearance" mode
sets a cookie [6]. Cal.com loads only when a visitor asks to book; we check it in a clean browser before launch.

**Deletion on request, one checklist, within a month:** the CRM; the list (keeping the address only on the
do-not-contact list); the form program's copy; any CV; the talent-pool row; the mailboxes. Then we reply with what was
deleted, and the date.

**The Privacy page is rewritten before any form goes live,** and read by a lawyer. BACKEND.md section 5 lists what it
must say.

**What we'd tell a buyer:** "We keep what you send for a stated time, then delete it, and you can ask us to delete it
sooner."

### 2.10 If something goes wrong: the first hour

1. **Decide who leads.** You; or the GTM engineer if you can't be reached within an hour.
2. **Contain it.** Sign the account out everywhere, and change its password and key. Revoke every key it held: the
   deploy key, and the CRM, mail and list keys. If the forms are involved, flip the one switch that makes every form
   show "Write to audit@kelwin.co" while we look.
3. **Keep the evidence.** Export the logs before they age out, take screenshots, and write down the times.
4. **Work out what was reached:** which data, whose, from when.
5. **Tell the people who need to know:** affected clients first, by phone; the regulator in Europe or the UK within 72
   hours, if the GDPR applies; New York residents, as the SHIELD Act requires; the FBI's IC3 for fraud; CISA,
   voluntarily [37].
6. **Recover.** Rebuild the site from the project; it can always be rebuilt from it.
7. **Review within a week:** what let it happen, and what we change.

**Kept ready:** a one-page sheet of support contacts (the registrar, Cloudflare, Google, GitHub, HubSpot, the lawyer);
the access list with dates; a monthly export of the CRM and the list in Kelwin's Drive (CVs are never backed up: they
are deleted on purpose); a 30-minute practice once a year ("your mailbox was taken over: what do we do?"). **Cyber
insurance:** we ask for a quote when the first client signs, because a buyer's security questions may ask for it.

---

## Part 3 · The habits that keep it safe

### This week, free, about ten minutes (finding 8)

Today the live branch has no protection: anyone holding a key with write access, a stolen one included, could push a
change to `main`. Your rule "never push to main without the founder's go-ahead" is written down, but GitHub doesn't
enforce it, and on the free plan a private project can't. (While the project is private on the free plan, `main` also
has no GitHub Pages site to publish to, so a push changes nothing public until the move to Cloudflare.) In GitHub's
settings now:
1. a passkey or security key on your GitHub account;
2. update alerts and security updates on.

Once the project moves into the organization on GitHub Team (DECISIONS.md, decision 13), we add protection on `main`
(changes only through a pull request, no force-push, no deletion) and the deploy environment limited to `main`.
Secret scanning is a paid extra on a private project, so the leaked-key check in every build (gitleaks, 2.7) does
that job.

### The routine

| How often | What | Who |
|---|---|---|
| Every working day | Read the machine's alerts; nothing past its reply time | Whoever holds audit@ |
| Every week | DMARC reports; update alerts merged after a look; one marked test entry through every door | The GTM engineer |
| Every month | Page settings and mail checked (Observatory, internet.nl); the editor's new version tried on the preview; the access list read through | The GTM engineer |
| Every quarter | Who has access to what, account by account; unused keys deleted; recovery codes still where they should be | You, with the GTM engineer |
| Every year | The security file's date renewed; the incident practice; the Privacy page and the retention periods re-read; the domain's renewal confirmed | You, with us |

### The habits, for everyone who works with Kelwin

- Never approve a sign-in you didn't start yourself. Report it.
- Never type a password into a page you reached from an email link. Open the site yourself.
- A change of bank details is confirmed by phone, every time.
- Open CVs only in the browser's viewer or in Google Docs. Never download one, never "Enable content".
- Never forward a CV by email. Share its protected link.
- No shared logins; no keys or passwords pasted into chats or documents. They live in the password manager.
- A strange email goes to security@kelwin.co, not to the bin.
- New contractor: the smallest role that works. Leaving contractor: removed the same day.
- The site goes live only from the deploy script's clean build, never from a folder on someone's laptop.

---

## The verified findings

The review of today's code, checked a second time on 19 October 2026 by trying to make each finding happen on a real
build in a real browser. "Not real" means it could not be made to happen, or nobody would gain from it.

| # | What we found | Real? | How serious | When we fix it | Where it stands |
|---|---|---|---|---|---|
| 1 | The project's files on GitHub were public until 19 October 2026. The working branch, one click from the default page, holds your verbatim notes, the business model with its prices and research, your first name in about 20 files and your city in three. The default branch is clean. Nobody has copied the project yet | Yes, reproduced | **High** | Closed by you on 19 October 2026: the project is private | Closed. What was public before may have been copied; that can't be undone |
| 2 | Next.js 16.2.4 carries 30 published security notices, three of them critical. None can reach the live site, which is finished pages only; the one live path was a developer's laptop running the preview server on a shared network | Yes, on a laptop only | Low | Now, on the working branch | Part 1 |
| 3 | A crafted link could make the live Contact page fail to load | Yes, reproduced on the live branch | Low | Already fixed on the working branch | Live with the next deploy |
| 4 | A crafted link could pin any sentence, highlighted, on the Contact page, which could help a phishing email look real, and a very long one could break the layout. The first proposed fix was wrong: it would have dropped five real links from Reports. The corrected fix was tested | Yes, reproduced | Low | Now, with the corrected fix | Part 1. When Reports is rebuilt, its new links join the list |
| 5 | The deploy script grants more access than it needs, keeps its key on disk, and names its building blocks by labels that can be moved | Yes | Low | Now; it runs only once it reaches the live branch | Part 1 |
| 6 | GitHub Pages can't send the security settings. No attack works today: a framed page can only open the visitor's own mail program with text they can see | A real gap, no attack today | Low today; required at launch | At launch, with Cloudflare | Tested clean on every page (2.1) |
| 7 | Notices on build-only tools, about crashes on crafted input; the only input is our own files | Not a real risk | — | Rides along with finding 2 | Part 1 |
| 8 | The live branch has no protection, so any push deploys at once; update alerts and secret scanning couldn't be checked | Yes, partly checked | Low | With the move to the organization (DECISIONS.md, decision 13); the update-alerts file with the next change to the live branch | Waiting for decision 13 |
| 9 | Job applications go to audit@, not careers@ | Not a security risk | — | When the careers form is built, once careers@ is confirmed | BACKEND.md door 4 |
| 10 | Old preview pages and the retired photographs sit in a local build folder; they were never deployed | Not real | — | One rule: deploy only from the clean build | Part 3 |

---

## Appendix A · Ready-to-use settings, for the builders

### A.1 `public/_headers` (Cloudflare)

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com <plausible-host>; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' <plausible-host>; media-src 'self'; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests; report-to csp; report-uri https://kelwin.co/api/csp-report
  Reporting-Endpoints: csp="https://kelwin.co/api/csp-report"
  Strict-Transport-Security: max-age=300; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin

/email/*
  ! Cross-Origin-Resource-Policy

/admin/*
  ! Content-Security-Policy
  ! Cross-Origin-Opener-Policy
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://avatars.githubusercontent.com; connect-src 'self' https://api.github.com <sign-in-helper-host>; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'
  Cross-Origin-Opener-Policy: same-origin-allow-popups
  X-Robots-Tag: noindex

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

- For the first two weeks after launch, the first line is sent as `Content-Security-Policy-Report-Only`; the page's
  own script rule (A.2) and `X-Frame-Options` are enforced from day one.
- `'unsafe-inline'` for scripts in the header is narrowed by each page's own rule; browsers apply both, and a script
  must pass both [3].
- A headers file holds up to 100 rules of 2,000 characters a line, and it does not apply to the form program's own
  replies, which set their own headers [1].
- Rules stack: a request that matches two patterns gets both sets of headers, so `/admin/` first removes the site-wide
  ones with `!` [1].
- `/admin/` allows pop-ups to reach back, because the sign-in hands its result back through the opening window [13];
  to test on the preview.
- `/email/` holds the images the acknowledgement emails load, so webmail can show them.
- HTML pages keep Cloudflare's default "revalidate every time"; the fingerprinted files under `/_next/static/` are
  cached for a year.
- Plausible's current snippet has a second part written inside the page [38]; the build step would rightly stop on
  it, so that part moves into a small file of our own.
- The `Strict-Transport-Security` line steps up as in 2.1. Both `report-to` and `report-uri` are set, because
  `report-to` "does not yet have full cross-browser support" [2].

### A.2 Each page's own script rule (written by the build step)

```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'sha256-…' 'sha256-…'; object-src 'none'; base-uri 'none'"/>
```

- Placed at the top of the head, before any script; the step stops if a script comes first.
- It approves only the framework's data scripts, each recognized as one push of a quoted string and nothing else, and
  our two scripts (the motion start-up and the ledger's height reserve) by fingerprints kept in a reviewed list in the
  project. Change either script, and the build stops until the list is updated in the same change.
- It runs after `next build`, in the deploy script, on every build: preview and live.

### A.3 kelwin.co's records (with BACKEND.md, Appendix D)

```
kelwin.co.               TXT   "v=spf1 include:_spf.google.com -all"
_dmarc.kelwin.co.        TXT   "v=DMARC1; p=none; sp=none; rua=mailto:<cloudflare-dmarc-address>,mailto:dmarc@kelwin.co"
                               (then p=quarantine; then p=reject; sp=reject)
_mta-sts.kelwin.co.      TXT   "v=STSv1; id=<date>"
_smtp._tls.kelwin.co.    TXT   "v=TLSRPTv1; rua=mailto:dmarc@kelwin.co"
kelwin.co.               CAA   0 issue "<each authority Cloudflare uses>"
<non-sending-sub>.       TXT   "v=spf1 -all"
<non-sending-sub>.       MX    0 .
```

Plus DNSSEC on, with its DS record at the registrar [19]; the MTA-STS policy file at
`https://mta-sts.kelwin.co/.well-known/mta-sts.txt`, starting in testing mode.

### A.4 `public/.well-known/security.txt`

```
Contact: mailto:security@kelwin.co
Expires: <one year after launch, ISO 8601>
Preferred-Languages: en
Canonical: https://kelwin.co/.well-known/security.txt
Policy: https://kelwin.co/engagements/#security
```

### A.5 `.npmrc`

```
ignore-scripts=true
```

### A.6 Update alerts (`.github/dependabot.yml`), in outline

- `npm`, weekly; Next.js and its companion package grouped; `cooldown` of 7 days for ordinary updates.
- `github-actions`, weekly; it updates the pinned build-step versions.
- No `target-branch`: the file is read only from the default branch, and pull requests against `main` can't deploy
  without a merge (finding 8).

### A.7 The live branch's rules

- A pull request for every change, with one approval.
- The build, the rule checks, the package check and the leaked-key check must pass.
- No force-push, no deletion; the rules apply to admins too.
- Your account on the bypass list for pull requests only, so your own Publish merges after the checks (BLOG.md,
  Appendix B), and nobody pushes to `main` directly.

### A.8 The deploy script's access (finding 5, corrected)

- Top level: `contents: read`.
- The build job: `contents: read` and `pages: read`; checkout with `persist-credentials: false`; the configure step
  kept, pinned, without `enablement`.
- The deploy job alone: `pages: write` and `id-token: write`.
- Every build step pinned to a full commit, with the version as a comment.
- At the move to Cloudflare this file is replaced: the deploy step uses a Cloudflare key limited to this one site, in
  an environment limited to `main`.

---

## Appendix B · What we tested on the site's own build

All on the Next.js 16.3.8 build that the review showed identical to today's site, in Chromium, with motion on,
scrolling every page and following the home link from each. The files are in this stream's working folder.

| Test | Result |
|---|---|
| The header alone, scripts inside pages allowed | 19 pages, 0 blocked, 0 errors |
| **The header plus each page's own script rule (the recommendation)** | 19 pages, 0 blocked, 0 errors; motion ran on every page; the home link worked from every page |
| The same, with one unapproved script planted in the Contact page | The browser blocked it and reported it |
| The build step, with that planted script | It stopped the build: "inline script not on the reviewed list" |
| Another site framing the Contact page | Refused by the browser |
| Styles held to the same strictness | 851 blocks across 19 pages, every one an inline style, so styles keep the looser rule |
| Next.js's experimental integrity feature, with the strict rule its guide pairs it with | Every page broke: 114 scripts refused. It fingerprints some script files and none of the scripts inside pages |
| Install scripts off | 363 packages installed; the site built; all 20 HTML files identical to the normal build (file names aside), and the same 2,722 style rules |

**Limits:** Chromium only. Turnstile and Plausible couldn't be loaded from here. Plain `http` on this machine, so the
HTTPS upgrade was left out of the test only.

---

## Sources

How each was read: **read at source** means the publisher's own documentation files, read on GitHub on 18–19 October
2026; **our knowledge** means last known around mid-2026, not re-checked, with the page to check.

1. Cloudflare, Workers static assets, headers (limits, stacking, removing a header, not applied to the Worker's own
   replies): https://developers.cloudflare.com/workers/static-assets/headers/ (read at source).
2. Mozilla (MDN), practical security guides, the CSP guide, `report-to` support, and the HTTP Observatory:
   https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides ;
   https://developer.mozilla.org/en-US/observatory (read at source, from github.com/mdn/content).
3. OWASP, Content Security Policy Cheat Sheet:
   https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html ; HTTP Headers Cheat Sheet:
   https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html (read at source, from
   github.com/OWASP/CheatSheetSeries).
4. Next.js 16, "How to set a Content Security Policy" (nonces need dynamic rendering; static pages can't have one):
   https://nextjs.org/docs/app/guides/content-security-policy (read at source, in the site's own copy).
5. The HSTS preload list: requirements, ramp-up advice, removal: https://hstspreload.org/ (read at source, from
   github.com/chromium/hstspreload.org).
6. Cloudflare Turnstile, server-side validation, and its Content Security Policy page (Pre-Clearance sets a cookie):
   https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ ;
   https://developers.cloudflare.com/turnstile/reference/content-security-policy/ (read at source).
7. Cloudflare Workers rate limiting: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ (read
   at source).
8. Cloudflare WAF managed rules (the Free Managed Ruleset): https://developers.cloudflare.com/waf/managed-rules/ (read
    at source).
9. OWASP, CSV Injection: https://owasp.org/www-community/attacks/CSV_Injection (read at source).
10. OWASP, File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html (read
    at source).
11. Cloudflare WAF, malicious uploads detection (Enterprise, paid add-on):
    https://developers.cloudflare.com/waf/detections/malicious-uploads/ (read at source).
12. Cloudflare R2 object lifecycles: https://developers.cloudflare.com/r2/buckets/object-lifecycles/ (read at source).
13. Sveltia CMS sign-in helper, README and code (default `repo,user` scopes; `ALLOWED_DOMAINS`; the anti-forgery
    check; the result returned to the opening window): https://github.com/sveltia/sveltia-cms-auth (read at source).
14. GitHub, scopes for OAuth apps (`repo`): https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
    (read at source).
15. GitHub, fine-grained personal access tokens (limited to specific repositories, with an expiry):
    https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
    (read at source).
16. CISA, SCuBA baseline for Google Workspace, common controls (phishing-resistant sign-in; no SMS; super admins):
    https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/commoncontrols.md (read at source).
17. GitHub, plan availability for protected branches, environments and secret scanning:
    https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches ;
    https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning (read at source).
18. OWASP, Multifactor Authentication Cheat Sheet:
    https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html (read at source).
19. Cloudflare, DNSSEC (and removing the DS record before changing nameservers):
    https://developers.cloudflare.com/dns/dnssec/ (read at source).
20. Cloudflare, Certificate Transparency Monitoring ("Alerts are turned off by default"):
    https://developers.cloudflare.com/ssl/edge-certificates/additional-options/certificate-transparency-monitoring/
    (read at source).
21. CISA, SCuBA baseline for Google Workspace mail (SPF failing non-approved senders; DKIM; DMARC at reject):
    https://github.com/cisagov/ScubaGoggles/blob/main/scubagoggles/baselines/gmail.md (read at source).
22. Cloudflare DMARC Management: https://developers.cloudflare.com/dmarc-management/ (read at source).
23. npm, `npm ci`: https://docs.npmjs.com/cli/commands/npm-ci (read at source).
24. OWASP, NPM Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html (read
    at source).
25. GitHub, Dependabot options (`cooldown`, default three days):
    https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference (read at
    source).
26. GitHub, secure use of Actions (pinning to a full commit; least-privilege tokens):
    https://docs.github.com/en/actions/reference/security/secure-use (read at source).
27. gitleaks: https://github.com/gitleaks/gitleaks (read at source).
28. Cloudflare Workers secrets: https://developers.cloudflare.com/workers/configuration/secrets/ (read at source).
29. The March 2025 compromise of a GitHub build step: https://github.com/advisories/GHSA-mrrh-fwg8-r2c3 (refused by
    the network policy from here; our knowledge). GitHub on the September 2025 npm attacks:
    https://github.blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain/ (our knowledge).
30. The GDPR, Regulation (EU) 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj ; the EU–US Data Privacy
    Framework: https://www.dataprivacyframework.gov/ (our knowledge).
31. California CCPA and CPRA: https://cppa.ca.gov/ ; https://oag.ca.gov/privacy/ccpa (our knowledge).
32. New York SHIELD Act: https://ag.ny.gov/resources/organizations/data-breach-reporting/shield-act (our knowledge).
33. Delaware Personal Data Privacy Act: https://attorneygeneral.delaware.gov/fraud/cpu/consumerprivacy/ (our
    knowledge).
34. FTC, CAN-SPAM compliance guide: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
    (our knowledge).
35. Canada's anti-spam law (CASL): https://crtc.gc.ca/eng/internet/anti.htm (our knowledge).
36. EEOC, recordkeeping (applications kept one year): https://www.eeoc.gov/employers/recordkeeping-requirements (our
    knowledge).
37. NIST SP 800-61 Rev. 3, incident response: https://csrc.nist.gov/pubs/sp/800/61/r3/final ; CISA reporting:
    https://www.cisa.gov/report ; FBI IC3: https://www.ic3.gov/ (our knowledge).
38. Plausible, proxying through Cloudflare (its two-part snippet): https://plausible.io/docs/proxy/guides/cloudflare
    (read at source, from github.com/plausible/docs).

**Also from our knowledge, to check:** security.txt (RFC 9116): https://www.rfc-editor.org/rfc/rfc9116 · MTA-STS
(RFC 8461), TLS reports (RFC 8460), null MX (RFC 7505), CAA (RFC 8659): https://www.rfc-editor.org/ · internet.nl:
https://internet.nl/ · Turnstile's privacy addendum: https://www.cloudflare.com/turnstile-privacy-policy/ · Prices:
https://github.com/pricing · https://bitwarden.com/pricing/business/ · https://1password.com/pricing ·
https://www.yubico.com/store/ · uptime services: https://betterstack.com/pricing · https://uptimerobot.com/pricing/

**Kelwin's own material, read directly:** the site's code on the working branch and the live branch, its deploy
script and settings; the GitHub project's settings as far as they could be read; this round's SITEMAP.md,
SEARCH-BUILD.md, BACKEND.md and BLOG.md; the round-10 NEXT-STEPS.md.

---

## Decisions for the founder

**Reconciled:** the project is already private, so decision 1 is now DECISIONS.md, decision 13 (the organization and
the preview); decisions 2 and 3 are part of DECISIONS.md, decision 12; decision 4 (CVs) is settled as proposed, with
the period confirmed by the lawyer.

**1. Move the project, now private, into a GitHub organization in Kelwin's name, on GitHub Team?**
- **Proposed:** yes, this week. About $4 a person a month (to check): you now, the GTM engineer when work starts. This
  is what remains of SITEMAP decision 2, and it is DECISIONS.md, decision 13.
- **Why:** the project went private on 19 October, which closed finding 1. On GitHub's free plan a private project
  loses the protected live branch [17]; GitHub Team keeps it. Team could also serve a preview from the private project
  until the private preview on Cloudflare is ready, but that preview site is itself public, only hidden from search
  (our knowledge, to confirm when we move it), so we propose waiting for Cloudflare's. What was already public may
  have been copied; we can't undo that.

**2. Security keys and one password manager?**
- **Proposed:** yes. Two security keys for you now (about $50–110 for the pair), two for each person with admin rights
  later; Bitwarden Teams for the firm (about $4 a person a month; 1Password Business is the runner-up at about $8).
- **Why:** a stolen login is the most likely attack on a firm Kelwin's size, and a physical key is the one defense a
  phishing page can't get past. CISA asks for exactly this [16].

**3. A second, spare admin for Google Workspace?**
- **Proposed:** yes: one more seat (about $7–8.40 a month), used only if your own account is locked or taken over, with
  its own key kept offline.
- **Why:** with one admin, losing that one account means losing the mailboxes, and with them every other account's
  recovery. CISA: "Having too few super admin accounts can increase the risk of losing admin access entirely" [16].

**4. CVs: which files, and how long we keep them?**
- **Proposed:** PDF and Word (.docx), opened only in a browser viewer or Google Docs. Kept 90 days after the role
  closes, or 12 months if the applicant ticks the talent-pool box, once the lawyer confirms the period against the
  one-year US rule [36].
- **Why:** both formats are what applicants send; refusing Word would turn good applicants away, and opening it in
  Google Docs takes away its main risk. Short, stated periods keep the least data for the least time, which is what
  the law in Europe asks and what we'd promise any applicant.

---

## Reconciled in round 11

Changes made when this round's five pieces of work were put together (19 October 2026). The decisions
now sit in DECISIONS.md.
- Finding 1 is closed: the founder made the project private on 19 October. The handling note, the ten things (item 2),
  Part 3, the findings table and decision 1 follow. What is left is the GitHub organization on GitHub Team, which
  brings back the protected live branch (DECISIONS.md, decision 13).
- Part 3 now lists only the settings the free plan allows on a private project; secret scanning is a paid extra on a
  private project, so the gitleaks check in the build does that job (2.7 already said so).
- Decisions 2 and 3 are part of DECISIONS.md, decision 12; decision 4 (CVs) is settled as proposed.
- Part 1's "commit: [ ]" fields are left for the lead.
