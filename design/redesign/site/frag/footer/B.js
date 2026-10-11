window.KM = {
  init(root) {
    // The band's location readout: London, hours and minutes (no seconds, no ticking theatre).
    const clock = root.querySelector("[data-clock]");
    const tzEl = root.querySelector("[data-tz]");
    const TZ = "Europe/London";
    try {
      const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      const zone = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, timeZoneName: "short" });
      const tick = () => {
        const now = new Date();
        if (clock) { clock.textContent = fmt.format(now); clock.setAttribute("datetime", now.toISOString()); }
        const p = tzEl && zone.formatToParts(now).find((x) => x.type === "timeZoneName");
        if (p) tzEl.textContent = p.value;
      };
      tick();
      setInterval(tick, 15000);
    } catch (e) { /* keep the static readout */ }

    // The colophon names the typefaces actually in use (true in either skin).
    const fontsEl = root.querySelector("[data-fonts]");
    const fam = (v) => (v || "").split(",")[0].replace(/["']/g, "").trim();
    const setFonts = () => {
      if (!fontsEl) return;
      const cs = getComputedStyle(root);
      const n = [fam(cs.getPropertyValue("--f-display")), fam(cs.getPropertyValue("--f-body")), fam(cs.getPropertyValue("--f-mono"))]
        .filter((x, i, a) => x && a.indexOf(x) === i);
      fontsEl.textContent = n.length > 1 ? n.slice(0, -1).join(", ") + " & " + n[n.length - 1] : n.join("");
    };
    setFonts();
    new MutationObserver(setFonts).observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });
  },
};
