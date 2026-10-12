// int-kit · S — the only behaviour on the sheet: the contents strip's phone toggle
// (copied verbatim from snippets/interior.html, section 2b). At 1440 the button is hidden.
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
