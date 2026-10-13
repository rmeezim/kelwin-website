/* ═══ lib/turn.js · the turn and the write-in (round 9 · kit-ac.css §13) ════════════════════
   THE TURN (after the founder's Palantir recording): on every page change and on entering the
   site, a graphite panel with a slanted leading edge covers the page, the Kelwin mark flickers
   on piece by piece (K3, K2, K1), and the panel sweeps off into the next page. The mark is
   chrome (a loader), never an illustration.
   THE WRITE-IN (after GoNimbly): the interior page's h1 (.ac-ihead > h1.ac-statement — only the
   page h1; every other head keeps the kit's rise, and reading copy never writes) writes itself
   in, letter by letter, as the panel lifts, as one pen — a set line starts only when the line
   before has landed (coherence pass; --ac-write-line); the rule, the lede, the action and the head plate
   follow its last letter (kit §13). The write-in never alters the set type: every letter is held
   at its measured, kerned place, the measured line breaks are locked for the whole write (so
   wrapping can never change mid-animation), nested spans (the .ac-accent) keep their weight and
   colour, the h1's accessible name is its own text throughout, and the authored DOM is put back
   when the last letter lands (or at once, if the width changes mid-write).

   One file, three parts, each between markers so tool/home.py can lift them out:
   · km:turn-head    runs BEFORE FIRST PAINT. home.py inlines it into <head>. It raises the panel
                     (html.km-arriving, + km-cold unless this page was reached by a turn) and arms
                     a 2.5s safety that lifts the panel whatever happens next.
   · km:turn-markup  the panel itself. home.py writes it as the first child of <body>, so it is
                     there from the first paint; hidden unless html carries km-arriving or
                     km-turning (no script = no panel). The body part creates it when missing.
   · km:turn-body    runs at the END OF <body>, BEFORE the slot boot (home.py inlines it there, so
                     a stitched page stays self-contained; loading this whole file there works too:
                     the head part skips itself when it runs that late). It lifts the panel once
                     the hold is over and the fonts are ready, splits the h1 for the write-in, and
                     turns the page on internal link clicks (with a safety that lifts the panel if
                     the next page never arrives: a 204, a download, a stopped load).
   Reduced motion: no classes, no split, no turn — the page is simply there.
   Timings are custom properties in kit-ac.css §13 (one place); this file reads them.
   The boot waits for window.KMTurn.open (resolves as the lift starts) before it plays the
   first slot, so every entrance starts as the page is uncovered.
   Arrived-by-a-turn is one sessionStorage flag ("km-turn"), set on the click, read once.    */

/* <km:turn-head> */
(function (d) {
  if (window.KMTurn) return;
  var T = window.KMTurn = { motion: false, warm: false, t0: (window.performance && performance.now()) || 0 };
  try { T.motion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  if (!T.motion || document.body) return;   /* too late to cover the first paint: no arrival */
  try { T.warm = sessionStorage.getItem("km-turn") === "1"; sessionStorage.removeItem("km-turn"); } catch (e) {}
  d.classList.add("km-arriving"); if (!T.warm) d.classList.add("km-cold");
  T.safety = setTimeout(function () { d.classList.remove("km-arriving", "km-cold", "km-lift"); }, 2500);
})(document.documentElement);
/* </km:turn-head> */

/* <km:turn-body> */
(function () {
  var d = document.documentElement, T = window.KMTurn;
  if (!T || T.body) return;
  T.body = true;

  /* <km:turn-markup> */
  var KM_TURN_MARKUP = '<div class="km-turn" data-surface="dark" aria-hidden="true"><div class="km-turn__panel"></div><svg class="km-turn__mark" viewBox="0 0 152 152" focusable="false"><g class="k k1"><rect x="0" y="0" width="152" height="45"/><rect x="108" y="0" width="44" height="152"/></g><g class="k k2"><rect x="0" y="60" width="94" height="38"/><rect x="55" y="60" width="39" height="92"/></g><g class="k k3"><rect x="0" y="114" width="42" height="38"/></g></svg></div>';
  /* </km:turn-markup> */
  if (!document.querySelector(".km-turn")) document.body.insertAdjacentHTML("afterbegin", KM_TURN_MARKUP);

  var css = getComputedStyle(d);
  function ms(name, fallback) { var v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? fallback : v; }
  var LEAVE = ms("--km-turn-leave", 560), GAP = ms("--km-turn-gap", 180), OUT = ms("--km-turn-out", 340);
  var HOLD = T.warm ? ms("--km-turn-hold-warm", 60) : ms("--km-turn-hold-cold", 420);
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

  /* 2 · arriving: hold, then lift. KMTurn.open resolves as the lift starts (and never before
     the split; never later than the safety) */
  var opened, lifted = false, clearer = 0;
  var openP = new Promise(function (ok) { opened = ok; });
  T.open = Promise.race([Promise.all([openP, split]), wait(T.t0 + 2500 - now())]).then(noop);
  function lift() {
    clearTimeout(T.safety); clearTimeout(clearer);
    d.classList.add("km-lift");
    opened();
    clearer = setTimeout(function () { d.classList.remove("km-arriving", "km-cold", "km-lift"); }, GAP + OUT + 60);
  }
  function liftOnce() { if (!lifted) { lifted = true; lift(); } }
  if (T.motion && d.classList.contains("km-arriving")) {
    Promise.all([split, wait(T.t0 + HOLD - now())]).then(liftOnce);
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
  function unturn() {   /* the next page never arrived (a 204, a download, a stopped load): sweep the panel off this one */
    leaving = false;
    try { sessionStorage.removeItem("km-turn"); } catch (err) {}
    d.classList.remove("km-turning"); d.classList.add("km-arriving", "km-lift");
    clearTimeout(clearer);
    clearer = setTimeout(function () { d.classList.remove("km-arriving", "km-cold", "km-lift"); }, GAP + OUT + 60);
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
    clearTimeout(clearer); clearTimeout(T.safety);
    d.classList.remove("km-arriving", "km-cold", "km-lift");
    d.classList.add("km-turning");
    setTimeout(function () { location.href = url.href; }, LEAVE);
    clearTimeout(leaveSafety);
    leaveSafety = setTimeout(unturn, LEAVE + 2000);   /* cleared on pagehide, when the page really goes */
  });
  window.addEventListener("pagehide", function () { clearTimeout(leaveSafety); });
  /* back/forward from the bfcache: the page comes back covered — lift it as a warm arrival */
  window.addEventListener("pageshow", function (ev) {
    if (!ev.persisted || !d.classList.contains("km-turning")) return;
    leaving = false; clearTimeout(leaveSafety);
    try { sessionStorage.removeItem("km-turn"); } catch (err) {}
    d.classList.remove("km-turning"); d.classList.add("km-arriving");
    requestAnimationFrame(function () { requestAnimationFrame(lift); });
  });
})();
/* </km:turn-body> */
