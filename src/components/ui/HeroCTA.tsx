import type { CSSProperties, MouseEventHandler } from "react";
import HashLink from "@/components/ui/HashLink";
import "./HeroCTA.css";

// CTA style #1 — the primary action, as the founder's button C (round 4 rule: "on every page"):
// one 45° cut at the bottom-right, caps at weight 600, a step larger and tighter, no arrow, no
// brackets. It is the kit's `.ac-btn` (km-kit.css §4), so it shares one source with the homepage.
// Every red primary on an interior page goes through here — links and form submits alike — so
// there is one button C, never a local look-alike.
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

// `hcta` lets a long label wrap inside a narrow container (HeroCTA.css) instead of
// running past it; single-line buttons render exactly as the kit's.
const CLS = "ac-btn hcta";

interface LinkProps {
  as?: "link";
  label?: string;
  /** Internal path, same-page #fragment, mailto: or http(s) URL. */
  href?: string;
}

interface ButtonProps {
  as: "button";
  label: string;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function HeroCTA(props: LinkProps | ButtonProps) {
  if (props.as === "button") {
    const { label, type = "submit", disabled, onClick } = props;
    return (
      <span style={SCOPE}>
        <button className={CLS} type={type} disabled={disabled} onClick={onClick} style={TOKENS}>
          {label}
        </button>
      </span>
    );
  }

  const { label = "INITIATE SYSTEM AUDIT", href = "/audit" } = props;
  const external = href.startsWith("mailto:") || href.startsWith("http");
  return (
    <span style={SCOPE}>
      {external ? (
        <a className={CLS} href={href} style={TOKENS}>
          {label}
        </a>
      ) : (
        // HashLink is next/link (basePath, prefetch) that also scrolls and moves focus when the
        // target is the page you are on — e.g. the audit page's own "#qualify" jump.
        <HashLink className={CLS} href={href} style={TOKENS}>
          {label}
        </HashLink>
      )}
    </span>
  );
}
