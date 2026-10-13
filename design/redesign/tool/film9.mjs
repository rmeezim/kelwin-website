// Round-9 review films: record a stitched mockup in REAL TIME with a CDP screencast, then encode an
// H.264 mp4 (yuv420p, faststart, no audio, ≤ --max-kb) plus a poster webp and a small metadata json.
//
//   node tool/film9.mjs turn   <page> --out <file.mp4> [--click <selector | /route>]
//        load <page>, let it settle, record --lead ms, click an internal link (the turn), record --after ms
//   node tool/film9.mjs sheet  <page> --out <file.mp4> [--click …]
//        the same click, but every page is served with the turn switched off and GoNimbly's "sheet slide"
//        (proto-r9/motion.css, its @view-transition block) switched on: the alternative, for comparison
//   node tool/film9.mjs arrive <page> --out <file.mp4>
//        a cold load from a graphite blank: the panel, the mark, the lift, the h1 write-in, the plate rise
//
// <page> is a path relative to R (qa/r9-kit/stitch/page-int-kit.html) or a file name in R/site
// (page-about.html). Its folder is served at /, with R/site behind it for anything missing (fonts/,
// img/, brand/, lib/, sibling pages). Clean routes (/about, /projects/…) redirect to the page files.
//
// Options: --click (default: the first nav item that isn't the current page) · --vp 1440x900 ·
//   --width 1280 (film width) · --settle 3600 (ms after load, before a turn is recorded) · --lead 700 ·
//   --after 3400 (ms recorded after the click) · --hold 3400 (ms recorded on arrive) · --tail 900
//   (ms the last frame holds) · --poster end|start|<ms into the film>|click+<ms> · --max-kb 1500 ·
//   --sheet <png> (a contact sheet of the ENCODED film, 4 frames a second) · --keep-frames
// Writes <out>.mp4, <out minus .mp4>.webp (poster) and <out minus .mp4>.json; prints the json.
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url"; import { chromium } from "playwright";

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(R, "site");
const FF = path.resolve(R, "..", "ffenv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2");
const ROUTES = { "/": "page-home.html", "/audit": "page-audit.html", "/contact": "page-contact.html", "/about": "page-about.html",
  "/who-we-work-with": "page-who-we-work-with.html", "/careers": "page-careers.html", "/the-lab": "page-the-lab.html",
  "/insights": "page-insights.html", "/reports": "page-reports.html", "/privacy": "page-privacy.html", "/terms": "page-terms.html",
  "/capabilities/narrative-systems": "page-narrative-systems.html", "/capabilities/gtm-infrastructure": "page-gtm-infrastructure.html",
  "/capabilities/gtm-intelligence": "page-gtm-intelligence.html", "/insights/revenue-entropy": "page-revenue-entropy.html",
  "/insights/the-17-percent-window": "page-the-17-percent-window.html",
  "/insights/deliverability-is-infrastructure": "page-deliverability-is-infrastructure.html",
  "/projects": "page-projects.html", "/projects/email-deliverability": "page-email-deliverability.html" };
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4" };

// ── arguments ──
const argv = process.argv.slice(2), pos = [], opt = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) { const k = argv[i].slice(2); const v = argv[i + 1]; if (v === undefined || v.startsWith("--")) opt[k] = true; else { opt[k] = v; i++; } }
  else pos.push(argv[i]);
}
const [MODE, PAGE] = pos;
if (!["turn", "sheet", "arrive"].includes(MODE) || !PAGE || !opt.out) {
  console.error("usage: node tool/film9.mjs turn|sheet|arrive <page> --out <file.mp4> [--click …] [options]"); process.exit(2);
}
const num = (k, d) => (opt[k] === undefined ? d : +opt[k]);
const [VW, VH] = String(opt.vp || "1440x900").split("x").map(Number);
const WIDTH = num("width", 1280), SETTLE = num("settle", 3600), LEAD = num("lead", 700), AFTER = num("after", 3400);
const HOLD = num("hold", 3400), TAIL = num("tail", 900), MAXKB = num("max-kb", 1500);
const OUT = path.resolve(opt.out.endsWith(".mp4") ? opt.out : opt.out + ".mp4");
const STEM = OUT.slice(0, -4);
const pagePath = fs.existsSync(path.resolve(R, PAGE)) ? path.resolve(R, PAGE) : path.join(SITE, PAGE);
if (!fs.existsSync(pagePath)) { console.error("no such page:", PAGE); process.exit(2); }
const ROOT = path.dirname(pagePath), FILE = path.basename(pagePath);
if (!fs.existsSync(FF)) { console.error("ffmpeg not found at", FF); process.exit(2); }

