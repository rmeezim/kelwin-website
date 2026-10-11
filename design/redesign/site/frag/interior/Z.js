/* interior · Z · The annotated statement — the gloss pass runs entirely in CSS (under
   html.is-play). Every gloss hangs from its own word, so there is no geometry to compute
   and nothing to re-measure when the skin changes. The static HTML is the final, fully
   glossed statement, so reduced motion needs nothing from here: no loops, no timers.
   On the live site an IntersectionObserver would add the play class when the head is
   in view; the mock plays on load. */
window.KM = { init: function () {} };
