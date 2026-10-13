/* article-body · S · the answers: the rows rise once at 40% visible; each question has its own
   two answers (data-v="fail" is the one that points to a failure). An answer that points to a
   failure fills its row's bar and names the layer in the margin. The margin says nothing until
   there is something to say: a flagged layer, or "None of the three." once all three are
   answered without one. A second press clears an answer. Nothing is stored or sent: the answers
   live in this page's DOM only. Returns a cleanup. */
window.KM = {
  init(root, { reduced }) {
    var fig = root.querySelector(".km-article-body-S__fig");
    if (!fig) return function () {};
    var off = [];

    /* entrance: standalone mockup → at once; stitched page → when 40% of the figure is in view */
    var io = null;
    function play() { fig.classList.add("is-in"); }
    if (reduced) play();
    else if (!root.closest(".km-slot") || !("IntersectionObserver" in window)) play();
    else {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { play(); io.disconnect(); io = null; } });
      }, { threshold: 0.4 });
      io.observe(fig);
    }

    var names = ["Narrative Systems", "GTM Infrastructure", "GTM Intelligence"];
    var causes = Array.prototype.slice.call(fig.querySelectorAll(".km-article-body-S__cause"));
    var out = fig.querySelector(".km-article-body-S__result");
    var answers = [null, null, null];

    function line(text, sep) {
      var s = document.createElement("span");
      if (sep) { var h = document.createElement("span"); h.className = "ac-sr"; h.textContent = sep; s.appendChild(h); }
      s.appendChild(document.createTextNode(text));
      return s;
    }
    function render() {
      var lit = [];
      causes.forEach(function (c, i) {
        var on = answers[i] === "fail";
        c.classList.toggle("is-lit", on);
        if (on) lit.push(names[i]);
      });
      var all = answers.every(function (a) { return a !== null; });
      if (!out) return;
      out.textContent = "";
      if (lit.length) lit.forEach(function (n, k) { out.appendChild(line(n, k ? (k === lit.length - 1 ? " and " : ", ") : "")); });
      else if (all) out.appendChild(line("None of the three."));
      fig.classList.toggle("is-answered", out.childNodes.length > 0);
    }

    causes.forEach(function (c, i) {
      c.querySelectorAll("button[data-v]").forEach(function (b) {
        function click() {
          var v = b.getAttribute("data-v");
          answers[i] = answers[i] === v ? null : v;
          c.querySelectorAll("button[data-v]").forEach(function (x) {
            x.setAttribute("aria-pressed", String(answers[i] === x.getAttribute("data-v")));
          });
          render();
        }
        b.addEventListener("click", click);
        off.push(function () { b.removeEventListener("click", click); });
      });
    });

    return function () {
      if (io) io.disconnect();
      off.forEach(function (f) { f(); });
      fig.classList.remove("is-in", "is-answered");
      answers = [null, null, null];
      causes.forEach(function (c) {
        c.classList.remove("is-lit");
        c.querySelectorAll("button[data-v]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      });
      if (out) out.textContent = "";
    };
  }
};
