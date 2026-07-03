"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./FirstPrinciples.css";

interface Principle {
  tag: string;
  title: string;
  support: string;
  ledger: [{ label: string; value: string }, { label: string; value: string }];
  glyph: React.ReactNode;
}

const G_STROKE = "currentColor";
const G_WIDTH = 1.4;

const Glyph = {
  infrastructure: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <line x1="4" y1="3" x2="4" y2="20" />
      <line x1="9" y1="3" x2="9" y2="20" />
      <line x1="14" y1="3" x2="14" y2="20" />
      <line x1="19" y1="3" x2="19" y2="20" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  category: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="3" width="18" height="18" />
      <rect x="7" y="7" width="10" height="10" />
      <rect x="11" y="11" width="2" height="2" fill={G_STROKE} stroke="none" />
    </svg>
  ),
  ownership: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="8" r="4" />
      <line x1="12" y1="12" x2="12" y2="20" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  ),
  defensibility: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <path d="M12 3 L4 6 L4 13 C 4 17, 8 20, 12 21 C 16 20, 20 17, 20 13 L 20 6 Z" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
  precision: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  ),
  advocacy: (
    <svg viewBox="0 0 24 24" fill="none" stroke={G_STROKE} strokeWidth={G_WIDTH} strokeLinecap="square" strokeLinejoin="miter">
      <path d="M3 5 L 21 5 L 21 16 L 13 16 L 9 20 L 9 16 L 3 16 Z" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <line x1="7" y1="12" x2="14" y2="12" />
    </svg>
  ),
};

const DATA: Principle[] = [
  {
    tag: "Infrastructure",
    title: "Revenue is infrastructure, not activity.",
    support:
      "Most companies rebuild their pipeline from scratch every quarter. We build the part that carries forward.",
    ledger: [
      { label: "Asset class", value: "Structural" },
      { label: "Half-life",   value: "Permanent" },
    ],
    glyph: Glyph.infrastructure,
  },
  {
    tag: "Category",
    title: "You don’t enter a category. You define one.",
    support:
      "Compete inside a category someone else built and you’re always the alternative. We’d rather you set the standard.",
    ledger: [
      { label: "Position",     value: "Defining" },
      { label: "Market entry", value: "Original" },
    ],
    glyph: Glyph.category,
  },
  {
    tag: "Ownership",
    title: "The asset is yours.",
    support:
      "What we build, you keep — system, language, playbook. If it stops working the day we leave, we built it wrong.",
    ledger: [
      { label: "Asset transfer",     value: "Complete" },
      { label: "Deprecation risk",   value: "Zero"     },
    ],
    glyph: Glyph.ownership,
  },
  {
    tag: "Defensibility",
    title: "Clarity is the moat.",
    support:
      "Anyone can copy your features by next quarter. No one copies being the company a buyer understands in one sentence.",
    ledger: [
      { label: "Moat type",        value: "Clarity" },
      { label: "Replication cost", value: "∞"   },
    ],
    glyph: Glyph.defensibility,
  },
  {
    tag: "Precision",
    title: "Precision is the multiplier — not reach.",
    support:
      "Sending twice as much rarely closes twice as much — it just trains the market to ignore you. We do less, aimed sharper.",
    ledger: [
      { label: "Compression",     value: "12:1"  },
      { label: "Reach efficiency", value: "0.84" },
    ],
    glyph: Glyph.precision,
  },
  {
    tag: "Advocacy",
    title: "Build for the room you’re not in.",
    support:
      "The deal is won later — in a room you’ll never enter, when one person repeats your case to the people who sign.",
    ledger: [
      { label: "Decision room",     value: "Remote"      },
      { label: "Signal half-life",  value: "Multi-cycle" },
    ],
    glyph: Glyph.advocacy,
  },
];

