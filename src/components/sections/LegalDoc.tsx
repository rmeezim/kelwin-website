import "./LegalDoc.css";

// ─── LegalDoc — the legal pages, in the document register ─────────────────
// Privacy policy and terms of service share one quiet reading layout:
// mono-numbered sections (L·01…), 68ch prose, an effective-date stamp,
// and a contact line. Server component; content passed as data.
//
// [EDIT ME · LEGAL REVIEW] The copy in privacy/terms pages is a careful
// draft, not legal advice — have counsel review before relying on it,
// and set the governing-law jurisdiction where marked.

export interface LegalSection {
  n: string;
  title: string;
  paras: string[];
}

interface LegalDocProps {
  title: string;
  docId: string;
  effective: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalDoc({ title, docId, effective, intro, sections }: LegalDocProps) {
  return (
    <main className="lgl">
      <div className="lgl-stage">
        <div className="lgl-meta">
          <span className="lgl-meta-id">{docId}</span>
          <span className="lgl-meta-line" aria-hidden="true" />
          <span className="lgl-meta-date">EFFECTIVE {effective}</span>
        </div>
        <h1 className="lgl-title">{title}</h1>
        <p className="lgl-intro">{intro}</p>
        {sections.map((s) => (
          <section className="lgl-section" key={s.n} aria-label={s.title}>
            <div className="lgl-section-head">
              <span className="lgl-section-n">{s.n}</span>
              <h2 className="lgl-section-title">{s.title}</h2>
            </div>
            {s.paras.map((p, i) => (
              <p className="lgl-para" key={i}>{p}</p>
            ))}
          </section>
        ))}
        <div className="lgl-foot">
          <span className="lgl-foot-k">Questions about this document</span>
          <a className="lgl-foot-mail" href="mailto:audit@kelwin.co">
            audit@kelwin.co
          </a>
        </div>
      </div>
    </main>
  );
}
