// Generates site/frag/handover/U.html: run `node work/handover-U/gen.mjs`
// Round 5 · handover · slot U ("The spread, revived", approved in round 4; round 5 = decluttered + detail cards).
// One drawn figure on the section's own graphite (no panel plate, no side column): the drafts' footprint and a
// quiet key at its left end, a vertical Handover datum, six FOLIO sheets in a row (three capability pairs), and
// directly under each sheet its name, tag, the letter's margin line struck, and what replaces it.
// Round 5: no title block, no handover-test line, no row captions, plain capability names. Each sheet is a
// disclosure button; hover, focus or tap opens a small detail card beside it (index · tag, name, one line).
// Each sheet is drawn twice in its own slot: a DRAFT copy (dashed edge, rough page) and an OWNED copy (solid
// edge, finished page). U.js splits the two exactly at the datum while a sheet crosses it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(R, "site", "frag", "handover", "U.html");
const P = "km-handover-U";

/* sheet size (1:1.41). Furniture is authored on a 96×136 page and snapped to whole pixels at the real size,
   so every 1px rule lands on a half pixel and stays crisp. */
const W = +(process.env.SW || 96), H = Math.round(W * 1.4167);
/* the key zone (KZ) and the datum track (DZ) are fixed widths; U.css carries the same numbers (--kz, --dz).
   The datum sits at DX = KZ + DZ/2 inside the figure's grid. The footprint is the stack's base sheet (01's
   place, x 0); the stack steps STACK px right per sheet above it. */
const KZ = 146, DZ = 36, DX = KZ + DZ / 2;
const sx = (x) => Math.round((x * W) / 96);
const sy = (y) => Math.round((y * H) / 136);
const h = (x1, x2, y) => `M${sx(x1)} ${sy(y) + 0.5}H${sx(x2)}`;
const rect = (x, y, w, hh) => `M${sx(x) + 0.5} ${sy(y) + 0.5}h${sx(x + w) - sx(x)}v${sy(y + hh) - sy(y)}h-${sx(x + w) - sx(x)}z`;
const box = (x, y, s) => `<rect class="P__dot" x="${sx(x)}" y="${sy(y)}" width="${s}" height="${s}"/>`;
const path_ = (cls, parts) => (parts.length ? `<path class="P__${cls}" d="${parts.join("")}"/>` : "");

/* page furniture only (rules, bullets, table cells, panels): each sheet is a different KIND of document.
   own = the finished page (yours) · draft = the rough page (Kelwin's working draft). */
