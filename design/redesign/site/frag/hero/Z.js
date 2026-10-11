/* hero · Z · The Survey — the footage stand-in.
   A nadir (straight-down) survey of a night city grid, drawn on <canvas>:
   · the city is built once per skin from the surface tokens (seeded, so every render is the
     same city) and blurred ONCE at --film-blur into an offscreen plate: the optics are baked,
     never filtered per frame;
   · per frame (24 fps, the footage's own rate) the plate is blitted at the camera's pan offset, then the
     traffic (soft light sprites on the street centrelines, both directions), one boat on the
     river and two cloud shadows are composited on top;
   · the camera pans slowly (40s there and back, no rotation, no zoom) and the TRACE layer
     rides exactly the same offset, so the route stays pinned to its streets;
   · the canvas is drawn at half CSS resolution whatever the devicePixelRatio: an 8px-blurred
     plate carries no finer detail, and the crisp drawing is SVG at full resolution;
   · it stops when the hero leaves the viewport (IntersectionObserver) and holds one still
     frame under reduced motion (no loop, no timers).                                     */
window.KM = {
  init: function (root, opts) {
    if (!root) return;
    var reduced = !!(opts && opts.reduced);
    var cv = root.querySelector(".km-hero-Z__plate");
    var film = root.querySelector(".km-film");
    var trace = root.querySelector(".km-hero-Z__trace");
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    /* ── the world: the page's 12-column grid is the city's grid ──
       Streets fall on even column lines, so at rest the route's junctions sit on col 8,
       col 10 and col 12 — the same spine as the lede and the primary. */
    var COL = 1336 / 12;
    function C(n) { return 64 + (n - 1) * COL; }
    var VW = 1440, VH = 960;
    var X0 = -64, X1 = 1504, Y0 = -72, Y1 = 1032;
    var S = 0.5 * Math.min(1, window.devicePixelRatio || 1);
    cv.width = Math.round(VW * S); cv.height = Math.round(VH * S);

    // the camera: a lateral sway, PAN px either side of rest, 40s there and back. Lateral, so the street
    // rows stay set between the statement's lines; centred on rest, so the route keeps the col-8 spine
    // on average; it eases through rest (s·|s|), and the phase puts rest at 6.5s, when the entrance is done.
    var PAN = 14, PERIOD = 40, REST = 6.5;
    var blurPx = Math.min(12, Math.max(8, parseFloat(getComputedStyle(film || root).getPropertyValue("--film-blur")) || 8));

    // [centre, width, class]: avenues are the wide ones (col 6 and y 200); col 12 is a two-way street.
    // The class (≈ .45–1.15) grades each street's lamps and traffic: a real city has a hierarchy of
    // arterials, busy streets and quiet ones, never one even lattice.
    // Only the route's streets (cols 8, 10, 12) and the col-6 avenue sit exactly on column lines; the others are
    // set off them by 10–20px, so block widths vary as a surveyed grid does and the ground never reads as graph paper.
    var V = [[C(-2), 12, .5], [C(0) + 12, 12, .75], [C(2) + 20, 12, .42], [C(4) - 16, 12, .85], [C(6), 26, 1.1], [C(8), 14, 1], [C(10), 14, .9], [C(12), 18, 1.05], [C(14) - 10, 12, .6]];
    // the rows are set to the type: y 322, 448 and 578 run through the gaps above, between and below the
    // statement's two lines, so no lit street crosses a letter; y 200 is the avenue the route enters on
    var H = [[-190, 12, .6], [-60, 12, .7], [70, 12, .85], [200, 28, 1.15], [322, 13, .6], [448, 13, .42], [578, 13, .75], [708, 12, .8], [838, 12, .55], [968, 12, .5], [1098, 12, .5]];
    // the waterfront, lower left: a straight bulkhead with piers, then a raked seawall
    var SHORE = [[-140, 652], [306, 652], [432, 812], [508, 958], [540, 1110]];
    var WATER = SHORE.concat([[-140, 1110]]);
    var PIERS = [[-34, 22, 58], [66, 20, 70], [168, 24, 50], [252, 18, 62]];   // x, width, length into the water
    // a line offset d px inland of a polyline (normals from the neighbouring chord)
    function offsetLine(P, d) {
      return P.map(function (p, k) {
        var a = P[Math.max(0, k - 1)], c = P[Math.min(P.length - 1, k + 1)];
        var dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy) || 1;
        return [p[0] + dy / l * d, p[1] - dx / l * d];
      });
    }
    // the riverside expressway: the one fast road in frame, set 24px inland of the bulkhead. It runs
    // between the red rule and the audit note, then rakes away down the seawall, clear of all type.
    var EXPY = offsetLine(SHORE, 24);

    function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
    function mk(w, h) { var c = document.createElement("canvas"); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
    function inPoly(P, x, y) {
      var inside = false;
      for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
        var xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
      }
      return inside;
    }
    function inWater(x, y) { return inPoly(WATER, x, y); }
    // the park, lower right: a superblock of dark canopy east of the col-6 avenue (calm ground for the lede and doors)
    var PARK = [634, 585, 1540, 1060];
    function inPark(x, y) { return x > PARK[0] && x < PARK[2] && y > PARK[1] && y < PARK[3]; }
    function blocked(x, y) { return inWater(x, y) || inPark(x, y); }
    // district light: a bright core over the route's blocks, the avenue crossing, a dim lower left
    function light(x, y) {
      function blob(cx, cy, rx, ry) { var a = (x - cx) / rx, b = (y - cy) / ry; return Math.exp(-(a * a + b * b)); }
      var v = 0.6 + 0.55 * blob(1180, 260, 560, 360) + 0.35 * blob(620, 200, 320, 240) + 0.2 * blob(330, 110, 460, 220)
            - 0.25 * blob(150, 520, 380, 260) - 0.3 * blob(120, 860, 520, 300);
      return Math.max(0.25, Math.min(1.3, v));
    }

    /* ── colour: read the surface tokens, so both skins grade the footage ── */
    var probe = mk(1, 1).getContext("2d");
    function rgb(v, fb) {
      probe.fillStyle = fb; probe.fillStyle = (v || "").trim() || fb;
      var s = probe.fillStyle;
      if (s.charAt(0) === "#") return [parseInt(s.substr(1, 2), 16), parseInt(s.substr(3, 2), 16), parseInt(s.substr(5, 2), 16)];
      var m = s.match(/[\d.]+/g); return [+m[0], +m[1], +m[2]];
    }
    function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
    function css(c, a) { return "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + (a == null ? 1 : a) + ")"; }
    function tokens() {
      var cs = getComputedStyle(root);
      var T = {
        bg: rgb(cs.getPropertyValue("--bg"), "#141517"),
        panel: rgb(cs.getPropertyValue("--panel"), "#1C1D20"),
        panel2: rgb(cs.getPropertyValue("--panel-2"), "#26272B"),
        soft: rgb(cs.getPropertyValue("--soft"), "#F2C9BF"),
        fg: rgb(cs.getPropertyValue("--fg"), "#FBFAF6")
      };
      T.night = mix(T.bg, [0, 0, 0], 0.5);                   // water, unlit roofs
      T.road = mix(T.bg, T.panel2, 0.5);                     // asphalt between the lamps
      T.sodium = mix(T.soft, T.fg, 0.2);                     // older street lamps: warm
      T.led = mix(T.fg, T.soft, 0.2);                        // avenue lamps: paper white
      T.head = mix(T.fg, T.soft, 0.1);                       // headlights
      T.tail = mix(T.soft, T.bg, 0.2);                       // rear lights: warm, never red
      return T;
    }

    // soft light sprite (a gaussian-ish disc), drawn once per colour
    function glow(col, n) {
      var c = mk(n, n), g = c.getContext("2d"), r = n / 2;
      var gr = g.createRadialGradient(r, r, 0, r, r, r);
      gr.addColorStop(0, css(col, 1)); gr.addColorStop(0.15, css(col, 0.8)); gr.addColorStop(0.36, css(col, 0.36));
      gr.addColorStop(0.62, css(col, 0.1)); gr.addColorStop(1, css(col, 0));
      g.fillStyle = gr; g.fillRect(0, 0, n, n); return c;
    }
    function cloudSprite(T, seed) {
      var R = rng(seed), w = 300, h = 200, c = mk(w, h), g = c.getContext("2d");
      for (var i = 0; i < 9; i++) {
        var x = w * (0.25 + R() * 0.5), y = h * (0.3 + R() * 0.4), r = h * (0.22 + R() * 0.3);
        var gr = g.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, css(T.night, 0.3)); gr.addColorStop(0.6, css(T.night, 0.12)); gr.addColorStop(1, css(T.night, 0));
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
      }
      return c;
    }

    /* ── the static city (built once per skin) ── */
    var CAN_FILTER = (function () { try { var c = mk(2, 2).getContext("2d"); if (typeof c.filter !== "string") return false; c.filter = "blur(2px)"; return c.filter === "blur(2px)"; } catch (e) { return false; } })();
    if (!CAN_FILTER) cv.style.filter = "blur(" + blurPx + "px) contrast(1.14) brightness(.96)";   // fallback: the browser does the optics

    // lens bokeh: a near-flat disc with a soft edge (point lights out of focus read as discs, not smears)
    function bokeh(col, n) {
      var c = mk(n, n), g = c.getContext("2d"), r = n / 2;
      var gr = g.createRadialGradient(r, r, 0, r, r, r);
      gr.addColorStop(0, css(col, 0.78)); gr.addColorStop(0.55, css(col, 0.82)); gr.addColorStop(0.76, css(col, 0.9));
      gr.addColorStop(0.88, css(col, 0.32)); gr.addColorStop(1, css(col, 0));
      g.fillStyle = gr; g.fillRect(0, 0, n, n); return c;
    }

    function blockRoofs(g, R, T, x0, y0, x1, y1) {
      var dark = R() < 0.2;                                    // whole blocks that have gone home
      var rows = (y1 - y0) > 56 ? 2 : 1, mid = (y0 + y1) / 2 + (R() - 0.5) * 12;
      for (var k = 0; k < rows; k++) {
        var ya = rows === 1 ? y0 : (k ? mid + 1 : y0), yb = rows === 1 ? y1 : (k ? y1 : mid - 1);
        for (var x = x0; x < x1 - 3;) {
          var lw = Math.min(x1 - x, 8 + R() * 30);
          if (x1 - (x + lw) < 8) lw = x1 - x;
          var tone = mix(T.night, T.panel, (dark ? 0.0 : 0.2) + R() * (dark ? 0.4 : 0.9));
          g.fillStyle = css(tone); g.fillRect(x, ya, lw - 1, yb - ya);
          var q = R();
          if (q < 0.22) {                                       // rooftop plant, bulkheads
            var ins = 2 + R() * 4;
            g.fillStyle = css(mix(tone, T.sodium, 0.05 + R() * 0.06));
            g.fillRect(x + ins, ya + ins, Math.max(2, lw - 1 - ins * 2), Math.max(2, (yb - ya) * (0.25 + R() * 0.4)));
          } else if (!dark && q > 0.95) {                       // a lit roof
            g.fillStyle = css(mix(tone, T.sodium, 0.14 * light(x, ya)));
            g.fillRect(x + 1, ya + 1, lw - 3, yb - ya - 2);
          }
          x += lw;
        }
      }
    }
    function lamps(g, spr, ax, ay, bx, by, off, step, r, a, R, keep, p) {
      var len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len, nx = -uy, ny = ux;
      for (var s = R() * step, side = 1; s < len; s += step * (0.8 + R() * 0.4), side = -side) {
        var x = ax + ux * s + nx * off * side, y = ay + uy * s + ny * off * side;
        if (blocked(x, y)) continue;
        var f = light(x, y) * (0.75 + R() * 0.5);
        g.globalAlpha = Math.min(1, a * f); g.drawImage(spr, x - r, y - r, r * 2, r * 2);
        if (keep && R() < p) keep.push([x, y, f]);
      }
    }
    function band(g, T, ax, ay, bx, by, w, k) {               // a lit carriageway, graded by the district light
      var len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len;
      for (var s = 0; s < len; s += 24) {
        var x = ax + ux * s, y = ay + uy * s;
        g.fillStyle = css(mix(T.road, T.sodium, k * light(x, y)));
        if (Math.abs(ux) > 0.5) g.fillRect(x, y - w / 2, 25, w); else g.fillRect(x - w / 2, y, w, 25);
      }
    }

    function buildStatic(T) {
      var R = rng(0x4B31E), keep = [];
      var sharp = mk((X1 - X0) * S, (Y1 - Y0) * S), g = sharp.getContext("2d");
      g.setTransform(S, 0, 0, S, -X0 * S, -Y0 * S);
      g.fillStyle = css(T.night); g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
      // 1 · the carriageways, lit (avenues brightest)
      H.forEach(function (h) { band(g, T, X0, h[0], X1, h[0], h[1], (h[1] > 20 ? 0.24 : 0.13) * h[2]); });
      V.forEach(function (v) { band(g, T, v[0], Y0, v[0], Y1, v[1], (v[1] > 20 ? 0.24 : v[1] > 16 ? 0.18 : 0.13) * v[2]); });
      // 2 · roofs, block by block (a mid-block alley on some odd column lines; one park)
      for (var i = 0; i < V.length - 1; i++) for (var j = 0; j < H.length - 1; j++) {
        var x0 = V[i][0] + V[i][1] / 2, x1 = V[i + 1][0] - V[i + 1][1] / 2;
        var y0 = H[j][0] + H[j][1] / 2, y1 = H[j + 1][0] - H[j + 1][1] / 2;
        if (i === 3 && (j === 6 || j === 7)) {                 // the park: two blocks of dark canopy
          g.fillStyle = css(mix(T.night, T.bg, 0.3)); g.fillRect(x0, y0, x1 - x0, y1 - y0);
          for (var n = 0; n < (x1 - x0) * (y1 - y0) / 40; n++) {
            g.fillStyle = css(mix(T.night, T.panel, R() * 0.7), 0.9);
            g.beginPath(); g.arc(x0 + R() * (x1 - x0), y0 + R() * (y1 - y0), 2 + R() * 4, 0, 6.283); g.fill();
          }
          continue;
        }
        if (x1 - x0 > 150 && R() < 0.42) {
          var xm = (x0 + x1) / 2 + (R() - 0.5) * 20;
          blockRoofs(g, R, T, x0, y0, xm - 3, y1); blockRoofs(g, R, T, xm + 3, y0, x1, y1);
        } else blockRoofs(g, R, T, x0, y0, x1, y1);
      }
      // the park: canopy, a pond, two paths (lit dimly, kept clear of the lede and the doors)
      g.fillStyle = css(mix(T.night, T.bg, 0.2)); g.fillRect(PARK[0], PARK[1], PARK[2] - PARK[0], PARK[3] - PARK[1]);
      for (var c2 = 0; c2 < 900; c2++) {
        g.fillStyle = css(mix(T.night, T.panel, R() * 0.6), 0.7);
        g.beginPath(); g.arc(PARK[0] + R() * (PARK[2] - PARK[0]), PARK[1] + R() * (PARK[3] - PARK[1]), 5 + R() * 12, 0, 6.283); g.fill();
      }
      g.fillStyle = css(mix(T.night, [0, 0, 0], 0.3)); g.beginPath(); g.ellipse(1010, 905, 120, 34, -0.08, 0, 6.283); g.fill();
      var PATHS = [[[634, 880], [760, 868], [900, 884], [1080, 862], [1250, 884], [1540, 866]], [[634, 724], [700, 716], [760, 742], [800, 800], [812, 880], [800, 1060]]];
      g.strokeStyle = css(mix(T.road, T.sodium, 0.06)); g.lineWidth = 3;
      PATHS.forEach(function (P) { g.beginPath(); P.forEach(function (p, k) { if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke(); });
      // 3 · street light (additive): lamp chains on both kerbs, pools at the junctions
      var sod = glow(T.sodium, 32), led = glow(T.led, 32);
      g.globalCompositeOperation = "lighter";
      H.forEach(function (h) {
        var av = h[1] > 20;
        lamps(g, av ? led : sod, X0, h[0], X1, h[0], h[1] / 2 - 2, av ? 16 : 24, av ? 13 : 11, (av ? 0.24 : 0.16) * h[2], R, keep, (av ? 0.3 : 0.09) * h[2]);
      });
      V.forEach(function (v) {
        var av = v[1] > 16;
        lamps(g, av ? led : sod, v[0], Y0, v[0], Y1, v[1] / 2 - 2, av ? 16 : 24, av ? 13 : 11, (av ? 0.24 : 0.16) * v[2], R, keep, (av ? 0.3 : 0.09) * v[2]);
      });
      V.forEach(function (v) { H.forEach(function (h) {
        if (blocked(v[0], h[0])) return;
        var r = (v[1] + h[1]) * 0.9; g.globalAlpha = Math.min(1, 0.26 * light(v[0], h[0]) * (v[2] + h[2]) / 2); g.drawImage(sod, v[0] - r, h[0] - r, r * 2, r * 2);
        if (R() < 0.5) keep.push([v[0] + (R() - 0.5) * 10, h[0] + (R() - 0.5) * 10, light(v[0], h[0]), 1]);
      }); });
      // rooftop light: sparse beacons, skylights and lit plant inside the blocks, so the ground reads
      // as a city rather than graph paper; hushed under the nav and the statement, absent from river and park
      var Rr = rng(0x2F00F);
      for (var bi = 0; bi < V.length - 1; bi++) for (var bj = 0; bj < H.length - 1; bj++) {
        var bx0 = V[bi][0] + V[bi][1] / 2 + 6, bx1 = V[bi + 1][0] - V[bi + 1][1] / 2 - 6;
        var by0 = H[bj][0] + H[bj][1] / 2 + 6, by1 = H[bj + 1][0] - H[bj + 1][1] / 2 - 6;
        for (var q = Math.floor(Rr() * 4); q > 0; q--) {
          var lx = bx0 + Rr() * (bx1 - bx0), ly = by0 + Rr() * (by1 - by0), lr = 4 + Rr() * 5, sp = Rr() < 0.3 ? led : sod;
          var hush = (ly < 112 || (lx > 40 && lx < 1260 && ly > 318 && ly < 604)) ? 0.4 : 1, la = (0.1 + Rr() * 0.16) * light(lx, ly) * hush;
          if (blocked(lx, ly)) continue;
          g.globalAlpha = Math.min(1, la); g.drawImage(sp, lx - lr, ly - lr, lr * 2, lr * 2);
          if (hush === 1 && Rr() < 0.2) keep.push([lx, ly, light(lx, ly) * 0.7]);
        }
      }
      PATHS.forEach(function (P) { for (var k = 0; k < P.length - 1; k++) {
        var a = P[k], b = P[k + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
        for (var s = 8; s < l; s += 22) { g.globalAlpha = 0.14; g.drawImage(sod, a[0] + (b[0] - a[0]) * s / l - 6, a[1] + (b[1] - a[1]) * s / l - 6, 12, 12); }
      } });
      g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
      // 4 · the river, the piers, the lit embankment
      g.fillStyle = css(mix(T.night, [0, 0, 0], 0.25)); g.beginPath();
      WATER.forEach(function (p, k) { if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.closePath(); g.fill();
      PIERS.forEach(function (p) { g.fillStyle = css(mix(T.night, T.panel2, 0.5)); g.fillRect(p[0], SHORE[0][1] - 2, p[1], p[2]); });
      // the riverside expressway: a wide lit carriageway with a dark median, high-mast LED lamps on both edges
      g.lineJoin = "miter"; g.strokeStyle = css(mix(T.road, T.led, 0.16)); g.lineWidth = 26; g.beginPath();
      EXPY.forEach(function (p, k) { if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke();
      g.strokeStyle = css(mix(T.night, T.road, 0.5)); g.lineWidth = 2; g.beginPath();
      EXPY.forEach(function (p, k) { if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); }); g.stroke();
      g.globalCompositeOperation = "lighter";
      for (var e = 0; e < EXPY.length - 1; e++) lamps(g, led, EXPY[e][0], EXPY[e][1], EXPY[e + 1][0], EXPY[e + 1][1], 13, 18, 12, 0.26, R, keep, 0.35);
      // light spill on the water along the wall
      var Rw = rng(0x5EA);
      for (var n2 = 0; n2 < 1400; n2++) {
        var wx = -100 + Rw() * 660, wy = 650 + Rw() * 440;
        if (!inWater(wx, wy)) continue;
        var d = distToShore(wx, wy); if (d > 110) continue;
        g.globalAlpha = 0.2 * Math.pow(1 - d / 110, 2.2) * (0.4 + Rw() * 0.6);
        g.fillStyle = css(T.sodium); g.fillRect(wx, wy, 3 + Rw() * 14, 1.2);
      }
      g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
      // 5 · the optics: blur the ground once, here …
      var out = mk(sharp.width, sharp.height), o = out.getContext("2d");
      // (graded like night footage: blacks crushed a little, so the lamps carry the frame, not a haze)
      if (CAN_FILTER) o.filter = "blur(" + (blurPx * S).toFixed(2) + "px) contrast(1.14) brightness(.96)";
      o.drawImage(sharp, 0, 0);
      // … then the brightest lamps as bokeh (the lens, not the blur, is what says "footage")
      o.filter = "none"; o.setTransform(S, 0, 0, S, -X0 * S, -Y0 * S); o.globalCompositeOperation = "lighter";
      var bs = bokeh(T.sodium, 48), bl = bokeh(T.led, 48);
      // (sparingly: junctions keep theirs, kerb lamps one in three, so the streets read as lit lines
      // with hot spots, as aerial night footage does, and never as strings of fairy lights)
      keep.forEach(function (k, i) {
        var skip = !k[3] && R() < 0.66, r = 6 + R() * 4; if (skip) return;
        o.globalAlpha = Math.min(0.4, (0.06 + R() * 0.1) * k[2]);
        o.drawImage(i % 3 ? bs : bl, k[0] - r, k[1] - r, r * 2, r * 2);
      });
      o.globalCompositeOperation = "source-over"; o.globalAlpha = 1;
      return out;
    }
    function distToShore(x, y) {
      var best = 1e9;
      for (var k = 0; k < SHORE.length - 1; k++) {
        var a = SHORE[k], b = SHORE[k + 1], dx = b[0] - a[0], dy = b[1] - a[1];
        var t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
        best = Math.min(best, Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy));
      }
      return best;
    }

    /* ── traffic: lanes on the street centrelines (avenues two-way, streets one-way, alternating) ── */
    var lanes = [], plines = [];
    (function () {
      var R = rng(0x7AF1C);
      function lane(ax, ay, bx, by, dir, v, dens) {
        var len = Math.hypot(bx - ax, by - ay); if (len < 40) return;
        var n = Math.max(1, Math.round(len * dens)), cars = [];
        for (var i = 0; i < n; i++) cars.push({ s: R() * len, v: v * (0.75 + R() * 0.5), b: 0.4 + R() * 0.5 });
        lanes.push({ ax: ax, ay: ay, ux: (bx - ax) / len, uy: (by - ay) / len, len: len, dir: dir, cars: cars });
      }
      // a street's drivable runs: contiguous spans that are neither river nor park
      function runs(ax, ay, bx, by, fn) {
        var len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len, s0 = -1;
        for (var s = 0; s <= len; s += 4) {
          var ok = !blocked(ax + ux * s, ay + uy * s);
          if (ok && s0 < 0) s0 = s;
          if ((!ok || s + 4 > len) && s0 >= 0) { var s1 = ok ? s : s - 12; if (s1 - s0 > 40) fn(ax + ux * s0, ay + uy * s0, ax + ux * s1, ay + uy * s1); s0 = -1; }
        }
      }
      H.forEach(function (h, k) {
        if (h[1] > 20) {     // the avenue: two lanes each way
          [[-8, -1, 24, 64], [-3, -1, 18, 120], [3, 1, 18, 120], [8, 1, 24, 64]].forEach(function (q) {
            runs(X0, h[0] + q[0], X1, h[0] + q[0], function (a, b, c, d) { lane(a, b, c, d, q[1], q[2], 1 / q[3]); });
          });
        } else runs(X0, h[0], X1, h[0], function (a, b, c, d) { lane(a, b, c, d, k % 2 ? 1 : -1, 9 + 4 * h[2], h[2] / 190); });
      });
      V.forEach(function (v, k) {
        var q = v[1] > 20 ? [[-7, 1, 21, 58], [7, -1, 21, 58]] : v[1] >= 16 ? [[-4, 1, 14, 110], [4, -1, 14, 110]] : [[0, k % 2 ? 1 : -1, 8 + 4 * v[2], 170 / v[2]]];
        q.forEach(function (z) { runs(v[0] + z[0], Y0, v[0] + z[0], Y1, function (a, b, c, d) { lane(a, b, c, d, z[1], z[2], 1 / z[3]); }); });
      });
      // the expressway: two lanes each way along the waterfront, dense and fast (≈ 36–48px/s), the one
      // stream in frame that reads as traffic at a glance
      [[-9, 1, 44, 34], [-3, 1, 38, 46], [3, -1, 38, 46], [9, -1, 44, 34]].forEach(function (q) {
        var P = offsetLine(SHORE, 24 - q[0]), cum = [0];
        for (var i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
        var len = cum[cum.length - 1], n = Math.round(len / q[3]), cars = [];
        for (var c = 0; c < n; c++) cars.push({ s: R() * len, v: q[2] * (0.85 + R() * 0.3), b: 0.45 + R() * 0.5 });
        plines.push({ P: P, cum: cum, len: len, dir: q[1], cars: cars });
      });
    })();
    var BOAT = { ax: -120, ay: 922, ux: 0.99, uy: 0.14, len: 600, v: 6 };

    /* ── one frame of footage at time t (seconds): a pure function of t ── */
    var T, plate, head, tail, clouds;
    function rebuild() {
      T = tokens(); plate = buildStatic(T);
      head = bokeh(T.head, 48); tail = bokeh(T.tail, 48);
      clouds = [cloudSprite(T, 11), cloudSprite(T, 23)];
    }
    function ramp(s, len) { return Math.min(1, s / 30, (len - s) / 30); }
    function draw(t) {
      var sw = Math.sin(2 * Math.PI * (t - REST) / PERIOD), dx = PAN * sw * Math.abs(sw), dy = 0;
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      ctx.drawImage(plate, (X0 + dx) * S, (Y0 + dy) * S);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < lanes.length; i++) {
        var L = lanes[i], hx = L.ux * L.dir, hy = L.uy * L.dir, horiz = Math.abs(L.ux) > 0.5;
        var w = 15 * S, h = 15 * S, q = 11 * S;
        for (var k = 0; k < L.cars.length; k++) {
          var c = L.cars[k], s = ((c.s + L.dir * c.v * t) % L.len + L.len) % L.len;
          var a = ramp(s, L.len); if (a <= 0) continue;
          var wx = L.ax + L.ux * s, wy = L.ay + L.uy * s;
          var x = (wx + dx) * S, y = (wy + dy) * S;
          if (x < -20 || x > VW * S + 20 || y < -20 || y > VH * S + 20) continue;
          var f = Math.min(1, 0.55 + 0.45 * light(wx, wy));
          ctx.globalAlpha = c.b * a * f * 0.5;
          ctx.drawImage(head, x + hx * 4 * S - w / 2, y + hy * 4 * S - h / 2, w, h);
          ctx.globalAlpha = c.b * a * f * 0.28;
          ctx.drawImage(tail, x - hx * 5 * S - q / 2, y - hy * 5 * S - q / 2, q, q);
        }
      }
      // the expressway: cars ride a polyline, turning with the seawall (no fade at its corners)
      for (var pi = 0; pi < plines.length; pi++) {
        var PL = plines[pi], P = PL.P, cum = PL.cum, ww = 15 * S, qq = 11 * S;
        for (var pk = 0; pk < PL.cars.length; pk++) {
          var pc = PL.cars[pk], ps = ((pc.s + PL.dir * pc.v * t) % PL.len + PL.len) % PL.len;
          var pa = ramp(ps, PL.len); if (pa <= 0) continue;
          var sg = 1; while (sg < cum.length - 1 && cum[sg] < ps) sg++;
          var p0 = P[sg - 1], p1 = P[sg], sl = cum[sg] - cum[sg - 1], u = (ps - cum[sg - 1]) / sl;
          var ux = (p1[0] - p0[0]) / sl * PL.dir, uy = (p1[1] - p0[1]) / sl * PL.dir;
          var px = (p0[0] + (p1[0] - p0[0]) * u + dx) * S, py = (p0[1] + (p1[1] - p0[1]) * u + dy) * S;
          if (px < -20 || px > VW * S + 20 || py < -20 || py > VH * S + 20) continue;
          ctx.globalAlpha = pc.b * pa * 0.55;
          ctx.drawImage(head, px + ux * 4 * S - ww / 2, py + uy * 4 * S - ww / 2, ww, ww);
          ctx.globalAlpha = pc.b * pa * 0.3;
          ctx.drawImage(tail, px - ux * 5 * S - qq / 2, py - uy * 5 * S - qq / 2, qq, qq);
        }
      }
      // a boat on the river, with its wake
      var bs = (BOAT.v * t + 180) % BOAT.len, ba = ramp(bs, BOAT.len);
      for (var m = 0; m < 10; m++) {
        var ss = bs - m * 7; if (ss < 0) break;
        ctx.globalAlpha = ba * (m ? 0.14 * (1 - m / 10) : 0.55);
        var r = (m ? 6 + m * 1.1 : 7) * S;
        ctx.drawImage(m ? tail : head, (BOAT.ax + BOAT.ux * ss + dx) * S - r, (BOAT.ay + BOAT.uy * ss + dy) * S - r, r * 2, r * 2);
      }
      // cloud shadows drifting across (40s each, half a period apart)
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      for (var n = 0; n < 2; n++) {
        var p = ((t / 40 + n * 0.5 + 0.18) % 1), cw = (n ? 1100 : 1400) * S, ch = cw * 0.66;
        var cx = -cw + p * (VW * S + cw * 2), cy = (n ? 0.62 : 0.12) * VH * S - p * 140 * S;
        ctx.drawImage(clouds[n], cx - cw / 2, cy - ch / 2, cw, ch);
      }
      if (trace) trace.style.transform = "translate3d(" + dx.toFixed(1) + "px,0,0)";
    }

    rebuild();
    var t = 0;
    draw(reduced ? REST : 0);
    // the comparison skin swaps tokens: re-grade the footage
    try {
      new MutationObserver(function () { rebuild(); draw(reduced ? REST : t); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ["data-skin"] });
    } catch (e) {}
    if (reduced) return;

    // 24 fps on any refresh rate: the clock runs every tick, a frame is drawn whenever a 24th of a
    // second has accumulated (on a 60 Hz screen that alternates 3 and 2 ticks)
    var raf = 0, last = 0, acc = 0, running = false, FRAME = 1000 / 24;
    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (!last) { last = now; return; }
      var el = Math.min(now - last, 100); last = now; t += el / 1000; acc += el;
      if (acc < FRAME - 2) return;
      acc = acc >= FRAME ? acc % FRAME : 0; draw(t);
    }
    function start() { if (running) return; running = true; last = 0; root.classList.remove("is-off"); raf = requestAnimationFrame(tick); }
    function stop() { if (!running) return; running = false; cancelAnimationFrame(raf); root.classList.add("is-off"); }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else stop(); }); }, { threshold: 0 }).observe(root);
    } else start();
  }
};
