import type { Behavior } from "../types";
import { CLOSE, HOME, LOOP, REST, STEP, T1 } from "./timing";

/* ── system · "Strata, closed" (round 6) ──────────────────────────────────────────────────────────
   The markup is the final state: installed, the return drawn, the ring on 03 closed, 01 selected and
   its row open. One rule holds throughout: the red slab, its bright callout and the ledger's open row
   are always the same layer — show(n) moves all of them at once.
   Sequence (once, ~6.5s, a brisk skim that hands over to the reader): the three slabs drop in exploded
   (pitch 176), 01 → 03, one STEP apart. Each lands with its top face red and draws its inscription, and
   its ledger row opens as the red arrives (the previous row closes with the accordion's own 360ms ease).
   One beat after 03 lands the stack closes up to its installed pitch (132) while the dimension
   re-measures "3 layers" → "1 system"; the return line draws from slab 03 back up into slab 01, the ring
   on 03 closes, and the red, with its row, lands back on 01 as the arrow arrives, where it rests.
   Both sides are controls, kept in step by show(n): a slab (or its callout) and its row. Pressing either
   (click, tap, Enter or Space) stops the pass at once, finishes the drawing and shows that layer; moving
   into the drawing or the list with the keyboard stops it too, so nothing changes under focus. The pointer
   goes to the visible slab faces (the slab on top is the one pressed); the role=button hit layer is the
   keyboard stop. Hovering a slab, its callout or its row (mouse/pen) brightens that slab and its callout
   and nudges the row's title.
   The section's head and ledger enter when the section plays (Slot); the drawing's pass waits until the
   figure itself is a third in view, then plays once — no pin, no loop, no replay on scrolling back.
   The ledger's height reserve (no layout shift) is held from hydration by Ledger.tsx.
   Reduced motion: the markup's final state, no timers; every control works. */

const layer = (el: Element) => Number(el.getAttribute("data-l"));
const isSpace = (e: KeyboardEvent) => e.key === " " || e.key === "Spacebar";

