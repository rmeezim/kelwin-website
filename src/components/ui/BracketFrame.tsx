"use client";

type Corner = "tl" | "tr" | "bl" | "br";

interface Props {
  /** Which corners to render. Defaults to all four. */
  corners?: Corner[];
  /** Bracket arm length in px. */
  size?: number;
  /** Bracket stroke weight in px. */
  weight?: number;
  /** Distance from the edge of the relative ancestor. */
  inset?: number;
  className?: string;
}

const ALL: Corner[] = ["tl", "tr", "bl", "br"];

/**
 * BracketFrame — four corner brackets, anchored to a position:relative
 * ancestor. Wraps the existing pattern that lived inline in
 * DiagnosticReframe (.card-corner), RevenueOS (.panel-corner), and
 * FirstPrinciples (.lx-card-bracket).
 */
export default function BracketFrame({
  corners = ALL,
  size = 14,
  weight = 1,
  inset = -1,
  className,
}: Props) {
  return (
    <>
      {corners.map((c) => (
        <span
          key={c}
          aria-hidden="true"
          className={`sys-bracket is-${c} ${className ?? ""}`}
          style={
            {
              "--bracket-size": `${size}px`,
              "--bracket-weight": `${weight}px`,
              "--bracket-inset": `${inset}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}
