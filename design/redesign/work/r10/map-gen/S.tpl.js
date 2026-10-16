/* r10-map · S (v2) — Contact, "Where we work": the drafted world map and the reply ruler.
   The markup is the map as at build time, for a page without its script: the land, the frame, New
   York, and a ruler that says "We reply within two working days". This script:
   · reads the device's own time zone (Intl; no IP lookup, nothing stored) and finds that zone's city
     in a table baked from the system zone files;
   · lights every 2° cell of the world whose CLOCK reads 9 to 6 right now: each cell carries its real
     time zone (timezone-boundary-builder via tz-lookup, baked), and the browser gives each zone's
     offset today, daylight saving included;
   · places New York (our address) and the visitor, and under the map draws the visitor's
     own days as a ruler: their working days (Mon–Fri, 9 to 6), the next two counted 1 and 2, and a
     solid bar from now to the end of day 2, which is when the reply is due ("We reply by Tue 18:00,
     your time"). Nothing here claims an office, a client, a headcount or hours we cover;
   · draws the map for the box it's in: the whole world at 1440 and on tablets (whole-pixel dots at any
     width), and on phones a window cut round New York and the visitor;
   · plays the reveal once when the plate is 40% on screen (stitched page) or at once (standalone):
     frame → land swept in → the 9-to-6 area → New York → you → the reply bar. CSS does the timing;
     the cover that reveals the land moves by transform only;
   · then rewrites the times and the lit area once a minute. After the pass (or a press, which stops
     it), pointing at the map reads the time anywhere; the arrow keys do the same. "Replay" replays.
   Reduced motion: laid out and written once, no timers, nothing plays; the map still reads. */
