import type { CSSProperties } from "react";
import Link from "next/link";
import { TAKES, TAKE_MS, type TakeGlyph } from "./takes";
import "./hero.css";

/* ── hero · The Operating Feed (approved mockup: design/redesign/site/frag/hero/T) ──────
   The hero sits on the same flat graphite as every section below; its one instrument is a
   framed, cinema-wide (2.39 : 1) film of a working session in three hard-cut takes — one
   per system Kelwin runs — with a calibrated ruler and a clickable chapter rail. The site
   Navbar sits above it; the section starts directly below the nav hairline.
   Takes (and, later, their footage) come from ./takes.ts; the cuts, the timecode and the
   off-screen hold are ./behavior.ts; the crops, camera moves and entrance are ./hero.css. */

const css = (vars: Record<string, string | number>) => vars as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* The ruler: one tick per second of the loop, a major tick at every cut (0 · 8 · 16 · 24 s),
   on the frame's 755-unit drawing width. */
const SECONDS = (TAKES.length * TAKE_MS) / 1000;
const PER_TAKE = TAKE_MS / 1000;
const TICKS = Array.from({ length: SECONDS + 1 }, (_, i) => ({
  i,
  x: Math.min(754, Math.round((i * 755) / SECONDS)) + 0.5,
  major: i % PER_TAKE === 0,
}));

/* the nav's capability glyphs (CONTOUR · TRACE · ORBIT), drawn on the active chapter */
function Glyph({ name }: { name: TakeGlyph }) {
  return (
    <svg className="ac-glyph km-hero__gl" style={css({ "--w": "36px", "--h": "24px" })} viewBox="0 0 36 24" aria-hidden="true">
      {name === "contour" && (
        <>
          <path pathLength={1} d="M0 4.5C5 3.5 8 8 13 7.2S20 10.5 24 12H36" />
          <path pathLength={1} d="M0 9.5C4 11.5 8 7.5 12.5 9.5S20 12 24 12" />
          <path pathLength={1} d="M0 14.5C4 12.8 8 17 12.5 14.6S20 12 24 12" />
          <path pathLength={1} d="M0 19.5C5 21 8 15.8 13 16.8S20 13.5 24 12" />
        </>
      )}
      {name === "trace" && (
        <>
          <path pathLength={1} d="M0 18.5H9.5V5.5H25.5V18.5H36" />
          <rect className="km-hero__nd" x="8" y="4" width="3" height="3" />
          <rect className="km-hero__nd" x="24" y="4" width="3" height="3" />
          <rect className="km-hero__nd" x="24" y="17" width="3" height="3" />
        </>
      )}
      {name === "orbit" && (
        <>
          <path pathLength={1} d="M0 12.5H15" />
          <path pathLength={1} d="M31.8 7.5A9 9 0 1 1 27.1 3.5" />
          <rect className="km-hero__nd" x="28.3" y="3.6" width="3" height="3" />
        </>
      )}
    </svg>
  );
}

