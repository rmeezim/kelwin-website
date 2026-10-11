import type { CSSProperties } from "react";
import Link from "next/link";

// CTA style #1 — the primary action, as the founder's button C (round 4 rule: "on every page"):
// one 45° cut at the bottom-right, caps at weight 600, a step larger and tighter, no arrow, no
// brackets. It is the kit's `.ac-btn` (km-kit.css §4), so it shares one source with the homepage.
//
// Interior pages are not inside `.km`, where the kit's surface tokens live, so the wrapper
// resolves them here with fallbacks: inside a red surface ([data-surface="red"]) the button is
// paper with red text; anywhere else it is signal red with paper text. The fallbacks are km-base's
// :root palette tokens, which reach every page. (Two steps, because a custom property cannot fall
// back to its own inherited value on the same element.)
const SCOPE = {
  display: "contents",
  "--hcta-accent": "var(--accent, var(--c-red))",
  "--hcta-accent-hover": "var(--accent-hover, var(--c-red-deep))",
  "--hcta-accent-fg": "var(--accent-fg, var(--c-paper))",
} as CSSProperties;
const TOKENS = {
  // legacy interior sections redefine --f-body locally (Inter); the button stays in v5 type
  "--f-body": 'var(--font-mona), "Helvetica Neue", Arial, sans-serif',
  "--accent": "var(--hcta-accent)",
  "--accent-hover": "var(--hcta-accent-hover)",
  "--accent-fg": "var(--hcta-accent-fg)",
  color: "var(--hcta-accent-fg)",
} as CSSProperties;

interface Props {
  label?: string;
  href?: string;
}

export default function HeroCTA({ label = "INITIATE SYSTEM AUDIT", href = "/audit" }: Props) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  return (
    <span style={SCOPE}>
      {external ? (
        <a className="ac-btn" href={href} style={TOKENS}>
          {label}
        </a>
      ) : (
        <Link className="ac-btn" href={href} style={TOKENS}>
          {label}
        </Link>
      )}
    </span>
  );
}
