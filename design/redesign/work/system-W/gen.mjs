// system · W — generator for the strata drawing (writes site/frag/system/W.html).
//   node work/system-W/gen.mjs
// Geometry is computed in plan (face) coordinates and projected to true 30° isometric,
// so every inscription stays inside its face. The markup it writes is the FINAL state
// (three slabs installed, red return drawn, ledger row 03 open); the script puts it
// into step 0 and plays it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT = path.join(R, "site", "frag", "system", "W.html");

const C = Math.cos(Math.PI / 6), S = 0.5;
const n1 = (v) => Math.round(v * 10) / 10;
const pt = (p) => `${n1(p[0])} ${n1(p[1])}`;

/* ── the stage: drawing field 755 × 640 (cols 1–7) ── */
const FW = 755, FH = 640;
const PL = 212, PD = 132;           // slab plan: 200 along the right-running axis, 124 along the left-running one
const TH = 12;                       // slab thickness
const PITCH = 144, EXPL = 40;        // installed pitch; exploded adds ±40 to the outer slabs (pitch 184)
const TX = 330;                      // the top (back) vertex x of every slab
const TY = [null, 82.5, 226.5, 370.5];

const toS = (T, u, v) => [T[0] + C * (u - v), T[1] + S * (u + v)];   // plan (u, v) → screen
const corner = (T) => ({
  t: T, r: toS(T, PL, 0), b: toS(T, PL, PD), l: toS(T, 0, PD),
});

const LX = n1(TX - C * PD);          // left corners x (≈ 216.6)
const RX = n1(TX + C * PL);          // right corners x (≈ 497.2)
const XD = 152.5;                    // the dimension bracket — and, once the loop closes, the return's riser
const XR = XD;
const CALL_X = Math.round(RX + 6), CALL_LEN = 56;

function slab(k) {
  const T = [TX, TY[k]], c = corner(T);
  const top = `M${pt(c.t)}L${pt(c.r)}L${pt(c.b)}L${pt(c.l)}Z`;
  const sideL = `M${pt(c.l)}L${pt(c.b)}L${pt([c.b[0], c.b[1] + TH])}L${pt([c.l[0], c.l[1] + TH])}Z`;
  const sideR = `M${pt(c.b)}L${pt(c.r)}L${pt([c.r[0], c.r[1] + TH])}L${pt([c.b[0], c.b[1] + TH])}Z`;
  let ins = "";
  const P = (u, v) => toS(T, u, v);
  const line = (a, b, cls, d, t) =>
    `<path class="km-system-W__ink${cls ? " " + cls : ""}" pathLength="1" style="--d:${d}ms;--t:${t}ms" d="M${pt(P(...a))}L${pt(P(...b))}"/>`;
  const poly = (pts, cls, d, t) =>
    `<path class="km-system-W__ink${cls ? " " + cls : ""}" pathLength="1" style="--d:${d}ms;--t:${t}ms" d="M${pts.map((q) => pt(P(...q))).join("L")}"/>`;
  const node = (q, cls, d) => {
    const s = P(...q);
    return `<rect class="km-system-W__node${cls ? " " + cls : ""}" style="--d:${d}ms" x="${n1(s[0] - 3)}" y="${n1(s[1] - 3)}" width="6" height="6"/>`;
  };
  if (k === 1) {
    // NARRATIVE — text rules, read along the long axis; the first is the heading
    const RULES = [[28, 32, 120], [45, 32, 180], [62, 32, 158], [79, 32, 186], [96, 32, 106]];
    ins = RULES.map((r, i) => line([r[1], r[0]], [r[2], r[0]], i === 0 ? "km-system-W__ink--h" : "", 320 + i * 70, 420)).join("");
    ins = `<g class="km-system-W__ins">${ins}</g>`;
  } else if (k === 2) {
    // INFRASTRUCTURE — one signal routed three ways (plan-orthogonal trace)
    ins = [
      poly([[30, 66], [76, 66]], "", 320, 260),
      poly([[76, 66], [76, 30], [182, 30]], "", 560, 520),
      poly([[76, 66], [182, 66]], "", 600, 480),
      poly([[76, 66], [76, 102], [144, 102]], "", 640, 440),
      node([30, 66], "", 320),
      node([76, 66], "is-hub", 560),
      node([182, 30], "", 1060),
      node([182, 66], "", 1060),
      node([144, 102], "", 1060),
    ].join("");
    ins = `<g class="km-system-W__ins">${ins}</g>`;
  } else {
    // INTELLIGENCE — an open ring with a point riding it; the gap closes when the loop does
    const ctr = P(106, 66), r = 42, rx = n1(r * Math.SQRT2 * C), ry = n1(r * Math.SQRT2 * S);
    const at = (deg) => [ctr[0] + rx * Math.cos((deg * Math.PI) / 180), ctr[1] + ry * Math.sin((deg * Math.PI) / 180)];
    const A0 = 40, A1 = 340;                       // the open arc: 40° → 340° (clockwise on screen)
    const a0 = at(A0), a1 = at(A1), mid = at(190);
    const arc = `M${pt(a0)}A${rx} ${ry} 0 0 1 ${pt(mid)}A${rx} ${ry} 0 0 1 ${pt(a1)}`;
    const gap = `M${pt(a1)}A${rx} ${ry} 0 0 1 ${pt(a0)}`;
    const nd = a1;
    ins = `<path class="km-system-W__ink" pathLength="1" style="--d:340ms;--t:1000ms" d="${arc}"/>` +
      `<path class="km-system-W__ink km-system-W__gap" pathLength="1" d="${gap}"/>` +
      `<rect class="km-system-W__node is-hub km-system-W__rider" style="--d:1240ms" x="${n1(nd[0] - 3)}" y="${n1(nd[1] - 3)}" width="6" height="6"/>`;
    ins = `<g class="km-system-W__ins">${ins}</g>`;
  }
  return `<g class="km-system-W__s is-in" data-l="${k}"><g class="km-system-W__lift"><g class="km-system-W__drop">` +
    `<path class="km-system-W__side" d="${sideL}"/><path class="km-system-W__side" d="${sideR}"/>` +
    `<path class="km-system-W__top" d="${top}"/>${ins}</g></g></g>`;
}

