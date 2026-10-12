/* capability-specimen · U · GTM Intelligence — a page from the Rebuild Sequence, re-scored.
   KM.geo() draws the slope lines between the two ranked columns (row pitch 76, first line's
   middle at 12, a 360-wide slope field). Rows: last quarter 1–5 on the left, this quarter 1–4 on the right. Lines that
   leave (Shipped, Cut) end mid-way on a bar; the line that enters (New) starts on one. The
   entrance is CSS (play once): the axes draw, the columns set, the lines plot, the red last.  */
(function () {
  var PITCH = 76, Y0 = 12, W = 360, MID = 150;
  function y(rank) { return Y0 + (rank - 1) * PITCH + .5; }
  function f(n) { return String(Math.round(n * 10) / 10); }
  function geo() {
    return {
      up: { d: "M0 " + f(y(4)) + "L" + W + " " + f(y(1)) },
      k2: { d: "M0 " + f(y(2)) + "H" + W },
      k3: { d: "M0 " + f(y(3)) + "H" + W },
      sh: { d: "M0 " + f(y(1)) + "H" + MID + "M" + (MID + .5) + " " + f(y(1) - 7) + "V" + f(y(1) + 7) },
      cut: { d: "M0 " + f(y(5)) + "H" + MID + "M" + (MID + .5) + " " + f(y(5) - 7) + "V" + f(y(5) + 7) },
      nw: { d: "M" + (W - MID + .5) + " " + f(y(4) - 7) + "V" + f(y(4) + 7) + "M" + (W - MID) + " " + f(y(4)) + "H" + W },
      ax: { d: "M0.5 0V" + (5 * PITCH - 30) + "M" + (W - .5) + " 0V" + (5 * PITCH - 30) }
    };
  }
  window.KM = { geo: geo, init: function () { return function () {}; } };
})();
