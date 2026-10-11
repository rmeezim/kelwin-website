// Kelwin mockup harness.
//   node tool/mk.mjs <section> <A|B|C|all> [--no-shot]
// Builds site/m-<sec>-<opt>.html from site/frag/<sec>/<opt>.{html,css,js}
// (+ <opt>.meta.json), renders it at 1440px in Chromium, writes
// site/shots/<sec>-<opt>.png (final frame, full height),
// site/shots/<sec>-<opt>-mid.png (first viewport ~550ms into the
// entrance), and site/shots/<sec>-<opt>.json (lint report).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import http from "node:http";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const [sec, which = "all", ...flags] = process.argv.slice(2);
if (!sec) { console.error("usage: node tool/mk.mjs <section> <A|B|C|all>"); process.exit(2); }
const opts = which === "all" ? ["A", "B", "C"] : which === "r2" ? ["X", "Y", "Z"] : which === "r3" ? ["S", "T"].filter((o) => fs.existsSync(path.join(SITE, "frag", sec, o + ".html"))) : [which];
const FONTS = "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
const base = fs.readFileSync(path.join(SITE, "base.css"), "utf8");
const kitPath = path.join(SITE, "kit-ac.css");

function read(p) { return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : ""; }

function build(opt) {
  const dir = path.join(SITE, "frag", sec);
  const html = read(path.join(dir, `${opt}.html`));
  if (!html.trim()) return null;
  const css = read(path.join(dir, `${opt}.css`));
  const js = read(path.join(dir, `${opt}.js`));
  let meta = {};
  try { meta = JSON.parse(read(path.join(dir, `${opt}.meta.json`)) || "{}"); } catch (e) { console.log(`  ! ${opt}.meta.json is not valid JSON: ${e.message}`); }
  const id = `${sec}-${opt}`;
  const page = `<!doctype html>
<html lang="en" data-skin="swiss"><head><meta charset="utf-8">
<script>(function(){var d=document.documentElement;if(/kelwin/.test(location.hash))d.setAttribute("data-skin","kelwin");addEventListener("message",function(e){var m=e.data||{};if(m.km==="skin"&&(m.skin==="swiss"||m.skin==="kelwin"))d.setAttribute("data-skin",m.skin);});})();</script>
<meta name="viewport" content="width=1440">
<link rel="icon" href="data:,">
<title>Kelwin · ${sec} · ${opt}</title>
<style>
${base}
/* ── kit: blended A×C system ── */
${fs.existsSync(kitPath) ? fs.readFileSync(kitPath, "utf8") : ""}
/* ── fragment: ${id} ── */
${css}
</style></head>
<body><div class="km-stage" data-km="${id}">
${html}
</div>
${/\bgsap\b|ScrollTrigger/.test(js) ? '<script src="lib/gsap.min.js"></script><script src="lib/ScrollTrigger.min.js"></script>' : ""}
<script>
${js}
</script>
<script>
(function(){
  var ID = ${JSON.stringify(id)};
  var rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function report(){ try { var h = Math.ceil(document.querySelector(".km-stage").getBoundingClientRect().height); if (parent && parent !== window) parent.postMessage({ km: "height", id: ID, h: h }, "*"); } catch (e) {} }
  function go(){
    if (!rm) document.documentElement.classList.add("is-play");
    try { if (window.KM && typeof window.KM.init === "function") window.KM.init(document.querySelector(".km-stage > *"), { reduced: rm }); } catch (e) { console.error(e); }
    report(); setTimeout(report, 600); setTimeout(report, 2500);
  }
  var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  ready.then(function(){ setTimeout(go, 180); });
  window.addEventListener("resize", report);
  window.addEventListener("message", function(e){ var d = e.data || {}; if (d.km === "replay") location.reload(); if (d.km === "skin" && (d.skin === "swiss" || d.skin === "kelwin")) { document.documentElement.setAttribute("data-skin", d.skin); report(); } });
})();
</script>
</body></html>`;
  const out = path.join(SITE, `m-${id}.html`);
  fs.writeFileSync(out, page);
  return { out, meta, id };
}

