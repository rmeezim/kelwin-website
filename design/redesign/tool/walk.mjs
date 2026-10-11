// Walk a stitched homepage like a visitor: scroll one viewport at a time, let each entrance play,
// capture the viewport. Writes site/walk/<name>-NN.png and prints console errors.
//   node tool/walk.mjs [home-s.html] [step=820] [wait=1700]
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "site");
const FILE = process.argv[2] || "home-s.html", STEP = +(process.argv[3] || 820), WAIT = +(process.argv[4] || 1700);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((q, s) => { const f = path.join(SITE, decodeURIComponent(q.url.split("?")[0].split("#")[0])); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await p.goto(`http://127.0.0.1:${server.address().port}/${FILE}`, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(WAIT + 1200);
const name = FILE.replace(".html", ""), dir = path.join(SITE, "walk"); fs.mkdirSync(dir, { recursive: true });
for (const f of fs.readdirSync(dir)) if (f.startsWith(name + "-")) fs.unlinkSync(path.join(dir, f));
const H = await p.evaluate(() => document.documentElement.scrollHeight);
let y = 0, n = 0;
while (true) {
  await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(WAIT);
  const at = await p.evaluate(() => { const r = []; document.querySelectorAll(".km-slot").forEach((s) => { const b = s.getBoundingClientRect(); if (b.bottom > 0 && b.top < innerHeight) r.push(s.id.replace("s-", "")); }); return r.join(","); });
  n++; await p.screenshot({ path: path.join(dir, `${name}-${String(n).padStart(2, "0")}.png`) });
  console.log(String(n).padStart(2, "0"), "y=" + y, at);
  if (y + 900 >= H) break; y = Math.min(y + STEP, H - 900);
}
console.log("height", H, "errors", JSON.stringify(errs.slice(0, 6)));
await b.close(); server.close();
