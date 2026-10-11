window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    var seg = Array.prototype.slice.call(root.querySelectorAll(".km-hero-A__seg button"));
    var pause = root.querySelector(".km-hero-A__pause");
    var pauseT = root.querySelector(".km-hero-A__pause-t");
    var touched = false;

    function setCrop(c) {
      root.setAttribute("data-crop", c);
      seg.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-crop") === c)); });
    }
    seg.forEach(function (b) {
      b.addEventListener("click", function () { touched = true; setCrop(b.getAttribute("data-crop")); });
    });

    // "Pause film" really pauses the film (plate drift, walker, progress hairline)
    if (pause) pause.addEventListener("click", function () {
      var p = root.classList.toggle("is-paused");
      pause.setAttribute("aria-pressed", String(p));
      if (pauseT) pauseT.textContent = p ? "Play film" : "Pause film";
    });

    if (reduced) return; // resting state: Wide, no camera move
    // Establishing shot: the film fades up on the Close crop (a hard cut, no tween),
    // then — once the statement has landed — the figure advances its state once and
    // the camera pulls back to Wide over 1.6s ease-inout, revealing the room.
    root.classList.add("is-cut");
    setCrop("close");
    void root.offsetWidth;
    requestAnimationFrame(function () { root.classList.remove("is-cut"); });
    setTimeout(function () { if (!touched) setCrop("wide"); }, 2400);
  }
};
