"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const MANUAL = [
  { kind: "head", text: "KELWIN DIAGNOSTIC METHODOLOGY · v2.4" },
  { kind: "rule" },
  { kind: "section", text: "PROTOCOL 01 — DIAGNOSTIC REFRAME" },
  { kind: "body", text: "[1.1] Surface diagnosis treats what is visible — campaigns, conversion, rep velocity." },
  { kind: "body", text: "[1.2] Structural diagnosis treats what produces it — narrative, protocol, intelligence." },
  { kind: "body", text: "[1.3] The first returns. The second compounds. Both are valid; only one is permanent." },
  { kind: "rule" },
  { kind: "section", text: "PROTOCOL 02 — REVENUE OPERATING SYSTEM" },
  { kind: "body", text: "[2.1] Layer 01 — Narrative Infrastructure. Composite NEI across four signal dimensions." },
  { kind: "body", text: "[2.2] Layer 02 — Outbound Protocol. Sequenced, channel-mixed, installable as a system." },
  { kind: "body", text: "[2.3] Layer 03 — GTM Intelligence. Observation, recalibration, structural learning." },
  { kind: "rule" },
  { kind: "section", text: "PROTOCOL 03 — OPERATING PRINCIPLES" },
  { kind: "body", text: "[3.1] Revenue is infrastructure, not activity. Asset class: structural. Half-life: permanent." },
  { kind: "body", text: "[3.2] You do not enter a category. You define one." },
  { kind: "body", text: "[3.3] The asset is yours — system, language, playbook, transferred in full." },
  { kind: "body", text: "[3.4] Clarity is the moat. Replication cost: infinite." },
  { kind: "body", text: "[3.5] Precision is the multiplier, not reach. Compression 12:1 reads as discipline." },
  { kind: "body", text: "[3.6] Build for the room you are not in." },
  { kind: "rule" },
  { kind: "section", text: "PROTOCOL 04 — INSTALLATION METHODOLOGY" },
  { kind: "body", text: "[4.1] Diagnose. [4.2] Architect. [4.3] Install. [4.4] Calibrate." },
  { kind: "body", text: "[4.4*] The fourth keeps running. A system left alone drifts the moment the market moves." },
  { kind: "rule" },
  { kind: "body", text: "END OF DOCUMENT · Press ESC to close." },
] as const;

/**
 * DiagnosticManualOverlay — press the D key to summon a terminal-style
 * overlay that "prints" the diagnostic methodology line by line. The
 * page-wide reward for the curious. Closes on Esc or backdrop click.
 *
 * Suppressed when the focused element is editable (input/textarea/etc)
 * so the shortcut never hijacks typing.
 */
export default function DiagnosticManualOverlay() {
  const [open, setOpen] = useState(false);
  const [revealCount, setRevealCount] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    setRevealCount(0);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        close();
        return;
      }
      if (open) return;
      if ((e.key === "d" || e.key === "D") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tgt = e.target as HTMLElement | null;
        if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable)) return;
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Typewriter line reveal — one entry every 70ms once open.
  useEffect(() => {
    if (!open) return;
    if (revealCount >= MANUAL.length) return;
    const id = window.setTimeout(() => setRevealCount((n) => n + 1), 75);
    return () => window.clearTimeout(id);
  }, [open, revealCount]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sys-manual-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.25 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Diagnostic Methodology Manual"
        >
          <motion.div
            className="sys-manual-frame"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sys-manual-head">
              <span className="sys-manual-head-dot" />
              <span className="sys-manual-head-label">KELWIN/OS · MANUAL.READOUT</span>
              <button
                type="button"
                className="sys-manual-close"
                onClick={close}
                aria-label="Close manual"
              >
                ✕
              </button>
            </div>
            <div className="sys-manual-body">
              {MANUAL.slice(0, revealCount).map((line, i) => {
                if (line.kind === "rule") return <div key={i} className="sys-manual-rule" />;
                if (line.kind === "head")
                  return (
                    <div key={i} className="sys-manual-row sys-manual-row-head">
                      {line.text}
                    </div>
                  );
                if (line.kind === "section")
                  return (
                    <div key={i} className="sys-manual-row sys-manual-row-section">
                      {line.text}
                    </div>
                  );
                return (
                  <div key={i} className="sys-manual-row sys-manual-row-body">
                    {line.text}
                  </div>
                );
              })}
              <span className="sys-manual-caret" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
