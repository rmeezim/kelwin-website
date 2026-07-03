"use client";

interface Segment {
  /** Plain text shown before the strong value. */
  label: string;
  /** Bold-styled value, e.g. "v2.4", "Q1·2026". */
  value: string;
}

interface Props {
  segments: Segment[];
  variant?: "dark" | "cream";
  className?: string;
}

/**
 * MethodologyMetaBar — the small monospace ledger at the bottom of a
 * section, framing it as a calibrated, versioned diagnostic output.
 * Same vocabulary as the Diagnostic Reframe meta-bar so they read as
 * pages from the same instrument manual.
 */
export default function MethodologyMetaBar({
  segments,
  variant = "cream",
  className,
}: Props) {
  return (
    <div className={`sys-meta-bar is-${variant} ${className ?? ""}`}>
      {segments.map((s, i) => (
        <span key={i} className="sys-meta-segment">
          {s.label} <strong>{s.value}</strong>
        </span>
      ))}
    </div>
  );
}
