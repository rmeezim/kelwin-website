import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import ArrowLink from "@/components/ui/ArrowLink";
import "./ConvertPanel.css";

// ─── ConvertPanel — the page-closing decision ─────────────────────────────
// Interior pages end on a booking decision, not a fade-out: a red-edged
// panel restating the promise (fixed scope, ten working days, readout
// yours to keep) with the audit as the loud door and a quiet second
// path. The chips row re-anchors the homepage claims at the exact moment
// of decision.

interface ConvertPanelProps {
  title: string;
  sub: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  /** Mono reinforcement chips, e.g. ["Fixed scope", "10 working days"] */
  chips?: string[];
  className?: string;
}

export default function ConvertPanel({
  title,
  sub,
  primary,
  secondary,
  chips,
  className,
}: ConvertPanelProps) {
  return (
    <section
      className={`cvp${className ? ` ${className}` : ""}`}
      aria-label="Next step"
    >
      <div className="cvp-main">
        <h2 className="cvp-title">{title}</h2>
        <p className="cvp-sub">{sub}</p>
        {chips && chips.length > 0 && (
          <div className="cvp-chips" aria-label="Engagement terms">
            {chips.map((c) => (
              <span className="cvp-chip" key={c}>{c}</span>
            ))}
          </div>
        )}
      </div>
      <div className="cvp-actions">
        <DiagnosticMethodCTA
          href={primary.href}
          label={primary.label}
          variant="signal"
        />
        {secondary && (
          <ArrowLink href={secondary.href} label={secondary.label} tone="sand" />
        )}
      </div>
    </section>
  );
}
