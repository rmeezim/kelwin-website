// Render the stitched homepage (site/home.html) over http, scroll it so every section plays,
// then save a full-page capture split into strips: site/home-1.png, home-2.png, …  (720px wide)
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "site");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const fp = path.join(SITE, decodeURIComponent(req.url.split("?")[0].split("#")[0]).replace(/^\/+/, ""));
  if (!fp.startsWith(SITE) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(fp)] || "application/octet-stream" }); fs.createReadStream(fp).pipe(res);
});
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
const FILE = process.argv[2] || "home.html";
await p.goto(`http://127.0.0.1:${server.address().port}/${FILE}`, { waitUntil: "load" });
await p.waitForTimeout(1200);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 450) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(260); }
await p.waitForTimeout(6000);
const info = await p.evaluate(() => ({ played: document.querySelectorAll(".km-slot.is-play").length, slots: document.querySelectorAll(".km-slot").length, h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth }));
const full = path.join(SITE, FILE.replace(/\.html$/, "") + "-full.png");
await p.screenshot({ path: full, fullPage: true });
await b.close(); server.close();
console.log(JSON.stringify({ ...info, errors: errs.slice(0, 5) }));
