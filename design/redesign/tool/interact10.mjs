// Click through the round-10 review page (preview10.html): choose, write notes (open and folded), reload,
// check everything came back, leave the page mid-typing (pagehide), then Finish and copy and read the export.
// A stand-in for the shared page store records what the page would save there.
//   node tool/interact10.mjs [width]
import fs from "node:fs"; import path from "node:path"; import http from "node:http";
import { fileURLToPath } from "node:url"; import { chromium } from "playwright";
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const W = +(process.argv[2] || 1440);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4" };
const server = http.createServer((q, s) => { const f = path.join(R, decodeURIComponent(q.url.split("?")[0].split("#")[0])); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); return; } s.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); s.end(d); }); });
await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const URL = `http://127.0.0.1:${server.address().port}/preview10.html`;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
await ctx.grantPermissions(["clipboard-read", "clipboard-write"], { origin: URL.replace(/\/preview10.html$/, "") });
await ctx.addInitScript(() => {     // the shared store, faked: every write is kept in sessionStorage so it survives a reload
  const get = () => JSON.parse(sessionStorage.getItem("fakedb") || "{}");
  window.claude = { use: async () => ({
    doc: (p) => ({ set: async (v) => { const d = get(); d[p] = v; sessionStorage.setItem("fakedb", JSON.stringify(d)); } }),
    collection: (c) => ({ onSnapshot: (cb) => { const d = get(); setTimeout(() => cb({ metadata: { fromCache: false }, docs: Object.entries(d).filter(([k]) => k.startsWith(c + "/")).map(([k, v]) => ({ id: k.slice(c.length + 1), data: () => v })) }), 50); return () => {}; } }),
  }) };
});
const p = await ctx.newPage();
const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
const out = [];
const ok = (cond, msg) => out.push(`${cond ? "PASS" : "FAIL"} ${msg}`);
await p.goto(URL, { waitUntil: "load" }); await p.waitForTimeout(400);
const total = +(await p.textContent("#prog-t"));
ok(total === 16, `decisions counted: ${total} (expect 16)`);
ok((await p.textContent("#saved")) === "Saves as you go", "the bar says answers save as you go (store present)");
const store = () => p.evaluate(() => JSON.parse(localStorage.getItem("kelwin-review10") || "{}"));
const choiceOf = async (id) => ((await store())[id] || {}).choice || "";

// choices: a panel, a two-way decision, a "change some" panel (its folded note opens), the turn, a question row
await p.click('[data-item="sm-approve"][data-key="approve"]');
await p.click('[data-item="bm-pilot-fee"][data-key="65"]');
await p.click('[data-item="bm-terms"][data-key="some"]');
const foldOpen = await p.evaluate(() => document.querySelector('[data-note-fold="bm-terms"]').open);
const focused = await p.evaluate(() => document.activeElement && document.activeElement.id);
ok(foldOpen && focused === "note-bm-terms", `“Change some (say which)” opens the folded note and focuses it (${focused})`);
await p.keyboard.type("Deposit: half a month");
await p.click('[data-item="art-turn"][data-key="today"]');
await p.click('[data-item="sm-addresses"][data-key="yes"]');
await p.click('[data-item="sm-addresses"][data-key="yes"]');      // a second press takes the answer back
ok(!(await choiceOf("sm-addresses")), "pressing a chosen answer again clears it");
// a text answer, and a note on one drawing (not a decision)
await p.fill("#note-q-capacity", "About 20 hours a week; one Systems Engineer lined up");
await p.evaluate(() => { document.querySelector('[data-note-fold="an-art-infra"]').open = true; });
await p.fill("#note-an-art-infra", "Slow the warm-up a little");
await p.waitForTimeout(700);
ok((await p.textContent("#prog-n")) === "5", `progress after four kept choices and one text answer: ${await p.textContent("#prog-n")} (expect 5)`);
const writes1 = await p.evaluate(() => Object.keys(JSON.parse(sessionStorage.getItem("fakedb") || "{}")));
ok(["review10/sm-approve", "review10/bm-pilot-fee", "review10/bm-terms", "review10/q-capacity", "review10/art-turn", "review10/an-art-infra"].every((k) => writes1.includes(k)), `written to the shared store: ${writes1.join(", ")}`);
ok((await p.textContent('[data-where="business"]')) === "2/7", `the In-this-round list keeps count: business ${await p.textContent('[data-where="business"]')}`);

