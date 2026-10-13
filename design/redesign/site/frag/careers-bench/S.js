// careers-bench · S — the entry: native required-field validation (the browser names the missing
// answer, and that field's underline turns to ink), the mailto build (subject "Bench list — {name}"),
// then the confirmation with a copy-address fallback. The seat select shows its value as text.
// No network call anywhere: the entry leaves only through the visitor's own mail app.
window.KM = {
  init(root) {
    var form = root && root.querySelector("[data-bench]");
    if (!form) return function () {};
    var TO = "careers@kelwin.co";   // proposed (Q3): the founder confirms the mailbox
    var $ = function (s) { return form.querySelector(s); };
    var sentIn = $("[data-sent-in]");
    var copied = $("[data-copied]");
    var seat = $("#km-careers-bench-S-seat"), val = $("[data-val]");
    var timers = [], off = [];
    function on(el, ev, fn) { if (!el) return; el.addEventListener(ev, fn); off.push(function () { el.removeEventListener(ev, fn); }); }

    on(seat, "change", function () { val.textContent = seat.value; });
    // the long answers grow with what's written
    form.querySelectorAll("textarea").forEach(function (ta) {
      on(ta, "input", function () { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; });
    });
    // a missing answer says so on its own field
    form.querySelectorAll("[required]").forEach(function (el) {
      var f = el.closest(".ac-field");
      on(el, "invalid", function () { f && f.classList.add("is-missing"); });
      on(el, "input", function () { if (el.value.trim()) f && f.classList.remove("is-missing"); });
    });

    on(form, "submit", function (e) {
      e.preventDefault();
      var v = function (id) { return ($("#km-careers-bench-S-" + id).value || "").trim(); };
      var subject = "Bench list — " + v("name");
      var body = [
        "The part of a revenue system I’d own, and why that one:", v("own"), "",
        "Something I’ve made:", v("made"), "",
        "—", "Name: " + v("name"), "Current role and company: " + v("role"), "Seat: " + v("seat")
      ].join("\n");
      window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
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