// ── the sheet slide: the prototype's @view-transition block, and the turn switched off before it can raise ──
let INJECT = "";
if (MODE === "sheet") {
  const css = fs.readFileSync(path.join(R, "proto-r9", "motion.css"), "utf8");
  const viewt = css.slice(css.indexOf("@view-transition"), css.indexOf("/* 2 · the headline */"));
  INJECT = `<script>window.KMTurn={motion:false,warm:false,t0:0};</script><style>${viewt}</style>`;
}

// ── a static server: the page's folder, then R/site; clean routes redirect to the page files ──
const server = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split("?")[0].split("#")[0]);
  const route = u.replace(/\/$/, "") || "/";
  if (ROUTES[route] && !u.endsWith(".html")) { s.writeHead(302, { location: "/" + ROUTES[route] }); s.end(); return; }
  let f = path.join(ROOT, u);
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(SITE, u);
  fs.readFile(f, (e, d) => {
    if (e) { s.writeHead(404); s.end(); return; }
    const ext = path.extname(f);
    if (ext === ".html" && INJECT) d = Buffer.from(String(d).replace(/<head([^>]*)>/i, (m) => m + INJECT));
    s.writeHead(200, { "content-type": TYPES[ext] || "application/octet-stream", "cache-control": "no-store" }); s.end(d);
  });
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${server.address().port}/`;

// ── record ──
const FR = STEM + "-frames"; fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: VW, height: VH } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
const cdp = await p.context().newCDPSession(p);
const frames = [];   // { file, t } (t in epoch ms, the frame's own swap time)
cdp.on("Page.screencastFrame", async (f) => {
  const file = path.join(FR, `f${String(frames.length).padStart(4, "0")}.jpg`);
  fs.writeFileSync(file, Buffer.from(f.data, "base64"));
  frames.push({ file, t: (f.metadata.timestamp || Date.now() / 1000) * 1000 });
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
});
const cast = () => cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: WIDTH, maxHeight: Math.round(WIDTH * VH / VW), everyNthFrame: 1 });
let tStart = 0, tClick = 0, clicked = null, arrivedAt = "";
if (MODE === "arrive") {
  await p.setContent('<html style="background:#141517"><body style="margin:0;background:#141517"></body></html>');
  await cast(); await p.waitForTimeout(250);
  tStart = Date.now();
  await p.goto(base + FILE, { waitUntil: "commit" });
  await p.waitForTimeout(HOLD);
} else {
  await p.goto(base + FILE, { waitUntil: "load" });
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.waitForTimeout(SETTLE);
  await cast(); tStart = Date.now();
  await p.waitForTimeout(LEAD);
  const sel = !opt.click || opt.click === true ? "a.ac-nav__item:not(.is-current)" : String(opt.click).startsWith("/") ? `a[href="${opt.click}"]` : opt.click;
  const link = p.locator(sel).first();
  clicked = { selector: sel, href: await link.getAttribute("href").catch(() => null) };
  tClick = Date.now();
  await link.click({ noWaitAfter: true });
  await p.waitForTimeout(AFTER);
  arrivedAt = new URL(p.url()).pathname;
}
const tEnd = Date.now();
await cdp.send("Page.stopScreencast").catch(() => {});
await p.waitForTimeout(150);
await b.close(); server.close();

// ── encode: the frames at their real timing (concat durations), resampled to 30 fps ──
// frames before the film starts (the settle, for a turn) are dropped; the first kept frame starts the film
let keep = frames.filter((f) => f.t >= tStart - 40);
const before = frames.filter((f) => f.t < tStart - 40);
if (before.length) keep.unshift({ ...before[before.length - 1], t: tStart });   // what was on screen when the film starts
if (keep.length < 2) { console.error("too few frames:", frames.length); process.exit(1); }
const t0 = keep[0].t;
const dur = (i) => (i < keep.length - 1 ? Math.max(0.001, (keep[i + 1].t - keep[i].t) / 1000) : TAIL / 1000);
const list = ["ffconcat version 1.0"];
keep.forEach((f, i) => { list.push(`file '${f.file}'`, `duration ${dur(i).toFixed(4)}`); });
list.push(`file '${keep[keep.length - 1].file}'`);
const LIST = path.join(FR, "list.txt"); fs.writeFileSync(LIST, list.join("\n") + "\n");
const total = (keep[keep.length - 1].t - t0) / 1000 + TAIL / 1000;
const ff = (args) => { const r = spawnSync(FF, ["-hide_banner", "-loglevel", "error", "-y", ...args], { encoding: "utf8" }); if (r.status) throw new Error(r.stderr.slice(-800)); return r; };
let crf = 22, size = 0;
for (let c = 22; c <= 40; c += 3) {
  crf = c;
  ff(["-f", "concat", "-safe", "0", "-i", LIST, "-vf", `fps=30,scale=${WIDTH}:-2:flags=lanczos,format=yuv420p`,
    "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", "-an", OUT]);
  size = fs.statSync(OUT).size;
  if (size <= MAXKB * 1024) break;
}
// the poster, taken from the encoded film so it matches it exactly
const clickS = tClick ? (tClick - t0) / 1000 : 0;
const at = opt.poster === "start" ? 0.05 : (!opt.poster || opt.poster === "end") ? Math.max(0, total - 0.1)
  : String(opt.poster).startsWith("click+") ? Math.min(total - 0.1, clickS + +String(opt.poster).slice(6) / 1000)
  : Math.min(total - 0.1, +opt.poster / 1000);
const POSTER = STEM + ".webp";
ff(["-ss", at.toFixed(3), "-i", OUT, "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", POSTER]);
if (opt.sheet && opt.sheet !== true) {
  const cols = 5, rows = Math.ceil(total * 4 / cols);
  ff(["-i", OUT, "-vf", `fps=4,scale=480:-2,tile=${cols}x${rows}:padding=4:color=0x555555`, "-frames:v", "1", path.resolve(opt.sheet)]);
}
const H = Math.round(WIDTH * VH / VW / 2) * 2;
const meta = { mode: MODE, page: path.relative(R, pagePath), clicked, arrived: arrivedAt || undefined, mp4: path.relative(R, OUT), poster: path.relative(R, POSTER),
  width: WIDTH, height: H, seconds: +total.toFixed(2), kb: Math.round(size / 1024), crf, frames: keep.length,
  clickAt: tClick ? +((tClick - t0) / 1000).toFixed(2) : undefined, posterAt: +at.toFixed(2), recorded: +((tEnd - tStart) / 1000).toFixed(2), errors: errs.slice(0, 6) };
fs.writeFileSync(STEM + ".json", JSON.stringify(meta, null, 1));
if (!opt["keep-frames"]) fs.rmSync(FR, { recursive: true, force: true });
console.log(JSON.stringify(meta));
if (size > MAXKB * 1024) { console.error(`over budget: ${Math.round(size / 1024)} KB > ${MAXKB} KB even at crf ${crf}`); process.exit(1); }
