import Link from "next/link";
import "./Footer.css";

// Minimal dark footer sitting beneath the red CTA band, so the red reads as
// the page's crescendo and the footer as a quiet system sign-off. Mirrors
// the navbar's nav taxonomy; carries the sister-company relationship.
const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Capabilities",
    links: [
      { label: "Narrative Systems", href: "/capabilities/narrative-systems" },
      { label: "GTM Infrastructure", href: "/capabilities/gtm-infrastructure" },
      { label: "GTM Intelligence", href: "/capabilities/gtm-intelligence" },
      { label: "The System Audit", href: "/audit" },
    ],
  },
  {
    heading: "Firm",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Who We Work With", href: "/who-we-work-with" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Reports", href: "/reports" },
      { label: "Methodology", href: "/#methodology" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-stage">
        <div className="foot-top">
          <div className="foot-brand">
            <Link href="/" className="foot-wordmark">KELWIN</Link>
            <p className="foot-tagline">
              Revenue infrastructure &amp; GTM intelligence for serious B2B companies.
            </p>
            <span className="foot-sister">
              <span className="foot-sister-dash" aria-hidden="true" />
              Sister company of Plurel
            </span>
          </div>

          <nav className="foot-nav" aria-label="Footer">
            {COLUMNS.map((col) => (
              <div className="foot-col" key={col.heading}>
                <span className="foot-col-heading">{col.heading}</span>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="foot-link">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="foot-bottom">
          <span className="foot-mono">© 2026 Kelwin · All rights reserved</span>
          <span className="foot-mono foot-status">
            <span className="foot-status-dot" aria-hidden="true" />
            KELWIN/OS · Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
