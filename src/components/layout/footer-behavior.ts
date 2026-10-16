import type { Behavior } from "@/components/home/types";

/* 11 · Footer (mockup: design/redesign/site/frag/footer/U.js).
   Two jobs.
   1 · The end beat waits for the reader. The slot plays as the footer's top arrives, while the
       legal row can still be a screen or more below the fold (a phone, where the four strips
       stack, or a slow scroll on any width). Until half the legal row is on screen the root
       carries data-end="wait", and Footer.css holds the legal hairline, its + marks, © and the
       controls, and the lockup's rise at their first frame; they then play in their order, so
       the lockup's rise out of the line is seen, not finished off-screen. Fail-open: the flag is
       set only once the observer is watching, so if anything here fails nothing is held.
   2 · The Contact strip's local-time readout (founder, round 9: "only show the clock for whichever
       location the visitor is actually located in"): the visitor's own browser time zone, no IP
       lookup; the city is the zone's own city ("America/New_York" → "New York"), UTC when the
       browser gives none. Hours and minutes only, refreshed every 15s. Nothing on the footer loops
       visibly; under reduced motion it is written once, with no timer, and the end beat is not
       held (there is no entrance to hold). */
export const init: Behavior = (root, { reduced }) => {
  const stops: Array<() => void> = [];
  const cleanup = () => stops.splice(0).forEach((stop) => stop());

  const legal = root.querySelector<HTMLElement>(".km-footer__legal");
  if (!reduced && legal && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.49)) {
          io.disconnect();
          delete root.dataset.end;
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(legal);
    root.dataset.end = "wait";
    stops.push(() => {
      io.disconnect();
      delete root.dataset.end;
    });
  }

  const clock = root.querySelector<HTMLTimeElement>("[data-clock]");
  const tzEl = root.querySelector<HTMLElement>("[data-tz]");
  const cityEl = root.querySelector<HTMLElement>("[data-city]");
  if (!clock) return cleanup;

  let TZ = "UTC";
  try {
    TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    /* keep UTC */
  }
  // browsers may report a legacy zone name (Chromium: Asia/Calcutta); show today's city name
  const ALIAS: Record<string, string> = { Calcutta: "Kolkata", Saigon: "Ho Chi Minh City", Ho_Chi_Minh: "Ho Chi Minh City", Kiev: "Kyiv", Rangoon: "Yangon", Katmandu: "Kathmandu", Godthab: "Nuuk", Asmera: "Asmara" };
  const last = TZ.split("/").pop() || "UTC";
  const city = /^(Etc\/)?(UTC|GMT|UCT|Universal|Zulu)/i.test(TZ) ? "UTC" : (ALIAS[last] || last.replace(/_/g, " "));
  if (cityEl) cityEl.textContent = city;

  let fmt: Intl.DateTimeFormat;
  let zones: Intl.DateTimeFormat[];
  try {
    fmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    // a lettered abbreviation where a locale has one (EDT, BST, CET), else the offset (GMT+5)
    zones = ["en-US", "en-GB"].map((l) => new Intl.DateTimeFormat(l, { timeZone: TZ, timeZoneName: "short" }));
  } catch {
    return cleanup;
  }
  const zoneName = (now: Date) => {
    const names = zones.map((z) => z.formatToParts(now).find((x) => x.type === "timeZoneName")?.value || "");
    return names.find((n) => /^[A-Z]{2,5}$/.test(n)) || names[0];
  };

  const tick = () => {
    const now = new Date();
    clock.textContent = fmt.format(now);
    clock.setAttribute("datetime", now.toISOString());
    if (tzEl && city !== "UTC") tzEl.textContent = zoneName(now);
  };

  tick();
  if (reduced) return cleanup;
  const timer = window.setInterval(tick, 15000);
  stops.push(() => window.clearInterval(timer));
  return cleanup;
};
