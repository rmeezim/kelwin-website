// legal-head · S — the contents strip's phone toggle (snippets/interior.html §2b, verbatim).
// At ≥768 the button is hidden and the strip is one row of links; nothing else moves.
window.KM = {
  init(root) {
    var off = [];
    root.querySelectorAll(".ac-ix__btn").forEach(function (b) {
      function flip() { b.setAttribute("aria-expanded", String(b.getAttribute("aria-expanded") !== "true")); }
      b.addEventListener("click", flip);
      off.push(function () { b.removeEventListener("click", flip); });
    });
    return function () { off.forEach(function (f) { f(); }); };
  }
};
