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

/** The longest the entrances wait for web fonts before playing on the fallback metrics. */
const FONT_WAIT = 1200;
/** Visible share that plays a section: 22% of its height, at most 35% of the viewport. */
const SHARE = 0.22;
const SHARE_CAP = 0.35;
const THRESHOLDS = Array.from({ length: 101 }, (_, i) => i / 100);

/**
 * The play trigger every v5 section sits in.
 *
 * Entrance keyframes are declared under `html.km-motion` and held at their first frame
 * until this slot gains `.is-play` (see km-kit.css §10), so a section never flashes its
 * resting state before it animates. The slot plays once — when a real share of it is on
 * screen (22% of the section, as the approved prototype, capped at 35% of the viewport so
 * a section taller than the screen still plays), or on load for `eager` — once the fonts
 * are ready (or after FONT_WAIT, whichever comes first), then calls the section's behaviour
 * with its root element.
 * No `km-motion` on <html> means no entrance: prefers-reduced-motion (never set), or the
 * motion runtime arrived after the root layout's 4s no-JS fallback had already dropped it.
 * Either way the behaviour runs immediately with `reduced: true` and everything is final.
 */
export default function Slot({ id, behavior, eager = false, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = ref.current;
    if (!slot) return;
    // Tells the no-JS fallback in the root layout that the motion runtime is alive.
    document.documentElement.classList.add("km-live");

    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !document.documentElement.classList.contains("km-motion");
    const root = slot.firstElementChild as HTMLElement | null;
    let cleanup: void | (() => void);
    let io: IntersectionObserver | undefined;
    let timer = 0;
    let fontTimer = 0;
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
      // a stalled or slow font request must not hold the page blank: play on the fallback metrics
      const ready = Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise<void>((resolve) => {
          fontTimer = window.setTimeout(resolve, FONT_WAIT);
        }),
      ]);
      ready.then(() => {
        window.clearTimeout(fontTimer);
        if (cancelled) return;
        if (eager) {
          timer = window.setTimeout(play, 180);
          return;
        }
        io = new IntersectionObserver(
          (entries) => {
            const shown = entries.some((e) => {
              if (!e.isIntersecting) return false;
              const view = e.rootBounds?.height ?? window.innerHeight;
              const need = Math.min(SHARE * e.boundingClientRect.height, SHARE_CAP * view);
              return e.intersectionRect.height >= need - 1;
            });
            if (shown) {
              io?.disconnect();
              play();
            }
          },
          { threshold: THRESHOLDS },
        );
        io.observe(slot);
      });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.clearTimeout(fontTimer);
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
