// Round-11 turn films: round 10's v2/tools/film.mjs (itself tool/film9.mjs extended), copied here and extended again
// (the tools are not edited): every html class change of both pages is logged against the click, so each film carries
// its own timeline (the turn starts, the next page is requested, it paints covered, the lift, the panel is gone).
// REAL TIME: a CDP screencast, frames encoded at their real timing (H.264, yuv420p, faststart, ≤ --max-kb).
//
//   node tools/film.mjs turn <dir> <page> --out <file.mp4> --click <selector | /route> [options]
//   node tools/film.mjs arrive <dir> <page> --out <file.mp4> [--hold ms]
//   node tools/film.mjs chain <dir> <page> --out <file.mp4> --click … [--hold ms]
//        entering the site cold (from a graphite blank, --hold ms), then (a cut) the link scrolled into view,
//        its section settled (--prescroll ms), and the click: the first turn of a visit after the arrival
// <dir> is a folder under pages/ (lockup, today-390…); it is served at /, R/site behind it.
// Options: --vp 1440x900 · --width 1280 (film width) · --settle 3600 · --lead 900 · --after 3200 · --hold 3400 ·
//   --tail 900 · --prescroll <ms> (scroll the link into view, let its section play) · --takes N (keep the take with the
//   smallest recorder stall over the motion: the sweep in and the lift) · --poster click+<ms>|lift-<ms>|<ms> ·
//   --max-kb 1500 · --delay <ms> (hold the next page back: a slow page) · --sheet <png> (contact sheet, 10 fps)
//   --flicker <ms> (leaving: when the logo is whole, after the turn starts; today 470, the full logo 610) ·
//   --cold <ms> (entering cold: when the logo is whole, after the first paint; today 270, the full logo 410)
// THE TAKE PICKER (round-11 fix): the stall is the longest gap between delivered frames over every moment something
// moves on screen: the sweep in AND the flicker (the turn's start → the logo whole + 20ms), the cold flicker (the
// page's first paint → the logo whole + 20ms), and the lift (+700ms). A step of the flicker lasts 40–50ms, so a gap
// there shows as a held step; the old picker only looked at click → +420ms and missed the wordmark's steps.
import fs from "node:fs"; import path from "node:path"; import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { serve, R, L, FF } from "./serve.mjs";
const require = createRequire(path.join(R, "tool/x.js")); const { chromium } = require("playwright");

const argv = process.argv.slice(2), pos = [], opt = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) { const k = argv[i].slice(2); const v = argv[i + 1]; if (v === undefined || v.startsWith("--")) opt[k] = true; else { opt[k] = v; i++; } }
  else pos.push(argv[i]);
}
const [MODE, DIR, PAGE] = pos;
const num = (k, d) => (opt[k] === undefined ? d : +opt[k]);
const [VW, VH] = String(opt.vp || "1440x900").split("x").map(Number);
const WIDTH = num("width", Math.min(VW, 1280)), SETTLE = num("settle", 3600), LEAD = num("lead", 900), AFTER = num("after", 3200);
const HOLD = num("hold", 3400), TAIL = num("tail", 900), MAXKB = num("max-kb", 1500), TAKES = num("takes", 1);
const OUT = path.resolve(opt.out.endsWith(".mp4") ? opt.out : opt.out + ".mp4"), STEM = OUT.slice(0, -4), FR = STEM + "-frames";

