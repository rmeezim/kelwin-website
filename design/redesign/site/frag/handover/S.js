/* handover · S — the deal.
   Each asset is one gesture: its dashed sheet leaves the stack on Kelwin's side, slides along the lane,
   turns solid exactly as it crosses the surface edge (the draft and owned copies are split at the edge,
   frame by frame), turns into its slot, and on landing its before line is struck (SVG hairline, 300ms)
   and its after line rises in. Standalone: plays on is-play and ends by ~5.9s. On the homepage
   (html.km-home) the stack arrives with the head and the deal waits until the lane under the tray (where
   the sheets travel) is fully in view, so no sheet ever crosses below the fold.
   Reduced motion, narrow screens or no GSAP: the final state, synchronously, no timers. */
window.KM = {
  init: function (root, opts) {
    var reduced = !!(opts && opts.reduced);
    var P = "km-handover-S";
    var SVGNS = "http://www.w3.org/2000/svg";
    var $ = function (s, el) { return (el || root).querySelector(s); };
    var $$ = function (s, el) { return Array.prototype.slice.call((el || root).querySelectorAll(s)); };
    var items = $$("." + P + "__item");
    var band = $("." + P + "__side");
    var deck = $("." + P + "__deck");
    if (!items.length || !band || !deck) return;

    /* layout offset of el inside the section root (ignores transforms and page zoom) */
    function off(el) { var x = 0, y = 0; for (var e = el; e && e !== root; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return { x: x, y: y }; }

    /* ── strikes: one hairline per rendered line of the before text ── */
    function strike(it) {
      var p = $("." + P + "__was", it), t = $("." + P + "__was-t", it), svg = $("." + P + "__strike", it);
      if (!p || !t || !svg) return;
      var pr = p.getBoundingClientRect();
      var k = (pr.width / (p.offsetWidth || 1)) || 1;
      var rg = document.createRange(); rg.selectNodeContents(t);
      var lines = [];
      Array.prototype.forEach.call(rg.getClientRects(), function (c) {
        if (c.width < 1) return;
        for (var i = 0; i < lines.length; i++) if (Math.abs(lines[i].t - c.top) < 4 * k) { lines[i].l = Math.min(lines[i].l, c.left); lines[i].r = Math.max(lines[i].r, c.right); return; }
        lines.push({ t: c.top, b: c.bottom, l: c.left, r: c.right });
      });
      var cs = getComputedStyle(p), fs = parseFloat(cs.fontSize) || 15;
      svg.textContent = "";
      lines.forEach(function (L, i) {
        /* through the x-height: a little below the middle of the glyph box */
        var y = Math.round(((L.t + L.b) / 2 - pr.top) / k + fs * 0.06) + 0.5;
        var ln = document.createElementNS(SVGNS, "line");
        ln.setAttribute("x1", ((L.l - pr.left) / k - 2).toFixed(1));
        ln.setAttribute("x2", ((L.r - pr.left) / k + 2).toFixed(1));
        ln.setAttribute("y1", y); ln.setAttribute("y2", y);
        ln.setAttribute("pathLength", "1");
        ln.style.transitionDelay = (i * 150) + "ms";
        svg.appendChild(ln);
      });
    }
    function strikeAll() { items.forEach(strike); }
    strikeAll();
    root.classList.add("is-ink");   /* the SVG strikes exist now: drop the no-JS line-through fallback */
    /* re-measure when a line re-wraps (skin or font change) */
    if ("ResizeObserver" in window) {
      var sizes = new WeakMap();
      var ro = new ResizeObserver(function (es) {
        es.forEach(function (e) {
          var w = Math.round(e.contentRect.width) + "x" + Math.round(e.contentRect.height);
          if (sizes.get(e.target) === w) return; sizes.set(e.target, w);
          var it = e.target.closest("." + P + "__item"); if (it) strike(it);
        });
      });
      items.forEach(function (it) { var p = $("." + P + "__was", it); if (p) ro.observe(p); });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(strikeAll);

    var narrow = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
    if (reduced || narrow || typeof window.gsap === "undefined") return;   // final state

    /* ── set the opening state: every sheet back on the stack, every after waiting, no strikes ── */
    var gsap = window.gsap;
    var W = 64;
    var edge = off(band).x + band.offsetWidth;
    var D = off(deck);
    var LANE = (deck.offsetHeight - 90) / 2; /* a travelling sheet's top inside the lane under the tray */
    var S = items.map(function (it, n) {
      var el = $("." + P + "__sheet", it);
      return { it: it, el: el, d: $("." + P + "__draft", it), o: $("." + P + "__owned", it), p: off(el), n: n, x: 0, y: 0 };
    });
    function apply(s) {
      s.el.style.transform = "translate(" + s.x.toFixed(2) + "px," + s.y.toFixed(2) + "px)";
      var w = Math.max(0, Math.min(W, edge - (s.p.x + s.x)));   /* how much of the sheet is still on Kelwin's side */
      s.d.style.clipPath = "inset(0 " + (W - w).toFixed(2) + "px 0 0)";
      s.o.style.clipPath = "inset(0 0 0 " + w.toFixed(2) + "px)";
    }
    function release(s) { s.el.style.transform = ""; s.el.style.zIndex = ""; s.el.style.opacity = ""; s.d.style.clipPath = ""; s.o.style.clipPath = ""; }

    root.classList.add("ac-cold");
    root.classList.add("is-deal");
    S.forEach(function (s) {
      /* the stack: 01 in front at the lane, each later sheet 4px up and to the right behind it */
      s.sx = D.x + 4 * s.n - s.p.x; s.sy = D.y + LANE + 10 - 4 * s.n - s.p.y;
      s.x = s.sx; s.y = s.sy - 8;
      s.el.style.zIndex = 10 - s.n; s.el.style.opacity = 0;
      apply(s);
    });
    void root.offsetWidth;
    root.classList.remove("ac-cold");

    var home = document.documentElement.classList.contains("km-home");
    var T0 = 1.45, CAD = 0.46;            /* the first deal once the tray has settled; then one asset every .46s */
    var tl = gsap.timeline({ paused: true });

    /* the stack arrives with the head: 06 first, 01 last and on top */
    S.slice().reverse().forEach(function (s, i) {
      var at = 0.22 + i * 0.07;
      tl.to(s.el, { opacity: 1, duration: 0.35, ease: "power1.out" }, at);
      tl.to(s, { y: s.sy, duration: 0.45, ease: "power2.out", onUpdate: apply, onUpdateParams: [s] }, at);
    });

    /* the deal: one asset at a time, 01 → 06 */
    var last = 0;
    S.forEach(function (s) {
      var t0 = T0 + s.n * CAD;
      var dS = 0.45 + Math.abs(s.sx) * 0.00045;            /* ≈ .60s to col 4, .75s to col 7, .90s to col 10 */
      var laneY = D.y + LANE - s.p.y;                       /* the lane, measured from this sheet's slot */
      var dR = 0.3 + Math.abs(laneY) * 0.0006;              /* the turn into the slot: row 2 ≈ .36s, row 1 (through row 2's empty slot) ≈ .5s */
      var land = t0 + dS - 0.08 + dR;
      tl.set(s.el, { zIndex: 30 }, t0);
      tl.to(s, { x: 0, duration: dS, ease: "power2.inOut", onUpdate: apply, onUpdateParams: [s] }, t0);
      tl.to(s, { y: laneY, duration: dS * 0.4, ease: "sine.inOut", onUpdate: apply, onUpdateParams: [s] }, t0);
      tl.to(s, { y: 0, duration: dR, ease: "power2.out", onUpdate: apply, onUpdateParams: [s] }, t0 + dS - 0.08);
      tl.call(function () { release(s); s.it.classList.add("is-landed"); }, null, land);
      last = Math.max(last, land);
    });
    tl.call(function () { root.classList.add("is-done"); }, null, last + 0.42);
    tl.call(function () { root.classList.remove("is-deal"); root.classList.remove("is-done"); }, null, last + 1.4);

    if (!home) { tl.play(0); return; }

    /* homepage: the stack arrives now; the deal waits until the lane is fully in view, once */
    var go = false;
    tl.addPause(T0 - 0.01, function () { if (go) tl.play(); });
    tl.play(0);
    if (!("IntersectionObserver" in window)) { go = true; return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        go = true; io.disconnect();
        if (tl.paused()) tl.play();
      });
    }, { threshold: 0.98 });
    io.observe(deck);
  }
};
