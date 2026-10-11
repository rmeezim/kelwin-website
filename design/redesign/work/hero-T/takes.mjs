// capture each take of the feed: node takes.mjs [page] [msIntoTake] [outPrefix]
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { chromium } from "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/redesign/tool/node_modules/playwright/index.mjs";
const SITE = "/tmp/claude-0/-home-user-kelwin-website/a6575ec0-0f5a-5d4f-8079-2ba4f8c9a40d/scratchpad/redesign/site";
const OUT = path.dirname(new URL(import.meta.url).pathname);
const [file = "m-hero-T.html", into = "3000", pre = "take"] = process.argv.slice(2);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = http.createServer((q, s) => { const f = path.join(SITE, decodeURIComponent(q.url.split("?")[0].split("#")[0])); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1440, height: 960 } });
await p.goto(`http://127.0.0.1:${server.address().port}/${file}`, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2600);
for (const i of [0, 1, 2]) {
  await p.click(`.km-hero-T__ch[data-ch="${i}"]`);
  await p.mouse.move(1300, 100);
  await p.waitForTimeout(+into);
  const el = await p.$(".km-hero-T__feed");
  await el.screenshot({ path: path.join(OUT, `${pre}-${i + 1}.png`) });
}
await b.close(); server.close();
