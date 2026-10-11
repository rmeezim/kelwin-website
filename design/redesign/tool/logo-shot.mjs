import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 860, height: 240 } });
await p.goto(process.argv[2]); await p.waitForTimeout(300);
await p.screenshot({ path: process.argv[3] }); await b.close();
