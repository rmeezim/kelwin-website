window.KM = {
  init(root, { reduced } = {}) {
    // 1 · The end beat waits for the reader. The section plays as its top arrives, while the legal
    // row can still be well below the fold (a phone, a slow scroll). Until half the legal row is on
    // screen the root carries data-end="wait" and U.css holds the hairline, its + marks, © and the
    // controls, and the lockup's rise at their first frame; then they play in their order, so the
    // rise out of the line is seen. Fail-open: the flag is set only once the observer is watching.
    const legal = root.querySelector(".km-footer-U__legal");
    if (!reduced && legal && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting && e.intersectionRatio >= 0.49)) { io.disconnect(); delete root.dataset.end; }
      }, { threshold: [0, 0.5, 1] });
      io.observe(legal);
      root.dataset.end = "wait";
    }
    // 2 · The Contact strip's local-time readout (founder, round 9: the visitor's own location, not
    // London): the browser's own time zone, no IP lookup; the city is the zone's own city
    // ("America/New_York" → "New York"), UTC when the browser gives none. Hours and minutes only;
    // under reduced motion it is written once, with no timer.
    const clock = root.querySelector("[data-clock]");
    const tzEl = root.querySelector("[data-tz]");
    const cityEl = root.querySelector("[data-city]");
    if (!clock) return;
    let TZ = "UTC";
    try { TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) { /* keep UTC */ }
    // browsers may report a legacy zone name (Chromium: Asia/Calcutta); show today's city name
    const ALIAS = { Calcutta: "Kolkata", Saigon: "Ho Chi Minh City", Ho_Chi_Minh: "Ho Chi Minh City", Kiev: "Kyiv", Rangoon: "Yangon", Katmandu: "Kathmandu", Godthab: "Nuuk", Asmera: "Asmara" };
    const last = TZ.split("/").pop() || "UTC";
    const city = /^(Etc\/)?(UTC|GMT|UCT|Universal|Zulu)/i.test(TZ) ? "UTC" : (ALIAS[last] || last.replace(/_/g, " "));
    if (cityEl) cityEl.textContent = city;
    let fmt, zones;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      zones = ["en-US", "en-GB"].map((l) => new Intl.DateTimeFormat(l, { timeZone: TZ, timeZoneName: "short" }));
    } catch (e) { return; }
    const zoneName = (now) => {
      const names = zones.map((z) => (z.formatToParts(now).find((x) => x.type === "timeZoneName") || {}).value || "");
      return names.find((n) => /^[A-Z]{2,5}$/.test(n)) || names[0];
    };
    const tick = () => {
      const now = new Date();
      clock.textContent = fmt.format(now);
      clock.setAttribute("datetime", now.toISOString());
      if (tzEl && city !== "UTC") tzEl.textContent = zoneName(now);
    };
    tick();
    if (!reduced) setInterval(tick, 15000);
  },
};