(function () {
  /*@GEO@*/
  /*@DATA@*/
  var P = "km-r10-map-S";
  var NS = "http://www.w3.org/2000/svg";
  var NY_TZ = "America/New_York";
  var WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var NAMES = { St_Johns: "St John’s", Ho_Chi_Minh: "Ho Chi Minh City", Sao_Paulo: "São Paulo", Bogota: "Bogotá",
    Port_of_Spain: "Port of Spain", Asuncion: "Asunción", Mexico_City: "Mexico City", Kolkata: "Kolkata" };
  /* the pass, in ms from its start (S.css holds the same numbers) */
  var T = { bar: 5900, barLen: 800, end: 7100 };

  /* ── time, from the browser's own zone data ── */
  var FMT = {};
  function fmt(tz) {
    return FMT[tz] || (FMT[tz] = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", weekday: "short",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }
  function parts(tz, t) {
    var o = {};
    fmt(tz).formatToParts(new Date(t)).forEach(function (x) { o[x.type] = x.value; });
    return { y: +o.year, mo: +o.month, d: +o.day, h: +o.hour % 24, mi: +o.minute, s: +o.second, wd: WD.indexOf(o.weekday) };
  }
  function offMin(tz, t) {
    var p = parts(tz, t);
    return Math.round((Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - Math.floor(t / 1000) * 1000) / 60000);
  }
  /* local wall time → the instant (checked once more across a daylight-saving change) */
  function at(tz, y, mo, d, h, mi) {
    var g = Date.UTC(y, mo - 1, d, h, mi), o = offMin(tz, g), t = g - o * 60000, o2 = offMin(tz, t);
    return o2 === o ? t : g - o2 * 60000;
  }
  function hm(tz, t) { var p = parts(tz, t); return pad2(p.h) + ":" + pad2(p.mi); }
  function zoneOf() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { return ""; } }
  function lookup(z) {
    var i = z.indexOf("/"), reg = i < 0 ? "" : z.slice(0, i), rest = i < 0 ? z : z.slice(i + 1);
    return ZONES[reg] && ZONES[reg][rest];
  }
  function where(tz) {
    try { fmt(tz); } catch (e) { tz = ""; }
    if (!tz || /^(Etc\/)?(UTC|UCT|GMT|Universal|Zulu|Greenwich)([+-]?0)?$/i.test(tz)) return { tz: "UTC", utc: true, name: "UTC" };
    var z = lookup(tz) ? tz : LINKS[tz], ll = z && lookup(z);
    var short = "";
    try { short = new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "short" }).formatToParts(new Date()).filter(function (x) { return x.type === "timeZoneName"; })[0].value; } catch (e) { short = tz; }
    if (!ll) return { tz: tz, name: short };
    var seg = z.split("/").pop();
    return { tz: tz, city: NAMES[seg] || seg.replace(/_/g, " "), lat: ll[0], lon: ll[1] };
  }
  /* the reply: the visitor's own days from today to the second working day (Mon–Fri) after it; the
     reply is due at 18:00 that day, their time. Today never counts, so the promise is never shorter
     than two whole working days. */
  function replyPlan(tz, now) {
    var p = parts(tz, now), days = [], n = 0, k = 0;
    while (n < 2 && k < 10) {
      var dt = new Date(Date.UTC(p.y, p.mo - 1, p.d + k)), y = dt.getUTCFullYear(), mo = dt.getUTCMonth() + 1, d = dt.getUTCDate(), wd = dt.getUTCDay();
      var work = wd >= 1 && wd <= 5, count = k > 0 && work ? ++n : 0;
      days.push({ t: at(tz, y, mo, d, 0, 0), wd: wd, d: d, work: work, n: count,
        a: work ? at(tz, y, mo, d, 9, 0) : 0, b: work ? at(tz, y, mo, d, 18, 0) : 0,
        six: [6, 12, 18].map(function (h) { return at(tz, y, mo, d, h, 0); }) });
      k++;
    }
    var last = days[days.length - 1], nx = new Date(Date.UTC(p.y, p.mo - 1, p.d + k));
    return { days: days, t0: days[0].t, t1: at(tz, nx.getUTCFullYear(), nx.getUTCMonth() + 1, nx.getUTCDate(), 0, 0), due: last.b, dueWd: last.wd };
  }

  function el(tag, cls, attrs) {
    var n = document.createElementNS(NS, tag);
    if (cls) n.setAttribute("class", cls);
    for (var k in attrs) n.setAttribute(k, typeof attrs[k] === "number" ? r2(attrs[k]) : attrs[k]);
    return n;
  }
  function clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }

  window.KM = {
    init: function (root, opts) {
      var reduced = !!(opts && opts.reduced);
      var stitched = document.documentElement.classList.contains("km-home");
      var q = function (s) { return root.querySelector("." + P + "__" + s); };
      var plate = q("plate"), map = q("map"), ruler = q("ruler");
      if (!plate || !map || !ruler) return function () {};
      var S = { dots: q("dots"), lit: q("lit"), over: q("over"), cover: q("cover"), rsvg: q("rsvg") };
      var L = { day: q("lab--day"), ny: q("lab--ny"), you: q("lab--you"), probe: q("probe-t"), now: q("now"), due: q("due"), days: q("days"), nums: q("nums"), live: q("live") };
      var timers = [], io = null, raf = 0, state = "idle", tick = 0;

      var me = where(zoneOf());
      var you = me.lat != null;
      var rows = zoneRows(ZG);
      var offs = [];
      function groupOffsets(now) { offs = GROUPS.map(function (g) { try { return offMin(g[0], now); } catch (e) { return g[1]; } }); }

      root.classList.add("is-live");
      root.classList.toggle("is-you", you);
      root.querySelectorAll("[data-city]").forEach(function (n) { n.textContent = you ? me.city : me.name; });

      /* ── the map ── */
      /* Layout runs in two parts, so arriving on the section costs one short task: A lays out
         everything but the 9-to-6 area (one batch of reads, then writes: no forced layouts in
         between); B asks the browser for each zone's offset today and draws the area and its
         label, a moment later (the area is not shown until 2.4s into the pass). */
      var V = null, LIT = null, SZ = null, KO = [], BX = {};
      /* knock-outs: lines and dots stop short of every label. They live in SVG masks, which Chrome
         does not repaint when a CSS animation changes them, so during the pass the script adds each
         one as its label arrives (KON: the ones shown so far; null = all) */
      var KALL = [], KON = null;
      function knock(boxes) {
        if (boxes) KALL = boxes;
        [S.dots, S.lit, S.over].forEach(function (svg) {
          var g = svg.querySelector("." + P + "__ko");
          clear(g);
          KALL.forEach(function (b) { if (!KON || KON[b.f]) g.appendChild(el("rect", P + "__kr", { x: b.x - 6, y: b.y - 3, width: b.w + 12, height: b.h + 6 })); });
        });
      }
      /* three moments, just after each label starts to fade in (S.css): timers run a frame or two
         ahead of CSS animations, and a label crossing dots for a moment reads better than an empty
         slot before it. Each moment repaints the masked layers once. */
      var KT = [[3000, ["day"]], [3500, ["nym", "ny"]], [4950, ["youm", "you"]]];
      function setBox(svg, w, h) { svg.setAttribute("viewBox", "0 0 " + r2(w) + " " + r2(h)); }
      function place(n, b) { n.style.left = Math.round(b.x) + "px"; n.style.top = Math.round(b.y) + "px"; }
      function meet(a, b, m) { return a && b && a.x < b.x + b.w + m && b.x < a.x + a.w + m && a.y < b.y + b.h + m && b.y < a.y + a.h + m; }
      function hit(b, x, y, m) { return x > b.x - m && x < b.x + b.w + m && y > b.y - m && y < b.y + b.h + m; }

      function drawMap() {
        var bw = SZ.bw, bh = SZ.bh;
        var phone = bh > bw * 0.6;            /* CSS gives the phone a taller box: the crop */
        V = phone ? cropView(bw, bh, you ? me : null) : worldView(bw);
        var v = V, gd = guides(v), fr = frame(v);
        [S.dots, S.lit, S.over].forEach(function (s) { setBox(s, bw, bh); });
        var land = S.dots.querySelector("." + P + "__land");
        land.removeAttribute("stroke-dasharray");
        land.setAttribute("d", dotPath(v, LAND));
        S.dots.querySelector("." + P + "__mer").setAttribute("d", "M0 0");   /* the zone lines take the meridians' place */
        S.dots.querySelector("." + P + "__eq").setAttribute("d", gd.eq);
        S.over.querySelector("." + P + "__frame").setAttribute("d", "M" + fr.x0 + " " + fr.y0 + "H" + fr.x1 + "V" + fr.y1 + "H" + fr.x0 + "Z");
        S.over.querySelector("." + P + "__reg").setAttribute("d", fr.reg);
        S.over.querySelector("." + P + "__tk").setAttribute("d", gd.tk);
        var cv = S.cover.style;
        cv.left = Math.round(v.ox) + "px"; cv.top = Math.round(v.oy) + "px"; cv.width = Math.round(v.W) + "px"; cv.height = Math.round(v.H) + "px";
        cv.setProperty("--sweep", Math.round(v.W) + 2 + "px");

        /* the labels, in the map's own pixels */
        var x0 = v.ox, x1 = v.ox + v.W, y0 = v.oy, y1 = v.oy + v.H, ko = [];
        var inMap = function (b) { return b.x >= x0 + 6 && b.x + b.w <= x1 - 6 && b.y >= y0 + 6 && b.y + b.h <= y1 - 6; };

        /* New York: + and a square; its label right of it on a leader (left if the visitor is there) */
        var xn = lonX(v, NYC.lon), yn = latY(v, NYC.lat), xv = -1e3, yv = -1e3;
        var nyIn = inView(v, NYC.lon, NYC.lat);
        if (you) { xv = lonX(v, me.lon); yv = latY(v, Math.max(-56, Math.min(76, me.lat))); }
        var youIn = you && inView(v, me.lon, Math.max(-56, Math.min(76, me.lat)));
        var ny = S.over.querySelector("." + P + "__ny");
        ny.setAttribute("transform", "translate(" + Math.round(xn) + " " + Math.round(yn) + ")");
        ny.style.visibility = nyIn ? "" : "hidden";
        var nyB = null, nb = SZ.ny, gap = phone ? 18 : 30, stack = false;
        var lead = S.over.querySelector("." + P + "__lead"), right = true;
        if (nyIn) {
          var R = { x: xn + gap, y: yn - 9, w: nb.w, h: nb.h }, Lf = { x: xn - gap - nb.w, y: yn - 9, w: nb.w, h: nb.h };
          right = !(youIn && hit(R, xv, yv, 8)) && R.x + R.w <= x1 - 6;
          nyB = right ? R : Lf;
          var ly = Math.round(yn) + 0.5;
          lead.setAttribute("d", right ? "M" + Math.round(xn + 9) + " " + ly + "H" + Math.round(xn + gap - 4) : "M" + Math.round(xn - 9) + " " + ly + "H" + Math.round(xn - gap + 4));
        } else {
          /* New York is off this window: a reference on the frame's edge, the shorter way round */
          var cLon = (v.c0 + v.nc / 2) * 2 - 180, east = mod(NYC.lon - cLon + 180, 360) - 180 > 0;
          var xe = east ? Math.round(x1) - 2 : Math.round(x0) + 2, ye;
          /* at New York's latitude if it fits, else stepped clear of the visitor's mark */
          [yn, yn - 48, yn + 48, yn - 96, yn + 96].some(function (y) {
            ye = Math.round(Math.max(y0 + 22, Math.min(y1 - 40, y))) + 0.5;
            nyB = { x: east ? xe - 26 - nb.w : xe + 26, y: ye - 9, w: nb.w, h: nb.h };
            return !(youIn && (hit(nyB, xv, yv, 14) || Math.abs(ye - yv) < 12));
          });
          lead.setAttribute("d", east ? "M" + (xe - 22) + " " + ye + "H" + xe + "M" + (xe - 6) + " " + (ye - 4) + "L" + xe + " " + ye + "L" + (xe - 6) + " " + (ye + 4)
            : "M" + (xe + 22) + " " + ye + "H" + xe + "M" + (xe + 6) + " " + (ye - 4) + "L" + xe + " " + ye + "L" + (xe + 6) + " " + (ye + 4));
        }

        /* the visitor: crosshairs to the frame, a 10px square, the label in the first free quarter */
        var youB = null;
        var ch = S.over.querySelectorAll("." + P + "__ch"), ys = S.over.querySelector("." + P + "__you");
        if (youIn) {
          var X = Math.round(xv) + 0.5, Y = Math.round(yv) + 0.5, g9 = 10;
          var seg = [[x0, Y, Math.max(x0, xv - g9), Y], [X, y0, X, Math.max(y0, yv - g9)], [Math.min(x1, xv + g9), Y, x1, Y], [X, Math.min(y1, yv + g9), X, y1]];
          for (var i = 0; i < 4; i++) ch[i].setAttribute("d", "M" + r2(seg[i][0]) + " " + r2(seg[i][1]) + "L" + r2(seg[i][2]) + " " + r2(seg[i][3]));
          ys.setAttribute("x", Math.round(xv) - 5); ys.setAttribute("y", Math.round(yv) - 5);
          var yb = SZ.you, o = 14;
          var cands = [[xv + o, yv - o - yb.h], [xv + o, yv + o], [xv - o - yb.w, yv - o - yb.h], [xv - o - yb.w, yv + o]];
          var close = Math.hypot(xv - xn, yv - yn) < 44;
          /* the 9-to-6 label lives under the frame's top edge: keep that strip clear when we can */
          var strip = { x: x0, y: y0, w: v.W, h: 34 };
          for (var pass = 0; pass < 2 && !youB && !close; pass++) for (var j = 0; j < 4; j++) {
            var c = { x: cands[j][0], y: cands[j][1], w: yb.w, h: yb.h };
            if (inMap(c) && !meet(c, nyB, 12) && !hit(c, xn, yn, 12) && (pass || phone || !meet(c, strip, 0))) { youB = c; break; }
          }
          if (!youB) {
            /* too close to New York: the two labels stack beside New York, each keyed by its own square */
            stack = true;
            nyB.w = nb.w + 18;
            if (!right && nyIn) nyB.x = xn - gap - nyB.w;
            youB = { x: nyB.x, y: nyB.y + nyB.h + 8, w: yb.w + 18, h: yb.h };
            if (youB.y + youB.h > y1 - 6) youB.y = nyB.y - 8 - yb.h;
          }
          place(L.you, youB);
          ko.push({ x: xv - 9, y: yv - 9, w: 18, h: 18, f: "youm" });
        }
        map.classList.toggle("is-stack", stack);
        place(L.ny, nyB);
        L.ny.classList.remove("is-off");
        if (nyIn) ko.push({ x: xn - 10, y: yn - 10, w: 20, h: 20, f: "nym" });
        ko.push({ x: nyB.x, y: nyB.y, w: nyB.w, h: nyB.h, f: "ny" });
        if (youB) ko.push({ x: youB.x, y: youB.y, w: youB.w, h: youB.h, f: "you" });
        KO = ko; BX = { ny: nyB, you: youB, phone: phone };
      }

      /* B · where it's 9 to 6 now: each zone group's offset today, the lit cells, the area and its label */
      function drawLit(now) {
        var v = V; if (!v) return;
        groupOffsets(now);
        var u = new Date(now).getUTCHours() * 60 + new Date(now).getUTCMinutes();
        var lit = LIT = litGrid(rows, offs, u), sh = litShapes(v, lit);
        S.lit.querySelector("." + P + "__fill").setAttribute("d", sh.fill);
        S.lit.querySelector("." + P + "__litdots").setAttribute("d", dotPath(v, LAND, function (r, c) { return lit[r][c]; }));
        S.lit.querySelector("." + P + "__edge").setAttribute("d", sh.edge);
        var zl = zoneLines(v, rows, offs);
        S.dots.querySelector("." + P + "__zones").setAttribute("d", zl);
        S.lit.querySelector("." + P + "__zones").setAttribute("d", zl);   /* over the area's fill too */
        var ko = KO.slice(), x0 = v.ox, x1 = v.ox + v.W, y0 = v.oy, on = false;
        if (L.day && !BX.phone) {
          var db = SZ.day, y1 = v.oy + v.H;
          /* under the frame's top edge, centred over the widest lit run there (else at its ends);
             failing that, along the bottom edge (open sea); never over a label */
          [[litTop(v, lit, 1), y0 + 10], [litTop(v, lit, v.nr - 2), y1 - 10 - db.h]].some(function (row) {
            var run = row[0]; if (!run) return false;
            return [(run.x0 + run.x1) / 2 - db.w / 2, run.x0 + 8, run.x1 - 8 - db.w].some(function (x) {
              var b = { x: Math.max(x0 + 10, Math.min(x1 - 10 - db.w, x)), y: row[1], w: db.w, h: db.h };
              if (meet(b, BX.ny, 10) || meet(b, BX.you, 10)) return false;
              place(L.day, b); ko.push({ x: b.x, y: b.y, w: b.w, h: b.h, f: "day" }); on = true; return true;
            });
          });
        }
        if (L.day) L.day.classList.toggle("is-off", !on);
        knock(ko);
      }

      /* ── the reply ruler: the visitor's own days ── */
      var RP = null;
      var monoW = function (t) { return Math.ceil(t.length * 7.92); };   /* JetBrains Mono 12px, .06em */
      function drawRuler(now, plan) {
        var bw = SZ.rw, bh = SZ.rh;
        if (!bw || !V) return;
        RP = plan;
        var xa = Math.round(V.ox), xb = Math.round(V.ox + V.W);
        var X = function (t) { return xa + (t - plan.t0) / (plan.t1 - plan.t0) * (xb - xa); };
        var phone = V.mode === "crop", Y = phone ? { s: 46, n: 52, b0: 70, b1: 76, r0: 84, r1: 94, lab: 100 } : { s: 48, n: 54, b0: 72, b1: 78, r0: 86, r1: 96, lab: 104 };
        setBox(S.rsvg, bw, bh);
        var xn = X(now), xd = X(plan.due), g = S.rsvg;
        var set = function (c, d) { g.querySelector("." + P + "__" + c).setAttribute("d", d); };
        set("past", "M" + xa + " " + (Y.s + 0.5) + "H" + Math.round(xn));
        set("future", "M" + Math.round(xn) + " " + (Y.s + 0.5) + "H" + xb);
        var dt = "", st = "", blk = "", tdy = "";
        plan.days.forEach(function (d, i) {
          var x = Math.round(X(d.t)) + 0.5;
          if (i > 0) dt += "M" + x + " " + (Y.s - 12) + "V" + Y.s;
          d.six.forEach(function (t) { var x6 = Math.round(X(t)) + 0.5; st += "M" + x6 + " " + (Y.s - 5) + "V" + Y.s; });
          if (d.work) {
            var a = Math.round(X(d.a)), b = Math.round(X(d.b));
            var r = "M" + a + " " + Y.b0 + "H" + b + "V" + Y.b1 + "H" + a + "Z";
            if (d.n) blk += r; else tdy += r;
          }
        });
        set("dt", dt || "M0 0"); set("st", st || "M0 0"); set("blk", blk || "M0 0"); set("tdy", tdy || "M0 0");
        var bar = g.querySelector("." + P + "__bar");
        bar.setAttribute("x", Math.round(xn)); bar.setAttribute("y", Y.r0); bar.setAttribute("width", Math.max(2, Math.round(xd) - Math.round(xn))); bar.setAttribute("height", Y.r1 - Y.r0);
        set("nowt", "M" + (Math.round(xn) + 0.5) + " " + (Y.s - 10) + "V" + (Y.r1 + 2));
        set("duet", "M" + (Math.round(xd) - 0.5) + " " + (Y.s - 10) + "V" + (Y.r1 + 6));

        /* words and numerals (the day names are mono, so their widths are known without measuring) */
        clear(L.days);
        plan.days.forEach(function (d, i) {
          var s = document.createElement("span"), full = WD[d.wd] + " " + d.d;
          var nextX = i + 1 < plan.days.length ? X(plan.days[i + 1].t) : xb;
          s.className = P + "__dl";
          s.textContent = nextX - X(d.t) < monoW(full) + 34 ? WD[d.wd] : full;
          s.style.left = Math.round(X(d.t)) + 6 + "px";
          L.days.appendChild(s);
        });
        clear(L.nums);
        var span = Math.max(1, xd - xn);
        plan.days.forEach(function (d) {
          if (!d.n) return;
          var s = document.createElement("span");
          s.className = P + "__bn";
          s.textContent = String(d.n);
          s.style.left = Math.round(X(d.a)) + "px";
          s.style.top = Y.n + "px";
          s.style.setProperty("--d", Math.round(T.bar + T.barLen * Math.max(0, Math.min(1, (X(d.a) - xn) / span))) + "ms");
          L.nums.appendChild(s);
        });
        L.now.style.left = Math.round(xn) + "px";
        L.now.style.top = Y.lab + "px";
        var dw = SZ.due.w, nw = SZ.now.w;
        if (phone) { L.due.style.left = xa + "px"; L.due.style.top = ""; }
        else {
          var dx = Math.round(xd) - dw;
          if (dx < Math.round(xn) + nw + 24) dx = Math.min(xb - dw, Math.round(xn) + nw + 24);
          L.due.style.left = dx + "px"; L.due.style.top = Y.lab - 2 + "px";
        }
        ruler.style.setProperty("--xa", xa + "px");
      }

      /* ── the words that change with the clock ── */
      function texts(now, plan) {
        var put = function (key, v) { root.querySelectorAll('[data-t="' + key + '"]').forEach(function (n) { if (n.textContent !== v) n.textContent = v; }); };
        put("ny", hm(NY_TZ, now));
        put("you", hm(me.tz, now));
        var dueTxt = "We reply by " + WD[plan.dueWd] + " 18:00" + (me.utc ? " UTC." : ", your time.");
        if (L.due.textContent !== dueTxt) L.due.textContent = dueTxt;
      }
      function measure() {
        var w = function (n) { return { w: n.offsetWidth, h: n.offsetHeight }; };
        SZ = { bw: map.clientWidth, bh: map.clientHeight, rw: ruler.clientWidth, rh: ruler.clientHeight,
          day: w(L.day), ny: w(L.ny), you: w(L.you), due: w(L.due), now: w(L.now) };
        /* the labels are measured unstacked; the stack adds its key's room in drawMap */
        if (map.classList.contains("is-stack")) { SZ.ny.w -= 18; SZ.you.w -= 18; }
      }
      function layoutA(now) {
        var plan = replyPlan(me.tz, now);
        texts(now, plan);
        measure();                          /* the one batch of reads */
        if (!SZ.bw || !SZ.bh) return false;
        drawMap();
        drawRuler(now, plan);
        knock(KO);
        return true;
      }
      function layout() { var now = Date.now(); if (layoutA(now)) drawLit(now); }

      /* the minute's redraw waits while the pass plays (it rebuilds elements the pass is animating) */
      var pend = false;
      function minute() { if (state === "run") pend = true; else layout(); }

      /* ── the pass ── */
      function go() {
        if (state !== "idle") return;
        if (io) { io.disconnect(); io = null; }
        state = "run";
        root.classList.remove("is-armed");
        plate.classList.add("is-run");
        KON = {}; knock();
        KT.forEach(function (k) { timers.push(setTimeout(function () { if (KON) { k[1].forEach(function (f) { KON[f] = true; }); knock(); } }, k[0])); });
        timers.push(setTimeout(done, T.end));
      }
      function done() {
        if (state === "done") return;
        state = "done";
        plate.classList.remove("is-run");
        plate.classList.add("is-done");
        KON = null; knock();
        root.classList.remove("is-armed");
        if (io) { io.disconnect(); io = null; }
        if (pend) { pend = false; layout(); }
      }
      function replay() {
        plate.classList.add("ac-cold");
        plate.classList.remove("is-run", "is-done");
        hideProbe();
        state = "idle";
        void plate.offsetWidth;
        plate.classList.remove("ac-cold");
        go();
      }
      /* any press, or keyboard focus inside the plate, ends the automatic pass for good */
      function stop() { if (state === "run" || state === "idle") done(); }

      /* ── the probe: point at the map, read the clock there ── */
      var probe = { k: -1, r: -1 };
      var pr = S.over.querySelector("." + P + "__probe");
      function hideProbe() { pr.style.visibility = "hidden"; L.probe.classList.add("is-off"); probe.k = -1; }
      function showProbe(k, kr, say) {
        var v = V; if (!v) return;
        k = Math.max(0, Math.min(v.nc - 1, k)); kr = Math.max(0, Math.min(v.nr - 1, kr));
        probe.k = k; probe.r = kr;
        var c = mod(v.c0 + k, COLS), r = v.r0 + kr, g = rows[r][c], o = offs[g];
        var now = Date.now(), m = mod(new Date(now).getUTCHours() * 60 + new Date(now).getUTCMinutes() + o, 1440);
        var t = pad2(Math.floor(m / 60)) + ":" + pad2(m % 60);
        var off = "UTC" + (o === 0 ? "" : (o > 0 ? "+" : "−") + Math.floor(Math.abs(o) / 60) + (Math.abs(o) % 60 ? ":" + pad2(Math.abs(o) % 60) : ""));
        var x = cx(v, k), y = cy(v, kr), w = cx(v, k + 1) - x, h = cy(v, kr + 1) - y;
        pr.setAttribute("x", x - 3.5); pr.setAttribute("y", y - 3.5); pr.setAttribute("width", w + 7); pr.setAttribute("height", h + 7);
        pr.style.visibility = "visible";
        L.probe.querySelector("." + P + "__pt").textContent = t;
        L.probe.querySelector("." + P + "__po").textContent = off;
        L.probe.classList.remove("is-off");
        var pw = L.probe.offsetWidth, ph = L.probe.offsetHeight;
        var lx = x + w + 10, ly = y - ph - 4;
        if (lx + pw > v.ox + v.W - 4) lx = x - 10 - pw;
        if (ly < v.oy + 4) ly = y + h + 6;
        L.probe.style.left = Math.round(lx) + "px"; L.probe.style.top = Math.round(ly) + "px";
        if (say && L.live) L.live.textContent = t + ", " + off;
      }
      function onMove(e) {
        if (state !== "done" || !V) return;
        var r = map.getBoundingClientRect(), s = r.width / map.clientWidth || 1;
        var x = (e.clientX - r.left) / s, y = (e.clientY - r.top) / s, v = V;
        if (x < v.ox || x > v.ox + v.W || y < v.oy || y > v.oy + v.H) { hideProbe(); return; }
        showProbe(Math.floor((x - v.ox) / v.cell), Math.floor((y - v.oy) / v.cell), false);
      }
      function onKey(e) {
        var d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
        if (!d || !V) return;
        e.preventDefault();
        stop();
        var n = e.shiftKey ? 5 : 1;
        if (probe.k < 0) { probe.k = Math.floor((lonX(V, you ? me.lon : NYC.lon) - V.ox) / V.cell); probe.r = Math.floor((latY(V, you ? me.lat : NYC.lat) - V.oy) / V.cell); n = 0; }
        showProbe(probe.k + d[0] * n, probe.r + d[1] * n, true);
      }

      if (reduced) layout();
      else if (layoutA(Date.now())) timers.push(setTimeout(function () { drawLit(Date.now()); }, 0));
      if (!reduced) {
        root.classList.add("is-armed");
        if (!stitched) timers.push(setTimeout(go, 300));
        else if (!("IntersectionObserver" in window)) go();
        else {
          io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting && e.intersectionRatio >= 0.4) go(); });
          }, { threshold: [0.4] });
          io.observe(plate);
        }
        /* once a minute, on the minute: the times, the lit area and the ruler */
        var toMinute = 60000 - (Date.now() % 60000) + 50;
        timers.push(setTimeout(function () { minute(); tick = setInterval(minute, 60000); timers.push(tick); }, toMinute));
      } else {
        state = "done";
        plate.classList.add("is-done");
      }
      var onResize = function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { layout(); if (probe.k >= 0) hideProbe(); }); };
      var onPress = function () { stop(); };
      var onLeave = function () { if (document.activeElement !== map) hideProbe(); };
      var onBlur = function () { hideProbe(); };
      var rep = q("replay");
      var onReplay = function () { replay(); };
      window.addEventListener("resize", onResize);
      plate.addEventListener("pointerdown", onPress);
      plate.addEventListener("focusin", onPress);
      map.addEventListener("pointermove", onMove);
      map.addEventListener("pointerleave", onLeave);
      map.addEventListener("keydown", onKey);
      map.addEventListener("blur", onBlur);
      if (rep) rep.addEventListener("click", onReplay);

      return function () {
        timers.forEach(function (t) { clearTimeout(t); clearInterval(t); });
        if (io) io.disconnect();
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        plate.removeEventListener("pointerdown", onPress);
        plate.removeEventListener("focusin", onPress);
        map.removeEventListener("pointermove", onMove);
        map.removeEventListener("pointerleave", onLeave);
        map.removeEventListener("keydown", onKey);
        map.removeEventListener("blur", onBlur);
        if (rep) rep.removeEventListener("click", onReplay);
        root.classList.remove("is-armed", "is-live", "is-you");
        plate.classList.remove("is-run", "is-done");
        map.classList.remove("is-stack");
      };
    }
  };
})();
