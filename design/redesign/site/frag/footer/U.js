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
    // 2 · The Contact strip's London readout: hours and minutes only. Nothing on the
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
