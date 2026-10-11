window.KM = {
  init(root, { reduced }) {
    if (!root) return;
    // Round 4 (D12): no film controls. The film is ambient; under reduced motion it holds still
    // (base.css stops the drift, the walker and the grain) and rests on the wide framing.
    if (reduced) return;
    // the establishing shot: the film fades up on the close framing (a hard cut), then,
    // once the statement has landed, the camera pulls back to wide over 1.6s, once.
    root.setAttribute("data-crop", "close");
    root.classList.add("is-cut");
    void root.offsetWidth;
    requestAnimationFrame(function () { root.classList.remove("is-cut"); });
    setTimeout(function () { root.setAttribute("data-crop", "wide"); }, 2400);
  }
};
