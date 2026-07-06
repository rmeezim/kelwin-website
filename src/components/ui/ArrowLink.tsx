import Link from "next/link";
import "./ArrowLink.css";

// CTA style #4 — the quiet arrow link ("Book a strategic call →").
// Uppercase, arrow, gap widens on hover. Tones: "cream" for the red band,
// "sand" for charcoal sections. Use for secondary conversion paths and
// wayfinding actions; the bracketed CTAs stay the loud moments.
interface Props {
  href: string;
  label: string;
  tone?: "cream" | "sand";
  className?: string;
}

export default function ArrowLink({ href, label, tone = "sand", className }: Props) {
  const cls = `arrow-link arrow-link-${tone}${className ? ` ${className}` : ""}`;
  const external = href.startsWith("http") || href.startsWith("mailto:");
  if (external) {
    return (
      <a className={cls} href={href}>
        {label}
        <span aria-hidden="true">→</span>
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
