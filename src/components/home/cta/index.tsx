import Link from "next/link";
import type { CSSProperties } from "react";
import "./cta.css";

/* cta — "Request the / System Audit." (approved mockup: design/redesign/site/frag/cta/U, round 4).
   The founder's round-1 red poster, kept as it was, with one change in kind: the information and the
   action are two different objects.
   · ① the fact (cols 1–3): a recessed deep-red panel (the red surface's --panel). The 10 is
     information, not a button: no link, no hover, no pointer, no arrow, skipped by Tab.
   · col 4 is a channel of plain red between the information and the action.
   · ② the action (cols 5–9): the lede, cap-aligned to the panel's top edge, then the doors on the
     panel's foot: the family primary on red (paper fill, red text) → /audit, and the contact link →
     /contact.
   · ③ the note (cols 10–12): what happens at the readout, set flush to the right margin.
   · the band: the path after the click · where this sits in the method.
   The markup is the final, resting state; the entrance is CSS only (cta.css). No script. */

const TICKS = Array.from({ length: 10 }, (_, n) => n);

export default function Cta() {
  return (
    <section className="km km-cta" data-surface="red" aria-labelledby="km-cta-title">
      <div className="km-cta__inner">
        <div className="km-cta__labelrow">
          <p className="km-cta__label">
            <span className="km-cta__sq" aria-hidden="true"></span>Sound like you?
          </p>
        </div>

        <h2 className="km-cta__title" id="km-cta-title">
          <span className="km-cta__ln">
            <span>Request the</span>
          </span>
          <span className="km-cta__ln km-cta__ln--light">
            <span>System Audit.</span>
          </span>
        </h2>

        <span className="km-cta__rule" aria-hidden="true"></span>

        <div className="km-cta__row">
          {/* ① the information: what the audit is */}
          <div className="km-cta__fact" role="group" aria-labelledby="km-cta-fact">
            <p className="km-cta__fact-top" id="km-cta-fact">
              <span className="km-cta__num">10</span>
              <span className="km-cta__unit">
                <span>Working days ·</span> <span>fixed scope</span>
              </span>
            </p>
            <figure
              className="km-cta__ruler"
              role="img"
              aria-label="Ten working days, from kickoff on day 01 to the readout on day 10"
            >
              {/* one tick per working day hanging from one hairline (01 and 10 long). The viewBox is
                  262 wide (the panel's inner width at the 1440 stage) and stretches with the panel;
                  strokes stay 1px and crisp at any width. */}
              <svg className="km-cta__svg" width="262" height="9" viewBox="0 0 262 9" preserveAspectRatio="none" aria-hidden="true">
                <path className="km-cta__base" d="M0 0.5H262" />
                {TICKS.map((n) => {
                  const end = n === 0 || n === 9;
                  return (
                    <path
                      key={n}
                      className={end ? "km-cta__tk km-cta__tk--end" : "km-cta__tk"}
                      style={{ "--n": n } as CSSProperties}
                      d={`M${n * 29 + 0.5} 0V${end ? 9 : 5}`}
                    />
                  );
                })}
              </svg>
              <figcaption className="km-cta__ends" aria-hidden="true">
                <span>Kickoff</span>
                <span>Readout</span>
              </figcaption>
            </figure>
          </div>

          {/* ② the action: lede on the panel's top line, the doors on its foot */}
          <div className="km-cta__copy">
            <p className="km-cta__lede">
              One diagnostic maps the architecture underneath your pipeline. If it makes sense, we install it and run it with you. What we build, you keep.
            </p>
            <div className="km-cta__doors">
              <Link className="ac-btn km-cta__btn" href="/audit">
                Request a System Audit
              </Link>
              <Link className="ac-link km-cta__link" href="/contact">
                Talk to the team
              </Link>
            </div>
          </div>

          {/* ③ the note: what is decided at the readout */}
          <div className="km-cta__note">
            <p className="km-cta__label">
              <span className="km-cta__sq" aria-hidden="true"></span>At the readout
            </p>
            <p className="km-cta__note-copy">If installation makes sense, we scope it there. If not, the plan is still yours.</p>
          </div>
        </div>

        {/* the poster's edge furniture: what happens after the click · where this sits in the method */}
        <div className="km-cta__band">
          <ol className="km-cta__path" aria-label="After you request">
            {/* the items are inline: the spaces between them are part of the line's spacing */}
            <li>Three questions</li>{" "}
            <li>a 30-minute call with the founding team</li>{" "}
            <li className="km-cta__day">Day 01.</li>
          </ol>
          <p className="km-cta__cap">Phase 01 / 04 · Diagnose</p>
        </div>
      </div>
    </section>
  );
}
