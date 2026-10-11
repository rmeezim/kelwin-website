window.KM = {
  init(root, { reduced }) {
    var plate = root.querySelector(".km-evidence-A__plate");
    var segs = Array.prototype.slice.call(root.querySelectorAll(".km-evidence-A__seg"));
    var auto = null;

    function set(state) {
      plate.setAttribute("data-state", state);
      segs.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-set") === state)); });
    }
    segs.forEach(function (b) {
      b.addEventListener("click", function () {
        if (auto) { clearTimeout(auto); auto = null; }
        set(b.getAttribute("data-set"));
      });
    });

    if (reduced) return; // final state: Diagnosis, numerals at value

    // opening state: Readings (each area in its own frame), without transitions
    plate.classList.add("is-cold");
    set("readings");
    void plate.offsetWidth;
    requestAnimationFrame(function () { requestAnimationFrame(function () { plate.classList.remove("is-cold"); }); });

    // numerals count up once (1.2s, tabular, two digits held). The ':5' of 95:5 waits for its
    // count to land, so the ratio never reads as a wrong ratio mid-count.
    var nums = root.querySelectorAll(".km-evidence-A__n");
    var ratio = root.querySelector(".km-evidence-A__cell--tr .km-evidence-A__u");
    nums.forEach(function (el) { el.textContent = "00"; });
    if (ratio) { ratio.style.opacity = "0"; ratio.style.transition = "opacity 300ms ease-out"; }
    var t0 = null, DELAY = 700, DUR = 1200;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function tick(now) {
      if (t0 === null) t0 = now;
      var t = Math.min(Math.max((now - t0 - DELAY) / DUR, 0), 1);
      nums.forEach(function (el) {
        var v = Math.round(+el.getAttribute("data-to") * ease(t));
        el.textContent = (v < 10 ? "0" : "") + v;
      });
      if (t < 1) requestAnimationFrame(tick); else if (ratio) ratio.style.opacity = "1";
    }
    requestAnimationFrame(tick);

    // the state change: the four frames become one and the four areas nest on its corner
    // (on the live site this fires once when the plate is 50% visible)
    auto = setTimeout(function () { auto = null; set("diagnosis"); }, 2400);
  }
};
