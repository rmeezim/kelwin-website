import type { Behavior } from "../types";

/* cta — no script (the mockup, design/redesign/site/frag/cta/U, has none). The entrance is CSS
   only: cta.css declares it under .km-motion, held at its first frame until the slot plays. The
   only interactive things are the two doors, which are plain links (hover and focus in CSS).
   Nothing is set up, so there is nothing to clean up, and a strict-mode remount is a no-op. */
export const init: Behavior = () => {};
