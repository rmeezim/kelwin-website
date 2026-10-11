window.KM = {
  init: function (root, opts) {
    var PH = [
      { n: "[01]", name: "Diagnose", tag: "Diagnose · WD 01–10",
        m: "We start by finding what’s actually broken. It’s rarely the thing you’ve been told to fix — most teams are optimising a symptom downstream of the real constraint.",
        o: "The real constraint, named — and the case for fixing it first." },
      { n: "[02]", name: "Architect", tag: "Architect · T+1–2",
        m: "Then we design the system that decides what you build and what you ignore — the category you’ll own, the language you’ll use, the model the company runs on.",
        o: "Your category defined, and the operating model written down." },
      { n: "[03]", name: "Install", tag: "Install · T+3–4",
        m: "Architecture that lives in a slide changes nothing. We wire the system into how the company runs — the motions, the words people use, how a deal gets decided on a Tuesday.",
        o: "A working operating layer, in use across the team." },
      { n: "[04]", name: "Calibrate", tag: "Calibrate · Continuous ↺",
        m: "A revenue system drifts the moment the market moves. So we stay on the signal — watching what’s working, retuning what slips, keeping your language ahead of the category.",
        o: "A standing signal review, and a system that keeps compounding." }
    ];
    var $ = function (s) { return root.querySelector(s); };
    var $$ = function (s) { return [].slice.call(root.querySelectorAll(s)); };
    var tabs = $$(".km-method-C__tab");
    var spec = $(".km-method-C__spec");
    var nameEl = $(".km-method-C__specname"), numEl = $(".km-method-C__specn");
    var vm = $(".km-method-C__vm"), vo = $(".km-method-C__vo");
    var timers = [], typing = [];
    var labels = $$(".km-method-C__lbl");

    // Labels are authored right-aligned to their bar's end tick. Pin each one
    // to its measured left edge so typed text grows rightward toward the tick.
    function pinLabels() {
      var on = labels.filter(function (l) { return l.classList.contains("is-on"); });
      on.forEach(function (l) { l.classList.remove("is-on"); });
      labels.forEach(function (l) { l.style.left = l.offsetLeft + "px"; l.style.right = "auto"; });
      on.forEach(function (l) { l.classList.add("is-on"); });
    }

    // mono values type on at 24ms per character
    function typeOn(el, text) {
      el.textContent = "";
      for (var i = 1; i <= text.length; i++) {
        (function (j) { typing.push(setTimeout(function () { el.textContent = text.slice(0, j); }, j * 24)); })(i);
      }
    }
    function set(a, animate) {
      root.setAttribute("data-active", String(a));
      tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(j === a)); t.tabIndex = j === a ? 0 : -1; });
      $$(".km-method-C__rh, .km-method-C__lbl, .km-method-C__ticker span").forEach(function (el) {
        el.classList.toggle("is-on", +el.getAttribute("data-k") === a);
      });
      var p = PH[a];
      numEl.textContent = p.n;
      if (animate) {
        typing.forEach(clearTimeout); typing = [];
        labels.forEach(function (l, j) { l.textContent = PH[j].tag; });
        typeOn(labels[a], p.tag);
        typeOn(nameEl, p.name);
        spec.classList.add("is-swap");
        timers.push(setTimeout(function () { vm.textContent = p.m; vo.textContent = p.o; spec.classList.remove("is-swap"); }, 240));
      } else {
        nameEl.textContent = p.name; vm.textContent = p.m; vo.textContent = p.o;
      }
    }
    function stop() { timers.forEach(clearTimeout); timers = []; }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { stop(); set(+t.getAttribute("data-k"), true); });
    });
    if (opts && opts.reduced) return;
    pinLabels();

    // Demo of the scroll-linked tabs: the sheet plots, the red plane drops into
    // PH.01, then the tabs step [01] → [04] and the plane slides to each bar.
    root.classList.add("is-cold");
    set(0, false);
    // hold the inverted [01] tab until its cell edges have drawn
    tabs.forEach(function (t) { t.setAttribute("aria-selected", "false"); });
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("is-cold"); }); });
    timers.push(setTimeout(function () { tabs[0].setAttribute("aria-selected", "true"); tabs[0].tabIndex = 0; }, 700));
    timers.push(setTimeout(function () { set(1, true); }, 3300));
    timers.push(setTimeout(function () { set(2, true); }, 4500));
    timers.push(setTimeout(function () { set(3, true); }, 5700));
  }
};
