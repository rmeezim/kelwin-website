import type { Behavior } from "../types";

/* fit — the two ledgers. Port of the mockup's KM.init (design/redesign/site/frag/fit/U.js).
   · Each ledger opens in place, one row at a time; clicking the open row closes it. A click in
     one ledger stops only that ledger's timed reveal; a row still held for its reveal shows "+",
     so a click on it opens it.
   · The reveal: the two resting rows (F-02, D-01) keep their open height from the first frame, so
     the rows below them never move. Their answers are held (.is-pre) while the rows cascade in,
     then open in reading order — F-02 at 1300ms, D-01 at 1620ms.
   Reduced motion: the markup is the final state (F-02 + D-01 open) — no hold, no timers; the
   rows still open and close (an interaction, not motion).
   Cleanup removes every listener and timer and puts the rows back as the markup has them, so a
   strict-mode remount (init → cleanup → init) leaves exactly one live instance. */
export const init: Behavior = (root, { reduced }) => {
  const undo: Array<() => void> = [];
  const ledgers = Array.from(root.querySelectorAll<HTMLElement>(".km-fit__lg"));
  const pending = ledgers.map(() => 0); // one timed reveal per ledger

  const setRow = (row: HTMLElement, on: boolean) => {
    row.classList.remove("is-pre");
    row.classList.toggle("is-open", on);
    row.querySelector(".ac-row__head")?.setAttribute("aria-expanded", String(on));
    const more = row.querySelector<HTMLElement>(".ac-row__more");
    if (more) more.inert = !on;
  };

  // the markup's resting state, restored on cleanup
  const resting = ledgers.flatMap((lg) =>
    Array.from(lg.querySelectorAll<HTMLElement>(".ac-row")).map((row) => ({ row, open: row.classList.contains("is-open") })),
  );

  // ── the ledgers: one open row per ledger; clicking the open row closes it ──
  ledgers.forEach((lg, k) => {
    const rows = Array.from(lg.querySelectorAll<HTMLElement>(".ac-row"));
    rows.forEach((r) => {
      const head = r.querySelector<HTMLElement>(".ac-row__head");
      if (!head) return;
      const onClick = () => {
        window.clearTimeout(pending[k]); // the reader drives this ledger from here
        // a row still held for its reveal shows "+", so a click on it opens it
        const was = r.classList.contains("is-open") && !r.classList.contains("is-pre");
        rows.forEach((o) => setRow(o, false));
        if (!was) setRow(r, true);
      };
      head.addEventListener("click", onClick);
      undo.push(() => head.removeEventListener("click", onClick));
    });
  });

  // ── reveal (skipped under reduced motion: the markup is final) ──
  const open = ledgers.map((lg) => lg.querySelector<HTMLElement>(".ac-row.is-open"));
  if (!reduced && open.some(Boolean)) {
    root.classList.add("ac-cold");
    open.forEach((r) => r?.classList.add("is-pre"));
    void root.offsetHeight;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => root.classList.remove("ac-cold"));
    });
    [1300, 1620].forEach((t, k) => {
      const r = open[k];
      if (r) pending[k] = window.setTimeout(() => r.classList.remove("is-pre"), t);
    });
    undo.push(() => {
      cancelAnimationFrame(raf);
      pending.forEach((id) => window.clearTimeout(id));
    });
  }

  return () => {
    undo.forEach((fn) => fn());
    // back to the markup's state, without transitions
    root.classList.add("ac-cold");
    resting.forEach(({ row, open: on }) => setRow(row, on));
    void root.offsetHeight;
    root.classList.remove("ac-cold");
  };
};
