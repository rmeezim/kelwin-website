"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ConvertPanel from "@/components/ui/ConvertPanel";
import "./CapabilityDetail.css";

// ─── Capability pages — the service, specified ────────────────────────────
// One component, three data sets. Each page runs the same argument:
// what the system is (and how it wires into the other two) → the full
// service manifest with named deliverables → the evidence panel (real,
// linked research — benchmarks, never promises) → the engagement shape
// (install, then the operating retainer on a system the client owns) →
// the audit close.

export interface CapService {
  n: string;
  name: string;
  desc: string;
  artifact: string;
}

export interface CapStat {
  figure: string;
  claim: string;
  source: string;
  year: string;
  url: string;
}

export interface CapPhaseItem {
  t: string;
}

export interface CapabilityData {
  code: string; // C·01
  name: string;
  overviewTitle: [string, string];
  overviewProse: React.ReactNode;
  accent: string;
  wires: { code: string; name: string; href: string; line: string }[];
  services: CapService[];
  stats: CapStat[];
  install: { weeks: string; items: string[] };
  retainer: { cadence: string; items: string[] };
  convert: { title: string; sub: string };
}

export default function CapabilityDetail({ data }: { data: CapabilityData }) {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".cap-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="cap" ref={mainRef}>
      <div className="cap-stage">
        {/* ── 01 · The system ── */}
        <section className="cap-section cap-reveal" aria-label="What this system is">
          <div className="cap-eyebrow-row">
            <span className="cap-eyebrow">The system</span>
            <span className="cap-eyebrow-dash" aria-hidden="true" />
            <span className="cap-eyebrow-meta">{data.code}/01 · WHAT IT IS</span>
          </div>
          <div className="cap-overview">
            <div className="cap-overview-copy">
              <h2 className="cap-h">
                {data.overviewTitle[0]}
                <span> {data.overviewTitle[1]}</span>
              </h2>
              <div className="cap-prose">{data.overviewProse}</div>
              <p className="cap-accent">
                <span className="cap-accent-dash" aria-hidden="true" />
                {data.accent}
              </p>
            </div>
            <div className="cap-wires">
              <div className="cap-wires-bar">
                <span className="cap-wires-id">WIRES INTO</span>
                <span className="cap-wires-line" aria-hidden="true" />
                <span className="cap-wires-stamp">ONE ARCHITECTURE</span>
              </div>
              {data.wires.map((w) => (
                <Link href={w.href} className="cap-wire" key={w.code}>
                  <span className="cap-wire-code">{w.code}</span>
                  <span className="cap-wire-body">
                    <span className="cap-wire-name">{w.name}</span>
                    <span className="cap-wire-relation">{w.line}</span>
                  </span>
                  <span className="cap-wire-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 02 · Service manifest ── */}
        <section className="cap-section cap-reveal" aria-label="Service manifest">
          <div className="cap-eyebrow-row">
            <span className="cap-eyebrow">Service manifest</span>
            <span className="cap-eyebrow-dash" aria-hidden="true" />
            <span className="cap-eyebrow-meta">{data.code}/02 · EVERY LINE SHIPS AN ARTIFACT</span>
          </div>
          <div className="cap-manifest">
            <div className="cap-manifest-bar">
              <span className="cap-wires-id">{data.name.toUpperCase()} · SCOPE</span>
              <span className="cap-wires-line" aria-hidden="true" />
              <span className="cap-wires-stamp">{data.services.length} SERVICES · DOCUMENTED</span>
            </div>
            {data.services.map((s, i) => (
              <div
                className="cap-service cap-reveal"
                style={{ ["--i" as string]: i }}
                key={s.n}
              >
                <span className="cap-service-n">{s.n}</span>
                <span className="cap-service-body">
                  <span className="cap-service-name">{s.name}</span>
                  <span className="cap-service-desc">{s.desc}</span>
                </span>
                <span className="cap-service-artifact">
                  <span className="cap-service-artifact-k">Ships</span>
                  {s.artifact}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 03 · The evidence ── */}
        <section className="cap-section cap-reveal" aria-label="Why it pays">
          <div className="cap-eyebrow-row">
            <span className="cap-eyebrow">Why it pays</span>
            <span className="cap-eyebrow-dash" aria-hidden="true" />
            <span className="cap-eyebrow-meta">{data.code}/03 · SOURCED, NOT INVENTED</span>
          </div>
          <div className="cap-stats">
            {data.stats.map((st, i) => (
              <a
                className="cap-stat cap-reveal"
                style={{ ["--i" as string]: i }}
                href={st.url}
                target="_blank"
                rel="noopener noreferrer"
                key={st.figure + st.source}
              >
                <span className="cap-stat-figure">{st.figure}</span>
                <span className="cap-stat-claim">{st.claim}</span>
                <span className="cap-stat-source">
                  {st.source.toUpperCase()} · {st.year}
                  <span className="cap-stat-ext" aria-hidden="true">↗</span>
                </span>
              </a>
            ))}
          </div>
          <p className="cap-stats-note">
            Independent research, linked at the source. These are market
            benchmarks — the audit tells you what the numbers look like in
            your pipeline before we promise anything about them.
          </p>
        </section>

        {/* ── 04 · How it lands ── */}
        <section className="cap-section cap-reveal" aria-label="Engagement shape">
          <div className="cap-eyebrow-row">
            <span className="cap-eyebrow">How it lands</span>
            <span className="cap-eyebrow-dash" aria-hidden="true" />
            <span className="cap-eyebrow-meta">{data.code}/04 · INSTALL, THEN OPERATE</span>
          </div>
          <div className="cap-shape">
            <div className="cap-phase">
              <div className="cap-phase-head">
                <span className="cap-phase-k">PHASE I</span>
                <span className="cap-phase-name">The install</span>
                <span className="cap-phase-meta">{data.install.weeks}</span>
              </div>
              <ul className="cap-phase-list">
                {data.install.items.map((it) => (
                  <li className="cap-phase-item" key={it}>
                    <span className="cap-phase-mark" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
            <span className="cap-shape-link" aria-hidden="true" />
            <div className="cap-phase is-retainer">
              <div className="cap-phase-head">
                <span className="cap-phase-k is-patina">PHASE II</span>
                <span className="cap-phase-name">The operating retainer</span>
                <span className="cap-phase-meta">{data.retainer.cadence}</span>
              </div>
              <ul className="cap-phase-list">
                {data.retainer.items.map((it) => (
                  <li className="cap-phase-item" key={it}>
                    <span className="cap-phase-mark is-patina" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="cap-shape-note">
            The retainer operates and compounds a system you own — documented
            in your language, living in your stack. If we disappear, the
            system doesn&rsquo;t.
          </p>
        </section>

        {/* ── Close ── */}
        <div className="cap-section cap-reveal">
          <ConvertPanel
            title={data.convert.title}
            sub={data.convert.sub}
            chips={["Fixed-scope install", "Operating retainer", "System stays yours"]}
            primary={{ href: "/audit", label: "Begin with the audit" }}
            secondary={{ href: "/contact", label: "Or ask us about this system" }}
          />
        </div>
      </div>
    </main>
  );
}