const yL = (k) => n1(TY[k] + S * PD);          // left corner y
const yR = (k) => n1(TY[k] + S * PL);          // right corner y

// extension lines for the dimension (they ride with slabs 1 and 3; the red return later covers them)
const ext = (k) => `<path class="km-system-W__ext" data-l="${k}" d="M${n1(LX - 6)} ${yL(k)}H${n1(XD - 5)}"/>`;

// the return: out of slab 03's left corner, up the riser, into slab 01's left corner
const RET = `M${LX} ${yL(3)}H${XR}V${yL(1)}H${LX}`;
const yMid = n1(yL(1) + 0.3 * (yL(3) - yL(1)));    // the one chevron: upper third of the riser
const CHEV = `M${n1(XR - 6)} ${n1(yMid + 3.5)}L${XR} ${n1(yMid - 2.5)}L${n1(XR + 6)} ${n1(yMid + 3.5)}`;

const svg = `<svg class="ac-svg km-system-W__svg" width="${FW}" height="${FH}" viewBox="0 0 ${FW} ${FH}" role="img" aria-label="Specimen drawing. Three flat slabs stacked in isometric, one per layer, each with its job drawn on its top face: 01 Narrative Systems carries lines of text, 02 GTM Infrastructure one signal routed three ways, 03 GTM Intelligence a ring with a point riding it. On the left, the bracket that measures the stack is drawn in red as the return path: out of the bottom slab, up, and back into the top slab, closing the three layers into one loop marked 1 system.">` +
  ext(1) + ext(3) +
  slab(3) + slab(2) + slab(1) +
  `<g class="km-system-W__loop">` +
  `<path class="km-system-W__ret" pathLength="1" d="${RET}"/>` +
  `<path class="km-system-W__chev" d="${CHEV}"/>` +
  `</g></svg>`;

const callout = (k, name) =>
  `<div class="km-system-W__co is-in" data-l="${k}"><div class="km-system-W__col"><div class="ac-callout" style="--x:${CALL_X}px;--y:${yR(k)}px;--len:${CALL_LEN}px"><span class="ac-callout__code">0${k}</span><span class="ac-callout__t">${name}</span></div></div></div>`;