export const init: Behavior = (root, { reduced }) => {
  const body = root.querySelector<HTMLElement>(".km-system__body");
  const fig = root.querySelector<HTMLElement>(".km-system__fig");
  const detail = root.querySelector<HTMLElement>(".km-system__detail");
  const ledger = root.querySelector<HTMLElement>(".km-system__ledger");
  if (!body || !fig || !detail || !ledger) return;
  const slabs = Array.from(root.querySelectorAll<SVGGElement>(".km-system__s"));
  const cos = Array.from(root.querySelectorAll<HTMLElement>(".km-system__co"));
  const callouts = cos.map((c) => c.querySelector<HTMLElement>(".ac-callout"));
  const rows = Array.from(ledger.querySelectorAll<HTMLElement>(".ac-row"));
  const heads = rows.map((r) => r.querySelector<HTMLElement>(".ac-row__head"));
  const hits = Array.from(root.querySelectorAll<SVGGElement>(".km-system__hit"));

  const timers: number[] = [];
  const listeners = new AbortController();
  const { signal } = listeners;
  let done = false;
  let io: IntersectionObserver | null = null;

  // the selected layer's control, in the list and in the drawing: expanded and current. One row is always
  // open, so pressing the current one keeps it open — it is the current layer, not an unavailable control
  // (aria-current, never aria-disabled, which reads as "unavailable")
  const expand = (el: Element, on: boolean) => {
    el.setAttribute("aria-expanded", String(on));
    if (on) el.setAttribute("aria-current", "true");
    else el.removeAttribute("aria-current");
  };

  // show(n): the red face (with its 8-unit lift), its bright callout, the ledger's current-row rule and the
  // open row all move to layer n, together
  const show = (n: number) => {
    fig.setAttribute("data-sel", String(n));
    slabs.forEach((s) => s.classList.toggle("is-on", layer(s) === n));
    cos.forEach((c, i) => {
      const on = layer(c) === n;
      c.classList.toggle("is-on", on);
      callouts[i]?.classList.toggle("is-on", on);
    });
    rows.forEach((r, i) => {
      const on = layer(r) === n;
      r.classList.toggle("is-cur", on);
      r.classList.toggle("is-open", on);
      const h = heads[i];
      if (h) expand(h, on);
    });
    hits.forEach((h) => {
      const on = layer(h) === n;
      h.classList.toggle("is-on", on);
      expand(h, on);
    });
  };
  // live(n): during the pass a slab (and its callout) takes the pointer once it has landed
  const live = (n: number) => {
    slabs.forEach((s) => {
      if (layer(s) <= n) s.classList.remove("is-wait");
    });
    cos.forEach((c) => {
      if (layer(c) <= n) c.classList.remove("is-wait");
    });
  };
  // hover(n, on): the slab's outline comes up to paper, its callout brightens and its row's title takes the
  // kit's 6px hover nudge, from whichever of the three the pointer is on
  const hover = (n: number, on: boolean) => {
    slabs.forEach((s) => {
      if (layer(s) === n) s.classList.toggle("is-hover", on);
    });
    rows.forEach((r) => {
      if (layer(r) === n) r.classList.toggle("is-hover", on);
    });
    cos.forEach((c, i) => {
      if (layer(c) === n) callouts[i]?.classList.toggle("is-hover", on);
    });
  };

  const at = (fn: () => void, t: number) => {
    timers.push(window.setTimeout(fn, t));
  };
  const clearTimers = () => {
    timers.forEach((t) => window.clearTimeout(t));
    timers.length = 0;
  };
  // retire the entrance hooks: nothing can replay a fade
  const settle = () => {
    body.classList.remove("is-armed", "is-go");
    root.classList.add("is-settled");
  };
  // stop the pass; jump to the resting drawing: installed, loop and ring closed
  const finish = () => {
    clearTimers();
    io?.disconnect();
    io = null;
    fig.classList.remove("is-exploded", "is-unlooped");
    live(3);
    settle();
    done = true;
  };
  // activate(n): any press, on either side, stops the pass and shows that layer
  const activate = (n: number) => {
    if (!done) finish();
    show(n);
  };
  // mouse and pen only: a tap must not leave a hover behind
  const hoverable = (el: Element, n: number) => {
    el.addEventListener(
      "pointerenter",
      (e) => {
        if ((e as PointerEvent).pointerType !== "touch") hover(n, true);
      },
      { signal },
    );
    el.addEventListener("pointerleave", () => hover(n, false), { signal });
  };

  rows.forEach((r, i) => {
    const h = heads[i];
    if (!h) return;
    const n = layer(r);
    h.addEventListener("click", () => activate(n), { signal });
    hoverable(h, n);
  });
  // the slabs, pointer and touch: the visible faces take the press, so the slab on top is the one pressed
  slabs.forEach((s) => {
    const n = layer(s);
    s.addEventListener("click", () => activate(n), { signal });
    hoverable(s, n);
  });
  // the slabs, keyboard and assistive tech: role=button on the hit layer (Enter on keydown, Space on keyup, as
  // a native button; click covers a screen reader's activation)
  hits.forEach((h) => {
    const n = layer(h);
    h.addEventListener("click", () => activate(n), { signal });
    h.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          activate(n);
        } else if (isSpace(e)) e.preventDefault(); // no page scroll
      },
      { signal },
    );
    h.addEventListener(
      "keyup",
      (e) => {
        if (isSpace(e)) {
          e.preventDefault();
          activate(n);
        }
      },
      { signal },
    );
  });
  // a slab's callout is part of it (pointer only: the slab is the keyboard stop)
  cos.forEach((c, i) => {
    const co = callouts[i];
    if (!co) return;
    const n = layer(c);
    co.addEventListener("click", () => activate(n), { signal });
    hoverable(co, n);
  });
  // a reader who moves into the drawing or the list (Tab, or the focus a press gives) takes it over: the pass
  // stops where it is, and nothing opens or closes under their focus (a click lands here first, then shows)
  const takeOver = () => {
    if (!done) finish();
  };
  ledger.addEventListener("focusin", takeOver, { signal });
  fig.addEventListener("focusin", takeOver, { signal });

  const cleanup = () => {
    clearTimers();
    io?.disconnect();
    io = null;
    listeners.abort();
    body.classList.remove("is-armed", "is-go");
    fig.classList.remove("is-exploded", "is-unlooped", "ac-cold");
    detail.classList.remove("ac-cold");
    root.classList.remove("is-settled");
    slabs.forEach((s) => s.classList.remove("is-wait", "is-hover"));
    cos.forEach((c) => c.classList.remove("is-wait"));
    callouts.forEach((c) => c?.classList.remove("is-hover"));
    rows.forEach((r) => r.classList.remove("is-hover"));
    show(1); // the markup's resting state
  };

  // the markup already is the final drawing: reduced motion, or a reader already inside the list
  const active = document.activeElement;
  if (reduced || (active && (ledger.contains(active) || fig.contains(active)))) {
    done = true;
    root.classList.add("is-settled");
    return cleanup;
  }

  // opening state, set without transitions: exploded, loop and ring open, 01 shown, the figure hidden until it
  // plays, and no slab takes the pointer before it has landed
  fig.classList.add("ac-cold");
  detail.classList.add("ac-cold");
  body.classList.add("is-armed");
  fig.classList.add("is-exploded", "is-unlooped");
  slabs.forEach((s) => s.classList.add("is-wait"));
  cos.forEach((c) => c.classList.add("is-wait"));
  show(1);
  void fig.getBoundingClientRect();
  fig.classList.remove("ac-cold");
  detail.classList.remove("ac-cold");

  const play = () => {
    body.classList.add("is-go");
    // installed layer by layer: slabs drop at T1, T1 + STEP, T1 + 2·STEP (the markup's delays), each red while
    // it lands, and its row opens with it
    at(() => live(1), T1);
    at(() => {
      show(2);
      live(2);
    }, T1 + STEP);
    at(() => {
      show(3);
      live(3);
    }, T1 + 2 * STEP);
    at(() => fig.classList.remove("is-exploded"), CLOSE); // the stack closes up (700ms)
    at(() => fig.classList.remove("is-unlooped"), LOOP); //  the return draws (1000ms); the ring closes with it
    at(() => show(1), HOME); //                              the red, and its row, land back on 01
    at(() => {
      done = true;
      timers.length = 0;
      settle();
    }, REST);
  };

  // the pass plays once, when about a third of the drawing is in view — at once if it already is (in step with
  // the head, which starts as the section plays), otherwise when the reader scrolls it in
  const r = fig.getBoundingClientRect();
  const seen = r.height > 0 ? (Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)) / r.height : 0;
  if (seen >= 0.3 || !("IntersectionObserver" in window)) play();
  else {
    io = new IntersectionObserver(
      (entries) => {
        if (io && entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.29)) {
          io.disconnect();
          io = null;
          play();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(fig);
  }

  return cleanup;
};
