/* article-body · T · "The retelling" plays once when 40% of it is in view. Returns a cleanup. */
window.KM = {
  init(root, { reduced }) {
    var fig = root.querySelector(".km-article-body-T__fig");
    if (!fig) return function () {};

    /* entrance: standalone mockup → at once; stitched page → when 40% of the figure is in view */
    var io = null;
    function play() { fig.classList.add("is-in"); }
    if (reduced) play();
    else if (!root.closest(".km-slot") || !("IntersectionObserver" in window)) play();
    else {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { play(); io.disconnect(); io = null; } });
      }, { threshold: 0.4 });
      io.observe(fig);
    }

    return function () {
      if (io) io.disconnect();
      fig.classList.remove("is-in");
    };
  }
};
