/* r10-narr · S — "What it is", v2: the written page → one red line → five voices → the buyer.
   The markup is the end state. init() measures that layout once per build (cached; nothing is read
   from the layout while it plays) and builds ONE GSAP timeline that starts from an empty plate:
     step 1 (0–1.3s)     the five voices come in, each off any line, round the empty place where nothing
                         is written down;
     step 2 (1.3–2.75s)  the buyer: a wire from each voice to what the buyer takes away from it, five
                         crossed wires to five different notes ("An AI platform?" …); the count reads 5;
     step 3 (2.75–4.0s)  the voices dim; the page is pushed up into the empty place and its lines write in;
     step 4 (4.0–7.1s)   THE WOW. The red line draws. Row by row, a leader runs from the page's line to the
                         red line, the voice slides onto the line and a caret re-sets its sentence; then
                         its note at the buyer is re-set the same way and the count falls (5, 4, 3, 2, 1).
                         Last, the five notes close into one stack, the crossed wires straighten into one
                         feed and the front note turns solid. Settled at 7.1s; nothing loops.
   Each step waits for the part of the drawing it changes to be in view (stitched page / production only):
   the whole plate on a wide screen; on a phone the voices, then the buyer, then the page, then the buyer.
   A part the reader has already scrolled past never holds the pass. A standalone build plays at once.
   The stepper seeks the timeline: a press shows the end of that step (about a second) and stops the
   automatic pass for good; keyboard focus finishes the step under way and stops it; arrow keys move
   between steps; a polite live line reads the step after a press; Replay runs it again from nothing.
   Reduced motion (or no GSAP): the end state; the steps still work, at once. */
