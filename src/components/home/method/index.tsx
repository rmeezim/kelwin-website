import type { CSSProperties } from "react";
import "./method.css";

/* method — the phase track (approved mockup: design/redesign/site/frag/method/U.*).
   Head (kit grammar): label → two-voice statement set on ONE line ("It starts with" + light
   "the audit."; two lines on the phone) → 48×2 rule → lede (cols 1–7) → Engagements note.
   One plate, read top → bottom and left → right: four phase columns (index · name · output) over
   a calibrated ruler; under the ruler the descending gantt in the same four bays; at the foot the
   time axis in the lede's own words: RUNS ONCE ──── HANDOVER ── KEEPS RUNNING ──→ (off the page).
   Only the audit is measured: ten working-day intervals over the red Diagnose bar, then an axis
   break. The Handover datum is the one vertical through the gantt; past it only Calibrate (white,
   off the page) and the optional retainer (a dotted hairline) carry on.

   Geometry (the 1440 stage: plate 1312 wide, bay k starts at 25%·k, text and bars at bay + 32px)
   is fluid in x; the column zone is as tall as its text (≥ 252px) and the gantt below it is a fixed
   204px band, so every gantt coordinate is "ruler + n" (see method.css). ≤1023px the plate stacks:
   one card per phase, each carrying its own bar. */

