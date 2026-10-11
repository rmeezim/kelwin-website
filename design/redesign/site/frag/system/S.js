/* system · S — FIG. 03 The loop, closed (the page's only pin).
   One drawing function, three presentations:
     · homepage (html.km-home): a tall track with a sticky stage. Scroll progress p
       through the track picks the frame (0–4). Frames 0 and 4 are scrubbed (their
       packet, the red return, the rings and the counter follow p); frames 1–3 play
       their slab drop + inscription morph when p crosses their threshold, and
       reverse when it crosses back. No ScrollTrigger pin (it breaks under the
       prototype's CSS zoom): position sticky + getBoundingClientRect, rAF-throttled.
     · reduced motion / ≤ 760px: frame 0 and frame 4 drawn as stills (CSS stacks them).
     · standalone review page: a static contact sheet of the five frames, each drawn
       by the same function at a fixed progress.                                    */
(function () {
  "use strict";
  var P = "km-system-S";
  var NS = "http://www.w3.org/2000/svg";
  var C30 = Math.cos(Math.PI / 6);

  /* ── geometry (svg units = px at the 1440 stage; drawing field 755 × 640, cols 1–7) ──
     The slabs are square in plan (150 × 150, 12 thick), drawn in true isometric, so
     their top face is a 260 × 150 rhombus and the loop's legs — which run along the
     face's diagonal — are screen-horizontal: the TRACE stays orthogonal.            */
  var G = {
    cx: 330,      // the spindle: the trace runs vertically through the slab centres
    ym: 300,      // node 2 holds still; compression closes in on it
    PE: 218,      // node pitch exploded: 150 face + 12 thick + 56 gap
    PC: 194,      // node pitch assembled: 32 gap
    XR: 570,      // the return's vertical (identical in frame 0 and frame 4)
    XOUT: 745,    // compounding pipeline terminal
    HF: 75,       // half the slab's plan side
    T: 12,        // slab thickness
    LX: 150,      // callout labels end here (text-anchor end)
    LE: 160       // callout leaders end here
  };
  var HW = 2 * G.HF * C30;          // half-width of the face rhombus (≈ 129.9)
  var HH = G.HF;                     // half-height of the face rhombus (75)

  /* ── frame 4 choreography, as fractions of frame 4's scroll (480px) ── */
  var LAPS = [[0.04, 0.36], [0.36, 0.54], [0.54, 0.72], [0.72, 0.88]];
  var A4 = { err: [0, 0.05], nums: [0, 0.06], reset: [0.16, 0.24], branch: [0.36, 0.42],
             out: [0.86, 0.96], outLab: [0.92, 1], squeeze: [0.88, 0.98] };
  var RING_R = [30, 42, 54, 66];     // deposits (plan radius); the core ring is 18

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function seg(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function eio(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function eout(t) { return 1 - Math.pow(1 - t, 3); }
  function n1(v) { return Math.round(v * 10) / 10; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mk(tag, attrs, parent, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function after(pts, from) {        // the part of a polyline that lies beyond distance `from`
    var out = [], acc = 0;
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1], L = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);   // orthogonal segments
      if (acc + L <= from) { acc += L; continue; }
      var t = Math.max(0, (from - acc) / L);
      if (!out.length) out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      out.push(b); acc += L;
    }
    return out.length > 1 ? "M" + out.map(function (q) { return n1(q[0]) + " " + n1(q[1]); }).join("L") : "";
  }
  function set(e, attrs) { for (var k in attrs) e.setAttribute(k, attrs[k]); }
  function op(e, v) { e.style.opacity = v >= 0.999 ? "" : String(n1(v * 100) / 100); e.style.display = v <= 0.001 ? "none" : ""; }

  /* ── compact annotation (the half-scale contact sheet and phones) ──
     A drawing shown at about half size would shrink its 14px labels to 7px. Compact
     mode keeps the geometry and re-sets the annotation for that size instead: labels at
     30 units (≈ 14px on the sheet, ≥ 11.3px on a 360px phone), bigger marks, two-line
     labels where one line would collide, and the mono pieces (the ERR stamp, the
     dimension) moved out to the HTML caption row, where they stay full size.        */
  var VB = "0 0 755 640", VB_CMP = "-115 0 870 615";

  /* ── the drawing ── */
  function Drawing(svg, opt) {
    var cmp = !!(opt && opt.compact);
    svg.textContent = "";
    svg.setAttribute("viewBox", cmp ? VB_CMP : VB);
    svg.setAttribute("width", cmp ? 870 : 755); svg.setAttribute("height", cmp ? 615 : 640);   // the aspect CSS scales by
    svg.classList.toggle(P + "__svg--cmp", cmp);
    var cx = G.cx;
    var LX = cmp ? 170 : G.LX, LE = cmp ? 178 : G.LE;   // label end · leader start
    var MK = cmp ? 1.5 : 1;                               // marks (nodes, ✕, chevrons) scale
    var NS7 = 7 * MK, AN = cmp ? 7 : 5;

    // 1 · the spindle (full; slab faces occlude it below each node)
    var spine = mk("path", { class: "ac-s " + P + "__spine", pathLength: 1 }, svg);

    // 2 · slabs, each with its own inscription
    var faceD = "M0 " + -HH + "L" + n1(HW) + " 0L0 " + HH + "L" + n1(-HW) + " 0Z";
    var sideL = "M" + n1(-HW) + " 0L0 " + HH + "V" + (HH + G.T) + "L" + n1(-HW) + " " + G.T + "Z";
    var sideR = "M0 " + HH + "L" + n1(HW) + " 0V" + G.T + "L0 " + (HH + G.T) + "Z";
    var slabs = [null];
    for (var k = 1; k <= 3; k++) {
      var g = mk("g", { class: P + "__slab" }, svg);
      mk("path", { class: P + "__side", d: sideL }, g);
      mk("path", { class: P + "__side", d: sideR }, g);
      mk("path", { class: P + "__face", d: faceD }, g);
      slabs.push({ g: g, ins: mk("g", {}, g) });
    }

    // slab 01 · Narrative Systems — CONTOUR: five jittery lines settle into text rules
    var rnd = mulberry32(7);
    var RULES = [[22, 50], [33, 34], [44, 56], [55, 24], [66, 44]];   // [plan Y, X end]; all start at X −58
    var rules = RULES.map(function (r, i) {
      var w = [];
      for (var j = 0; j < 3; j++) w.push({ f: 2 + rnd() * 6 * (j + 1) / 2, p: rnd(), a: [0.6, 0.3, 0.18][j] });
      return { Y: r[0], x0: -58, x1: r[1], w: w,
        el: mk("path", { class: P + "__ink" + (i === 0 ? " " + P + "__ink--fg" : "") }, slabs[1].ins) };
    });

    // slab 02 · GTM Infrastructure — TRACE: a three-node route draws across the face (iso-orthogonal)
    var R0 = [-80, 12], R1 = [R0[0] + 50 * C30, R0[1] + 25], R2 = [R1[0] + 40 * C30, R1[1] - 20], R3 = [R2[0] + 50 * C30, R2[1] + 25];
    var route = mk("path", { class: P + "__ink", pathLength: 1, "stroke-dasharray": "1 1",
      d: "M" + [R0, R1, R2, R3].map(function (q) { return n1(q[0]) + " " + n1(q[1]); }).join("L") }, slabs[2].ins);
    var rNodes = [[R0, 0], [R1, 50 / 140], [R3, 1]].map(function (q) {
      return { at: q[1], el: mk("rect", { class: P + "__node", x: n1(q[0][0] - 3), y: n1(q[0][1] - 3), width: 6, height: 6 }, slabs[2].ins) };
    });

    // slab 03 · GTM Intelligence — ORBIT: the core ring closes; each lap deposits a ring
    var ringRx = function (r) { return n1(r * Math.SQRT2 * C30); }, ringRy = function (r) { return n1(r * Math.SQRT1_2); };
    var deposits = RING_R.map(function (r) {
      return mk("ellipse", { class: P + "__ink", cx: 0, cy: 0, rx: ringRx(r), ry: ringRy(r), pathLength: 1, "stroke-dasharray": "1 1" }, slabs[3].ins);
    });
    var core = mk("ellipse", { class: P + "__ink " + P + "__ink--fg", cx: 0, cy: 0, rx: ringRx(18), ry: ringRy(18), pathLength: 360 }, slabs[3].ins);

    // 3 · the spindle again, in front of each face's back half (hidden-line drawing)
    var fronts = [null, null, mk("path", { class: "ac-s" }, svg), mk("path", { class: "ac-s" }, svg)];

    // 4 · the loop: dashed Reset (frames 0–3) → solid red return (frame 4); reroute; output
    var ret = mk("path", { class: P + "__ret" }, svg);
    var red = mk("path", { class: P + "__red", pathLength: 1, "stroke-dasharray": "1 1" }, svg);
    var branch = mk("path", { class: P + "__ret" }, svg);
    var out = mk("path", { class: "ac-s", pathLength: 1, "stroke-dasharray": "1 1" }, svg);
    var chev = {
      s12: mk("path", { class: "ac-s" }, svg), s23: mk("path", { class: "ac-s" }, svg),
      up: mk("path", { class: "ac-s" }, svg), upRed: mk("path", { class: P + "__redchev" }, svg),
      br: mk("path", { class: "ac-s-mute" }, svg), out: mk("path", { class: "ac-s" }, svg)
    };
    var term = mk("rect", { class: P + "__node", width: AN, height: AN }, svg);

    // 5 · nodes, the break (red ✕), the packet
    var nodes = [null, 1, 2, 3].map(function (v) { return v && mk("rect", { class: P + "__node", width: NS7, height: NS7 }, svg); });
    var xg = mk("g", {}, svg);
    var XH = 11 * MK;
    mk("path", { class: P + "__x", d: "M" + -XH + " " + -XH + "L" + XH + " " + XH + "M" + XH + " " + -XH + "L" + -XH + " " + XH }, xg);
    var packet = mk("rect", { class: P + "__packet", width: 6, height: 6 }, svg);

    // 6 · annotation: ≤ 5 callouts at any moment (frame 0: four loop labels · frames 1–4: layers + branch + output)
    var LOOP = ["Capital in", "Campaigns run", "Knowledge lost"];
    var LAYER = ["Narrative Systems", "GTM Infrastructure", "GTM Intelligence"];
    var calls = [null];
    for (k = 1; k <= 3; k++) {
      calls.push({
        lead: mk("path", { class: "ac-s-mute" }, svg),
        anc: mk("rect", { class: P + "__anchor", width: AN, height: AN }, svg),
        a: mk("text", { class: "ac-t-label ac-t-end", x: LX }, svg, LOOP[k - 1]),
        b: mk("text", { class: "ac-t-label ac-t-fg ac-t-end", x: LX }, svg, LAYER[k - 1]),
        num: mk("text", { class: P + "__numeral ac-t-end", x: LX }, svg, "0" + k)
      });
    }
    // a label of one or two lines (compact mode breaks the long ones so they clear the loop)
    function label(cls, x, words, lines) {
      var t = mk("text", { class: cls, x: x }, svg);
      var parts = lines ? words.split(" ") : [words];
      return { el: t, sp: parts.map(function (w) { return mk("tspan", { x: x }, t, w); }) };
    }
    function placeLabel(L, y, step) { L.sp.forEach(function (s, i) { s.setAttribute("y", n1(y + i * step)); }); }
    var resetT = mk("text", { class: "ac-t-label", x: G.XR + 16 }, svg, "Reset");
    var stamp = mk("g", {}, svg);
    if (!cmp) {                      // compact: the stamp moves to the caption row
      mk("rect", { class: P + "__stamp", x: G.XR + 16, y: 0, width: 124, height: 24 }, stamp);
      mk("text", { class: "ac-t-code ac-t-fg", x: G.XR + 27, y: 16 }, stamp, "ERR · Q1 = Q9");
    }
    var branchT = cmp ? label("ac-t-label", G.XR + 14, "Reroute effort", true)
                      : label("ac-t-label ac-t-mid", n1((cx + HW + G.XR) / 2), "Reroute effort", false);
    var outT = label("ac-t-label ac-t-end", G.XOUT, "Compounding pipeline", cmp);
    var dim = mk("g", {}, svg);
    var dimL = mk("path", { class: "ac-s-mute" }, dim);
    var dimT = mk("text", { class: "ac-t-code ac-t-mid", x: n1((cx + G.XR) / 2) }, dim, "One cycle · one quarter");

    function chevD(x, y, dir) {      // a 9px open chevron pointing dir (13.5 in compact mode)
      var a = 4.5 * MK, b = 2.5 * MK, c = 2 * MK;
      if (dir === "down") return "M" + (x - a) + " " + (y - b) + "L" + x + " " + (y + c) + "L" + (x + a) + " " + (y - b);
      if (dir === "up") return "M" + (x - a) + " " + (y + b) + "L" + x + " " + (y - c) + "L" + (x + a) + " " + (y + b);
      if (dir === "left") return "M" + (x + b) + " " + (y - a) + "L" + (x - c) + " " + y + "L" + (x + b) + " " + (y + a);
      return "M" + (x - b) + " " + (y - a) + "L" + (x + c) + " " + y + "L" + (x - b) + " " + (y + a);
    }

    /* S = { s: [null, {d, m} × 3], a0, a4 }   d: slab dropped 0–1 · m: its morph 0–1
       a0: frame 0's scrub 0–1 (three runs that drop out at the ✕) · a4: frame 4's scrub 0–1 */
    function render(S) {
      var a0 = S.a0 == null ? 1 : S.a0, a4 = S.a4 || 0;
      var sl = S.s;
      var squeeze = eio(seg(a4, A4.squeeze[0], A4.squeeze[1]));
      var pitch = lerp(G.PE, G.PC, squeeze);
      var y = [0, G.ym - pitch, G.ym, G.ym + pitch];
      var XR = G.XR, W = XR - cx;

      spine.setAttribute("d", "M" + cx + " " + n1(y[1]) + "V" + n1(y[3]));

      // slabs: drop −24px → 0 and fade in; the inscriptions morph
      for (var k = 1; k <= 3; k++) {
        var d = sl[k].d, de = eout(d);
        set(slabs[k].g, { transform: "translate(" + cx + " " + n1(y[k] - 24 * (1 - de)) + ")" });
        op(slabs[k].g, d);
        if (fronts[k]) { fronts[k].setAttribute("d", "M" + cx + " " + n1(y[k] - HH - 24 * (1 - de)) + "V" + n1(y[k] - 4)); op(fronts[k], d); }
      }
      // 01 · CONTOUR — amplitude decays left → right as a filter front passes (m)
      var m1 = sl[1].m, front = lerp(-0.3, 1.3, eio(m1));
      rules.forEach(function (r) {
        var pts = [], N = 26;
        for (var j = 0; j < N; j++) {
          var u = j / (N - 1), X = lerp(r.x0, r.x1, u), q = (X - r.Y) * C30, v = (X + r.Y) * 0.5;
          var noise = 0; r.w.forEach(function (w) { noise += w.a * Math.sin(2 * Math.PI * (w.f * u + w.p)); });
          var settle = clamp((front - u) / 0.3, 0, 1);
          pts.push(n1(q) + " " + n1(v + noise * 9 * (1 - settle * settle * (3 - 2 * settle))));
        }
        r.el.setAttribute("d", "M" + pts.join("L"));
      });
      // 02 · TRACE — the route draws, its nodes latch as the line reaches them
      var m2 = sl[2].m;
      route.style.strokeDashoffset = String(n1((1 - eio(m2)) * 1000) / 1000);
      rNodes.forEach(function (nd) { nd.el.classList.toggle("is-on", eio(m2) >= nd.at - 0.001 && m2 > 0); });
      // 03 · ORBIT — the open ring closes (gap 56° → 0), the ✕ dissolves into it
      var m3 = sl[3].m, gap = 56 * (1 - eio(seg(m3, 0.15, 1)));
      set(core, { "stroke-dasharray": n1(360 - gap) + " " + n1(gap), "stroke-dashoffset": n1(145 + 360 - gap / 2) });

      // the loop geometry (identical in frames 0 and 4: node 3 → right → up → left into node 1)
      var retD = "M" + cx + " " + n1(y[3]) + "H" + XR + "V" + n1(y[1]) + "H" + cx;
      var retPts = [[cx, y[3]], [XR, y[3]], [XR, y[1]], [cx, y[1]]];
      red.setAttribute("d", retD);

      // frame 4: four laps of one packet; each lap deposits a ring and carries one count home
      var Ls = [2 * pitch, W, 2 * pitch, W], T = Ls[0] + Ls[1] + Ls[2] + Ls[3];
      var fN3 = Ls[0] / T, count = 0, redDraw = 0, pk = null;
      var ringDraw = [0, 0, 0, 0];
      LAPS.forEach(function (L, i) {
        if (a4 <= L[0]) return;
        var q = seg(a4, L[0], L[1]);
        ringDraw[i] = eio(seg(q, fN3, fN3 + 0.14));
        if (i === 0) redDraw = seg(q, fN3, 1);
        if (q >= 1) count = i + 1;
        else pk = q;
      });
      if (a4 >= LAPS[3][1]) pk = null;
      deposits.forEach(function (e, i) {
        e.style.strokeDashoffset = String(n1((1 - ringDraw[i]) * 1000) / 1000);
        op(e, ringDraw[i] > 0 ? 1 : 0);
      });
      red.style.strokeDashoffset = String(n1((1 - redDraw) * 1000) / 1000);
      op(red, redDraw > 0 ? 1 : 0);
      // the dashed Reset survives only ahead of the red (no dashes bleeding through it)
      var rest = after(retPts, redDraw * (2 * W + 2 * pitch));
      ret.setAttribute("d", rest || "M0 0");
      op(ret, rest ? 1 : 0);

      // chevrons: one per segment
      var g12 = (y[1] + HH + G.T + y[2] - HH) / 2, g23 = (y[2] + HH + G.T + y[3] - HH) / 2, yUp = (y[1] + y[2]) / 2;
      chev.s12.setAttribute("d", chevD(cx, n1(g12), "down"));
      chev.s23.setAttribute("d", chevD(cx, n1(g23), "down"));
      chev.up.setAttribute("d", chevD(XR, n1(yUp), "up"));
      chev.upRed.setAttribute("d", chevD(XR, n1(yUp), "up"));
      var upAt = (W + (y[3] - yUp)) / (W + 2 * pitch + W);
      op(chev.upRed, redDraw >= upAt ? 1 : 0);
      op(chev.up, redDraw >= upAt ? 0 : 1);

      // the branch: Reroute effort, dashed, from the return into node 2
      var bA = seg(a4, A4.branch[0], A4.branch[1]);
      branch.setAttribute("d", "M" + XR + " " + n1(y[2]) + "H" + (cx + 5));
      chev.br.setAttribute("d", chevD(n1(cx + HW + 24), n1(y[2]), "left"));
      op(branch, bA); op(chev.br, bA);
      placeLabel(branchT, cmp ? y[2] - 6 : y[2] - 12, 32); op(branchT.el, bA);

      // the output: Compounding pipeline exits at the bottom right
      var oA = eio(seg(a4, A4.out[0], A4.out[1]));
      out.setAttribute("d", "M" + XR + " " + n1(y[3]) + "H" + G.XOUT);
      out.style.strokeDashoffset = String(n1((1 - oA) * 1000) / 1000);
      op(out, oA > 0 ? 1 : 0);
      chev.out.setAttribute("d", chevD(G.XOUT - 36, n1(y[3]), "right"));
      op(chev.out, seg(oA, 0.7, 1));
      set(term, { x: G.XOUT, y: n1(y[3] - AN / 2) }); op(term, seg(oA, 0.9, 1));
      // compact: two lines under the output, clear of the return's vertical
      placeLabel(outT, cmp ? y[3] + 36 : y[3] - 12, 32); op(outT.el, seg(a4, A4.outLab[0], A4.outLab[1]));

      // the one dimension, along the return's span (compact: carried by the panel's subtitle instead)
      var yd = y[3] + HH + G.T + 20;
      dimL.setAttribute("d", "M" + cx + " " + n1(yd) + "H" + XR + "M" + cx + " " + n1(yd - 4.5) + "V" + n1(yd + 4.5) + "M" + XR + " " + n1(yd - 4.5) + "V" + n1(yd + 4.5));
      set(dimT, { y: n1(yd - 10) });
      op(dim, cmp ? 0 : bA);

      // nodes: outlined while bare, latched (filled) once their layer is installed
      for (k = 1; k <= 3; k++) {
        set(nodes[k], { x: n1(cx - NS7 / 2), y: n1(y[k] - NS7 / 2) });
        nodes[k].classList.toggle("is-on", sl[k].d >= 1 && (k < 3 || m3 >= 0.85));
      }
      op(nodes[3], seg(m3, 0.7, 1));
      // the break: a red ✕ at Knowledge lost (frames 0–2), dissolving into the closed ring (frame 3)
      var xd = seg(m3, 0.15, 0.85);
      set(xg, { transform: "translate(" + cx + " " + n1(y[3]) + ") scale(" + n1((1 - 0.75 * eio(xd)) * 100) / 100 + ")" });
      op(xg, 1 - eio(xd));

      // the packet
      var px = null, py = null, pa = 0;
      if (a4 > 0) {
        if (pk != null) {
          var dist = pk * T, pts = [[cx, y[1]], [cx, y[3]], [XR, y[3]], [XR, y[1]], [cx, y[1]]];
          for (var s = 0; s < 4; s++) {
            if (dist <= Ls[s] || s === 3) { var t = clamp(dist / Ls[s], 0, 1); px = lerp(pts[s][0], pts[s + 1][0], t); py = lerp(pts[s][1], pts[s + 1][1], t); break; }
            dist -= Ls[s];
          }
          pa = 1;
          // inside a slab's body (below its node, on the spindle) the packet is hidden
          if (px === cx) for (k = 1; k <= 3; k++) if (sl[k].d > 0.5 && py > y[k] + 4 && py < y[k] + HH + G.T + 3) pa = 0;
        }
      } else if (a0 < 1) {
        var u0 = a0 * 3, run = Math.min(2, Math.floor(u0)), tt = u0 - run;
        if (tt <= 0.68) { px = cx; py = lerp(y[1], y[3], tt / 0.68); pa = 1; }
        else { var dr = (tt - 0.68) / 0.32; px = cx - 5 * dr; py = y[3] + 36 * Math.pow(dr, 1.6); pa = 1 - dr; }
      }
      if (px != null) set(packet, { x: n1(px - 3), y: n1(py - 3) });
      op(packet, px == null ? 0 : pa);

      // callouts: the loop's words give way to the layer's name as its slab lands
      var numA = seg(a4, A4.nums[0], A4.nums[1]);
      for (k = 1; k <= 3; k++) {
        var c = calls[k], dd = eout(sl[k].d), xs = lerp(cx - 22 * MK, cx - HW - 6, dd);
        c.lead.setAttribute("d", "M" + n1(xs) + " " + n1(y[k]) + "H" + LE);
        set(c.anc, { x: n1(xs - AN / 2), y: n1(y[k] - AN / 2) }); op(c.anc, seg(sl[k].d, 0.5, 1));
        set(c.a, { y: n1(y[k] + (cmp ? 10 : 5)) }); op(c.a, 1 - seg(sl[k].d, 0.15, 0.6));
        set(c.b, { y: n1(y[k] + (cmp ? 10 : 5)) }); op(c.b, seg(sl[k].d, 0.45, 0.95));
        set(c.num, { y: n1(y[k] - (cmp ? 26 : 16)) }); op(c.num, numA);
      }
      set(resetT, { y: n1(cmp ? y[2] + 10 : y[2] - 10) });
      op(resetT, 1 - seg(a4, A4.reset[0], A4.reset[1]));
      set(stamp, { transform: "translate(0 " + n1(y[2] + 6) + ")" });
      op(stamp, 1 - seg(a4, A4.err[0], A4.err[1]));

      return count;
    }
    return { render: render };
  }

  /* ── fixed states: the frames as stills (contact sheet + stacked fallback) ── */
  function still(f) {
    var s = { s: [null], a0: 1, a4: 0 };
    for (var k = 1; k <= 3; k++) { var on = k <= Math.min(f, 3) ? 1 : 0; s.s.push({ d: on, m: on }); }
    if (f === 4) s.a4 = 1;
    return s;
  }

  /* ── the pin (homepage) ── */
  function Pin(root) {
    var pin = root.querySelector("." + P + "__pin");
    var svg = root.querySelector('[data-draw="live"]');
    if (!pin || !svg) return;
    var D = Drawing(svg);
    var track = root.querySelector("." + P + "__track");
    var stage = root.querySelector("." + P + "__stage");
    var frame = root.querySelector("." + P + "__frame");
    var steps = Array.prototype.slice.call(root.querySelectorAll("." + P + "__step"));
    var rail = Array.prototype.slice.call(root.querySelectorAll("." + P + "__rail > li"));
    var countEl = root.querySelector("[data-count]");
    var TH = [0.175, 0.35, 0.525, 0.7];          // 280 · 560 · 840 · 1120 of 1600px
    var S = { s: [null, { d: 0, m: 0 }, { d: 0, m: 0 }, { d: 0, m: 0 }], a0: 0, a4: 0 };
    var view = { p: 0 };
    var f = -1, ticking = false, first = true;
    var hasG = typeof gsap !== "undefined";
    var MORPH = [0, 1.5, 1.0, 1.1];               // CONTOUR settles · TRACE draws · ORBIT closes

    function draw() {
      S.a0 = seg(view.p, 0, TH[0]);
      S.a4 = seg(view.p, TH[3], 1);
      var c = D.render(S);
      if (countEl) countEl.textContent = pad(c);
    }
    var tls = [null];
    for (var k = 1; k <= 3; k++) {
      if (hasG) {
        tls.push(gsap.timeline({ paused: true, onUpdate: draw })
          .to(S.s[k], { d: 1, duration: 0.7, ease: "power2.out" }, 0)
          .to(S.s[k], { m: 1, duration: MORPH[k], ease: "none" }, 0.55));
      } else tls.push(null);
    }
    function frameOf(p) { var i = 0; while (i < 4 && p >= TH[i]) i++; return i; }
    function setFrame(nf, instant) {
      if (nf === f) return;
      f = nf;
      steps.forEach(function (s) { s.classList.toggle("is-on", +s.getAttribute("data-f") === f); });
      rail.forEach(function (li, i) { li.classList.toggle("is-on", i === f); });
      var lv = Math.min(f, 3);
      for (var k = 1; k <= 3; k++) {
        var on = k <= lv;
        if (!tls[k] || instant) { if (tls[k]) tls[k].progress(on ? 1 : 0); else { S.s[k].d = on ? 1 : 0; S.s[k].m = on ? 1 : 0; } }
        else if (on) tls[k].timeScale(1).play(); else tls[k].timeScale(1.6).reverse();
      }
    }
    function measure() {
      ticking = false;
      if (pin.offsetParent === null) return;                       // fallback showing: nothing to drive
      var r = track.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      var range = r.height - sr.height;
      var p = range > 0 ? clamp(-r.top / range, 0, 1) : 0;
      // keep the frame inside short viewports
      var s = Math.min(1, (stage.clientHeight - 32) / frame.offsetHeight);
      frame.style.transform = s < 1 ? "scale(" + n1(s * 1000) / 1000 + ")" : "";
      setFrame(frameOf(p), first);
      if (first || !hasG) { view.p = p; draw(); first = false; return; }
      gsap.to(view, { p: p, duration: 0.6, ease: "power3.out", overwrite: true, onUpdate: draw });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(measure); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();

    // entrance: armed before it is seen, played when the stage comes into view
    if (pin.offsetParent !== null && "IntersectionObserver" in window) {
      root.classList.add("is-armed");
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          root.classList.add("is-in"); io.disconnect();
          // once played, retire the entrance hooks so nothing can replay it (resizes, captures)
          setTimeout(function () { root.classList.remove("is-armed", "is-in"); }, 2600);
        });
      }, { rootMargin: "0px 0px -22% 0px" });
      io.observe(stage);
    }
  }

  function setup(root, reduced) {
    if (!root || root.__kmSystem) return;
    root.__kmSystem = true;
    // stills: the stacked fallback and the contact sheet, drawn from the same function.
    // The sheet shows them at half size, so it always uses the compact annotation; the
    // stacked fallback uses it only where it scales down too (≤ 760px).
    var map = { f0: 0, f4: 4, s0: 0, s1: 1, s2: 2, s3: 3, s4: 4 };
    var narrow = window.matchMedia ? window.matchMedia("(max-width: 760px)") : { matches: false };
    function stills() {
      Array.prototype.forEach.call(root.querySelectorAll("svg[data-draw]"), function (svg) {
        var k = svg.getAttribute("data-draw");
        if (k in map) Drawing(svg, { compact: k.charAt(0) === "s" || narrow.matches }).render(still(map[k]));
      });
    }
    stills();
    if (narrow.addEventListener) narrow.addEventListener("change", stills);
    var home = document.documentElement.classList.contains("km-home");
    // the sheet's reveal plays once; then its hooks retire, so nothing can replay it
    // (tall page captures briefly re-evaluate the ≤ 760px query and would restart it)
    if (!home && !reduced) setTimeout(function () { root.classList.add("is-settled"); }, 2000);
    if (home && !reduced) Pin(root);
    else if (home) { var live = root.querySelector('[data-draw="live"]'); if (live) Drawing(live).render(still(4)); }
  }

  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // on the homepage the section sets itself up at once (its track is taller than the
  // harness's play threshold, so waiting for init would leave frame 0 empty on arrival)
  if (document.documentElement.classList.contains("km-home")) setup(document.querySelector("." + P), RM);

  window.KM = {
    init: function (root, opts) { setup(root, !!(opts && opts.reduced)); }
  };
})();
