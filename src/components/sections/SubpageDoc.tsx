import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "./SubpageDoc.css";

/* One skeleton for every interior page — the spec-sheet posture of /audit
   generalized: mono protocol header, two-line display heading, lede, then
   kicker/body rows on a hairline ledger. Server component; no motion —
   interior pages load like documents, not shows. */

export interface SubpageBullet {
  title: string;
  desc: string;
  soon?: boolean;
}

export interface SubpageBlock {
  kicker: string;
  body?: string[];
  bullets?: SubpageBullet[];
}

export interface SubpageDocProps {
  protocol: string;
  stamp?: string;
  title: [string, string?];
  lede: string;
  blocks: SubpageBlock[];
  /* Optional terminal-styled empty-state lines (Insights/Reports). */
  terminal?: string[];
  cta?: { label: string; href: string; note?: string };
}

export default function SubpageDoc({
  protocol,
  stamp = "KELWIN/OS",
  title,
  lede,
  blocks,
  terminal,
  cta,
}: SubpageDocProps) {
  return (
    <main className="subpage">
      <div className="sp-stage">
        <header className="sp-head">
          <div className="sp-protocol-row">
            <span className="sp-protocol">{protocol}</span>
            <span className="sp-protocol-line" aria-hidden="true" />
            <span className="sp-stamp">{stamp}</span>
          </div>
          <h1 className="sp-title">
            <span className="sp-title-1">{title[0]}</span>
            {title[1] && <span className="sp-title-2">{title[1]}</span>}
          </h1>
          <p className="sp-lede">{lede}</p>
        </header>

        <div className="sp-blocks">
          {blocks.map((b) => (
            <section className="sp-block" key={b.kicker}>
              <div className="sp-kicker">{b.kicker}</div>
              <div className="sp-content">
                {b.body?.map((p, i) => (
                  <p className="sp-body" key={i}>{p}</p>
                ))}
                {b.bullets && (
                  <ul className="sp-bullets">
                    {b.bullets.map((bl) => (
                      <li className={`sp-bullet${bl.soon ? " is-soon" : ""}`} key={bl.title}>
                        <span className="sp-bullet-title">
                          {bl.title}
                          {bl.soon && <span className="sp-chip">Soon</span>}
                        </span>
                        <span className="sp-bullet-desc">{bl.desc}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        {terminal && (
          <div className="sp-terminal" role="status">
            {terminal.map((line, i) => (
              <div className="sp-terminal-line" key={i}>
                <span className="sp-terminal-prompt" aria-hidden="true">&gt;</span>
                {line}
              </div>
            ))}
            <div className="sp-terminal-line">
              <span className="sp-terminal-prompt" aria-hidden="true">&gt;</span>
              <span className="sp-cursor" aria-hidden="true" />
            </div>
          </div>
        )}

        {cta && (
          <footer className="sp-cta">
            <div className="sp-cta-actions">
              <DiagnosticMethodCTA href={cta.href} label={cta.label} variant="signal" />
              <ArrowLink
                href="mailto:audit@kelwin.co"
                label="Or write to the team"
                tone="sand"
              />
            </div>
            {cta.note && <p className="sp-cta-note">{cta.note}</p>}
          </footer>
        )}
      </div>
    </main>
  );
}
