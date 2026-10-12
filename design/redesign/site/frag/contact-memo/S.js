// contact-memo · S — the memo's behaviour, ported from ContactChannel.tsx (kept: topics, the
// ?topic= / ?ref= prefill where the visitor's own choice wins, the escaped + capped + removable
// Regarding chip, the deep-link scroll, the mailto subject/body format) plus MailtoConfirm.
// No network call anywhere: the message leaves only through the visitor's own mail app.

// Arrival from a deep link (/contact?topic=…&ref=…): land on the memo once layout settles.
// (Production runs this in the memo component's own effect; in the stitched mockup it sits at the
// top level so it runs on load, before the memo's slot has played.)
(function () {
  if (!/[?&](topic|ref)=/.test(window.location.search)) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(function () {
    var w = document.getElementById("write");
    if (w) w.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, 250);
})();

window.KM = {
  init(root, { reduced }) {
    var form = root.querySelector("[data-memo]");
    if (!form) return function () {};
    var $ = function (s) { return form.querySelector(s); };
    var topic = $("#km-contact-memo-S-topic");
    var val = $("[data-val]");
    var hint = $("[data-hint]");
    var msg = $("#km-contact-memo-S-message");
    var msgLabel = $("[data-msg-label]");
    var send = $("[data-send]");
    var reLine = $("[data-re]");
    var refEl = $("[data-ref]");
    var sentIn = $("[data-sent-in]");
    var copied = $("[data-copied]");
    var timers = [];
    var off = [];
    function on(el, ev, fn) { el.addEventListener(ev, fn); off.push(function () { el.removeEventListener(ev, fn); }); }

    // the memo is dated with the visitor's own today
    var date = $("[data-date]");
    if (date) {
      var d = new Date();
      var mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
      date.textContent = d.getDate() + " " + mon + " " + d.getFullYear();
      date.setAttribute("datetime", d.toISOString().slice(0, 10));
    }

    // topics: the keys production keeps, plus the new `notes`; `dossier` now means a readout
    var LAB = "The Lab · early access application";
    var PARAM = {
      dossier: "Requesting a readout",
      research: "Requesting a research document",
      careers: "Careers & the bench list",
      engagement: "Exploring a future engagement",
      lab: LAB,
      notes: "Field notes & publications"
    };
    var HINT = {
      "Requesting a research document": "Research documents go out the day they’re released. Our reply will tell you where yours stands.",
      "Requesting a readout": "Client readouts publish only with the client’s consent, and none has cleared yet. Tell us what you’d want to see, and we’ll send the readout specimen."
    };
    HINT[LAB] = "Every application is read. We reply either way.";
    var CHOOSE = "Pick the nearest one. Every topic reaches the same inbox.";
    var fromLink = false;   // a topic the link chose needs no "pick the nearest one"

    // a label whose last word travels with its marker, so "· required" never wraps alone
    function label(text, word) {
      var cut = text.lastIndexOf(" ");
      var head = cut < 0 ? "" : text.slice(0, cut + 1);
      return head + '<span class="km-contact-memo-S__nw">' + text.slice(cut + 1) + ' <span class="km-contact-memo-S__req">· ' + word + "</span></span>";
    }
    function apply() {
      var t = topic.value;
      var opt = topic.options[topic.selectedIndex];
      var isDoc = t === "Requesting a research document" || t === "Requesting a readout";
      var isLab = t === LAB;
      val.textContent = (opt && opt.getAttribute("data-shown")) || (opt ? opt.textContent : t);
      hint.textContent = HINT[t] || (fromLink ? "" : CHOOSE);
      msgLabel.innerHTML = isLab ? label("Your application", "required") : isDoc ? label("Anything to add", "optional") : label("What’s on your mind", "required");
      msg.placeholder = isDoc
        ? "Optional — context for the request, or where to focus."
        : isLab
          ? "The strongest applications name the motion we’d instrument — team size, deal shape, what you’d want the console to read first."
          : "As rough as you like — bullet points are fine.";
      msg.required = !isDoc;
      send.textContent = isDoc ? "Ask for the document" : isLab ? "Submit the application" : "Send the message";
    }

    // prefill: the URL supplies the defaults; the visitor's own choices win from then on
    var q = new URLSearchParams(window.location.search);
    var key = q.get("topic") || "";
    if (Object.prototype.hasOwnProperty.call(PARAM, key)) { topic.value = PARAM[key]; fromLink = true; }
    var ref = (q.get("ref") || "").trim().slice(0, 80);
    if (ref) {
      refEl.textContent = ref;              // text only: escaped by construction
      refEl.title = ref;
      reLine.hidden = false;
      // the change bar on the sheet's edge: drawn once as the line arrives; static without motion
      reLine.classList.add("is-pinned");
      if (!reduced) reLine.classList.add("is-ink");
    }
    apply();
    on(topic, "change", function () { fromLink = false; apply(); });
    // the memo's body grows with what's written (no resize handle on the sheet)
    function grow() { msg.style.height = "auto"; msg.style.height = Math.max(msg.scrollHeight, 0) + "px"; }
    on(msg, "input", grow);
    on($("[data-clear]"), "click", function () {
      reLine.hidden = true; refEl.textContent = ""; ref = "";
      reLine.classList.remove("is-pinned", "is-ink");
      topic.focus();
    });

    // send: build the mailto exactly as production does, then say what happened (MailtoConfirm)
    on(form, "submit", function (e) {
      e.preventDefault();
      var v = function (id) { return ($("#km-contact-memo-S-" + id).value || "").trim(); };
      var t = topic.value;
      var subject = t + (ref ? " — " + ref : "") + " — " + v("company");
      var body = [v("message"), "", "—", "Name: " + v("name"), "Company: " + v("company"), "Company email: " + v("email"), "Topic: " + t, ref && "Regarding: " + ref]
        .filter(Boolean).join("\n");   // as production: .filter(Boolean)
      window.location.href = "mailto:audit@kelwin.co?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      sentIn.hidden = false;
    });

    // copy the address, for visitors with no mail app
    form.querySelectorAll("[data-copy]").forEach(function (b) {
      on(b, "click", function () {
        var done = function () {
          b.textContent = "Copied"; copied.textContent = "Address copied";
          timers.push(window.setTimeout(function () { b.textContent = "Copy"; copied.textContent = ""; }, 2400));
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
