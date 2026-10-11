"use client";

import { useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { reserveLedger } from "./reserve";

const noSubscribe = () => () => {};

/**
 * The ledger list with its height reserve (reserve.ts). The server HTML carries an inline script
 * right after the list that reserves before first paint, so a visitor who lands at or above the
 * section (reload, back/forward, a deep link, reduced motion) never sees the door step down when
 * the page hydrates. The script is part of the hydrated markup only: on a client render it is
 * never created (React would not run it, and warns), and after hydration it is dropped.
 * From hydration on, the reserve is re-measured whenever a row head or panel re-wraps (width, a
 * late font).
 */
export default function Ledger({ label, script, children }: { label: string; script: string; children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);
  // true while hydrating the server HTML, false on every client render
  const fromServer = useSyncExternalStore(
    noSubscribe,
    () => false,
    () => true,
  );

  useLayoutEffect(() => {
    const ledger = ref.current;
    if (!ledger) return;
    let live = true;
    let raf = 0;
    const reserve = () => reserveLedger(ledger);
    reserve();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(reserve);
    });
    ledger.querySelectorAll(".ac-row__head, .ac-row__in").forEach((el) => ro.observe(el));
    document.fonts?.ready.then(() => {
      if (live) reserve();
    });
    return () => {
      live = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      ledger.style.minHeight = "";
    };
  }, []);

  return (
    <>
      {/* the inline script sets min-height before hydration: that one attribute differs from the render */}
      <ol ref={ref} className="ac-ledger km-system__ledger" aria-label={label} suppressHydrationWarning>
        {children}
      </ol>
      {fromServer && <script dangerouslySetInnerHTML={{ __html: script }} />}
    </>
  );
}
