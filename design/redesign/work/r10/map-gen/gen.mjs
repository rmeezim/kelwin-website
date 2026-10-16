// r10-map · S v2 — writes R/site/frag/r10-map/S.html and S.js.
//   node src2/gen.mjs <map2.json> <geo2.js> <S.tpl.js> <frag dir>
// The markup is the drawing a page shows before (or without) its script: the land, the frame, the
// guides, New York, and a ruler that says only "We reply within two working days". Nothing in it
// depends on the time it was built. The script lays the live drawing over it for the real time.
import fs from "node:fs";
import path from "node:path";

const [DATA, GEOJS, TPL, OUTDIR] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
const geoSrc = fs.readFileSync(GEOJS, "utf8");
const G = new Function(geoSrc + "\nreturn { worldView, dotPath, runPath, guides, frame, lonX, latY, NYC };")();
const P = "km-r10-map-S";

// the 1440 drawing: a 1312px plate, 7px a cell
const v = G.worldView(1312);
const BW = Math.round(v.boxW), BH = Math.round(v.boxH);
const gd = G.guides(v), fr = G.frame(v);
const xn = Math.round(G.lonX(v, G.NYC.lon)), yn = Math.round(G.latY(v, G.NYC.lat));
const vb = `0 0 ${BW} ${BH}`;
const mask = (k) => `<defs><mask id="${P}-k${k}" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><rect width="100%" height="100%" fill="#fff"/><g class="${P}__ko" fill="#000"></g></mask></defs>`;

