window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    // The film is ambient: a 40s lateral dolly (ping-pong), the walker and the grain.
    // Under reduced motion base.css stops all of it and the band rests on a still frame,
    // so there is nothing to start and no timer to run.
    if (reduced) return;
    // Pause the loop whenever the band is off screen; resume when it returns.
    var film = root.querySelector(".km-film") || root;
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { root.classList.toggle("is-off", !e.isIntersecting); });
    }, { threshold: 0 });
    io.observe(film);
  }
};
