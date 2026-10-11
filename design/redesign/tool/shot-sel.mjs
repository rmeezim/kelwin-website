import { chromium } from "playwright";
const [url, out] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(1500);
await p.screenshot({ path: out + "/sel-a.png" });
await p.evaluate(() => document.querySelector("#s-hero").scrollIntoView()); await p.waitForTimeout(800);
await p.screenshot({ path: out + "/sel-b.png" });
await b.close();