async function take() {
  const S = await serve(path.join(L, "pages", DIR));
  if (opt.delay) { S.delay["page-audit.html"] = S.delay["page-insights.html"] = S.delay["page-home.html"] = 0; }
  fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: VW, height: VH } });
  const cls = [];   /* { t: epoch ms, c: the turn classes on <html>, u: the page } */
  await ctx.exposeBinding("__kcls", (src, t, c, u) => { const l = cls[cls.length - 1]; if (!l || l.c !== c || l.u !== u) cls.push({ t, c, u }); });
  const paints = [];   /* { t: epoch ms, u } the first paint of each document */
  await ctx.exposeBinding("__kfp", (src, t, u) => { paints.push({ t, u }); });
  await ctx.addInitScript(() => {
    try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-paint") window.__kfp(performance.timeOrigin + e.startTime, location.pathname); }).observe({ type: "paint", buffered: true }); } catch (e) {}
    const rec = () => { const d = document.documentElement; if (!d) return; const c = [...d.classList].filter((x) => /^km-(turning|arriving|cold|lift|word|mo|full)$/.test(x)).join(" "); try { window.__kcls(performance.timeOrigin + performance.now(), c, location.pathname); } catch (e) {} };
    new MutationObserver(rec).observe(document, { attributes: true, subtree: true, childList: true, attributeFilter: ["class"] });
  });
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  const cdp = await ctx.newCDPSession(p);
  const frames = [];
  cdp.on("Page.screencastFrame", (f) => {
    cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});   /* ack first: the next frame is not held by the write */
    const file = path.join(FR, `f${String(frames.length).padStart(4, "0")}.jpg`);
    frames.push({ file, t: (f.metadata.timestamp || Date.now() / 1000) * 1000 });
    fs.writeFileSync(file, Buffer.from(f.data, "base64"));
  });
  const cast = () => cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: WIDTH, maxHeight: Math.round(WIDTH * VH / VW), everyNthFrame: 1 });
  let tStart = 0, tClick = 0, clicked = null, arrived = "";
  let tArrive = 0;
  if (MODE === "chain") {
    await p.setContent('<html style="background:#141517"><body style="margin:0;background:#141517"></body></html>');
    await cast(); await p.waitForTimeout(250);
    tStart = tArrive = Date.now();
    await p.goto(S.base + PAGE, { waitUntil: "commit" });
    await p.waitForTimeout(HOLD);
    const sel = String(opt.click).startsWith("/") ? `a[href="${opt.click}"]` : opt.click;
    const link = p.locator(sel).first();
    await link.evaluate((a) => a.scrollIntoView({ block: "center" })); await p.waitForTimeout(num("prescroll", 1200));
    await p.waitForTimeout(LEAD);
    clicked = { selector: sel, href: await link.getAttribute("href").catch(() => null) };
    tClick = Date.now();
    if (VW < 1024) await link.evaluate((a) => a.click()); else await link.click({ noWaitAfter: true });
    await p.waitForTimeout(AFTER);
    arrived = new URL(p.url()).pathname;
  } else if (MODE === "arrive") {
    await p.setContent('<html style="background:#141517"><body style="margin:0;background:#141517"></body></html>');
    await cast(); await p.waitForTimeout(250);
    tStart = Date.now();
    await p.goto(S.base + PAGE, { waitUntil: "commit" });
    await p.waitForTimeout(HOLD);
  } else {
    await p.goto(S.base + PAGE, { waitUntil: "load" });
    await p.evaluate(() => document.fonts && document.fonts.ready);
    await p.waitForTimeout(SETTLE);
    const sel = String(opt.click).startsWith("/") ? `a[href="${opt.click}"]` : opt.click;
    const link = p.locator(sel).first();
    if (opt.prescroll) { await link.evaluate((a) => a.scrollIntoView({ block: "center" })); await p.waitForTimeout(num("prescroll", 3000)); }
    if (opt.delay) { const href = await link.getAttribute("href"); const f = { "/audit": "page-audit.html", "/insights": "page-insights.html", "/": "page-home.html" }[href]; if (f) S.delay[f] = num("delay", 0); }
    cls.length = 0;
    await cast(); tStart = Date.now();
    await p.waitForTimeout(LEAD);
    clicked = { selector: sel, href: await link.getAttribute("href").catch(() => null) };
    tClick = Date.now();
    if (VW < 1024) await link.evaluate((a) => a.click()); else await link.click({ noWaitAfter: true });
    await p.waitForTimeout(AFTER);
    arrived = new URL(p.url()).pathname;
  }
  const tEnd = Date.now();
  await cdp.send("Page.stopScreencast").catch(() => {});
  await p.waitForTimeout(150);
  await b.close(); S.close();
  const hits = S.hits.filter((h) => h.t >= tStart);
  /* the timeline, ms from the click (or from the load, entering cold) */
  const o = tClick || tStart, ev = {};
  const first = (f) => { const x = cls.find(f); return x ? Math.round(x.t - o) : undefined; };
  const startU = MODE === "chain" ? (cls.find((x) => x.t >= tClick) || {}).u : cls[0]?.u;
  const next = arrived && cls.findIndex((x) => x.t >= (tClick || 0) && x.u !== startU);
  if (MODE === "chain") { const a = cls.find((x) => /km-lift/.test(x.c)); ev.arriveLift = a ? Math.round(a.t - tArrive) : undefined; ev.arriveMo = cls.some((x) => x.t < tClick && /km-mo/.test(x.c)); }
  ev.turning = first((x) => /km-turning/.test(x.c));
  ev.turnMo = cls.some((x) => /km-turning/.test(x.c) && /km-mo/.test(x.c));
  ev.requested = hits.length ? Math.round(hits[hits.length - 1].t - o) : undefined;
  ev.arriving = first((x, i) => (MODE === "arrive" || (next >= 0 && i >= next)) && /km-arriving/.test(x.c));
  ev.lift = first((x, i) => (MODE === "arrive" || (next >= 0 && i >= next)) && /km-lift/.test(x.c));
  ev.cleared = first((x, i) => ev.lift !== undefined && x.t - o > ev.lift && !/km-arriving/.test(x.c));
  ev.word = first((x) => /km-word/.test(x.c)) !== undefined;
  /* the recorder's stall: the longest gap between delivered frames while something moves (the sweep in, the lift) */
  const win = [], FLICK = num("flicker", 610), COLD = num("cold", 410);
  if (tClick) win.push(["leave", tClick, o + (ev.turning !== undefined ? ev.turning : 0) + FLICK + 20]);
  const Lt = ev.lift !== undefined ? o + ev.lift : 0; if (Lt) win.push(["lift", Lt, Lt + 700]);
  if (ev.arriveLift !== undefined) win.push(["arrivelift", tArrive + ev.arriveLift, tArrive + ev.arriveLift + 700]);
  const fp = paints.find((x) => x.t >= tStart && (MODE === "arrive" || MODE === "chain") && (!tClick || x.t < tClick));
  if (fp) { ev.firstPaint = Math.round(fp.t - (tArrive || tStart)); win.push(["cold", fp.t, fp.t + COLD + 20]); }
  let stall = 0; const stalls = {};
  for (const [k, a, z] of win) {
    let s = 0;
    for (let i = 1; i < frames.length; i++) if (frames[i].t > a && frames[i - 1].t < z) s = Math.max(s, frames[i].t - Math.max(frames[i - 1].t, a));
    stalls[k] = Math.round(s); stall = Math.max(stall, s);
  }
  /* what the frames show: each flicker step's time on screen (tools/score.py) */
  const W = [], FULL = FLICK > 500, CFULL = COLD > 300;
  if (tClick && ev.turning !== undefined) W.push({ kind: "leave", a: o + ev.turning + 200, z: o + ev.turning + FLICK + 80, full: FULL, dir: "on" });
  if (Lt) W.push({ kind: "lift", a: Lt, z: Lt + 220, full: MODE === "arrive" ? CFULL : FULL, dir: "off" });
  if (fp) W.push({ kind: "cold", a: fp.t, z: fp.t + COLD + 80, full: CFULL, dir: "on" });
  if (ev.arriveLift !== undefined) W.push({ kind: "arrivelift", a: tArrive + ev.arriveLift, z: tArrive + ev.arriveLift + 220, full: CFULL, dir: "off" });
  const TJ = path.join(FR, "take.json");
  const t0 = frames.some((f) => f.t < tStart - 40) ? tStart : (frames.find((f) => f.t >= tStart - 40) || {}).t;
  fs.writeFileSync(TJ, JSON.stringify({ vp: `${VW}x${VH}`, width: WIDTH, t0, frames: frames.map((f) => ({ file: f.file, t: f.t })), windows: W }));
  const sc = spawnSync("python3", [path.join(L, "tools/score.py"), TJ], { encoding: "utf8" });
  let score = { held: 99, missed: 99, maxMs: 9999, detail: [sc.stderr.slice(-300)] };
  try { score = JSON.parse(sc.stdout); } catch (e) {}
  return { score, frames, tStart, tClick, tArrive, clicked, arrived, tEnd, errs, ev, cls: cls.map((x) => ({ t: Math.round(x.t - o), c: x.c, u: x.u })), stall: Math.round(stall), stalls,
    ft: frames.map((f) => Math.round(f.t - o)) };
}
/* THE TAKE IS JUDGED BY ITS FILM (round-11 fix, second pass): every take is encoded exactly as the founder's film is
   (the frames at their real timing, resampled to 30 fps, H.264) and that film is decoded and read frame by frame
   (tools/steps.py: each flicker step's time on screen, in the film's own frames). The kept take is the one whose film
   holds no step for 3+ frames, then misses the fewest steps, then has the smallest recorder stall over the motion. */
