// DotMatrixReading — cell-built flip-board numerals, the Kelwin
// signature for one hero reading per section. Server component: cells
// render statically; the reveal animation is driven by a parent adding
// `dm-armed` / `dm-live` classes (see SystemFurniture.css).
//
// 5×7 dot font. Only the glyphs a reading needs: digits, '.', '-', '%'.
const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ".": ["00", "00", "00", "00", "00", "11", "11"],
  "-": ["0000", "0000", "0000", "1111", "0000", "0000", "0000"],
  "%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
};

type DotMatrixReadingProps = {
  value: string;
  /** Cell size in px — drives the whole glyph scale. */
  cell?: number;
  /** Per-cell reveal stagger in ms (left-to-right sweep). */
  staggerMs?: number;
  className?: string;
  label?: string;
};

export default function DotMatrixReading({
  value,
  cell = 12,
  staggerMs = 14,
  className,
  label,
}: DotMatrixReadingProps) {
  let cellIndex = 0;
  return (
    <span
      className={`sys-dotmatrix ${className ?? ""}`}
      style={{ "--dm-cell": `${cell}px` } as React.CSSProperties}
      role="img"
      aria-label={label ?? value}
    >
      {Array.from(value).map((ch, gi) => {
        const glyph = GLYPHS[ch];
        if (!glyph) return null;
        const cols = glyph[0].length;
        return (
          <span
            key={gi}
            className="dm-glyph"
            style={{ gridTemplateColumns: `repeat(${cols}, var(--dm-cell))` }}
            aria-hidden="true"
          >
            {glyph.flatMap((row, r) =>
              Array.from(row).map((bit, c) => {
                const on = bit === "1";
                const delay = on ? `${(cellIndex++) * staggerMs}ms` : undefined;
                return (
                  <span
                    key={`${r}-${c}`}
                    className={on ? "dm-cell on" : "dm-cell"}
                    style={delay ? { transitionDelay: delay } : undefined}
                  />
                );
              })
            )}
          </span>
        );
      })}
    </span>
  );
}