export default function FirstPrinciples() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [bracket, setBracket] = useState({ top: 0, left: 0, width: 0, height: 48 });

  // ── Scroll mechanics — one ScrollTrigger pins the entire `.lx-redesign`
  // grid (both columns at once), and scrub drives card entry, the active
  // index, the progress spine, and the exit fade off the pin's own
  // progress value. Earlier iterations split this across two sticky
  // ancestors plus a raw-scroll listener; that desynced the columns at
  // the exit (different ancestors release sticky at different times) and
  // let the entry interval overflow the sticky window so the last card
  // tried to enter while the frame was already scrolling away. Pinning
  // the grid keeps both columns locked together and lets the pin
  // duration absorb the full entry + hold + fade sequence.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = section.querySelectorAll<HTMLElement>(".lx-stack-card");
    const indexItems = section.querySelectorAll<HTMLElement>(".lx-index-item");
    const spineEl = section.querySelector<HTMLElement>(".lx-spine-fill");
    const frameEl = section.querySelector<HTMLElement>(".lx-cards-frame");

    // Card 1 + the first index row enter immediately so the section is
    // never visually empty when it first scrolls into view (the pin
    // hasn't engaged yet at that point).
    cards[0]?.classList.add("is-entered", "is-active");
    indexItems[0]?.classList.add("is-active");
    if (spineEl) spineEl.style.width = "0%";

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 981px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const conditions = context.conditions as { isDesktop: boolean };

        gsap.set(".lx-side .scaffold-heading", { y: 28, opacity: 0 });
        gsap.set(".lx-index-item", { x: -14, opacity: 0 });

        gsap
          .timeline({
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
            defaults: { ease: "power3.out" },
          })
          .to(".lx-side .scaffold-heading", { y: 0, opacity: 1, duration: 0.7 })
          .to(".lx-index-item", { x: 0, opacity: 1, duration: 0.45, stagger: 0.06 }, "-=0.45");

        if (!conditions.isDesktop || cards.length < 2) return;

        // The whole `.principles-section` is the pin target — not just
        // the grid. Pinning the section together with `min-height: 100vh`
        // guarantees the section fully covers the viewport for the
        // entire pin window, so the next section (bone-colored
        // OperatingPrincipleBand) can never travel up through the lower
        // viewport mid-pin. ENTRY drives card 2–6 reveal; HOLD parks the
        // completed stack until the pin releases. There is no exit fade
        // — cards stay at full opacity and the section continues with
        // normal page scroll once the pin lets go.
        const ENTRY = 1100;
        const HOLD = 500;
        const PIN_DURATION = ENTRY + HOLD;
        const ENTRY_END = ENTRY / PIN_DURATION;

        // Belt-and-braces: clear any stale inline opacity from a prior
        // build that used an exit fade.
        if (frameEl) frameEl.style.opacity = "";

        let prevActive = 0;

        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${PIN_DURATION}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            const entryProgress = Math.min(p / ENTRY_END, 1);
            const continuousIdx = entryProgress * (cards.length - 1);
            // `Math.floor(... + 0.001)` lines up with the `is-entered`
            // threshold (`i <= continuousIdx + 0.001`) so the bracket
            // flips to row N at the exact moment card N enters — no
            // more bracket leading the card.
            const newActive = Math.min(
              cards.length - 1,
              Math.max(0, Math.floor(continuousIdx + 0.001))
            );

            cards.forEach((c, i) => {
              c.classList.toggle("is-entered", i <= continuousIdx + 0.001);
              c.classList.toggle("is-active", i === newActive);
            });
            indexItems.forEach((it, i) => {
              it.classList.toggle("is-active", i === newActive);
            });

            if (spineEl) {
              spineEl.style.width = `${entryProgress * 100}%`;
            }

            if (newActive !== prevActive) {
              prevActive = newActive;
              setActiveIdx(newActive);
            }
          },
        });

        return () => {
          trigger.kill();
          if (frameEl) frameEl.style.opacity = "";
          if (spineEl) spineEl.style.width = "0%";
        };
      }
    );

    return () => mm.revert();
  }, []);


  // ── Sync active class + bracket geometry. The bracket frames the
  // ACTIVE row's text (num + title), not the whole row, with generous
  // spacing so the corner brackets read as an intentional frame, not
  // tight clipping around the glyphs.
  //
  // Spacing: 18px horizontal padding on each side, 12px vertical. Tuned
  // so the bracket arms sit clearly off the type and the frame reads as
  // an editorial pull-quote treatment.
  useEffect(() => {
    const updateBracket = () => {
      const section = sectionRef.current;
      if (!section) return;

      section.querySelectorAll<HTMLElement>(".lx-stack-card").forEach((c, i) => {
        c.classList.toggle("is-active", i === activeIdx);
      });
      section.querySelectorAll<HTMLElement>(".lx-index-item").forEach((it, i) => {
        it.classList.toggle("is-active", i === activeIdx);
      });

      const list = section.querySelector<HTMLElement>(".lx-index");
      const rows = section.querySelectorAll<HTMLElement>(".lx-index-item");
      if (!list || !rows[activeIdx]) return;

      const num   = rows[activeIdx].querySelector<HTMLElement>(".lx-index-num");
      const title = rows[activeIdx].querySelector<HTMLElement>(".lx-index-title");
      if (!num || !title) return;

      const listRect  = list.getBoundingClientRect();
      const numRect   = num.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();

      const H_PAD = 18;
      const V_PAD = 12;

      const top    = Math.min(numRect.top, titleRect.top);
      const bottom = Math.max(numRect.bottom, titleRect.bottom);

      setBracket({
        top:    top - listRect.top - V_PAD,
        left:   numRect.left - listRect.left - H_PAD,
        width:  titleRect.right - numRect.left + 2 * H_PAD,
        height: bottom - top + 2 * V_PAD,
      });
    };

    updateBracket();
    window.addEventListener("resize", updateBracket);
    return () => window.removeEventListener("resize", updateBracket);
  }, [activeIdx]);

  // ── Cursor-driven 3D tilt — the edge of the card closest to the
  // cursor recedes into the page; the opposite edge lifts slightly
  // toward the viewer. The card itself stays anchored at its center.
  // Variables are set on the outer `.lx-stack-card` and inherit down to
  // `.lx-card-surface`, where the actual rotateX/rotateY transform
  // lives (the inner surface needs its own transition timing — fast
  // enough to track the cursor — separate from the slower entry
  // animation on the outer wrapper).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll<HTMLElement>(".lx-stack-card");
    const cleanups: Array<() => void> = [];
    // Tilt magnitude in degrees. Paired with `perspective: 700px` on
    // the outer wrapper for a clearly visible 3D tilt without being
    // theatrical.
    const MAX_TILT = 2.5;
    cards.forEach((card, idx) => {
      // "Stacked tab" mode only applies while the next card is
      // ACTUALLY entered and therefore actually obscuring this card.
      // While the user is at `activeIdx === idx` and the next card
      // hasn't entered yet, this card has its full surface exposed
      // and should behave like the last card: full-height tilt range,
      // center pivot. The check is done live on every mousemove
      // because the next card's entered state flips as the user
      // scrubs the pin.
      const nextCard = cards[idx + 1];

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const nextIsEntered =
          nextCard?.classList.contains("is-entered") ?? false;
        const isStackedTab = nextCard !== undefined && nextIsEntered;

        // Pivot near the hidden bottom for a stacked tab so the
        // visible top edge swings through a large arc in both
        // directions. Center pivot when the full surface is exposed.
        card.style.setProperty(
          "--tilt-origin",
          isStackedTab ? "50% 85%" : "50% 50%"
        );

        // Tab height for stacked tab; full card height for an
        // exposed surface. The 0.7 multiplier on tab mode lets `ny`
        // saturate to its extremes a little before the cursor hits
        // the next card's boundary, giving the user a reachable
        // "max-bottom-recede" zone.
        let heightForY: number;
        if (isStackedTab && nextCard) {
          const tabHeight = Math.max(
            1,
            nextCard.getBoundingClientRect().top - rect.top
          );
          heightForY = tabHeight * 0.7;
        } else {
          heightForY = rect.height;
        }

        const nx = (e.clientX - rect.left) / rect.width;
        const ny = Math.min(
          1,
          Math.max(0, (e.clientY - rect.top) / heightForY)
        );
        // rotateX(+) = top edge recedes; rotateY(+) = right edge recedes.
        const tiltX = -(ny - 0.5) * 2 * MAX_TILT;
        const tiltY = (nx - 0.5) * 2 * MAX_TILT;
        card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      };
      const onLeave = () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="principles" className="principles-section" ref={sectionRef}>
      <div className="principles-stage">

        <div className="lx-redesign">

          <div className="lx-cards-col">
            <div className="lx-cards-frame">
              {DATA.map((d, i) => {
                const nn = String(i + 1).padStart(2, "0");
                return (
                  <article className="lx-stack-card" data-i={i} key={i}>
                    {/* Inner surface holds all visual styling and the
                        hover tilt — split from the outer wrapper so the
                        slow entry transition and the responsive tilt
                        transition don't compete on the same property. */}
                    <div className="lx-card-surface">
                      <span className="lx-card-bracket lx-card-bracket-tl" aria-hidden="true" />
                      <span className="lx-card-bracket lx-card-bracket-tr" aria-hidden="true" />
                      <span className="lx-card-bracket lx-card-bracket-bl" aria-hidden="true" />
                      <span className="lx-card-bracket lx-card-bracket-br" aria-hidden="true" />
                      <span className="lx-card-mark" aria-hidden="true">{nn}</span>

                      <div className="lx-card-glyph" aria-hidden="true">{d.glyph}</div>

                      <div className="lx-card-head">
                        <span className="lx-card-tag">{d.tag}</span>
                        <span className="lx-card-spec">Principle {nn} / 06</span>
                      </div>
                      <h3 className="lx-card-title">{d.title}</h3>
                      <p className="lx-card-support">{d.support}</p>

                      <div className="lx-card-ledger">
                        {d.ledger.map((cell, ci) => (
                          <div key={ci} className="lx-ledger-cell">
                            <span className="lx-ledger-label">{cell.label}</span>
                            <span className="lx-ledger-value">{cell.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="lx-cards-trailing" aria-hidden="true" />
          </div>

          <div className="lx-side">
            <h2 className="scaffold-heading">
              <span className="line-1">One operating system.</span>
              <span className="line-2">Six core principles.</span>
            </h2>

            <ul className="lx-index">
              {/* `key={activeIdx}` forces React to remount this span on
                  every active-row change, which retriggers the
                  `lx-card-bracket-flicker` animation. The bracket snaps
                  to its new geometry and flickers in, instead of sliding
                  smoothly between rows. */}
              <span
                key={activeIdx}
                className="lx-index-bracket"
                style={{
                  top: `${bracket.top}px`,
                  left: `${bracket.left}px`,
                  width: `${bracket.width}px`,
                  height: `${bracket.height}px`,
                }}
                aria-hidden="true"
              >
                <span className="lx-index-bracket-tl" />
                <span className="lx-index-bracket-tr" />
                <span className="lx-index-bracket-bl" />
                <span className="lx-index-bracket-br" />
              </span>
              {DATA.map((d, i) => {
                const nn = String(i + 1).padStart(2, "0");
                return (
                  <li className="lx-index-item" data-i={i} key={i}>
                    <span className="lx-index-num">{nn}</span>
                    <span className="lx-index-title">{d.title}</span>
                  </li>
                );
              })}
            </ul>

            {/* Horizontal progress spine — dotted bronze track with a
                solid bronze fill driven continuously by the pin's scroll
                progress (set on the .lx-spine-fill element directly inside
                the ScrollTrigger onUpdate above). */}
            <div className="lx-spine" aria-hidden="true">
              <span className="lx-spine-track" />
              <span className="lx-spine-fill" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
