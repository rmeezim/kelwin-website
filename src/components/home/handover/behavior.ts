import gsap from "gsap";
import type { Behavior } from "../types";

/* handover — the spread (ported from design/redesign/site/frag/handover/U.js, round 5).
   Opening state: the six dashed drafts stand as a stack on the footprint at the figure's left end (01 at the back,
   06 on top), your side shows six dotted places, every name is up, every before line still stands, every after waits.
   The spread: the stack fans out across the Handover datum in one row. The top sheet (06) leaves first and the rest
   follow 70ms apart, all in the same time, so sheets only ever separate. Each sheet's edge turns from dashed to solid,
   and its rough page becomes the finished page, exactly where it crosses the line (the draft and owned copies are
   clipped at the datum every frame).
   The payoff, in reading order 01 → 06: each asset's column lights once and its sheet edge inks while its before line
   is struck by a drawn hairline and its after line rises in. Each sheet's index shows on your side only once it has
   landed in its own slot (.is-home), and the dotted way across fades out at the hand-back (~0.7s after the last cue).
   Detail cards: each sheet is a disclosure button. Hover (mouse, after a 90ms intent delay; instant when moving
   between sheets), keyboard focus (focus-visible) or a tap opens its card; leaving, blur, Escape or a tap elsewhere
   closes it. Enter/Space and taps toggle. Never while the spread runs: at the hand-back the keyboard's sheet opens,
   and a sheet the pointer is resting on opens on the pointer's first move.
   Standalone (the preview): plays at once, settled by ~4.3s. Homepage (.km-home): the stack arrives with the
   section; the spread waits for the sheet row to be 60% in view, then for max(300ms, 1200ms − time since the
   section arrived), and plays once.
   Reduced motion, or ≤1023px (the reflowed figure): the final state, synchronously, no timers; the cards work at
   once. A resize while the spread is pending or running finishes it (the stack's coordinates would be stale). */

const P = "km-handover";
const SVGNS = "http://www.w3.org/2000/svg";
const NARROW = "(max-width: 1023px)";

type Pt = { x: number; y: number };
type EvMap = HTMLElementEventMap & DocumentEventMap & WindowEventMap;
type Sheet = {
  it: HTMLElement;
  el: HTMLElement;
  d: SVGElement;
  o: SVGElement;
  p: Pt;
  n: number;
  x: number;
  y: number;
  a: number;
  sx: number;
  sy: number;
};

