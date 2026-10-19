// The turn's lockup against the brand asset: the held lockup, then the asset (.km-logo, brand/kelwin-lockup.svg)
// laid in the same box on the same panel; the two screenshots are diffed (node tools/fidelity.mjs <id> <w>).
import path from "node:path"; import { createRequire } from "node:module";
import { serve, R, L } from "./serve.mjs";
const require = createRequire(path.join(R, "tool/x.js")); const { chromium } = require("playwright");
const [id, w] = [process.argv[2], +process.argv[3] || 1440];
const dir = w >= 1024 ? id : w > 360 ? `${id}-390` : `${id}-320`;
const S = await serve(path.join(L, "pages", dir));
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: w, height: w >= 1024 ? 900 : 640 } })).newPage();
await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(2600);
const box = await p.evaluate(() => { document.documentElement.classList.add("km-arriving"); const r = document.querySelector(".km-turn__lockup").getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
await p.waitForTimeout(100);
const clip = { x: Math.floor(box[0]) - 4, y: Math.floor(box[1]) - 4, width: Math.ceil(box[2]) + 8, height: Math.ceil(box[3]) + 8 };
await p.screenshot({ path: path.join(L, "look", `fid-${id}-${w}-turn.png`), clip });
await p.evaluate((box) => { const lk = document.querySelector(".km-turn__lockup"); lk.style.visibility = "hidden";
  const s = document.createElement("span"); s.className = "km-logo"; s.style.cssText = `position:absolute;left:${box[0]}px;top:${box[1]}px;height:${box[3]}px;width:${box[2]}px;color:var(--fg);--logo-h:${box[3]}px`;
  document.querySelector(".km-turn").appendChild(s); }, box);
await p.waitForTimeout(300);
await p.screenshot({ path: path.join(L, "look", `fid-${id}-${w}-asset.png`), clip });
await b.close(); S.close();
console.log(JSON.stringify(box));
