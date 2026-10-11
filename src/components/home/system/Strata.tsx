import type { CSSProperties } from "react";
import { LAYERS, slabArea, slabFocus, slabLeft, slabRight, slabTop, type Layer } from "./layers";
import { CALLOUT_AFTER, DIM_AT, DIM_LABEL_AT, dropAt } from "./timing";

// custom properties as strings: unitless drawing coordinates must not pick up a "px"
const vars = (o: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, String(v)])) as CSSProperties;
const ms = (n: number) => `${n}ms`;

/* the drawing's short name, and what it shows (its description: read on request, not on every slab's focus) */
const LABEL = "Drawing of the three layers";
const DESCRIPTION =
  "Three flat slabs stacked in isometric, one per layer, each with its job drawn on its top face: 01 Narrative Systems carries lines of text, 02 GTM Infrastructure one signal routed three ways, 03 GTM Intelligence a ring that closes once the loop does. A dimension measures the three layers as one system. One return line leaves the bottom slab and runs back up into the top one, ending in an arrow and labelled feeds back what works: the loop is closed. The selected layer's top face is red and lifts slightly. Each slab is a button that opens its layer in the list.";

/** One slab: occluding faces, its inscription, inside a lift (the selected slab's 8-unit rise) and a
 *  drop (its entrance). The visible faces take the pointer; the hit layer is the keyboard stop. */
function Slab({ layer }: { layer: Layer }) {
  const { n, y0, inks, gap, nodes } = layer;
  const drop = dropAt(n);
  return (
    <g className={`km-system__s${n === 1 ? " is-on" : ""}`} data-l={n} aria-hidden="true">
      <g className="km-system__lift">
        <g className="km-system__drop" style={vars({ "--d": ms(drop) })}>
          <path className="km-system__side" d={slabLeft(y0)} />
          <path className="km-system__side" d={slabRight(y0)} />
          <path className="km-system__top" d={slabTop(y0)} />
          <g className="km-system__ins">
            {inks.map((ink) => (
              <path
                key={ink.d}
                className={`km-system__ink${ink.hero ? " km-system__ink--h" : ""}`}
                pathLength="1"
                style={vars({ "--d": ms(drop + ink.at), "--t": ms(ink.t) })}
                d={ink.d}
              />
            ))}
            {gap && <path className="km-system__gap" pathLength="1" d={gap} />}
            {nodes.map((node) => (
              <rect
                key={`${node.x},${node.y}`}
                className={`km-system__node${node.hub ? " is-hub" : ""}`}
                style={vars({ "--d": ms(drop + node.at) })}
                x={node.x}
                y={node.y}
                width="6"
                height="6"
              />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
}

/**
 * The strata (round 6): three rectangular slabs in true isometric, one inscription each; the selected
 * slab's top face is the section's one red. After assembly one return line runs from slab 03 back into
 * slab 01: the closed loop. Default markup = final state: installed, return drawn, 01 selected.
 * Every slab is a button: pointer and touch go to the visible faces (the slab painted on top is the one
 * pressed), the hit layer over the drawing — one role=button per slab, in reading order 01 → 03 — is the
 * keyboard stop. The drawing sits in drawing units (--u) so it scales with its column while the
 * annotations keep their type size.
 */
export default function Strata() {
  const painted = [...LAYERS].reverse(); // 03 → 01, so each slab's front tip covers the next one's back
  return (
    <figure className="ac-frame ac-col km-system__fig" style={vars({ "--c": 1, "--s": 7 })} data-sel="1">
      <span className="ac-reg ac-reg--tl" aria-hidden="true"></span>
      <span className="ac-reg ac-reg--tr" aria-hidden="true"></span>
      <span className="ac-reg ac-reg--bl" aria-hidden="true"></span>
      <span className="ac-reg ac-reg--br" aria-hidden="true"></span>
      <p id="km-system-fig-d" hidden>
        {DESCRIPTION}
      </p>
      <div className="ac-field km-system__field">
        <svg
          className="ac-svg km-system__svg"
          width="755"
          height="580"
          viewBox="6 0 755 580"
          role="group"
          aria-label={LABEL}
          aria-describedby="km-system-fig-d"
        >
          <g className="km-system__loop" aria-hidden="true">
            <path className="km-system__ret" pathLength="1" d="M147.5 403.5H110.5V139.5H149" />
            <rect className="km-system__src" x="145.5" y="401" width="5" height="5" />
            <path className="km-system__chev" d="M141 131.5L149 139.5L141 147.5" />
          </g>
          <path className="km-system__post" aria-hidden="true" d="M413.5 184V296M413.5 316V428" />
          {painted.map((layer) => (
            <Slab key={layer.n} layer={layer} />
          ))}
          <g className="km-system__hits">
            {LAYERS.map(({ n, code, name, y0 }) => (
              <g
                key={n}
                className={`km-system__hit${n === 1 ? " is-on" : ""}`}
                data-l={n}
                role="button"
                tabIndex={0}
                aria-label={`Layer ${code}, ${name}`}
                aria-controls={`km-system-p${n}`}
                aria-expanded={n === 1 ? "true" : "false"}
                aria-current={n === 1 ? "true" : undefined}
              >
                <g className="km-system__lift">
                  <path className="km-system__area" d={slabArea(y0)} />
                  <path className="km-system__focus" d={slabFocus(y0)} />
                </g>
              </g>
            ))}
          </g>
        </svg>
        <div className="km-system__anno" aria-hidden="true">
          <div className="ac-dim ac-dim--v km-system__dim" style={vars({ "--x": 662, "--y": 167, "--h": 264, "--dd": ms(DIM_AT), "--dl": ms(DIM_LABEL_AT) })}>
            <span className="ac-dim__v km-system__dv">
              <span className="km-system__dv-a">3 layers</span>
              <span className="km-system__dv-b">1 system</span>
            </span>
          </div>
          <p className="km-system__rlab" style={vars({ "--x": 92.5, "--y": 271.5 })}>
            Feeds back
            <br />
            what works
          </p>
          <div className="km-system__cos">
            {LAYERS.map(({ n, code, name, y0 }) => (
              <div key={n} className={`km-system__co${n === 1 ? " is-on" : ""}`} data-l={n}>
                <div className="km-system__col">
                  <div
                    className={`ac-callout${n === 1 ? " is-on" : ""}`}
                    style={vars({ "--x": 413, "--y": y0 + 92, "--len": "28px", "--cd": ms(dropAt(n) + CALLOUT_AFTER) })}
                  >
                    <span className="ac-callout__code">{code}</span>
                    <span className="ac-callout__t">{name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
