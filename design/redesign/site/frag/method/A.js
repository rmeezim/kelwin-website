window.KM = {
  init: function (root, opts) {
    var items = [].slice.call(root.querySelectorAll("[data-k]"));
    var segs = [].slice.call(root.querySelectorAll(".km-method-A__seg"));
    var timers = [];

    function set(a) {
      root.setAttribute("data-active", String(a));
      items.forEach(function (el) {
        var k = +el.getAttribute("data-k");
        if (el.classList.contains("km-method-A__seg")) {
          el.setAttribute("aria-selected", String(k === a));
          el.tabIndex = k === a ? 0 : -1;
          return;
        }
        el.classList.toggle("is-done", k < a);
        el.classList.toggle("is-active", k === a);
        el.classList.toggle("is-todo", k > a);
      });
    }
    function stop() { timers.forEach(clearTimeout); timers = []; root.classList.remove("is-landing"); }
    segs.forEach(function (s) {
      s.addEventListener("click", function () { stop(); set(+s.getAttribute("data-k")); });
    });
    if (opts && opts.reduced) return;

    // Demo of the live behaviour (scroll-stepped on the site): the plate opens
    // unbuilt, the steps rise, red lands on Diagnose, then the control walks
    // the climb one phase at a time and comes to rest on Calibrate.
    root.classList.add("is-cold");
    set(-1);
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("is-cold"); }); });
    timers.push(setTimeout(function () { root.classList.add("is-landing"); set(0); }, 1750));
    timers.push(setTimeout(function () { root.classList.remove("is-landing"); set(1); }, 2900));
    timers.push(setTimeout(function () { set(2); }, 4000));
    timers.push(setTimeout(function () { set(3); }, 5100));
  }
};
