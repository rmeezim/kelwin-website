// contact-coda · S — Copy the address, with a visible confirmation in words. No network call.
window.KM = {
  init(root) {
    var off = [], timers = [];
    root.querySelectorAll("[data-copy]").forEach(function (b) {
      var done = root.querySelector("[data-copied]");
      function copy() {
        var ok = function () {
          b.textContent = "Copied"; if (done) done.textContent = "Address copied";
          timers.push(window.setTimeout(function () { b.textContent = "Copy"; if (done) done.textContent = ""; }, 2400));
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.getAttribute("data-copy")).then(ok, ok);
        else ok();
      }
      b.addEventListener("click", copy);
      off.push(function () { b.removeEventListener("click", copy); });
    });
    return function () { off.forEach(function (f) { f(); }); timers.forEach(function (t) { window.clearTimeout(t); }); };
  }
};
