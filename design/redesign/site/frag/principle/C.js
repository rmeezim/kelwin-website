window.KM = {
  init(root, { reduced }) {
    if (reduced) return; // final state: fully plotted, every value set

    // mono values type on in drafting order, 24ms per character
    var STEP = 24;
    root.querySelectorAll("[data-type]").forEach(function (el) {
      var text = el.textContent;
      var at = +el.getAttribute("data-at") || 0;
      el.setAttribute("aria-label", text);
      el.textContent = "";
      var chars = Array.prototype.map.call(text, function (ch) {
        var s = document.createElement("span");
        s.textContent = ch;
        s.style.visibility = "hidden";
        s.setAttribute("aria-hidden", "true");
        el.appendChild(s);
        return s;
      });
      chars.forEach(function (s, i) {
        setTimeout(function () { s.style.visibility = "visible"; }, at + i * STEP);
      });
    });
  }
};
