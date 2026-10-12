/* article-body · S · the figure plays once at 40% visible; the self-check lights layers
   (each question has its own two answers; data-v="fail" is the one that points to a failure).
   Nothing is stored or sent: the answers live in this page's DOM only. Returns a cleanup. */
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

    /* the self-check */
    var names = ["Narrative Systems", "GTM Infrastructure", "GTM Intelligence"];
    var causes = Array.prototype.slice.call(fig.querySelectorAll(".km-article-body-S__cause"));
    var wires = Array.prototype.slice.call(fig.querySelectorAll(".km-article-body-S__w--b"));
    var out = fig.querySelector(".km-article-body-S__msg");
    var start = out ? out.textContent : "";
    var answers = [null, null, null];

    function list(xs) {
      if (xs.length < 2) return xs.join("");
      return xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
    }
    function render() {
      var lit = [];
      causes.forEach(function (c, i) {
        var on = answers[i] === "fail";      /* the answer that points to a failure */
        c.classList.toggle("is-lit", on);
        if (wires[i]) wires[i].classList.toggle("is-lit", on);
        if (on) lit.push(names[i]);
      });
      var left = answers.filter(function (a) { return a === null; }).length;
      var msg;
      if (left === 3) msg = start;
      else if (lit.length) msg = list(lit) + (left ? ", so far." : ".");
      else msg = left ? "Nothing flagged so far." : "No layer flagged.";
      if (out) out.textContent = msg;
    }

    causes.forEach(function (c, i) {
      c.querySelectorAll("button[data-v]").forEach(function (b) {
        function click() {
          var v = b.getAttribute("data-v");
          answers[i] = answers[i] === v ? null : v;            /* a second press clears the answer */
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
      fig.classList.remove("is-in");
      answers = [null, null, null];
      causes.forEach(function (c) {
        c.classList.remove("is-lit");
        c.querySelectorAll("button[data-v]").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      });
      wires.forEach(function (w) { w.classList.remove("is-lit"); });
      if (out) out.textContent = start;
    };
  }
};