const ff = (args) => { const r = spawnSync(FF, ["-hide_banner", "-loglevel", "error", "-y", ...args], { encoding: "utf8" }); if (r.status) throw new Error(r.stderr.slice(-800)); return r; };
function encode(r, out) {
  const { frames, tStart } = r;
  let keep = frames.filter((f) => f.t >= tStart - 40);
  const before = frames.filter((f) => f.t < tStart - 40);
  if (before.length) keep.unshift({ ...before[before.length - 1], t: tStart });
  if (keep.length < 2) throw new Error("too few frames: " + frames.length);
  const t0 = keep[0].t;
  const dur = (i) => (i < keep.length - 1 ? Math.max(0.001, (keep[i + 1].t - keep[i].t) / 1000) : TAIL / 1000);
  const list = ["ffconcat version 1.0"];
  keep.forEach((f, i) => { list.push(`file '${f.file}'`, `duration ${dur(i).toFixed(4)}`); });
  list.push(`file '${keep[keep.length - 1].file}'`);
  const LIST = path.join(path.dirname(keep[0].file), "list.txt"); fs.writeFileSync(LIST, list.join("\n") + "\n");
  const total = (keep[keep.length - 1].t - t0) / 1000 + TAIL / 1000;
  let crf = 22, size = 0;
  for (let c = 22; c <= 40; c += 3) {
    crf = c;
    ff(["-f", "concat", "-safe", "0", "-i", LIST, "-vf", `fps=30,scale=${WIDTH}:-2:flags=lanczos,format=yuv420p`,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out]);
    size = fs.statSync(out).size;
    if (size <= MAXKB * 1024) break;
  }
  const { tClick, ev, errs, tEnd } = r, o = tClick || tStart, tArriveG = r.tArrive || tStart;
  const clickS = tClick ? (tClick - t0) / 1000 : 0, liftS = ev.lift !== undefined ? (o + ev.lift - t0) / 1000 : undefined;
  const H = Math.round(WIDTH * VH / VW / 2) * 2;
  const meta = { mode: MODE, page: path.relative(R, path.join(L, "pages", DIR, PAGE)), clicked: r.clicked, arrived: r.arrived || undefined, mp4: path.relative(R, OUT), poster: path.relative(R, STEM + ".webp"),
    width: WIDTH, height: H, vp: `${VW}x${VH}`, seconds: +total.toFixed(2), kb: Math.round(size / 1024), crf, frames: keep.length,
    clickAt: tClick ? +clickS.toFixed(2) : undefined, liftAt: liftS !== undefined ? +liftS.toFixed(3) : undefined,
    arriveLiftAt: ev.arriveLift !== undefined ? +((tArriveG - t0 + ev.arriveLift) / 1000).toFixed(3) : undefined,
    delayMs: opt.delay ? num("delay", 0) : undefined,
    timelineMs: ev, recorderStallMs: r.stall, stallsMs: r.stalls, flickerMs: num("flicker", 610), coldMs: num("cold", 410),
    recorded: +((tEnd - tStart) / 1000).toFixed(2), errors: errs.slice(0, 6), classes: r.cls, frameTimesMs: r.ft };
  return { meta, size, total, clickS, liftS, tArriveG, t0 };
}
function judge(json) {   /* the film, read frame by frame */
  const s = spawnSync("python3", [path.join(L, "tools/steps.py"), "--json", json], { encoding: "utf8" });
  try { return JSON.parse(s.stdout.trim().split("\n").pop()); } catch (e) { return { held: 99, missed: 99, maxMs: 9999, frames: [], detail: [s.stderr.slice(-300)] }; }
}
let best = null, tk = 0;
const TAKE = STEM + ".take", BEST = STEM + ".best";
for (tk = 1; tk <= TAKES; tk++) {
  const r = await take();
  const e = encode(r, TAKE + ".mp4");
  fs.writeFileSync(TAKE + ".json", JSON.stringify(e.meta));
  const sc = judge(TAKE + ".json");
  r.film = sc; r.enc = e;
  console.error(`  take ${tk}: FILM held ${sc.held} · missed ${sc.missed} · longest step ${sc.maxMs}ms · stall ${r.stall}ms ${JSON.stringify(r.stalls)} · steps ${sc.frames.join(" | ")} · ${JSON.stringify(r.ev)}`);
  /* a take frozen for 250ms+ while the panel sweeps (in, off) goes last (entering cold, a late first frame is not
     motion: the flicker after it is read step by step); then the fewest steps held or missed, the fewest held,
     the smallest stall, the shortest longest step */
  const frozen = (x) => Math.max(x.stalls.leave || 0, x.stalls.lift || 0, x.stalls.arrivelift || 0) > 250 ? 1 : 0;   /* the panel's sweeps */
  const key = (x) => [frozen(x), x.film.held + x.film.missed, x.film.held, x.stall, x.film.maxMs];
  const better = (x, y) => { const a = key(x), b = key(y); for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] < b[i]; return false; };
  if (!best || better(r, best)) {
    fs.renameSync(TAKE + ".mp4", BEST + ".mp4"); fs.renameSync(TAKE + ".json", BEST + ".json");
    fs.rmSync(FR + "-best", { recursive: true, force: true }); fs.renameSync(FR, FR + "-best"); best = r;
  } else { fs.rmSync(FR, { recursive: true, force: true }); fs.rmSync(TAKE + ".mp4", { force: true }); fs.rmSync(TAKE + ".json", { force: true }); }
  if (sc.held === 0 && sc.missed === 0 && r.stall <= num("good", 75)) break;
}
fs.rmSync(FR, { recursive: true, force: true }); fs.renameSync(FR + "-best", FR);
fs.renameSync(BEST + ".mp4", OUT); fs.rmSync(BEST + ".json", { force: true });
const { meta, size, total, clickS, liftS, tArriveG, t0 } = best.enc; const ev = best.ev;
const P = String(opt.poster || "end");
const at = P === "start" ? 0.05 : P === "end" ? total - 0.1 : P.startsWith("click+") ? clickS + +P.slice(6) / 1000
  : P.startsWith("lift-") && liftS !== undefined ? liftS - +P.slice(5) / 1000
  : P.startsWith("arrivelift-") && ev.arriveLift !== undefined ? (tArriveG - t0 + ev.arriveLift) / 1000 - +P.slice(11) / 1000 : +P / 1000;