window.KM = {
  init: function (root, opts) {
    var reduced = !!(opts && opts.reduced);
    var P = "km-r10-narr-S", NS = "http://www.w3.org/2000/svg";
    var $ = function (s, el) { return (el || root).querySelector(s); };
    var $$ = function (s, el) { return Array.prototype.slice.call((el || root).querySelectorAll(s)); };
    var field = $("." + P + "__field"), fig = $("." + P + "__fig"), svg = $("." + P + "__wires");
    var feedG = $("." + P + "__feed"), leadG = $("." + P + "__leads"), nodeG = $("." + P + "__nodes");
    var hangG = $("." + P + "__hangs"), braceG = $("." + P + "__brace");
    var vkey = $("." + P + "__vkey"), bkey = $("." + P + "__bkey"), hole = $("." + P + "__hole");
    var os = $("." + P + "__os"), datum = $("." + P + "__datum"), voicesEl = $("." + P + "__voices");
    var buyer = $("." + P + "__buyer"), stack = $("." + P + "__stack"), read = $("." + P + "__read");
    var rn = $("." + P + "__rn"), ru = $("." + P + "__ru"), live = $("." + P + "__live");
    var steps = $$("." + P + "__step"), replay = $("." + P + "__replay");
    var V = $$("." + P + "__v").map(function (li) {
      return { el: li, say: $("." + P + "__say", li), caret: $("." + P + "__caret", li), src: $("." + P + "__src", li) };
    });
    var E = [1, 2, 3, 4, 5].map(function (r) { var e = $("." + P + "__e[data-r=\"" + r + "\"]"); return { el: e, t: e && ($("." + P + "__et", e) || e) }; });
    var TG = [1, 2, 3, 4, 5].map(function (v) {
      var t = $("." + P + "__tag[data-v=\"" + v + "\"]");
      return { el: t, caret: $("." + P + "__caret", t), k: +(t.getAttribute("data-k") || 0) };
    });
    if (!field || V.length !== 5 || !os || !stack) return;
    var FRONT = 0; TG.forEach(function (t, i) { if (t.k === 0) FRONT = i; });
    var gsap = window.gsap;
    var home = document.documentElement.classList.contains("km-home");
    var off = [];   /* cleanups */
    function on(el, ev, fn, o) { el.addEventListener(ev, fn, o); off.push(function () { el.removeEventListener(ev, fn, o); }); }

    var SENT = steps.map(function (b) { var s = $("." + P + "__st", b); return s ? s.textContent : ""; });
    var T = { s1: 0, s2: 1.3, s3: 2.75, s4: 4.0, end: 7.1 };
    var BOUND = [0, T.s2, T.s3, T.s4, T.end];   /* the end of step n is BOUND[n] */

    /* layout offset inside the field (ignores transforms and the stitched page's zoom) */
    function pos(el) { var x = 0, y = 0; for (var e = el; e && e !== field; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return { x: x, y: y }; }
    function mode() { return (getComputedStyle(root).getPropertyValue("--narr-mode") || "wide").trim(); }
    function lh(el) { var v = parseFloat(getComputedStyle(el).lineHeight); return isFinite(v) ? v : 22; }

    /* ── the drawing's lines: built once, redrawn from cached geometry ── */
    function mk(tag, cls, g) { var n = document.createElementNS(NS, tag); n.setAttribute("class", cls); (g || nodeG).appendChild(n); return n; }
    function sq(n, x, y, s) { n.setAttribute("x", (x - s / 2).toFixed(1)); n.setAttribute("y", (y - s / 2).toFixed(1)); n.setAttribute("width", s); n.setAttribute("height", s); }
    var L = null;
    function lines() {
      feedG.textContent = ""; leadG.textContent = ""; nodeG.textContent = ""; hangG.textContent = ""; braceG.textContent = "";
      L = { feed: [], lead: [], hang: [], ne: [], nd: [], no: [], nt: [] };
      L.brace = mk("path", P + "__br", braceG); L.brace.setAttribute("pathLength", "1");
      for (var i = 0; i < 5; i++) {
        var f = mk("path", P + "__fd", feedG); f.setAttribute("pathLength", "1"); L.feed.push(f);
        var l = mk("path", P + "__ld", leadG); l.setAttribute("pathLength", "1"); L.lead.push(l);
        var h = mk("path", P + "__hg", hangG); h.setAttribute("pathLength", "1"); L.hang.push(h);
      }
      for (i = 0; i < 5; i++) {
        L.ne.push(mk("rect", P + "__nd " + P + "__nd--e"));   /* the page's line, where its leader starts */
        L.nd.push(mk("rect", P + "__nd"));                    /* on the red line */
        L.no.push(mk("rect", P + "__nd", feedG));             /* a voice's wire leaves here */
        L.nt.push(mk("rect", P + "__nd " + P + "__nd--t", feedG));   /* … and ends at its note */
      }
    }

    /* ── where things are ── */
    var G = null;
    /* before: each voice off the line (px at 1440, scaled), each note scattered; σ: the row of each voice's
       note at the buyer, shuffled so the five wires cross */
    var DXW = [-36, -108, -24, -76, -52], DY = [-3, 2, -2, 2, -1];   /* all left of the line, so no wire runs behind a voice */
    var DXN = [36, -18, 52, 8, 28], DXP = [16, 0, 26, 6, 20];
    var SIG = [3, 0, 4, 1, 2];
    var SEC = [0, 1, 1, 1, 4];                 /* the numbered part of the page each voice is fed from */                 /* voice i's note sits on row SIG[i] (0-based) */
    var TDX = [10, 34, 0, 22, 44];             /* each row's note, off the stack's left edge */
    var TDXN = [12, 0, 24, 6, 18];

    function measure() {
      var m = mode(), W = field.offsetWidth, H = field.offsetHeight, s = Math.min(1, W / 1312);
      var g = { m: m, W: W, H: H, s: s, wide: m === "wide", phone: m === "phone" };
      var o = pos(os); g.os = { x: o.x, y: o.y, w: os.offsetWidth, h: os.offsetHeight };
      var d = pos(datum); g.dx = d.x + datum.offsetWidth / 2; g.dy = d.y; g.dh = datum.offsetHeight;
      g.v = V.map(function (v) {
        var p = pos(v.el), sy = v.say.offsetTop;
        return { x: p.x, y: p.y, w: v.el.offsetWidth, h: v.el.offsetHeight, ch: p.y + sy + lh(v.say) / 2 };
      });
      g.e = E.map(function (e, i) {
        if (!e.el) return { y: g.v[i].ch };
        var t = e.t, vis = getComputedStyle(t).visibility !== "hidden" && getComputedStyle(t).position !== "absolute";
        if (!vis) t = $("." + "ac-sheet__h", e.el) || e.el;
        var p = pos(t); return { y: p.y + Math.min(lh(t), t.offsetHeight) / 2 };
      });
      var st = pos(stack); g.st = { x: st.x, y: st.y, w: stack.offsetWidth, h: stack.offsetHeight };
      g.t = TG.map(function (t) {
        var p = pos(t.el), tr = (getComputedStyle(t.el).translate || "none").split(" ");
        var tx = tr[0] === "none" ? 0 : parseFloat(tr[0]) || 0, ty = tr[0] === "none" ? 0 : parseFloat(tr[1] || tr[0]) || 0;
        return { x: p.x + tx, y: p.y + ty, w: t.el.offsetWidth, h: t.el.offsetHeight };
      });
      g.bus = g.st.x - Math.round(30 * s);
      return g;
    }

    /* the leaders: from each line of the page, straight across to the red line (a jog in the gutter only
       when a line of the page and its voice don't sit level, as on a small laptop) */
    function leaders(g) {
      var x0 = g.os.x + g.os.w;
      V.forEach(function (v, i) {
        var ye = g.e[i].y, yv = g.v[i].ch, xm = Math.round((x0 + g.dx) / 2 + (2 - i) * 3);
        L.lead[i].setAttribute("d", Math.abs(ye - yv) < 1.5 ? "M" + (x0 + 7) + " " + yv + "H" + g.dx
          : "M" + (x0 + 7) + " " + ye.toFixed(1) + "H" + xm + "V" + yv.toFixed(1) + "H" + g.dx);
        L.hang[i].setAttribute("d", "M" + g.dx + " " + yv.toFixed(1) + "H" + g.v[i].x);
        sq(L.ne[i], x0 + 4, ye, 5); sq(L.nd[i], g.dx, yv, 5);
      });
      /* narrow: the bracket that joins the five notes once they say one thing */
      var bx = g.t[0].x - 10, ys = g.t.map(function (t) { return t.y + t.h / 2; });
      L.brace.setAttribute("d", "M" + (bx + 8) + " " + ys[0].toFixed(1) + "H" + bx + "V" + ys[4].toFixed(1) + "H" + (bx + 8) +
        ys.slice(1, 4).map(function (y) { return "M" + bx + " " + y.toFixed(1) + "H" + (bx + 8); }).join(""));
    }

    /* the wires, live (wide only): from each voice's right edge to its note; as M.m goes 0 → 1 the
       straight crossing line becomes a right-angled feed: across, down the one bus, into the stack */
    var M = { m: 0 };
    function feed() {
      if (!G || !G.wide || !gsap) return;
      var g = G, mm = M.m, fr = g.t[FRONT], fx = fr.x, fy = fr.y + fr.h / 2;
      V.forEach(function (v, i) {
        var a = g.v[i], t = g.t[i];
        var x0 = a.x + a.w + (+gsap.getProperty(v.el, "x") || 0), y0 = a.ch + (+gsap.getProperty(v.el, "y") || 0);
        var x3 = t.x + (+gsap.getProperty(TG[i].el, "x") || 0), y3 = t.y + t.h / 2 + (+gsap.getProperty(TG[i].el, "y") || 0);
        x3 += (fx - x3) * mm; y3 += (fy - y3) * mm;   /* closing: every wire ends on the front note */
        var x1 = x0 + (g.bus - x0) * mm, x2 = x3 + (g.bus - x3) * mm;
        L.feed[i].setAttribute("d", "M" + x0.toFixed(1) + " " + y0.toFixed(1) + "H" + x1.toFixed(1) + "L" + x2.toFixed(1) + " " + y3.toFixed(1) + "H" + x3.toFixed(1));
        sq(L.no[i], x0, y0, 4); sq(L.nt[i], x3 - 2, y3, 4);
      });
    }

    /* the count, from the timeline's time: a note re-set at TAU[i]; the number of different stories */
    var TAU = [], lastN = -1;
    function count(t) {
      var k = 0, at = -1; for (var i = 0; i < TAU.length; i++) if (t >= TAU[i]) { k++; at = TAU[i]; }
      var n = !TAU.length ? 1 : k === 0 ? 5 : 6 - k, shown = n;
      if (n !== lastN) { rn.textContent = n; ru.textContent = n === 1 ? "company" : "different companies"; lastN = n; }
      /* the numeral turns over (a 0.3s rise) each time it falls */
      var p = (k >= 2 && at >= 0) ? Math.min(1, (t - at) / .3) : 1, e = 1 - Math.pow(1 - p, 3);
      if (gsap) gsap.set(rn, { y: (1 - e) * 12, opacity: .25 + .75 * e });
      return shown;
    }

    var tl = null, auto = false, stopped = false, started = false, pinned = 0, cur = -1;
    function stepAt(t) { return pinned || (!started ? 0 : t < T.s2 ? 1 : t < T.s3 ? 2 : t < T.s4 ? 3 : 4); }
    function sync() {
      var t = tl ? tl.time() : T.end;
      feed(); count(t);
      var n = stepAt(t);
      if (n !== cur) { cur = n; steps.forEach(function (b, i) { var me = i + 1 === n; b.classList.toggle("is-cur", me); b.setAttribute("aria-pressed", me ? "true" : "false"); }); }
    }

    /* every element the timeline writes, so a rebuild starts from the clean end state */
    var TOUCHED = [];
    function touch(x) { if (!x) return; if (x.length !== undefined && !x.nodeType) { for (var i = 0; i < x.length; i++) touch(x[i]); return; } if (TOUCHED.indexOf(x) < 0) TOUCHED.push(x); }
    function clear() {
      if (tl) { tl.kill(); tl = null; }
      if (gsap && TOUCHED.length) gsap.set(TOUCHED, { clearProps: "all" });
      TOUCHED = []; M.m = 1; lastN = -1;
    }

    function build() {
      clear();
      if (!L) lines();
      G = measure();
      var g = G;
      svg.setAttribute("viewBox", "0 0 " + g.W + " " + g.H); svg.classList.add("is-live");
      leaders(g);
      /* the end state, drawn (also what reduced motion and a rebuild without GSAP show) */
      M.m = 1;
      if (!gsap) { feedEnd(); return; }
      feed();

      /* before: where each voice and each note starts */
      var S = V.map(function (v, i) {
        var dx = (g.wide ? DXW[i] : g.phone ? DXP[i] : DXN[i]) * (g.wide ? g.s : 1);
        if (g.wide) dx = Math.max(g.os.x + g.os.w + 14 - g.v[i].x, dx);
        return { x: dx, y: g.wide ? DY[i] : 0 };
      });
      var B = TG.map(function (t, i) {
        var f = g.t[i], x, y;
        if (g.wide) { var r = SIG[i]; x = g.st.x + TDX[r] * g.s; y = g.v[r].ch - f.h / 2; }
        else { x = f.x + TDXN[i]; y = f.y; }   /* narrow: its own row, off the edge */
        return { x: x - f.x, y: y - f.y };
      });
      TAU = [];

      tl = gsap.timeline({ paused: true, onUpdate: sync });
      var EO = "power2.out", IO = "power2.inOut";
      function ft(el, a, b, at) { touch(el); var o = {}; for (var k in b) o[k] = b[k]; o.immediateRender = false; return tl.fromTo(el, a, o, at); }

      /* the opening state: the empty place, nothing else */
      gsap.set(hole, { autoAlpha: 1 });
      gsap.set([vkey, bkey, read], { autoAlpha: 0 });
      gsap.set(os, { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(E.map(function (e) { return e.el; }), { clipPath: "inset(-6px 100% -6px -6px)", "--lit": 0 });
      gsap.set(datum, { scaleY: 0 });
      gsap.set(L.lead.concat(L.hang, [L.brace]), { strokeDashoffset: 1 });
      if (!g.wide) gsap.set(TG.map(function (t) { return t.el; }), { "--txt": 1 });
      gsap.set(L.ne.concat(L.nd, L.no, L.nt), { opacity: 0 });
      gsap.set(L.feed, { strokeDashoffset: 1 }); gsap.set(feedG, { "--dim": 0 });
      touch([hole, vkey, bkey, read, os, datum, feedG, rn]); touch(E.map(function (e) { return e.el; }));
      touch(L.lead); touch(L.hang); touch(L.brace); touch(L.ne); touch(L.nd); touch(L.no); touch(L.nt); touch(L.feed);
      V.forEach(function (v, i) {
        gsap.set(v.el, { x: S[i].x, y: S[i].y - 10, autoAlpha: 0, "--dim": 0 });
        gsap.set(v.say, { "--sw": 0 }); gsap.set(v.caret, { opacity: 0 });
        touch([v.el, v.say, v.caret]);
      });
      TG.forEach(function (t, i) {
        gsap.set(t.el, { x: B[i].x - 8, y: B[i].y, autoAlpha: 0, "--sw": 0, "--fill": 0, "--dim": 0, "--txt": 1 });
        gsap.set(t.caret, { opacity: 0 });
        touch([t.el, t.caret]);
      });
      M.m = 0;

      /* step 1 — the voices, each off any line, round the place where nothing is written */
      ft(vkey, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, ease: EO }, 0);
      V.forEach(function (v, i) {
        ft(v.el, { y: S[i].y - 10, autoAlpha: 0 }, { y: S[i].y, autoAlpha: 1, duration: .45, ease: EO }, .1 + i * .12);
      });

      /* step 2 — the buyer; a wire from each voice to what the buyer takes from it; the count */
      ft(bkey, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, ease: EO }, T.s2);
      V.forEach(function (v, i) {
        var t = T.s2 + .12 + i * .1;
        if (g.wide) {
          ft(L.no[i], { opacity: 0 }, { opacity: 1, duration: .12, ease: EO }, t);
          ft(L.feed[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .45, ease: "power1.inOut" }, t);
          ft(L.nt[i], { opacity: 0 }, { opacity: 1, duration: .12, ease: EO }, t + .42);
        }
        ft(TG[i].el, { x: B[i].x - 8, autoAlpha: 0 }, { x: B[i].x, autoAlpha: 1, duration: .3, ease: EO }, t + (g.wide ? .38 : .1));
      });
      ft(read, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, ease: EO }, T.s2 + 1.0);

      /* step 3 — the voices dim; the page is pushed up into the empty place and its lines write in */
      V.forEach(function (v) { ft(v.el, { "--dim": 0 }, { "--dim": 1, duration: .3, ease: EO }, T.s3); });
      TG.forEach(function (t) { ft(t.el, { "--dim": 0 }, { "--dim": 1, duration: .3, ease: EO }, T.s3); });
      ft(feedG, { "--dim": 0 }, { "--dim": 1, duration: .3, ease: EO }, T.s3);
      ft(hole, { autoAlpha: 1 }, { autoAlpha: 0, duration: .25, ease: EO }, T.s3);
      ft(os, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01, ease: "none" }, T.s3 + .05);
      ft(os, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .45, ease: EO }, T.s3 + .05);
      E.forEach(function (e, k) { if (e.el) ft(e.el, { clipPath: "inset(-6px 100% -6px -6px)" }, { clipPath: "inset(-6px -6px -6px -6px)", duration: .3, ease: EO }, T.s3 + .4 + k * .1); });

      /* step 4 — the red line; row by row: leader, the voice onto the line, re-set; its note re-set */
      ft(datum, { scaleY: 0 }, { scaleY: 1, duration: .45, ease: IO }, T.s4);
      V.forEach(function (v, i) {
        var t = T.s4 + .25 + i * .2, tg = TG[i];
        ft(L.ne[i], { opacity: 0 }, { opacity: 1, duration: .15, ease: EO }, t);
        if (SEC[i] === i) ft(E[i].el, { "--lit": 0 }, { "--lit": 1, duration: .2, ease: EO }, t);   /* its part's number lights */
        ft(L.lead[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .25, ease: "power1.inOut" }, t);
        ft(L.nd[i], { opacity: 0 }, { opacity: 1, duration: .12, ease: EO }, t + .25);
        ft(v.el, { x: S[i].x, y: S[i].y }, { x: 0, y: 0, duration: .55, ease: IO }, t + .05);
        ft(v.el, { "--dim": 1 }, { "--dim": 0, duration: .3, ease: EO }, t + .3);
        ft(L.hang[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .12, ease: "none" }, t + .55);
        ft(v.caret, { opacity: 0 }, { opacity: 1, duration: .08, ease: "none" }, t + .62);
        ft(v.say, { "--sw": 0 }, { "--sw": 1, duration: .4, ease: "power1.inOut" }, t + .62);
        ft(v.caret, { opacity: 1 }, { opacity: 0, duration: .12, ease: "none" }, t + 1.0);
        ft(tg.el, { "--dim": 1 }, { "--dim": 0, duration: .2, ease: EO }, t + .9);
        ft(tg.caret, { opacity: 0 }, { opacity: 1, duration: .06, ease: "none" }, t + .92);
        ft(tg.el, { "--sw": 0 }, { "--sw": 1, duration: .3, ease: "power1.inOut" }, t + .92);
        ft(tg.caret, { opacity: 1 }, { opacity: 0, duration: .1, ease: "none" }, t + 1.2);
        TAU.push(t + 1.07);
      });
      /* the close: five notes into one stack, the wires into one feed, the front note solid */
      var tc = T.s4 + .25 + 4 * .2 + 1.25;   /* 6.3 */
      if (g.wide) {
        TG.forEach(function (t, i) {
          ft(t.el, { x: B[i].x, y: B[i].y }, { x: 0, y: 0, duration: .6, ease: IO }, tc + Math.abs(2 - SIG[i]) * .03);
          if (t.k) ft(t.el, { "--txt": 1 }, { "--txt": 0, duration: .22, ease: "power1.in" }, tc);   /* only the front note's words travel */
        });
        tl.fromTo(M, { m: 0 }, { m: 1, duration: .6, ease: IO, immediateRender: false }, tc);
        ft(feedG, { "--dim": 1 }, { "--dim": 0, duration: .4, ease: EO }, tc);
        TG.forEach(function (t) { if (t.k === 0) ft(t.el, { "--fill": 0 }, { "--fill": 1, duration: .3, ease: EO }, tc + .45); });
      } else {
        /* narrow: the five notes, now one story, are set to one edge and joined */
        TG.forEach(function (t, i) { ft(t.el, { x: B[i].x }, { x: 0, duration: .55, ease: IO }, tc + i * .04); });
        ft(L.brace, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: .5, ease: "power1.inOut" }, tc + .4);
      }
      tl.to({}, { duration: Math.max(0, T.end - tl.duration()) });

      /* each step waits for its part of the drawing (stitched page / production) */
      [2, 3, 4].forEach(function (k) { tl.call(atGate, [k], BOUND[k - 1]); });
    }
    function feedEnd() { /* no GSAP: draw the wires' end state from the cached geometry */
      if (!G || !G.wide) return;
      var t = G.t[FRONT], y3 = t.y + t.h / 2;
      V.forEach(function (v, i) {
        var a = G.v[i], x0 = a.x + a.w, y0 = a.ch;
        L.feed[i].setAttribute("d", "M" + x0 + " " + y0.toFixed(1) + "H" + G.bus + "L" + G.bus + " " + y3.toFixed(1) + "H" + t.x);
        sq(L.no[i], x0, y0, 4); sq(L.nt[i], t.x - 2, y3, 4);
      });
    }

    /* ── the gates: a step plays when its part of the drawing is in view (or already scrolled past) ── */
    function zone(k) {
      if (G && G.wide) return field;
      return [null, voicesEl, buyer, os, buyer][k] || field;
    }
    /* in view: 2 = enough to play now; 1 = partly (play if the reader stays 1.2s); 0 = not yet.
       A part already scrolled past counts as in view, so the pass never stalls behind the reader. */
    function ready(k) {
      var z = zone(k); if (!z) return 2;
      var r = z.getBoundingClientRect(), vh = window.innerHeight || 800;
      if (!r.height || r.bottom < vh * .2) return 2;
      var vis = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)), h = r.height;
      var need = z !== field ? Math.min(.6 * h, .45 * vh)
        : k === 1 ? Math.min(.82 * h, .6 * vh)        /* the start: most of the drawing in view */
        : Math.min(.5 * h, .4 * vh);                  /* later steps: the reader is already on it */
      var part = z !== field ? Math.min(.3 * h, .3 * vh) : Math.min(.4 * h, .35 * vh);
      return vis >= need ? 2 : vis >= part ? 1 : 0;
    }
    var waiting = 0, raf = 0, watching = false, linger = 0;
    function onScroll() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; check(); }); }
    function watch(onOff) {
      if (onOff === watching) return; watching = onOff;
      var f = onOff ? "addEventListener" : "removeEventListener";
      window[f]("scroll", onScroll, { passive: true }); window[f]("resize", onScroll, { passive: true });
      if (!onOff) { clearTimeout(linger); linger = 0; }
    }
    off.push(function () { watch(false); if (raf) cancelAnimationFrame(raf); });
    function go() {
      var k = waiting; waiting = 0; watch(false);
      if (k === 1) play(); else if (tl && auto) tl.play();
    }
    function check() {
      if (!waiting || stopped) { watch(false); return; }
      var s = ready(waiting);
      if (s === 2) { go(); return; }
      if (s === 1) { if (!linger) linger = setTimeout(function () { linger = 0; if (waiting && !stopped && ready(waiting) > 0) go(); }, 1200); }
      else if (linger) { clearTimeout(linger); linger = 0; }
    }
    function atGate(k) {
      if (!home || !auto || stopped || !tl) return;
      if (ready(k) === 2) return;
      tl.pause(BOUND[k - 1]); waiting = k; watch(true); check();
    }

    /* ── running it ── */
    var startTimer = 0;
    function finalFrame() { if (tl) tl.progress(1); started = true; pinned = 0; sync(); }
    function play() {
      if (!tl || stopped) return;
      started = true; auto = true; pinned = 0; tl.play(0);
    }
    function arm() {   /* wait for the first part to be in view, then play */
      if (!home) { startTimer = setTimeout(play, 600); return; }
      if (ready(1) === 2) { play(); return; }
      waiting = 1; watch(true); check();
    }
    function stop() { if (!stopped) { stopped = true; auto = false; waiting = 0; watch(false); } }
    function say(n) { if (live) { live.textContent = ""; setTimeout(function () { live.textContent = "Step " + n + " of 4. " + SENT[n - 1]; }, 30); } }
    function seekStep(n, quiet) {
      started = true; stop(); pinned = n;
      var to = BOUND[n];
      if (!tl) { sync(); return; }
      gsap.killTweensOf(tl); tl.pause();
      if (reduced) { tl.seek(to); sync(); }
      else {
        var d = Math.abs(tl.time() - to), dur = Math.max(.45, Math.min(1.4, d / 3.2));
        gsap.to(tl, { time: to, duration: dur, ease: "power1.inOut", overwrite: true, onUpdate: sync });
      }
      if (!quiet) say(n);
    }

    build();
    if (!gsap || reduced) { finalFrame(); }
    else { tl.pause(0); sync(); arm(); }

    /* the stepper */
    steps.forEach(function (b, i) {
      on(b, "click", function () { seekStep(i + 1); });
      on(b, "focus", function () {
        var kb = false; try { kb = b.matches(":focus-visible"); } catch (e) {}
        if (!kb || stopped || !tl) return;
        /* finish the step under way, then stop there */
        var t = tl.time(), n = !started ? 1 : t < T.s2 ? 1 : t < T.s3 ? 2 : t < T.s4 ? 3 : 4;
        seekStep(n, true);
      });
      on(b, "keydown", function (e) {
        var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var j = (i + d + steps.length) % steps.length; steps[j].focus(); seekStep(j + 1);
      });
    });
    if (replay) on(replay, "click", function () {
      stopped = false; pinned = 0; waiting = 0; watch(false);
      if (!tl || reduced) { finalFrame(); return; }
      gsap.killTweensOf(tl); tl.pause(0); started = false; auto = false; sync();
      clearTimeout(startTimer); startTimer = setTimeout(play, 250);
    });

    /* a new width (or skin, or font) re-measures and rebuilds at the same moment */
    var lastW = field.offsetWidth, rt = 0;
    function rebuild() {
      var t = tl ? tl.time() : T.end, playing = tl ? (tl.isActive() || (auto && !tl.paused())) : false;
      if (gsap && tl) gsap.killTweensOf(tl);
      build();
      if (!tl) { sync(); return; }
      if (reduced || (!started && stopped)) { tl.progress(1); sync(); return; }
      if (!started) { tl.pause(0); sync(); return; }
      tl.seek(pinned ? BOUND[pinned] : t, true); sync();
      if (playing && !stopped) tl.play(); else tl.pause();
    }
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function () {
        var w = field.offsetWidth; if (w === lastW) return; lastW = w;
        clearTimeout(rt); rt = setTimeout(rebuild, 160);
      });
      ro.observe(field); off.push(function () { ro.disconnect(); });
    }
    if ("MutationObserver" in window) {
      var mo = new MutationObserver(function () { clearTimeout(rt); rt = setTimeout(rebuild, 200); });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });
      off.push(function () { mo.disconnect(); });
    }

    return function cleanup() {
      clearTimeout(startTimer); clearTimeout(rt);
      off.forEach(function (f) { f(); });
      if (gsap && tl) { gsap.killTweensOf(tl); tl.kill(); }
    };
  }
};
