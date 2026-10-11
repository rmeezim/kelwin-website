import type { Behavior } from "@/components/home/types";

/* 11 · Footer (mockup: design/redesign/site/frag/footer/U.js).
   The Contact strip's London readout: hours and minutes only, refreshed every 15s. Nothing on
   the footer loops visibly; under reduced motion it is written once, with no timer. */
export const init: Behavior = (root, { reduced }) => {
  const clock = root.querySelector<HTMLTimeElement>("[data-clock]");
  const tzEl = root.querySelector<HTMLElement>("[data-tz]");
  if (!clock) return;

  const TZ = "Europe/London";
  let fmt: Intl.DateTimeFormat;
  let zone: Intl.DateTimeFormat;
  try {
    fmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    zone = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, timeZoneName: "short" });
  } catch {
    return;
  }

  const tick = () => {
    const now = new Date();
    clock.textContent = fmt.format(now);
    clock.setAttribute("datetime", now.toISOString());
    if (tzEl) {
      const part = zone.formatToParts(now).find((x) => x.type === "timeZoneName");
      if (part) tzEl.textContent = part.value;
    }
  };

  tick();
  if (reduced) return;
  const timer = window.setInterval(tick, 15000);
  return () => window.clearInterval(timer);
};
