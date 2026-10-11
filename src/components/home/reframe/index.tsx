import Link from "next/link";
import type { CSSProperties } from "react";
import { geo, mesh, statics } from "./geometry";
import "./reframe.css";

/* 02 · The reframe — "Surface, cut to architecture" (approved mockup:
   design/redesign/site/frag/reframe/U). The head names the misdiagnosis; one plate holds a
   true-isometric section cut whose meaning is a two-state toggle (Surface | Architecture):
   a warped lattice carrying the three symptoms resolves to a true grid over a deep block cut
   into three bays, one under each symptom, and one red datum seats on the real layer. The
   strips beneath strike each symptom over the layer that really produces it.
   The markup is the final, resting state (Architecture); behavior.ts opens the plate in Surface
   and plays the one resolve. Drawing coordinates are unitless 1440-stage units (the field is
   1312×424 there); reframe.css maps them to px per breakpoint (--u, --ox, --oy). */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/* SURFACE: the three symptoms, pinned to the bulges over each bay (labels on one column, right) */
const TAGS = [
  { c: "01", t: "Pipeline", x: 788.7, y: 36.5, len: 273 },
  { c: "02", t: "Sales execution", x: 876.3, y: 95.1, len: 186 },
  { c: "03", t: "Tooling", x: 958.2, y: 140.5, len: 104 },
];
/* ARCHITECTURE: the three bays of the cut, keyed 01–03 to the symptom above each (labels on one column, left) */
const BAYS = [
  { c: "01", t: "Narrative architecture", x: 649.9, y: 248, len: 70 },
  { c: "02", t: "GTM infrastructure", x: 740, y: 300, len: 160 },
  { c: "03", t: "GTM intelligence", x: 830.1, y: 352, len: 250 },
];
/* the two spans, measured once the cut is true: a thin surface over a deep architecture */
const DIMS = [
  { t: "Surface", x: 1042, y: 190, h: 30 },
  { t: "Architecture", x: 1042, y: 220, h: 96 },
];
/* the strips: each struck symptom over the layer that really produces it */
const STRIPS = [
  {
    idx: "01",
    was: "A pipeline problem.",
    t: "Narrative architecture.",
    foot: "The market can’t repeat what it doesn’t understand — pipeline built on unclear positioning fails at the source.",
  },
  {
    idx: "02",
    was: "A sales execution problem.",
    t: "GTM infrastructure.",
    foot: "Teams execute what the system installs — replacing the rep before the protocol replaces nothing.",
  },
  {
    idx: "03",
    was: "A tooling or tech-stack problem.",
    t: "GTM intelligence.",
    foot: "Tools amplify what your data already knows — a new platform on a blind dataset multiplies the blindness.",
  },
];

const FIG_LABEL =
  "Section cut. Surface state: a warped lattice carries three symptom tags, pipeline, sales execution and tooling, over an architecture drawn only in dashed hidden lines. Architecture state: the lattice resolves to a true grid, the block beneath it is drawn in three bays, one under each symptom: narrative architecture, GTM infrastructure and GTM intelligence, and one red datum line seats along the top of the real layer.";

