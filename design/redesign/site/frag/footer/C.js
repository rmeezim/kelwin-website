window.KM = {
  init(root, { reduced }) {
    // 1 · the colophon tells the truth about the typefaces in use (both skins)
    const fontsEl = root.querySelector("[data-fonts]");
    const fam = (v) => (v || "").split(",")[0].replace(/["']/g, "").trim();
    const setFonts = () => {
      if (!fontsEl) return;
      const cs = getComputedStyle(root);
      const names = [fam(cs.getPropertyValue("--f-display")), fam(cs.getPropertyValue("--f-body")), fam(cs.getPropertyValue("--f-mono"))]
        .filter((n, i, a) => n && a.indexOf(n) === i);
      fontsEl.textContent = names.join(" · ");
    };
    setFonts();
    new MutationObserver(setFonts).observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });

    // 2 · ambient: the UTC readout changes every 6s with a 200ms digit change
    const utc = root.querySelector("[data-utc]");
    const two = (n) => String(n).padStart(2, "0");
    const stamp = () => { const d = new Date(); return two(d.getUTCHours()) + ":" + two(d.getUTCMinutes()) + ":" + two(d.getUTCSeconds()); };
    if (utc) {
      utc.textContent = stamp();
      setInterval(() => {
        if (reduced) { utc.textContent = stamp(); return; }
        utc.classList.add("is-tick");
        setTimeout(() => { utc.textContent = stamp(); utc.classList.remove("is-tick"); }, 200);
      }, 6000);
    }

    // 3 · interaction: an X/Y readout follows the cursor on the frame edge
    const xy = root.querySelector(".km-footer-C__xy");
    if (xy) {
      root.addEventListener("pointermove", (e) => {
        const r = root.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
        xy.textContent = "X " + x.toFixed(2) + " · Y " + y.toFixed(2);
      });
    }

    // 4 · the red plane follows the parts list: hover / focus a part → its plane fills; rest = K3
    const REST = "3";
    const timers = [];
    const stopDemo = () => { while (timers.length) clearTimeout(timers.pop()); };
    root.querySelectorAll(".km-footer-C__part").forEach((a) => {
      const on = () => { stopDemo(); root.dataset.on = a.dataset.k; };
      const off = () => { root.dataset.on = REST; };
      a.addEventListener("pointerenter", on); a.addEventListener("focus", on);
      a.addEventListener("pointerleave", off); a.addEventListener("blur", off);
    });

    if (reduced) return;   // reduced motion: the fully plotted sheet, plane at rest in K3, no typing

    // 5 · entrance demo: once the lockup has plotted, the plane drops in at K1 and steps K1 → K2 → K3
    //     (1.2s per part; on the live site this is scroll-linked to the footer entering)
    root.dataset.on = "0";
    [["1", 2700], ["2", 3900], [REST, 5100]].forEach(([k, t]) => timers.push(setTimeout(() => { root.dataset.on = k; }, t)));

    // 6 · entrance: mono IDs and values type on (24ms per character), in raster order
    const els = Array.from(root.querySelectorAll("[data-type]"));
    const rows = els.map((el) => ({ el, text: el.textContent, r: el.getBoundingClientRect() }))
      .sort((a, b) => (Math.round(a.r.top / 24) - Math.round(b.r.top / 24)) || (a.r.left - b.r.left));
    rows.forEach((o, n) => {
      o.el.style.minWidth = Math.ceil(o.r.width) + "px";
      o.el.textContent = "";
      const start = 360 + n * 70;
      for (let i = 1; i <= o.text.length; i++) {
        setTimeout(() => { o.el.textContent = o.text.slice(0, i); }, start + i * 24);
      }
    });
  },
};
