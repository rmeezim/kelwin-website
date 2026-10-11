window.KM = {
  init(root, opts) {
    if (!root) return;
    // Reduced motion: no .is-play, and base.css stops every film loop, so the page rests on the
    // final frame — the wide room, frosted, with the scope clear. No timers, no observers.
    if (opts && opts.reduced) return;
    var film = root.querySelector(".km-film");
    if (!film || typeof film.getAnimations !== "function") return;

    // The film's loops: both plates' drift, both walkers, the grain. (Entrances are finite.)
    var loops = film.getAnimations({ subtree: true }).filter(function (a) {
      var t = a.effect && a.effect.getTiming ? a.effect.getTiming() : null;
      return t && t.iterations === Infinity;
    });
    function named(n) { return loops.filter(function (a) { return a.animationName === n; }); }

    // Pin registration: the room and the scope's glass run on one clock, to the frame.
    var drift = named("km-film-drift");
    if (drift.length > 1) { var t = drift[0].currentTime; drift.forEach(function (a) { a.currentTime = t; }); }
    // The figure's first pass starts with the act, so it reaches the scope just after the focus pull.
    named("km-hero-V-walk").forEach(function (a) { a.currentTime = 0; });

    // Off screen, the film holds still (one decode, no work); back on screen, it carries on.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        var on = es[es.length - 1].isIntersecting;
        loops.forEach(function (a) { if (on) a.play(); else a.pause(); });
      }, { threshold: 0 }).observe(root);
    }
  }
};
