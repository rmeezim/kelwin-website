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
  /* ── geo2: pure geometry, shared by the build (src2/gen.mjs) and the page (S.js) ──
     The world is a 2° grid, 180 columns × 68 rows, 78°N … 58°S (equirectangular). Column c covers
     longitudes −180 + 2c … −178 + 2c; row r covers latitudes 78 − 2r … 76 − 2r.
     A VIEW places a window of that grid in a box of real pixels:
       world: the whole grid, cell = box width / 187.43, a margin of 26/7 cells round it (so the box
              keeps one aspect ratio at any width and the 1440 drawing is exactly 7px a cell);
       crop:  the phone's window, cut round New York and the visitor, cell 3.5–7px.
     Every dot is a 2×2px square on a whole pixel, so nothing renders half a pixel wide at any size. */
  var COLS = 180, ROWS = 68, LAT_N = 78;
  var NYC = { lat: 40.75, lon: -73.99 };            /* Midtown Manhattan */
  var WM = 26 / 7, WK = 180 + 2 * WM, WH = 68 + 2 * WM;   /* world view: margin and box ratio, in cells */

  function mod(a, n) { return ((a % n) + n) % n; }
  function r2(v) { return Math.round(v * 100) / 100; }

  function worldView(boxW) {
    var cell = boxW / WK, m = WM * cell;
    return { mode: "world", cell: cell, ox: m, oy: m, c0: 0, nc: COLS, r0: 0, nr: ROWS,
      W: COLS * cell, H: ROWS * cell, boxW: boxW, boxH: WH * cell, step: cell < 3.4 ? 2 : 1 };
  }
  /* the phone's window: the shorter way round from New York to the visitor, padded 24° each side */
  function cropView(boxW, boxH, you) {
    var m = 10, la = NYC.lat, lo = NYC.lon, span = 120, mid = lo + 30, latMid = 30, cell;
    if (you) {
      var d = mod(you.lon - lo + 180, 360) - 180;          /* −180 … 180, east positive */
      span = Math.max(100, Math.abs(d) + 36);
      mid = lo + d / 2;
      latMid = (la + Math.max(-50, Math.min(70, you.lat))) / 2;
      /* too far apart to show both at a readable scale: the window centres on the visitor, and New
         York becomes a reference on the frame's edge, pointing the way to it */
      if ((boxW - 2 * m) / (span / 2) < 3.5) { cell = 4.2; mid = you.lon; latMid = Math.max(-40, Math.min(60, you.lat)); }
    }
    cell = cell || Math.max(3.5, Math.min(7, (boxW - 2 * m) / (span / 2)));
    var nc = Math.min(COLS, Math.floor((boxW - 2 * m) / cell)), nr = Math.min(ROWS, Math.floor((boxH - 2 * m) / cell));
    var cMid = (mid + 180) / 2, rMid = (LAT_N - latMid) / 2;
    var c0 = mod(Math.round(cMid - nc / 2), COLS);
    var r0 = Math.max(0, Math.min(ROWS - nr, Math.round(rMid - nr / 2)));
    return { mode: "crop", cell: cell, ox: Math.round((boxW - nc * cell) / 2), oy: Math.round((boxH - nr * cell) / 2), c0: c0, nc: nc, r0: r0, nr: nr,
      W: nc * cell, H: nr * cell, boxW: boxW, boxH: boxH, step: cell < 3.4 ? 2 : 1 };
  }
  /* grid → view: the column's place in the window (−1 when it's outside) */
  function vcol(v, c) { var k = mod(c - v.c0, COLS); return k < v.nc ? k : -1; }
  function cx(v, k) { return Math.round(v.ox + k * v.cell); }             /* a cell's left edge */
  function cy(v, k) { return Math.round(v.oy + k * v.cell); }             /* a cell's top edge */
  function lonX(v, lon) { var u = (lon + 180) / 2; return v.ox + mod(u - v.c0, COLS) * v.cell; }
  function latY(v, lat) { return v.oy + ((LAT_N - lat) / 2 - v.r0) * v.cell; }
  function inView(v, lon, lat) {
    var u = mod((lon + 180) / 2 - v.c0, COLS), w = (LAT_N - lat) / 2 - v.r0;
    return u >= 0.3 && u <= v.nc - 0.3 && w >= 0.3 && w <= v.nr - 0.3;
  }
  /* a run of grid cells [row, firstCol, count] → dots: "M x y h2" (a 2px stroke 2px long = a 2×2 square) */
  function dotPath(v, runs, keep) {
    var s = "", st = v.step;
    for (var i = 0; i < runs.length; i++) {
      var r = runs[i][0], kr = r - v.r0;
      if (kr < 0 || kr >= v.nr || (st > 1 && r % st)) continue;
      var y = Math.round(v.oy + kr * v.cell + v.cell / 2);
      for (var c = runs[i][1], e = c + runs[i][2]; c < e; c++) {
        if (st > 1 && c % st) continue;
        var k = vcol(v, c);
        if (k < 0 || (keep && !keep(r, c))) continue;
        s += "M" + (Math.round(v.ox + k * v.cell + v.cell / 2) - 1) + " " + y + "h2";
      }
    }
    return s || "M0 0";
  }
  /* the same dots as dashed runs (one stroke per run of land): compact, for a whole-pixel cell only */
  function runPath(v, runs) {
    var s = "";
    for (var i = 0; i < runs.length; i++) {
      var kr = runs[i][0] - v.r0;
      if (kr < 0 || kr >= v.nr) continue;
      var y = Math.round(v.oy + kr * v.cell + v.cell / 2), x = Math.round(v.ox + runs[i][1] * v.cell + v.cell / 2) - 1;
      s += "M" + x + " " + y + "h" + Math.round((runs[i][2] - 1) * v.cell + 2);
    }
    return s || "M0 0";
  }
  /* the zone grid: per row [group, count, group, count, …] → a row of 180 group ids */
  function zoneRows(zg) {
    var out = [];
    for (var r = 0; r < zg.length; r++) {
      var row = new Array(COLS), c = 0, z = zg[r];
      for (var i = 0; i < z.length; i += 2) for (var n = 0; n < z[i + 1]; n++) row[c++] = z[i];
      out.push(row);
    }
    return out;
  }
  /* lit[r][c]: the clock there reads 09:00–17:59 at UTC minute u (offsets in minutes, by group) */
  function litGrid(rows, offs, u) {
    var lit = [], on = offs.map(function (o) { var m = mod(u + o, 1440); return m >= 540 && m < 1080; });
    for (var r = 0; r < rows.length; r++) { var a = new Array(COLS); for (var c = 0; c < COLS; c++) a[c] = on[rows[r][c]]; lit.push(a); }
    return lit;
  }
  /* the lit area: its fill (one rect per run of lit cells per row) and its outline (cell edges between
     lit and unlit, merged into long straight lines; nothing is drawn along the window's own edge) */
  function litShapes(v, lit) {
    var fill = "", edge = "", ext = { x0: 1e9, x1: -1e9 };
    var Lit = function (kr, k) { if (kr < 0 || kr >= v.nr || k < 0 || k >= v.nc) return null; return lit[v.r0 + kr][mod(v.c0 + k, COLS)]; };
    for (var kr = 0; kr < v.nr; kr++) {
      var y0 = cy(v, kr), y1 = cy(v, kr + 1), k = 0;
      while (k < v.nc) {
        if (!Lit(kr, k)) { k++; continue; }
        var a = k; while (k < v.nc && Lit(kr, k)) k++;
        var x0 = cx(v, a), x1 = cx(v, k);
        fill += "M" + x0 + " " + y0 + "H" + x1 + "V" + y1 + "H" + x0 + "Z";
      }
    }
    /* vertical edges: at column boundary k (1 … nc−1), runs of rows where lit changes */
    for (var k2 = 1; k2 < v.nc; k2++) {
      var x = cx(v, k2) + 0.5, run = -1;
      for (var kr2 = 0; kr2 <= v.nr; kr2++) {
        var d = kr2 < v.nr && Lit(kr2, k2) !== Lit(kr2, k2 - 1);
        if (d && run < 0) run = kr2;
        if (!d && run >= 0) { edge += "M" + x + " " + cy(v, run) + "V" + cy(v, kr2); run = -1; }
      }
    }
    /* horizontal edges: at row boundary kr (1 … nr−1) */
    for (var kr3 = 1; kr3 < v.nr; kr3++) {
      var y = cy(v, kr3) + 0.5, run2 = -1;
      for (var k3 = 0; k3 <= v.nc; k3++) {
        var d2 = k3 < v.nc && Lit(kr3, k3) !== Lit(kr3 - 1, k3);
        if (d2 && run2 < 0) run2 = k3;
        if (!d2 && run2 >= 0) { edge += "M" + cx(v, run2) + " " + y + "H" + cx(v, k3); run2 = -1; }
      }
    }
    return { fill: fill || "M0 0", edge: edge || "M0 0" };
  }
  /* every boundary between cells whose clocks differ right now (offsets by group): the time-zone
     lines, merged into long straight runs like the lit area's edge */
  function zoneLines(v, rows, offs) {
    var s = "";
    var O = function (kr, k) { return offs[rows[v.r0 + kr][mod(v.c0 + k, COLS)]]; };
    for (var k = 1; k < v.nc; k++) {
      var x = cx(v, k) + 0.5, run = -1;
      for (var kr = 0; kr <= v.nr; kr++) {
        var d = kr < v.nr && O(kr, k) !== O(kr, k - 1);
        if (d && run < 0) run = kr;
        if (!d && run >= 0) { s += "M" + x + " " + cy(v, run) + "V" + cy(v, kr); run = -1; }
      }
    }
    for (var kr2 = 1; kr2 < v.nr; kr2++) {
      var y = cy(v, kr2) + 0.5, run2 = -1;
      for (var k2 = 0; k2 <= v.nc; k2++) {
        var d2 = k2 < v.nc && O(kr2, k2) !== O(kr2 - 1, k2);
        if (d2 && run2 < 0) run2 = k2;
        if (!d2 && run2 >= 0) { s += "M" + cx(v, run2) + " " + y + "H" + cx(v, k2); run2 = -1; }
      }
    }
    return s || "M0 0";
  }
  /* the widest run of lit cells along a row near the top of the window, for the area's label */
  function litTop(v, lit, kr) {
    var best = null, k = 0;
    var row = lit[v.r0 + kr];
    while (k < v.nc) {
      if (!row[mod(v.c0 + k, COLS)]) { k++; continue; }
      var a = k; while (k < v.nc && row[mod(v.c0 + k, COLS)]) k++;
      if (!best || k - a > best[1] - best[0]) best = [a, k];
    }
    return best && { x0: cx(v, best[0]), x1: cx(v, best[1]) };
  }
  /* the frame's furniture: meridians every 30° and the equator (dashed guides), ticks every 15° on
     the frame's edges, all clipped to the window */
  function guides(v) {
    var mer = "", tk = "", eq = "";
    for (var lon = -165; lon < 180; lon += 15) {
      var u = mod((lon + 180) / 2 - v.c0, COLS);
      if (u <= 0.5 || u >= v.nc - 0.5) continue;
      var x = Math.round(v.ox + u * v.cell) + 0.5, y0 = Math.round(v.oy), y1 = Math.round(v.oy + v.H);
      if (lon % 30 === 0) mer += "M" + x + " " + y0 + "V" + y1;
      tk += "M" + x + " " + y0 + "v" + (lon % 30 ? 4 : 7) + "M" + x + " " + y1 + "v-" + (lon % 30 ? 4 : 7);
    }
    for (var lat = 75; lat > -60; lat -= 15) {
      var w = (LAT_N - lat) / 2 - v.r0;
      if (w <= 0.5 || w >= v.nr - 0.5) continue;
      var y = Math.round(v.oy + w * v.cell) + 0.5, x0 = Math.round(v.ox), x1 = Math.round(v.ox + v.W);
      if (lat === 0) eq = "M" + x0 + " " + y + "H" + x1;
      tk += "M" + x0 + " " + y + "h" + (lat % 30 ? 4 : 7) + "M" + x1 + " " + y + "h-" + (lat % 30 ? 4 : 7);
    }
    return { mer: mer || "M0 0", eq: eq || "M0 0", tk: tk || "M0 0" };
  }
  /* the frame and its four registration marks (13px +, centred on the corners) */
  function frame(v) {
    var x0 = Math.round(v.ox) + 0.5, y0 = Math.round(v.oy) + 0.5, x1 = Math.round(v.ox + v.W) - 0.5, y1 = Math.round(v.oy + v.H) - 0.5;
    var reg = "";
    [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].forEach(function (p) { reg += "M" + (p[0] - 6) + " " + p[1] + "h13M" + p[0] + " " + (p[1] - 6) + "v13"; });
    return { x0: x0, y0: y0, x1: x1, y1: y1, reg: reg };
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  var LAND = [[0,30,2],[0,42,1],[0,45,6],[0,54,27],[0,98,1],[0,141,2],[1,33,4],[1,40,1],[1,42,1],[1,44,6],[1,61,19],[1,118,2],[1,133,13],[1,159,3],[1,163,2],[2,28,5],[2,36,1],[2,39,2],[2,42,2],[2,45,4],[2,50,2],[2,62,17],[2,116,2],[2,130,24],[2,160,2],[3,0,1],[3,11,2],[3,28,1],[3,31,7],[3,42,2],[3,45,9],[3,63,14],[3,78,1],[3,102,2],[3,117,1],[3,123,3],[3,127,28],[3,156,10],[3,168,1],[3,179,1],[4,8,13],[4,22,17],[4,41,1],[4,43,3],[4,47,2],[4,52,4],[4,64,13],[4,99,9],[4,120,3],[4,124,50],[4,175,5],[5,0,3],[5,8,41],[5,53,5],[5,63,10],[5,97,14],[5,112,1],[5,114,12],[5,127,53],[6,2,2],[6,7,39],[6,47,1],[6,51,6],[6,64,6],[6,79,4],[6,96,5],[6,102,5],[6,108,1],[6,110,70],[7,8,37],[7,54,4],[7,65,4],[7,94,5],[7,101,79],[8,7,36],[8,51,4],[8,66,3],[8,93,6],[8,101,67],[8,170,1],[8,172,4],[9,9,4],[9,21,22],[9,51,5],[9,57,1],[9,93,6],[9,102,59],[9,166,1],[9,170,1],[10,11,1],[10,23,22],[10,52,7],[10,87,2],[10,94,1],[10,96,2],[10,101,58],[10,168,4],[11,8,1],[11,24,25],[11,51,10],[11,86,3],[11,94,1],[11,100,58],[11,168,3],[12,25,24],[12,51,11],[12,85,2],[12,88,2],[12,92,70],[12,168,1],[13,26,36],[13,88,2],[13,91,69],[13,161,1],[14,27,31],[14,61,2],[14,89,71],[14,161,1],[15,28,30],[15,63,1],[15,89,70],[15,161,1],[16,28,28],[16,57,2],[16,89,7],[16,97,8],[16,107,1],[16,109,49],[17,28,27],[17,85,7],[17,95,2],[17,99,5],[17,110,47],[17,160,2],[18,28,26],[18,86,5],[18,94,1],[18,97,2],[18,100,4],[18,105,50],[18,160,1],[19,28,25],[19,85,5],[19,98,1],[19,100,2],[19,103,46],[19,153,1],[19,160,1],[20,29,23],[20,87,2],[20,93,3],[20,97,1],[20,104,47],[20,153,2],[20,158,2],[21,30,22],[21,87,8],[21,102,1],[21,106,1],[21,108,42],[21,153,1],[21,156,4],[22,31,19],[22,86,10],[22,108,42],[22,155,2],[23,32,17],[23,85,14],[23,100,4],[23,105,46],[24,34,8],[24,49,1],[24,85,29],[24,115,36],[25,33,1],[25,35,6],[25,49,1],[25,83,24],[25,108,7],[25,117,33],[26,34,1],[26,36,5],[26,83,24],[26,109,7],[26,117,1],[26,123,27],[27,37,4],[27,48,2],[27,82,26],[27,109,11],[27,125,23],[27,150,1],[28,37,4],[28,45,2],[28,51,1],[28,81,28],[28,110,9],[28,125,9],[28,136,8],[29,38,4],[29,44,2],[29,53,2],[29,82,27],[29,111,8],[29,126,6],[29,137,6],[29,144,1],[30,40,6],[30,82,27],[30,111,6],[30,127,4],[30,137,7],[30,150,1],[31,44,4],[31,81,29],[31,111,4],[31,127,3],[31,139,5],[31,150,1],[32,46,2],[32,82,29],[32,112,1],[32,127,3],[32,139,6],[32,150,1],[33,47,1],[33,52,4],[33,82,30],[33,114,2],[33,128,2],[33,139,1],[33,142,2],[33,152,1],[34,48,1],[34,50,1],[34,52,8],[34,83,32],[34,128,1],[34,130,1],[34,139,1],[34,142,1],[35,51,10],[35,84,31],[35,130,1],[35,152,1],[36,51,13],[36,85,2],[36,88,1],[36,93,21],[36,138,1],[36,140,2],[36,147,2],[37,51,14],[37,95,18],[37,139,1],[37,141,1],[37,146,3],[38,50,15],[38,95,17],[38,139,2],[38,145,4],[38,150,1],[39,50,17],[39,94,17],[39,140,2],[39,145,4],[39,155,2],[40,50,20],[40,95,15],[40,141,2],[40,145,3],[40,149,2],[40,154,1],[40,156,1],[40,158,3],[41,49,23],[41,96,14],[41,142,1],[41,151,1],[41,159,4],[42,50,23],[42,96,14],[42,143,3],[42,159,5],[42,168,1],[43,51,21],[43,96,14],[43,148,1],[43,152,1],[43,160,2],[43,163,1],[43,170,1],[44,51,21],[44,97,13],[45,52,19],[45,96,14],[45,114,1],[45,155,3],[45,161,1],[46,52,19],[46,96,14],[46,114,1],[46,152,6],[46,161,2],[46,173,1],[47,54,16],[47,96,13],[47,112,3],[47,151,8],[47,161,2],[48,55,15],[48,96,12],[48,112,3],[48,151,12],[49,55,15],[49,97,11],[49,112,2],[49,148,17],[49,172,1],[50,55,13],[50,97,11],[50,112,2],[50,147,18],[51,55,11],[51,97,10],[51,112,1],[51,147,19],[52,55,11],[52,98,8],[52,147,20],[53,54,11],[53,98,8],[53,147,20],[54,54,11],[54,99,6],[54,148,19],[55,54,10],[55,99,5],[55,148,4],[55,157,9],[56,54,7],[56,148,1],[56,159,6],[56,176,1],[57,53,9],[57,160,5],[57,177,1],[58,53,6],[58,177,2],[59,53,6],[59,162,2],[59,176,2],[60,53,5],[60,163,1],[60,175,2],[61,53,4],[61,174,2],[62,53,4],[63,52,4],[63,124,1],[64,52,3],[65,53,3],[66,54,2]];
  var GROUPS = [["Etc/GMT+12",-720],["Etc/GMT+11",-660],["Etc/GMT+10",-600],["Etc/GMT+9",-540],["America/Edmonton",-360],["America/Chicago",-300],["America/Iqaluit",-240],["America/Halifax",-180],["America/Nuuk",-60],["Atlantic/Reykjavik",0],["Europe/Oslo",120],["Africa/Johannesburg",120],["Europe/Moscow",180],["Asia/Yekaterinburg",300],["Asia/Krasnoyarsk",420],["Asia/Shanghai",480],["Asia/Yakutsk",540],["Asia/Srednekolymsk",660],["Asia/Anadyr",720],["America/Anchorage",-480],["Australia/Brisbane",600],["America/Mazatlan",-420],["Etc/GMT+1",-60],["Europe/Kyiv",180],["America/Lima",-300],["America/Manaus",-240],["Europe/London",60],["Africa/Algiers",60],["America/Los_Angeles",-420],["America/Mexico_City",-360],["Etc/GMT+2",-120],["Asia/Muscat",240],["Asia/Urumqi",360],["America/St_Johns",-150],["America/Sao_Paulo",-180],["Europe/Chisinau",180],["Etc/GMT+8",-480],["Asia/Tehran",210],["Asia/Kabul",270],["Africa/Casablanca",60],["Asia/Kolkata",330],["Africa/Cairo",180],["Asia/Jerusalem",180],["Asia/Kathmandu",345],["Asia/Yangon",390],["Australia/Darwin",570],["America/Santiago",-180],["Pacific/Auckland",780],["Australia/Adelaide",630],["Australia/Sydney",660]];
  var ZG = [[0,4,1,7,2,8,3,7,4,13,5,9,6,5,7,4,8,22,9,4,22,3,9,8,10,13,11,2,12,17,13,2,14,22,15,4,16,19,17,3,18,4],[0,4,1,7,2,8,3,7,4,13,5,9,6,5,7,5,8,21,9,2,22,5,9,8,10,13,11,2,12,17,13,2,14,22,15,4,16,19,17,3,18,4],[18,4,19,4,1,1,19,10,3,4,4,20,5,5,6,12,8,19,22,7,9,8,10,11,11,4,12,13,13,7,14,16,16,11,20,6,17,11,18,7],[18,4,19,16,21,2,4,23,5,3,6,12,8,21,22,5,9,8,10,12,12,17,13,7,14,15,16,12,20,4,17,11,18,8],[18,4,19,16,21,2,4,24,5,2,6,12,8,21,22,5,9,8,10,8,23,2,12,18,13,9,14,12,16,14,20,3,17,11,18,9],[18,6,19,14,21,3,4,16,5,9,6,12,8,15,9,9,22,2,9,4,10,12,23,3,12,17,13,9,14,12,16,13,20,3,17,11,18,10],[18,5,19,15,21,4,4,15,5,8,24,3,6,10,8,15,9,9,22,2,9,4,10,12,23,3,12,15,13,12,14,11,16,17,20,2,17,10,18,8],[18,2,19,18,21,5,4,14,5,8,24,3,6,9,25,1,8,15,9,8,22,3,9,2,26,2,10,10,23,5,12,15,13,12,14,11,15,1,16,16,20,2,17,10,18,8],[18,2,19,18,21,7,4,12,5,9,6,10,7,1,25,1,8,15,9,8,22,3,9,2,26,2,10,9,27,1,23,5,12,12,13,15,14,11,15,2,16,14,20,4,17,8,18,9],[0,2,19,17,3,2,28,1,19,1,28,3,21,4,4,5,29,4,5,9,6,10,7,2,25,4,8,7,30,8,22,4,26,7,9,2,10,8,23,4,12,13,13,11,14,15,15,6,16,8,20,6,17,6,18,11],[0,2,19,6,1,1,19,10,3,4,28,5,21,2,4,5,29,4,5,9,6,10,7,2,25,4,8,7,30,8,22,4,26,7,9,2,10,8,23,4,12,12,31,1,13,9,32,2,14,11,15,9,16,8,20,7,17,4,18,13],[0,4,1,2,19,13,3,5,28,5,21,1,4,5,29,4,5,6,6,13,7,4,33,2,8,7,30,8,22,5,26,8,9,2,10,6,11,1,23,2,12,14,13,9,32,2,14,10,15,10,16,8,20,4,17,3,20,4,18,7,17,2,18,4],[0,4,1,2,19,13,3,4,28,7,4,5,29,4,5,6,6,11,7,6,33,2,8,7,30,8,22,5,26,8,10,10,12,11,31,3,13,13,14,10,15,8,16,4,15,2,16,3,20,4,17,3,20,4,18,7,17,2,18,4],[0,4,1,7,2,8,3,4,28,8,4,4,29,4,5,6,6,13,25,3,33,7,34,3,30,8,22,4,26,3,9,1,26,4,10,11,23,6,12,5,31,2,13,14,14,1,13,1,14,8,15,5,16,6,15,4,16,2,20,4,17,3,20,5,18,5,17,3,18,4],[0,4,1,7,2,8,3,4,28,8,21,1,4,3,29,4,5,6,6,14,25,1,33,8,34,3,30,8,22,4,26,3,9,1,10,14,23,9,12,3,13,20,14,5,15,6,16,2,15,9,16,1,20,4,17,3,20,6,18,4,17,3,18,4],[0,4,1,7,2,8,3,4,28,9,4,7,5,6,6,11,7,4,33,8,34,3,30,8,22,4,26,3,10,15,23,3,35,1,23,4,12,4,31,1,13,19,32,2,14,2,15,21,20,2,17,3,20,6,18,4,17,3,18,4],[0,4,1,7,2,8,3,4,28,3,36,1,28,6,4,7,5,7,6,9,7,3,25,3,33,6,34,3,30,8,22,4,26,3,10,15,23,5,12,8,13,17,32,5,14,1,15,20,20,3,16,1,17,2,20,6,18,4,17,3,18,4],[0,4,1,7,2,8,3,7,28,5,4,8,5,7,6,10,25,2,7,6,34,7,30,8,22,5,10,17,23,4,12,5,31,2,12,2,31,1,13,13,32,9,15,18,20,4,16,4,20,6,17,7,18,4],[0,4,1,7,2,8,3,7,28,7,4,6,5,8,6,9,25,4,7,4,34,7,30,8,22,5,26,3,10,12,27,1,10,1,23,2,12,9,31,4,13,10,32,9,15,18,16,8,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,28,7,4,6,5,7,6,10,25,4,7,4,34,7,30,8,22,5,26,3,10,12,23,4,12,9,37,2,31,1,12,1,13,12,32,7,15,17,16,9,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,28,7,4,6,5,9,6,5,24,3,25,8,34,7,30,8,22,6,26,1,10,4,27,6,10,3,23,5,12,9,37,7,13,2,38,4,13,2,32,2,15,22,16,9,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,28,7,21,2,4,3,5,9,6,6,24,3,25,8,34,7,30,8,22,6,39,4,27,9,10,1,23,5,11,2,23,1,12,6,37,7,38,6,13,2,40,1,15,23,16,9,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,28,7,21,2,4,3,5,9,6,6,24,3,25,8,34,7,30,8,22,5,39,5,27,7,11,7,41,4,42,1,12,5,37,7,38,5,13,2,40,2,15,23,16,9,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,28,4,36,1,28,2,21,3,4,2,5,10,6,5,24,3,25,8,34,7,30,8,22,5,39,4,27,7,11,7,41,5,42,1,12,6,37,7,38,3,13,3,40,3,15,22,16,9,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,4,28,4,21,2,29,2,5,9,29,1,6,3,24,5,25,8,34,7,30,8,22,4,39,3,27,9,11,8,41,4,12,8,37,6,13,5,40,4,43,2,15,5,40,1,15,14,16,9,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,4,28,2,21,4,29,4,5,7,29,1,6,2,24,6,25,8,34,7,30,8,22,4,39,3,27,9,11,7,41,6,12,7,37,6,13,4,40,7,43,2,40,4,44,2,15,12,16,9,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,6,21,5,29,11,6,2,24,6,25,8,34,7,30,8,22,2,39,3,9,3,27,8,11,7,41,6,12,8,31,3,37,2,13,5,40,8,32,2,40,1,44,2,15,12,16,10,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,6,21,6,29,9,6,3,24,6,25,8,34,7,30,8,22,2,39,2,9,6,27,8,11,5,41,7,12,7,31,6,13,2,40,11,32,1,40,1,44,3,15,11,16,10,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,4,21,8,29,8,24,1,6,5,24,2,25,10,34,7,30,8,22,2,39,2,9,7,27,10,11,9,12,9,31,6,40,11,32,1,44,4,14,4,15,10,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,4,21,7,29,8,24,2,6,2,24,2,6,3,25,10,34,7,30,8,22,2,9,11,27,10,11,8,12,7,31,7,40,10,32,2,44,3,14,5,15,10,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,4,21,8,29,11,24,5,25,1,24,1,25,8,34,7,30,8,22,3,9,10,27,10,11,7,12,7,31,8,40,9,32,2,44,4,14,5,15,10,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,4,21,8,29,12,24,6,25,8,34,7,30,8,22,2,9,11,27,10,11,6,12,9,31,7,40,9,32,2,44,4,14,6,15,9,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,5,25,1,24,1,25,8,34,7,30,8,22,2,9,10,27,10,11,7,12,12,31,4,40,7,32,7,44,2,14,7,15,7,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,5,25,10,34,7,30,8,22,2,9,9,27,11,11,6,12,13,31,4,40,7,32,7,44,1,14,7,15,8,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,4,25,11,34,7,30,8,22,2,9,10,27,11,11,5,12,13,31,4,40,7,32,7,14,9,15,7,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,6,24,8,25,7,34,9,30,8,22,4,9,8,27,12,11,4,12,9,31,8,13,4,40,3,32,6,14,5,15,1,14,3,15,8,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,6,24,9,25,5,34,10,30,8,22,4,9,9,27,10,11,6,12,8,31,8,13,4,40,3,32,6,14,3,15,3,14,3,15,8,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,7,25,6,34,9,30,8,22,7,9,8,27,7,11,4,12,11,31,8,13,4,40,3,32,6,14,4,15,2,14,2,15,9,16,7,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,6,25,6,34,10,30,8,22,7,9,8,27,7,11,4,12,11,31,8,13,4,40,3,32,6,14,10,15,6,16,8,20,8,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,6,24,8,25,6,34,12,30,6,22,7,9,8,27,8,11,3,12,11,31,8,13,7,32,8,14,9,15,4,16,8,20,9,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,6,24,8,25,7,34,11,30,6,22,7,9,8,27,6,11,5,12,11,31,8,13,7,32,8,14,8,15,5,16,8,20,9,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,6,24,8,25,6,34,12,30,6,22,7,9,8,27,6,11,5,12,11,31,8,13,7,32,8,14,8,15,6,16,7,20,9,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,6,24,8,25,6,34,12,30,6,22,7,9,8,27,6,11,5,12,11,31,8,13,7,32,8,14,9,15,5,16,7,20,8,17,8,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,4,24,11,25,5,34,12,30,6,22,7,9,8,27,7,11,5,12,10,31,8,13,7,32,8,14,8,15,7,16,6,20,7,17,9,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,4,24,11,25,9,34,8,30,6,22,7,9,8,27,7,11,6,12,9,31,8,13,7,32,8,14,7,15,8,16,1,45,4,16,1,20,9,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,4,24,10,25,10,34,8,30,6,22,7,9,8,27,8,11,9,12,5,31,8,13,7,32,8,14,7,15,8,16,1,45,4,20,10,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,4,24,10,25,10,34,8,30,6,22,7,9,8,27,7,11,10,12,5,31,8,13,7,32,8,14,7,15,9,45,4,20,10,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,6,25,9,34,7,30,8,22,7,9,8,27,2,11,3,27,2,11,10,12,5,31,8,13,7,32,8,14,7,15,9,45,4,20,10,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,5,46,2,25,3,34,2,25,3,34,7,30,8,22,7,9,8,27,2,11,13,12,7,31,8,13,7,32,8,14,7,15,9,45,4,20,10,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,5,46,2,25,3,34,2,25,3,34,7,30,8,22,7,9,8,27,2,11,13,12,7,31,8,13,7,32,8,14,7,15,9,45,4,20,10,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,46,4,24,1,46,2,34,6,25,1,34,8,30,8,22,7,9,8,11,15,12,7,31,8,13,7,32,8,14,7,15,9,45,4,20,10,17,7,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,46,4,24,1,46,2,34,15,30,8,22,7,9,8,11,15,12,7,31,8,13,7,32,8,14,7,15,9,45,4,20,10,17,7,18,4],[47,2,0,2,1,7,2,8,3,7,36,8,21,7,29,8,46,6,34,16,30,8,22,7,9,8,11,15,12,7,31,8,13,7,32,8,14,7,15,9,48,5,20,9,17,7,18,4],[47,2,0,2,1,7,2,8,3,7,36,8,21,7,29,8,46,6,34,16,30,8,22,7,9,8,11,15,12,7,31,8,13,7,32,8,14,7,15,9,48,5,49,4,20,2,49,2,20,1,17,7,18,4],[47,4,1,7,2,8,3,7,36,8,21,7,29,8,46,6,34,16,30,8,22,7,9,8,27,4,11,11,12,7,31,8,13,7,32,8,14,7,15,8,48,6,49,9,17,4,47,7],[47,4,1,7,2,8,3,7,36,8,21,7,29,8,46,6,34,16,30,8,22,7,9,8,27,4,11,11,12,7,31,8,13,7,32,8,14,7,15,8,16,2,48,4,49,9,17,4,47,7],[47,4,1,7,2,8,3,7,36,8,21,7,29,8,46,6,34,16,30,8,22,7,9,8,27,4,11,11,12,7,31,8,13,7,32,8,14,7,15,8,16,2,48,4,49,9,17,4,47,7],[47,4,1,7,2,8,3,7,36,8,21,7,29,8,46,5,34,9,25,1,34,7,30,8,22,7,9,8,27,4,11,11,12,7,31,8,13,7,32,8,14,7,15,8,16,2,48,5,49,8,17,4,47,7],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,34,4,46,1,34,17,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,5,48,1,49,9,17,4,47,7],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,34,4,46,1,34,17,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,49,8,17,4,47,7],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,34,4,46,1,34,17,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,49,8,17,4,47,7],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,34,22,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,49,8,17,4,47,7],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,2,34,7,25,6,34,7,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,20,8,17,4,47,7],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,2,34,7,25,6,34,7,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,20,8,17,4,47,7],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,24,2,34,7,25,6,34,7,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,20,8,17,4,47,7],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,34,9,25,6,34,7,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,20,8,17,4,47,3,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,34,10,25,5,34,7,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,20,8,17,4,47,3,18,4],[0,4,1,7,2,8,3,7,36,8,21,7,29,8,34,4,24,1,34,2,25,8,34,7,30,8,22,7,9,8,27,7,11,8,12,7,31,8,13,7,32,8,14,7,15,8,16,7,20,8,17,4,47,3,18,4]];
  var ZONES = {"Europe":{"Andorra":[43,2],"Tirane":[41,20],"Vienna":[48,16],"Mariehamn":[60,20],"Sarajevo":[44,18],"Brussels":[51,4],"Sofia":[43,23],"Minsk":[54,28],"Zurich":[47,9],"Prague":[50,14],"Berlin":[53,13],"Busingen":[48,9],"Copenhagen":[56,13],"Tallinn":[59,25],"Madrid":[40,-4],"Helsinki":[60,25],"Paris":[49,2],"London":[52,0],"Guernsey":[50,-2],"Gibraltar":[36,-5],"Athens":[38,24],"Zagreb":[46,16],"Budapest":[48,19],"Dublin":[53,-6],"Isle_of_Man":[54,-4],"Rome":[42,13],"Jersey":[49,-2],"Vaduz":[47,10],"Vilnius":[55,25],"Luxembourg":[50,6],"Riga":[57,24],"Monaco":[44,7],"Chisinau":[47,29],"Podgorica":[42,19],"Skopje":[42,21],"Malta":[36,15],"Amsterdam":[52,5],"Oslo":[60,11],"Warsaw":[52,21],"Lisbon":[39,-9],"Bucharest":[44,26],"Belgrade":[45,21],"Kaliningrad":[55,21],"Moscow":[56,38],"Simferopol":[45,34],"Kirov":[59,50],"Volgograd":[49,44],"Astrakhan":[46,48],"Saratov":[52,46],"Ulyanovsk":[54,48],"Samara":[53,50],"Stockholm":[59,18],"Ljubljana":[46,15],"Bratislava":[48,17],"San_Marino":[44,13],"Istanbul":[41,29],"Kyiv":[50,31],"Vatican":[42,13]},"Asia":{"Dubai":[25,55],"Kabul":[35,69],"Yerevan":[40,45],"Baku":[40,50],"Dhaka":[24,90],"Bahrain":[26,51],"Brunei":[5,115],"Thimphu":[28,90],"Shanghai":[31,122],"Urumqi":[44,88],"Nicosia":[35,33],"Famagusta":[35,34],"Tbilisi":[42,45],"Hong_Kong":[22,114],"Jakarta":[-6,107],"Pontianak":[0,109],"Makassar":[-5,119],"Jayapura":[-2,141],"Jerusalem":[32,35],"Kolkata":[23,88],"Baghdad":[33,44],"Tehran":[36,51],"Amman":[32,36],"Tokyo":[36,140],"Bishkek":[43,75],"Phnom_Penh":[12,105],"Pyongyang":[39,126],"Seoul":[38,127],"Kuwait":[29,48],"Almaty":[43,77],"Qyzylorda":[45,66],"Qostanay":[53,64],"Aqtobe":[50,57],"Aqtau":[45,50],"Atyrau":[47,52],"Oral":[51,51],"Vientiane":[18,103],"Beirut":[34,36],"Colombo":[7,80],"Yangon":[17,96],"Ulaanbaatar":[48,107],"Hovd":[48,92],"Macau":[22,114],"Kuala_Lumpur":[3,102],"Kuching":[2,110],"Kathmandu":[28,85],"Muscat":[24,59],"Manila":[15,121],"Karachi":[25,67],"Gaza":[32,35],"Hebron":[32,35],"Qatar":[25,52],"Yekaterinburg":[57,61],"Omsk":[55,73],"Novosibirsk":[55,83],"Barnaul":[53,84],"Tomsk":[57,85],"Novokuznetsk":[54,87],"Krasnoyarsk":[56,93],"Irkutsk":[52,104],"Chita":[52,114],"Yakutsk":[62,130],"Khandyga":[63,136],"Vladivostok":[43,132],"Ust-Nera":[65,143],"Magadan":[60,151],"Sakhalin":[47,143],"Srednekolymsk":[68,154],"Kamchatka":[53,159],"Anadyr":[65,178],"Riyadh":[25,47],"Singapore":[1,104],"Damascus":[34,36],"Bangkok":[14,101],"Dushanbe":[39,69],"Dili":[-8,126],"Ashgabat":[38,58],"Taipei":[25,122],"Samarkand":[40,67],"Tashkent":[41,69],"Ho_Chi_Minh":[11,107],"Aden":[13,45]},"America":{"Antigua":[17,-62],"Anguilla":[18,-63],"Argentina/Buenos_Aires":[-35,-58],"Argentina/Cordoba":[-31,-64],"Argentina/Salta":[-25,-65],"Argentina/Jujuy":[-24,-65],"Argentina/Tucuman":[-27,-65],"Argentina/Catamarca":[-28,-66],"Argentina/La_Rioja":[-29,-67],"Argentina/San_Juan":[-31,-68],"Argentina/Mendoza":[-33,-69],"Argentina/San_Luis":[-33,-66],"Argentina/Rio_Gallegos":[-52,-69],"Argentina/Ushuaia":[-55,-68],"Aruba":[13,-70],"Barbados":[13,-60],"St_Barthelemy":[18,-63],"La_Paz":[-16,-68],"Kralendijk":[12,-68],"Noronha":[-4,-32],"Belem":[-1,-48],"Fortaleza":[-4,-38],"Recife":[-8,-35],"Araguaina":[-7,-48],"Maceio":[-10,-36],"Bahia":[-13,-38],"Sao_Paulo":[-23,-47],"Campo_Grande":[-20,-55],"Cuiaba":[-16,-56],"Santarem":[-2,-55],"Porto_Velho":[-9,-64],"Boa_Vista":[3,-61],"Manaus":[-3,-60],"Eirunepe":[-7,-70],"Rio_Branco":[-10,-68],"Nassau":[25,-77],"Belize":[18,-88],"St_Johns":[48,-53],"Halifax":[45,-64],"Glace_Bay":[46,-60],"Moncton":[46,-65],"Goose_Bay":[53,-60],"Blanc-Sablon":[51,-57],"Toronto":[44,-79],"Iqaluit":[64,-68],"Atikokan":[49,-92],"Winnipeg":[50,-97],"Resolute":[75,-95],"Rankin_Inlet":[63,-92],"Regina":[50,-105],"Swift_Current":[50,-108],"Edmonton":[54,-113],"Cambridge_Bay":[69,-105],"Inuvik":[68,-134],"Creston":[49,-116],"Dawson_Creek":[56,-120],"Fort_Nelson":[59,-123],"Whitehorse":[61,-135],"Dawson":[64,-139],"Vancouver":[49,-123],"Santiago":[-33,-71],"Coyhaique":[-46,-72],"Punta_Arenas":[-53,-71],"Bogota":[5,-74],"Costa_Rica":[10,-84],"Havana":[23,-82],"Curacao":[12,-69],"Dominica":[15,-61],"Santo_Domingo":[19,-70],"Guayaquil":[-2,-80],"Grenada":[12,-62],"Cayenne":[5,-52],"Nuuk":[64,-52],"Danmarkshavn":[77,-19],"Scoresbysund":[71,-22],"Thule":[77,-69],"Guadeloupe":[16,-61],"Guatemala":[15,-90],"Guyana":[7,-58],"Tegucigalpa":[14,-87],"Port-au-Prince":[19,-72],"Jamaica":[18,-77],"St_Kitts":[17,-63],"Cayman":[19,-81],"St_Lucia":[14,-61],"Marigot":[18,-63],"Martinique":[15,-61],"Montserrat":[17,-62],"Mexico_City":[19,-99],"Cancun":[21,-87],"Merida":[21,-90],"Monterrey":[26,-100],"Matamoros":[26,-97],"Chihuahua":[29,-106],"Ciudad_Juarez":[32,-106],"Ojinaga":[30,-104],"Mazatlan":[23,-106],"Bahia_Banderas":[21,-105],"Hermosillo":[29,-111],"Tijuana":[33,-117],"Managua":[12,-86],"Panama":[9,-79],"Lima":[-12,-77],"Miquelon":[47,-56],"Puerto_Rico":[19,-66],"Asuncion":[-25,-58],"Paramaribo":[6,-55],"El_Salvador":[14,-89],"Lower_Princes":[18,-63],"Grand_Turk":[22,-71],"Port_of_Spain":[11,-61],"New_York":[41,-74],"Detroit":[42,-83],"Kentucky/Louisville":[38,-86],"Kentucky/Monticello":[37,-85],"Indiana/Indianapolis":[40,-86],"Indiana/Vincennes":[39,-87],"Indiana/Winamac":[41,-87],"Indiana/Marengo":[38,-86],"Indiana/Petersburg":[39,-87],"Indiana/Vevay":[39,-85],"Chicago":[42,-88],"Indiana/Tell_City":[38,-87],"Indiana/Knox":[41,-87],"Menominee":[45,-88],"North_Dakota/Center":[47,-101],"North_Dakota/New_Salem":[47,-101],"North_Dakota/Beulah":[47,-102],"Denver":[40,-105],"Boise":[44,-116],"Phoenix":[33,-112],"Los_Angeles":[34,-118],"Anchorage":[61,-150],"Juneau":[58,-134],"Sitka":[57,-135],"Metlakatla":[55,-132],"Yakutat":[60,-140],"Nome":[65,-165],"Adak":[52,-177],"Montevideo":[-35,-56],"St_Vincent":[13,-61],"Caracas":[11,-67],"Tortola":[19,-65],"St_Thomas":[18,-65]},"Africa":{"Luanda":[-9,13],"Ouagadougou":[12,-1],"Bujumbura":[-3,29],"Porto-Novo":[7,3],"Gaborone":[-25,26],"Kinshasa":[-4,15],"Lubumbashi":[-12,28],"Bangui":[4,19],"Brazzaville":[-4,15],"Abidjan":[5,-4],"Douala":[4,10],"Djibouti":[12,43],"Algiers":[37,3],"Cairo":[30,31],"El_Aaiun":[27,-13],"Asmara":[15,39],"Ceuta":[36,-5],"Addis_Ababa":[9,39],"Libreville":[0,10],"Accra":[6,0],"Banjul":[14,-17],"Conakry":[10,-14],"Malabo":[4,9],"Bissau":[12,-16],"Nairobi":[-1,37],"Monrovia":[6,-11],"Maseru":[-29,28],"Tripoli":[33,13],"Casablanca":[34,-8],"Bamako":[13,-8],"Nouakchott":[18,-16],"Blantyre":[-16,35],"Maputo":[-26,33],"Windhoek":[-23,17],"Niamey":[14,2],"Lagos":[7,3],"Kigali":[-2,30],"Khartoum":[16,33],"Freetown":[9,-13],"Dakar":[15,-17],"Mogadishu":[2,45],"Juba":[5,32],"Sao_Tome":[0,7],"Mbabane":[-26,31],"Ndjamena":[12,15],"Lome":[6,1],"Tunis":[37,10],"Dar_es_Salaam":[-7,39],"Kampala":[0,32],"Johannesburg":[-26,28],"Lusaka":[-15,28],"Harare":[-18,31]},"Antarctica":{"McMurdo":[-78,167],"Casey":[-66,111],"Davis":[-69,78],"DumontDUrville":[-67,140],"Mawson":[-68,63],"Palmer":[-65,-64],"Rothera":[-68,-68],"Syowa":[-69,40],"Troll":[-72,3],"Vostok":[-78,107],"Macquarie":[-54,159]},"Pacific":{"Pago_Pago":[-14,-171],"Rarotonga":[-21,-160],"Easter":[-27,-109],"Galapagos":[-1,-90],"Fiji":[-18,178],"Chuuk":[7,152],"Pohnpei":[7,158],"Kosrae":[5,163],"Guam":[14,145],"Tarawa":[1,173],"Kanton":[-3,-172],"Kiritimati":[2,-157],"Majuro":[7,171],"Kwajalein":[9,167],"Saipan":[15,146],"Noumea":[-22,167],"Norfolk":[-29,168],"Nauru":[0,167],"Niue":[-19,-170],"Auckland":[-37,175],"Chatham":[-44,-176],"Tahiti":[-17,-150],"Marquesas":[-9,-139],"Gambier":[-23,-135],"Port_Moresby":[-9,147],"Bougainville":[-6,156],"Pitcairn":[-25,-130],"Palau":[7,135],"Guadalcanal":[-9,160],"Fakaofo":[-9,-171],"Tongatapu":[-21,-175],"Funafuti":[-8,179],"Midway":[28,-177],"Wake":[19,167],"Honolulu":[21,-158],"Efate":[-18,168],"Wallis":[-13,-176],"Apia":[-14,-172]},"Australia":{"Lord_Howe":[-31,159],"Hobart":[-43,147],"Melbourne":[-38,145],"Sydney":[-34,151],"Broken_Hill":[-32,142],"Brisbane":[-27,153],"Lindeman":[-20,149],"Adelaide":[-35,139],"Darwin":[-12,131],"Perth":[-32,116],"Eucla":[-32,129]},"Atlantic":{"Bermuda":[32,-65],"Cape_Verde":[15,-23],"Canary":[28,-15],"Stanley":[-52,-58],"Faroe":[62,-7],"South_Georgia":[-54,-36],"Reykjavik":[64,-22],"Madeira":[33,-17],"Azores":[38,-26],"St_Helena":[-16,-6]},"Indian":{"Cocos":[-12,97],"Christmas":[-10,106],"Chagos":[-7,72],"Comoro":[-12,43],"Antananarivo":[-19,48],"Mauritius":[-20,58],"Maldives":[4,74],"Reunion":[-21,56],"Mahe":[-5,56],"Kerguelen":[-49,70],"Mayotte":[-13,45]},"Arctic":{"Longyearbyen":[78,16]}};
  var LINKS = {"Australia/ACT":"Australia/Sydney","Australia/LHI":"Australia/Lord_Howe","Australia/NSW":"Australia/Sydney","Australia/North":"Australia/Darwin","Australia/Queensland":"Australia/Brisbane","Australia/South":"Australia/Adelaide","Australia/Tasmania":"Australia/Hobart","Australia/Victoria":"Australia/Melbourne","Australia/West":"Australia/Perth","Australia/Yancowinna":"Australia/Broken_Hill","Brazil/Acre":"America/Rio_Branco","Brazil/DeNoronha":"America/Noronha","Brazil/East":"America/Sao_Paulo","Brazil/West":"America/Manaus","Canada/Atlantic":"America/Halifax","Canada/Central":"America/Winnipeg","Canada/Eastern":"America/Toronto","Canada/Mountain":"America/Edmonton","Canada/Newfoundland":"America/St_Johns","Canada/Pacific":"America/Vancouver","Canada/Saskatchewan":"America/Regina","Canada/Yukon":"America/Whitehorse","Chile/Continental":"America/Santiago","Chile/EasterIsland":"Pacific/Easter","Cuba":"America/Havana","Egypt":"Africa/Cairo","Eire":"Europe/Dublin","GB":"Europe/London","GB-Eire":"Europe/London","Hongkong":"Asia/Hong_Kong","Iran":"Asia/Tehran","Israel":"Asia/Jerusalem","Jamaica":"America/Jamaica","Japan":"Asia/Tokyo","Kwajalein":"Pacific/Kwajalein","Libya":"Africa/Tripoli","Mexico/BajaNorte":"America/Tijuana","Mexico/BajaSur":"America/Mazatlan","Mexico/General":"America/Mexico_City","NZ":"Pacific/Auckland","NZ-CHAT":"Pacific/Chatham","Navajo":"America/Denver","PRC":"Asia/Shanghai","Poland":"Europe/Warsaw","Portugal":"Europe/Lisbon","ROC":"Asia/Taipei","ROK":"Asia/Seoul","Singapore":"Asia/Singapore","Turkey":"Europe/Istanbul","US/Alaska":"America/Anchorage","US/Aleutian":"America/Adak","US/Arizona":"America/Phoenix","US/Central":"America/Chicago","US/East-Indiana":"America/Indiana/Indianapolis","US/Eastern":"America/New_York","US/Hawaii":"Pacific/Honolulu","US/Indiana-Starke":"America/Indiana/Knox","US/Michigan":"America/Detroit","US/Mountain":"America/Denver","US/Pacific":"America/Los_Angeles","US/Samoa":"Pacific/Pago_Pago","W-SU":"Europe/Moscow","America/Buenos_Aires":"America/Argentina/Buenos_Aires","America/Catamarca":"America/Argentina/Catamarca","America/Cordoba":"America/Argentina/Cordoba","America/Indianapolis":"America/Indiana/Indianapolis","America/Jujuy":"America/Argentina/Jujuy","America/Knox_IN":"America/Indiana/Knox","America/Louisville":"America/Kentucky/Louisville","America/Mendoza":"America/Argentina/Mendoza","Pacific/Samoa":"Pacific/Pago_Pago","America/Argentina/ComodRivadavia":"America/Argentina/Catamarca","America/Atka":"America/Adak","America/Ensenada":"America/Tijuana","America/Fort_Wayne":"America/Indiana/Indianapolis","America/Montreal":"America/Toronto","America/Nipigon":"America/Toronto","America/Pangnirtung":"America/Iqaluit","America/Porto_Acre":"America/Rio_Branco","America/Rainy_River":"America/Winnipeg","America/Rosario":"America/Argentina/Cordoba","America/Santa_Isabel":"America/Tijuana","America/Shiprock":"America/Denver","America/Thunder_Bay":"America/Toronto","America/Yellowknife":"America/Edmonton","Asia/Choibalsan":"Asia/Ulaanbaatar","Asia/Chongqing":"Asia/Shanghai","Asia/Harbin":"Asia/Shanghai","Asia/Kashgar":"Asia/Urumqi","Asia/Tel_Aviv":"Asia/Jerusalem","Australia/Canberra":"Australia/Sydney","Australia/Currie":"Australia/Hobart","Europe/Belfast":"Europe/London","Europe/Tiraspol":"Europe/Chisinau","Europe/Uzhgorod":"Europe/Kyiv","Europe/Zaporozhye":"Europe/Kyiv","Pacific/Enderbury":"Pacific/Kanton","Pacific/Johnston":"Pacific/Honolulu","America/Godthab":"America/Nuuk","Asia/Ashkhabad":"Asia/Ashgabat","Asia/Calcutta":"Asia/Kolkata","Asia/Chungking":"Asia/Shanghai","Asia/Dacca":"Asia/Dhaka","Asia/Istanbul":"Europe/Istanbul","Asia/Katmandu":"Asia/Kathmandu","Asia/Macao":"Asia/Macau","Asia/Rangoon":"Asia/Yangon","Asia/Saigon":"Asia/Ho_Chi_Minh","Asia/Thimbu":"Asia/Thimphu","Asia/Ujung_Pandang":"Asia/Makassar","Asia/Ulan_Bator":"Asia/Ulaanbaatar","Atlantic/Faeroe":"Atlantic/Faroe","Europe/Kiev":"Europe/Kyiv","Europe/Nicosia":"Asia/Nicosia","Africa/Asmera":"Africa/Asmara","Africa/Timbuktu":"Africa/Bamako","America/Coral_Harbour":"America/Atikokan","America/Virgin":"America/St_Thomas","Antarctica/South_Pole":"Antarctica/McMurdo","Iceland":"Atlantic/Reykjavik","Atlantic/Jan_Mayen":"Europe/Oslo","Pacific/Truk":"Pacific/Chuuk","Pacific/Yap":"Pacific/Chuuk","Pacific/Ponape":"Pacific/Pohnpei"};
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
