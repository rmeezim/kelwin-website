"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero",         label: "01 — Surface"        },
  { id: "reframe",      label: "02 — Diagnostic"     },
  { id: "revenue-os",   label: "03 — Revenue OS"     },
  { id: "principles",   label: "04 — Principles"     },
  { id: "principle-band", label: "05 — Operating Truth" },
  { id: "methodology",  label: "06 — Methodology"    },
];

/**
 * SectionJumpRail — six tiny bronze tick marks down the right edge of
 * the viewport. Active section's tick is filled and labelled. Doubles
 * as wayfinding (where am I?) and quick nav (click to jump).
 */
export default function SectionJumpRail() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Resolve which section is most prominently in view. Picks the one
    // whose top is closest to the viewport's vertical center.
    const compute = () => {
      const vh = window.innerHeight;
      let bestIdx = 0;
      let bestDist = Infinity;
      SECTIONS.forEach((s, i) => {
        const el =
          document.getElementById(s.id) ??
          document.querySelector<HTMLElement>(`#${CSS.escape(s.id)}`) ??
          null;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const dist = Math.abs(rect.top - vh * 0.3);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });
      setActiveIdx(bestIdx);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const jumpTo = (i: number) => {
    const el = document.getElementById(SECTIONS[i].id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sys-jump-rail" aria-label="Sections">
      {SECTIONS.map((s, i) => {
        const isActive = i === activeIdx;
        const isHover = i === hoverIdx;
        return (
          <button
            key={s.id}
            type="button"
            className={`sys-jump-tick ${isActive ? "is-active" : ""}`}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            onClick={() => jumpTo(i)}
            aria-label={s.label}
          >
            <span className="sys-jump-mark" />
            {(isActive || isHover) && (
              <span className="sys-jump-label">{s.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