export const init: Behavior = (root, { reduced }) => {
  const born = Date.now();
  const q = <T extends Element = HTMLElement>(s: string, el: ParentNode = root) => el.querySelector<T>(`.${P}__${s}`);
  const items = Array.from(root.querySelectorAll<HTMLElement>(`.${P}__item`));
  const datum = q("datum");
  const deck = q("deck");
  if (!items.length || !datum || !deck) return;

  let dead = false;
  const undo: Array<() => void> = [];
  const frames = new Set<number>();

  /* ≤1023 has no spread: the sheets and after lines fade in with their column. That entrance is attached only when
     the section plays narrow (.is-narrow-in), and dropped the first time the width crosses 1024 either way, so a
     resize or rotation after play never replays it. */
  const narrow = window.matchMedia(NARROW);
  if (narrow.matches && !reduced) root.classList.add("is-narrow-in");
  const crossed = () => root.classList.remove("is-narrow-in");
  narrow.addEventListener("change", crossed);
  undo.push(() => narrow.removeEventListener("change", crossed));
  const listen = <K extends keyof EvMap>(target: Document | Window | HTMLElement, type: K, fn: (e: EvMap[K]) => void) => {
    target.addEventListener(type, fn as EventListener);
    undo.push(() => target.removeEventListener(type, fn as EventListener));
  };
  const raf = (fn: () => void) => {
    const id = requestAnimationFrame(() => {
      frames.delete(id);
      if (!dead) fn();
    });
    frames.add(id);
  };

  /* layout offset of el inside the section root (ignores transforms) */
  const off = (el: HTMLElement): Pt => {
    let x = 0;
    let y = 0;
    for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) {
      x += e.offsetLeft;
      y += e.offsetTop;
    }
    return { x, y };
  };

  /* ── strikes: one SVG hairline per rendered line of the before text (never text-decoration). Rebuilt only when the
        lines actually move, so a redundant re-measure never cuts a strike's draw short. ── */
  const struck = new WeakMap<Element, string>();
  const strike = (it: HTMLElement) => {
    const p = q("was", it);
    const t = q("was-t", it);
    const svg = q<SVGSVGElement>("strike", it);
    if (!p || !t || !svg) return;
    const pr = p.getBoundingClientRect();
    const k = pr.width / (p.offsetWidth || 1) || 1;
    const rg = document.createRange();
    rg.selectNodeContents(t);
    const lines: { t: number; b: number; l: number; r: number }[] = [];
    for (const c of Array.from(rg.getClientRects())) {
      if (c.width < 1) continue;
      const L = lines.find((l) => Math.abs(l.t - c.top) < 4 * k);
      if (L) {
        L.l = Math.min(L.l, c.left);
        L.r = Math.max(L.r, c.right);
      } else lines.push({ t: c.top, b: c.bottom, l: c.left, r: c.right });
    }
    const fs = parseFloat(getComputedStyle(p).fontSize) || 15;
    const geo = lines.map((L) => ({
      y: Math.round(((L.t + L.b) / 2 - pr.top) / k + fs * 0.06) + 0.5, // through the x-height
      x1: ((L.l - pr.left) / k - 2).toFixed(1),
      x2: ((L.r - pr.left) / k + 2).toFixed(1),
    }));
    const key = geo.map((g) => `${g.x1},${g.x2},${g.y}`).join(";");
    if (struck.get(svg) === key) return;
    struck.set(svg, key);
    svg.textContent = "";
    geo.forEach((g, i) => {
      const ln = document.createElementNS(SVGNS, "line");
      ln.setAttribute("x1", g.x1);
      ln.setAttribute("x2", g.x2);
      ln.setAttribute("y1", String(g.y));
      ln.setAttribute("y2", String(g.y));
      ln.setAttribute("pathLength", "1");
      ln.style.transitionDelay = `${i * 140}ms`;
      svg.appendChild(ln);
    });
  };
  const strikeAll = () => items.forEach(strike);
  strikeAll();
  root.classList.add("is-ink");

  const sizes = new WeakMap<Element, string>();
  const ro = new ResizeObserver((es) => {
    for (const e of es) {
      const w = `${Math.round(e.contentRect.width)}x${Math.round(e.contentRect.height)}`;
      if (sizes.get(e.target) === w) continue;
      sizes.set(e.target, w);
      const it = e.target.closest<HTMLElement>(`.${P}__item`);
      if (it) strike(it);
      if (cur) mate(cur); // a reflow while a card is open: keep it the height of its mate's row
    }
  });
  items.forEach((it) => {
    const p = q("was", it);
    if (p) ro.observe(p);
  });
  undo.push(() => ro.disconnect());
  /* a late font can re-break a line without resizing its box: re-measure when fonts settle */
  const fonts = document.fonts;
  const later = () => {
    raf(() => raf(strikeAll));
    fonts?.ready.then(() => raf(strikeAll));
  };
  fonts?.ready.then(() => {
    if (!dead) strikeAll();
  });
  if (fonts?.addEventListener) {
    fonts.addEventListener("loadingdone", later);
    undo.push(() => fonts.removeEventListener("loadingdone", later));
  }

  /* ── the detail cards ── */
  let cur: HTMLElement | null = null;
  let hov: HTMLElement | null = null;
  let armed: HTMLElement | null = null;
  let lastPtr = "";
  let warm = 0;
  let timer = 0;
  const btn = (it: HTMLElement) => q<HTMLButtonElement>("slot", it)!;
  const fv = (b: Element) => {
    try {
      return b.matches(":focus-visible");
    } catch {
      return true;
    }
  };
  const focused = () => {
    const f = document.activeElement;
    const it = f?.parentElement;
    return f && it && items.includes(it) && fv(f) ? it : null;
  };
  const open = (it: HTMLElement) => {
    window.clearTimeout(timer);
    if (root.classList.contains("is-deal") || cur === it) return; // never while the spread runs
    if (cur) shut(cur);
    cur = it;
    mate(it);
    it.classList.add("is-open");
    btn(it).setAttribute("aria-expanded", "true");
  };
  /* phone: the card lies over the pair-mate's row (pairs are 01·02, 03·04, 05·06), as tall as that row */
  const mate = (it: HTMLElement) => {
    const m = items[items.indexOf(it) ^ 1];
    if (m) it.style.setProperty("--mate-h", `${m.offsetHeight}px`);
  };
  const shut = (it: HTMLElement | null) => {
    if (!it || cur !== it) return;
    cur = null;
    warm = Date.now();
    it.classList.remove("is-open");
    btn(it).setAttribute("aria-expanded", "false");
  };
  items.forEach((it) => {
    const b = btn(it);
    listen(it, "pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      hov = it;
      window.clearTimeout(timer);
      if (cur || Date.now() - warm < 400) open(it); // moving between sheets: no second delay
      else
        timer = window.setTimeout(() => {
          if (hov === it) open(it);
        }, 90);
    });
    /* after the hand-back, a pointer that was already resting here opens the card on its first move, never by itself */
    listen(it, "pointermove", (e) => {
      if (e.pointerType !== "mouse" || armed !== it) return;
      armed = null;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (hov === it) open(it);
      }, 90);
    });
    listen(it, "pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      if (hov === it) hov = null;
      if (armed === it) armed = null;
      window.clearTimeout(timer);
      shut(it);
      const f = focused();
      if (f && f !== it) open(f); // hand back to the keyboard's sheet
    });
    listen(b, "pointerdown", (e) => {
      lastPtr = e.pointerType;
    });
    listen(b, "focus", () => {
      if (fv(b)) open(it);
    });
    listen(b, "blur", () => {
      if (hov !== it) shut(it);
    });
    listen(b, "click", (e) => {
      if (e.detail !== 0 && lastPtr === "mouse") {
        open(it); // mouse: hover already opened it
        return;
      }
      if (cur === it) shut(it);
      else open(it); // Enter / Space and taps toggle
    });
  });
  listen(document, "keydown", (e) => {
    if (cur && (e.key === "Escape" || e.key === "Esc")) shut(cur);
  });
  listen(document, "pointerdown", (e) => {
    if (cur && !cur.contains(e.target as Node)) shut(cur);
  });
  /* the spread hands back: the keyboard's sheet opens at once; a sheet the pointer merely rests on waits for a move,
     so no card pops up uninvited as the payoff ends */
  const settled = () => {
    const f = focused();
    if (f) {
      open(f);
      return;
    }
    armed = hov;
  };

  /* restore the server-rendered final state (cleanup, so a re-init starts clean) */
  const revert = () => {
    root.classList.remove("is-ink", "is-deal", "is-gone", "ac-cold", "is-narrow-in");
    items.forEach((it) => {
      it.classList.remove("is-struck", "is-home", "is-open");
      it.style.removeProperty("--mate-h");
      btn(it).setAttribute("aria-expanded", "false");
      const svg = q("strike", it);
      if (svg) svg.textContent = "";
    });
  };
  const teardown = () => {
    dead = true;
    window.clearTimeout(timer);
    frames.forEach((id) => cancelAnimationFrame(id));
    frames.clear();
    undo.splice(0).reverse().forEach((fn) => fn());
    revert();
  };

  if (reduced || narrow.matches) return teardown; // the final state

  /* ── the opening state: every sheet back in the stack, every after waiting, nothing struck ── */
  const W = btn(items[0]).offsetWidth;
  const edge = off(datum).x; // the datum line, from the root's left
  const D = off(deck);
  const STACK = 3;
  const S: Sheet[] = items.map((it, n) => {
    const el = q("sheet", it)!;
    return { it, el, d: q<SVGElement>("draft", it)!, o: q<SVGElement>("own", it)!, p: off(el), n, x: 0, y: 0, a: 0, sx: 0, sy: 0 };
  });
  const apply = (s: Sheet) => {
    s.el.style.transform = `translate(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px)`;
    s.el.style.opacity = String(s.a);
    const w = Math.max(0, Math.min(W, edge - (s.p.x + s.x))); // how much of the sheet is still on Kelwin's side
    s.d.style.clipPath = `inset(0 ${(W - w).toFixed(2)}px 0 0)`;
    s.o.style.clipPath = `inset(0 0 0 ${w.toFixed(2)}px)`;
  };
  const release = (s: Sheet) => {
    s.el.style.transform = "";
    s.el.style.zIndex = "";
    s.el.style.opacity = "";
    s.d.style.clipPath = "";
    s.o.style.clipPath = "";
    s.it.classList.add("is-home");
  };

  root.classList.add("ac-cold", "is-deal");
  S.forEach((s) => {
    s.sx = D.x + STACK * s.n - s.p.x; // 01 on the footprint, 06 on top, 3px steps
    s.sy = D.y - s.p.y;
    s.x = s.sx;
    s.y = s.sy - 10;
    s.a = 0;
    s.el.style.zIndex = String(10 + s.n);
    apply(s);
  });
  void root.offsetWidth;
  root.classList.remove("ac-cold");

  const home = !!root.closest(".km-home");
  /* the spread: 06 first, all in the same time. RUN 1.1s on a quadratic in-out keeps the longest travel (06, ~1140px)
     calm enough to watch each edge turn solid at the line. */
  const T0 = 1.2;
  const STAG = 0.07;
  const RUN = 1.1;
  const CAD = 0.18;
  const tl = gsap.timeline({ paused: true });
  let delayed: gsap.core.Tween | null = null;
  let io: IntersectionObserver | null = null;

  /* the drafts are laid on the stack: 01 first, 06 last and on top. Each one is opaque within 0.1s, so at most one
     sheet is ever see-through and the indices never overprint; the 10px drop carries the arrival. */
  S.forEach((s) => {
    const at = 0.3 + s.n * 0.07;
    tl.to(s, { a: 1, duration: 0.1, ease: "none", onUpdate: apply, onUpdateParams: [s] }, at);
    tl.to(s, { y: s.sy, duration: 0.38, ease: "power2.out", onUpdate: apply, onUpdateParams: [s] }, at);
  });

  /* the spread: 06 leaves first; the footprint shows as the stack clears */
  tl.call(() => root.classList.add("is-gone"), undefined, T0 + 0.2);
  let landed = 0;
  S.slice()
    .reverse()
    .forEach((s, i) => {
      const t = T0 + i * STAG;
      tl.to(s, { x: 0, duration: RUN, ease: "power1.inOut", onUpdate: apply, onUpdateParams: [s] }, t);
      tl.call(() => release(s), undefined, t + RUN);
      landed = Math.max(landed, t + RUN);
    });

  /* the payoff, in reading order: 01 → 06, each column posted, each before struck, each after up */
  S.forEach((s) => {
    tl.call(() => s.it.classList.add("is-struck"), undefined, landed + 0.05 + s.n * CAD);
  });
  /* hand back to the resting CSS once the last posting cue (640ms) has run out; the cards are live from here */
  const handBack = () => {
    root.classList.remove("is-deal", "is-gone");
    S.forEach((s) => s.it.classList.remove("is-struck", "is-home"));
    settled();
  };
  const last = landed + 0.05 + 5 * CAD;
  tl.call(handBack, undefined, last + 0.7);

  /* a resize before the hand-back would leave the stack's coordinates stale: finish at once, in the final state */
  const vw = window.innerWidth;
  const finish = () => {
    if (!root.classList.contains("is-deal")) return;
    tl.kill();
    delayed?.kill();
    io?.disconnect();
    S.forEach(release);
    handBack();
  };
  listen(window, "resize", () => {
    if (window.innerWidth !== vw) finish();
  });
  undo.push(() => {
    tl.kill();
    delayed?.kill();
    io?.disconnect();
    S.forEach((s) => {
      release(s);
      s.it.classList.remove("is-home");
    });
  });

  if (!home) {
    tl.play(0);
    return teardown;
  }

  /* homepage: the stack arrives now; the spread waits for the sheet row (60% in view), then for
     max(300ms, 1200ms − time since the section arrived), once */
  let go = false;
  tl.addPause(T0 - 0.15, () => {
    if (go) tl.play();
  });
  tl.play(0);
  const start = () => {
    go = true;
    if (tl.paused()) tl.play();
  };
  io = new IntersectionObserver(
    (es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io?.disconnect();
      delayed = gsap.delayedCall(Math.max(0.3, 1.2 - (Date.now() - born) / 1000), start);
    },
    { threshold: 0.6 },
  );
  io.observe(deck);
  return teardown;
};