const posterAt = Math.max(0.05, Math.min(total - 0.1, at));
ff(["-ss", posterAt.toFixed(3), "-i", OUT, "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", STEM + ".webp"]);
if (opt.sheet && opt.sheet !== true) {
  const a = Math.max(0, clickS - 0.1), cols = 8, n = Math.ceil(Math.min(2.4, total - a) * 10);
  ff(["-ss", a.toFixed(2), "-t", "2.4", "-i", OUT, "-vf", `fps=10,scale=${VW < 1024 ? 160 : 320}:-2,tile=${cols}x${Math.ceil(n / cols)}:padding=3:color=0x777777`, "-frames:v", "1", path.resolve(opt.sheet)]);
}
const out = { ...meta, posterAt: +posterAt.toFixed(2), takes: Math.min(tk, TAKES),
  steps: { held: best.film.held, missed: best.film.missed, longestStepMs: best.film.maxMs, frames: best.film.frames, detail: best.film.detail } };
fs.writeFileSync(STEM + ".json", JSON.stringify(out, null, 1));
if (!opt["keep-frames"]) fs.rmSync(FR, { recursive: true, force: true });
console.log(JSON.stringify({ ...out, classes: undefined, frameTimesMs: undefined }));
if (size > MAXKB * 1024) { console.error(`over budget: ${Math.round(size / 1024)} KB > ${MAXKB} KB even at crf ${meta.crf}`); process.exit(1); }
