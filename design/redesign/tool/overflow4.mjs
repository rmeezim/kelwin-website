import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { chromium } from "playwright";
const ROOT = process.argv[2];
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((q, s) => { let p = decodeURIComponent(q.url.split("?")[0].split("#")[0]); const f = path.join(ROOT, p); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(`http://127.0.0.1:${server.address().port}/preview4.html`, { waitUntil: "load" }); await p.waitForTimeout(1500);
const r = await p.evaluate(() => { const out = []; document.querySelectorAll("body *").forEach((el) => { const b = el.getBoundingClientRect(); if (b.right > 1445 && el.offsetParent !== null) out.push(el.tagName + "." + (el.className && el.className.baseVal === undefined ? el.className : "") + " w=" + Math.round(b.width) + " r=" + Math.round(b.right)); }); return [document.documentElement.scrollWidth, out.slice(0, 12)]; });
console.log(JSON.stringify(r, null, 1)); await b.close(); server.close();
