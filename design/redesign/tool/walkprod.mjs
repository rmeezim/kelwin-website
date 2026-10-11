// Walk a built (static export) page like a visitor and capture each viewport; report console errors and failed requests.
//   node tool/walkprod.mjs <url> <name> [width=1440] [step=900] [wait=1400] [--reduced]
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [url, name, W = "1440", STEP = "900", WAIT = "1400"] = process.argv.slice(2); const reduced = process.argv.includes("--reduced");
const dir = path.join(R, "prod", "walk", name); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({ viewport: { width: +W, height: +(process.env.VH || 900) }, reducedMotion: reduced ? "reduce" : "no-preference" });
const p = await ctx.newPage(); const errs = [], failed = [];
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 200)); }); p.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
p.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); }); p.on("requestfailed", (q) => failed.push(`FAILED ${q.url()}`));
await p.goto(url, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(+WAIT + 800);
const H = await p.evaluate(() => document.documentElement.scrollHeight); let y = 0, n = 0;
while (true) {
  await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(+WAIT);
  const at = await p.evaluate(() => Array.from(document.querySelectorAll(".km-slot")).filter((s) => { const r = s.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }).map((s) => s.id.replace("s-", "") + (s.classList.contains("is-play") ? "" : s.dataset.played ? "" : "(waiting)")).join(","));
  n++; await p.screenshot({ path: path.join(dir, `${String(n).padStart(2, "0")}.png`) }); console.log(String(n).padStart(2, "0"), "y=" + y, at);
  if (y + 900 >= H) break; y = Math.min(y + +STEP, H - 900);
}
const sw = await p.evaluate(() => document.documentElement.scrollWidth);
console.log(`height ${H} · scrollW ${sw}/${W} · errors ${JSON.stringify(errs)} · failed ${JSON.stringify(failed)}`);
await b.close();
