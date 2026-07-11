import "./PageCommand.css";

// ─── PageCommand — the interior-page command header ───────────────────────
// Every interior page opens the way the homepage does: a full-bleed
// photograph running behind the transparent navbar, a heavy charcoal
// scrim, and the page's protocol identity set low in the frame. This is
// what makes an interior page read as part of the same world instead of
// a text document stapled to the site.
//
// Server component — the entrance is pure CSS (media fade + content
// rise), gated behind prefers-reduced-motion in PageCommand.css.
//
// IMAGE SWAP: `image` defaults to the hero dune. When the dedicated
// interior photographs land (pre-dawn dune field for Firm pages, star
// trails for The Lab), swap the per-page `image` prop — nothing else
// changes.

interface PageCommandProps {
  /** Protocol label, e.g. "The Firm · About" */
  protocol: string;
  /** Right-hand mono stamp, e.g. "KELWIN/OS · THE PEOPLE" */
  stamp: string;
  titleTop: string;
  titleBottom: string;
  lede: string;
  /** Bottom-right readout: page code, e.g. "FIRM/01" */
  code: string;
  /** Bottom-right readout: status line, e.g. "Operational" */
  status: string;
  statusTone?: "patina" | "red";
  /** Optional chips row under the lede (e.g. The Lab's program status). */
  chips?: { label: string; live?: boolean }[];
  /** Background photograph — /public path without basePath. */
  image?: string;
  /** background-position for the photograph's crop. */
  imagePosition?: string;
}

export default function PageCommand({
  protocol,
  stamp,
  titleTop,
  titleBottom,
  lede,
  code,
  status,
  statusTone = "patina",
  chips,
  image = "/hero-dune.webp",
  imagePosition = "50% 42%",
}: PageCommandProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <header className="pgc">
      <div className="pgc-media" aria-hidden="true">
        <div
          className="pgc-photo"
          style={{
            backgroundImage: `url(${basePath}${image})`,
            backgroundPosition: imagePosition,
          }}
        />
        <div className="pgc-scrim" />
      </div>

      <div className="pgc-stage">
        <div className="pgc-content">
          <div className="pgc-protocol-row">
            <span className="pgc-protocol">{protocol}</span>
            <span className="pgc-protocol-line" aria-hidden="true" />
            <span className="pgc-stamp">{stamp}</span>
          </div>
          <h1 className="pgc-title">
            <span className="pgc-title-1">{titleTop}</span>
            <span className="pgc-title-2">{titleBottom}</span>
          </h1>
          <p className="pgc-lede">{lede}</p>
          {chips && chips.length > 0 && (
            <div className="pgc-chips">
              {chips.map((c) => (
                <span
                  className={`pgc-chip${c.live ? " is-live" : ""}`}
                  key={c.label}
                >
                  {c.live && <span className="pgc-chip-dot" aria-hidden="true" />}
                  {c.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pgc-readout" aria-hidden="true">
          <span className="pgc-readout-code">{code}</span>
          <span className={`pgc-readout-status is-${statusTone}`}>
            <span className="pgc-readout-dot" />
            {status}
          </span>
        </div>
      </div>

      <div className="pgc-baseline" aria-hidden="true">
        <span className="pgc-tick" />
        <span className="pgc-tick" />
        <span className="pgc-tick" />
        <span className="pgc-tick" />
        <span className="pgc-tick" />
      </div>
    </header>
  );
}
