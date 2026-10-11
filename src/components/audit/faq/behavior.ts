import type { Behavior } from "@/components/home/types";

/* faq — the ledger that opens in place. Port of the mockup's KM.init
   (design/redesign/site/frag/faq/U.js).
   · One row open at a time (or none): the + turns to −, the 1px selection rule draws across the
     row's top edge, and the answer unfolds in place. Clicking the open row closes it. Each head is
     a real button (aria-expanded / aria-controls); a closed answer is inert.
   · The one orchestrated moment: the ledger draws in closed, then row 01 (the top of the reading
     path) opens once at 1.6s, as the last row lands. The reader drives from the first click (it
     cancels that opening). No automatic handover after that.
   Reduced motion: the markup is the final state (01 open) — no entrance, no timers; the rows
   still open and close (an interaction, not motion).
   Cleanup removes every listener, timer and frame and puts the rows back as the markup has them,
   so a strict-mode remount (init → cleanup → init) leaves exactly one live instance. */
const OPEN_AT = 1600;

export const init: Behavior = (root, { reduced }) => {
  const rows = Array.from(root.querySelectorAll<HTMLElement>(".ac-row"));
  const resting = rows.findIndex((r) => r.classList.contains("is-open")); // the markup's open row
  const undo: Array<() => void> = [];
  let timer = 0;
  let raf = 0;

  // one row open at a time (or none): + turns to −, the selection rule draws, the answer unfolds
  const set = (n: number) => {
    rows.forEach((r, j) => {
      const on = j === n;
      r.classList.toggle("is-open", on);
      r.querySelector(".ac-row__head")?.setAttribute("aria-expanded", String(on));
      const more = r.querySelector<HTMLElement>(".ac-row__more");
      if (more) more.inert = !on;
    });
  };

  rows.forEach((r, j) => {
    const head = r.querySelector<HTMLElement>(".ac-row__head");
    if (!head) return;
    const onClick = () => {
      window.clearTimeout(timer); // the reader drives from the first click
      set(r.classList.contains("is-open") ? -1 : j);
    };
    head.addEventListener("click", onClick);
    undo.push(() => head.removeEventListener("click", onClick));
  });

  if (!reduced) {
    // the ledger draws in closed (no transition on the way), then 01 opens once, as the last row lands
    root.classList.add("ac-cold");
    set(-1);
    void root.offsetHeight;
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => root.classList.remove("ac-cold"));
    });
    timer = window.setTimeout(() => set(resting < 0 ? 0 : resting), OPEN_AT);
  }

  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(raf);
    undo.forEach((fn) => fn());
    // back to the markup's state, without transitions
    root.classList.add("ac-cold");
    set(resting);
    void root.offsetHeight;
    root.classList.remove("ac-cold");
  };
};
