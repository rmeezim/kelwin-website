window.KM = {
  init(root, { reduced }) {
    var rows = Array.prototype.slice.call(root.querySelectorAll(".km-evidence-B__row"));
    var auto = null;

    function setOpen(row, open) {
      row.classList.toggle("is-open", open);
      var b = row.querySelector(".km-evidence-B__tog");
      b.setAttribute("aria-expanded", String(open));
      b.querySelector(".km-evidence-B__vh").textContent = open ? "Close the full read" : "Open the full read";
    }
    rows.forEach(function (row) {
      row.querySelector(".km-evidence-B__tog").addEventListener("click", function () {
        if (auto) { clearTimeout(auto); auto = null; }
        var open = !row.classList.contains("is-open");
        rows.forEach(function (r) { if (r !== row) setOpen(r, false); }); // one open at a time
        setOpen(row, open);
      });
    });

    if (reduced) return; // final state: the 95:5 row open

    // demo: all rows closed, then the 95:5 row opens in place at ~1.8s
    root.classList.add("is-cold");
    setOpen(rows[1], false);
    void root.offsetWidth;
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("is-cold"); }); });
    auto = setTimeout(function () { auto = null; setOpen(rows[1], true); }, 1800);
  }
};