// the fast path: take a part's proposed answers, undo, take again, then a hand-made change ends the undo
const BIZ = { "bm-packages": "approve", "bm-pilot-fee": "65", "bm-terms": "yes", "bm-exit": "offer", "bm-projects": "approve", "bm-showing": "1", "bm-lifecycle": "approve" };
await p.click('[data-take-btn="business"]'); await p.waitForTimeout(200);
let st = await store();
ok(Object.entries(BIZ).every(([k, v]) => (st[k] || {}).choice === v), `“Take the proposed answers” sets all seven business answers: ${Object.keys(BIZ).map((k) => (st[k] || {}).choice).join(" ")}`);
ok((st["bm-terms"] || {}).note === "Deposit: half a month", "taking the proposed answers keeps a note already written");
ok(await p.evaluate(() => document.querySelector('[data-item="bm-exit"][data-key="offer"]').getAttribute("aria-pressed") === "true"), "the buttons show the taken answers as chosen");
ok((await p.textContent("#prog-n")) === "10", `progress after taking them: ${await p.textContent("#prog-n")} (expect 10)`);
const undoLabel = await p.textContent('[data-take-btn="business"]');
ok(/^Undo/.test(undoLabel), `the button becomes “${undoLabel}”`);
ok(await p.evaluate(() => document.activeElement && document.activeElement.dataset.takeBtn === "business"), "focus stays on the button");
await p.click('[data-take-btn="business"]'); await p.waitForTimeout(200);
st = await store();
ok((st["bm-pilot-fee"] || {}).choice === "65" && (st["bm-terms"] || {}).choice === "some" && !(st["bm-exit"] || {}).choice && !(st["bm-showing"] || {}).choice, "Undo puts back the earlier answers (65 and “change some” kept, the rest cleared)");
ok((await p.textContent("#prog-n")) === "5", `progress after undo: ${await p.textContent("#prog-n")} (expect 5)`);
await p.click('[data-take-btn="voice"]'); await p.waitForTimeout(150);
await p.click('[data-item="vo-homepage"][data-key="some"]'); await p.waitForTimeout(150);
ok(/^Take/.test(await p.textContent('[data-take-btn="voice"]')), "a hand-made change in that part ends its undo");
ok((await choiceOf("vo-voice")) === "approve" && (await choiceOf("vo-ns")) === "approve" && (await choiceOf("vo-homepage")) === "some", "the voice keeps its taken answers and the hand-made one");
// back to a known state for the rest: voice cleared by hand
for (const id of ["vo-voice", "vo-ns"]) await p.click(`[data-item="${id}"][data-key="approve"]`);
await p.click('[data-item="vo-homepage"][data-key="some"]');
await p.waitForTimeout(300);

// reload: everything back
await p.reload({ waitUntil: "load" }); await p.waitForTimeout(500);
const back = await p.evaluate(() => ({
  a: document.querySelector('[data-item="sm-approve"][data-key="approve"]').getAttribute("aria-pressed"),
  t: document.querySelector('[data-item="art-turn"][data-key="today"]').getAttribute("aria-pressed"),
  crm: document.getElementById("note-bm-terms").value, fold: document.querySelector('[data-note-fold="bm-terms"]').open,
  pay: document.getElementById("note-q-capacity").value, art: document.getElementById("note-an-art-infra").value, n: document.getElementById("prog-n").textContent }));
ok(back.a === "true" && back.t === "true", "choices restored after reload");
ok(back.crm.startsWith("Deposit") && back.fold, "folded note restored, and its fold opens");
ok(back.pay.startsWith("About 20 hours") && back.art.startsWith("Slow the warm-up"), "text answer and drawing note restored");
ok(back.n === "5", `progress restored: ${back.n}`);

// leave mid-typing: the pagehide flush keeps the words
await p.fill("#note-general", "Typed just before leaving");
await p.evaluate(() => document.getElementById("note-general").dispatchEvent(new Event("input")));
await p.goto("about:blank"); await p.goto(URL, { waitUntil: "load" }); await p.waitForTimeout(500);
ok((await p.inputValue("#note-general")).startsWith("Typed just before"), "a note typed just before leaving survives (pagehide)");

// local only: without the store, the page says so and still keeps answers on this device
const p2 = await b.newPage({ viewport: { width: W, height: 900 } });
await p2.goto(URL, { waitUntil: "load" }); await p2.waitForTimeout(300);
ok((await p2.textContent("#saved")) === "This device only", "without the store the bar says “This device only”");
await p2.close();

// finish and copy
await p.click("#finish-btn"); await p.waitForTimeout(600);
const clip = await p.evaluate(() => navigator.clipboard.readText().catch(() => ""));
const pre = await p.textContent("#summary-pre");
ok(clip === pre && clip.startsWith("Kelwin redesign — round 10 review (5 of"), "Finish and copy puts the review on the clipboard");
ok(/Approve the sitemap: APPROVE/.test(clip) && /The other money terms, as recommended\? CHANGE SOME \(SAY WHICH\) — Deposit: half a month/.test(clip) && /How many hours a week can you give to delivery today, and which contractors are lined up\? About 20 hours/.test(clip) && /Note on How we build it \(GTM Infrastructure\): Slow the warm-up/.test(clip) && /Also: Typed just before leaving/.test(clip), "the export carries choices, notes, the drawing note and text answers");
ok(["The sitemap", "The business model", "Drawings and the page turn", "The voice", "Next steps", "One question about your time"].every((h) => clip.includes("\n" + h + "\n")), "the export has every section");
ok(clip.split("\n").filter((l) => /^[^:?]+(\?|:) (—|[A-Z0-9])/.test(l)).length >= 16, `the export lists every decision (${clip.split("\n").filter((l) => /^[^:?]+(\?|:) (—|[A-Z0-9])/.test(l)).length} lines)`);
fs.writeFileSync(path.join(R, "qa/r10/review/export-sample.txt"), clip);

// the section list below 1200px, and a card opened from a link
if (W < 1200) {
  await p.selectOption("#bar-sel", "voice"); await p.waitForTimeout(900);
  const top = await p.evaluate(() => document.getElementById("voice").getBoundingClientRect().top);
  ok(top < 200 && top > -50, `the section list jumps to the voice (top ${Math.round(top)})`);
}
await p.evaluate(() => { location.hash = "pg-engagements"; }); await p.waitForTimeout(300);
ok(await p.evaluate(() => document.getElementById("pg-engagements")?.open), "a link to a page card opens it");
console.log(out.join("\n")); console.log(errs.length ? "ERRORS " + errs.join(" | ") : "no page errors");
await b.close(); server.close();
