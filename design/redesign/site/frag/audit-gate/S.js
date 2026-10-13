/* audit-gate · S — the three-question gate (#qualify).
   Logic as today's QualifyFlow (src/components/sections/QualifyFlow.tsx): three steps; Q01
   "Pre-revenue" and Q02 "Pure self-serve / PLG" decline with their own reason; Q03 is diagnostic
   only; qualified → "Book the strategic call", a mailto to audit@kelwin.co with today's subject and
   body format, unchanged. Back on steps 2–3; Change last answer (declined, qualified); Restart
   (declined). New in round 8 (STORY-INTERIOR §4.4): focus moves to each new screen's heading; an
   aria-live region announces the step and the result; answers persist in the URL hash
   (#qualify:b,a,b — one letter per answer, and the same answers in history.state) so refresh and
   Back keep progress, while a bare #qualify link (the nav's 'Audit request', the facts' 'Three
   questions', the FAQ's red) only brings you to the gate and never clears your answers (its entry
   carries them in its state, so a refresh there keeps them too); the request
   on the right fills in as you answer; the screens' height eases between steps instead of jumping;
   a decline closes the request (only the answers given stay) and hides the under-note, whose door
   the declined screen already offers; the booking click shows the MailtoConfirm state with Copy.
   Round 9: the request on the right is the mail itself (To, Subject, one line per answer under a
   short key — Revenue, Deals, Feels like — and Times once complete); it is empty until the first
   answer, shows only the lines answered, and below 1024 shows on the qualified screen only. The
   mail body carries the same short keys, so the page shows exactly what the mail will say. The
   qualified screen names the first layer in a sentence, and the answer rows carry no letters.
   MOCKUP ONLY: with no answers in the hash, the gate demos its own flow once (B → A → B, ending
   qualified, ≈6s); the first click or key inside the gate stops the demo and hands it over. */

// a review link such as page-audit.html#qualify:a (declined) lands on the gate
(function () {
  if (/^#qualify:/.test(location.hash)) {
    addEventListener("load", function () {
      setTimeout(function () { var el = document.getElementById("qualify"); if (el) el.scrollIntoView(); }, 300);
    });
  }
})();

