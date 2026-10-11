import type { CSSProperties } from "react";
import { ASSETS, CAPS, COL, DX, DZ, IX, KZ, MID, SH, SW, sheetShapes, type Asset, type Shape } from "./data";
import "./handover.css";

/* The handover · "If we leave, the system stays." (approved mockup: design/redesign/site/frag/handover/U).
   Six FOLIO sheets cross a vertical Handover datum onto your side; under each, its name, tag, the letter's margin
   line it ends (struck) and what replaces it. Each sheet is a disclosure button that opens a small detail card.
   Default markup = the final state: all six handed over, every line struck (behavior.ts plays the spread). */

const P = "km-handover";
const c = (name: string) => `${P}__${name}`;
const vars = (v: Record<string, string | number>) => v as CSSProperties;

function SheetShape({ s }: { s: Shape }) {
  const cls = s.cls.split(" ").map((x) => (x.startsWith(P) ? x : c(x))).join(" ");
  return s.kind === "path" ? <path className={cls} d={s.d} /> : <rect className={cls} x={s.x} y={s.y} width={s.w} height={s.h} />;
}

/** One sheet copy: paper, edge, index, then its furniture. */
function SheetCopy({ n, kind }: { n: string; kind: "own" | "draft" }) {
  return (
    <svg className={c(kind)} width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} aria-hidden="true" focusable="false">
      <rect className={c("pp")} width={SW} height={SH} />
      <rect className={c("ed")} x={0.5} y={0.5} width={SW - 1} height={SH - 1} />
      <text className={c("ix")} x={IX.x} y={IX.y}>
        {n}
      </text>
      {sheetShapes(n, kind).map((s, k) => (
        <SheetShape key={k} s={s} />
      ))}
    </svg>
  );
}

/* the item: the sheet is a disclosure button (its name for screen readers, its card's line as the description);
   the card is the item's last child, outside the subgrid flow. Cards of 01–03 open to the sheet's right, 04–06 to
   its left (toward the figure's centre), so a card never covers its own sheet. */
function Item({ a, i, pair }: { a: Asset; i: number; pair: number }) {
  const pop = `${P}-pop-${a.n}`;
  return (
    <div className={`${c("item")}${i > 2 ? ` ${c("item--l")}` : ""}`} data-n={a.n} style={vars({ "--col": COL[i], "--i": i, "--tr": 4 + pair * 5 })}>
      <button className={c("slot")} type="button" aria-expanded="false" aria-controls={pop} aria-describedby={`${pop}-d`}>
        <span className="ac-sr">About {a.name}</span>
        <svg className={c("ph")} width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} aria-hidden="true" focusable="false">
          <rect x={0.5} y={0.5} width={SW - 1} height={SH - 1} />
        </svg>
        <span className={c("lift")}>
          <span className={c("sheet")}>
            <SheetCopy n={a.n} kind="draft" />
            <SheetCopy n={a.n} kind="own" />
          </span>
        </span>
      </button>
      <h4 className={c("nm")}>{a.name}</h4>
      <p className={`ac-cap ${c("tag")}`}>{a.tag}</p>
      <p className={c("was")}>
        <span className="ac-sr">Without the system: </span>
        <span className={c("was-t")}>{a.was}</span>
        <svg className={c("strike")} aria-hidden="true" focusable="false" />
      </p>
      <p className={c("now")}>
        <span className="ac-sr">With the system: </span>
        {a.now}
      </p>
      <div className={c("pop")} id={pop}>
        <p className={c("pk")} aria-hidden="true">
          <span className={c("pi")}>{a.n}</span>
          <span className={c("pr")} />
          <span className={c("pt")}>{a.tag}</span>
        </p>
        <p className={c("pname")} aria-hidden="true">
          {a.name}
        </p>
        <p className={c("pd")} id={`${pop}-d`}>
          {a.d.pre}
          {a.d.nb ? <span className={c("nb")}>{a.d.nb}</span> : null}
          {a.d.post}
        </p>
      </div>
    </div>
  );
}

export default function Handover() {
  return (
    <section className={`km ${P} ac-sec`} data-surface="dark" aria-labelledby={`${P}-h`}>
      {/* head: the kit grammar on the hero's diagonal. The statement holds cols 1–7 with the red rule under it;
          the lede sits in cols 8–12, bottom-aligned so its last baseline lands on the statement's. */}
      <div className={`ac-head ac-wrap ${c("head")}`}>
        <div className="ac-labelrow">
          <p className="ac-label">What you own</p>
        </div>
        <h2 className="ac-statement" id={`${P}-h`}>
          <span className="ac-line">
            <span>If we leave,</span>
          </span>
          <span className="ac-line ac-accent">
            <span>the system stays.</span>
          </span>
        </h2>
        <span className="ac-rule" aria-hidden="true" />
        <p className="ac-lede">
          Same team, same market. What changes is the system underneath — six assets installed in your stack, in your
          language, documented so they survive team changes.
        </p>
      </div>

      {/* the spread, drawn straight on the section (no plate). The key column is only the figure's left end: the
          drafts' footprint with its arrow to the datum and a quiet key under it. The Handover datum runs the
          figure's full height; the six sheets sit in a row on your side. */}
      <figure className={`ac-wrap ${c("fig")}`}>
        <div className={c("grid")}>
          <div className={c("datum")} aria-hidden="true">
            <span className={c("dline")} />
            <span className="ac-reg ac-reg--tl" />
            <span className="ac-reg ac-reg--bl" />
          </div>

          <p className={`ac-cap ${c("dl")}`} aria-hidden="true">
            Handover
          </p>
          <div className={c("deck")} aria-hidden="true">
            <svg className={c("decksvg")} width={KZ + DZ} height={SH} viewBox={`0 0 ${KZ + DZ} ${SH}`} focusable="false">
              <rect className={c("fp")} x={0.5} y={0.5} width={SW - 1} height={SH - 1} />
              <path className={c("way-l")} d={`M${SW + 10} ${MID + 0.5}H${DX - 3}`} />
              <path className={c("way-c")} d={`M${DX - 5} ${MID - 3.5}L${DX - 1} ${MID + 0.5}L${DX - 5} ${MID + 4.5}`} />
            </svg>
            <span className={c("tick")} />
          </div>
          <ul className={c("legend")} aria-label="Key">
            <li>
              <svg className={c("sw")} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                <path className={c("sw-d")} d="M0 6.5H12" />
              </svg>
              <span>Installed by Kelwin</span>
            </li>
            <li>
              <svg className={c("sw")} width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                <path className={c("sw-s")} d="M0 6.5H12" />
              </svg>
              <span>Owned by you</span>
            </li>
          </ul>

          {CAPS.map((cap, ci) => [
            <h3 key={cap} className={`ac-cap ${c("cap")}`} style={vars({ "--c": 3 + ci * 4, "--i": ci, "--tr": 3 + ci * 5 })}>
              {cap}
            </h3>,
            ...ASSETS.slice(ci * 2, ci * 2 + 2).map((a, j) => <Item key={a.n} a={a} i={ci * 2 + j} pair={ci} />),
          ])}
        </div>
      </figure>
    </section>
  );
}
