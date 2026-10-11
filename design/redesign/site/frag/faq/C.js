window.KM = {
  init: function (root, opts) {
    // Every value below is taken from the FAQ's own copy; nothing is invented.
    var Q = [
      { topic: "Agency vs system",
        a: "An agency rents you activity — campaigns, sequences, SDR hours — and the results stop the day the contract does. Kelwin installs infrastructure your team owns: the narrative system, the channel orchestration and the intelligence layer stay with you, documented in your language and living in your stack.",
        ref: ["Sheet 04/14 · The stack", "#stack"],
        spec: [["Agency", ["Rents activity"]], ["Ends", ["With the contract"]], ["Kelwin", ["Infrastructure you own"], 1], ["Stays", ["Narrative", "Orchestration", "Intelligence"]]] },
      { topic: "The System Audit",
        a: "A fixed-scope diagnostic that runs ten working days. We map how demand actually moves through your narrative, channels and data, and name the constraint that’s actually holding revenue — rarely the thing you’ve been told to fix. The readout is yours to keep, whether or not we ever work together.",
        ref: ["Sheet 08/14 · Method — PH.01 Diagnose", "#method"],
        spec: [["Format", ["Fixed-scope diagnostic"]], ["Duration", ["10", "WD"]], ["Maps", ["Narrative", "Channels", "Data"]], ["Readout", ["Yours to keep"], 1]] },
      { topic: "Install length",
        a: "The audit readout sets the scope, so we don’t quote a number before it. What’s fixed is the shape: Diagnose, Architect and Install run once, in order, and Calibrate becomes a standing cadence — because a revenue system drifts the moment the market moves.",
        ref: ["Sheet 08/14 · Method — PH.01–04", "#method"],
        spec: [["Scope", ["Set by the readout"]], ["Runs once", ["Diagnose", "Architect", "Install"]], ["Standing", ["Calibrate ↺"], 1], ["Quote", ["Not before the audit"]]] },
      { topic: "Your team",
        a: "We work through it. The system is installed into how your company already runs — the motions, the words your people use, the way deals actually get decided. Everything is documented, so the motion survives team changes instead of living in one person’s head.",
        ref: ["Sheet 08/14 · Method — PH.03 Install", "#method"],
        spec: [["Mode", ["Through your team"], 1], ["Into", ["Motions", "Language", "Deal decisions"]], ["Record", ["Fully documented"]], ["Survives", ["Team changes"]]] },
      { topic: "Handover",
        a: "The system stays. Six transferable assets — from the Narrative OS to the rebuild sequence — are yours outright, with zero deprecation designed in. If it stops working the day we leave, we built it wrong.",
        ref: ["Sheet 10/14 · What you own", "#assets"],
        spec: [["Assets", ["6", "Transferable"]], ["Ownership", ["Outright"], 1], ["Deprecation", ["Zero, by design"]], ["Test", ["Works after we leave"]]] },
      { topic: "Fit",
        a: "You’re likely a fit if you’re past first revenue, your GTM is founder-led or lean, and your deals are decided by committees rather than checkouts. If that’s not you — pre-revenue, pure PLG, or shopping for a lead list — the audit will say so plainly. Qualifying in both directions is the point.",
        ref: ["Sheet 09/14 · Fit", "#fit"],
        spec: [["Fit", ["Past first revenue", "Founder-led or lean", "Committee deals"], 1], ["Not fit", ["Pre-revenue", "Pure PLG", "Lead-list buyers"]], ["Verdict", ["Stated plainly"]], ["Qualifies", ["Both directions"]]] }
    ];
    var $ = function (s) { return root.querySelector(s); };
    var $$ = function (s) { return [].slice.call(root.querySelectorAll(s)); };
    var tabs = $$(".km-faq-C__qc"), legend = $$(".km-faq-C__legend span");
    var rid = $(".km-faq-C__rid"), sid = $(".km-faq-C__sid");
    var resp = $(".km-faq-C__resp"), topic = $(".km-faq-C__topic"), ans = $(".km-faq-C__ans");
    var spec = $(".km-faq-C__spec");
    var refA = $(".km-faq-C__act--ref"), ref = $(".km-faq-C__ref");
    var timers = [], typing = [];
    var pad = function (n) { return "Q-0" + (n + 1); };

    function typeOn(el, text, delay) {
      el.textContent = "";
      for (var i = 1; i <= text.length; i++) {
        (function (j) { typing.push(setTimeout(function () { el.textContent = text.slice(0, j); }, (delay || 0) + j * 24)); })(i);
      }
    }
    function buildSpec(rows, animate) {
      spec.innerHTML = "";
      rows.forEach(function (r, ri) {
        var row = document.createElement("div");
        row.className = "km-faq-C__sr" + (r[2] ? " is-on" : "");
        var dt = document.createElement("dt"); dt.textContent = r[0];
        var dd = document.createElement("dd");
        r[1].forEach(function (v, vi) {
          var c = document.createElement("span"); c.className = "km-faq-C__chip";
          dd.appendChild(c);
          if (animate) typeOn(c, v, 120 + ri * 90 + vi * 40); else c.textContent = v;
        });
        row.appendChild(dt); row.appendChild(dd); spec.appendChild(row);
      });
    }
    function set(k, animate) {
      root.style.setProperty("--q", String(k));
      root.setAttribute("data-q", String(k));
      tabs.forEach(function (t, j) { var on = j === k; t.classList.toggle("is-on", on); t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
      legend.forEach(function (s, j) { s.classList.toggle("is-on", j === k); });
      var d = Q[k];
      sid.textContent = "Spec — " + pad(k);
      refA.setAttribute("href", d.ref[1]);
      if (animate) {
        typing.forEach(clearTimeout); typing = [];
        typeOn(rid, pad(k) + " · Response", 0);
        typeOn(topic, d.topic, 160);
        resp.classList.add("is-swap");
        timers.push(setTimeout(function () { ans.textContent = d.a; resp.classList.remove("is-swap"); }, 240));
        buildSpec(d.spec, true);
        typeOn(ref, d.ref[0] + " →", 260);
      } else {
        rid.textContent = pad(k) + " · Response"; topic.textContent = d.topic; ref.textContent = d.ref[0] + " →"; ans.textContent = d.a; buildSpec(d.spec, false);
      }
    }
    function stop() { timers.forEach(clearTimeout); timers = []; }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { stop(); root.classList.remove("is-idle"); set(+t.getAttribute("data-k"), true); });
      // vertical tablist: ↑/↓ move the selection, the leader follows
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
        if (!d) return;
        e.preventDefault(); stop(); root.classList.remove("is-idle");
        var n = (+t.getAttribute("data-k") + d + tabs.length) % tabs.length;
        set(n, true); tabs[n].focus();
      });
    });
    if (opts && opts.reduced) return;

    // Demo (click-driven on the live site): the sheet drafts with nothing selected,
    // Q-01 inverts and the red leader draws up to its response, then at 2.6s the
    // selection steps to Q-02 — the leader re-routes and the spec types on.
    root.classList.add("is-idle");
    tabs[0].classList.remove("is-on");
    legend[0].classList.remove("is-on");
    timers.push(setTimeout(function () { set(0, true); }, 1050));
    timers.push(setTimeout(function () { root.classList.remove("is-idle"); }, 1250));
    timers.push(setTimeout(function () { set(1, true); }, 2600));
  }
};
