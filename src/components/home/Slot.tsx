"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { behaviors, type BehaviorName } from "./behaviors";

type Props = {
  /** Section id — the slot renders as `#s-<id>`. */
  id: string;
  /** The section's behaviour from the registry, if it has one. */
  behavior?: BehaviorName;
  /** Play on load instead of on scroll (the hero). */
  eager?: boolean;
  children: ReactNode;
};

/**
 * The play trigger every v5 section sits in.
 *
 * Entrance keyframes are declared under `html.km-motion` and held at their first frame
 * until this slot gains `.is-play` (see km-kit.css §10), so a section never flashes its
 * resting state before it animates. The slot plays once — when its top passes 88% of the
 * viewport, or on load for `eager` — after the fonts are ready, then calls the section's
 * behaviour with its root element. Under prefers-reduced-motion there is no `km-motion`,
 * the behaviour runs immediately with `reduced: true`, and everything is final.
 */
export default function Slot({ id, behavior, eager = false, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = ref.current;
    if (!slot) return;
    // Tells the no-JS fallback in the root layout that the motion runtime is alive.
    document.documentElement.classList.add("km-live");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = slot.firstElementChild as HTMLElement | null;
    let cleanup: void | (() => void);
    let io: IntersectionObserver | undefined;
    let timer = 0;
    let cancelled = false;

    const play = () => {
      if (cancelled || slot.dataset.played) return;
      slot.dataset.played = "1";
      if (!reduced) slot.classList.add("is-play");
      const fn = behavior ? behaviors[behavior] : undefined;
      if (fn && root) {
        try {
          cleanup = fn(root, { reduced });
        } catch (err) {
          console.error(`[${id}]`, err);
        }
      }
    };

    if (reduced) {
      play();
    } else {
      const ready = document.fonts?.ready ?? Promise.resolve();
      ready.then(() => {
        if (cancelled) return;
        if (eager) {
          timer = window.setTimeout(play, 180);
          return;
        }
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io?.disconnect();
              play();
            }
          },
          { rootMargin: "0px 0px -12% 0px", threshold: 0 },
        );
        io.observe(slot);
      });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      io?.disconnect();
      if (typeof cleanup === "function") cleanup();
      delete slot.dataset.played;
      slot.classList.remove("is-play");
    };
  }, [id, behavior, eager]);

  return (
    <div ref={ref} className="km-slot" id={`s-${id}`}>
      {children}
    </div>
  );
}