const html = `<section class="km ${P} ac-sec ac-sec--ruled" data-surface="dark" aria-labelledby="${P}-h">
  <!-- r10 · Contact · "Where we are" (round 10, the artifact language's "map" key, second version).
       Honest by construction: it claims no office, client, headcount or hours. What it shows is true:
       Kelwin works remotely and has its address in New York; where on Earth the clock reads
       9 to 6 right now (each 2° cell carries its real time zone); the visitor, placed by their
       device's own time zone (no lookup, nothing stored); and when our reply is due, counted as two
       working days on the visitor's own calendar. Built by qa/r10/art/map/src2/gen.mjs. -->

  <div class="ac-shead ac-shead--claim ac-wrap ${P}__head">
    <div class="ac-labelrow"><p class="ac-label">Where we are</p></div>
    <h2 class="ac-claim ac-claim--md" id="${P}-h">We work remotely, with an address in New York.</h2>
    <p class="ac-shead__lede">Write from any time zone. We reply within two working days, counted on your own calendar.</p>
  </div>

  <div class="ac-wrap ${P}__body">
    <noscript><style>.${P}:not(.is-live) .${P}__map, .${P}:not(.is-live) .${P}__ruler { visibility: visible; } .${P} .${P}__replay, .${P} .${P}__capt { display: none; }</style></noscript>
    <figure class="ac-plate ${P}__plate">
      <div class="${P}__map" tabindex="0" role="group" aria-label="World map. Point at it, or use the arrow keys, to read the time anywhere.">
        <svg class="${P}__dots" viewBox="${vb}" aria-hidden="true" focusable="false">${mask(1)}
          <g mask="url(#${P}-k1)">
            <path class="${P}__mer" d="${gd.mer}"/><path class="${P}__zones" d="M0 0"/><path class="${P}__eq" d="${gd.eq}"/>
            <path class="${P}__land" stroke-dasharray="2 ${Math.round(v.cell) - 2}" d="${G.runPath(v, data.land)}"/>
          </g>
        </svg>
        <svg class="${P}__lit" viewBox="${vb}" aria-hidden="true" focusable="false">${mask(2)}
          <path class="${P}__fill" d="M0 0"/>
          <g mask="url(#${P}-k2)"><path class="${P}__zones" d="M0 0"/><path class="${P}__litdots" d="M0 0"/><path class="${P}__edge" d="M0 0"/></g>
        </svg>
        <div class="${P}__cover" aria-hidden="true"></div>
        <svg class="${P}__over" viewBox="${vb}" aria-hidden="true" focusable="false">${mask(3)}
          <path class="${P}__frame" pathLength="1" d="M${fr.x0} ${fr.y0}H${fr.x1}V${fr.y1}H${fr.x0}Z"/>
          <path class="${P}__reg" d="${fr.reg}"/>
          <path class="${P}__tk" d="${gd.tk}"/>
          <g mask="url(#${P}-k3)">
            <path class="${P}__ch ${P}__ch--a" pathLength="1" d="M0 0"/><path class="${P}__ch ${P}__ch--b" pathLength="1" d="M0 0"/>
            <path class="${P}__ch ${P}__ch--c" pathLength="1" d="M0 0"/><path class="${P}__ch ${P}__ch--d" pathLength="1" d="M0 0"/>
          </g>
          <path class="${P}__lead" pathLength="1" d="M${xn + 9} ${yn + 0.5}H${xn + 26}"/>
          <g class="${P}__ny" transform="translate(${xn} ${yn})">
            <path class="${P}__nyx" d="M-11 0.5H-6M7 0.5H12M0.5 -11V-6M0.5 7V12"/>
            <rect class="${P}__nysq" x="-4" y="-4" width="8" height="8"/>
          </g>
          <rect class="${P}__you" x="0" y="0" width="10" height="10"/>
          <rect class="${P}__probe" x="0" y="0" width="0" height="0"/>
        </svg>
        <p class="${P}__lab ${P}__lab--day">Where it’s 9 to 6 right now</p>
        <p class="${P}__lab ${P}__lab--ny" style="left:${xn + 30}px;top:${yn - 9}px"><span class="${P}__key ${P}__key--ny" aria-hidden="true"></span><span class="${P}__name">New York</span><span class="${P}__sub">Our address <span class="${P}__time" data-t="ny"></span></span></p>
        <p class="${P}__lab ${P}__lab--you"><span class="${P}__key ${P}__key--you" aria-hidden="true"></span><span class="${P}__name">You · <span data-city></span></span><span class="${P}__sub"><span class="${P}__time" data-t="you">--:--</span></span></p>
        <p class="${P}__probe-t is-off" aria-hidden="true"><span class="${P}__pt">--:--</span><span class="${P}__po">UTC</span></p>
      </div>
      <p class="${P}__legend"><span class="${P}__sw" aria-hidden="true"></span>Where it’s 9 to 6 right now</p>
      <div class="${P}__ruler">
        <svg class="${P}__rsvg" viewBox="0 0 ${BW} 136" aria-hidden="true" focusable="false">
          <path class="${P}__base" d="M${Math.round(v.ox)} 48.5H${Math.round(v.ox + v.W)}"/>
          <path class="${P}__past" pathLength="1" d="M0 0"/><path class="${P}__future" pathLength="1" d="M0 0"/>
          <path class="${P}__st" d="M0 0"/><path class="${P}__dt" d="M0 0"/>
          <path class="${P}__tdy" d="M0 0"/><path class="${P}__blk" d="M0 0"/>
          <rect class="${P}__bar" x="0" y="0" width="0" height="0"/>
          <path class="${P}__nowt" d="M0 0"/><path class="${P}__duet" d="M0 0"/>
        </svg>
        <p class="${P}__key-r"><span class="${P}__rk" aria-hidden="true"></span><span>Your time<span class="${P}__city"> · <span data-city></span></span></span></p>
        <div class="${P}__days" aria-hidden="true"></div>
        <div class="${P}__nums" aria-hidden="true"></div>
        <p class="${P}__now">Now</p>
        <p class="${P}__due">We reply within two working days.</p>
      </div>
      <figcaption class="ac-capband ac-capband--ruled ${P}__cap">
        <span class="ac-sr">A world map with your place on it, and a ruler of your days showing when our reply is due. </span>
        <p class="${P}__capt">Your place comes from your device’s time zone, and nothing is looked up or stored. Point at the map to read the time anywhere.</p>
        <p class="${P}__src">Map: Natural Earth. Time zones: © OpenStreetMap contributors.</p>
        <button class="ac-go ac-go--bare ${P}__replay" type="button">Replay</button>
        <span class="ac-sr ${P}__live" aria-live="polite"></span>
      </figcaption>
    </figure>
  </div>
</section>
`;

// the script: the template with the geometry and the baked data inlined
const js = fs.readFileSync(TPL, "utf8")
  .replace("/*@GEO@*/", geoSrc.trim())
  .replace("/*@DATA@*/", [
    `var LAND = ${JSON.stringify(data.land)};`,
    `var GROUPS = ${JSON.stringify(data.groups)};`,
    `var ZG = ${JSON.stringify(data.zg)};`,
    `var ZONES = ${JSON.stringify(data.zones, (k, x) => (typeof x === "number" ? Math.round(x) : x))};`,
    `var LINKS = ${JSON.stringify(data.links)};`].join("\n  "));

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(path.join(OUTDIR, "S.html"), html);
fs.writeFileSync(path.join(OUTDIR, "S.js"), js);
console.log("S.html", html.length, "bytes · S.js", js.length, "bytes · box", BW, "×", BH, "· cell", v.cell, "· NY", xn, yn);
