import Link from "next/link";
import type { CSSProperties } from "react";
import { LAYERS } from "./layers";
import Ledger from "./Ledger";
import { reserveInline } from "./reserve";
import Strata from "./Strata";
import "./system.css";

const vars = (o: Record<string, string>) => o as CSSProperties;

/**
 * The system · "Strata, closed" (round 6). Right after the letter's "every quarter starts from zero",
 * this shows what Kelwin installs instead: three named layers and the one line that keeps what each
 * quarter learned. The head on top; the strata drawing on the left (cols 1–7); the ledger on the right
 * (cols 9–12). The red slab, its bright callout and the ledger's open row are always the same layer —
 * the behaviour keeps them in step, both ways. Default markup = the final state: installed, the loop
 * closed, 01 selected and its row open.
 */
export default function System() {
  return (
    <section className="km km-system ac-sec ac-sec--ruled" data-surface="dark" aria-labelledby="km-system-h">
      {/* head: label → two-voice statement → rule → lede; the note carries the loop most teams run */}
      <div className="ac-head ac-wrap km-system__head">
        <div className="ac-labelrow">
          <p className="ac-label">The revenue operating system</p>
        </div>
        <h2 className="ac-statement" id="km-system-h">
          <span className="ac-line">
            <span>Three layers.</span>
          </span>
          <span className="ac-line ac-accent">
            <span>One closed loop.</span>
          </span>
        </h2>
        <span className="ac-rule" aria-hidden="true"></span>
        <p className="ac-lede">
          Kelwin installs all three in your company, so pipeline becomes a standing output, not a one-time deliverable.
        </p>
        <aside className="ac-note km-system__note" aria-label="The loop most teams run">
          <p className="ac-label">The loop most teams run</p>
          <p className="ac-note__t">
            Capital in, campaigns run, knowledge lost, reset. The loop conserves nothing — every cycle pays full price to
            relearn what the last one knew.
          </p>
        </aside>
      </div>

      {/* drawing left (cols 1–7) · ledger right (cols 9–12) */}
      <div className="ac-wrap ac-grid km-system__body">
        <Strata />

        {/* the ledger follows the red: the selected slab's row is the open one (during the pass too);
            pressing a row moves the red to its slab, pressing a slab opens its row */}
        <div className="ac-col km-system__detail" style={vars({ "--c": "9", "--s": "4" })}>
          <Ledger label="The three layers" script={reserveInline()}>
            {LAYERS.map(({ n, code, name, job, whatItIs, inPractice }, i) => (
              <li
                key={n}
                className={`ac-row${n === 1 ? " is-open is-cur" : ""}`}
                data-l={n}
                style={vars({ "--i": String(i) })}
              >
                <button
                  type="button"
                  className="ac-row__head"
                  aria-expanded={n === 1 ? "true" : "false"}
                  aria-disabled={n === 1 ? "true" : undefined}
                  aria-controls={`km-system-p${n}`}
                  id={`km-system-b${n}`}
                >
                  <span className="ac-idx">{code}</span>
                  <span className="km-system__rt">
                    <span className="ac-h4">{name}</span>
                    <span className="ac-support km-system__job">{job}</span>
                  </span>
                  <span className="ac-toggle" aria-hidden="true"></span>
                </button>
                <div className="ac-row__more" id={`km-system-p${n}`} role="region" aria-labelledby={`km-system-b${n}`}>
                  <div>
                    <div className="ac-row__in km-system__more">
                      <div className="km-system__kv">
                        <p className="ac-idx">What it is</p>
                        <p className="ac-support">{whatItIs}</p>
                      </div>
                      <div className="km-system__kv">
                        <p className="ac-idx">In practice</p>
                        <p className="ac-support">{inPractice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </Ledger>
          {/* the reading path ends on one quiet door (the section's one red stays the slab face) */}
          <div className="km-system__doors">
            <Link className="ac-link" href="/audit">
              Find your weakest layer
            </Link>
            <p className="ac-support km-system__tail">
              If we’re not the fix, the audit says so — and points you somewhere better.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
