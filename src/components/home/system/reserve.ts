/**
 * Holds the ledger at its tallest state (closed heads + the tallest open panel) so the drawing's
 * frame, the "Find your weakest layer" door and everything below never move while rows open and
 * close. Opening and closing only change the panels' clipping wrappers, so the measure reads the
 * heads and every panel's inner block.
 *
 * Self-contained on purpose (no imports, no outer bindings): the server also inlines its source
 * (RESERVE_INLINE) so the reserve is in place before first paint, exactly as the mockup reserved
 * at script parse; Ledger.tsx keeps it live after hydration.
 */
export function reserveLedger(ledger: HTMLElement) {
  ledger.style.minHeight = "";
  const box = ledger.getBoundingClientRect().height;
  if (!box) return;
  let open = 0;
  let tallest = 0;
  ledger.querySelectorAll(".ac-row").forEach((row) => {
    const more = row.querySelector(".ac-row__more");
    const inner = row.querySelector(".ac-row__in");
    if (more) open += more.getBoundingClientRect().height;
    if (inner) tallest = Math.max(tallest, inner.getBoundingClientRect().height);
  });
  ledger.style.minHeight = Math.ceil(box - open + tallest) + 1 + "px";
}

/** The inline script emitted right after the server-rendered ledger: reserves at parse (before
 *  first paint) and again once the web fonts are in. Built on the server only, from the one
 *  reserveLedger above, and handed to Ledger.tsx as a string so server and client markup match. */
export const reserveInline = () =>
  `(function(l,r){if(!l)return;r(l);if(document.fonts)document.fonts.ready.then(function(){r(l)})})` +
  `(document.currentScript&&document.currentScript.previousElementSibling,${reserveLedger.toString()})`;