const LINT = (strict) => {
  const ALLOWED = ["mona sans", "instrument sans", "inter", "jetbrains mono"];
  const stage = document.querySelector(".km-stage");
  const W = 1440;
  const r = { badFont: [], italic: [], tiny: [], smallProse: [], wideMono: [], radius: [], overflow: [], redFills: 0, brokenImg: [], raster: [], gradient: [] };
  const isRed = (c) => { const m = c && c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/); if (!m) return false; const [R, G, B, A] = [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]]; return A > 0.5 && R > 150 && R - G > 80 && R - B > 80; };
  const label = (el) => (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : el.tagName.toLowerCase()) + " «" + (el.textContent || "").trim().slice(0, 40) + "»";
  for (const el of stage.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const rect = el.getBoundingClientRect();
    const own = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(" ").trim();
    const hasText = own.length > 1;
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
    const fs = parseFloat(cs.fontSize);
    if (hasText) {
      if (!ALLOWED.includes(fam)) r.badFont.push(`${label(el)} → ${cs.fontFamily.slice(0, 40)}`);
      if (cs.fontStyle === "italic") r.italic.push(label(el));
      if (fs < (strict ? 11 : 10)) r.tiny.push(`${label(el)} ${fs}px`);
      if (fam !== "jetbrains mono" && fs < 13.5 && own.length > 40) r.smallProse.push(`${label(el)} ${fs}px`);
      const ls = parseFloat(cs.letterSpacing) || 0;
      if (fam === "jetbrains mono" && fs < 10.5 && own.length > 24 && ls / fs > 0.2) r.wideMono.push(`${label(el)} ${fs}px ls=${(ls / fs).toFixed(2)}em`);
    }
    const rad = Math.max(...["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].map((k) => parseFloat(cs[k]) || 0));
    if (rad > 0 && (rect.width > 24 || rect.height > 24)) r.radius.push(`${label(el)} r=${cs.borderTopLeftRadius} ${Math.round(rect.width)}×${Math.round(rect.height)}`);
    if (rect.width > 0 && rect.right > W + 1 && cs.position !== "fixed") {
      let clipped = false;
      for (let a = el.parentElement; a && a !== stage; a = a.parentElement) {
        const ac = getComputedStyle(a);
        if (/(hidden|clip)/.test(ac.overflowX + ac.overflow) && a.getBoundingClientRect().right <= W + 1) { clipped = true; break; }
      }
      if (!clipped) r.overflow.push(`${label(el)} right=${Math.round(rect.right)}`);
    }
    if (rect.width * rect.height > 400 && isRed(cs.backgroundColor)) r.redFills++;
    const inFilm = !!el.closest(".km-film");
    if (!inFilm && (el.tagName === "IMG" || el.tagName === "PICTURE" || el.tagName === "VIDEO")) r.raster.push(label(el));
    const bi = cs.backgroundImage || "";
    if (!inFilm && /url\(/.test(bi) && !/data:image\/svg/.test(bi) && !/\.svg/.test(bi)) r.raster.push(label(el) + " background url()");
    if (!inFilm && /gradient\(/.test(bi)) r.gradient.push(label(el));
  }
  r.markUses = stage.querySelectorAll(".km-logo-mark").length;
  r.height = Math.ceil(stage.getBoundingClientRect().height);
  const root = stage.firstElementChild; r.surface = root ? root.getAttribute("data-surface") : null;
  r.scrollW = document.documentElement.scrollWidth;
  const loaded = new Set(Array.from(document.fonts).filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")));
  r.fonts = { mona: loaded.has("Mona Sans"), instrument: loaded.has("Instrument Sans"), inter: loaded.has("Inter"), mono: loaded.has("JetBrains Mono") };
  for (const k of Object.keys(r)) if (Array.isArray(r[k]) && r[k].length > 12) r[k] = r[k].slice(0, 12).concat([`… +${r[k].length - 12} more`]);
  return r;
};

const builds = opts.map(build).filter(Boolean);
if (!builds.length) { console.log(`no fragments found for ${sec} (${opts.join(",")})`); process.exit(1); }
if (flags.includes("--no-shot")) { builds.forEach((b) => console.log("built", b.out)); process.exit(0); }

// serve SITE over http (masks, fetch and fonts behave as in production; file:// blocks CSS masks)
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split("?")[0].split("#")[0]).replace(/^\/+/, "");
  const fp = path.join(SITE, rel);
  if (!fp.startsWith(SITE) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(fp)] || "application/octet-stream" });
  fs.createReadStream(fp).pipe(res);
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let anyFail = false;
for (const b of builds) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const failed = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
  page.on("requestfailed", (q) => { const u = q.url(); if (!u.includes("fonts.g")) failed.push(u.split("/").slice(-2).join("/")); });
  await page.goto(`${ORIGIN}/${path.basename(b.out)}`, { waitUntil: "load" });
  await page.waitForFunction(() => document.documentElement.classList.contains("is-play"), null, { timeout: 8000 }).catch(() => errors.push("is-play never set (fonts.ready hung?)"));
  await page.waitForTimeout(550);
  await page.screenshot({ path: path.join(SITE, "shots", `${b.id}-mid.png`) });
  const demo = Math.min(Math.max(+(b.meta.demoMs || 3200), 1200), 16000);
  await page.waitForTimeout(demo);
  const strict = /^[S-Z]$/.test(b.id.split("-").pop());
  const lint = await page.evaluate(LINT, strict);
  await page.evaluate(() => document.documentElement.setAttribute("data-skin", "kelwin"));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  const lintK = await page.evaluate(LINT, strict);
  const stageK = await page.$(".km-stage");
  await stageK.screenshot({ path: path.join(SITE, "shots", `${b.id}.k.png`) });
  await page.evaluate(() => document.documentElement.setAttribute("data-skin", "swiss"));
  await page.waitForTimeout(250);
  lint.consoleErrors = errors;
  lint.failedRequests = failed;
  const stage = await page.$(".km-stage");
  await stage.screenshot({ path: path.join(SITE, "shots", `${b.id}.png`) });
  lint.kelwin = { overflow: lintK.overflow, tiny: lintK.tiny, height: lintK.height, fonts: lintK.fonts };
  fs.writeFileSync(path.join(SITE, "shots", `${b.id}.json`), JSON.stringify(lint, null, 1));
  const fails = [];
  const warns = [];
  if (lint.badFont.length) fails.push(`non-brand font ×${lint.badFont.length}`);
  if (lint.italic.length) fails.push(`italic ×${lint.italic.length}`);
  if (lint.tiny.length) fails.push(`text <${strict ? 11 : 10}px ×${lint.tiny.length}: ${lint.tiny.slice(0, 3).join("; ")}`);
  if (strict && lint.markUses && sec !== "footer") fails.push(`logo mark used as decoration ×${lint.markUses} — round 2 retires the mark outside the lockup and footer`);
  if (lint.overflow.length || lint.scrollW > 1440) fails.push(`horizontal overflow (scrollW ${lint.scrollW})`);
  if (lint.brokenImg.length || failed.length) fails.push(`broken assets: ${[...lint.brokenImg, ...failed].join(", ")}`);
  if (errors.length) fails.push(`script errors ×${errors.length}`);
  if (!lint.fonts.mona) fails.push(`Mona Sans not loaded ${JSON.stringify(lint.fonts)}`);
  if (lint.raster.length) fails.push(`photos / raster images outside the hero film ×${lint.raster.length}: ${lint.raster.slice(0, 3).join("; ")}`);
  if (lint.gradient.length) fails.push(`gradients ×${lint.gradient.length} — flat colour only outside .km-film (use SVG for patterns): ${lint.gradient.slice(0, 3).join("; ")}`);
  if (!["dark", "light", "red"].includes(lint.surface)) fails.push(`section root needs data-surface="dark|light|red" (got ${lint.surface})`);
  if (lintK.overflow.length) fails.push(`kelwin skin overflows ×${lintK.overflow.length}`);
  if (lintK.tiny.length) fails.push(`kelwin skin text <10px ×${lintK.tiny.length}`);
  if (lint.radius.length) warns.push(`rounded elements ×${lint.radius.length} (sharp corners only; tiny dots/rings excepted)`);
  if (lint.smallProse.length) warns.push(`prose <13.5px ×${lint.smallProse.length}`);
  if (lint.wideMono.length) warns.push(`small mono with wide tracking ×${lint.wideMono.length}`);
  if (lint.redFills > 3) warns.push(`${lint.redFills} red-filled blocks — one red moment per viewport`);
  if (lint.height > 1500) warns.push(`stage is ${lint.height}px tall — crop to a representative ≤1400px`);
  anyFail ||= fails.length > 0;
  console.log(`${b.id}: ${fails.length ? "FAIL" : "PASS"}  h=${lint.height}px${fails.length ? "\n  ✗ " + fails.join("\n  ✗ ") : ""}${warns.length ? "\n  ⚠ " + warns.join("\n  ⚠ ") : ""}\n  shots: site/shots/${b.id}.png (swiss, final) · ${b.id}-mid.png (swiss, entrance) · ${b.id}.k.png (kelwin skin) · lint: site/shots/${b.id}.json`);
  await page.close();
}
await browser.close();
server.close();
process.exit(anyFail ? 1 : 0);