/* the ten audit intervals: index and the off-pitch offset each tick settles from */
const TICKS: { i: number; j: number; major?: boolean }[] = [
  { i: 0, j: 5, major: true },
  { i: 1, j: -4 },
  { i: 2, j: 7 },
  { i: 3, j: -6 },
  { i: 4, j: 3 },
  { i: 5, j: -8, major: true },
  { i: 6, j: 6 },
  { i: 7, j: -3 },
  { i: 8, j: 8 },
  { i: 9, j: -5 },
  { i: 10, j: 4, major: true },
];

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export default function Method() {
  return (
    <section
      className="km km-method ac-sec"
      id="methodology"
      data-surface="dark"
      aria-labelledby="km-method-h"
    >
      <div className="ac-head ac-wrap">
        <div className="ac-labelrow">
          <p className="ac-label">The method</p>
        </div>
        <h2 className="ac-statement" id="km-method-h">
          <span className="ac-line">
            <span>It starts with</span>
          </span>{" "}
          <span className="ac-line ac-accent">
            <span>the audit.</span>
          </span>
        </h2>
        <span className="ac-rule" aria-hidden="true" />
        <p className="ac-lede">
          The first three phases run once, in order. The fourth is the operating retainer&nbsp;— it
          keeps running, because a system left alone drifts the moment the market moves.
        </p>
        <aside className="ac-note" aria-label="Engagements">
          <p className="ac-label">Engagements</p>
          <p className="ac-note__t">
            Install first, then an operating retainer — <span className="km-method__nb">on a system you own.</span>
          </p>
        </aside>
      </div>

      <div className="ac-wrap km-method__body">
        <figure className="km-method__fig">
          <div className="ac-plate km-method__plate">
            <div className="ac-field km-method__field">
              {/* the drawing: plate-wide construction, positioned in plate coordinates */}
              <div className="km-method__draw" aria-hidden="true">
                {/* bay dividers: through the column zone only, so the gantt keeps one vertical (the datum) */}
                <svg className="ac-svg km-method__g km-method__g--div1">
                  <line className="ac-s-faint km-method__div" style={v({ "--i": 0 })} pathLength={1} x1=".5" y1="0" x2=".5" y2="100%" />
                </svg>
                <svg className="ac-svg km-method__g km-method__g--div2">
                  <line className="ac-s-faint km-method__div" style={v({ "--i": 1 })} pathLength={1} x1=".5" y1="0" x2=".5" y2="100%" />
                </svg>

                {/* lane guides (construction): Kelwin's schedule window, so they stop at the Handover datum */}
                <svg className="ac-svg km-method__g km-method__g--lanes km-method__lanes">
                  <line className="ac-s-faint ac-s-dash" x1="0" y1=".5" x2="100%" y2=".5" />
                  <line className="ac-s-faint ac-s-dash" x1="0" y1="32.5" x2="100%" y2="32.5" />
                  <line className="ac-s-faint ac-s-dash" x1="0" y1="64.5" x2="100%" y2="64.5" />
                  <line className="ac-s-faint ac-s-dash" x1="0" y1="96.5" x2="100%" y2="96.5" />
                </svg>

                {/* the ruler: calibrated over the audit, broken, then indicative */}
                <svg className="ac-svg km-method__g km-method__g--rula">
                  <line className="ac-s-mute km-method__rul km-method__rul--a" pathLength={1} x1="0" y1=".5" x2="100%" y2=".5" />
                </svg>
                <svg className="ac-svg km-method__g km-method__g--rulb">
                  <line className="ac-s-mute km-method__rul km-method__rul--b" pathLength={1} x1="0" y1=".5" x2="100%" y2=".5" />
                </svg>
                <svg className="ac-svg km-method__g km-method__g--brk km-method__brk">
                  <line className="ac-s" x1=".5" y1="13" x2="7.5" y2="0" />
                  <line className="ac-s" x1="10.5" y1="13" x2="17.5" y2="0" />
                </svg>

                {/* phase gates on the indicative stretch: marked, not scaled */}
                <svg className="ac-svg km-method__g km-method__g--gate1 km-method__gates">
                  <line className="ac-s km-method__gate" x1=".5" y1=".5" x2=".5" y2="9" />
                </svg>
                <svg className="ac-svg km-method__g km-method__g--gate2 km-method__gates">
                  <line className="ac-s km-method__gate" x1=".5" y1=".5" x2=".5" y2="9" />
                </svg>

                {/* the Handover datum: drawn up from its label on the time axis to the plate's top edge */}
                <svg className="ac-svg km-method__g km-method__g--datum">
                  <line className="km-method__datum" pathLength={1} x1=".5" y1="100%" x2=".5" y2="0" />
                </svg>
                <svg className="ac-svg km-method__g km-method__g--dnode">
                  <rect className="km-method__dnode" x="1" y="1" width="7" height="7" />
                </svg>

                {/* the time axis, the run-once stretch (its label and the Handover label knock out of it) */}
                <svg className="ac-svg km-method__g km-method__g--axl">
                  <line className="ac-s-mute km-method__axl" pathLength={1} x1=".5" y1=".5" x2="100%" y2=".5" />
                </svg>
                <svg className="ac-svg km-method__g km-method__g--axt">
                  <line className="ac-s-mute km-method__axt" x1=".5" y1="0" x2=".5" y2="11" />
                </svg>
              </div>

              {/* read first: 01–03 run once (drawn at the foot of the plate, on the time axis) */}
              <p className="ac-cap km-method__kside">Runs once</p>

              <ol className="km-method__cols" aria-label="The four phases">
                <li className="km-method__col km-method__col--1">
                  <div className="km-method__txt">
                    <p className="ac-idx km-method__idx">01 · Start</p>
                    <h3 className="ac-h3 km-method__name">Diagnose</h3>
                    <p className="ac-idx km-method__key">Output</p>
                    <p className="ac-body km-method__out">The real constraint, named — in a written readout.</p>
                  </div>
                  {/* the audit's ten working days, calibrated on the ruler over its bar */}
                  <span className="km-method__ticks" aria-hidden="true">
                    <svg className="ac-svg km-method__tb">
                      <line className="km-method__tbase" x1="0" y1=".5" x2="100%" y2=".5" />
                    </svg>
                    {TICKS.map(({ i, j, major }) => (
                      <svg key={i} className="ac-svg km-method__tk" style={v({ "--i": i })}>
                        <line
                          className={major ? "km-method__tick km-method__tick--maj" : "km-method__tick"}
                          style={v({ "--i": i, "--j": `${j}px` })}
                          x1=".5"
                          y1=".5"
                          x2=".5"
                          y2={major ? "9" : "5"}
                        />
                      </svg>
                    ))}
                  </span>
                  <span className="km-method__bar km-method__bar--1" aria-hidden="true" />
                  <p className="ac-cap km-method__dim">
                    <span className="km-method__dimt">
                      10 working days · <span className="km-method__dimnb">the System Audit</span>
                    </span>
                  </p>
                </li>
                <li className="km-method__col km-method__col--2">
                  <div className="km-method__txt">
                    <p className="ac-idx km-method__idx">02</p>
                    <h3 className="ac-h3 km-method__name">Architect</h3>
                    <p className="ac-idx km-method__key">Output</p>
                    <p className="ac-body km-method__out">Operating model, written down.</p>
                  </div>
                  <span className="km-method__bar km-method__bar--2" aria-hidden="true" />
                </li>
                <li className="km-method__col km-method__col--3">
                  <div className="km-method__txt">
                    <p className="ac-idx km-method__idx">03</p>
                    <h3 className="ac-h3 km-method__name">Install</h3>
                    <p className="ac-idx km-method__key">Output</p>
                    <p className="ac-body km-method__out">In use across the team.</p>
                  </div>
                  <span className="km-method__bar km-method__bar--3" aria-hidden="true" />
                </li>
                <li className="km-method__col km-method__col--4">
                  {/* the datum's one label, read in order between 03 and 04 (the thread from the handover
                      section); placed on the time axis in plate coordinates */}
                  <p className="ac-cap km-method__ho">Handover</p>
                  <div className="km-method__txt">
                    <p className="ac-idx km-method__idx">04 · Continuous</p>
                    <h3 className="ac-h3 km-method__name">Calibrate</h3>
                    <p className="ac-idx km-method__key">Output</p>
                    <p className="ac-body km-method__out">
                      A standing signal review — yours, run by your operator or with us on retainer.
                    </p>
                  </div>
                  {/* after handover, Kelwin's lane may carry on: the optional retainer, a dotted hairline off the page */}
                  <p className="ac-cap km-method__retl" aria-hidden="true">With us on retainer</p>
                  <svg className="km-method__ret" aria-hidden="true" focusable="false">
                    <line x1="0" y1=".5" x2="100%" y2=".5" />
                  </svg>
                  <span className="km-method__bar km-method__bar--4" aria-hidden="true">
                    <span className="km-method__pkt" />
                  </span>
                  <p className="km-method__yours">
                    <span className="ac-cap">Keeps running</span>
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
