/* ═══ turn-b.js · THE TURN, alternative B: "The ruled edge" (round 10 prototype, second pass) ════
   Replaces the first B ("The register", a sheet with the mark registered in its centre), which
   the review found too close to today's turn: one panel, a centred logo, the panel leaving. This
   one has no panel-and-logo at all. It is one ruled sheet: a flat sheet whose top edge carries a
   red line, a + registering at each end of it, like the ruled head of a drafting sheet.

   LEAVING (a link is clicked): the sheet slides up over the page from the bottom of the window,
   its red line ruled across it as it comes (0–420). The next page is requested at 440.
   ARRIVING: the sheet covers the window from the first paint, its line along the top (entering
   the site cold, the line is ruled first). Then the sheet slides DOWN off the page (0–760), so
   the new page is uncovered from the top, the way it is read. The red line rides down on the
   sheet's edge until it reaches the page's own short red rule, the 48×2 rule under an interior
   headline: there the page catches it. The line slows off the sheet onto the rule, shrinking to
   the rule's length (the sheet carries on without it, taking the + marks with it), and becomes it.
   The headline writes itself in above it. Where there is no interior headline rule wholly in view
   (the homepage, whose approved hero motion is left as it is; a page opened at an anchor; a
   back/forward return; a failed navigation), the line simply leaves with the sheet and the page's
   rule draws as it always has. If the reader scrolls or the window changes size while the line is
   on its way, it lets go: the line fades where it is and the rule appears in its own place.

   Same three parts, markers, API and safety as lib/turn.js (tool/home.py or swap.py lift them):
   · km:turn-head    runs BEFORE FIRST PAINT: injects this variant's <style> when motion is
                     allowed, covers the window (html.km-tb-arrive, + km-tb-cold unless reached by
                     a turn), arms the 2.5s safety.
   · km:turn-markup  the sheet (its line and + marks ride on it) and the free line that the page
                     catches, first in <body>, [hidden]: no script (so no style) = no panel.
   · km:turn-body    the lift and the catch, the write-in (lib/turn.js parts 1 and 3, verbatim), the
                     leave on internal link clicks (lifted if the next page never arrives, and on a
                     back/forward return).
   window.KMTurn = { motion, warm, t0, safety, body, open }: KMTurn.open resolves as the sheet starts
   down; the boot plays the first section 180ms later. Reduced motion: no style, no class, no split,
   no turn. The sessionStorage flag is the same "km-turn".

   States on <html>:
     km-tb-leave    leaving: the sheet slides up, its line is ruled
     km-tb-arrive   the sheet covers the window from the first paint (+ km-tb-cold entering cold)
     km-tb-lift     the sheet slides down (the motion itself is a Web Animation the script times,
                    so the sheet and the free line move on one clock)
   The rule the line lands on carries .km-tb-target (invisible, its own draw off) until the line
   arrives, then .km-tb-landed (shown; its draw stays off).                                      */

