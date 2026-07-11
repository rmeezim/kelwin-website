import "./SectionBand.css";

// ─── SectionBand — photographic interstitial ──────────────────────────────
// A full-bleed photograph used as a breath between sections: scrimmed
// into the charcoal at top and bottom so it reads as the world showing
// through the interface, with one mono caption pinned to the baseline.
// Server component, no motion beyond the site grain above it.

interface SectionBandProps {
  image: string;
  /** background-position crop */
  position?: string;
  caption: string;
  stamp?: string;
  /** css height, defaults to a cinematic band */
  height?: string;
}

export default function SectionBand({
  image,
  position = "50% 50%",
  caption,
  stamp,
  height,
}: SectionBandProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return (
    <div
      className="secband"
      style={height ? ({ ["--secband-h" as string]: height } as React.CSSProperties) : undefined}
      aria-hidden="true"
    >
      <div
        className="secband-photo"
        style={{
          backgroundImage: `url(${basePath}${image})`,
          backgroundPosition: position,
        }}
      />
      <div className="secband-scrim" />
      <div className="secband-caption-row">
        <span className="secband-caption">{caption}</span>
        <span className="secband-line" />
        {stamp && <span className="secband-stamp">{stamp}</span>}
      </div>
    </div>
  );
}
