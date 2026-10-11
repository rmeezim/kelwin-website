// Crawl every internal page of the static export from the homepage; report status, console errors and failed requests per page.
import { chromium } from "playwright";
const BASE = "http://127.0.0.1:4100/kelwin-website/"; const W = +(process.argv[2] || 1440);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const seen = new Set(), queue = [BASE], rows = [];
while (queue.length) {
  const url = queue.shift(); if (seen.has(url)) continue; seen.add(url);
  const ctx = await b.newContext({ viewport: { width: W, height: 900 } }); const p = await ctx.newPage();
  const errs = [], failed = [];
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 140)); }); p.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));
  p.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("_rsc")) failed.push(`${r.status()} ${r.url().replace(BASE, "")}`); });
  const res = await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(700);
  const links = await p.evaluate(() => Array.from(document.querySelectorAll("a[href]")).map((a) => a.href));
  for (const l of links) { const u = l.split("#")[0].split("?")[0]; if (u.startsWith("http://127.0.0.1:4100/kelwin-website/") && !seen.has(u)) queue.push(u); if (l.startsWith("http://127.0.0.1:4100/") && !l.startsWith("http://127.0.0.1:4100/kelwin-website")) failed.push("OUTSIDE BASEPATH " + l); }
  const sw = await p.evaluate(() => document.documentElement.scrollWidth); const mains = await p.evaluate(() => document.querySelectorAll("main").length); const h1 = await p.evaluate(() => document.querySelectorAll("h1").length);
  rows.push(`${res.status()} ${url.replace(BASE, "/")} · main×${mains} h1×${h1} · scrollW ${sw}${sw > W ? " OVERFLOW" : ""}${errs.length ? " · ERR " + JSON.stringify(errs) : ""}${failed.length ? " · FAIL " + JSON.stringify([...new Set(failed)]) : ""}`);
  await ctx.close();
}
console.log(rows.join("\n")); await b.close();
