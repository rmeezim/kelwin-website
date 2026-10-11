/* handover · U — the spread, revived (round 5: decluttered, with detail cards).
   Opening state: the six dashed drafts stand as a stack on the footprint at the figure's left end (01 at the
   back, 06 on top), your side shows six dotted places, every name is up, every before line still stands,
   every after waits.
   The spread (the approved round-2 move): the stack fans out across the Handover datum in one row. The top
   sheet (06) leaves first and the rest follow 70ms apart, all in the same time, so the order holds: sheets
   only ever separate, none passes over another sheet or a label. Each sheet's edge turns from dashed to solid,
   and its rough page becomes the finished page, exactly where it crosses the line (the draft and owned copies
   are clipped at the datum every frame).
   The payoff, in reading order 01 → 06: each asset's column lights once and its sheet edge inks (the posting
   cue) while its before line is struck by a drawn hairline and its after line rises in. Each sheet's index
   shows on your side only once it has landed in its own slot (.is-home), and the dotted way across fades out
   when the spread hands back to the resting CSS (~0.7s after the last posting cue).
   Detail cards (round 5): each sheet is a disclosure button. Hover (mouse, after a 90ms intent delay; instant
   when moving between sheets), keyboard focus (focus-visible) or a tap opens its card; leaving, blur, Escape or
   a tap elsewhere closes it. Enter/Space and taps toggle. Never while the spread runs: at the hand-back the
   keyboard's sheet opens, and a sheet the pointer is resting on opens on the pointer's first move.
   Standalone: plays on is-play; settled by ~4.3s. Homepage (html.km-home): the stack arrives with the section;
   the spread waits for the sheet row to be 60% in view, then for max(300ms, 1200ms − time since the section
   arrived), and plays once.
   Reduced motion, ≤760px, or no GSAP: the final state, synchronously, no timers; the cards work at once. */
