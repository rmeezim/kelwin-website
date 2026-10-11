import Link from "next/link";
import "./ArrowLink.css";

// The quiet arrow link on interior pages ("Talk to the team first →").
// Uppercase, arrow, gap widens on hover. Tones: "cream" for the red band,
// "sand" for charcoal sections. Use for secondary conversion paths and
// wayfinding actions; the loud moment is always button C (HeroCTA).
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
