(function () {
  /* ── r10-infra · S · "How we build it" (second build) ────────────────────────────────────────────
     The markup is the FINAL frame. Each bay plays its own pass once, when 40% of its drawing is on
     screen: Web Animations are created at that moment (nothing is set up before a bay comes into view),
     every one of them fills backwards from the bay's empty state, and they are cancelled when the pass
     settles, so the page always rests on the CSS. Only the drawing the frame shows is animated.
       01 the sending setup (≈6.9 s) · 02 data and signals (≈6.9 s) · 03 the routing rules, the wow
       (≈5.5 s for the first event; the reader picks the others) · 04 the CRM record (≈7.2 s)
     Two bays never play in the same view: a bay that comes in while another is still playing on
     screen waits for it. Standalone builds (mk shots) play all four at once, 600 ms apart; add #reader
     to the address to make a standalone page wait for its reader the way a stitched page does.
     Bay 03 is also the control: one tab stop (roving tabindex), arrow keys move between events, a
     press or tap plays that event; any press or focus stops the automatic pass for good. Replay
     restarts a bay. Reduced motion: no animations and no timers; the events still switch, instantly.
     Without the script, the finished frames show, Replay stays invisible and the events are inert.    */
  var ID = "km-r10-infra-S", P = ID + "__";
  var EO = "cubic-bezier(0.2, 0.7, 0.3, 1)", EI = "cubic-bezier(0.65, 0, 0.35, 1)", LIN = "linear";

  // THE LOAD-TIME HOLD: mark every root as soon as this script is parsed (motion allowed only), so a bay
  // the reader has not reached yet never shows its finished drawing first (S.css, top).
  try {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      Array.prototype.forEach.call(document.querySelectorAll("." + ID), function (r) { r.classList.add("is-held"); });
  } catch (e) {}

  function $(el, s) { return el.querySelector(s); }
  function $$(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }

  // ── a pass: a list of animations, all filling backwards from their first keyframe ──
  function Pass() { this.list = []; this.end = 0; }
  // seq(el, steps): one animation through absolute times. steps: [[t, {props}, easing-to-next?], …]
  Pass.prototype.seq = function (el, steps, pseudo) {
    if (!el || !el.animate || steps.length < 2) return null;
    var t0 = steps[0][0], t1 = steps[steps.length - 1][0], d = Math.max(1, t1 - t0);
    var kf = steps.map(function (s) {
      var k = {}; for (var p in s[1]) k[p] = s[1][p];
      k.offset = Math.min(1, Math.max(0, (s[0] - t0) / d)); k.easing = s[2] || LIN; return k;
    });
    for (var i = 1; i < kf.length; i++) if (kf[i].offset < kf[i - 1].offset) kf[i].offset = kf[i - 1].offset;
    var o = { duration: d, delay: Math.max(0, t0), fill: "backwards" };
    if (pseudo) o.pseudoElement = pseudo;
    var a = el.animate(kf, o);
    this.list.push(a); this.end = Math.max(this.end, t1); return a;
  };
  // tw(el, from, to, at, dur, ease): a two-keyframe tween
  Pass.prototype.tw = function (el, from, to, at, dur, ease, pseudo) { return this.seq(el, [[at, from, ease || EO], [at + dur, to]], pseudo); };
  Pass.prototype.fade = function (el, at, dur) { return this.tw(el, { opacity: 0 }, { opacity: 1 }, at, dur || 360); };
  Pass.prototype.up = function (el, at, dur) { return this.tw(el, { opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }, at, dur || 520); };
  Pass.prototype.plot = function (el, at, dur) { return this.tw(el, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDasharray: "1 1", strokeDashoffset: 0 }, at, dur || 500, EI); };
  Pass.prototype.cancel = function () { this.list.forEach(function (a) { try { a.cancel(); } catch (e) {} }); this.list = []; };

  function vis(el) { return !!el && getComputedStyle(el).visibility === "visible"; }
  function geoSvg(bay) {   // the one drawing the frame shows
    var gs = $$(bay, "." + P + "geo");
    for (var i = 0; i < gs.length; i++) if (vis(gs[i])) return $(gs[i], "svg");
    return null;
  }
  function A(svg, a) { return $$(svg, '[data-a="' + a + '"]'); }
  function A1(svg, a) { return $(svg, '[data-a="' + a + '"]'); }
  function css(el, v) { return getComputedStyle(el).getPropertyValue(v).trim(); }

  // ═══ bay 01 · the sending setup ══════════════════════════════════════════════════════════════
  var G1 = [[0.6, 0.9, 0.8, 0.7], [1.1, 3.6]];
  function pass1(bay) {
    var s = geoSvg(bay), p = new Pass();
    if (!s) return p;
    var px = +s.getAttribute("data-px");
    // the main address: outline, then the solid block, then its two lines
    p.plot(A1(s, "mainO"), 80, 420);
    p.fade(A1(s, "mainF"), 420, 320);
    A(s, "mainL").forEach(function (g) { p.fade(g, 640, 380); });
    // routes out to the two sending addresses, and the boxes as each route arrives
    A(s, "route").forEach(function (r, i) { p.plot(r, 950 + i * 160, 520); });
    p.fade(A1(s, "joints"), 950, 300);
    A(s, "box").forEach(function (b, i) { p.plot(b, 1300 + i * 160, 380); });
    A(s, "boxT").forEach(function (b, i) { p.fade(b, 1500 + i * 160, 320); });
    // the three ID checks: named first, then lit lane by lane
    var fan = A1(s, "fan");
    if (fan) Array.prototype.forEach.call(fan.children, function (f, j) { p.plot(f, 1800 + j * 120, 420); });
    p.fade(A1(s, "fanT"), 2050, 380);
    A(s, "node").forEach(function (n) { p.fade(n, 1800, 300); });
    A(s, "lit").forEach(function (n) { var l = +n.getAttribute("data-l") - 1, j = +n.getAttribute("data-j"); p.fade(n, 2200 + l * 360 + j * 120, 200); });
    // the day ruler, the weekly checks and the warm-up dimension
    p.fade(A1(s, "ruler"), 2900, 400);
    p.fade(A1(s, "rulerT"), 3000, 360);
    p.fade(A1(s, "guides"), 2950, 400);
    p.tw(A1(s, "dim"), { opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }, 3100, 500);
    p.fade(A1(s, "gHead"), 3000, 360);
    p.fade(A1(s, "limit"), 3050, 360);
    A(s, "gTrack").forEach(function (g) { p.fade(g, 3050, 360); });
    // the days run: today's line sweeps, a bar rises each day, the complaints are read every 7 days
    var T0 = 3450, DAY = 65, HOLD = 1150;
    function at(d) { return T0 + d * DAY + (d > 14 ? HOLD : 0); }
    var x28 = 28 * px, x14 = 14 * px;
    $$(s, "." + P + "ph").forEach(function (ph) { p.seq(ph, [[T0 - 200, { opacity: 0, transform: "translateX(0px)" }], [T0, { opacity: 1, transform: "translateX(0px)" }],
      [T0 + 14 * DAY, { opacity: 1, transform: "translateX(" + x14 + "px)" }], [T0 + 14 * DAY + HOLD, { opacity: 1, transform: "translateX(" + x14 + "px)" }],
      [at(28), { opacity: 1, transform: "translateX(" + x28 + "px)" }], [at(28) + 350, { opacity: 0, transform: "translateX(" + x28 + "px)" }]]); });
    A(s, "bars").forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (b) {
        var d = +b.getAttribute("data-d");
        p.tw(b, { transform: "scaleY(0)" }, { transform: "scaleY(1)" }, at(d - 1), 300, EO);
      });
    });
    var checks = [1, 2, 3, 4].map(function (w) { return T0 + 7 * w * DAY + (w > 2 ? HOLD : 0); });
    $$(s, "." + P + "flash").forEach(function (ln) {
      var w = +ln.getAttribute("data-w");
      p.seq(ln, [[checks[w - 1], { opacity: 0 }, EO], [checks[w - 1] + 160, { opacity: 0.9 }, EO], [checks[w - 1] + 760, { opacity: 0 }]]);
    });
    var fg = css(s, "--fg"), red = css(s, "--accent");
    var tPause = checks[1];
    A(s, "gFill").forEach(function (g) {
      var l = +g.getAttribute("data-l") - 1, v = G1[l], vf = v[v.length - 1], st = [[0, { transform: "scaleX(0)" }]];
      v.forEach(function (x, i) {
        st.push([checks[i], { transform: "scaleX(" + (i ? v[i - 1] / vf : 0) + ")" }, EI]);
        st.push([checks[i] + 420, { transform: "scaleX(" + x / vf + ")" }]);
      });
      p.seq(g, st);
      if (l === 1) p.seq(g, [[0, { fill: fg }], [tPause + 260, { fill: fg }, EO], [tPause + 520, { fill: red }]]);
    });
    // lane 2 passes the limit at the day-14 check: its route goes dashed, it stops, its plan stays a ghost
    A(s, "stW").forEach(function (w) {
      var l = +w.getAttribute("data-l");
      var off = l === 2 ? tPause + 380 : checks[2] + 200;
      p.seq(w, [[3200, { opacity: 0 }, EO], [3560, { opacity: 1 }], [off, { opacity: 1 }, EO], [off + 260, { opacity: 0 }]]);
    });
    p.fade(A1(s, "stP"), tPause + 560, 320);
    p.fade(A1(s, "stS"), checks[2] + 420, 320);
    var r2 = $(s, '[data-a="route"][data-l="2"]');
    p.seq(r2, [[950, { opacity: 1 }], [tPause + 300, { opacity: 1 }, EO], [tPause + 700, { opacity: 0 }]]);
    p.seq(A1(s, "routeD"), [[0, { opacity: 0 }], [tPause + 300, { opacity: 0 }, EO], [tPause + 700, { opacity: 1 }]]);
    p.seq(A1(s, "ghost"), [[0, { opacity: 0 }], [tPause + 500, { opacity: 0 }, EO], [tPause + 1000, { opacity: 1 }]]);
    return p;
  }

  // ═══ bay 02 · data and signals ═══════════════════════════════════════════════════════════════
  function pass2(bay) {
    var s = geoSvg(bay), p = new Pass();
    if (!s) return p;
    p.tw(A1(s, "dim"), { opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }, 150, 500);
    // the 1,200 plot in, left to right
    p.seq(A1(s, "cover"), [[0, { opacity: 1, transform: "scaleX(1)" }], [250, { opacity: 1, transform: "scaleX(1)" }, EI], [1050, { opacity: 1, transform: "scaleX(0)" }], [1060, { opacity: 0, transform: "scaleX(0)" }]]);
    // the daily check sweeps across; a company with a reason to talk now lights as it passes
    var scan = A1(s, "scan"), sx = +scan.getAttribute("x1");
    var fly = A(s, "fly")[0];
    var sq = fly ? $$(fly, "rect") : [];
    var gx0 = Infinity; sq.forEach(function (r) { gx0 = Math.min(gx0, +r.getAttribute("data-gx")); });
    var gL = gx0 - 2, S0 = 1100, S1 = 2450;
    p.seq(scan, [[S0 - 120, { opacity: 0, transform: "translateX(" + (gL - sx) + "px)" }], [S0, { opacity: 1, transform: "translateX(" + (gL - sx) + "px)" }, LIN], [S1, { opacity: 1, transform: "translateX(0px)" }]]);
    p.fade(A1(s, "scanT"), S1 + 100, 360);
    // one company, worked out: its three reasons stack up to the line at three
    p.tw(A1(s, "ring"), { opacity: 0, transform: "scale(1.6)" }, { opacity: 1, transform: "none" }, 2700, 360);
    p.plot(A1(s, "lead"), 2900, 520);
    p.fade(A1(s, "axis"), 3200, 320);
    p.fade(A1(s, "axisT"), 3250, 320);
    p.seq(A1(s, "thr"), [[3350, { opacity: 0 }, EO], [3700, { opacity: 0.5 }], [5100, { opacity: 0.5 }, EO], [5400, { opacity: 1 }]]);
    A(s, "rseg").forEach(function (g) {
      var i = +g.getAttribute("data-i"), v = g.classList.contains(P + "rsegv");
      p.tw(g, { transform: v ? "scaleY(0)" : "scaleX(0)" }, { transform: "none" }, 3650 + i * 600, 440, EI);
    });
    A(s, "rsegT").forEach(function (t) { var i = +t.getAttribute("data-i"); p.fade(t, 3800 + i * 600, 320); });
    // the 38 leave the grid for this week's tray, nearest first; each leaves a hole
    var down = s.getAttribute("data-fly") === "down", F0 = 5500, STAG = 16;
    var span = Math.max(1, sx - gx0);
    sq.forEach(function (r) {
      var n = +r.getAttribute("data-n"), gx = +r.getAttribute("data-gx"), gy = +r.getAttribute("data-gy"), tx = +r.getAttribute("data-tx"), ty = +r.getAttribute("data-ty");
      var dx = gx - tx, dy = gy - ty, lit = S0 + ((gx - gx0) / span) * (S1 - S0), f = F0 + n * STAG;
      var mid = down ? "translate(" + dx + "px, 0px)" : "translate(0px, " + dy + "px)";
      p.seq(r, [[0, { opacity: 0, transform: "translate(" + dx + "px, " + dy + "px)" }], [lit, { opacity: 0, transform: "translate(" + dx + "px, " + dy + "px)" }, EO],
        [lit + 160, { opacity: 1, transform: "translate(" + dx + "px, " + dy + "px)" }], [f, { opacity: 1, transform: "translate(" + dx + "px, " + dy + "px)" }, EI],
        [f + (down ? 380 : 520), { opacity: 1, transform: mid }, EI], [f + 960, { opacity: 1, transform: "translate(0px, 0px)" }]]);
    });
    var holes = A(s, "holes")[0];
    if (holes) $$(holes, "rect").forEach(function (h) { var n = +h.getAttribute("data-n"); p.seq(h, [[0, { opacity: 0 }], [F0 + n * STAG + 40, { opacity: 0 }], [F0 + n * STAG + 160, { opacity: 1 }]]); });
    p.fade(A1(s, "tray"), F0 - 300, 360);
    p.fade(A1(s, "count"), F0 + 38 * STAG + 700, 400);
    return p;
  }

  // ═══ bay 03 · the routing rules (the wow) ════════════════════════════════════════════════════
  // Times are for the automatic pass; a reader's own press runs the same mechanism without the intro.
  var DESC = 330, READ = 420, RUN = 450;
  function rows3(b3) { return $$(b3, "." + P + "row"); }
  function setFire(b3, r) {
    b3.setAttribute("data-fire", String(r));
    rows3(b3).forEach(function (row) {
      var n = +row.getAttribute("data-r");
      row.setAttribute("data-st", n < r ? "no" : n === r ? "yes" : "");
    });
  }
  function pass3(bay, intro) {
    var b3 = $(bay, "." + P + "b3"), p = new Pass();
    var lad = $(b3, "." + P + "lad"), ol = $(b3, "." + P + "rows"), rows = rows3(b3), tok = $(b3, "." + P + "tok");
    var m = +b3.getAttribute("data-fire"), lg = vis($(b3, "." + P + "entry"));
    var top0 = ol.offsetTop;
    var g = rows.map(function (row) { var rung = $(row, "." + P + "rung"); return { top: top0 + row.offsetTop, h: row.offsetHeight, y: top0 + row.offsetTop + rung.offsetTop, w: rung.offsetWidth }; });
    var t = 0, c2 = css(b3, "--fg-2"), c3 = css(b3, "--fg-3");
    if (intro) {
      p.fade($(b3, "." + P + "ev > ." + P + "k"), 0, 320);
      $$(b3, "." + P + "evb").forEach(function (b, i) { p.up(b, 80 + i * 90, 480); });
      p.fade($(b3, "." + P + "ladk"), 160, 320);
      p.tw(ol, { transform: "scaleY(0)" }, { transform: "scaleY(1)" }, 200, 560, EI, "::before");
      rows.forEach(function (row, i) {
        p.fade($(row, "." + P + "rn"), 300 + i * 70, 300);
        if (i + 1 !== m) p.fade($(row, "." + P + "rt"), 320 + i * 70, 360);
        p.tw($(row, "." + P + "rung"), { opacity: 0 }, { opacity: 1 }, 300 + i * 70, 300);
      });
      var outk = $(b3, "." + P + "out > ." + P + "k"); if (outk && lg) p.fade(outk, 360, 320);
      t = 900;
    } else t = 200;
    // the chosen event's line runs to the top of the rail (desktop)
    if (lg) { var ent = $(b3, "." + P + "ent[data-e='" + ({ 3: 1, 4: 2, 5: 3 })[m] + "']"); p.plot(ent, t, 420); t += 420; }
    var T0 = t;
    // the token's path: down the rail, a stop at each rung (read), along the matched rung
    var path = [[T0, 0, top0]];
    for (var r = 1; r <= m; r++) {
      var arrive = T0 + r * DESC + (r - 1) * READ;
      path.push([arrive, 0, g[r - 1].y]);
      if (r < m) path.push([arrive + READ, 0, g[r - 1].y]);
    }
    var tm = T0 + m * DESC + (m - 1) * READ, tRun0 = tm + 300, tRun1 = tRun0 + RUN;
    path.push([tRun0, 0, g[m - 1].y], [tRun1, g[m - 1].w, g[m - 1].y]);
    var tokSteps = [[T0 - 120, { opacity: 0, transform: "translate(0px, " + (top0 - 4.5) + "px)" }]];
    path.forEach(function (q, i) { tokSteps.push([q[0], { opacity: 1, transform: "translate(" + q[1] + "px, " + (q[2] - 4.5) + "px)" }, i < path.length - 1 && path[i + 1][2] > q[2] ? EI : (i === path.length - 2 ? EI : LIN)]); });
    tokSteps.push([tRun1 + 160, { opacity: 0, transform: "translate(" + g[m - 1].w + "px, " + (g[m - 1].y - 4.5) + "px)" }]);
    p.seq(tok, tokSteps);
    // the trail follows the token: a segment grows as the token crosses it
    function yAt(time) {
      for (var i = 0; i < path.length - 1; i++) {
        var a = path[i], b = path[i + 1];
        if (time <= a[0]) return a[2];
        if (time <= b[0]) return a[2] + (b[2] - a[2]) * (time - a[0]) / Math.max(1, b[0] - a[0]);
      }
      return path[path.length - 1][2];
    }
    function grow(el, y0, y1, pseudo) {
      var times = [];
      for (var i = 0; i < path.length; i++) times.push(path[i][0]);
      for (var j = 0; j < path.length - 1; j++) {
        var a = path[j], b = path[j + 1];
        [y0, y1].forEach(function (yy) { if ((a[2] - yy) * (b[2] - yy) < 0) times.push(a[0] + (yy - a[2]) / (b[2] - a[2]) * (b[0] - a[0])); });
      }
      times.sort(function (x, y) { return x - y; });
      var st = [[0, { transform: "scaleY(0)" }]];
      times.forEach(function (tt) { var k = Math.max(0, Math.min(1, (yAt(tt) - y0) / Math.max(1, y1 - y0))); st.push([tt, { transform: "scaleY(" + k.toFixed(4) + ")" }]); });
      p.seq(el, st, pseudo);
    }
    grow(ol, top0, top0 + 16, "::after");
    rows.forEach(function (row, i) {
      var n = i + 1, gi = g[i];
      if (n < m) {
        grow(row, gi.top, gi.top + gi.h, "::after");
        var ta = T0 + n * DESC + (n - 1) * READ;
        // read: the probe runs along the rule, the answer is written, the probe lifts
        p.seq($(row, "." + P + "probe"), [[ta, { opacity: 1, transform: "scaleX(0)" }, EO], [ta + 260, { opacity: 1, transform: "scaleX(1)" }], [ta + 320, { opacity: 1, transform: "scaleX(1)" }, EO], [ta + 520, { opacity: 0, transform: "scaleX(1)" }]]);
        p.fade($(row, "." + P + "no"), ta + 220, 220);
      } else if (n === m) {
        grow($(row, "." + P + "seg"), gi.top, gi.y);
        p.seq($(row, "." + P + "probe"), [[tRun0, { transform: "scaleX(0)" }, EI], [tRun1, { transform: "scaleX(1)" }]]);
        p.fade($(row, "." + P + "yes"), tm + 220, 260);
        var rin = 320 + i * 70;
        p.seq($(row, "." + P + "rt"), intro
          ? [[rin, { opacity: 0 }, EO], [rin + 360, { opacity: 0.72 }], [tm + 120, { opacity: 0.72 }, EO], [tm + 420, { opacity: 1 }]]
          : [[0, { opacity: 0.72 }], [tm + 120, { opacity: 0.72 }, EO], [tm + 420, { opacity: 1 }]]);
        var fg = css(b3, "--fg"), bg = css(b3, "--bg"), f3 = css(b3, "--fg-3");
        p.seq($(row, "." + P + "rung"), [[0, { backgroundColor: bg, borderColor: f3 }], [tm + 120, { backgroundColor: bg, borderColor: f3 }, EO], [tm + 360, { backgroundColor: fg, borderColor: fg }]], "::before");
        // the rule fires: the red block closes and sends out the next thing
        var act = $(row, "." + P + "act");
        var tC = tRun1 + 160;
        p.seq($(act, "." + P + "fireb"), [[0, { opacity: 0 }], [tm + 260, { opacity: 0 }, EO], [tm + 560, { opacity: 1 }]]);
        p.tw(act, lg ? { transform: "scaleX(0)" } : { transform: "scaleY(0)" }, { transform: "none" }, tRun1 - 20, 200, EO, "::before");
        p.tw($(act, "." + P + "fh--l"), { transform: "scaleX(0)" }, { transform: "none" }, tC, 440, EI);
        p.tw($(act, "." + P + "fh--r"), { transform: "scaleX(0)" }, { transform: "none" }, tC, 440, EI);
        p.fade($(act, "." + P + "ft"), tC + 420, 260);
        p.tw($(act, "." + P + "conn"), { transform: "scaleX(0)" }, { transform: "none" }, tC + 480, 220, EO);
        p.tw($(act, "." + P + "objw"), { opacity: 0, transform: "translateX(-28px)" }, { opacity: 1, transform: "none" }, tC + 640, 600, EO);
        var words = lg ? $(b3, "." + P + "oc[data-r='" + m + "']") : $(act, "." + P + "actt");
        if (words) {
          p.up($(words, "." + P + "then"), tC + 980, 480);
          p.fade($(words, "." + P + "who"), tC + 1280, 400);
        }
      } else {
        // a rule under the one that fired is never read: it stays, then dims
        p.seq($(row, "." + P + "rt"), [[0, { color: c2 }], [tm + 300, { color: c2 }, EO], [tm + 800, { color: c3 }]]);
      }
    });
    return p;
  }

  // ═══ bay 04 · the CRM record ═════════════════════════════════════════════════════════════════
  function pass4(bay) {
    var b4 = $(bay, "." + P + "b4"), p = new Pass();
    var led = $(b4, "." + P + "led");
    p.fade($(b4, "." + P + "rec"), 0, 320);
    var ruler = $(b4, "." + P + "lr--ruler .km-r10-infra-S__lt");
    p.tw(ruler, { transform: "scaleX(0)" }, { transform: "none" }, 100, 520, EI, "::before");
    $$(b4, "." + P + "day").forEach(function (d, i) { p.fade(d, 160 + i * 28, 220); });
    $$(b4, "." + P + "lk").forEach(function (k, i) { p.fade(k, 240 + i * 50, 320); });
    $$(b4, "." + P + "lane ." + P + "lt").forEach(function (lt, i) { p.tw(lt, { transform: "scaleX(0)" }, { transform: "none" }, 320 + i * 90, 620, EI, "::before"); });
    // five touches land, one every 800 ms; the stage bar runs with them
    var M0 = 950, STEP = 800;
    var tAt = {};
    $$(b4, "." + P + "mk[data-t]").forEach(function (mk) {
      var i = +mk.getAttribute("data-t"), t = M0 + (i - 1) * STEP; tAt[i] = t;
      p.tw($(mk, "." + P + "sq4"), { opacity: 0, transform: "translateY(-16px)" }, { opacity: 1, transform: "none" }, t, 380, EO);
      p.fade($(mk, "." + P + "ml"), t + 160, 300);
    });
    var stg = $$(b4, "." + P + "stg");
    var spans = [[tAt[1], tAt[2]], [tAt[2], tAt[5]], [tAt[5], tAt[5] + 600]];
    stg.forEach(function (sg, i) {
      p.tw($(sg, "." + P + "stgb"), { transform: "scaleX(0)" }, { transform: "none" }, spans[i][0], spans[i][1] - spans[i][0], LIN);
      p.fade($(sg, "." + P + "stgt"), spans[i][0] + 80, 300);
    });
    // a planned email to the sales manager
    var plan = $(b4, "." + P + "mk--plan"), tPlan = tAt[5] + 600;
    p.fade($(plan, "." + P + "sq4"), tPlan, 320);
    // the merge, its own beat: the duplicate shows below the record, its touch moves up into place
    var dup = $(b4, "." + P + "mk--dup"), dupRow = $(b4, "." + P + "lr--dup"), lane2 = dup.closest("." + P + "lane");
    var dupLt = $(dupRow, "." + P + "lt"), laneLt = $(lane2, "." + P + "lt"), dbox = $(b4, "." + P + "dupbox");
    // both tracks are measured in the frame (the rows are not positioned, so the frame is their offsetParent)
    var dy = (dupLt.offsetTop + dbox.offsetTop + dbox.offsetHeight / 2) - (laneLt.offsetTop + laneLt.offsetHeight / 2);
    var tD = tPlan + 400;
    p.fade($(b4, "." + P + "dupbox"), tD, 320);
    p.seq($(b4, "." + P + "dupt-a"), [[tD + 100, { opacity: 0 }, EO], [tD + 420, { opacity: 1 }], [tD + 1350, { opacity: 1 }, EO], [tD + 1550, { opacity: 0 }]]);
    p.seq($(b4, "." + P + "dupt-b"), [[0, { opacity: 0 }], [tD + 1550, { opacity: 0 }, EO], [tD + 1850, { opacity: 1 }]]);
    p.seq(dup, [[0, { opacity: 0, transform: "translateY(" + dy + "px)" }], [tD + 200, { opacity: 0, transform: "translateY(" + dy + "px)" }, EO],
      [tD + 520, { opacity: 1, transform: "translateY(" + dy + "px)" }], [tD + 700, { opacity: 1, transform: "translateY(" + dy + "px)" }, EI], [tD + 1400, { opacity: 1, transform: "translateY(0px)" }]]);
    // its words step aside while it moves, so it never runs over another label
    p.seq($(dup, "." + P + "ml"), [[tD + 640, { opacity: 1 }, EO], [tD + 760, { opacity: 0 }], [tD + 1400, { opacity: 0 }, EO], [tD + 1700, { opacity: 1 }]]);
    // someone leaves: their name is struck, their planned email is taken off
    var lane3 = $(b4, "." + P + "lane[data-left]"), tL = tD + 1900;
    p.tw($(lane3, "." + P + "who4"), { transform: "scaleX(0)" }, { transform: "none" }, tL, 360, EI, "::after");
    p.seq($(lane3, "." + P + "who4"), [[0, { color: css(b4, "--fg") }], [tL, { color: css(b4, "--fg") }, EO], [tL + 360, { color: css(b4, "--fg-3") }]]);
    p.fade($(lane3, "." + P + "left"), tL + 200, 320);
    p.tw(plan, { transform: "scaleX(0)" }, { transform: "none" }, tL + 420, 300, EI, "::after");
    p.seq($(plan, "." + P + "ml-a"), [[tPlan + 100, { opacity: 0 }, EO], [tPlan + 420, { opacity: 1 }], [tL + 520, { opacity: 1 }, EO], [tL + 700, { opacity: 0 }]]);
    p.seq($(plan, "." + P + "ml-b"), [[0, { opacity: 0 }], [tL + 700, { opacity: 0 }, EO], [tL + 1000, { opacity: 1 }]]);
    return p;
  }

  var PASSES = { 1: pass1, 2: pass2, 3: function (bay) { return pass3(bay, true); }, 4: pass4 };
  var OUTS = { 3: "Rule 3 fires. The person who backs us gets a one-page summary to show their bosses.", 4: "Rule 4 fires. Their security team gets our written answers, and a call with our engineer is offered.", 5: "Rule 5 fires. Sending stops on that address, and the person who runs sending is told." };

  var api = {
    init: function (root, opts) {
      var reduced = !!(opts && opts.reduced);
      var timers = [], offs = [], io = null, alive = true;
      function later(fn, ms) { var h = setTimeout(function () { if (alive) fn(); }, ms); timers.push(h); return h; }
      function on(el, ev, fn, o) { if (!el) return; el.addEventListener(ev, fn, o); offs.push(function () { el.removeEventListener(ev, fn, o); }); }
      var bays = $$(root, "." + P + "bay").map(function (el) { return { el: el, n: +el.getAttribute("data-bay"), pass: null, played: false, running: false, ratio: 0, pending: false, settleT: 0 }; });
      if (!bays.length) return function () {};
      if (reduced) root.classList.remove("is-held"); else root.classList.add("is-held", "is-armed");

      function settle(b) {
        if (b.pass) { b.pass.cancel(); b.pass = null; }
        b.running = false;
        bays.forEach(function (o) { if (o.pending && o.ratio >= 0.4) tryStart(o); });
      }
      function run(b, mk) {
        if (b.pass) b.pass.cancel();
        clearTimeout(b.settleT);
        b.pass = mk(b.el);
        b.el.classList.add("is-live");              // same task as the opening state: nothing flashes
        b.running = true; b.played = true; b.pending = false;
        b.settleT = later(function () { settle(b); }, b.pass.end + 80);
      }
      function start(b) { run(b, PASSES[b.n]); }
      function tryStart(b) {
        if (b.played || !alive) return;
        var busy = bays.some(function (o) { return o !== b && o.running && o.ratio >= 0.3; });
        if (busy) { b.pending = true; return; }
        start(b);
      }
      function finish(b) {   // jump to the finished frame now (a reader took over)
        clearTimeout(b.settleT);
        if (b.pass) { b.pass.cancel(); b.pass = null; }
        b.running = false; b.played = true; b.pending = false; b.el.classList.add("is-live");
      }

      // ── bay 03: the events are the control (one tab stop; arrow keys move and choose) ──
      var b3bay = bays.filter(function (b) { return b.n === 3; })[0];
      var b3 = b3bay && $(b3bay.el, "." + P + "b3");
      var group = b3 && $(b3, "." + P + "evs"), btns = group ? $$(group, "." + P + "evb") : [], live = b3 && $(b3, "." + P + "live");
      var auto = true;
      if (group) group.removeAttribute("inert");
      function choose(btn, focus) {
        btns.forEach(function (b) { var onb = b === btn; b.setAttribute("aria-checked", String(onb)); b.tabIndex = onb ? 0 : -1; });
        if (focus) btn.focus();
        var r = +btn.getAttribute("data-r");
        if (live) live.textContent = OUTS[r] || "";
        if (reduced) { setFire(b3, r); return; }
        auto = false;
        clearTimeout(b3bay.settleT);
        if (b3bay.pass) { b3bay.pass.cancel(); b3bay.pass = null; }
        b3bay.el.classList.add("is-live"); b3bay.played = true;
        // the last outcome lifts (160 ms; well inside the press, so a phone's reflow is never a layout shift),
        // then the new event is read from the top
        var fade = new Pass(), dyn = $$(b3, "." + P + "act, ." + P + "oc, ." + P + "no, ." + P + "yes, ." + P + "seg, ." + P + "probe, ." + P + "ent");
        dyn.forEach(function (el) { fade.list.push(el.animate([{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], { duration: 160, easing: EO, fill: "forwards" })); });
        $$(b3, "." + P + "row").forEach(function (row) { fade.list.push(row.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: EO, fill: "forwards", pseudoElement: "::after" })); });
        b3bay.pass = fade; b3bay.running = true;
        b3bay.settleT = later(function () {
          fade.cancel();
          setFire(b3, r);
          run(b3bay, function (el) { return pass3(el, false); });
        }, 170);
      }
      btns.forEach(function (btn, i) {
        on(btn, "click", function () { choose(btn, false); });
        on(btn, "keydown", function (e) {
          var k = e.key, j = -1;
          if (k === "ArrowDown" || k === "ArrowRight") j = (i + 1) % btns.length;
          else if (k === "ArrowUp" || k === "ArrowLeft") j = (i - 1 + btns.length) % btns.length;
          else if (k === "Home") j = 0; else if (k === "End") j = btns.length - 1;
          if (j < 0) return;
          e.preventDefault(); choose(btns[j], true);
        });
      });
      // focus inside the control stops the automatic pass for good (its finished frame shows)
      if (group) on(group, "focusin", function () { if (auto && b3bay.running && !reduced) { auto = false; finish(b3bay); } auto = false; });

      // ── Replay ──
      bays.forEach(function (b) {
        var rp = $(b.el, "." + P + "replay");
        if (!rp) return;
        if (reduced) return;
        rp.removeAttribute("tabindex"); rp.removeAttribute("aria-hidden");
        on(rp, "click", function () {
          clearTimeout(b.settleT);
          if (b.pass) { b.pass.cancel(); b.pass = null; }
          var hold = $(b.el, "." + P + "hold"), out = hold.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: EO, fill: "forwards" });
          b.running = true;
          b.settleT = later(function () { out.cancel(); start(b); }, 210);
        });
      });

      if (reduced) return cleanup;

      // ── when each bay plays ──
      var home = document.documentElement.classList.contains("km-home") || /reader/.test(location.hash);
      if (!home || !("IntersectionObserver" in window)) {
        bays.forEach(function (b, i) { later(function () { start(b); }, i * 600); });
      } else {
        io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            var b = bays.filter(function (o) { return o.fig === e.target; })[0]; if (!b) return;
            b.ratio = e.intersectionRatio;
            if (b.ratio >= 0.4) tryStart(b);
          });
        }, { threshold: [0, 0.2, 0.3, 0.4, 0.6, 0.8, 1] });
        bays.forEach(function (b) { b.fig = $(b.el, "." + P + "fig"); io.observe(b.fig); });
      }

      function cleanup() {
        alive = false;
        timers.forEach(clearTimeout); timers = [];
        offs.forEach(function (f) { f(); }); offs = [];
        if (io) { io.disconnect(); io = null; }
        bays.forEach(function (b) { if (b.pass) { b.pass.cancel(); b.pass = null; } b.el.classList.add("is-live"); });
        root.classList.remove("is-armed");
      }
      return cleanup;
    }
  };
  window.KM = api;
})();
