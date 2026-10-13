/* reports-publishing · S — the case-study request writes a mail, it stores nothing (no CRM).
   With script: on a valid submit it opens the visitor's mail app with the subject and a short
   body filled in, then says so in the status line. Without script: the form's own mailto action
   does the same with the field in the body. */
window.KM = {
  init(root) {
    var form = root.querySelector(".km-reports-publishing-S__form");
    if (!form) return function () {};
    var done = root.querySelector(".km-reports-publishing-S__done");
    function send(e) {
      if (!form.checkValidity()) return;   /* the browser shows its own message on the field */
      e.preventDefault();
      var mail = String(form.elements.email.value || "").trim().slice(0, 200);
      var subject = "Case study request";
      var body = "Please send me the first Kelwin case study when a client clears one for publication.\n\nMy work email: " + mail + "\n";
      window.location.href = "mailto:audit@kelwin.co?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (done) done.textContent = "Your mail app should now have the request ready to send.";
    }
    form.addEventListener("submit", send);
    return function () { form.removeEventListener("submit", send); };
  }
};
