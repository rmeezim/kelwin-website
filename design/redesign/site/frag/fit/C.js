window.KM = {
  init(root, { reduced }) {
    if (reduced) return;
    // Mono values type on in drafting order (24ms per character). Final text is in the markup.
    root.querySelectorAll("[data-type]").forEach(function (el) {
      var full = el.textContent, at = +el.getAttribute("data-at") || 0, n = 0;
      el.textContent = "";
      setTimeout(function step() {
        n++;
        el.textContent = full.slice(0, n);
        if (n < full.length) setTimeout(step, 24);
      }, at);
    });
    // The fit-check readout counts the pieces as each one seats: 0/3 → 3/3.
    var seat = root.querySelector(".km-fit-C__seatv");
    if (seat) {
      seat.textContent = "0/3";
      [1640, 2040, 2440].forEach(function (t, i) { setTimeout(function () { seat.textContent = (i + 1) + "/3"; }, t); });
    }
  }
};