// the ledger (stack X's, three rows): one row open at a time; at rest 03 is open (the layer the return leaves from)
const LAYERS = [
  ["Narrative Systems", "The words buyers repeat", "We rewrite what your site, deck and reps say until a buyer can repeat it without you."],
  ["GTM Infrastructure", "The machine that carries it to buyers", "We build the data pipeline into your CRM, install the plays and triggers in your stack, and run the first cycles with your team."],
  ["GTM Intelligence", "The loop that learns", "We instrument every touch, then retune the system with you each quarter against what the signal says."],
];
const ROWS = LAYERS.map(([name, job, line], i) => {
  const k = i + 1, open = k === 3;
  return `            <li class="ac-row${open ? " is-open" : ""}" data-l="${k}">
              <button type="button" class="ac-row__head" aria-expanded="${open}" aria-controls="km-system-W-p${k}" id="km-system-W-b${k}"><span class="ac-idx">0${k}</span><span class="km-system-W__rt"><span class="ac-h4">${name}</span><span class="ac-support km-system-W__job">${job}</span></span><span class="ac-toggle" aria-hidden="true"></span></button>
              <div class="ac-row__more" id="km-system-W-p${k}" role="region" aria-labelledby="km-system-W-b${k}"><div><div class="ac-row__in km-system-W__more"><p class="ac-idx">In practice</p><p class="ac-support km-system-W__line">${line}</p></div></div></div>
            </li>`;
}).join("\n");

const html = `<section class="km km-system-W ac-sec ac-sec--ruled" data-surface="dark" aria-labelledby="km-system-W-h">

  <!-- head grammar (stack X): label → two-voice statement → rule → lede -->
  <div class="ac-head ac-wrap km-system-W__head">
    <div class="ac-labelrow"><p class="ac-label">The revenue operating system</p><p class="ac-meta">Fig. 03</p></div>
    <h2 class="ac-statement" id="km-system-W-h">
      <span class="ac-line"><span>Three layers.</span></span>
      <span class="ac-line ac-accent"><span>One closed loop.</span></span>
    </h2>
    <span class="ac-rule" aria-hidden="true"></span>
    <p class="ac-lede">Kelwin installs all three in your company, so pipeline becomes a standing output, not a one-time deliverable.</p>
  </div>

  <!-- the assembly. On the homepage the track is tall and the stage is sticky: each scroll step drops one
       slab and opens its ledger row; the last step closes the stack and draws the one red return.
       Everywhere else it plays once by itself. Default markup = the final, assembled state. -->
  <div class="km-system-W__track">
    <div class="km-system-W__stage">
      <div class="ac-wrap ac-grid km-system-W__body">

        <figure class="ac-frame ac-col km-system-W__fig has-dim is-closed" style="--c:1; --s:7">
          <span class="ac-reg ac-reg--tl" aria-hidden="true"></span><span class="ac-reg ac-reg--tr" aria-hidden="true"></span>
          <span class="ac-reg ac-reg--bl" aria-hidden="true"></span><span class="ac-reg ac-reg--br" aria-hidden="true"></span>
          <div class="ac-field km-system-W__field" style="--h:${FH}px">
            <div class="km-system-W__plot">
              ${svg}
              <div class="ac-dim ac-dim--v km-system-W__dim" style="--x:${XD}px;--y:${yL(1)}px;--h:${n1(yL(3) - yL(1))}px" aria-hidden="true"><span class="ac-dim__v km-system-W__dv"><span class="km-system-W__dv-a">3 layers</span><span class="km-system-W__dv-b">1 system</span></span></div>
              <div class="km-system-W__cos" aria-hidden="true">
                ${callout(1, "Narrative Systems")}
                ${callout(2, "GTM Infrastructure")}
                ${callout(3, "GTM Intelligence")}
              </div>
            </div>
          </div>
          <figcaption class="km-system-W__cap">
            <span class="ac-tblock"><span>Fig. 03</span><span>Revenue OS</span><span class="km-system-W__state">Installed</span><span>Specimen</span></span>
          </figcaption>
        </figure>

        <div class="ac-col km-system-W__detail" style="--c:9; --s:4">
          <ol class="ac-ledger km-system-W__ledger" aria-label="The three layers Kelwin installs">
${ROWS}
          </ol>
          <div class="ac-doors km-system-W__doors"><a class="ac-link" href="/audit">Find your weakest layer</a></div>
        </div>

      </div>
    </div>
  </div>
</section>
`;

fs.writeFileSync(OUT, html);
console.log("wrote", path.relative(R, OUT), html.length, "bytes");
console.log({ LX, RX, yL: [yL(1), yL(2), yL(3)], yR: [yR(1), yR(2), yR(3)], yMid });