const SHEETS = {
  // 01 Narrative OS · a two-level message hierarchy
  "01": {
    own: path_("hr", [h(9, 58, 52), h(9, 50, 88)]) +
      path_("ru", [h(17, 86, 61), h(17, 77, 69), h(17, 82, 77), h(17, 84, 97), h(17, 71, 105), h(17, 79, 113)]),
    draft: path_("ru", [h(9, 46, 52), h(9, 72, 63), h(9, 38, 75), h(9, 60, 92)]),
  },
  // 02 Channel Playbooks · six bulleted plays
  "02": {
    own: path_("ru", [h(18, 80, 53), h(18, 70, 64), h(18, 86, 75), h(18, 64, 86), h(18, 77, 97), h(18, 73, 108)]) +
      [53, 64, 75, 86, 97, 108].map((y) => box(9, y - 1.5, 3)).join(""),
    draft: path_("ru", [h(18, 66, 53), h(18, 52, 64)]) + [53, 64].map((y) => box(9, y - 1.5, 3)).join(""),
  },
  // 03 ICP & Signal Map · a three-column table with two live rows
  "03": {
    own: path_("hr", [h(9, 30, 52), h(38, 60, 52), h(70, 87, 52)]) + path_("ru", [h(9, 87, 58)]) +
      path_("ru", [66, 75, 84, 93, 102, 111].flatMap((y, i) => [h(9, [26, 22, 28, 20, 25, 23][i], y), h(38, [58, 52, 61, 49, 56, 54][i], y), h(70, [84, 80, 86, 79, 83, 81][i], y)])) +
      `<rect class="P__hot" x="${sx(64)}" y="${sy(75) - 2}" width="4" height="4"/><rect class="P__hot" x="${sx(64)}" y="${sy(102) - 2}" width="4" height="4"/>`,
    draft: path_("ru", [52, 59, 66, 73, 80, 87, 94].map((y, i) => h(9, [44, 36, 50, 30, 41, 47, 33][i], y))),
  },
  // 04 Orchestration Rules · if → then: a condition, a chevron, an action
  "04": {
    own: path_("ru", [54, 67, 80, 93, 106].flatMap((y, i) => [h(9, [33, 29, 35, 27, 31][i], y), h(51, [86, 80, 84, 77, 82][i], y)])) +
      path_("hr", [54, 67, 80, 93, 106].map((y) => `M${sx(40)} ${sy(y) - 3}L${sx(40) + 3.5} ${sy(y) + 0.5}L${sx(40)} ${sy(y) + 4}`)),
    draft: path_("ru", [54, 67, 80, 93, 106].map((y, i) => h(9, [33, 29, 35, 27, 31][i], y))),
  },
  // 05 Signal Dashboard · four readout panels with values, one lit
  "05": {
    own: path_("ru", [rect(9, 51, 35, 28), rect(52, 51, 35, 28), rect(9, 87, 35, 28), rect(52, 87, 35, 28)]) +
      path_("ru", [h(14, 30, 58), h(57, 74, 58), h(14, 28, 94), h(57, 72, 94)]) +
      `<rect class="P__val" x="${sx(14)}" y="${sy(68)}" width="${sx(39) - sx(14)}" height="4"/>` +
      `<rect class="P__val P__val--on" x="${sx(57)}" y="${sy(68)}" width="${sx(73) - sx(57)}" height="4"/>` +
      `<rect class="P__val" x="${sx(14)}" y="${sy(104)}" width="${sx(33) - sx(14)}" height="4"/>` +
      `<rect class="P__val" x="${sx(57)}" y="${sy(104)}" width="${sx(66) - sx(57)}" height="4"/>`,
    draft: path_("pn", [rect(9, 51, 35, 28), rect(52, 51, 35, 28), rect(9, 87, 35, 28), rect(52, 87, 35, 28)]) +
      path_("ru", [h(14, 30, 58), h(57, 74, 58)]),
  },
  // 06 Rebuild Sequence · four quarter columns; each quarter carries the last one's rows and adds its own
  "06": {
    own: path_("hr", [h(9, 24, 52), h(30, 45, 52), h(51, 66, 52), h(72, 87, 52)]) +
      path_("ru", [[9, 22], [30, 43], [51, 64], [72, 85]].flatMap(([a, b], q) => [61, 69, 77, 85, 93, 101].slice(0, q + 3).map((y) => h(a, b - ((y + q * 3) % 5), y)))) +
      path_("lead", [h(9, 22, 61)]),
    draft: path_("hr", [h(9, 24, 52)]) + path_("ru", [61, 68, 75, 82, 89, 96, 103, 110].map((y, i) => h(9, [22, 18, 24, 16, 21, 19, 23, 17][i], y))),
  },
};

const ASSETS = [
  { n: "01", cap: 0, name: "Narrative OS", tag: "Document", was: "The founder writes every message", now: "A reusable narrative system",
    d: "Positioning, language and the message hierarchy every channel inherits." },
  { n: "02", cap: 0, name: "Channel Playbooks", tag: "Playbook set", was: "Dependent on the agency", now: "The system and docs stay in-house",
    d: "The plays for email, LinkedIn, phone, content, paid and events." },
  { n: "03", cap: 1, name: "ICP &amp; Signal Map", tag: "Living dataset", was: "Random outbound activity", now: "Clear ICP and account logic",
    d: "Who to reach, and the live signals that say when." },
  { n: "04", cap: 1, name: "Orchestration Rules", tag: "Routing logic", was: "SDRs chase raw volume", now: "The team follows buyer signal",
    d: "The logic that routes every <span class=\"P__nb\">next-best</span> touch." },
  { n: "05", cap: 2, name: "Signal Dashboard", tag: "Instrumentation", was: "No idea why replies stay low", now: "Objections and patterns, named",
    d: "The readouts your GTM decisions run on." },
  { n: "06", cap: 2, name: "Rebuild Sequence", tag: "Quarterly plan", was: "Campaigns reset every month", now: "Each quarter deposits into the next",
    d: "The prioritised plan, <span class=\"P__nb\">re-scored</span> every quarter." },
];
const CAPS = ["Narrative systems", "GTM infrastructure", "GTM intelligence"];

// one sheet copy: paper, edge, index, header rule, two title rules, then its page furniture
const sheet = (a, kind) => {
  const S = SHEETS[a.n];
  const title = kind === "own" ? path_("hr", [h(9, 70, 31)]) + path_("ru", [h(9, 56, 38)]) : path_("ru", [h(9, 50, 31)]);
  return `<svg class="P__${kind}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false">` +
    `<rect class="P__pp" width="${W}" height="${H}"/><rect class="P__ed" x=".5" y=".5" width="${W - 1}" height="${H - 1}"/>` +
    `<text class="P__ix" x="${sx(9)}" y="${sy(20)}">${a.n}</text>` + path_("hr", [h(32, 87, 15)]) + title + S[kind] + `</svg>`;
};

// slot columns: key zone (1) · datum track (2) · then pairs at 3,5 | 7,9 | 11,13
const COL = [3, 5, 7, 9, 11, 13];

