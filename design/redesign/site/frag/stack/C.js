/* stack · C · SHEET 04 — FIG. 4.1: four nested pieces (the master mark's three heavy
   pieces + one outer step at the same bar/channel proportions — a figure, not the
   logo) extruded as 1px isometric plates and exploded up one axis. One flat red plane
   slots under the layer being installed; plates below it show through as dashed
   hidden lines (drafting convention). The same geometry builds the static markup
   (final: L3) and drives the demo.                                                   */
(function () {
  var U = 1.1, X0 = 560, Y0 = 719, C30 = Math.cos(Math.PI / 6), S30 = 0.5;
  // elevation [bottom, top] of each piece, mark units — the outer pieces rise behind the inner ones
  var Z = { 1: [162, 174], 2: [114, 126], 3: [66, 78], 4: [0, 30] };
  // the four nested pieces in mark units (master 152u mark + one outer step, same proportions)
  var SHAPE = {
    1: [[0, 0], [211, 0], [211, 212], [167, 212], [167, 45], [0, 45]],
    2: [[0, 60], [152, 60], [152, 212], [108, 212], [108, 105], [0, 105]],
    3: [[0, 120], [94, 120], [94, 212], [55, 212], [55, 158], [0, 158]],
    4: [[0, 174], [42, 174], [42, 212], [0, 212]]
  };
  var BAND = { 1: 22.5, 2: 82.5, 3: 139 };                          // mid-depth of each top bar (its far end takes the leader)
  var FW = 212, FD = 211, PL = 10;                                  // rotated footprint (x' 0..212, y' 0..211), plane overhang
  var NAMES = { 1: "NARRATIVE", 2: "DATA", 3: "ORCHESTRATION", 4: "INTELLIGENCE" };
  var TAGX = 88, CH = 7.04;                                         // tag column; mono 11px advance incl. tracking
  var SPEC = {
    1: ["The positioning and language that decide whether buyers can explain you in their own words.",
        "We rewrite what your site, deck and reps say until a buyer can repeat it without you."],
    2: ["Sourcing, enrichment and refresh: your ICP and signal map run as a system, not a one-off list.",
        "We build the data pipeline into your CRM so every record stays true without manual policing."],
    3: ["One engine across email, LinkedIn, phone, content and events, routed by live buying signal.",
        "We design the plays and triggers, install them in your stack and run the first cycles with your team."],
    4: ["The observation layer that feeds what works back into narrative and channels, so the system learns.",
        "We instrument every touch, then retune the system with you each quarter against what the signal says."]
  };

  function r(n) { return Math.round(n * 10) / 10; }
  // plan is turned a quarter (a rotation, not a mirror) so the heavy corner sits at the back of the view
  function rot(p) { return [p[1], 211 - p[0]]; }
  function P(x, y, z) { return [r(X0 + (x - y) * C30 * U), r(Y0 + (x + y) * S30 * U - z * U)]; }
  function poly(pts) { return pts.map(function (p) { return p[0] + "," + p[1]; }).join(" "); }
  function vface(a, b, z0, z1) { return poly([P(a[0], a[1], z1), P(b[0], b[1], z1), P(b[0], b[1], z0), P(a[0], a[1], z0)]); }
  function plan(k) { return SHAPE[k].map(rot); }

  function plateFaces(k) {          // faces turned toward the viewer, far to near, then the top
    var pts = plan(k), n = pts.length, A = 0, i, faces = [];
    for (i = 0; i < n; i++) { var a = pts[i], b = pts[(i + 1) % n]; A += a[0] * b[1] - b[0] * a[1]; }
    for (i = 0; i < n; i++) {
      var p = pts[i], q = pts[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1];
      var nx = A > 0 ? dy : -dy, ny = A > 0 ? -dx : dx;
      if (nx + ny > 0) faces.push({ d: p[0] + p[1] + q[0] + q[1], f: vface(p, q, Z[k][0], Z[k][1]) });
    }
    faces.sort(function (u, v) { return u.d - v.d; });
    return faces.map(function (f) { return f.f; }).concat([poly(pts.map(function (p) { return P(p[0], p[1], Z[k][1]); }))]);
  }
  function outline(k) {             // full silhouette edges for the hidden-line overlay (dashed under the plane)
    var pts = plan(k), d = "";
    [Z[k][0], Z[k][1]].forEach(function (z) { d += "M" + pts.map(function (p) { return P(p[0], p[1], z).join(" "); }).join("L") + "Z"; });
    pts.forEach(function (p) { d += "M" + P(p[0], p[1], Z[k][0]).join(" ") + "L" + P(p[0], p[1], Z[k][1]).join(" "); });
    return d;
  }
  function target(k) {             // the far end of each piece's top bar (the core: its left corner, mid-height)
    if (k === 4) { var c = rot([0, 174]); return P(c[0], c[1], (Z[4][0] + Z[4][1]) / 2); }
    var e = rot([0, BAND[k]]); return P(e[0], e[1], Z[k][1]);
  }
  function elev(L) {               // vertical dimension: datum (z 0) → the plane's right corner, ticks at both ends
    var b = P(FW + PL, -PL, 0), t = P(FW + PL, -PL, Z[L][0]), x = Math.round(b[0] + 16) + 0.5;
    return { d: "M" + (x - 10) + " " + b[1] + "H" + (x + 4) + "M" + x + " " + b[1] + "V" + t[1] + "M" + (x - 3) + " " + (t[1] + 3) + "l6 -6M" + (x - 3) + " " + (b[1] + 3) + "l6 -6",
             x: x + 10, y: r((b[1] + t[1]) / 2 + 4) };
  }
  function planeShift(L) { return "translateY(" + r(-(Z[L][0] - Z[3][0]) * U) + "px)"; }   // relative to the L3 markup
  function elShift(L) { var e = elev(L), f = elev(3); return "translate(" + r(e.x - f.x) + "px, " + r(e.y - f.y) + "px)"; }
  function order(L) {              // painter's order: plates below the plane, plane, active plate, plates above
    var below = [], above = [];
    [4, 3, 2, 1].forEach(function (k) { if (Z[k][0] < Z[L][0]) below.push(k); else above.push(k); });
    return { below: below, above: above };
  }

  function svg(L) {
    var s = "", i, x;
    // construction grid (dashed, drawing field only) + datum footprint + explode axis
    s += '<g class="km-stack-C__cons">';
    for (i = 1; i <= 7; i++) { x = r(64 + i * 111.333 - 12) + 0.5; s += '<path class="km-stack-C__cl" d="M' + x + ' 480V1056"/>'; }
    [672.5, 864.5].forEach(function (y) { s += '<path class="km-stack-C__cl" d="M64 ' + y + 'H942"/>'; });
    s += "</g>";
    s += '<g class="km-stack-C__datum"><polygon class="km-stack-C__dash" points="' +
         poly([P(0, 0, 0), P(FW, 0, 0), P(FW, FD, 0), P(0, FD, 0)]) + '"/>' +
         '<path class="km-stack-C__axis" d="M' + P(FW / 2, FD / 2, -16).join(" ") + "L" + P(FW / 2, FD / 2, 196).join(" ") + '"/></g>';
    var o = order(L);
    s += '<g class="km-stack-C__asm">';
    function plate(k) {
      var g = '<g class="km-stack-C__k' + (k === L ? " is-on" : "") + '" data-k="' + k + '">';
      plateFaces(k).forEach(function (pts, j) { g += '<polygon class="km-stack-C__face" pathLength="1" style="--j:' + j + '" points="' + pts + '"/>'; });
      return g + "</g>";
    }
    o.below.forEach(function (k) { s += plate(k); });
    var zp = Z[3][0], pr = P(FW + PL, -PL, zp), ty = Math.floor(pr[1]);
    s += '<g class="km-stack-C__plane" style="transform: ' + planeShift(L) + '"><g class="km-stack-C__drop">' +
         '<polygon class="km-stack-C__red" points="' + poly([P(-PL, -PL, zp), P(FW + PL, -PL, zp), P(FW + PL, FD + PL, zp), P(-PL, FD + PL, zp)]) + '"/>' +
         '<path class="km-stack-C__lead km-stack-C__lead--b" d="M' + pr[0] + " " + (ty + 0.5) + "H" + r(pr[0] + 18) + '"/>' +
         '<rect class="km-stack-C__box km-stack-C__box--b" x="' + r(pr[0] + 22.5) + '" y="' + (ty - 7.5) + '" width="16" height="16"/>' +
         '<text class="km-stack-C__boxt" x="' + r(pr[0] + 30.5) + '" y="' + (ty + 4.5) + '">B</text>' +
         '<text class="km-stack-C__tag km-stack-C__tag--b" x="' + r(pr[0] + 46) + '" y="' + (ty + 4.5) + '">INSTALLED</text>' +
         "</g></g>";
    // hidden lines: every plate's outline, shown dashed only while it lies under the plane
    s += '<g class="km-stack-C__hids">';
    [1, 2, 3, 4].forEach(function (k) { s += '<path class="km-stack-C__hid' + (o.below.indexOf(k) > -1 ? " is-on" : "") + '" data-k="' + k + '" d="' + outline(k) + '"/>'; });
    s += "</g>";
    s += plate(L);
    o.above.forEach(function (k) { if (k !== L) s += plate(k); });
    s += "</g>";
    // dimensions (real mark units): footprint depth 212U, and the plane's elevation above the datum (moves with it)
    var e0 = P(FW + 4, 0, 0), e0b = P(FW + 22, 0, 0), e1 = P(FW + 4, FD, 0), e1b = P(FW + 22, FD, 0), d0 = P(FW + 16, 0, 0), d1 = P(FW + 16, FD, 0), dm = P(FW + 16, FD / 2, 0);
    s += '<g class="km-stack-C__dims"><path class="km-stack-C__dim km-stack-C__dimp" pathLength="1" d="M' + e0.join(" ") + "L" + e0b.join(" ") + "M" + e1.join(" ") + "L" + e1b.join(" ") +
         "M" + d0.join(" ") + "L" + d1.join(" ") + "M" + (d0[0] - 3) + " " + (d0[1] - 3) + "l6 6M" + (d1[0] - 3) + " " + (d1[1] - 3) + 'l6 6"/>' +
         '<text class="km-stack-C__dimt" x="' + r(dm[0] + 14) + '" y="' + r(dm[1] + 18) + '">211U</text>';
    var el = elev(L);
    s += '<path class="km-stack-C__dim km-stack-C__eld" style="d: path(\'' + el.d + '\')"/>' +
         '<text class="km-stack-C__dimt km-stack-C__elt" x="' + elev(3).x + '" y="' + elev(3).y + '" style="transform: ' + elShift(L) + '">EL. +' + Z[L][0] + "U</text></g>";
    // layer tags on straight leaders (column at x 88); the active layer carries callout A
    s += '<g class="km-stack-C__tags">';
    [1, 2, 3, 4].forEach(function (k) {
      var t = target(k), y = Math.floor(t[1]) + 0.5, label = "L" + k + " · " + NAMES[k], x1 = TAGX + 24 + label.length * CH + 10;
      s += '<g class="km-stack-C__t' + (k === L ? " is-on" : "") + '" data-k="' + k + '">' +
           '<rect class="km-stack-C__box" x="' + (TAGX + 0.5) + '" y="' + (y - 8) + '" width="16" height="16"/>' +
           '<text class="km-stack-C__boxt" x="' + (TAGX + 8.5) + '" y="' + (y + 4) + '">A</text>' +
           '<text class="km-stack-C__tag" x="' + (TAGX + 24) + '" y="' + (y + 4) + '">' + label + "</text>" +
           '<path class="km-stack-C__lead" pathLength="1" d="M' + r(x1) + " " + y + "H" + t[0] + '"/>' +
           '<rect class="km-stack-C__node" x="' + r(t[0] - 2) + '" y="' + (y - 2.5) + '" width="4" height="4"/></g>';
    });
    s += "</g>";
    // crosshairs: 4 frame corners + 3 chosen intersections
    s += '<g class="km-stack-C__xh">';
    [[64.5, 0.5], [1375.5, 0.5], [64.5, 1103.5], [1375.5, 1103.5], [943, 480.5], [943, 1056.5], [386.5, 864.5]].forEach(function (c) {
      s += '<path d="M' + (c[0] - 4.5) + " " + c[1] + "h9M" + c[0] + " " + (c[1] - 4.5) + 'v9"/>';
    });
    s += "</g>";
    return s;
  }

  function typeOn(el, text, ms, delay) {
    var timer;
    el.textContent = "";
    setTimeout(function () {
      var n = 0;
      timer = setInterval(function () { n++; el.textContent = text.slice(0, n); if (n >= text.length) clearInterval(timer); }, ms);
    }, delay || 0);
  }

  window.KM = {
    geom: { svg: svg, SPEC: SPEC, NAMES: NAMES, Z: Z },
    init: function (root, opt) {
      if (!root) return;
      var asm = root.querySelector(".km-stack-C__asm");
      var plane = root.querySelector(".km-stack-C__plane");
      var hids = root.querySelector(".km-stack-C__hids");
      var tabs = root.querySelectorAll(".km-stack-C__tab");
      var tags = root.querySelectorAll(".km-stack-C__t");
      var specA = root.querySelector('[data-spec="a"]'), specB = root.querySelector('[data-spec="b"]');
      var word = root.querySelector(".km-stack-C__word");
      var tick = root.querySelector(".km-stack-C__tick");
      var utc = root.querySelector(".km-stack-C__utc");
      var eld = root.querySelector(".km-stack-C__eld"), elt = root.querySelector(".km-stack-C__elt");
      var cur = 3;

      function stamp() {
        var d = new Date();
        function p(n) { return (n < 10 ? "0" : "") + n; }
        utc.textContent = "UTC " + p(d.getUTCHours()) + ":" + p(d.getUTCMinutes()) + ":" + p(d.getUTCSeconds());
      }
      if (utc) { stamp(); setInterval(function () { utc.classList.add("is-tick"); setTimeout(function () { stamp(); utc.classList.remove("is-tick"); }, 200); }, 6000); }

      function reorder(L) {
        var o = order(L), k = function (n) { return asm.querySelector('.km-stack-C__k[data-k="' + n + '"]'); };
        o.below.forEach(function (n) { asm.insertBefore(k(n), plane); });
        [L].concat(o.above.filter(function (n) { return n !== L; })).forEach(function (n) { asm.appendChild(k(n)); });
        Array.prototype.forEach.call(hids.children, function (h) { h.classList.toggle("is-on", o.below.indexOf(+h.getAttribute("data-k")) > -1); });
      }
      function set(L, animate) {
        var prev = cur; cur = L;
        root.setAttribute("data-layer", L);
        plane.style.transform = planeShift(L);
        var el = elev(L);
        eld.style.d = "path('" + el.d + "')";
        elt.style.transform = elShift(L);
        elt.textContent = "EL. +" + Z[L][0] + "U";
        // swap occlusion when the plane passes the next plate (late in the glide when descending)
        if (animate) setTimeout(function () { if (cur === L) reorder(L); }, Z[L][0] < Z[prev][0] ? 470 : 130);
        else reorder(L);
        Array.prototype.forEach.call(root.querySelectorAll(".km-stack-C__k"), function (g) { g.classList.toggle("is-on", +g.getAttribute("data-k") === L); });
        Array.prototype.forEach.call(tags, function (g) { g.classList.toggle("is-on", +g.getAttribute("data-k") === L); });
        Array.prototype.forEach.call(tabs, function (b) {
          var on = +b.getAttribute("data-k") === L;
          b.classList.toggle("is-on", on); b.setAttribute("aria-selected", on ? "true" : "false");
        });
        if (animate) {
          [specA, specB, word].forEach(function (el) { el.classList.add("is-swap"); });
          setTimeout(function () {
            specA.textContent = SPEC[L][0]; specB.textContent = SPEC[L][1]; word.textContent = NAMES[L];
            [specA, specB, word].forEach(function (el) { el.classList.remove("is-swap"); });
          }, 260);
        } else {
          specA.textContent = SPEC[L][0]; specB.textContent = SPEC[L][1]; word.textContent = NAMES[L];
        }
      }
      Array.prototype.forEach.call(tabs, function (b) { b.addEventListener("click", function () { set(+b.getAttribute("data-k"), true); }); });
      Array.prototype.forEach.call(root.querySelectorAll(".km-stack-C__row"), function (row) {
        row.addEventListener("mouseenter", function () { root.setAttribute("data-hot", row.getAttribute("data-key")); });
        row.addEventListener("mouseleave", function () { root.removeAttribute("data-hot"); });
      });
      if (opt && opt.reduced) return;          // reduced motion: the plotted final state (L3)
      // demo: plot, the plane drops into L1, then the tabs step [01] → [02] → [03] every 1.2s.
      root.classList.add("is-snap");
      set(1, false);
      void root.offsetWidth;
      root.classList.remove("is-snap");
      typeOn(tick, tick.textContent, 14, 2500);
      setTimeout(function () { root.classList.add("is-done"); }, 3200);   // plotting finished: reordering must not replay it
      setTimeout(function () { set(2, true); }, 3500);
      setTimeout(function () { set(3, true); }, 4700);
    }
  };
})();
