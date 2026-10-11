window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    var P = "km-hero-S";
    var pause = root.querySelector("." + P + "__pause");
    var time = root.querySelector("." + P + "__time");
    var run = root.querySelector("." + P + "__runrect");
    var LOOP = 32;          // the film's loop, in seconds: one ruler tick per second

    function setCrop(c) { root.setAttribute("data-crop", c); }

    // the timecode + the calibrated ruler: the elapsed run reads in --fg
    function show(sec) {
      var s = Math.floor(sec) % (LOOP + 1);
      if (time) time.textContent = "00:" + (s < 10 ? "0" : "") + s;
      if (run) run.setAttribute("width", String((sec % (LOOP + 1)) * 8 + .5));
    }

    var paused = false, elapsed = 0, last = 0, raf = 0;
    function tick(now) {
      if (!last) last = now;
      if (!paused) elapsed += (now - last) / 1000;
      last = now;
      show(elapsed);
      raf = requestAnimationFrame(tick);
    }

    // "Pause film" really pauses the film: plate drift, walker, grain and the timecode
    if (pause) pause.addEventListener("click", function () {
      paused = root.classList.toggle("is-paused");
      pause.setAttribute("aria-pressed", String(paused));
      pause.textContent = paused ? "Play film" : "Pause film";
    });

    if (reduced) return; // resting state: Wide, timecode held at its markup value, no timers

    show(0);
    raf = requestAnimationFrame(tick);

    // the establishing shot: the film fades up on the Close crop (a hard cut), then,
    // once the statement has landed, the camera pulls back to Wide over 1.6s.
    root.classList.add("is-cut");
    setCrop("close");
    void root.offsetWidth;
    requestAnimationFrame(function () { root.classList.remove("is-cut"); });
    setTimeout(function () { setCrop("wide"); }, 2400);
  }
};
