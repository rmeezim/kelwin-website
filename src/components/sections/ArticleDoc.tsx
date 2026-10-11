import type { ReactNode } from "react";
import Link from "next/link";
import HeroCTA from "@/components/ui/HeroCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "./ArticleDoc.css";

/* ─── ArticleDoc — the field-note reading layout ──────────────────────────
   One layout for every published note: mono dossier rail (number, topics,
   date, read time), display title + standfirst, then a measured 68ch prose
   column. Server component — articles load like documents. Prose idiom:
   h2 subheads, serif pull-quotes (the editorial accent voice), and mono
   "field reading" panels for operational asides. */

export interface ArticleMeta {
  n: string;
  topics: string[];
  date: string;
  readTime: string;
}

export default function ArticleDoc({
  meta,
  title,
  standfirst,
  children,
}: {
  meta: ArticleMeta;
  title: string;
  standfirst: string;
  children: ReactNode;
}) {
  return (
    <div className="artd">
      <div className="artd-stage">
        <header className="artd-head">
          <div className="artd-protocol-row">
            <Link href="/insights" className="artd-back">
              ← Field notes
            </Link>
            <span className="artd-protocol-line" aria-hidden="true" />
            <span className="artd-stamp">KELWIN/OS · {meta.n}</span>
          </div>

          <div className="artd-meta" aria-label="Note metadata">
            {meta.topics.map((t) => (
              <span className="artd-chip" key={t}>{t}</span>
            ))}
            <span className="artd-meta-item">{meta.date}</span>
            <span className="artd-meta-div" aria-hidden="true" />
            <span className="artd-meta-item">{meta.readTime}</span>
          </div>

          <h1 className="artd-title">{title}</h1>
          <p className="artd-standfirst">{standfirst}</p>
        </header>

        <article className="artd-prose">{children}</article>

        <footer className="artd-foot">
          <p className="artd-coda">
            If this note reads like your quarter, the audit will read like
            your company.
          </p>
          <div className="artd-foot-actions">
            <HeroCTA href="/audit" label="Begin with the audit" />
            <ArrowLink href="/insights" label="More field notes" tone="sand" />
          </div>
        </footer>
      </div>
    </div>
  );
}
