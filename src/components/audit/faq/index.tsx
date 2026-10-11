import Link from "next/link";
import type { CSSProperties } from "react";
import { QUESTIONS, RESTING_OPEN } from "./data";
import "./faq.css";

/* faq — "Questions": the ledger, answered plainly. Port of design/redesign/site/frag/faq/U
   (round 4, approved; founder decision D4 moved it from the homepage to the System Audit page).
   The kit's head runs wide on top (label → two-voice statement); below it the left column
   (cols 1–5) carries the red rule, the lede and both doors, and the ledger (cols 6–12) opens in
   place, one row at a time. The red rule and the ledger's top hairline share one line.
   Source order is the reading order at every width: rule → lede → ledger → doors. At ≥1024 the
   grid lifts the doors back into the left column under the lede (faq.css); below that the page
   reads straight down and ends on the action, so focus order always follows what is seen.
   The markup is the final state (row 01 open); behavior.ts plays the entrance and the one
   orchestrated moment (01 opening as the last row lands). */
export default function Faq() {
  return (
    <section className="km km-faq ac-sec" data-surface="dark" aria-labelledby="km-faq-h">
      <div className="ac-head ac-wrap km-faq__head">
        <div className="ac-labelrow">
          <p className="ac-label">Questions</p>
          <p className="ac-meta">Q. 01–06</p>
        </div>
        <h2 className="ac-statement" id="km-faq-h">
          <span className="ac-line">
            <span>Straight answers,</span>
          </span>
          <span className="ac-line ac-accent">
            <span>before the call.</span>
          </span>
        </h2>
      </div>

      <div className="ac-wrap">
        <div className="ac-grid km-faq__body">
          {/* left (cols 1–5, row 1): rule → lede, as in the hero's lede-and-doors block */}
          <div className="ac-col km-faq__side" style={{ "--c": 1, "--s": 5 } as CSSProperties}>
            <span className="ac-rule" aria-hidden="true"></span>
            <p className="ac-lede">
              The questions founders ask before booking, answered the way we’d answer them on the call.
            </p>
          </div>

          {/* right (cols 6–12, rows 1–2): the ledger. Six rows open in place, one at a time; 01 rests open */}
          <div className="ac-col km-faq__list" style={{ "--c": 6, "--s": 7 } as CSSProperties}>
            <div className="ac-ledger">
              {QUESTIONS.map((item, i) => {
                const open = i === RESTING_OPEN;
                const n = i + 1;
                return (
                  <div key={n} className={open ? "ac-row is-open" : "ac-row"} style={{ "--i": i } as CSSProperties}>
                    <h3 className="km-faq__q">
                      <button
                        className="ac-row__head"
                        type="button"
                        id={`km-faq-q${n}`}
                        aria-expanded={open}
                        aria-controls={`km-faq-a${n}`}
                      >
                        <span className="ac-idx">{String(n).padStart(2, "0")}</span>
                        <span className="ac-h4">{item.q}</span>
                        <span className="ac-toggle" aria-hidden="true"></span>
                      </button>
                    </h3>
                    <div
                      className="ac-row__more"
                      id={`km-faq-a${n}`}
                      role="region"
                      aria-labelledby={`km-faq-q${n}`}
                      inert={!open}
                    >
                      <div>
                        <div className="ac-row__in">
                          <p className="ac-body km-faq__p">{item.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* the two doors: after the ledger in reading order; at ≥1024 they sit in the left column
              (cols 1–5, row 2) under the lede, 36px below it, exactly where the mockup has them */}
          <div className="ac-col km-faq__doors" style={{ "--c": 1, "--s": 5 } as CSSProperties}>
            {/* this IS the audit page: the primary goes to the qualification flow above */}
            <Link className="ac-btn" href="/audit#qualify">
              Request a System Audit
            </Link>
            <p className="km-faq__ask">
              <span className="ac-support">Something we didn’t cover?</span>
              <Link className="ac-link" href="/contact">
                Ask the founding team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
