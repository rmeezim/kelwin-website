// Production porting check: shoot a v5 section from the running Next dev server (port 3100) at several
// widths, lint it, and optionally shoot the approved mockup beside it at 1440 for a pixel comparison.
//   node tool/prodshot.mjs <section> [--widths 1440,1024,768,390] [--wait ms] [--reduced] [--mock] [--path /preview/x/]
// Writes R/prod/<section>/<section>-<w>[-reduced].png (+ mock-1440[-reduced].png with --mock) and prints a lint report.
// Sections: hero reframe evidence letter system principle handover method fit cta footer (or --path for any route).
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."); const SITE = path.join(R, "site");
const SLOTS = { hero: "T", reframe: "U", evidence: "T", letter: "S", system: "T", principle: "S", handover: "U", method: "U", fit: "U", cta: "U", footer: "U", faq: "U" };
const args = process.argv.slice(2); const sec = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const widths = opt("--widths", "1440,1024,768,390").split(",").map(Number);
const reduced = args.includes("--reduced"); const mock = args.includes("--mock");
const slot = SLOTS[sec];
let wait = +opt("--wait", 0);
if (!wait) { try { wait = Math.min(16000, Math.max(2500, JSON.parse(fs.readFileSync(path.join(SITE, "frag", sec, `${slot}.meta.json`))).demoMs || 4000)); } catch { wait = 4000; } }
if (reduced) wait = 1200;
const route = opt("--path", `/preview/${sec}/`);
const OUT = path.join(R, "prod", sec); fs.mkdirSync(OUT, { recursive: true });
const tag = reduced ? "-reduced" : "";

const LINT = () => {
  const ALLOWED = ["mona", "jetbrains", "instrument", "inter"];
  const stage = document.querySelector("main") || document.body; const W = window.innerWidth;
  const r = { badFont: [], italic: [], tiny: [], smallProse: [], radius: [], overflow: [], raster: [], gradient: [] };
  const label = (el) => (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : el.tagName.toLowerCase()) + " «" + (el.textContent || "").trim().slice(0, 40) + "»";
  for (const el of stage.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const rect = el.getBoundingClientRect();
    const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
    const fs = parseFloat(cs.fontSize);
    if (own.length > 1 && rect.width > 0) {
      if (!ALLOWED.some((a) => fam.includes(a))) r.badFont.push(`${label(el)} → ${cs.fontFamily.slice(0, 40)}`);
      if (cs.fontStyle === "italic") r.italic.push(label(el));
      if (fs < 11) r.tiny.push(`${label(el)} ${fs}px`);
      if (!fam.includes("jetbrains") && fs < 13.5 && own.length > 40) r.smallProse.push(`${label(el)} ${fs}px`);
    }
    const rad = Math.max(...["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].map((k) => parseFloat(cs[k]) || 0));
    if (rad > 0 && (rect.width > 24 || rect.height > 24)) r.radius.push(`${label(el)} r=${cs.borderTopLeftRadius}`);
    if (rect.width > 0 && rect.right > W + 1 && cs.position !== "fixed") {
      let clipped = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const ac = getComputedStyle(a); if (/(hidden|clip)/.test(ac.overflowX + ac.overflow) && a.getBoundingClientRect().right <= W + 1) { clipped = true; break; } }
      if (!clipped) r.overflow.push(`${label(el)} right=${Math.round(rect.right)}`);
    }
    const inFilm = !!el.closest(".km-film");
    if (!inFilm && /^(IMG|PICTURE|VIDEO)$/.test(el.tagName)) r.raster.push(label(el));
    const bi = cs.backgroundImage || "";
    if (!inFilm && /url\(/.test(bi) && !/svg/.test(bi)) r.raster.push(label(el) + " bg url()");
    if (!inFilm && /gradient\(/.test(bi)) r.gradient.push(label(el));
  }
  r.scrollW = document.documentElement.scrollWidth; r.W = W; r.height = Math.ceil(stage.getBoundingClientRect().height);
  r.fonts = Array.from(new Set(Array.from(document.fonts).filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, ""))));
  r.played = Array.from(document.querySelectorAll(".km-slot")).map((s) => `${s.id}:${s.classList.contains("is-play") ? "play" : s.dataset.played ? "reduced" : "waiting"}`);
  for (const k of Object.keys(r)) if (Array.isArray(r[k]) && r[k].length > 10) r[k] = r[k].slice(0, 10).concat([`… +${r[k].length - 10} more`]);
  return r;
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const report = {};
async function shoot(url, w, file, scrollPlay) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage(); const errors = [];
  page.on("console", (m) => { if (m.type() === "error" && !/webpack-hmr|WebSocket/.test(m.text())) errors.push(m.text().slice(0, 220)); });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 220)));
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  if (scrollPlay) { // bring every slot into view once so each plays, then return to the top
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  await page.waitForTimeout(wait);
  await page.screenshot({ path: file, fullPage: true });
  const lint = scrollPlay ? await page.evaluate(LINT) : null;
  await ctx.close();
  return { errors, lint };
}
for (const w of widths) {
  const res = await shoot(`http://localhost:3100${route}`, w, path.join(OUT, `${sec}-${w}${tag}.png`), true);
  report[w] = { ...res.lint, consoleErrors: res.errors };
}
if (mock && slot) {
  const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2" };
  const server = http.createServer((q, s) => { const fp = path.join(SITE, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "")); if (!fp.startsWith(SITE) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": TYPES[path.extname(fp)] || "application/octet-stream" }); fs.createReadStream(fp).pipe(s); });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  const r = await shoot(`http://127.0.0.1:${server.address().port}/m-${sec}-${slot}.html`, 1440, path.join(OUT, `mock-1440${tag}.png`), false);
  report.mock = { file: path.join(OUT, `mock-1440${tag}.png`), consoleErrors: r.errors };
  server.close();
}
await browser.close();
for (const [w, r] of Object.entries(report)) {
  if (w === "mock") { console.log(`mock 1440 → ${r.file}${r.consoleErrors.length ? " errors " + JSON.stringify(r.consoleErrors) : ""}`); continue; }
  const bad = Object.entries(r).filter(([k, v]) => Array.isArray(v) && v.length && !["fonts", "played"].includes(k));
  console.log(`${w}px → ${path.join(OUT, `${sec}-${w}${tag}.png`)} · height ${r.height} · scrollW ${r.scrollW}${r.scrollW > r.W ? " (OVERFLOW)" : ""} · fonts ${r.fonts.join("/")} · ${r.played.join(" ")}`);
  for (const [k, v] of bad) console.log(`   ${k}: ${JSON.stringify(v)}`);
}