/* <km:turn-head> */
(function (d) {
  if (window.KMTurn) return;
  var T = window.KMTurn = { motion: false, warm: false, t0: (window.performance && performance.now()) || 0 };
  try { T.motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (!T.motion) return;   /* reduced motion: no style, no class, nothing */
  var css = [
    ":root {",
    "  --km-tb-leave: 440ms;      /* leaving: click → the next page is requested (the sheet is up, its line ruled) */",
    "  --km-tb-hold-cold: 420ms;  /* entering cold: the line is ruled, then the lift */",
    "  --km-tb-hold-warm: 60ms;   /* arriving by a turn: everything is already there */",
    "  --km-tb-down: 760ms;       /* the lift: the sheet slides down off the page */",
    "  --km-tb-catch: 360ms;      /* the line, caught by the page's rule, settles onto it */",
    "  --km-tb-ease: cubic-bezier(.6, 0, .4, 1);",
    "}",
    ".km-tb {",
    "  display: block; position: fixed; inset: 0; z-index: 1000; pointer-events: none; visibility: hidden; overflow: hidden;",
    "  zoom: calc(1 / var(--page-zoom, 1));   /* chrome: never shrinks with the zoomed 1440 stage */",
    "  --m: 64px; --e: 20px;                  /* margin · the line's depth below the sheet's top edge */",
    "}",
    "@media (max-width: 1023px) { .km-tb { --m: 24px; } }",
    "@media (max-width: 767px) { .km-tb { --m: 16px; --e: 16px; } }",
    "html.km-tb-leave .km-tb, html.km-tb-arrive .km-tb { visibility: visible; }",
    /* the sheet: flat graphite (the site's own ground), a straight top edge with a hairline */
    ".km-tb__sheet { position: absolute; left: 0; right: 0; top: 0; height: 100%; background: var(--bg); box-shadow: inset 0 1px 0 var(--line-2); transform: translateY(101%); }",
    /* its line (2px red, margin to margin) and the + at each end ride on it */
    ".km-tb__edge, .km-tb__line { position: absolute; left: var(--m); right: var(--m); top: calc(var(--e) - 1px); height: 2px; background: var(--signal); transform-origin: 0 50%; }",
    ".km-tb__edge { transform: scaleX(0); }",
    ".km-tb__line { visibility: hidden; }   /* the free line: shown only while the page catches it */",
    ".km-tb__reg { position: absolute; top: calc(var(--e) - 7px); width: 13px; height: 13px; opacity: 0; }",
    ".km-tb__reg::before, .km-tb__reg::after { content: \"\"; position: absolute; background: var(--fg-2); }",
    ".km-tb__reg::before { left: 0; right: 0; top: 6px; height: 1px; }",
    ".km-tb__reg::after { top: 0; bottom: 0; left: 6px; width: 1px; }",
    ".km-tb__reg--l { left: calc(var(--m) - 6px); }",
    ".km-tb__reg--r { left: calc(100% - var(--m) - 7px); }",
    "@keyframes km-tb-up { from { transform: translateY(101%); } to { transform: none; } }",
    "@keyframes km-tb-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }",
    "@keyframes km-tb-on { from { opacity: 0; } to { opacity: 1; } }",
    /* leaving: 0–420 the sheet slides up · 100– the + marks · 120–420 its line is ruled as it comes */
    "html.km-tb-leave .km-tb__sheet { animation: km-tb-up 420ms var(--km-tb-ease) both; }",
    "html.km-tb-leave .km-tb__reg--l { animation: km-tb-on 80ms linear 100ms both; }",
    "html.km-tb-leave .km-tb__edge { animation: km-tb-draw 300ms cubic-bezier(.3, 0, .2, 1) 120ms both; }",
    "html.km-tb-leave .km-tb__reg--r { animation: km-tb-on 80ms linear 380ms both; }",
    /* arriving: up from the first paint, the line ruled (warm) */
    "html.km-tb-arrive .km-tb__sheet, html.km-tb-arrive .km-tb__edge { transform: none; }",
    "html.km-tb-arrive .km-tb__reg { opacity: 1; }",
    /* …entering cold: 40–300 the line is ruled · the lift at 420 */
    "html.km-tb-arrive.km-tb-cold .km-tb__reg--l { animation: km-tb-on 80ms linear both; }",
    "html.km-tb-arrive.km-tb-cold .km-tb__edge { animation: km-tb-draw 260ms cubic-bezier(.3, 0, .2, 1) 40ms both; }",
    "html.km-tb-arrive.km-tb-cold .km-tb__reg--r { animation: km-tb-on 80ms linear 280ms both; }",
    /* the page's rule: invisible, its own draw off, until the line lands on it; then simply there */
    ".ac-rule.km-tb-target { opacity: 0 !important; animation: none !important; }",
    ".ac-rule.km-tb-landed { animation: none !important; }"
  ].join("\n");
  var s = document.createElement("style");
  s.setAttribute("data-km-turn", "b"); s.textContent = css;
  (document.head || d).appendChild(s);
  if (document.body) return;   /* too late to cover the first paint: no arrival */
  try { T.warm = sessionStorage.getItem("km-turn") === "1"; sessionStorage.removeItem("km-turn"); } catch (e) {}
  d.classList.add("km-tb-arrive"); if (!T.warm) d.classList.add("km-tb-cold");
  T.safety = setTimeout(function () { d.classList.remove("km-tb-arrive", "km-tb-cold", "km-tb-lift"); }, 2500);
})(document.documentElement);
/* </km:turn-head> */

/* <km:turn-body> */
(function () {
  var d = document.documentElement, T = window.KMTurn;
  if (!T || T.body) return;
  T.body = true;

  /* <km:turn-markup> */
  var KM_TURN_MARKUP = '<div class="km-tb" data-surface="dark" aria-hidden="true" hidden><div class="km-tb__sheet"><span class="km-tb__reg km-tb__reg--l"></span><span class="km-tb__reg km-tb__reg--r"></span><div class="km-tb__edge"></div></div><div class="km-tb__line"></div></div>';
  /* </km:turn-markup> */
  if (!document.querySelector(".km-tb")) document.body.insertAdjacentHTML("afterbegin", KM_TURN_MARKUP);
  var panel = document.querySelector(".km-tb"), sheet = panel.querySelector(".km-tb__sheet");
  var edge = panel.querySelector(".km-tb__edge"), line = panel.querySelector(".km-tb__line");

  var css = getComputedStyle(d);
  function ms(name, fallback) { var v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? fallback : v; }
  var LEAVE = ms("--km-tb-leave", 440), DOWN = ms("--km-tb-down", 760), CATCH = ms("--km-tb-catch", 360);
  var HOLD = T.warm ? ms("--km-tb-hold-warm", 60) : ms("--km-tb-hold-cold", 420);
  /* the sheet goes down quickly at first, so its line is past the headline before the first letter
     is written (the write-in starts ≈300ms into the lift), then slows for the rest of the page */
  var EASE = [.4, 0, .2, 1], CATCH_EASE = [.25, 1, .5, 1], CATCH_MAX = 140;   /* the descent · the catch · its longest run (px) */
  function now() { return performance.now(); }

  /* 1 · the write-in is prepared first: the h1 is split once its face has loaded (the letters
     are measured as set), and nothing plays before that */
  function noop() {}
  function wait(t) { return new Promise(function (ok) { setTimeout(ok, Math.max(0, t)); }); }
  var heads = T.motion ? document.querySelectorAll(".ac-ihead > h1.ac-statement") : [];   /* the page h1 only */
  var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  var face = Promise.resolve();
  if (heads.length && document.fonts && document.fonts.load) {
    var hcs = getComputedStyle(heads[0]);
    face = document.fonts.load(hcs.fontWeight + " " + hcs.fontSize + " " + hcs.fontFamily).then(noop, noop);
  }
  var split = Promise.all([fonts, face]).then(function () { Array.prototype.forEach.call(heads, writeIn); }).then(noop, noop);

  /* 2 · arriving: hold, then lift. KMTurn.open resolves as the sheet starts down (and never
     before the split; never later than the safety). */
  var opened, lifted = false, clearer = 0, target = null, sheetAnim = null, lineAnim = null, travelling = false;
  var openP = new Promise(function (ok) { opened = ok; });
  T.open = Promise.race([Promise.all([openP, split]), wait(T.t0 + 2500 - now())]).then(noop);

  /* cubic-bezier helpers: the sheet's position at a time, and the ease of its first part (the
     curve split at that time and rescaled), so the free line can ride the sheet exactly */
  function bez(p1, p2, s) { var u = 1 - s; return 3 * u * u * s * p1 + 3 * u * s * s * p2 + s * s * s; }
  function paramAt(e, x) { var lo = 0, hi = 1; for (var i = 0; i < 40; i++) { var m = (lo + hi) / 2; if (bez(e[0], e[2], m) < x) lo = m; else hi = m; } return (lo + hi) / 2; }
  function ease(e, x) { return x <= 0 ? 0 : x >= 1 ? 1 : bez(e[1], e[3], paramAt(e, x)); }
  function head(e, s) {   /* de Casteljau: the part of the curve from 0 to parameter s, rescaled to a unit ease */
    function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    var P0 = [0, 0], P1 = [e[0], e[1]], P2 = [e[2], e[3]], P3 = [1, 1];
    var Q1 = lerp(P0, P1, s), M = lerp(P1, P2, s), R2 = lerp(P2, P3, s), Q2 = lerp(Q1, M, s), R1 = lerp(M, R2, s), P = lerp(Q2, R1, s);
    if (P[0] <= 0 || P[1] <= 0) return "linear";
    return "cubic-bezier(" + [Q1[0] / P[0], Q1[1] / P[1], Q2[0] / P[0], Q2[1] / P[1]].map(function (v) { return v.toFixed(4); }).join(", ") + ")";
  }

  /* the rule to land on: the rule under an INTERIOR page headline (.ac-ihead), wholly inside the
     window and shown, measured as laid out. The homepage hero's rule is never a target. */
  function findRule() {
    var vw = window.innerWidth, vh = window.innerHeight, rules = document.querySelectorAll(".ac-ihead > .ac-rule");
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i].getBoundingClientRect();
      if (r.width < 1 || r.height <= 0 || r.left < 0 || r.top < 0 || r.right > vw || r.bottom > vh) continue;
      var cs = getComputedStyle(rules[i]);
      if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) continue;
      return rules[i];
    }
    return null;
  }
  function release() {
    if (!target) return;
    target.classList.add("km-tb-landed"); target.classList.remove("km-tb-target"); target = null;
  }
  function land() {   /* the line becomes the rule, in one frame */
    stopWatch();
    if (!travelling) return;
    travelling = false;
    release();
    line.style.visibility = "hidden";
  }
  function abort() {   /* scrolled or resized while the line was on its way: let go */
    if (!travelling) return;
    travelling = false; stopWatch();
    release();
    if (lineAnim) { try { lineAnim.pause(); } catch (e) {} }
    if (line.animate) line.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: "linear", fill: "forwards", composite: "replace" });
    else line.style.visibility = "hidden";
  }
  function watch() { window.addEventListener("scroll", abort, { passive: true }); window.addEventListener("resize", abort); }
  function stopWatch() { window.removeEventListener("scroll", abort); window.removeEventListener("resize", abort); }

  /* the line's path: it rides the sheet's edge, then — once it is close enough that it can slow
     onto the rule at the pace it is moving — it leaves the sheet and settles onto the rule */
  function catchPath() {
    /* measured from layout boxes, never from the edge's current transform (it may still be drawing):
       the rule's box is brought into the panel's own pixels (the panel is zoom-corrected, never transformed) */
    var p = panel.getBoundingClientRect(), b = target.getBoundingClientRect(), w = line.offsetWidth;
    var z = p.width / (panel.offsetWidth || p.width) || 1;
    var H = sheet.offsetHeight * 1.01;                              /* the sheet's whole travel */
    var dy = ((b.top + b.height / 2) - p.top) / z - (line.offsetTop + line.offsetHeight / 2);   /* from the line's place to the rule's */
    if (w < 1 || b.width <= 0 || dy < 4 || dy > H) return null;
    var slope0 = CATCH_EASE[1] / CATCH_EASE[0], t1 = 0, y1 = 0;
    for (var t = 0; t <= DOWN; t += 2) {                            /* the first moment the catch can start */
      var y = ease(EASE, t / DOWN) * H, v = (ease(EASE, (t + 1) / DOWN) - ease(EASE, (t - 1) / DOWN)) * H / 2;
      if (y + Math.min(CATCH_MAX, Math.max(0, v) * CATCH / slope0) >= dy) { t1 = t; y1 = Math.min(y, dy); break; }
      t1 = t; y1 = y;
    }
    var total = t1 + CATCH, rx = (b.left - p.left) / z - line.offsetLeft, sx = b.width / z / w;
    var frames = [];
    if (t1 > 0) frames.push({ offset: 0, transform: "translate(0px, 0px) scale(1, 1)", easing: head(EASE, paramAt(EASE, t1 / DOWN)) });
    frames.push({ offset: t1 / total, transform: "translate(0px, " + y1.toFixed(2) + "px) scale(1, 1)", easing: "cubic-bezier(" + CATCH_EASE.join(", ") + ")" });
    frames.push({ offset: 1, transform: "translate(" + rx.toFixed(2) + "px, " + dy.toFixed(2) + "px) scale(" + sx.toFixed(5) + ", 1)", backgroundColor: getComputedStyle(target).backgroundColor });
    return { frames: frames, total: total };
  }
  function clear() {   /* the turn is over: the panel hides, everything is put back for the next turn */
    clearTimeout(clearer); stopWatch();
    if (travelling) land();
    release();
    d.classList.remove("km-tb-arrive", "km-tb-cold", "km-tb-lift");   /* hidden first, then put back */
    if (sheetAnim) { sheetAnim.cancel(); sheetAnim = null; }
    if (lineAnim) { lineAnim.cancel(); lineAnim = null; }
    if (line.getAnimations) line.getAnimations().forEach(function (an) { an.cancel(); });
    line.style.visibility = ""; edge.style.visibility = "";
  }
  function lift(hand) {   /* hand: a fresh page (not a back/forward return or a failed navigation) */
    clearTimeout(T.safety); clearTimeout(clearer);
    target = hand ? findRule() : null;
    var path = null;
    if (target) { target.classList.add("km-tb-target"); path = catchPath(); if (!path) release(); }
    d.classList.add("km-tb-lift");
    var end = DOWN;
    if (sheet.animate) {
      /* the sheet and the free line start in the same frame, on one clock */
      sheetAnim = sheet.animate([{ transform: "translateY(0px)" }, { transform: "translateY(" + (sheet.offsetHeight * 1.01).toFixed(1) + "px)" }],
        { duration: DOWN, easing: "cubic-bezier(" + EASE.join(", ") + ")", fill: "forwards" });
      if (path) {
        edge.style.visibility = "hidden"; line.style.visibility = "visible"; travelling = true;
        lineAnim = line.animate(path.frames, { duration: path.total, fill: "forwards" });
        lineAnim.onfinish = land;
        watch();
        end = Math.max(DOWN, path.total);
      }
    } else release();
    opened();
    clearer = setTimeout(clear, end + 60);
  }
  function liftOnce() { if (!lifted) { lifted = true; lift(true); } }
  if (T.motion && d.classList.contains("km-tb-arrive")) {
    /* entering cold, the line is ruled first: the lift waits for it to finish (it starts with the
       first frame, which a long page may paint late), then a short rest */
    var intro = (!T.warm && panel.getAnimations) ? panel.getAnimations({ subtree: true }) : [];
    var introDone = Promise.all(intro.map(function (an) { return an.finished.then(noop, noop); })).then(function () { return intro.length ? wait(80) : null; });
    Promise.all([split, wait(T.t0 + HOLD - now()), introDone]).then(liftOnce);
    wait(T.t0 + 2100 - now()).then(liftOnce);   /* never hold past ~2.1s */
  } else {
    lifted = true; opened();
  }

  /* 3 · the write-in (interior heads only) */
  function writeIn(h) {
    var spans = h.querySelectorAll(".ac-line > span");
    if (!spans.length) return;
    var original = Array.prototype.map.call(h.childNodes, function (n) { return n.cloneNode(true); });
    var lines = h.querySelectorAll(".ac-line");   /* the words, line by line (lines may sit back to back) */
    var label = (lines.length ? Array.prototype.map.call(lines, function (l) { return l.textContent; }).join(" ") : h.textContent).replace(/\s+/g, " ").trim();

    /* a · where every character sits as set (kerned), the text nodes to split, and where each
       line of the set type starts (a soft wrap inside an .ac-line: a space, a hyphen, a dash…) */
    var pos = [], nodes = [], range = document.createRange(), spanStart = false;
    var half = (parseFloat(getComputedStyle(h).fontSize) || 40) * 0.5 * (h.getBoundingClientRect().width / (h.offsetWidth || 1) || 1);
    var lastTop = null;
    function texts(el) {
      Array.prototype.forEach.call(el.childNodes, function (n) {
        if (n.nodeType === 3) {
          var start = pos.length, off = 0;
          Array.from(n.data).forEach(function (c) {
            range.setStart(n, off); range.setEnd(n, off + c.length); off += c.length;
            var r = range.getBoundingClientRect(), p = { c: c, left: r.left, top: r.top, w: r.width, brk: false, line: false };
            if (!/\s/.test(c)) {
              if (lastTop !== null && r.top - lastTop > half) p.brk = true;
              if (p.brk || spanStart) { p.line = true; spanStart = false; }   /* a set line starts here */
              lastTop = r.top;
            }
            pos.push(p);
          });
          nodes.push({ node: n, start: start });
        } else if (n.nodeType === 1) texts(n);
      });
    }
    Array.prototype.forEach.call(spans, function (s, si) { lastTop = null; spanStart = si > 0; texts(s); });

    /* b · split: words stay whole (.ac-w), letters become .ac-ch with their order in --k. The set
       type's line breaks are locked: a <br class="ac-br"> where each measured line starts, and the
       lines are unbreakable while the h1 writes (kit §13), so the split can only break where the
       set type broke — never at a different hyphen, dash or space. */
    /* one pen (coherence pass): a new set line starts only when the last letter of the line before
       has landed — the order skips ceil(dur / step) − 1 places at each line start (--ac-write-line:
       1, the default; 0 writes the lines back to back, as round 9 first did) */
    var hs0 = getComputedStyle(h), STEP = ms2(hs0, "--ac-write-step", 21), DUR = ms2(hs0, "--ac-write-dur", 240);
    var GAP = ms2(hs0, "--ac-write-line", 1) > 0 ? Math.max(0, Math.ceil(DUR / STEP) - 1) : 0;
    var k = 0, letters = [];
    nodes.forEach(function (t) {
      var frag = document.createDocumentFragment(), i = t.start, word = null;
      Array.from(t.node.data).forEach(function (c) {
        if (/\s/.test(c)) { word = null; frag.appendChild(document.createTextNode(c)); }
        else {
          if (pos[i].brk) { word = null; var br = document.createElement("br"); br.className = "ac-br"; frag.appendChild(br); }
          if (pos[i].line && k > 0) k += GAP;
          if (!word) { word = document.createElement("span"); word.className = "ac-w"; frag.appendChild(word); }
          var s = document.createElement("span"); s.className = "ac-ch"; s.textContent = c;
          s.style.setProperty("--k", k++); word.appendChild(s); letters.push({ el: s, i: i });
        }
        i++;
      });
      t.node.parentNode.replaceChild(frag, t.node);
    });
    if (!letters.length) return;
    h.setAttribute("aria-label", label);
    Array.prototype.forEach.call(spans, function (s) { s.setAttribute("aria-hidden", "true"); });
    h.classList.add("ac-write", "is-writing");

    /* c · hold each letter at its kerned place: an inline-block letter loses its kerning pair,
       so give it back as a margin (read everything first, then write) */
    var zoom = h.getBoundingClientRect().width / (h.offsetWidth || 1) || 1;
    var fix = letters.map(function (L) {
      var a = pos[L.i], b = pos[L.i + 1];
      if (!b || Math.abs(b.top - a.top) > 1 || (b.w === 0 && b.left === 0)) return 0;
      return (b.left - a.left - L.el.getBoundingClientRect().width) / zoom;
    });
    letters.forEach(function (L, j) { if (Math.abs(fix[j]) > 0.01) L.el.style.marginRight = fix[j].toFixed(3) + "px"; });

    /* d · the rest of the head (and its plate) waits for the last letter */
    var hs = getComputedStyle(h);
    var end = ms2(hs, "--ac-write-d0", 120) + (k - 1) * ms2(hs, "--ac-write-step", 21) + ms2(hs, "--ac-write-dur", 240);
    var head = h.parentElement, sec = head && head.parentElement;
    if (head) head.classList.add("is-write");
    if (sec) { sec.classList.add("is-write"); sec.style.setProperty("--ac-write-end", Math.round(end) + "ms"); }

    /* e · when the last letter lands, put the set type back (exactly as authored). If the width
       changes mid-write (a phone turned), the locked lines no longer fit: put it back at once. */
    var last = letters[letters.length - 1].el, vw = window.innerWidth, done = false;
    function putBack() {
      if (done) return; done = true;
      h.removeEventListener("animationend", onEnd); window.removeEventListener("resize", onResize);
      while (h.firstChild) h.removeChild(h.firstChild);
      original.forEach(function (n) { h.appendChild(n); });
      h.classList.remove("is-writing");   /* the lines may wrap again; .ac-write stays (no second rise) */
    }
    function onEnd(e) { if (e.target === last) putBack(); }
    function onResize() { if (window.innerWidth !== vw) putBack(); }
    h.addEventListener("animationend", onEnd);
    window.addEventListener("resize", onResize);
  }
  function ms2(style, name, fallback) { var v = parseFloat(style.getPropertyValue(name)); return isNaN(v) ? fallback : v; }

  /* 4 · leaving: an internal link click turns the page (other sites, new tabs, downloads,
     modified clicks and same-page anchors do not) */
  var leaving = false, leaveSafety = 0;
  function unturn() {   /* the next page never arrived (a 204, a download, a stopped load): slide the sheet off this one */
    leaving = false;
    try { sessionStorage.removeItem("km-turn"); } catch (err) {}
    d.classList.remove("km-tb-leave"); d.classList.add("km-tb-arrive");
    lift(false);
  }
  document.addEventListener("click", function (e) {
    if (!T.motion || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-no-turn")) return;
    var url; try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    try { sessionStorage.setItem("km-turn", "1"); } catch (err) {}
    clearTimeout(T.safety); clear();
    d.classList.add("km-tb-leave");
    setTimeout(function () { location.href = url.href; }, LEAVE);
    clearTimeout(leaveSafety);
    leaveSafety = setTimeout(unturn, LEAVE + 2000);   /* cleared on pagehide, when the page really goes */
  });
  window.addEventListener("pagehide", function () { clearTimeout(leaveSafety); });
  /* back/forward from the bfcache: the page comes back covered — lift it as a warm arrival */
  window.addEventListener("pageshow", function (ev) {
    if (!ev.persisted || !d.classList.contains("km-tb-leave")) return;
    leaving = false; clearTimeout(leaveSafety);
    try { sessionStorage.removeItem("km-turn"); } catch (err) {}
    d.classList.remove("km-tb-leave"); d.classList.add("km-tb-arrive");
    requestAnimationFrame(function () { requestAnimationFrame(function () { lift(false); }); });
  });
})();
/* </km:turn-body> */
