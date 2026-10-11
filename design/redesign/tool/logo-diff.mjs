import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 840, height: 276 } });
await p.goto("http://localhost:8321/logo-check.html"); await p.waitForTimeout(400);
await p.screenshot({ path: process.argv[2] }); await b.close();
