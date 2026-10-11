window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    // The Operating Feed. One 24s film in three 8s takes (01 Narrative Systems · 02 GTM Infrastructure ·
    // 03 GTM Intelligence). The takes, the camera moves, the playhead and the elapsed run are CSS keyed to
    // [data-take]; this clock only cuts between takes, writes the timecode, and stops when the hero is off
    // screen. No canvas, no rAF loop: a cut timer every 8s and a timecode timer once a second.
    var TAKE = 8000, N = 3;
    var chapters = Array.prototype.slice.call(root.querySelectorAll(".km-hero-T__ch"));
    var tk = root.querySelector(".km-hero-T__tk");
    var tc = root.querySelector(".km-hero-T__tc");
    var take = 0, t0 = 0, since = 0, running = false, auto = true;
    var cutTimer = 0, tickTimer = 0, demo = [];

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function loopMs() { return running ? t0 + (performance.now() - since) : t0; }
    function stamp(ms) {
      if (tc) tc.textContent = "00:00:" + pad(Math.min(23, Math.floor(ms / 1000)));
      if (tk) tk.textContent = pad(take + 1);
    }
    function show(k, restart) {
      take = k;
      if (restart) { root.removeAttribute("data-take"); void root.offsetWidth; }   // restart the take's CSS from frame 0
      root.setAttribute("data-take", String(k + 1));
      chapters.forEach(function (c, i) { c.setAttribute("aria-current", i === k ? "true" : "false"); });
    }
    function schedule() {
      clearTimeout(cutTimer); clearTimeout(tickTimer);
      if (!running) return;
      var ms = loopMs();
      var end = (Math.floor(ms / TAKE) + 1) * TAKE;
      // hard cut at the end of the take: the next take while auto-cycling, the same take once someone has chosen
      cutTimer = setTimeout(function () { cut(auto ? (take + 1) % N : take); }, Math.max(0, end - ms));
      (function tick() {
        var m = loopMs(); stamp(m);
        tickTimer = setTimeout(tick, 1000 - (m % 1000) + 12);
      })();
    }
    function cut(k) {
      root.classList.add("is-cut");
      t0 = k * TAKE; since = performance.now();
      show(k, true); stamp(t0); schedule();
    }
    function hold() {
      if (running) t0 = loopMs();
      running = false;
      root.classList.add("is-held");
      clearTimeout(cutTimer); clearTimeout(tickTimer);
    }
    function play() {
      if (running || reduced) return;
      since = performance.now(); running = true;
      root.classList.remove("is-held");
      schedule();
    }

    // chapters: click / tap seeks the film to that take; the auto-cycle stops for good ("let them skim")
    chapters.forEach(function (c, i) {
      c.addEventListener("click", function () {
        auto = false;
        demo.forEach(clearTimeout);
        if (reduced) { take = i; show(i, false); stamp(i * TAKE); return; }   // a still per chapter, no motion
        cut(i);
        if (!running) hold();
      });
    });

    show(0, !reduced); stamp(0);
    if (reduced) return;                       // poster frame of take 01, chapter 01 active, no timers

    // the orchestrated moment: once the frame has plotted, a short establishing montage 01 → 02 → 03
    // (each held long enough to read its chapter), then the takes settle into their 8s rhythm on the 24s loop
    demo.push(setTimeout(function () { if (auto && running) cut(1); }, 3600));
    demo.push(setTimeout(function () { if (auto && running) cut(2); }, 6400));

    // pause off screen (and in a background tab)
    var visible = true, shown = !document.hidden;
    function sync() { if (visible && shown) play(); else hold(); }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting; sync(); }, { threshold: 0 }).observe(root);
    }
    document.addEventListener("visibilitychange", function () { shown = !document.hidden; sync(); });
    sync();
  }
};
