// Screenshot the round-9 review page (preview9.html) full-page at a width, after scrolling so lazy images
// load; report horizontal overflow, failed requests and console errors, and the widest offenders.
//   node tool/shot9.mjs <width> <out.png>     (out "-" measures without a screenshot)
//   node tool/shot9.mjs <width> <out.png> --reduced   (prefers-reduced-motion: reduce)
//   node tool/shot9.mjs <width> - --parts <dir>       (one shot per part of the page instead: intro, a cause,
//                                                      the films, rules, projects, lifecycle, a page card, …)
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = +(process.argv[2] || 1440), OUTP = process.argv[3] || "/tmp/r9.png", REDUCED = process.argv.includes("--reduced");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4" };
const server = http.createServer((q, s) => { const f = path.join(R, decodeURIComponent(q.url.split("?")[0].split("#")[0])); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: 900 }, reducedMotion: REDUCED ? "reduce" : "no-preference" });
const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
p.on("requestfailed", (r) => errs.push("FAILED " + r.url()));
p.on("response", (r) => { if (r.status() >= 400) errs.push(r.status() + " " + r.url()); });
await p.goto(`http://127.0.0.1:${server.address().port}/preview9.html`, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 700) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
// the filmstrips scroll sideways, so their lazy frames may not have started: load them all before the shot
await p.evaluate(() => Promise.all([...document.images].map((im) => { im.loading = "eager"; return im.complete ? 0 : new Promise((ok) => { im.onload = im.onerror = ok; setTimeout(ok, 4000); }); })));
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
const ov = await p.evaluate(() => {
  const vw = document.documentElement.clientWidth, out = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > vw + 1 && !el.closest(".strip, .stage")) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} right ${Math.round(r.right)}`);
  }
  return { x: document.documentElement.scrollWidth - innerWidth, offenders: out.slice(0, 6) };
});
// legibility: any visible text node under 13.5px, and any word set in the mono face
const type = await p.evaluate(() => {
  const small = new Map(), mono = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const txt = n.data.trim(); if (!txt) continue;
    const el = n.parentElement; if (!el || el.closest("script,style,pre,[hidden]")) continue;
    const cs = getComputedStyle(el); if (cs.display === "none" || cs.visibility === "hidden") continue;
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
  const parts = [["bar", ".bar"], ["intro", ".intro"], ["asks", "#asks"], ["todo", ".todo-do"], ["cause", ".cause"], ["films", "#films"],
    ["motion-decide", "#motion-decide"], ["rules6", "#rules6"], ["brief", "#brief"], ["offer", ".offer"], ["cards", "#proj-cards"],
    ["held", "#proj-held"], ["place", "#place"], ["spine", "#spine"], ["opts", "#opts"], ["cadence", "#cadence"], ["page", "article.pg"],
    ["page-pending", "#p-projects"], ["question", "article.qq:not(.see)"], ["legal", "#q-legal"], ["summary", ".summary"]];
  for (const [name, sel] of parts) {
    const el = p.locator(sel).first();
    if (await el.count()) await el.screenshot({ path: path.join(dir, `${W}-${name}.png`) }).catch((e) => console.error(name, e.message.slice(0, 80)));
  }
}
console.log(JSON.stringify({ width: W, height: H, overflowX: ov.x, offenders: ov.offenders, small: type.small, monoWords: type.monoWords,
  errors: errs.filter((e) => !/fonts\.(googleapis|gstatic)/.test(e)).slice(0, 8) }));
await b.close(); server.close();
