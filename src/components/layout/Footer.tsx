import Link from "next/link";
import "./Footer.css";

// ─── Footer — the colophon ────────────────────────────────────────────────
// Editorial sign-off rather than a link dump: a serif closing statement
// (the site's thesis, restated once more on the way out), the nav taxonomy,
// and a colophon column that says out loud that people made this — type
// choices, the sister company, a signed line from the founder. The page
// ends the way a good document does: with attribution.

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
      { label: "The Lab", href: "/the-lab" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Reports", href: "/reports" },
      { label: "Methodology", href: "/#methodology" },
      { label: "Get in Touch", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-stage">
        {/* Editorial close — the thesis, once more, in the accent voice. */}
        <p className="foot-thesis">
          In a noisy market, the clearest company wins —{" "}
          <em>not the loudest, or the busiest.</em>
        </p>

        <div className="foot-top">
          <div className="foot-brand">
            <Link href="/" className="foot-wordmark">KELWIN</Link>
            <p className="foot-tagline">
              Revenue infrastructure &amp; GTM intelligence for serious B2B
              companies.
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

          {/* Colophon — people made this, and it says so. */}
          <div className="foot-colophon">
            <span className="foot-col-heading">Colophon</span>
            <p className="foot-colophon-line">
              Written, designed &amp; built by the founding team — no theme,
              no template.
            </p>
            <p className="foot-colophon-line">
              Set in Instrument Sans, Inter &amp; JetBrains Mono.
            </p>
            <a className="foot-colophon-mail" href="mailto:audit@kelwin.co">
              audit@kelwin.co
            </a>
            <span className="foot-sign">— Rameez, founder</span>
          </div>
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
