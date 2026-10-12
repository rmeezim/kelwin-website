/* capability-runs · U · GTM Intelligence — the quarter, as a 13-week ruler (geometry only).
   KM.geo() builds the ruler's static drawing; the entrance is CSS (play once). The ruler is
   drawn in a 866 × 210 viewBox (cols 1–8 at 1440); the phone gets its own 358 × 210 ruler.  */
(function () {
  function f(n) { return String(Math.round(n * 10) / 10); }
  // weeks with a win/loss interview, as deals close or die (illustrative cadence, not data)
  var WL = [3, 5, 8, 10, 11];
  function ruler(W, x0, cell, y, tickH, wlTop, rdTop) {
    var o = {}, axis = "", ticks = "", rev = "", wl = "";
    axis = "M" + f(x0) + " " + f(y + .5) + "H" + f(x0 + 13 * cell + .5);
    for (var k = 0; k <= 13; k++) { var x = Math.round(x0 + k * cell) + .5; ticks += "M" + f(x) + " " + f(y) + "V" + f(y + 6); }
    for (var w = 1; w <= 12; w++) { var cx = Math.round(x0 + (w - .5) * cell) + .5; rev += "M" + f(cx) + " " + f(y) + "V" + f(y - tickH); }
    WL.forEach(function (w) { var cx = Math.round(x0 + (w - .5) * cell + cell * .22) + .5; wl += "M" + f(cx) + " " + f(y) + "V" + f(wlTop); });
    var x13 = Math.round(x0 + 12.5 * cell) + .5;
    o.axis = axis; o.ticks = ticks; o.rev = rev; o.wl = wl;
    o.red = "M" + f(x13) + " " + f(y) + "V" + f(rdTop);
    o.next = "M" + f(x0 + 13 * cell + .5) + " " + f(y + .5) + "H" + f(W);
    return o;
  }
  function geo() {
    var B = ruler(866, 0, 62, 150.5, 14, 84, 26), S = ruler(358, 0, 25, 150.5, 10, 96, 40), o = {};
    Object.keys(B).forEach(function (k) { o[k] = { d: B[k] }; });
    Object.keys(S).forEach(function (k) { o["m" + k] = { d: S[k] }; });
    return o;
  }
  window.KM = { geo: geo, init: function () { return function () {}; } };
})();
