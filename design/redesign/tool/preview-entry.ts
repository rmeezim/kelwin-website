// Standalone preview runtime for the built Kelwin homepage (review page only, never shipped).
// The section behaviours are the production modules, unchanged; this replaces only the React shell:
// the Slot play trigger (same rules as src/components/home/Slot.tsx) and the nav's scrolled/entrance state.
import { behaviors } from "@/components/home/behaviors";
import { reserveLedger } from "@/components/home/system/reserve";

type Name = keyof typeof behaviors;
const html = document.documentElement;
html.classList.add("km-live");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches || !html.classList.contains("km-motion");
const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);

function play(slot: HTMLElement) {
  if (slot.dataset.played) return;
  slot.dataset.played = "1";
  if (!reduced) slot.classList.add("is-play");
  const name = slot.id.replace(/^s-/, "") as Name;
  const fn = behaviors[name];
  const root = slot.firstElementChild as HTMLElement | null;
  if (fn && root) { try { fn(root, { reduced }); } catch (e) { console.error(name, e); } }
}

fontsReady.then(() => {
  const slots = Array.from(document.querySelectorAll<HTMLElement>(".km-slot"));
  if (reduced) { slots.forEach(play); return; }
  const hero = slots.find((s) => s.id === "s-hero");
  if (hero) setTimeout(() => play(hero), 180);
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const need = Math.min(0.22 * e.boundingClientRect.height, 0.35 * innerHeight);
      if (e.intersectionRect.height >= need) { io.unobserve(e.target); play(e.target as HTMLElement); }
    }
  }, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });
  slots.filter((s) => s !== hero).forEach((s) => io.observe(s));
});

// the system ledger's height reserve (src/components/home/system/Ledger.tsx without React)
document.querySelectorAll<HTMLOListElement>(".km-system__ledger").forEach((ledger) => {
  let raf = 0;
  const reserve = () => reserveLedger(ledger);
  reserve();
  const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(reserve); });
  ledger.querySelectorAll(".ac-row__head, .ac-row__in").forEach((el) => ro.observe(el));
  document.fonts?.ready.then(reserve);
});

// nav: entrance with the hero, compact once scrolled (the production Navbar's resting/scrolled states)
const header = document.querySelector<HTMLElement>("header.kn");
if (header) {
  const heroSlot = document.getElementById("s-hero");
  const sync = () => { if (heroSlot?.classList.contains("is-play") || heroSlot?.dataset.played) header.setAttribute("data-play", ""); };
  if (heroSlot) new MutationObserver(sync).observe(heroSlot, { attributes: true, attributeFilter: ["class", "data-played"] });
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
}

// links: same-page fragments scroll; links to other pages explain themselves (they aren't part of this preview)
const toast = document.createElement("div");
toast.setAttribute("role", "status");
toast.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:999;background:#FBFAF6;color:#141517;font:500 13px/1.4 var(--f-body);padding:12px 16px;max-width:calc(100% - 32px);opacity:0;transition:opacity .2s;pointer-events:none";
document.body.appendChild(toast);
let tt = 0;
document.addEventListener("click", (ev) => {
  const a = (ev.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a) return;
  const href = a.getAttribute("href") || "";
  if (/^(mailto:|https?:)/.test(href)) return;
  ev.preventDefault();
  const m = href.match(/^\/?#(.+)$/);
  const target = m ? document.getElementById(m[1]) : href === "/" || href === "./" ? document.body : null;
  if (target) { target === document.body ? scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }) : target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); return; }
  toast.textContent = `“${(a.textContent || "This link").trim()}” opens ${href.replace(/\/$/, "") || "/"} on the live site. Only the homepage is in this preview.`;
  toast.style.opacity = "1"; clearTimeout(tt); tt = window.setTimeout(() => { toast.style.opacity = "0"; }, 3200);
});
