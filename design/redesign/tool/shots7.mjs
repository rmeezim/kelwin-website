// Screens for the build review: what the standalone homepage can't show (nav plates, phone menu, interior pages, FAQ, 404).
import { chromium } from "playwright";
const B = "http://127.0.0.1:4100/kelwin-website/"; const OUT = process.argv[2];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const shot = async (path, w, h, fn, opts = {}) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: opts.reduced ? "reduce" : "no-preference", hasTouch: !!opts.touch, isMobile: !!opts.touch });
  const p = await ctx.newPage(); await p.goto(B + path, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(opts.wait ?? 2600);
  const file = await fn(p); await ctx.close(); console.log("✓", file);
};
// 1 nav plate open (desktop): hover Capabilities
await shot("", 1440, 900, async (p) => { const t = p.locator("header.kn button.kn__item").first(); await t.hover(); await p.waitForTimeout(900); await p.screenshot({ path: `${OUT}/nav-plate.png` }); return "nav-plate"; });
// 2 compact bar over a section
await shot("", 1440, 900, async (p) => { await p.evaluate(() => scrollTo(0, 2480)); await p.waitForTimeout(2200); await p.screenshot({ path: `${OUT}/nav-compact.png`, clip: { x: 0, y: 0, width: 1440, height: 420 } }); return "nav-compact"; });
// 3 phone menu open
await shot("", 390, 844, async (p) => { await p.locator('button[aria-controls="kn-sheet"]').click(); await p.waitForTimeout(900); const g = p.locator("#kn-sheet button[aria-expanded]").first(); if (await g.count()) { await g.click(); await p.waitForTimeout(600); } await p.screenshot({ path: `${OUT}/nav-sheet.png` }); return "nav-sheet"; }, { touch: true });
// 4 interior pages with the new chrome
for (const [path, name] of [["about/", "about"], ["audit/", "audit"], ["contact/", "contact"], ["capabilities/narrative-systems/", "capability"]]) {
  await shot(path, 1440, 900, async (p) => { await p.screenshot({ path: `${OUT}/${name}-top.png` }); return name + "-top"; });
  await shot(path, 390, 844, async (p) => { await p.screenshot({ path: `${OUT}/${name}-top-390.png` }); return name + "-top-390"; }, { touch: true });
}
// 5 the convert panel's button C (about), the contact submit
await shot("about/", 1440, 900, async (p) => { const el = p.locator(".cvp").first(); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200); await el.screenshot({ path: `${OUT}/about-cvp.png` }); return "about-cvp"; });
// 6 FAQ on /audit
await shot("audit/", 1440, 900, async (p) => { const el = p.locator("#s-faq"); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(3800); await el.screenshot({ path: `${OUT}/audit-faq.png` }); return "audit-faq"; });
await shot("audit/", 390, 844, async (p) => { const el = p.locator("#s-faq"); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(3800); await el.screenshot({ path: `${OUT}/audit-faq-390.png` }); return "audit-faq-390"; }, { touch: true });
// 7 the 404
await shot("nope/", 1440, 900, async (p) => { await p.waitForTimeout(800); await p.screenshot({ path: `${OUT}/404.png` }); return "404"; });
await b.close();
