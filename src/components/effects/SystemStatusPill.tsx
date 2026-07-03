"use client";

import { useEffect, useState } from "react";

function formatGmt(d: Date) {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm} GMT`;
}

/**
 * SystemStatusPill — persistent KELWIN/OS identity in the bottom-left of
 * the viewport, outside any section. Reads as a one-system status bar
 * (LIVE indicator, GMT clock, OBS-1 frame label). Subtle but always on,
 * reinforcing that the whole page is one continuous instrument.
 *
 * Initial render matches between server and client (armed=false, fixed
 * time placeholder) — both branches flip after mount via the effect so
 * we never trigger a hydration mismatch.
 */
export default function SystemStatusPill() {
  const [time, setTime] = useState<string>("00:00 GMT");
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // Post-mount: arm the pill and start the clock. The set-state-in-effect
    // here is intentional — flipping from the SSR-safe initial to a
    // client-only resolved state is the textbook use case for this hook.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArmed(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(formatGmt(new Date()));
    const id = window.setInterval(() => setTime(formatGmt(new Date())), 30 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="sys-status-pill"
      data-armed={armed ? "true" : "false"}
      aria-hidden="true"
    >
      <span className="sys-status-pill-dot" />
      <span className="sys-status-pill-label">KELWIN/OS</span>
      <span className="sys-status-pill-divider" />
      <span className="sys-status-pill-state">ONLINE</span>
      <span className="sys-status-pill-divider" />
      <span className="sys-status-pill-time">{time}</span>
      <span className="sys-status-pill-divider" />
      <span className="sys-status-pill-frame">OBS-1</span>
    </div>
  );
}
