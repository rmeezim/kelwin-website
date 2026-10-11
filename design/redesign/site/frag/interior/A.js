/* interior · A — "Pause film" really pauses FIG. 01 (plate drift, walker, grain, progress hairline). */
window.KM = {
  init: function (root) {
    if (!root) return;
    var btn = root.querySelector(".km-interior-A__pause");
    if (!btn) return;
    var label = btn.querySelector(".km-interior-A__pause-t");
    btn.addEventListener("click", function () {
      var paused = root.classList.toggle("is-paused");
      btn.setAttribute("aria-pressed", paused ? "true" : "false");
      if (label) label.textContent = paused ? "Play film" : "Pause film";
    });
  }
};
