window.KM = {
  init(root, { reduced }) {
    var fig = root.querySelector(".km-reframe-A__fig");
    var segs = root.querySelectorAll(".km-reframe-A__seg");
    if (!fig) return;

    function set(state, instant) {
      if (instant) fig.classList.add("is-cold");
      fig.classList.toggle("is-surface", state === "surface");
      segs.forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-state") === state)); });
      if (instant) { void fig.getBoundingClientRect(); fig.classList.remove("is-cold"); }
    }

    segs.forEach(function (b) {
      b.addEventListener("click", function () { set(b.getAttribute("data-state"), false); });
    });

    if (reduced) { set("arch", true); return; }

    // Demo: the figure opens in SURFACE (the mark's three pieces scattered, each wired to a
    // symptom it never reaches, a red route dead-ending at PIPELINE), then advances once to
    // ARCHITECTURE: the pieces nest into the Kelwin mark and the core turns red.
    // On the live site the same switch fires once, when the plate is 50% visible.
    set("surface", true);
    setTimeout(function () { set("arch", false); }, 2400);
  }
};
