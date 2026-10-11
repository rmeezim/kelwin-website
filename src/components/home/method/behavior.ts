import type { Behavior } from "../types";

/* method — the phase track. All entrance motion is CSS (method.css, under .km-motion); the audit's
   "10" is static markup (the page's one counter belongs to the system). This behaviour only:
   · on the homepage (.km-home) holds the figure on its first frame until the plate is 35% in view
     (the slot plays when only the heading is on screen); it plays once;
   · pauses the Calibrate packet while the section is off screen;
   · gives touch and pen the hover's reading: tapping a phase reads it on its own (its text and bar
     stay lit, the other three quiet); tapping it again, or anywhere else, clears it. A mouse hovers.
     On mixed-input devices (touch laptops, tablets with a trackpad) the last pointer decides: a
     touch/pen press sets [data-touch], which switches the CSS :hover reading off (no sticky
     touch-hover), and the next mouse movement over the phases hands the reading back to hover.
     Where no hover is available at all, a mouse click toggles like a tap;
   · holds the packet to the approved pace (its 392px run per 9.6s lap at the 1440 stage): where
     its run is longer (above 1440, the stacked tablet track) the lap lengthens with it; it is
     never shorter than 9.6s.
   Reduced motion: the markup is the final state — no gate, no idle observer, no loop (the tap
   reading is an interaction, not motion, so it stays). */
export const init: Behavior = (root, { reduced }) => {
  const undo: Array<() => void> = [];

  // ── tap reading (touch / pen) ──
  const cols = root.querySelector<HTMLElement>(".km-method__cols");
  if (cols) {
    let pointer = "mouse";
    const canHover = window.matchMedia("(any-hover: hover)");
    const clear = () => {
      cols.removeAttribute("data-focus");
      cols.querySelectorAll(".km-method__col.is-focus").forEach((el) => el.classList.remove("is-focus"));
    };
    const onPointerDown = (e: PointerEvent) => {
      pointer = e.pointerType;
      if (pointer !== "mouse") cols.setAttribute("data-touch", "");
    };
    // a mouse moving over the phases takes the reading back to hover (no tap reading left over);
    // with no hover anywhere on the device, the tap reading stays until a click or tap clears it
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !cols.hasAttribute("data-touch")) return;
      cols.removeAttribute("data-touch");
      if (canHover.matches) clear();
    };
    const onClick = (e: MouseEvent) => {
      if (pointer === "mouse" && canHover.matches) return; // the mouse's reading is its hover
      const col = (e.target as Element | null)?.closest<HTMLElement>(".km-method__col");
      if (!col || !cols.contains(col)) return;
      const on = col.classList.contains("is-focus");
      clear();
      if (!on) {
        col.classList.add("is-focus");
        cols.setAttribute("data-focus", "");
      }
    };
    const onDocPointerDown = (e: PointerEvent) => {
      if (!cols.hasAttribute("data-focus")) return;
      if (e.target instanceof Node && cols.contains(e.target)) return;
      clear();
    };
    cols.addEventListener("pointerdown", onPointerDown);
    cols.addEventListener("pointermove", onPointerMove);
    cols.addEventListener("click", onClick);
    document.addEventListener("pointerdown", onDocPointerDown);
    undo.push(() => {
      cols.removeEventListener("pointerdown", onPointerDown);
      cols.removeEventListener("pointermove", onPointerMove);
      cols.removeEventListener("click", onClick);
      document.removeEventListener("pointerdown", onDocPointerDown);
      cols.removeAttribute("data-touch");
      clear();
    });
  }

  if (reduced || !("IntersectionObserver" in window)) {
    return () => undo.forEach((fn) => fn());
  }

  // ── homepage gate: hold the figure until the plate is properly in view ──
  const plate = root.querySelector<HTMLElement>(".km-method__plate");
  if (plate && root.closest(".km-home")) {
    root.setAttribute("data-wait", "");
    // 35% of the plate — or, for a plate taller than the viewport can show at 35% (the stacked
    // phone plate), 35% of the viewport's height filled by it.
    const gate = new IntersectionObserver(
      (entries) => {
        const seen = entries.some(
          (e) =>
            e.isIntersecting &&
            (e.intersectionRatio >= 0.35 || e.intersectionRect.height >= window.innerHeight * 0.35),
        );
        if (seen) {
          root.removeAttribute("data-wait");
          gate.disconnect();
        }
      },
      { threshold: [0, 0.1, 0.2, 0.35] },
    );
    gate.observe(plate);
    undo.push(() => {
      gate.disconnect();
      root.removeAttribute("data-wait");
    });
  }

  // ── the packet rests while the section is off screen ──
  const idle = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) root.removeAttribute("data-idle");
        else root.setAttribute("data-idle", "");
      });
    },
    { threshold: 0 },
  );
  idle.observe(root);
  undo.push(() => {
    idle.disconnect();
    root.removeAttribute("data-idle");
  });

  // ── the packet keeps the approved pace: 392px of run per 9.6s lap (the 1440 stage) ──
  const pkt = root.querySelector<HTMLElement>(".km-method__pkt");
  if (pkt && "ResizeObserver" in window) {
    const LAP = 9600;
    const RUN = 392;
    let lap = LAP;
    const fit = () => {
      const run = pkt.offsetWidth;
      if (!run) return; // not laid out (hidden): keep the current lap
      const next = Math.round(LAP * Math.max(1, run / RUN));
      if (Math.abs(next - lap) < lap * 0.01) return; // a re-time restarts the lap's phase: only on a real change
      lap = next;
      if (lap === LAP) root.style.removeProperty("--km-method-lap");
      else root.style.setProperty("--km-method-lap", `${lap}ms`);
    };
    const sizer = new ResizeObserver(fit);
    sizer.observe(pkt);
    fit();
    undo.push(() => {
      sizer.disconnect();
      root.style.removeProperty("--km-method-lap");
      if (!root.getAttribute("style")) root.removeAttribute("style");
    });
  }

  return () => undo.forEach((fn) => fn());
};
