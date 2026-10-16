import type { CSSProperties } from "react";
import Slot from "@/components/home/Slot";
import HashLink from "@/components/ui/HashLink";
import "./Footer.css";

/* 11 · Footer — "The mark, on the line" (approved mockup: design/redesign/site/frag/footer/U).
   The coda and the index: the red-square label, four hairline sitemap strips (01 → 04), then the
   lockup in one quiet tone, ~70% of the content width, set right, sitting on the legal hairline,
   which buries its lower fifth (round 9: nothing of the brand hangs below the line). The legal row
   is the page's last edge; its hairline closes the frame the hero opened (+ at each margin). It
   plays once as it scrolls into view; the lockup's slow rise out of the line is the last thing to
   move. footer-behavior.ts holds that end beat (the line, ©, the controls, the rise) until the
   legal row is on screen, and writes the visitor's local-time readout.
   Its internal links are HashLinks: on the page they point at (Methodology on the homepage, Privacy
   on /privacy …) they scroll there instead of doing nothing. */

type FootLink = { label: string; href: string; door?: "ne" | "go" };

const STRIPS: { idx: string; title: string; links: FootLink[] }[] = [
  {
    idx: "01",
    title: "Capabilities",
    links: [
      { label: "Narrative Systems", href: "/capabilities/narrative-systems" },
      { label: "GTM Infrastructure", href: "/capabilities/gtm-infrastructure" },
      { label: "GTM Intelligence", href: "/capabilities/gtm-intelligence" },
      { label: "The System Audit", href: "/audit", door: "ne" },
    ],
  },
  {
    idx: "02",
    title: "The Firm",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Who We Work With", href: "/who-we-work-with" },
      { label: "The Lab", href: "/the-lab" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    idx: "03",
    title: "Resources",
    links: [
      { label: "Insights", href: "/insights" },
      { label: "Reports", href: "/reports" },
      { label: "Methodology", href: "/#methodology" },
      { label: "Talk to the Team", href: "/contact", door: "go" },
    ],
  },
];

function DoorArrow({ kind }: { kind: "ne" | "go" }) {
  return kind === "ne" ? (
    <svg className="km-footer__ar" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 9.5 9.5 2.5M3.5 2.5h6v6" />
    </svg>
  ) : (
    <svg className="km-footer__ar km-footer__ar--go" viewBox="0 0 14 12" aria-hidden="true">
      <path d="M1 6h12M8 1.5 12.5 6 8 10.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <Slot id="footer" behavior="footer">
      <footer className="km km-footer" data-surface="dark" role="contentinfo" aria-label="Kelwin site footer">
        <div className="km-footer__in ac-wrap">
          <div className="ac-labelrow km-footer__head">
            <p className="ac-label">GTM systems partner</p>
          </div>

          {/* the sitemap: four hairline strips, read 01 → 04 */}
          <nav className="ac-strips km-footer__map" style={{ "--n": 4 } as CSSProperties} aria-label="Footer">
            {STRIPS.map((s, i) => (
              <div className="ac-strip" style={{ "--i": i } as CSSProperties} key={s.idx}>
                <p className="ac-idx">{s.idx}</p>
                <h2 className="ac-h3">{s.title}</h2>
                <ul className="km-footer__ul">
                  {s.links.map((l) => (
                    <li key={l.label}>
                      <HashLink
                        className={`km-footer__a${l.door ? ` km-footer__a--door km-footer__a--${l.door}` : ""}`}
                        href={l.href}
                      >
                        {l.label}
                        {l.door && <>{" "}<DoorArrow kind={l.door} /></>}
                      </HashLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="ac-strip" style={{ "--i": 3 } as CSSProperties}>
              <p className="ac-idx">04</p>
              <h2 className="ac-h3">Contact</h2>
              <ul className="km-footer__ul">
                <li>
                  <a className="km-footer__a" href="mailto:audit@kelwin.co">
                    audit@kelwin.co
                  </a>
                </li>
                <li className="km-footer__t">
                  <span data-city="">Your time</span>{" "}
                  <time className="km-footer__clock" data-clock="">
                    --:--
                  </time>{" "}
                  <span data-tz="" />
                </li>
                <li className="km-footer__t km-footer__t--quiet">Built in-house, no template</li>
              </ul>
            </div>
          </nav>

          {/* the lockup, one quiet tone, ~70% wide and set right. It sits on the legal hairline, which
              buries its lower fifth. Decoration: the bar's lockup already names the site, so it stays
              out of the a11y tree, and the © row and controls follow the sitemap in reading order. */}
          <div className="km-footer__bury" aria-hidden="true">
            <span className="km-logo km-footer__mark" />
          </div>

          {/* the legal row is the page's last edge; its hairline closes the frame the hero opened */}
          <div className="km-footer__legal">
            <span className="ac-reg ac-reg--tl" style={{ "--d": "450ms" } as CSSProperties} aria-hidden="true" />
            <span className="ac-reg ac-reg--tr" style={{ "--d": "1100ms" } as CSSProperties} aria-hidden="true" />
            <p className="ac-cap km-footer__copy">© 2026 Kelwin · All rights reserved</p>
            <div className="km-footer__ctl">
              <div className="km-footer__pair">
                <HashLink href="/privacy">Privacy</HashLink>
                <HashLink href="/terms">Terms</HashLink>
              </div>
              <HashLink className="ac-btn-o km-footer__top" href="/audit">
                Audit request
              </HashLink>
            </div>
          </div>
        </div>
      </footer>
    </Slot>
  );
}
