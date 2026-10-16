// One screen of the round-10 review page (preview10.html) at each width, at the top and at a few sections.
//   node tool/peek10.mjs            -> qa/r10/review/peek-<width>-<where>.png
import fs from "node:fs"; import path from "node:path"; import http from "node:http"; import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4", ".json": "application/json" };
const server = http.createServer((q, s) => { const f = path.join(R, decodeURIComponent(q.url.split("?")[0].split("#")[0])); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
fs.mkdirSync(`${R}/qa/r10/review`, { recursive: true });
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [834, 1112], [390, 844]]) {
  for (const sel of [null, "#sitemap", "#business", "#artifacts", "#voice", "#next", "#questions", "#summary"]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(`http://127.0.0.1:${server.address().port}/preview10.html`, { waitUntil: "load" }); await p.waitForTimeout(800);
    if (sel) await p.evaluate((s) => { document.documentElement.style.scrollBehavior = "auto"; document.querySelector(s)?.scrollIntoView(); }, sel), await p.waitForTimeout(500);
    await p.screenshot({ path: `${R}/qa/r10/review/peek-${w}-${(sel || "top").replace("#", "")}.png` }); await p.close();
  }
}
await b.close(); server.close();
