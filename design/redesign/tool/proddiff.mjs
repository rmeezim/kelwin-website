// Copy & motion checks for a ported v5 section against its approved mockup.
//   node tool/proddiff.mjs text <section>                      → word-level diff of visible + aria text (mockup vs production)
//   node tool/proddiff.mjs frames <section> 300,900,1800,4000 [--width 1440]
//        → viewport frames at those ms after the section starts playing, production AND mockup,
//          written to R/prod/<section>/frames/{prod,mock}-<ms>.png (for comparing entrance choreography)
// Production = http://localhost:3100/preview/<section>/ (dev server); mockup = R/site/m-<section>-<slot>.html.
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."); const SITE = path.join(R, "site");
const SLOTS = { hero: "T", reframe: "U", evidence: "T", letter: "S", system: "T", principle: "S", handover: "U", method: "U", fit: "U", cta: "U", footer: "U", faq: "U" };
const [mode, sec, list] = process.argv.slice(2); const slot = SLOTS[sec];
const wi = process.argv.indexOf("--width"); const W = wi > -1 ? +process.argv[wi + 1] : 1440;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".woff2": "font/woff2" };
const server = http.createServer((q, s) => { const fp = path.join(SITE, decodeURIComponent(q.url.split("?")[0]).replace(/^\/+/, "")); if (!fp.startsWith(SITE) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": TYPES[path.extname(fp)] || "application/octet-stream" }); fs.createReadStream(fp).pipe(s); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const MOCK = `http://127.0.0.1:${server.address().port}/m-${sec}-${slot}.html`;
const PROD = sec === "footer" ? "http://localhost:3100/preview/footer/" : `http://localhost:3100/preview/${sec}/`;
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const TEXT = (selector) => {
  const root = document.querySelector(selector) || document.body; const out = [];
  const walk = (el) => { for (const n of el.childNodes) { if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, " ").trim(); if (t) out.push(t); } else if (n.nodeType === 1) {
    const cs = getComputedStyle(n); if (cs.display === "none" || n.tagName === "SCRIPT" || n.tagName === "STYLE") continue;
    for (const a of ["aria-label", "alt", "title"]) { const v = n.getAttribute(a); if (v) out.push(`[${a}] ${v}`); } walk(n); } } };
  walk(root); return out.join(" ");
};
if (mode === "text") {
  const get = async (url, sel) => { const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.emulateMedia({ reducedMotion: "reduce" }); await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(1500); const t = await p.evaluate(TEXT, sel); await p.close(); return t; };
  // the mockup hero carries the nav inside it; production renders the nav separately (compare the section body)
  const m = await get(MOCK, `.km-${sec}-${slot}`); const pr = await get(PROD, sec === "footer" ? "footer" : `#s-${sec}`);
  const A = m.split(" "), B = pr.split(" ");
  // LCS word diff
  const n = A.length, k = B.length, dp = Array.from({ length: n + 1 }, () => new Int32Array(k + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = k - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  let i = 0, j = 0; const ops = [];
  while (i < n && j < k) { if (A[i] === B[j]) { ops.push(["=", A[i]]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push(["-", A[i++]]); } else { ops.push(["+", B[j++]]); } }
  while (i < n) ops.push(["-", A[i++]]); while (j < k) ops.push(["+", B[j++]]);
  const changes = []; let ctx = [];
  for (let x = 0; x < ops.length; x++) { const [o, w] = ops[x]; if (o === "=") { ctx.push(w); if (ctx.length > 6) ctx.shift(); continue; }
    let seg = { at: ctx.join(" "), mock: [], prod: [] }; while (x < ops.length && ops[x][0] !== "=") { (ops[x][0] === "-" ? seg.mock : seg.prod).push(ops[x][1]); x++; } x--; changes.push(seg); ctx = []; }
  console.log(`mockup words ${A.length} · production words ${B.length} · ${changes.length} difference(s)`);
  for (const c of changes.slice(0, 40)) console.log(`  …${c.at.slice(-60)} ‖ mock: «${c.mock.join(" ")}» → prod: «${c.prod.join(" ")}»`);
} else if (mode === "frames") {
  const times = (list || "300,900,1800,4000").split(",").map(Number);
  const OUT = path.join(R, "prod", sec, "frames"); fs.mkdirSync(OUT, { recursive: true });
  for (const [who, url] of [["prod", PROD], ["mock", MOCK]]) {
    const p = await b.newPage({ viewport: { width: W, height: 900 } }); await p.goto(url, { waitUntil: "load" }); await p.evaluate(() => document.fonts.ready);
    if (who === "prod") { await p.evaluate((s) => document.querySelector(`#s-${s}`)?.scrollIntoView({ block: "start" }), sec); await p.waitForFunction((s) => document.querySelector(`#s-${s}`)?.classList.contains("is-play"), sec, { timeout: 15000 }).catch(() => {}); }
    else await p.waitForFunction(() => document.documentElement.classList.contains("is-play"), null, { timeout: 15000 }).catch(() => {});
    const t0 = Date.now();
    for (const t of times) { const dt = t - (Date.now() - t0); if (dt > 0) await p.waitForTimeout(dt); await p.screenshot({ path: path.join(OUT, `${who}-${t}.png`) }); }
    await p.close();
  }
  console.log(`frames → ${OUT} (${times.join(", ")} ms; prod-*.png vs mock-*.png)`);
}
await b.close(); server.close();
