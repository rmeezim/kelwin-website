import Link from "next/link";
import type { CSSProperties } from "react";
import { READINGS } from "./readings";
import "./evidence.css";

/* 03 · Structural evidence — "the numeral wall" (approved mockup: design/redesign/site/frag/evidence/T).
   The four published readings stand as four big numerals, and the numerals ARE the control:
   real toggle buttons in a role=toolbar (roving focus). Pressing one swaps the fixed-height
   readout beneath — the finding, its "so what", the detail — and re-measures it as a share of
   100 on a single bar. The markup is the final, resting state (01 pressed, the red 17% bar
   drawn); behavior.ts plays the entrance and the one calm automatic pass. */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export default function Evidence() {
  return (
    <section className="km km-evidence ac-sec" data-surface="light" aria-labelledby="km-evidence-h">
      {/* head grammar (standard .ac-head): label → two-voice statement → rule → lede */}
      <div className="ac-head ac-wrap">
        <div className="ac-labelrow">
          <p className="ac-label">The structural read</p>
        </div>
        <h2 className="ac-statement" id="km-evidence-h">
          <span className="ac-line">
            <span>Four numbers.</span>
          </span>
          <span className="ac-line ac-accent">
            <span>One diagnosis.</span>
          </span>
        </h2>
        <span className="ac-rule" aria-hidden="true" />
        <p className="ac-lede">Every one gets blamed on the pipeline. Not one of them moves with more activity.</p>
      </div>

      <div className="ac-wrap km-evidence__body">
        {/* THE WALL: four toggle buttons, one pressed at a time; selection follows focus (arrows, Home/End). */}
        <div className="ac-grid km-evidence__wall" role="toolbar" aria-label="Four readings. Choose one to read it.">
          {READINGS.map((r, i) => (
            <button
              key={r.idx}
              type="button"
              className="km-evidence__cell"
              aria-pressed={i === 0}
              aria-controls="km-evidence-ro"
              data-n={i}
              tabIndex={i === 0 ? 0 : -1}
              style={v({ "--i": i })}
            >
              <span className="km-evidence__top">
                <span className="km-evidence__led" aria-hidden="true" />
                <span className="ac-idx km-evidence__idx">{r.idx}</span>
              </span>
              <span className="km-evidence__mask">
                <span className="ac-num km-evidence__num">
                  {r.num}
                  <span className="ac-num__u">{r.unit}</span>
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* THE READOUT: one fixed-height panel; the four readings are stacked in one grid cell, so a
            press never reflows. Text on cols 1–6, MEASURE on cols 7–12 (both on a cell edge above). */}
        <div className="ac-grid km-evidence__ro" id="km-evidence-ro" aria-live="polite">
          <div className="km-evidence__text">
            {READINGS.map((r, i) => (
              <div key={r.idx} className={i === 0 ? "km-evidence__panel is-on" : "km-evidence__panel"} data-n={i}>
                <p className="km-evidence__claim">{r.claim}</p>
                <p className="km-evidence__so">{r.so}</p>
                <p className="km-evidence__detail">{r.detail}</p>
              </div>
            ))}
          </div>

          <div className="km-evidence__measure">
            {/* MEASURE: a 1px track with end ticks at 0 and 100, one 10px bar, the value flagged at the
                fill's end. Red only while 01 is pressed (the resting state); the others fill in ink. */}
            <div className="km-evidence__gauge is-red" data-on="0" style={v({ "--v": READINGS[0].at })} aria-hidden="true">
              <span className="km-evidence__track" />
              <span className="km-evidence__fill" />
              {READINGS.map((r, i) => (
                <span
                  key={r.idx}
                  className={r.at > 0.7 ? "ac-cap km-evidence__val km-evidence__val--end" : "ac-cap km-evidence__val"}
                  data-n={i}
                  style={v({ "--at": r.at })}
                >
                  {r.val}
                </span>
              ))}
              <span className="ac-cap km-evidence__rest" data-n="1">
                95 not buying
              </span>
            </div>
            <div className="km-evidence__words">
              {READINGS.map((r, i) => (
                <div key={r.idx} className={i === 0 ? "km-evidence__panel is-on" : "km-evidence__panel"} data-n={i}>
                  <p className="km-evidence__unit">
                    <span className="ac-sr">{r.sr}</span>
                    {r.unitText}
                  </p>
                  <p className="ac-cap km-evidence__src">{r.src}</p>
                </div>
              ))}
            </div>
            <Link className="ac-link km-evidence__door" href="/insights/the-17-percent-window">
              Field note · The 17% window · 5 min
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
