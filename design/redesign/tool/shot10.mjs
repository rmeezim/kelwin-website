// Screenshot the round-10 review page (preview10.html) full-page at a width; report horizontal overflow,
// failed requests, console errors, text under 13.5px and words set in the mono face.
//   node tool/shot10.mjs <width> <out.png>            (out "-" measures without a screenshot)
//   node tool/shot10.mjs <width> - --parts <dir>      (one shot per part of the page instead)
//   node tool/shot10.mjs <width> - --doc <file.html>  (measure one of the reading pages in out10/ instead)
//   add --open to open every fold and card first (the worst case for overflow)
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = +(process.argv[2] || 1440), OUTP = process.argv[3] || "-";
const DI = process.argv.indexOf("--doc"), DOC = DI > 0 ? process.argv[DI + 1] : null, OPEN = process.argv.includes("--open");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4" };
const server = http.createServer((q, s) => { const f = path.join(R, decodeURIComponent(q.url.split("?")[0].split("#")[0])); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 900 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
p.on("requestfailed", (r) => { if (!/\.mp4/.test(r.url())) errs.push("FAILED " + r.url()); });
p.on("response", (r) => { if (r.status() >= 400) errs.push(r.status() + " " + r.url()); });
await p.goto(`http://127.0.0.1:${server.address().port}/${DOC ? "out10/" + DOC : "preview10.html"}`, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
if (OPEN) await p.evaluate(() => document.querySelectorAll("details").forEach((d) => { d.open = true; }));
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 900) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
const ov = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth, out = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > vw + 1 && !el.closest(".tbl-wrap, pre, details:not([open])")) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} right ${Math.round(r.right)}`);
  }
  return { x: document.documentElement.scrollWidth - innerWidth, offenders: out.slice(0, 8) };
});
const type = await p.evaluate(() => {
  const small = new Map(), mono = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const txt = n.data.trim(); if (!txt) continue;
    const el = n.parentElement; if (!el || el.closest("script,style,[hidden],.sr")) continue;
    const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
    if (!el.getClientRects().length) continue;
    const fs = parseFloat(cs.fontSize);
    if (fs < 13.5) small.set(`${fs}px ${el.tagName.toLowerCase()}.${el.className}`, txt.slice(0, 40));
    if (/JetBrains/.test(cs.fontFamily.split(",")[0]) && /[A-Za-z]{2,}/.test(txt)) mono.set(`${el.tagName.toLowerCase()}.${el.className}`, txt.slice(0, 40));
  }
  return { small: [...small].slice(0, 8), monoWords: [...mono].slice(0, 8) };
});
if (OUTP !== "-") await p.screenshot({ path: OUTP, fullPage: true });
const PI = process.argv.indexOf("--parts");
if (PI > 0) {
  const dir = path.resolve(process.argv[PI + 1]); fs.mkdirSync(dir, { recursive: true });
  const parts = [["bar", ".bar"], ["intro", ".intro"], ["done", ".done-do"], ["sm-head", "#sm-short"], ["sm-map", "#sm-map"], ["sm-approve", "#sm-approve"], ["sm-card", "#sm-tree details"],
    ["sm-menu", "#sm-menu"], ["sm-leads", "#sm-leads"], ["sm-later", "#sm-launch"], ["bm-answer", ".answer"], ["bm-levers", "#bm-levers-part"], ["bm-worked", "#bm-worked"],
    ["bm-pkgs", "#bm-packages-part"], ["bm-pilot", "#bm-pilot-part"], ["bm-exit", "#bm-exit-part"], ["bm-proj", "#bm-projects-part"], ["bm-show", "#bm-show"], ["bm-life", "#bm-life"],
    ["art-1", "article.art"], ["art-map", "#art-map-card"], ["art-dec", "#art-dec"], ["art-early", "#art-early"], ["turn", "#turn"],
    ["vo-six", ".six"], ["vo-rw", ".rws"], ["vo-ns", "#vo-ns-part"], ["vo-home", "#vo-home"], ["next", "#next"], ["questions", "#questions"], ["summary", "#summary"]];
  for (const [name, sel] of parts) {
    const el = p.locator(sel).first();
    if (await el.count()) await el.screenshot({ path: path.join(dir, `${W}-${name}.png`) }).catch((e) => console.error(name, e.message.slice(0, 80)));
  }
}
console.log(JSON.stringify({ width: W, page: DOC || "review", height: H, overflowX: ov.x, offenders: ov.offenders, small: type.small, monoWords: type.monoWords,
  errors: errs.filter((e) => !/fonts\.(googleapis|gstatic)/.test(e)).slice(0, 8) }));
await b.close(); server.close();
