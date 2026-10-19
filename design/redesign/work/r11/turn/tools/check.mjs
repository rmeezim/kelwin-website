// Behaviour and timing checks for a turn (today | lockup | once | letters) on the test pages (pages/<id>/).
//   node tools/check.mjs <id> [--vp 1440x900] [--runs 3]   → look/check-<id>-<vp>.json
// 1 reduced motion · 2 no JS · 3 cold arrival · 4 a click, fast page (median of runs) · 5 slow pages (+300, +1200 ms)
// 6 a page that never comes (3s) and a 204 · 7 back/forward · 8 no horizontal overflow while the panel is up ·
// 9 a real network (the pages cacheable as GitHub Pages sends them, the next page 150 / 400ms away): when it shows.
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
import { serve, R, L } from "./serve.mjs";
const require = createRequire(path.join(R, "tool/x.js")); const { chromium } = require("playwright");
const id = process.argv[2]; const opt = { vp: "1440x900", runs: "3" };
for (let i = 3; i < process.argv.length; i += 2) opt[process.argv[i].slice(2)] = process.argv[i + 1];
const [VW, VH] = opt.vp.split("x").map(Number), RUNS = +opt.runs;
const dir = VW >= 1024 || VW === 834 ? id : VW > 360 ? `${id}-390` : `${id}-320`;
const S = await serve(path.join(L, "pages", dir));
const b = await chromium.launch();
const out = []; const ok = (name, pass, info) => { out.push({ name, pass: !!pass, info }); console.log((pass ? "PASS " : "FAIL ") + name + (info !== undefined ? "  " + JSON.stringify(info).slice(0, 300) : "")); };
/* in-page recorder (each document): html turn classes and fonts ready, against the epoch clock, sent to node
   as they happen (a page held by a pending navigation cannot be asked) */
const REC = () => {
  const push = (k, v) => { try { window.__kev(k, v, performance.timeOrigin + performance.now(), location.pathname); } catch (e) {} };
  let prev = null;
  const rec = () => { const d = document.documentElement; if (!d) return; const c = [...d.classList].filter((x) => /^km-(turning|arriving|cold|lift|mo)$/.test(x)).join(" "); if (c !== prev) { prev = c; push("cls", c); } };
  new MutationObserver(rec).observe(document, { attributes: true, subtree: true, childList: true, attributeFilter: ["class"] });
  document.addEventListener("DOMContentLoaded", () => { push("dcl", 1); document.fonts && document.fonts.ready.then(() => push("fonts", 1)); });
};
const EV = [];
async function context(o = {}) { const ctx = await b.newContext({ ...ctxOpts, ...o }); await ctx.exposeBinding("__kev", (src, k, v, t, u) => EV.push({ k, v, t, u })); await ctx.addInitScript(REC); return ctx; }
const ctxOpts = { viewport: { width: VW, height: VH } };
const go = async (p, sel) => { const l = p.locator(sel).first(); if (VW < 1024) await l.evaluate((a) => a.click()); else await l.click({ noWaitAfter: true }); };
const events = () => EV.slice();
const median = (a) => { const s = a.filter((x) => x !== undefined).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : undefined; };

/* one turn: audit → insights. Returns the timeline in ms from the click (epoch). */
async function turn({ delay = 0, never = false, to = "/insights" } = {}) {
  const ctx = await context();
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
  await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(2800);
  S.delay["page-insights.html"] = never ? 8000 : delay;
  EV.length = 0;
  const tc = Date.now(); await go(p, `a[href="${to}"]`);
  await p.waitForTimeout(never ? 2900 : delay + 2600);
  const ev = events(); const url = new URL(p.url()).pathname;
  S.delay["page-insights.html"] = 0;
  const rel = (e) => (e ? Math.round(e.t - tc) : undefined);
  const nx = ev.filter((e) => e.u !== "/page-audit.html"), here = ev.filter((e) => e.u === "/page-audit.html");
  const r = {
    url, errs, tc,
    turning: rel(here.find((e) => e.k === "cls" && /turning/.test(e.v))),
    mo: here.some((e) => e.k === "cls" && /km-mo/.test(e.v)),
    unturned: rel(here.find((e) => e.k === "cls" && /lift/.test(e.v))),
    arriving: rel(nx.find((e) => e.k === "cls" && /arriving/.test(e.v))),
    nextMo: nx.some((e) => e.k === "cls" && /km-mo/.test(e.v)),
    nextCold: nx.some((e) => e.k === "cls" && /cold/.test(e.v)),
    fonts: rel(nx.find((e) => e.k === "fonts")),
    lift: rel(nx.find((e) => e.k === "cls" && /lift/.test(e.v))),
    cleared: rel(nx.filter((e) => e.k === "cls").find((e, i, a) => i > 0 && e.v === "" && /lift/.test(a[i - 1].v))),
  };
  await ctx.close();
  return r;
}

