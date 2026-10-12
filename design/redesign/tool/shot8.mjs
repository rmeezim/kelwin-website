// Screenshot the round-8 review page (preview8.html) full-page at a width, after scrolling so lazy images load.
//   node tool/shot8.mjs <width> <out.png>
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = +(process.argv[2] || 1440), OUTP = process.argv[3] || "/tmp/r8.png";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((q, s) => { const f = path.join(R, decodeURIComponent(q.url.split("?")[0].split("#")[0])); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: W, height: 900 } });
const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
p.on("requestfailed", (r) => errs.push("FAILED " + r.url()));
p.on("response", (r) => { if (r.status() >= 400) errs.push(r.status() + " " + r.url()); });
await p.goto(`http://127.0.0.1:${server.address().port}/preview8.html`, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 700) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
await p.screenshot({ path: OUTP, fullPage: true });
console.log("height", H, "overflowX", ov, "errors", JSON.stringify(errs.filter((e) => !/fonts\.(googleapis|gstatic)/.test(e)).slice(0, 8)));
await b.close(); server.close();