export default function Hero() {
  const withVideo = TAKES.flatMap((t, k) => (t.video ? [String(k + 1)] : []));
  const allVideo = withVideo.length === TAKES.length;

  return (
    <section
      className="km km-hero"
      data-surface="dark"
      data-take="1"
      data-vids={withVideo.length ? withVideo.join(" ") : undefined}
      aria-labelledby="km-hero-title"
    >
      {/* the act: statement top-left → the feed (the work, on film) bottom-left → the action bottom-right */}
      <div className="km-hero__body ac-head ac-wrap">
        <div className="ac-labelrow">
          <p className="ac-label">GTM systems partner</p>
        </div>
        <h1 className="ac-statement ac-statement--hero" id="km-hero-title">
          <span className="ac-line">
            <span>Revenue is an</span>
          </span>{" "}
          <span className="ac-line">
            <span>
              architectural <span className="ac-accent">problem.</span>
            </span>
          </span>
        </h1>
        <span className="ac-rule" aria-hidden="true"></span>

        {/* the right bay: what Kelwin does (beside the film that shows it) → the audit → the doors.
            It comes BEFORE the feed in the DOM (both are placed explicitly on grid row 4, so the 1440 picture is
            unchanged): reading and focus order then match the page at every width — on desktop the doors sit
            above the chapter rail, and at ≤ 1023 the bay is stacked above the film. */}
        <div className="km-hero__bay">
          <p className="ac-lede ac-up" style={css({ "--d": "1150ms" })}>
            Kelwin designs, installs and runs the narrative, channel and market intelligence systems that turn fragmented
            growth into repeatable pipeline.
          </p>
          <div className="ac-note ac-up" style={css({ "--d": "1250ms" })}>
            <p className="ac-label">A fixed-scope diagnostic</p>
            <p className="ac-note__t">Ten working days. Clear findings. Actionable recommendations.</p>
          </div>
          <div className="ac-doors ac-up" style={css({ "--d": "1350ms" })}>
            <Link className="ac-btn" href="/audit">
              Request a System Audit
            </Link>
            <Link className="ac-link" href="/contact">
              Talk to the team
            </Link>
          </div>
        </div>

        {/* THE FEED: one film, three takes — one per system Kelwin runs */}
        <figure
          className="km-hero__feed"
          aria-label="Film of a working session in three takes: Narrative Systems, GTM Infrastructure, GTM Intelligence"
        >
          <div className="km-hero__screen">
            <div className="km-film" aria-hidden="true">
              {!allVideo && (
                <div className="km-film__plate km-hero__plate">
                  <div className="km-hero__soft"></div>
                  <div className="km-hero__glow"></div>
                </div>
              )}
              {TAKES.map((t, k) =>
                t.video ? (
                  <video
                    key={t.index}
                    className="km-film__plate km-hero__vid"
                    data-k={k + 1}
                    src={BASE + t.video.src}
                    poster={t.video.poster ? BASE + t.video.poster : undefined}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                  />
                ) : null,
              )}
              <div className="km-film__walker"></div>
              <div className="km-film__frost"></div>
              <div className="km-hero__scrim"></div>
            </div>
            <p className="km-hero__slate" aria-hidden="true">
              Working session · Take <span className="km-hero__tk">{TAKES[0].index}</span>
              {`/${pad(TAKES.length)} · `}
              <span className="km-hero__tc">00:00:00</span>
            </p>
            <svg className="ac-svg km-hero__frame" viewBox="0 0 755 316" preserveAspectRatio="none" aria-hidden="true">
              <path className="ac-s-faint ac-s-dash km-hero__cx km-hero__cx--h" d="M-28 .5H783" />
              <path className="ac-s-faint ac-s-dash km-hero__cx km-hero__cx--v" d="M.5 -28V344" />
              <rect
                className="ac-s-mute ac-plot km-hero__edge"
                style={css({ "--d": "850ms", "--t": "700ms" })}
                pathLength={1}
                x=".5"
                y=".5"
                width="754"
                height="315"
              />
            </svg>
            <span className="ac-reg ac-reg--tl km-hero__reg" style={css({ "--d": "1250ms" })} aria-hidden="true"></span>
            <span className="ac-reg ac-reg--tr km-hero__reg" style={css({ "--d": "1300ms" })} aria-hidden="true"></span>
            <span className="ac-reg ac-reg--bl km-hero__reg" style={css({ "--d": "1350ms" })} aria-hidden="true"></span>
            <span className="ac-reg ac-reg--br km-hero__reg" style={css({ "--d": "1400ms" })} aria-hidden="true"></span>
          </div>

          {/* the chapter rail: a MEASURE ruler as the scrub bar — one tick per second of the 24s loop */}
          <div className="km-hero__rail">
            <svg className="ac-svg km-hero__ruler" viewBox="0 0 755 9" preserveAspectRatio="none" aria-hidden="true">
              <path className="km-hero__base" d="M0 .5H755" />
              <g className="km-hero__ticks">
                {TICKS.map(({ i, x, major }) => (
                  <path
                    key={i}
                    className={major ? "km-hero__tick km-hero__tick--maj" : "km-hero__tick"}
                    style={css({ "--i": i })}
                    d={`M${x} 0V${major ? 8 : 4}`}
                  />
                ))}
              </g>
            </svg>
            <span className="km-hero__rung" aria-hidden="true">
              <span className="km-hero__run"></span>
            </span>
            <span className="km-hero__phw" aria-hidden="true">
              <span className="km-hero__ph"></span>
            </span>
            {/* the chapters are also the film's stop (WCAG 2.2.2, no extra control: D12) — said to assistive
                tech here; behavior.ts drops the description under reduced motion, where nothing moves */}
            <p id="km-hero-chd" hidden>
              Choosing a chapter plays its take once, then stops the film on it.
            </p>
            <div className="km-hero__chapters" role="group" aria-label="Film chapters" aria-describedby="km-hero-chd">
              {TAKES.map((t, k) => (
                <button
                  key={t.index}
                  type="button"
                  className="km-hero__ch ac-up"
                  style={css({ "--d": `${1500 + k * 80}ms` })}
                  aria-current={k === 0 ? "true" : "false"}
                  data-ch={k}
                >
                  {/* (the spaces are dropped by the flex/grid layout but keep the accessible names readable:
                      "01 Narrative Systems", "Revenue is an architectural problem.") */}
                  <span className="km-hero__ix">{t.index}</span>{" "}
                  <span className="km-hero__nm">{t.name}</span>
                  <Glyph name={t.glyph} />
                </button>
              ))}
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