export default function Reframe() {
  const lattice = mesh(geo().T); // the true grid: the resting (Architecture) state
  const s = statics();

  return (
    <section className="km km-reframe ac-sec ac-sec--ruled" data-surface="dark" aria-labelledby="km-reframe-h">
      {/* head grammar (echoes the hero): label → two-voice statement → rule → lede → quiet door */}
      <div className="ac-head ac-wrap">
        <div className="ac-labelrow">
          <p className="ac-label">The reframe</p>
        </div>
        <h2 className="ac-statement" id="km-reframe-h">
          <span className="ac-line">
            <span>Most teams are fixing</span>
          </span>
          <span className="ac-line ac-accent">
            <span>the wrong layer.</span>
          </span>
        </h2>
        <span className="ac-rule" aria-hidden="true" />
        <p className="ac-lede">
          Most firms treat the surface — campaigns, conversion, reps. Kelwin diagnoses the architecture that produces it.
        </p>
        <div className="ac-doors">
          <Link className="ac-link" href="/#methodology">
            See the diagnostic method
          </Link>
        </div>
      </div>

      <div className="ac-wrap km-reframe__body">
        {/* LATTICE section cut. Surface: a warped lattice over the dashed, unseen architecture, the three
            symptoms pinned to its bulges. Architecture: the lattice resolves to true, the cut plots solid bay
            by bay (each bay directly beneath its symptom), and the red datum seats on the real layer. */}
        <figure className="ac-plate km-reframe__fig">
          <div className="ac-field km-reframe__field">
            <div className="km-reframe__ro" aria-live="polite">
              <p className="ac-h3 km-reframe__rs km-reframe__rs--s" aria-hidden="true">
                <span>Fix the surface,</span>
                <span className="ac-accent">and it returns.</span>
              </p>
              <p className="ac-h3 km-reframe__rs km-reframe__rs--a">
                <span>Fix the architecture,</span>
                <span className="ac-accent">and it compounds.</span>
              </p>
            </div>

            <div className="km-reframe__draw">
              <svg
                className="ac-svg km-reframe__svg"
                width="1312"
                height="424"
                viewBox="0 0 1312 424"
                role="img"
                aria-label={FIG_LABEL}
              >
                <g className="km-reframe__ghost">
                  <g className="km-reframe__in" style={v({ "--d": "760ms" })}>
                    <path className="ac-s-mute ac-s-dash" d={s.ghost} />
                  </g>
                </g>
                <g className="km-reframe__hid">
                  <g className="km-reframe__in" style={v({ "--d": "800ms" })}>
                    <path className="ac-s-faint ac-s-dash" d={s.hidden} />
                  </g>
                </g>
                <g className="km-reframe__cut">
                  {s.edges.map((d, k) => (
                    <path key={d} className="km-reframe__c km-reframe__c--edge" pathLength={1} style={v({ "--k": k })} d={d} />
                  ))}
                  <path className="km-reframe__drops" d={s.drops} />
                  {s.bays.map((d, k) => (
                    <path key={d} className="km-reframe__c km-reframe__c--bay" pathLength={1} style={v({ "--k": k })} d={d} />
                  ))}
                  <path className="km-reframe__cells" d={s.cells} />
                </g>
                <path className="ac-s-red km-reframe__datum" pathLength={1} d={s.datum} />
                <g className="km-reframe__mesh">
                  {lattice.lines.map((d, n) => (
                    <path key={n} className="km-reframe__m ac-plot" pathLength={1} style={v({ "--n": n })} d={d} />
                  ))}
                  <path className="km-reframe__gaps" d={lattice.gaps} />
                </g>
              </svg>

              {/* phone only: the drawing keeps its keys as pins — the symptoms hang above the surface,
                  the causes below the cut — and the labels read as a list beneath (reframe.css §5) */}
              <div className="km-reframe__pins km-reframe__pins--tags" aria-hidden="true">
                {TAGS.map((p) => (
                  <span key={p.c} className="km-reframe__pin km-reframe__pin--up" data-c={p.c} style={v({ "--px": p.x, "--py": p.y })} />
                ))}
              </div>
              <div className="km-reframe__pins km-reframe__pins--bays" aria-hidden="true">
                {BAYS.map((p) => (
                  <span key={p.c} className="km-reframe__pin km-reframe__pin--down" data-c={p.c} style={v({ "--px": p.x, "--py": p.y })} />
                ))}
              </div>

              {/* SURFACE: the three symptoms, pinned to the bulges over each bay (labels on one column, right) */}
              <div className="km-reframe__tags" aria-hidden="true">
                {TAGS.map((p) => (
                  <div key={p.c} className="ac-callout km-reframe__co" style={v({ "--px": p.x, "--py": p.y, "--pl": p.len })}>
                    <span className="ac-callout__code">{p.c}</span>
                    <span className="ac-callout__t">{p.t}</span>
                  </div>
                ))}
              </div>
              {/* ARCHITECTURE: the three bays of the cut, keyed 01–03 to the symptom above each (labels on one column, left) */}
              <div className="km-reframe__bays">
                {BAYS.map((p) => (
                  <div
                    key={p.c}
                    className="ac-callout ac-callout--l km-reframe__co"
                    style={v({ "--px": p.x, "--py": p.y, "--pl": p.len })}
                  >
                    <span className="ac-callout__code">{p.c}</span>
                    <span className="ac-callout__t">{p.t}</span>
                  </div>
                ))}
              </div>
              {/* the two spans, measured once the cut is true: a thin surface over a deep architecture */}
              <div className="km-reframe__dims">
                {DIMS.map((p) => (
                  <div key={p.t} className="ac-dim ac-dim--v km-reframe__dim" style={v({ "--px": p.x, "--py": p.y, "--ph": p.h, "--d": "0ms" })}>
                    <span className="ac-dim__v">{p.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <figcaption className="ac-capband">
            <span className="ac-seg km-reframe__seg" role="tablist" aria-label="Figure state">
              <button type="button" role="tab" aria-selected="false" tabIndex={-1} data-state="surface">
                Surface
              </button>
              <button type="button" role="tab" aria-selected="true" tabIndex={0} data-state="arch">
                Architecture
              </button>
            </span>
          </figcaption>
        </figure>

        {/* the strips: each struck symptom over the layer that really produces it */}
        <ol className="ac-strips ac-cascade km-reframe__strips" style={v({ "--n": 3 })}>
          {STRIPS.map((p, i) => (
            <li key={p.idx} className="ac-strip" style={v({ "--i": i })}>
              <p className="km-reframe__was">
                <span className="ac-idx">{p.idx}</span>
                <s>{p.was}</s>
              </p>
              <h3 className="ac-h3 km-reframe__t">{p.t}</h3>
              <p className="ac-support ac-strip__foot">{p.foot}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
