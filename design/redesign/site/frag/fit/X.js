window.KM = {
  init(root, { reduced }) {
    var timers = [];
    var raf = 0;

    // ── ledgers: one open row per ledger; clicking the open row closes it ──
    function setRow(row, on) {
      row.classList.toggle("is-open", on);
      row.querySelector(".ac-row__head").setAttribute("aria-expanded", String(on));
      row.querySelector(".ac-row__more").inert = !on;
    }
    Array.prototype.forEach.call(root.querySelectorAll(".km-fit-X__lg"), function (lg) {
      var rows = Array.prototype.slice.call(lg.querySelectorAll(".ac-row"));
      rows.forEach(function (r) {
        r.querySelector(".ac-row__head").addEventListener("click", function () {
          timers.forEach(clearTimeout);                       // the reader drives from the first click
          var was = r.classList.contains("is-open");
          rows.forEach(function (o) { setRow(o, false); });
          if (!was) setRow(r, true);
        });
      });
    });

    if (reduced) return;                                      // final markup: F-02 + D-02 open, no packet, no timers

    // ── demo: Built for rests with F-02 open; the Not-for ledger lands closed and opens its
    //    mirrored pair D-02 (ownership: own the system ↔ rent a list) once both are drawn ──
    var no = root.querySelector(".km-fit-X__set--no .ac-row.is-open");
    if (no) {
      root.classList.add("ac-cold");
      setRow(no, false);
      void root.offsetHeight;
      requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("ac-cold"); }); });
      timers.push(setTimeout(function () { setRow(no, true); }, 3000));
    }

    // ── ambient (the section's one loop): a 6px packet runs 01 → gate → fork → Built for at constant
    //    speed (2.6s), arrives at the latched Built-for node and rests (5.4s), then runs again. 8s lap. ──
    var fork = root.querySelector(".km-fit-X__fork");
    var pk = root.querySelector(".km-fit-X__pk");
    var stops = [".km-fit-X__n--01", ".km-fit-X__n--fork", ".km-fit-X__n--yes"].map(function (s) { return root.querySelector(s); });
    if (!fork || !pk || stops.some(function (n) { return !n; })) return;

    var LAP = 8000, RUN = 2600, FADE = 320;
    function points() {
      var f = fork.getBoundingClientRect();
      return stops.map(function (n) {
        var r = n.getBoundingClientRect();
        return [r.left + r.width / 2 - f.left, r.top + r.height / 2 - f.top];
      });
    }
    var t0 = 0;
    function frame(now) {
      if (!t0) t0 = now;
      var t = (now - t0) % LAP;
      var p = points();
      var l1 = Math.abs(p[1][0] - p[0][0]), l2 = Math.abs(p[2][1] - p[1][1]);
      var d = Math.min(t / RUN, 1) * (l1 + l2);
      var x, y;
      if (d <= l1) { x = p[0][0] + d; y = p[0][1]; }
      else { x = p[1][0]; y = p[1][1] - (d - l1); }
      var o = t < FADE ? t / FADE : t > RUN ? Math.max(0, 1 - (t - RUN) / FADE) : 1;
      pk.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      pk.style.opacity = String(o);
      raf = requestAnimationFrame(frame);
    }
    timers.push(setTimeout(function () { raf = requestAnimationFrame(frame); }, 1900));   // follows the fork as it completes
  }
};
