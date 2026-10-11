window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    var P = "km-hero-Y";
    var seg = Array.prototype.slice.call(root.querySelectorAll("." + P + "__seg button"));
    var pause = root.querySelector("." + P + "__pause");
    var time = root.querySelector("." + P + "__time");
    var LOOP = 32;          // the film's loop, in seconds
    var touched = false;

    // Fragmented | Registered: each bay's pass of the film slides out of / into register
    function setState(s) {
      root.setAttribute("data-state", s);
      seg.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-state") === s)); });
    }
    seg.forEach(function (b) {
      b.addEventListener("click", function () { touched = true; setState(b.getAttribute("data-state")); });
    });

    // the film timecode (runs with the film, stops when it is paused)
    var paused = false, elapsed = 0, last = 0;
    function show(sec) {
      var s = Math.floor(sec) % (LOOP + 1);
      if (time) time.textContent = "00:" + (s < 10 ? "0" : "") + s;
    }
    function tick(now) {
      if (!last) last = now;
      if (!paused) elapsed += (now - last) / 1000;
      last = now;
      show(elapsed);
      requestAnimationFrame(tick);
    }

    // "Pause film" really pauses the film: every pass of the plate, the walker, the grain, the timecode
    if (pause) pause.addEventListener("click", function () {
      paused = root.classList.toggle("is-paused");
      pause.setAttribute("aria-pressed", String(paused));
      pause.textContent = paused ? "Play film" : "Pause film";
    });

    if (reduced) return; // resting state: in register, timecode held at its markup value, no timers

    show(0);
    requestAnimationFrame(tick);

    // the establishing shot: the room arrives out of register (a cold cut),
    // then each bay settles into register, left → right; the joints' marks land last.
    root.classList.add("ac-cold");
    setState("fragmented");
    void root.offsetWidth;
    requestAnimationFrame(function () { root.classList.remove("ac-cold"); });
    setTimeout(function () { if (!touched) setState("registered"); }, 700);
  }
};
