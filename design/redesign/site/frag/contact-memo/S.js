// contact-memo · S — the form's behaviour, ported from ContactChannel.tsx: topics (with the
// ?topic= / ?ref= prefill, where the visitor's own choice wins), a hint only where a topic needs
// one, a pinned reference shown as plain text and removable (it replaces the project hint), the
// deep-link scroll to #write, the mailto subject/body format (careers questions to the careers
// address, proposed), and the confirmation with a copy-address fallback.
// No network call anywhere: the message leaves only through the visitor's own mail app.

// Arrival from a deep link (/contact?topic=…&ref=…): land on the form once layout settles.
// (Production runs this in the form component's own effect; in the stitched mockup it sits at the
// top level so it runs on load, before the section's slot has played.)
(function () {
  if (!/[?&](topic|ref)=/.test(window.location.search)) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(function () {
    var w = document.getElementById("write");
    if (w) w.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, 250);
})();

window.KM = {
  init(root) {
    var form = root.querySelector("[data-memo]");
    if (!form) return function () {};
    var $ = function (s) { return form.querySelector(s); };
    var topic = $("#km-contact-memo-S-topic");
    var hint = $("[data-hint]");
    var reLine = $("[data-re]");
    var refEl = $("[data-ref]");
    var send = $("[data-send]");
    var sentIn = $("[data-sent-in]");
    var copied = $("[data-copied]");
    var timers = [], off = [];
    function on(el, ev, fn) { if (!el) return; el.addEventListener(ev, fn); off.push(function () { el.removeEventListener(ev, fn); }); }

    // the link keys production already uses (dossier, research, careers, engagement, lab), plus
    // notes (Insights) and project (the project pages)
    var LAB = "Ask for an invitation to the Lab", PROJECT = "A fixed-scope project", CAREERS = "Careers";
    var PARAM = {
      dossier: "A readout or case study",
      research: "A research document",
      notes: "Field notes",
      careers: CAREERS,
      engagement: "Exploring a future engagement",
      project: PROJECT,
      lab: LAB
    };
    // a hint only where the topic needs one (no "pick the nearest one" filler)
    var HINT = {
      "A readout or case study": "No client readout has been cleared for publication yet. We’ll send the specimen now, and the first real one when a client clears it.",
      "A research document": "The first, the Revenue Entropy Index, is due in Q4 2026. We’ll send it the day it’s out."
    };
    HINT[LAB] = "Invitations go to install clients first, then to the best fit. We reply either way.";
    HINT[PROJECT] = "Name the project, or the piece of the system you need.";
    HINT[CAREERS] = "Questions about a seat or its terms go to careers@kelwin.co (address to be confirmed).";
    var SEND = { "A readout or case study": "Ask for the document", "A research document": "Ask for the document" };
    SEND[LAB] = "Ask for an invitation";
    // where the message goes: every topic to the one address, careers questions to the careers
    // address (proposed, Q3: the founder confirms the mailbox)
    var TO = { audit: "audit@kelwin.co", careers: "careers@kelwin.co" };
    function to() { return topic.value === CAREERS ? TO.careers : TO.audit; }
    // the six launch projects by slug (a slug we don't know is shown as words)
    var PROJECTS = {
      "positioning-and-messaging": "Positioning and messaging",
      "email-deliverability": "Email deliverability",
      "icp-and-signal-map": "ICP and signal map",
      "crm-blueprint": "CRM blueprint",
      "win-loss-interviews": "Win/loss interviews",
      "operating-model": "The operating model"
    };
    var ref = "";

    var val = $("[data-val]"), line = $("[data-hintline]"), toEl = $("[data-to]"), copyBtn = $("[data-copy]");
    function refText() {
      if (!ref) return "";
      if (topic.value === PROJECT) return "Project: " + (PROJECTS[ref] || ref.replace(/[-_]+/g, " ").replace(/^./, function (c) { return c.toUpperCase(); }));
      return "Regarding: " + ref;
    }
    // one render: the value as text, the hint (a pinned project needs none: the reference says it),
    // the pinned reference, the submit's words, the address
    function render() {
      var t = topic.value;
      val.textContent = t;
      var h = (ref && t === PROJECT) ? "" : (HINT[t] || "");
      hint.textContent = h; hint.hidden = !h;
      refEl.textContent = refText();   // text only: escaped by construction
      reLine.hidden = !ref;
      line.classList.toggle("is-empty", !h && !ref);
      send.textContent = SEND[t] || "Send the message";
      toEl.textContent = to(); copyBtn.setAttribute("data-copy", to());
    }

    // prefill: the URL supplies the defaults; the visitor's own choices win from then on
    var q = new URLSearchParams(window.location.search);
    var key = q.get("topic") || "";
    if (Object.prototype.hasOwnProperty.call(PARAM, key)) topic.value = PARAM[key];
    ref = (q.get("ref") || "").trim().slice(0, 80);
    render();
    on(topic, "change", render);
    on($("[data-clear]"), "click", function () { ref = ""; render(); topic.focus(); });

    // the message grows with what's written
    var msg = $("#km-contact-memo-S-message");
    on(msg, "input", function () { msg.style.height = "auto"; msg.style.height = msg.scrollHeight + "px"; });

    // send: the mailto exactly as production builds it, then say what happened
    on(form, "submit", function (e) {
      e.preventDefault();
      var v = function (id) { return ($("#km-contact-memo-S-" + id).value || "").trim(); };
      var t = topic.value, r = refText();
      var subject = t + (r ? " — " + r.replace(/^(Project|Regarding): /, "") : "") + " — " + v("company");
      var body = [v("message"), "", "—", "Name: " + v("name"), "Company: " + v("company"), "Company email: " + v("email"), "Topic: " + t, r]
        .filter(Boolean).join("\n");
      window.location.href = "mailto:" + to() + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      sentIn.hidden = false;
    });

    // copy the address, for visitors with no mail app
    form.querySelectorAll("[data-copy]").forEach(function (b) {
      on(b, "click", function () {
        var done = function () {
          b.textContent = "Copied"; copied.textContent = "Address copied";
          timers.push(window.setTimeout(function () { b.textContent = "Copy the address"; copied.textContent = ""; }, 2400));
        };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.getAttribute("data-copy")).then(done, done);
        else done();
      });
    });

    return function () {
      timers.forEach(function (t) { window.clearTimeout(t); });
      off.forEach(function (f) { f(); });
    };
  }
};