// 1 · reduced motion: nothing injected, no class, no panel, no split; a click simply navigates
{
  const ctx = await b.newContext({ ...ctxOpts, reducedMotion: "reduce" });
  const p = await ctx.newPage(); await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({ style: !!document.querySelector("style[data-km-turn]"), cls: [...document.documentElement.classList].filter((c) => /^km-(turning|arriving|cold|lift|mo)$/.test(c)),
    disp: getComputedStyle(document.querySelector(".km-turn")).display, split: document.querySelectorAll(".ac-ch").length }));
  ok("reduced motion: nothing injected, no class, no panel, no split", !r.style && !r.cls.length && r.disp === "none" && !r.split, r);
  const t = Date.now(); await go(p, 'a[href="/insights"]'); await p.waitForURL(/page-insights/); const dt = Date.now() - t;
  const cls = await p.evaluate(() => [...document.documentElement.classList].filter((c) => /^km-(turning|arriving|cold|lift|mo)$/.test(c)));
  ok("reduced motion: a click simply loads the next page", dt < 600 && !cls.length, { ms: dt, cls });
  await ctx.close();
}
// 2 · no JS: no panel
{
  const ctx = await b.newContext({ ...ctxOpts, javaScriptEnabled: false });
  const p = await ctx.newPage(); await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const e = document.querySelector(".km-turn"); const cs = getComputedStyle(e); return { display: cs.display, visibility: cs.visibility }; });
  ok("no JS: no panel", r.display === "none" || r.visibility === "hidden", r);
  await ctx.close();
}
// 3 · cold arrival: covered from the first paint, the lockup (or the mark) flickers on, lifted, cleared
{
  const cold = [];
  for (let i = 0; i < RUNS; i++) {
    const ctx = await context(); EV.length = 0;
    const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e)));
    const t0 = Date.now(); await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(3000);
    const ev = events(); const head = ev.find((e) => e.k === "cls" && /arriving/.test(e.v));
    const lift = ev.find((e) => e.k === "cls" && /lift/.test(e.v)), fonts = ev.find((e) => e.k === "fonts");
    const st = await p.evaluate(() => ({ vis: getComputedStyle(document.querySelector(".km-turn")).visibility, h1Back: !document.querySelector("h1 .ac-ch"), h1Write: !!document.querySelector("h1.ac-write") }));
    cold.push({ coldCls: head && /cold/.test(head.v), mo: !!(head && /km-mo/.test(head.v)), lift: lift && head ? Math.round(lift.t - head.t) : undefined, fonts: fonts && head ? Math.round(fonts.t - head.t) : undefined,
      cleared: ev.filter((e) => e.k === "cls").pop().v === "", ...st, errs });
    await ctx.close();
  }
  ok("cold arrival: covered (cold), lifted, cleared, h1 written and put back", cold.every((c) => c.coldCls && c.cleared && c.vis === "hidden" && c.h1Back && c.h1Write && !c.errs.length), cold);
  out.push({ name: "cold: head → lift (median ms)", pass: true, info: median(cold.map((c) => c.lift)) });
  console.log("     cold head → lift", median(cold.map((c) => c.lift)), "ms (fonts ready", median(cold.map((c) => c.fonts)), ")");
}
// 4 · a click, fast page (median of runs)
{
  const rs = []; for (let i = 0; i < RUNS; i++) rs.push(await turn());
  const good = rs.every((r) => r.url === "/page-insights.html" && r.arriving !== undefined && r.lift !== undefined && r.cleared !== undefined && !r.nextCold && !r.errs.length);
  const m = (k) => median(rs.map((r) => r[k]));
  const t = { turning: m("turning"), arriving: m("arriving"), fonts: m("fonts"), lift: m("lift"), cleared: m("cleared"), held: median(rs.map((r) => r.lift - Math.max(r.arriving + 60, r.fonts || 0))), mo: rs.map((r) => r.mo + "/" + r.nextMo).join(" ") };
  ok("a click (fast page): turns, arrives warm, lifts, clears", good, t);
  out.push({ name: "fast: timeline from the click (median ms)", pass: true, info: t });
}
// 5 · slow pages: the lift follows the page, never a frozen panel
for (const delay of [300, 1200]) {
  const rs = []; for (let i = 0; i < Math.max(1, RUNS - 1); i++) rs.push(await turn({ delay }));
  const m = (k) => median(rs.map((r) => r[k]));
  const t = { delay, arriving: m("arriving"), fonts: m("fonts"), lift: m("lift"), cleared: m("cleared"), held: median(rs.map((r) => r.lift - Math.max(r.arriving + 60, r.fonts || 0))) };
  ok(`a slow page (+${delay}ms): arrives warm and lifts as soon as it is ready`, rs.every((r) => r.lift !== undefined && !r.nextCold && r.lift - Math.max(r.arriving + 60, r.fonts || 0) < 200), t);
}
// 9 · a real network: the pages sent as GitHub Pages sends them (Cache-Control: max-age=600) and the next page 150 or
//     400ms away. Today's turn requests it at 560ms; the full-logo turn warms it at the click (a prefetch hint) and
//     requests it at 610ms (the mark alone of "once", 560). When the next page shows under the panel (arriving) and
//     the lift, from the click; and what reached the server for it (prefetch / page).
S.cache = "max-age=600";
for (const delay of [150, 400]) {
  const rs = [];
  for (let i = 0; i < RUNS; i++) {
    const h0 = S.hits.length; const r = await turn({ delay });
    r.hits = S.hits.slice(h0).filter((h) => /insights/.test(h.u)).map((h) => (h.purpose || "page") + "@" + Math.round(h.t - r.tc));
    rs.push(r);
  }
  const m = (k) => median(rs.map((r) => r[k]));
  const t = { delay, arriving: m("arriving"), fonts: m("fonts"), lift: m("lift"), cleared: m("cleared"), hits: rs.map((r) => r.hits.join(" ")) };
  ok(`a real network (the next page ${delay}ms away, cacheable): arrives warm, lifts, clears`, rs.every((r) => r.url === "/page-insights.html" && r.lift !== undefined && r.cleared !== undefined && !r.nextCold && !r.errs.length), t);
}
S.cache = "";
// 6 · a page that does not come in time (8s): the old page's panel is swept off (no frozen panel); a 204 likewise
{
  const r = await turn({ never: true });
  ok("the next page takes 8s: the panel is swept off the old page 2s after the request (no frozen panel)", r.unturned !== undefined && r.unturned < 2900, { unturned: r.unturned });
  const ctx = await context();
  const p = await ctx.newPage(); await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(2800);
  await p.evaluate(() => { const a = document.createElement("a"); a.href = "/204"; a.id = "x204"; a.textContent = "x"; a.style.cssText = "position:fixed;left:0;top:0;z-index:5"; document.body.appendChild(a); });
  await p.evaluate(() => document.getElementById("x204").click()); await p.waitForTimeout(3400);
  const st = await p.evaluate(() => ({ cls: [...document.documentElement.classList].filter((c) => /^km-(turning|arriving|cold|lift|mo)$/.test(c)), vis: getComputedStyle(document.querySelector(".km-turn")).visibility }));
  ok("a 204: the panel is swept off and cleared", !st.cls.length && st.vis === "hidden", st);
  await ctx.close();
}
// 7 · back/forward: the page comes back uncovered
{
  const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage();
  await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(2600);
  await go(p, 'a[href="/insights"]'); await p.waitForURL(/page-insights/); await p.waitForTimeout(2600);
  await p.goBack(); await p.waitForTimeout(1600);
  const st = await p.evaluate(() => ({ url: location.pathname, cls: [...document.documentElement.classList].filter((c) => /^km-(turning|arriving|cold|lift|mo)$/.test(c)), vis: getComputedStyle(document.querySelector(".km-turn")).visibility }));
  ok("back: the page is uncovered", /audit/.test(st.url) && !st.cls.length && st.vis === "hidden", st);
  await ctx.close();
}
// 8 · while the panel is up: no horizontal overflow, the lockup inside the window
{
  const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage();
  await p.goto(S.base + "page-audit.html"); await p.waitForTimeout(2600);
  const r = await p.evaluate(() => { document.documentElement.classList.add("km-arriving"); const l = (document.querySelector(".km-turn__lockup") || document.querySelector(".km-turn__mark")).getBoundingClientRect();
    return { sw: document.documentElement.scrollWidth, vw: innerWidth, box: [l.left, l.right, l.top, l.bottom].map((v) => +v.toFixed(1)) }; });
  ok("panel up: no horizontal overflow, the lockup inside the window", r.sw <= r.vw && r.box[0] >= 16 && r.box[1] <= r.vw - 16, r);
  await ctx.close();
}
await b.close(); S.close();
fs.writeFileSync(path.join(L, "look", `check-${id}-${opt.vp}.json`), JSON.stringify(out, null, 1));
console.log(out.filter((x) => !x.pass).length ? "SOME FAILED" : "ALL PASS");
