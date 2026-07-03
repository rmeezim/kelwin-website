"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-/";
function rand() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface Props {
  /** Free-flowing text — wraps naturally at word boundaries (never mid-word). */
  text?: string;
  /** Forced line breaks — each entry becomes one line, regardless of viewport. */
  lines?: string[];
  delay?: number;        // ms before scramble begins
  duration?: number;     // ms for one line to resolve L→R (used when charScramble is unset)
  /** Fixed per-character scramble window in ms (sequential mode only).
      Overrides `duration`-based timing so each character gets a guaranteed
      visible scramble regardless of line length (line total = N × charScramble). */
  charScramble?: number;
  /** Animation style:
   *  - "sequential" (default): typewriter — each char appears, scrambles, then locks one at a time.
   *    Hidden chars are opacity:0 placeholders that reserve their final layout.
   *  - "cascade": all chars in a visual line appear scrambling at once when that
   *    line's stagger time arrives, then resolve L→R over `duration` ms. Lines
   *    that haven't started yet stay hidden (no global wall-of-garble at t=0). */
  mode?: "sequential" | "cascade";
  lineStagger?: number;  // ms between lines starting
  className?: string;
}

interface Token {
  token: string;
  isSpace: boolean;
  indices: number[];
}

export default function ScrambleText({
  text,
  lines,
  delay = 0,
  duration = 600,
  charScramble,
  mode = "sequential",
  lineStagger = 240,
  className,
}: Props) {
  const reduced = useReducedMotion();

  // Build line/token structure. Tokens are either a word (atomic) or a run of whitespace.
  const segments = lines ?? [text ?? ""];
  const finalChars: string[] = [];
  const tokenLines: Token[][] = [];

  segments.forEach((line) => {
    const lineTokens: Token[] = [];
    line.split(/(\s+)/).filter((t) => t.length > 0).forEach((tok) => {
      const isSpace = /^\s+$/.test(tok);
      const indices: number[] = [];
      for (let i = 0; i < tok.length; i++) {
        indices.push(finalChars.length);
        finalChars.push(tok[i]);
      }
      lineTokens.push({ token: tok, isSpace, indices });
    });
    tokenLines.push(lineTokens);
  });

  const ariaLabel   = segments.join(" ");
  const isLinesMode = !!lines;

  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [chars, setChars] = useState<string[]>(() => [...finalChars]);
  const [visible, setVisible] = useState<boolean[]>(
    () => finalChars.map(() => reduced ?? false)
  );
  const linesRef = useRef<number[][]>([]);

  // Group chars by their `top` so the L→R cascade matches whatever line each
  // char actually lives on. Re-runs on resize so the cascade adapts to viewport.
  useLayoutEffect(() => {
    const measure = () => {
      const groups = new Map<number, number[]>();
      charRefs.current.forEach((span, i) => {
        if (!span) return;
        const top = Math.round(span.getBoundingClientRect().top);
        if (!groups.has(top)) groups.set(top, []);
        groups.get(top)!.push(i);
      });
      linesRef.current = Array.from(groups.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([, idx]) => idx.sort((a, b) => a - b));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ariaLabel]);

  // Sequential "typewriter scramble": within each line, character N+1 only
  // appears (and starts scrambling) the moment character N locks to its
  // final glyph. Unrevealed chars are opacity:0 placeholders that reserve
  // their final layout. Total animation fits within the same timeframe as
  // the prior cascade (lineStagger * lines + duration).
  useEffect(() => {
    if (reduced) {
      setChars([...finalChars]);
      setVisible(finalChars.map(() => true));
      return;
    }

    const fc = [...finalChars];
    const resolved = new Set<number>();
    const visibleSet = new Set<number>();
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const setCharAt = (i: number, ch: string) => {
      setChars((prev) => {
        if (prev[i] === ch) return prev;
        const next = prev.slice();
        next[i] = ch;
        return next;
      });
    };

    const showAt = (i: number) => {
      setVisible((prev) => {
        if (prev[i]) return prev;
        const next = prev.slice();
        next[i] = true;
        return next;
      });
    };

    const startTimer = setTimeout(() => {
      // Random-glyph ticker — only updates chars that are currently visible
      // and not yet resolved. Hidden chars stay invisible (no leakage).
      intervalId = setInterval(() => {
        setChars((prev) => {
          const next = prev.slice();
          let changed = false;
          for (let i = 0; i < fc.length; i++) {
            if (/\s/.test(fc[i])) continue;
            if (!visibleSet.has(i) || resolved.has(i)) continue;
            const r = rand();
            if (next[i] !== r) { next[i] = r; changed = true; }
          }
          return changed ? next : prev;
        });
      }, 70);

      const lineGroups = linesRef.current.length > 0
        ? linesRef.current
        : [fc.map((_, i) => i)];

      let lastResolveAt = 0;
      lineGroups.forEach((indices, lineNum) => {
        const lineStart = lineNum * lineStagger;
        const N = indices.length;

        if (mode === "cascade") {
          // All chars in this line become visible (and scrambling) at once
          // when the line starts; then they resolve L→R across `duration`.
          // Lines that haven't started yet stay hidden — no global garble.
          indices.forEach((charIdx) => {
            const isSpace = /\s/.test(fc[charIdx]);
            timeouts.push(setTimeout(() => {
              visibleSet.add(charIdx);
              showAt(charIdx);
              if (!isSpace) setCharAt(charIdx, rand());
            }, lineStart));
          });

          const denom = Math.max(N - 1, 1);
          indices.forEach((charIdx, posInLine) => {
            const t = lineStart + (posInLine / denom) * duration;
            if (t > lastResolveAt) lastResolveAt = t;
            timeouts.push(setTimeout(() => {
              resolved.add(charIdx);
              setCharAt(charIdx, fc[charIdx]);
            }, t));
          });
          return;
        }

        // Sequential (typewriter): char N appears the slot N-1 resolves,
        // and itself resolves one slot later. Slot is `charScramble` when
        // explicitly set (fixed per-char window), else duration / N.
        indices.forEach((charIdx, posInLine) => {
          const isSpace = /\s/.test(fc[charIdx]);
          const slot = charScramble ?? duration / N;
          const appearT  = lineStart + posInLine * slot;
          const resolveT = lineStart + (posInLine + 1) * slot;
          if (resolveT > lastResolveAt) lastResolveAt = resolveT;

          timeouts.push(setTimeout(() => {
            visibleSet.add(charIdx);
            showAt(charIdx);
            // Seed with a random glyph immediately so the first frame after
            // appearance shows scramble, not the final char briefly.
            if (!isSpace) setCharAt(charIdx, rand());
          }, appearT));

          timeouts.push(setTimeout(() => {
            resolved.add(charIdx);
            setCharAt(charIdx, fc[charIdx]);
          }, resolveT));
        });
      });

      timeouts.push(setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        setChars([...fc]);
        setVisible(fc.map(() => true));
      }, lastResolveAt + 90));
    }, delay);

    return () => {
      clearTimeout(startTimer);
      timeouts.forEach((t) => clearTimeout(t));
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ariaLabel, delay, duration, charScramble, mode, lineStagger, reduced]);

  return (
    <span aria-label={ariaLabel} className={className}>
      {tokenLines.map((tokens, lineNum) => (
        <span
          key={lineNum}
          style={
            isLinesMode
              ? { display: "block", whiteSpace: "nowrap" }
              : undefined
          }
        >
          {tokens.map((tok, ti) => {
            if (tok.isSpace) {
              // Spaces between words — kept as plain text so they remain
              // valid line-break opportunities in text (non-lines) mode.
              return <span key={ti}>{tok.token}</span>;
            }
            return (
              // Word wrapper — atomic for line-break purposes (whitespace: nowrap).
              <span
                key={ti}
                style={{ display: "inline-block", whiteSpace: "nowrap" }}
              >
                {tok.indices.map((charIdx) => {
                  const isVisible    = visible[charIdx];
                  const finalCh      = finalChars[charIdx];
                  const displayCh    = chars[charIdx];
                  const isResolved   = isVisible && displayCh === finalCh;
                  const isScrambling = isVisible && displayCh !== finalCh;
                  return (
                    <span
                      key={charIdx}
                      ref={(el) => { charRefs.current[charIdx] = el; }}
                      style={{
                        display: "inline-block",
                        position: "relative",
                        // Horizontal-only clipping — keeps wide scramble glyphs
                        // (M, W, 0) from pushing layout, but lets descenders /
                        // ascenders extend vertically (so tighter line-heights
                        // like leading-[0.82] don't crop "p", "g", etc.).
                        clipPath: "inset(-100% 0 -100% 0)",
                        verticalAlign: "baseline",
                      }}
                    >
                      {/* Layout reservation — final glyph always present so
                          the span's width never changes during scramble.
                          Visible only when resolved.                       */}
                      <span style={{ opacity: isResolved ? 1 : 0 }}>
                        {finalCh}
                      </span>
                      {/* Scramble overlay — absolute, doesn't affect layout;
                          clipped to final-char width by parent overflow.    */}
                      {isScrambling && (
                        <span
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {displayCh}
                        </span>
                      )}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}