/* the item: the sheet is a disclosure button (its name for screen readers, its card's line as the description);
   the card is the item's last child, outside the subgrid flow. Cards of 01–03 open to the sheet's right,
   04–06 to its left (toward the figure's centre), so a card never covers its own sheet. */
const item = (a, i) => `
        <div class="P__item${i > 2 ? " P__item--l" : ""}" data-n="${a.n}" style="--col:${COL[i]};--i:${i}">
          <button class="P__slot" type="button" aria-expanded="false" aria-controls="P-pop-${a.n}" aria-describedby="P-pop-${a.n}-d">
            <span class="ac-sr">About ${a.name}</span>
            <svg class="P__ph" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false"><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}"/></svg>
            <span class="P__lift"><span class="P__sheet">${sheet(a, "draft")}${sheet(a, "own")}</span></span>
          </button>
          <h4 class="P__nm">${a.name}</h4>
          <p class="ac-cap P__tag">${a.tag}</p>
          <p class="P__was"><span class="ac-sr">Without the system: </span><span class="P__was-t">${a.was}</span><svg class="P__strike" aria-hidden="true" focusable="false"></svg></p>
          <p class="P__now"><span class="ac-sr">With the system: </span>${a.now}</p>
          <div class="P__pop" id="P-pop-${a.n}">
            <p class="P__pk" aria-hidden="true"><span class="P__pi">${a.n}</span><span class="P__pr"></span><span class="P__pt">${a.tag}</span></p>
            <p class="P__pname" aria-hidden="true">${a.name}</p>
            <p class="P__pd" id="P-pop-${a.n}-d">${a.d}</p>
          </div>
        </div>`;

const groups = CAPS.map((t, ci) => `
        <h3 class="ac-cap P__cap" style="--c:${3 + ci * 4};--i:${ci}">${t}</h3>` +
  ASSETS.slice(ci * 2, ci * 2 + 2).map((a, j) => item(a, ci * 2 + j)).join("")).join("\n");

const MID = Math.round(H / 2);
const html = `<section class="km P ac-sec" data-surface="dark" aria-labelledby="P-h">

  <!-- head: the kit grammar on the hero's diagonal. The statement holds cols 1–7 with the red rule under it;
       the lede sits in cols 8–12, bottom-aligned so its last baseline lands on the statement's. -->
  <div class="ac-head ac-wrap P__head">
    <div class="ac-labelrow"><p class="ac-label">What you own</p></div>
    <h2 class="ac-statement" id="P-h">
      <span class="ac-line"><span>If we leave,</span></span>
      <span class="ac-line ac-accent"><span>the system stays.</span></span>
    </h2>
    <span class="ac-rule" aria-hidden="true"></span>
    <p class="ac-lede">Same team, same market. What changes is the system underneath — six assets installed in your stack, in your language, documented so they survive team changes.</p>
  </div>

  <!-- the spread, drawn straight on the section (no plate). The key column is only the figure's left end: the
       drafts' footprint with its arrow to the datum and a quiet key under it. The Handover datum runs the
       figure's full height; the six sheets sit in a row on your side, each over its own name, tag, the letter's
       line it ends (struck) and what replaces it. Each sheet opens a small detail card.
       Default markup = the final state: all six handed over, every line struck. -->
  <figure class="ac-wrap P__fig">
    <div class="P__grid">
      <div class="P__datum" aria-hidden="true"><span class="P__dline"></span><span class="ac-reg ac-reg--tl"></span><span class="ac-reg ac-reg--bl"></span></div>

      <p class="ac-cap P__dl" aria-hidden="true">Handover</p>
      <div class="P__deck" aria-hidden="true">
        <svg class="P__decksvg" width="${KZ + DZ}" height="${H}" viewBox="0 0 ${KZ + DZ} ${H}" focusable="false">
          <rect class="P__fp" x=".5" y=".5" width="${W - 1}" height="${H - 1}"/>
          <path class="P__way-l" d="M${W + 10} ${MID + 0.5}H${DX - 3}"/>
          <path class="P__way-c" d="M${DX - 5} ${MID - 3.5}L${DX - 1} ${MID + 0.5}L${DX - 5} ${MID + 4.5}"/>
        </svg>
        <span class="P__tick"></span>
      </div>
      <ul class="P__legend" aria-label="Key">
        <li><svg class="P__sw" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path class="P__sw-d" d="M0 6.5H12"/></svg><span>Installed by Kelwin</span></li>
        <li><svg class="P__sw" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path class="P__sw-s" d="M0 6.5H12"/></svg><span>Owned by you</span></li>
      </ul>
${groups}
    </div>
  </figure>
</section>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html.replace(/P__/g, `${P}__`).replace(/"P-h"/g, `"${P}-h"`).replace(/"P-pop-/g, `"${P}-pop-`).replace(/class="km P /, `class="km ${P} `));
console.log("wrote", OUT, `sheet ${W}×${H}`);
