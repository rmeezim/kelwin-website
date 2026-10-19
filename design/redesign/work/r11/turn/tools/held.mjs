// The held frame of a turn (the panel up, everything on) at the given widths, plus the lockup's box.
//   node tools/held.mjs <id> [w…]     → look/held-<id>-<w>.png, and the boxes on stdout
import path from "node:path"; import { createRequire } from "node:module";
import { serve, R, L } from "./serve.mjs";
const require = createRequire(path.join(R, "tool/x.js")); const { chromium } = require("playwright");
const [id, ...ws] = process.argv.slice(2);
const widths = ws.length ? ws.map(Number) : [1440, 834, 390, 360, 320];
const b = await chromium.launch();
for (const w of widths) {
  const dir = w >= 1024 ? id : w > 360 ? `${id}-390` : `${id}-320`;
  const S = await serve(path.join(L, "pages", w === 834 ? id : dir));
  const h = w >= 1024 ? 900 : w === 834 ? 1112 : w === 390 ? 844 : 640;
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(2600);
  const r = await p.evaluate(() => {
    const d = document.documentElement; d.classList.add("km-arriving");
    const q = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.left, b.top, b.width, b.height].map((v) => +v.toFixed(2)); };
    return { vw: innerWidth, sw: document.documentElement.scrollWidth, lockup: q(".km-turn__lockup"), mark: q(".km-turn__mark"), word: q(".km-turn__word"),
      wordOp: document.querySelector(".km-turn__word") ? getComputedStyle(document.querySelector(".km-turn__word")).opacity : null };
  });
  await p.waitForTimeout(100);
  await p.screenshot({ path: path.join(L, "look", `held-${id}-${w}.png`) });
  console.log(w, JSON.stringify(r), errs.length ? errs : "");
  await ctx.close(); S.close();
}
await b.close();
