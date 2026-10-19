/* r11-intel · T — what happens next quarter: three plain steps over one worked example.
   The markup is the end of step 03. This script:
   · measures the connector (the count → the plan's first row; straight down to the plan when the plate stacks),
     and only then lets it be drawn (.is-routed: with no script there is no connector, never a stray line);
   · arms the plate (hidden; the plan back to its starting rows, the empty slot dashed) and plays the steps in
     order, each one only when the part of the plate it changes is on screen:
       step 01 once the log is half in view (the plate fades in first),
       step 02 at least 2.9s later (the count has been read) and once the plan is half in view,
       step 03 2s after step 02; settled about 1.1s later;
   · lets the reader take over: a step button (click, tap, Enter, Space) shows the end of its step, briskly, and
     stops the pass for good; keyboard focus on a step stops it where it is; Replay runs the steps again.
   The current step carries aria-current="step"; a reader's own press is spoken (aria-live, polite).
   Reduced motion: nothing is armed; the step buttons still switch the plate (the base stylesheet turns every
   transition off), Replay stays hidden. */
window.KM = {
  init(root, { reduced }) {
    const P = "km-r11-intel-T__";
    const body = root.querySelector("." + P + "body");
    const plate = root.querySelector("." + P + "plate");
    const steps = Array.prototype.slice.call(root.querySelectorAll("." + P + "step"));
    const link = root.querySelector("." + P + "link"), lk = root.querySelector("." + P + "lk"), lh = root.querySelector("." + P + "lh");
    const tn = root.querySelector("." + P + "tn"), tk = root.querySelector("." + P + "tk");
    const saw = root.querySelector("." + P + "zone--saw"), planZ = root.querySelector("." + P + "zone--plan");
    const sheet = root.querySelector("." + P + "sheet"), first = root.querySelector("." + P + "row--new");
    const replay = root.querySelector("." + P + "replay");
    const live = root.querySelector("." + P + "live");
    root.classList.add("is-init");                      // the plate may show (T.css holds it until now)
    if (!body || !plate || !steps.length) return function () {};

    const timers = [], offs = [];
    let io = null, cur = 3, auto = false, t1 = 0, sawIn = false, planIn = false, waiting2 = false;
    function on(el, ev, fn) { if (el) { el.addEventListener(ev, fn); offs.push(function () { el.removeEventListener(ev, fn); }); } }
    function at(fn, t) { timers.push(setTimeout(fn, t)); }
    function stopTimers() { timers.forEach(clearTimeout); timers.length = 0; }

    /* the connector, measured in the body's own pixels (the stitched page is zoomed: divide it out) */
    function route() {
      if (!link || !lk || !tn || !tk || !sheet || !first || !saw || !planZ) return;
      const br = body.getBoundingClientRect(), W = body.offsetWidth, H = body.offsetHeight;
      if (!W || !br.width) return;
      const z = br.width / W;
      const rel = function (el) { const r = el.getBoundingClientRect(); return { l: (r.left - br.left) / z, t: (r.top - br.top) / z, r: (r.right - br.left) / z, b: (r.bottom - br.top) / z }; };
      const a = rel(tn), k = rel(tk), s = rel(sheet), f = rel(first), n = rel(saw), pz = rel(planZ);
      link.setAttribute("viewBox", "0 0 " + W + " " + H);
      let d, h;
      if (pz.t > a.b) {                                    // stacked: straight down from the count to the plan's steps
        const x = Math.round(a.l + 24) + .5, y0 = Math.round(Math.max(a.b, k.b) + 12), y1 = Math.round(pz.t - 10);
        d = "M" + x + " " + y0 + "V" + y1;
        h = "M" + (x - 4) + " " + (y1 - 4) + "L" + x + " " + y1 + "L" + (x + 4) + " " + (y1 - 4);
      } else {                                             // side by side: right, up the gap, into the first row
        const y0 = Math.round((k.t + k.b) / 2) + .5, x0 = Math.round(Math.min(k.r + 16, n.r - 4));
        const xm = Math.round((n.r + s.l) / 2) + .5, x1 = Math.round(s.l - 4);
        const y1 = Math.round((f.t + f.b) / 2) + .5;
        d = "M" + x0 + " " + y0 + "H" + xm + "V" + y1 + "H" + x1;
        h = "M" + (x1 - 4) + " " + (y1 - 4) + "L" + x1 + " " + y1 + "L" + (x1 - 4) + " " + (y1 + 4);
      }
      lk.setAttribute("d", d);
      if (lh) lh.setAttribute("d", h);
      root.classList.add("is-routed");                     // measured: the connector may be drawn (T.css)
    }

    /* state: the steps' classes on the section; the step buttons' current / done marks */
    function set(n) {
      root.classList.toggle("is-s1", n >= 1);
      root.classList.toggle("is-s2", n >= 2);
      root.classList.toggle("is-s3", n >= 3);
      cur = n;
      steps.forEach(function (b, i) {
        b.classList.toggle("is-cur", i + 1 === n);
        b.classList.toggle("is-done", i + 1 < n);
        if (i + 1 === n) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
    }
    function cold(fn) {                                    // jump without transitions
      root.classList.add("ac-cold"); fn(); void root.getBoundingClientRect(); root.classList.remove("ac-cold");
    }

    /* the reader takes over */
    const SAY = [
      "We read the calls. Four of the six buyers who said no got stuck at the security review.",
      "We add one thing. Send a one-page security answer before the review is new at the top of next quarter’s plan; the weekly checks and the buyer calls are kept.",
      "We stop one thing. Rebuild the contact list every week is stopped: 0 replies in 13 weeks."
    ];
    function takeOver() { if (auto) { auto = false; stopTimers(); waiting2 = false; } root.classList.add("is-brisk"); root.classList.remove("is-armed"); }
    function show(n, say) {
      takeOver(); set(n);
      if (say && live) live.textContent = "Step " + n + " of 3. " + SAY[n - 1];
    }
    steps.forEach(function (b) { on(b, "click", function () { show(+b.getAttribute("data-km-r11-intel-step"), true); }); });
    on(body, "focusin", function (e) {                     // keyboard focus on a step: the pass stops; its step finishes
      if (!auto || !e.target.closest || !e.target.closest("." + P + "step")) return;
      takeOver(); set(Math.max(1, cur));
    });

    route();
    const ro = ("ResizeObserver" in window) ? new ResizeObserver(function () { route(); }) : null;
    if (ro) ro.observe(body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(route);

    if (reduced) {
      return function cleanup() { offs.forEach(function (f) { f(); }); if (ro) ro.disconnect(); };
    }

    /* the pass: each step waits for the part of the plate it changes */
    function step2() { waiting2 = false; set(2); at(function () { set(3); }, 2000); at(function () { auto = false; }, 3100); }
    function tryStep2() { if (!auto || !waiting2) return; if (planIn) step2(); }
    function start1() {                                    // the log is in view: the plate fades in, then step 01
      if (!auto || t1) return;
      t1 = Date.now();
      root.classList.remove("is-armed");
      at(function () { set(1); }, 400);
      at(function () { waiting2 = true; tryStep2(); }, 400 + 2900);
    }
    function run() {
      stopTimers(); auto = true; t1 = 0; waiting2 = false;
      root.classList.remove("is-brisk");
      cold(function () { root.classList.add("is-armed"); set(0); });
      if (sawIn) start1();
    }
    if (replay) { replay.hidden = false; on(replay, "click", function () { if (live) live.textContent = ""; run(); }); }

    // visibility of the two parts (half in view, or filling the screen)
    if ("IntersectionObserver" in window && saw && planZ) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          const vh = window.innerHeight || 1;
          const ok = e.isIntersecting && (e.intersectionRatio >= 0.5 || e.intersectionRect.height >= vh * 0.6);
          if (e.target === saw) { sawIn = sawIn || ok; if (ok) start1(); }
          else { planIn = planIn || ok; if (ok) tryStep2(); }
        });
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
      io.observe(saw); io.observe(planZ);
    } else { sawIn = planIn = true; }

    if (body.contains(document.activeElement)) { set(3); }
    else { run(); if (!io) start1(); }

    return function cleanup() {
      stopTimers();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      offs.forEach(function (f) { f(); });
      root.classList.remove("is-armed", "is-brisk", "is-init", "is-routed");
      set(3);
      if (replay) replay.hidden = true;
    };
  }
};
