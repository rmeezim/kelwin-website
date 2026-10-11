import type { CSSProperties } from "react";
import { FILTERED, G, SIG } from "./noise";
import "./principle.css";

/* The operating principle · "In a noisy market, the clearest company wins." (approved mockup:
   design/redesign/site/frag/principle/S). A calm paper sheet inside a registration frame: nine lines of market
   noise (CONTOUR) settle into the one line that enters "the clearest", and one clean line leaves it for the red
   tick on the frame edge. Default markup = the final state (the filtered drawing); behavior.ts plays the settle. */

const P = "km-principle";
const c = (name: string) => `${P}__${name}`;
const vars = (v: Record<string, string>) => v as CSSProperties;

/* the four registration marks: frame corners, offset outside the content box by --reg-off (principle.css) */
const REGS = [
  { x: "0px", y: "calc(-1 * var(--reg-off))", d: "120ms" },
  { x: "100%", y: "calc(-1 * var(--reg-off))", d: "200ms" },
  { x: "0px", y: "calc(100% + var(--reg-off))", d: "280ms" },
  { x: "100%", y: "calc(100% + var(--reg-off))", d: "360ms" },
];

export default function Principle() {
  return (
    <section className={`km ${P} ac-sec ac-sec--lg`} data-surface="light" aria-labelledby={`${P}-title`}>
      <div className="ac-wrap">
        {/* the sheet: a registration frame (four corner marks, no drawn border); the drawing and the text share it */}
        <div className={`ac-frame ${c("frame")}`}>
          {REGS.map((r, i) => (
            <span key={i} className={`ac-reg ${c("reg")}`} style={vars({ "--x": r.x, "--y": r.y, "--d": r.d })} aria-hidden="true" />
          ))}

          <div className={`ac-head ${c("head")}`} style={vars({ "--ac-d0": "0ms" })}>
            <div className="ac-labelrow">
              <p className="ac-label">Operating principle</p>
            </div>

            {/* the principle; "the clearest" rides the datum: noise enters at its left, one signal leaves at its right */}
            <h2 className="ac-statement ac-statement--xl" id={`${P}-title`}>
              <span className="ac-line">
                <span>In a noisy market,</span>
              </span>{" "}
              <span className={`ac-line ac-accent ${c("through")}`}>
                <span>
                  <span className={c("word")}>the clearest</span>
                  <span className={c("out")} aria-hidden="true">
                    <span className={c("wire")} />
                    <span className={c("tick")} />
                  </span>
                </span>
              </span>{" "}
              <span className="ac-line ac-accent">
                <span>company wins.</span>
              </span>
            </h2>

            {/* CONTOUR: nine lines of market noise, filtered into the one line that carries on */}
            <svg
              className={`ac-svg ${c("noise")}`}
              width={G.W}
              height={G.H}
              viewBox={`0 0 ${G.W} ${G.H}`}
              aria-hidden="true"
              focusable="false"
            >
              <g className={c("bundle")} transform="translate(0 .5)">
                {FILTERED.map((d, i) => (
                  <path key={i} className={i === SIG ? `${c("wave")} ${c("wave--sig")}` : c("wave")} d={d} />
                ))}
              </g>
            </svg>

            <p className={`${c("tag")} ${c("tag--a")}`} aria-hidden="true">
              <span className="ac-callout__code">A</span>
              <span className="ac-callout__t">Input · market noise</span>
            </p>
            <p className={`${c("tag")} ${c("tag--b")}`} aria-hidden="true">
              <span className="ac-callout__t">Output · one signal</span>
              <span className="ac-callout__code">B</span>
            </p>

            <span className="ac-rule" aria-hidden="true" />
            <p className="ac-lede">Not the loudest. Not the busiest.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
