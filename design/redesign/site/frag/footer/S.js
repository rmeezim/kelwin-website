window.KM = {
  init(root, { reduced } = {}) {
    // The Contact strip's London readout: hours and minutes only. Nothing on the
    // footer loops visibly; under reduced motion it is written once, with no timer.
    const clock = root.querySelector("[data-clock]");
    const tzEl = root.querySelector("[data-tz]");
    if (!clock) return;
    const TZ = "Europe/London";
    let fmt, zone;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      zone = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, timeZoneName: "short" });
    } catch (e) { return; }
    const tick = () => {
      const now = new Date();
      clock.textContent = fmt.format(now);
      clock.setAttribute("datetime", now.toISOString());
      if (tzEl) {
        const p = zone.formatToParts(now).find((x) => x.type === "timeZoneName");
        if (p) tzEl.textContent = p.value;
      }
    };
    tick();
    if (!reduced) setInterval(tick, 15000);
  },
};
