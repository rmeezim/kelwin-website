window.KM = {
  init(root) {
    // The contact strip's London readout: hours and minutes only, refreshed quietly
    // (A allows nothing to loop visibly except the hero film).
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
    setInterval(tick, 15000);
  },
};
