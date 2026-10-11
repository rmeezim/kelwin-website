// Capture today's live-site sections (reduced motion = settled final states), max 1400px tall.
import { chromium } from "playwright";
import path from "node:path";
const OUT = process.argv[2];
const BASE = "http://localhost:8317/kelwin-website";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await p.goto(BASE + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
const H = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < H; y += 360) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(40); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
const MAP = { hero: "#hero", reframe: ".reframe-pin-wrap", evidence: "#evidence", stack: "#revenue-os", architecture: "#architecture", statechange: "#state-change", principle: "#principle-band", method: "#methodology", fit: "#fit", assets: "#assets", beforeafter: "#transformation", faq: "#faq", cta: ".fcta", footer: ".site-footer" };
async function shot(name, sel) {
  const el = await p.$(sel);
  if (!el) { console.log("missing", name, sel); return; }
  await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(250);
  const box = await el.boundingBox();
  const docY = await p.evaluate(() => window.scrollY);
  const clip = { x: 0, y: box.y + docY, width: 1440, height: Math.min(box.height, 1400) };
  await p.screenshot({ path: path.join(OUT, name + ".png"), clip, fullPage: true });
  console.log(name, Math.round(box.height));
}
for (const [k, sel] of Object.entries(MAP)) await shot(k, sel);
// nav: open the capabilities mega menu
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await p.hover('.site-navbar .nav-cell:has-text("CAPABILITIES")').catch(() => {});
await p.waitForTimeout(700);
await p.screenshot({ path: path.join(OUT, "nav.png"), clip: { x: 0, y: 0, width: 1440, height: 760 } });
console.log("nav 760");
// interior: narrative systems capability page
await p.mouse.move(700, 880);
await p.goto(BASE + "/capabilities/narrative-systems/", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
await p.screenshot({ path: path.join(OUT, "interior.png"), clip: { x: 0, y: 0, width: 1440, height: 1300 }, fullPage: true });
console.log("interior 1300");
await b.close();
