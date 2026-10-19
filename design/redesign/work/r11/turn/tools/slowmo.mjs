// Round 11 copy (Date.now is slowed too, so the turn's stored lift time keeps page time; R fixed). Inspection only (the review films are tool/film9.mjs, in real time): the same click-through or cold
// arrival, played SLOWER (--slow 4: every timer, performance.now() and every animation run at 1/4 speed)
// and screencast, so the frames are dense; then a labelled contact sheet at real-time steps.
//   node tools/slowmo.mjs turn|arrive <page> --out <sheet.png> [--click /about] [--slow 4] [--vp 1440x900]
//        [--from 0] [--dur 1600] [--step 33] [--cols 6] [--w 300] [--settle 2500]
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { fileURLToPath } from "node:url"; import { createRequire } from "node:module"; const { chromium } = createRequire("/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/redesign/tool/x.js")("playwright");
import { spawnSync } from "node:child_process";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const R = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/redesign", SITE = path.join(R, "site");
const ROUTES = { "/": "page-home.html", "/about": "page-about.html", "/audit": "page-audit.html", "/contact": "page-contact.html", "/capabilities/gtm-intelligence": "page-gtm-intelligence.html", "/insights": "page-insights.html", "/insights/revenue-entropy": "page-revenue-entropy.html", "/204": "204" };
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png" };
const argv = process.argv.slice(2), pos = [], opt = {};
for (let i = 0; i < argv.length; i++) { if (argv[i].startsWith("--")) { opt[argv[i].slice(2)] = argv[i + 1]; i++; } else pos.push(argv[i]); }
const [MODE, PAGE] = pos; const num = (k, d) => (opt[k] === undefined ? d : +opt[k]);
const SLOW = num("slow", 4), [VW, VH] = String(opt.vp || "1440x900").split("x").map(Number);
const pagePath = path.resolve(R, PAGE), ROOT = path.dirname(pagePath), FILE = path.basename(pagePath);
let NAVDELAY = 0;   /* armed at the click: the next page's HTML waits this long (real ms), so the wait while it loads keeps its real length in the retimed film */
const server = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split("?")[0].split("#")[0]); const route = u.replace(/\/$/, "") || "/";
  if (route === "/204") { s.writeHead(204); s.end(); return; }
  if (ROUTES[route] && !u.endsWith(".html")) { s.writeHead(302, { location: "/" + ROUTES[route] }); s.end(); return; }
  let f = path.join(ROOT, u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(SITE, u);
  const send = () => fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream", "cache-control": "no-store" }); s.end(d); });
  if (NAVDELAY && f.endsWith(".html")) setTimeout(send, NAVDELAY); else send();
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const base = `http://127.0.0.1:${server.address().port}/`;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: VW, height: VH } });
// slow everything down: timers, the clock, and every animation (polled each frame)
await ctx.addInitScript((S) => {
  const dn = Date.now.bind(Date), dz = dn(); Date.now = () => Math.round(dz + (dn() - dz) / S);
  const pn = performance.now.bind(performance), st = window.setTimeout.bind(window), si = window.setInterval.bind(window), z = pn();
  performance.now = () => z + (pn() - z) / S;
  window.setTimeout = (f, t, ...a) => st(f, (t || 0) * S, ...a);
  window.setInterval = (f, t, ...a) => si(f, (t || 0) * S, ...a);
  const ea = Element.prototype.animate;
  Element.prototype.animate = function (...a) { const an = ea.apply(this, a); try { an.playbackRate = 1 / S; } catch (e) {} return an; };
  const slow = () => { try { document.getAnimations().forEach((a) => { if (a.playbackRate !== 1 / S) a.playbackRate = 1 / S; }); } catch (e) {} requestAnimationFrame(slow); };
  requestAnimationFrame(slow);
  new MutationObserver(() => { try { document.getAnimations().forEach((a) => { if (a.playbackRate !== 1 / S) a.playbackRate = 1 / S; }); } catch (e) {} })
    .observe(document, { attributes: true, subtree: true, attributeFilter: ["class", "style"] });
}, SLOW);
const p = await ctx.newPage();
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
const cdp = await ctx.newCDPSession(p);
const FR = path.resolve((opt.out || "slowmo.png").replace(/\.png$/, "") + "-frames"); fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
const frames = [];
cdp.on("Page.screencastFrame", async (f) => {
  const file = path.join(FR, `f${String(frames.length).padStart(4, "0")}.jpg`);
  fs.writeFileSync(file, Buffer.from(f.data, "base64")); frames.push({ file, t: f.metadata.timestamp * 1000 });
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
});
const cast = () => cdp.send("Page.startScreencast", { format: "jpeg", quality: 90, maxWidth: VW, maxHeight: VH, everyNthFrame: 1 });
let t0;
if (MODE === "arrive") {
  await p.setContent('<html style="background:#141517"><body style="margin:0;background:#141517"></body></html>');
  await cast(); await p.waitForTimeout(300);
  t0 = Date.now(); await p.goto(base + FILE, { waitUntil: "commit" }); await p.waitForTimeout(num("rec", 3000) * SLOW);
} else {
  await p.goto(base + FILE, { waitUntil: "load" }); await p.waitForTimeout(num("settle", 2500) * SLOW);
  await cast(); await p.waitForTimeout(300);
  const sel0 = String(opt.click || "/about"); const link0 = p.locator(sel0.startsWith("/") ? `a[href="${sel0}"]` : sel0).first();
  await link0.scrollIntoViewIfNeeded(); await p.waitForTimeout(num("prescroll", 200) * SLOW);   /* page time: let what scrolled into view settle */
  var tLead = Date.now(); await p.waitForTimeout(num("lead", 700) * SLOW);
  const sel = String(opt.click || "/about"); const link = p.locator(sel.startsWith("/") ? `a[href="${sel}"]` : sel).first();
  NAVDELAY = num("navdelay", 0);
  t0 = Date.now(); await link.click({ noWaitAfter: true });
  await p.waitForTimeout(num("rec", 2600) * SLOW);
}
await cdp.send("Page.stopScreencast").catch(() => {}); await b.close(); server.close();
// sheet: at each real-time step, the last frame shown by then
const from = num("from", 0), dur = num("dur", 1600), step = num("step", 33), cols = num("cols", 6), w = num("w", 300);
const picks = [];
for (let t = from; t <= from + dur; t += step) {
  const at = t0 + t * SLOW; let k = -1; for (let i = 0; i < frames.length; i++) if (frames[i].t <= at) k = i;
  if (k >= 0) picks.push([t, frames[k].file]);
}
fs.writeFileSync(FR + "/picks.json", JSON.stringify({ picks, cols, w, crop: opt.crop ? String(opt.crop).split(",").map(Number) : null, out: path.resolve(opt.out || "slowmo.png"), errors: errs }));
const py = `import json,sys
from PIL import Image, ImageDraw, ImageFont
j=json.load(open(sys.argv[1])); cols=j["cols"]; w=j["w"]
ims=[(t,Image.open(f).convert("RGB")) for t,f in j["picks"]]
if j.get("crop"):
    x,y,cw,ch=j["crop"]; ims=[(t,im.crop((x,y,x+cw,y+ch))) for t,im in ims]
ims=[(t,im.resize((w, round(im.height*w/im.width)))) for t,im in ims]
h=ims[0][1].height; lab=18; rows=(len(ims)+cols-1)//cols
S=Image.new("RGB",(cols*(w+4)+4, rows*(h+lab+4)+4),(90,90,90)); d=ImageDraw.Draw(S)
f=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",12)
for i,(t,im) in enumerate(ims):
    x=4+(i%cols)*(w+4); y=4+(i//cols)*(h+lab+4); S.paste(im,(x,y+lab)); d.text((x+2,y+2),f"+{t}ms",fill=(255,255,0),font=f)
S.save(j["out"])`;
const r = spawnSync("python3", ["-c", py, FR + "/picks.json"], { encoding: "utf8" });
if (opt.mp4) {
  // a film at real speed from the slowed capture: every frame's time is divided by --slow
  const FF = path.resolve(R, "..", "ffenv/lib/python3.11/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2");
  const start = MODE === "arrive" ? t0 - 250 : tLead;
  let keep = frames.filter((f) => f.t >= start); const before = frames.filter((f) => f.t < start);
  if (before.length) keep.unshift({ ...before[before.length - 1], t: start });
  const list = ["ffconcat version 1.0"];
  keep.forEach((f, i) => { const d = i < keep.length - 1 ? (keep[i + 1].t - f.t) / SLOW / 1000 : 0.9; list.push(`file '${f.file}'`, `duration ${Math.max(0.001, d).toFixed(4)}`); });
  list.push(`file '${keep[keep.length - 1].file}'`);
  fs.writeFileSync(FR + "/list.txt", list.join("\n") + "\n");
  const W = num("width", 1280);
  const e = spawnSync(FF, ["-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", FR + "/list.txt", "-vf", `fps=30,scale=${W}:-2:flags=lanczos,format=yuv420p`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", opt.mp4], { encoding: "utf8" });
  if (e.status) console.error(e.stderr);
  const clickAt = MODE === "arrive" ? 0 : (t0 - start) / SLOW / 1000;
  const total = (keep[keep.length - 1].t - start) / SLOW / 1000 + 0.9;
  const poster = opt.mp4.replace(/\.mp4$/, ".webp");
  spawnSync(FF, ["-hide_banner", "-loglevel", "error", "-y", "-ss", String(Math.min(total - 0.1, clickAt + (MODE === "arrive" ? total - 0.2 : 0.45)).toFixed(3)), "-i", opt.mp4, "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", poster]);
  fs.writeFileSync(opt.mp4.replace(/\.mp4$/, ".json"), JSON.stringify({ mode: MODE, page: PAGE, clicked: opt.click || null, mp4: path.relative(R, path.resolve(opt.mp4)), poster: path.relative(R, path.resolve(poster)),
    width: W, seconds: +total.toFixed(2), kb: Math.round(fs.statSync(opt.mp4).size / 1024), clickAt: MODE === "arrive" ? undefined : +clickAt.toFixed(2), slow: SLOW, frames: keep.length,
    note: `recorded at 1/${SLOW} speed (timers, clock and every animation) and retimed to real speed, so the recorder never drops frames; the next page's HTML was held ${num("navdelay", 0)}ms (real) so the wait while it loads keeps about its real-time length`, errors: errs }, null, 1));
}
if (r.status) console.error(r.stderr);
console.log(JSON.stringify({ out: opt.out, frames: frames.length, picks: picks.length, errors: errs }));