window.KM = {
  init: function (root, opts) {
    var reduced = !!(opts && opts.reduced);
    var P = "km-handover-U";
    var SVGNS = "http://www.w3.org/2000/svg";
    var born = Date.now();
    var $ = function (s, el) { return (el || root).querySelector(s); };
    var $$ = function (s, el) { return Array.prototype.slice.call((el || root).querySelectorAll(s)); };
    var items = $$("." + P + "__item");
    var datum = $("." + P + "__datum");
    var deck = $("." + P + "__deck");
    if (!items.length || !datum || !deck) return;

    /* layout offset of el inside the section root (ignores transforms and the homepage zoom) */
    function off(el) { var x = 0, y = 0; for (var e = el; e && e !== root; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return { x: x, y: y }; }

    /* ── strikes: one SVG hairline per rendered line of the before text (never text-decoration) ── */
    function strike(it) {
      var p = $("." + P + "__was", it), t = $("." + P + "__was-t", it), svg = $("." + P + "__strike", it);
      if (!p || !t || !svg) return;
      var pr = p.getBoundingClientRect();
      var k = (pr.width / (p.offsetWidth || 1)) || 1;           /* page zoom on the stitched homepage */
      var rg = document.createRange(); rg.selectNodeContents(t);
      var lines = [];
      Array.prototype.forEach.call(rg.getClientRects(), function (c) {
        if (c.width < 1) return;
        for (var i = 0; i < lines.length; i++) if (Math.abs(lines[i].t - c.top) < 4 * k) { lines[i].l = Math.min(lines[i].l, c.left); lines[i].r = Math.max(lines[i].r, c.right); return; }
        lines.push({ t: c.top, b: c.bottom, l: c.left, r: c.right });
      });
      var fs = parseFloat(getComputedStyle(p).fontSize) || 15;
      svg.textContent = "";
      lines.forEach(function (L, i) {
        var y = Math.round(((L.t + L.b) / 2 - pr.top) / k + fs * 0.06) + 0.5;   /* through the x-height */
        var ln = document.createElementNS(SVGNS, "line");
        ln.setAttribute("x1", ((L.l - pr.left) / k - 2).toFixed(1));
        ln.setAttribute("x2", ((L.r - pr.left) / k + 2).toFixed(1));
        ln.setAttribute("y1", y); ln.setAttribute("y2", y);
        ln.setAttribute("pathLength", "1");
        ln.style.transitionDelay = (i * 140) + "ms";
        svg.appendChild(ln);
      });
    }
    function strikeAll() { items.forEach(strike); }
    strikeAll();
    root.classList.add("is-ink");
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
    /* a skin or font change can re-break a line without resizing its box: re-measure on both */
    function later() { requestAnimationFrame(function () { requestAnimationFrame(strikeAll); }); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(strikeAll); }); }
    if ("MutationObserver" in window) new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin", "class", "style"] });
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", later);

    /* ── the detail cards ── */
    var cur = null, hov = null, armed = null, lastPtr = "", warm = 0, timer = 0;
    function btn(it) { return $("." + P + "__slot", it); }
    function fv(b) { try { return b.matches(":focus-visible"); } catch (e) { return true; } }
    function focused() { var f = document.activeElement; return f && f.parentElement && items.indexOf(f.parentElement) > -1 && fv(f) ? f.parentElement : null; }
    function open(it) {
      clearTimeout(timer);
      if (root.classList.contains("is-deal") || cur === it) return;   /* never while the spread runs */
      if (cur) shut(cur);
      cur = it; it.classList.add("is-open"); btn(it).setAttribute("aria-expanded", "true");
    }
    function shut(it) {
      if (!it || cur !== it) return;
      cur = null; warm = Date.now(); it.classList.remove("is-open"); btn(it).setAttribute("aria-expanded", "false");
    }
    items.forEach(function (it) {
      var b = btn(it);
      it.addEventListener("pointerenter", function (e) {
        if (e.pointerType !== "mouse") return;
        hov = it; clearTimeout(timer);
        if (cur || Date.now() - warm < 400) open(it);              /* moving between sheets: no second delay */
        else timer = setTimeout(function () { if (hov === it) open(it); }, 90);
      });
      /* after the hand-back, a pointer that was already resting here opens the card on its first move, never by itself */
      it.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse" || armed !== it) return;
        armed = null; clearTimeout(timer); timer = setTimeout(function () { if (hov === it) open(it); }, 90);
      });
      it.addEventListener("pointerleave", function (e) {
        if (e.pointerType !== "mouse") return;
        if (hov === it) hov = null;
        if (armed === it) armed = null;
        clearTimeout(timer); shut(it);
        var f = focused(); if (f && f !== it) open(f);             /* hand back to the keyboard's sheet */
      });
      b.addEventListener("pointerdown", function (e) { lastPtr = e.pointerType; });
      b.addEventListener("focus", function () { if (fv(b)) open(it); });
      b.addEventListener("blur", function () { if (hov !== it) shut(it); });
      b.addEventListener("click", function (e) {
        if (e.detail !== 0 && lastPtr === "mouse") { open(it); return; }   /* mouse: hover already opened it */
        if (cur === it) shut(it); else open(it);                       /* Enter / Space and taps toggle */
      });
    });
    document.addEventListener("keydown", function (e) { if (cur && (e.key === "Escape" || e.key === "Esc")) shut(cur); });
    document.addEventListener("pointerdown", function (e) { if (cur && !cur.contains(e.target)) shut(cur); });
    /* the spread hands back: the keyboard's sheet opens at once; a sheet the pointer merely rests on waits for a move,
       so no card pops up uninvited as the payoff ends */
    function settled() { var f = focused(); if (f) { open(f); return; } armed = hov; }

    var narrow = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
    if (reduced || narrow || typeof window.gsap === "undefined") return;   /* the final state */

    /* ── the opening state: every sheet back in the stack, every after waiting, nothing struck ── */
    var gsap = window.gsap;
    var W = $("." + P + "__slot").offsetWidth;
    var edge = off(datum).x;                                   /* the datum line, from the root's left */
    var D = off(deck);
    var STACK = 3;
    var S = items.map(function (it, n) {
      var el = $("." + P + "__sheet", it);
      return { it: it, el: el, d: $("." + P + "__draft", it), o: $("." + P + "__own", it), p: off(el), n: n, x: 0, y: 0, a: 0 };
    });
    function apply(s) {
      s.el.style.transform = "translate(" + s.x.toFixed(2) + "px," + s.y.toFixed(2) + "px)";
      s.el.style.opacity = s.a;
      var w = Math.max(0, Math.min(W, edge - (s.p.x + s.x)));   /* how much of the sheet is still on Kelwin's side */
      s.d.style.clipPath = "inset(0 " + (W - w).toFixed(2) + "px 0 0)";
      s.o.style.clipPath = "inset(0 0 0 " + w.toFixed(2) + "px)";
    }
    function release(s) { s.el.style.transform = ""; s.el.style.zIndex = ""; s.el.style.opacity = ""; s.d.style.clipPath = ""; s.o.style.clipPath = ""; s.it.classList.add("is-home"); }

    root.classList.add("ac-cold", "is-deal");
    S.forEach(function (s) {
      s.sx = D.x + STACK * s.n - s.p.x;                         /* 01 on the footprint, 06 on top, 3px steps */
      s.sy = D.y - s.p.y;
      s.x = s.sx; s.y = s.sy - 10; s.a = 0;
      s.el.style.zIndex = 10 + s.n;
      apply(s);
    });
    void root.offsetWidth;
    root.classList.remove("ac-cold");

    var home = document.documentElement.classList.contains("km-home");
    /* the spread: 06 first, all in the same time. RUN 1.1s on a quadratic in-out keeps the longest travel
       (06, ~1140px) at a peak of ~2070px/s: a touch calmer than the round-2 spread he approved (cubic, 1.3s,
       ~990px, peak ~2280px/s), and slow enough to watch each edge turn solid at the line. */
    var T0 = 1.2, STAG = 0.07, RUN = 1.1, CAD = 0.18;
    var tl = gsap.timeline({ paused: true });

    /* the drafts are laid on the stack: 01 first, 06 last and on top. Each one is opaque within 0.1s, so at most
       one sheet is ever see-through and the indices never overprint; the 10px drop carries the arrival. The last
       lands at 1.03s, before the homepage hold at T0 − 0.15. */
    S.forEach(function (s) {
      var at = 0.3 + s.n * 0.07;
      tl.to(s, { a: 1, duration: 0.1, ease: "none", onUpdate: apply, onUpdateParams: [s] }, at);
      tl.to(s, { y: s.sy, duration: 0.38, ease: "power2.out", onUpdate: apply, onUpdateParams: [s] }, at);
    });

    /* the spread: 06 leaves first; the footprint shows as the stack clears */
    tl.call(function () { root.classList.add("is-gone"); }, null, T0 + 0.2);
    var landed = 0;
    S.slice().reverse().forEach(function (s, i) {
      var t = T0 + i * STAG;
      tl.to(s, { x: 0, duration: RUN, ease: "power1.inOut", onUpdate: apply, onUpdateParams: [s] }, t);
      tl.call(function () { release(s); }, null, t + RUN);
      landed = Math.max(landed, t + RUN);
    });

    /* the payoff, in reading order: 01 → 06, each column posted, each before struck, each after up */
    S.forEach(function (s) {
      tl.call(function () { s.it.classList.add("is-struck"); }, null, landed + 0.05 + s.n * CAD);
    });
    /* hand back to the resting CSS once the last posting cue (640ms) has run out; the cards are live from here */
    var last = landed + 0.05 + 5 * CAD;
    tl.call(function () { root.classList.remove("is-deal", "is-gone"); S.forEach(function (s) { s.it.classList.remove("is-struck", "is-home"); }); settled(); }, null, last + 0.7);

    if (!home) { tl.play(0); return; }

    /* homepage: the stack arrives now; the spread waits for the sheet row (60% in view), then for
       max(300ms, 1200ms − time since the section arrived), once */
    var go = false;
    tl.addPause(T0 - 0.15, function () { if (go) tl.play(); });
    tl.play(0);
    function start() { go = true; if (tl.paused()) tl.play(); }
    if (!("IntersectionObserver" in window)) { start(); return; }
    var io = new IntersectionObserver(function (es) {
      for (var k = 0; k < es.length; k++) {
        if (!es[k].isIntersecting) continue;
        io.disconnect();
        gsap.delayedCall(Math.max(0.3, 1.2 - (Date.now() - born) / 1000), start);
        return;
      }
    }, { threshold: 0.6 });
    io.observe(deck);
  }
};
