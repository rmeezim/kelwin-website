/* assets · X — FIG. 10 · The handover (FOLIO: deal, cross, collate).
   The markup is the final state, Handed over: six solid sheets in your tray, in three pairs.
   Installed = the six drafts fanned on Kelwin's side of the datum, 28px apart, 06 on top, so
   every tag (01–06) reads left to right; your side shows six empty places.
   Handing over spreads the fan across the datum in one row: the top sheet (06) leaves first and
   the rest follow 90ms apart, all with the same duration, so card order is preserved: the
   sheets only ever separate, never pass over one another or over a label. Each sheet's edge
   turns from dashed to solid, and its draft page resolves, exactly as it crosses the line
   (the two copies are clipped there). The title block counts the sheets across; each key
   index turns solid as its sheet crosses. Installed folds the row back (01 first, so 06
   lands last, on top).                                                                     */
(function () {
  var DX = 322.5, TY = 98;
  var FAN = [24, 52, 80, 108, 136, 164];
  var TRAY = [334, 484, 668, 818, 1002, 1152];
  var T_RUN = 1300, STAGGER = 90;

  function inout(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  window.KM = {
    init: function (root, opt) {
      if (!root) return;
      var reduced = !!(opt && opt.reduced);
      var ours = root.querySelector(".km-assets-X__ours");
      var yours = root.querySelector(".km-assets-X__yours");
      var count = root.querySelector(".km-assets-X__count");
      var tabs = root.querySelectorAll(".km-assets-X__seg button");
      var field = root.querySelector(".km-assets-X__field");
      var LABEL = {
        handed: field.getAttribute("aria-label"),
        installed: "Six dashed draft sheets, numbered 01 to 06, fanned on Kelwin's side, just left of a vertical handover line. Your side, on the right, shows six empty places, two under each capability."
      };
      var S = [];
      for (var k = 1; k <= 6; k++) {
        S.push({
          a: ours.querySelector('[data-s="' + k + '"]'),
          b: yours.querySelector('[data-s="' + k + '"]'),
          item: root.querySelector('.km-assets-X__item[data-s="' + k + '"]'),
          x: TRAY[k - 1], raf: 0, timer: 0
        });
      }
      var state = "handed", demo = 0, lastN = -1;

      function put(s, x) {
        s.x = x;
        var t = "translate(" + (Math.round(x * 10) / 10) + " " + TY + ")";
        s.a.setAttribute("transform", t);
        s.b.setAttribute("transform", t);
      }
      function tally() {
        var n = 0;
        S.forEach(function (s) {
          var across = s.x >= DX;                     // the whole sheet is on your side
          if (across) n++;
          if (s.item) s.item.classList.toggle("is-draft", !across);
        });
        if (n !== lastN) { lastN = n; count.textContent = "Yours 0" + n + "/06"; }
      }
      function stop(s) { cancelAnimationFrame(s.raf); clearTimeout(s.timer); s.raf = 0; }

      function move(s, x1) {
        stop(s);
        var x0 = s.x;
        if (Math.abs(x1 - x0) < 0.5) { put(s, x1); tally(); return; }
        var t0 = performance.now();
        function frame(now) {
          var p = Math.min(1, (now - t0) / T_RUN);
          put(s, x0 + (x1 - x0) * inout(p));
          tally();
          if (p < 1) s.raf = requestAnimationFrame(frame);
          else { s.raf = 0; put(s, x1); tally(); }
        }
        s.raf = requestAnimationFrame(frame);
      }

      function setTabs(st) {
        Array.prototype.forEach.call(tabs, function (b) { b.setAttribute("aria-selected", b.getAttribute("data-state") === st ? "true" : "false"); });
        root.setAttribute("data-state", st);
        field.setAttribute("aria-label", LABEL[st]);
      }
      function go(st, instant) {
        if (st === state) return;
        state = st; setTabs(st);
        // spread: the top sheet (06) leaves first; fold: the bottom sheet (01) returns first
        var seq = st === "handed" ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];
        seq.forEach(function (idx, n) {
          var s = S[idx], to = st === "handed" ? TRAY[idx] : FAN[idx];
          stop(s);
          if (instant) { put(s, to); return; }
          s.timer = setTimeout(function () { move(s, to); }, n * STAGGER);
        });
        tally();
      }

      Array.prototype.forEach.call(tabs, function (b) {
        b.addEventListener("click", function () { clearTimeout(demo); go(b.getAttribute("data-state"), reduced); });
      });

      if (reduced) return;                          // reduced motion: the static final state, no timers
      // demo: the plate opens on Installed (the drafts are dealt into the fan, 01 first), and at ≈2.4s the set is handed over, once
      state = "";                                   // force the snap below
      go("installed", true);
      demo = setTimeout(function () { go("handed"); }, 2400);
    }
  };
})();
