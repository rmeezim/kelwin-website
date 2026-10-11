import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { SETS, type FitRow, type FitSet } from "./data";
import "./fit.css";

/* fit — "Who it's for": two ledgers, the gate both ways.
   Port of design/redesign/site/frag/fit/U (round 5, approved).
   The two 42px ledger heads ARE the headline: no two-voice statement, no drawing, no button.
   Left (cols 1–4): a sticky lede column (label → lede → quiet link), not a pin.
   Right (cols 6–12): Built for over Not for. One row rests open in each, and the two open rows
   face each other: F-02 "Someone will own it" (the yes) · D-01 "Rent-it-forever" (the no).
   Open rows show body text only. The markup is the final state; behavior.ts plays the reveal. */
export default function Fit() {
  return (
    <section className="km km-fit ac-sec" data-surface="light" aria-labelledby="km-fit-h">
      <div className="ac-wrap">
        <div className="ac-grid km-fit__body">
          <div className="ac-col km-fit__side" style={{ "--c": 1, "--s": 4 } as CSSProperties}>
            <h2 className="ac-label km-fit__label" id="km-fit-h">
              Who it’s for
            </h2>
            <p className="ac-lede km-fit__lede">
              The audit is a gate, and it works in both directions — who we say yes to, and the honest list of
              who we send away.
            </p>
            <Link className="ac-link km-fit__link" href="/who-we-work-with">
              Three situations, told from inside
            </Link>
          </div>

          <div className="ac-col km-fit__sets" style={{ "--c": 6, "--s": 7 } as CSSProperties}>
            {SETS.map((set) => (
              <Ledger key={set.key} set={set} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* One ledger: sign · heading ……… sub  03, its head rule, then the rows. */
function Ledger({ set }: { set: FitSet }) {
  return (
    <div className={`km-fit__set km-fit__set--${set.key}`}>
      <div className="km-fit__sh">
        <span className="km-fit__sign" aria-hidden="true">
          {set.sign}
        </span>
        <h3 className="km-fit__mask">
          <span className="ac-h3 ac-h3--lg">{set.title}</span>
        </h3>
        <p className="km-fit__sub">
          <span className="ac-support">{set.sub}</span>
          <span className="ac-idx">
            <span aria-hidden="true">{String(set.rows.length).padStart(2, "0")}</span>
            <span className="ac-sr">{set.rows.length} criteria</span>
          </span>
        </p>
      </div>
      <span className="km-fit__rule" aria-hidden="true"></span>

      <div className="ac-ledger km-fit__lg">
        {set.rows.map((row, i) => (
          <Row key={row.code} row={row} i={i} head={`km-fit-${set.stem}h${i + 1}`} panel={`km-fit-${set.stem}${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* A ledger row that opens in place: a real button (expanded/collapsed) over a region that is
   inert while closed, so a closed answer can't be tabbed into. */
function Row({ row, i, head, panel }: { row: FitRow; i: number; head: string; panel: string }) {
  const open = !!row.open;
  return (
    <div className={open ? "ac-row is-open" : "ac-row"} style={{ "--i": i } as CSSProperties}>
      <button className="ac-row__head" type="button" id={head} aria-expanded={open} aria-controls={panel}>
        <span className="ac-idx">{row.code}</span>
        <span className="ac-h4">
          <Title text={row.title} />
        </span>
        <span className="ac-support">{row.desc}</span>
        <span className="ac-toggle" aria-hidden="true"></span>
      </button>
      <div className="ac-row__more" id={panel} role="region" aria-labelledby={head} inert={!open}>
        <div>
          <div className="ac-row__in">
            <p className="km-fit__p">
              {row.body.map((s, k) => (
                <Fragment key={k}>
                  {k > 0 && " "}
                  <span>{s}</span>
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* A row title. Hyphenated compounds ("Committee-decided", "self-serve") are kept whole, so a
   narrow phone wraps the title between words, never after a hyphen. Markup only: the copy is
   unchanged. Only the compounds are cut out; every space stays inside a run of the title's own
   text ("Real revenue, felt ceiling" is one text node, " sales" keeps its space). A space rendered
   as a text node of its own sits between React's <!-- --> separators in the server HTML, and Chrome
   drops it from the accessible name ("Realrevenue,feltceiling"). */
function Title({ text }: { text: string }) {
  return text
    .split(/(\S*-\S*)/)
    .filter(Boolean)
    .map((part, k) =>
      part.includes("-") ? (
        <span key={k} className="km-fit__nb">
          {part}
        </span>
      ) : (
        part
      ),
    );
}