window.KM = {
  init(root, { reduced }) {
    var Q = ["Where is revenue today?", "How do your deals close?", "What does it feel like from inside?"];
    var KEY = ["Revenue", "Deals", "Feels like"];   // the mail's short keys (the page shows the same lines)
    var COUNT = [3, 3, 4];
    var DECLINES = {
      "0:0": "There’s no working motion to instrument yet. The audit reads a live system — it can’t read one that hasn’t started. When the first revenue is real, come straight back.",
      "1:2": "The system we install assumes a sales-carried deal — narrative argued in rooms, signal routed to humans. Pure self-serve deserves different machinery than ours.",
    };
    // Q03 → where the audit looks first (a starting point; it still reads all three)
    var FIRST = [
      { name: "GTM Infrastructure", href: "/capabilities/gtm-infrastructure" },
      { name: "Narrative Systems", href: "/capabilities/narrative-systems" },
      { name: "Narrative Systems", href: "/capabilities/narrative-systems" },
      null,
    ];
    var L = "abcd";

    var $ = function (s) { return root.querySelector(s); };
    var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
    var screens = {};
    $$("[data-screen]").forEach(function (el) { screens[el.getAttribute("data-screen")] = el; });
    var prog = $('[data-gate="prog"]'), run = $('[data-gate="run"]'), ticks = $$('[data-gate="tick"]');
    var rows = $$('[data-gate="row"]'), reason = $('[data-gate="reason"]'), layer = $('[data-gate="layer"]');
    var book = $('[data-gate="book"]'), note = $('[data-gate="note"]'), sent = $('[data-gate="sent"]');
    var copy = $('[data-gate="copy"]'), live = $('[data-gate="live"]'), foot = $('[data-gate="foot"]');
    var req = $('[data-gate="req"]'), times = $('[data-gate="times"]');
    var box = $(".km-audit-gate-S__screens");

    var answers = [], current = null, off = [], timers = [], fitT = null;
    function on(el, ev, fn) { if (!el) return; el.addEventListener(ev, fn); off.push(function () { el.removeEventListener(ev, fn); }); }

    function labelOf(step, opt) {
      var el = root.querySelector('[data-step="' + step + '"][data-opt="' + opt + '"] .km-audit-gate-S__label');
      return el ? el.textContent : "";
    }
    function declineOf(a) { var i = a.length - 1; return i >= 0 ? DECLINES[i + ":" + a[i]] || null : null; }
    function screenOf(a) { return declineOf(a) ? "declined" : a.length >= 3 ? "qualified" : String(a.length); }

    // the booking request: today's subject, and the body as the page shows it — one line per answer
    // under its short key, then the times (round 9: short keys instead of the questions repeated)
    function mailto(a) {
      var subject = "Audit qualification — booking the strategic call";
      var body = KEY.map(function (k, i) { return k + ": " + (a[i] != null ? labelOf(i, a[i]) : "—"); })
        .concat(["", "Times:", ""]).join("\n");
      return "mailto:audit@kelwin.co?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    }

    // the screens ease to their new height (no jump below), then release it to auto
    function fit(prevH) {
      clearTimeout(fitT);
      box.classList.remove("is-sizing");
      box.style.height = "";
      if (prevH == null) return;
      var next = box.getBoundingClientRect().height;
      if (Math.abs(next - prevH) < 2) return;
      box.style.height = prevH + "px";
      void box.offsetHeight;
      box.classList.add("is-sizing");
      box.style.height = next + "px";
      fitT = setTimeout(function () { box.classList.remove("is-sizing"); box.style.height = ""; }, 380);
    }

    function render(a, o) {
      o = o || {};
      var sc = screenOf(a);
      var prevH = o.animate ? box.getBoundingClientRect().height : null;
      Object.keys(screens).forEach(function (k) {
        screens[k].hidden = k !== sc;
        screens[k].classList.remove("is-enter");
      });
      if (o.animate && sc !== current) { void screens[sc].offsetWidth; screens[sc].classList.add("is-enter"); }
      fit(prevH);
      root.classList.toggle("is-closed", sc === "declined");

      // progress: words + the three-tick ruler (tick n lit = question n reached)
      var reached = sc === "qualified" ? 3 : sc === "declined" ? a.length : a.length + 1;
      prog.textContent = sc === "qualified" ? "All three answered"
        : sc === "declined" ? "Closed at question " + a.length + " of 3"
        : "Question " + (a.length + 1) + " of 3";
      run.style.setProperty("--p", String((reached - 1) / 2));
      ticks.forEach(function (t, i) { t.classList.toggle("is-on", i < reached); });

      // the request, written as you answer: only the lines answered; empty before the first answer
      root.classList.toggle("is-qualified", sc === "qualified");
      req.classList.toggle("is-blank", !a.length);
      rows.forEach(function (row, i) {
        var ans = row.querySelector('[data-gate="ans"]');
        var v = a[i] != null ? labelOf(i, a[i]) : "";
        var had = ans.textContent;
        ans.textContent = v;
        row.hidden = !v;
        row.classList.remove("is-new");
        if (v && o.animate && v !== had) { void row.offsetWidth; row.classList.add("is-new"); }
        row.classList.toggle("is-declined", sc === "declined" && i === a.length - 1);
      });
      times.hidden = sc !== "qualified";

      if (sc === "declined") reason.textContent = declineOf(a);
      foot.textContent = sc === "declined" ? "Closed here. Nothing was sent." : "Nothing is sent until you press send.";
      if (sc === "qualified") {
        book.setAttribute("href", mailto(a));
        var f = FIRST[a[2]];
        layer.innerHTML = f ? 'The audit looks first at <a class="ac-go ac-go--to" href="' + f.href + '">' + f.name + "</a>"
          : "The audit looks at all three layers.";
        note.hidden = false; sent.hidden = true;
      }
      if (o.announce) {
        live.textContent = sc === "qualified" ? "Qualified. Let’s find a time."
          : sc === "declined" ? "Not a fit yet. " + declineOf(a)
          : "Question " + (a.length + 1) + " of 3. " + Q[a.length];
      }
      if (o.focus) { var h = screens[sc].querySelector(".km-audit-gate-S__q"); if (h) h.focus({ preventScroll: true }); }
      current = sc;
    }

    function hashOf(a) { return a.length ? "#qualify:" + a.map(function (i) { return L[i]; }).join(",") : "#qualify"; }
    // a valid answer list, or null (out-of-range answers, or anything after a decline)
    function valid(a) {
      if (!Array.isArray(a) || a.length > 3) return null;
      for (var i = 0; i < a.length; i++) {
        if (!(a[i] >= 0 && a[i] < COUNT[i] && a[i] === Math.floor(a[i]))) return null;
        if (i < a.length - 1 && DECLINES[i + ":" + a[i]]) return null;   // nothing follows a decline
      }
      return a.slice();
    }
    function parse(h) {
      var m = /^#qualify:([a-d](?:,[a-d]){0,2})$/.exec(h || "");
      return m ? valid(m[1].split(",").map(function (c) { return L.indexOf(c); })) : null;
    }
    // the answers also ride in history.state, so Back can tell our own entries from a #qualify link
    function stateWith(a) { var s = {}, h = history.state; if (h && typeof h === "object") for (var k in h) s[k] = h[k]; s.kmGate = a; return s; }
    function same(a, b) { return a.length === b.length && a.every(function (v, i) { return v === b[i]; }); }
    function commit(a, o) {
      answers = a;
      if (o.push) { try { history.pushState(stateWith(a), "", hashOf(a)); } catch (e) {} }
      render(a, o);
    }

    // the demo (mockup only) — stopped by the first real interaction
    function stopDemo() {
      timers.forEach(clearTimeout); timers = [];
      $$(".km-audit-gate-S__opt.is-hover").forEach(function (b) { b.classList.remove("is-hover"); });
    }
    function hover(step, opt) {
      $$(".km-audit-gate-S__opt.is-hover").forEach(function (b) { b.classList.remove("is-hover"); });
      var b = root.querySelector('[data-step="' + step + '"][data-opt="' + opt + '"]');
      if (b) b.classList.add("is-hover");
    }

    var user = { animate: !reduced, focus: true, announce: true, push: true };
    $$(".km-audit-gate-S__opt").forEach(function (b) {
      on(b, "click", function () {
        stopDemo();
        var s = +b.getAttribute("data-step"), o = +b.getAttribute("data-opt");
        commit(answers.slice(0, s).concat(o), user);
      });
    });
    $$('[data-gate="back"]').forEach(function (b) { on(b, "click", function () { stopDemo(); commit(answers.slice(0, -1), user); }); });
    $$('[data-gate="restart"]').forEach(function (b) { on(b, "click", function () { stopDemo(); commit([], user); }); });
    on(book, "click", function () {
      note.hidden = true; sent.hidden = false;
      live.textContent = "Your mail app should have opened with the request ready. Nothing is sent until you press send.";
    });
    on(copy, "click", function () {
      var done = function () { copy.textContent = "Address copied"; };
      try { navigator.clipboard.writeText("audit@kelwin.co").then(done, function () {}); } catch (e) {}
    });
    on(root, "pointerdown", stopDemo);
    on(root, "keydown", stopDemo);
    on(window, "popstate", function () {
      var s = history.state && history.state.kmGate;
      var a = s ? valid(s) : parse(location.hash);
      if (!a) {
        // a bare #qualify link (or any other hash): it only brings you to the gate. Answers stay, and
        // the new entry carries them in its state (URL untouched, so the browser's own scroll memory
        // and a second click on the same link behave as usual): refresh keeps them too. Only Restart clears.
        if (answers.length) { try { history.replaceState(stateWith(answers), ""); } catch (e) {} }
        return;
      }
      if (same(a, answers)) return;
      stopDemo();
      answers = a;
      render(answers, { animate: !reduced, announce: true, focus: true });   // Back / Forward: focus the restored screen's heading
    });

    var start = parse(location.hash);
    if (!start && history.state && history.state.kmGate) start = valid(history.state.kmGate);   // a refresh on a bare #qualify entry
    answers = start || [];
    try { history.replaceState(stateWith(answers), ""); } catch (e) {}
    render(answers, {});

    // the demo plays only in the standalone mockup: a stitched page (html.km-home) stays on its
    // first question, so its settled state is the same with motion and without (coherence pass)
    if (!reduced && !answers.length && !document.documentElement.classList.contains("km-home")) {
      var seq = [[1500, function () { hover(0, 1); }], [2200, function () { commit([1], { animate: true }); }],
                 [3100, function () { hover(1, 0); }], [3800, function () { commit([1, 0], { animate: true }); }],
                 [4700, function () { hover(2, 1); }], [5400, function () { commit([1, 0, 1], { animate: true }); }],
                 [5420, function () { stopDemo(); }]];
      seq.forEach(function (s) { timers.push(setTimeout(s[1], s[0])); });
    }

    return function () {
      stopDemo();
      clearTimeout(fitT);
      box.classList.remove("is-sizing"); box.style.height = "";
      root.classList.remove("is-closed");
      off.forEach(function (f) { f(); });
    };
  },
};
