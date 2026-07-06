"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DiagnosticMethodCTA from "@/components/ui/DiagnosticMethodCTA";
import DotMatrixReading from "@/components/ui/DotMatrixReading";
import "./RevenueOS.css";

// ── Radar chart — 4 axes for the NEI sub-scores. Polygon area + dots. ──
const RADAR_DIMENSIONS = [
  { label: "Positioning",   short: "POS",  value: 64 },
  { label: "Coherence",     short: "COH",  value: 78 },
  { label: "Articulation",  short: "ART",  value: 85 },
  { label: "Defensibility", short: "DEF",  value: 62 },
];
const RADAR_CENTER = 160;
const RADAR_RADIUS = 110;
const RADAR_LABEL_OFFSET = 24;

function radarPoint(idx: number, magnitude: number) {
  const angle = -Math.PI / 2 + (idx * Math.PI) / 2;
  const r = (magnitude / 100) * RADAR_RADIUS;
  return [
    RADAR_CENTER + Math.cos(angle) * r,
    RADAR_CENTER + Math.sin(angle) * r,
  ];
}
function radarAxisLabelPoint(idx: number) {
  const angle = -Math.PI / 2 + (idx * Math.PI) / 2;
  const r = RADAR_RADIUS + RADAR_LABEL_OFFSET;
  return [
    RADAR_CENTER + Math.cos(angle) * r,
    RADAR_CENTER + Math.sin(angle) * r,
  ];
}

function sparkPath(values: number[], width: number, height: number): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const SPARK_CADENCE   = [4, 5, 4, 6, 5, 6, 7, 6, 6, 7];
const SPARK_CHANNELS  = [2, 3, 4, 5, 6];
const SPARK_RESPONSE  = [5.1, 4.6, 4.3, 4.2, 3.9, 4.0, 4.2];
const SPARK_CONVERT   = [9, 10, 11, 11, 12, 12.4];

// ── Omnichannel orchestration map (Layer 02 artifact) ──────────────────
// Live buying signals (left) converge on the orchestrator, which routes
// the next-best touch to whichever channel the signal warrants (right).
const ORCH_SIGNALS = [
  { label: "Intent spike",   sub: "topic research" },
  { label: "Champion move",  sub: "job change" },
  { label: "Funding event",  sub: "round closed" },
  { label: "Engagement",     sub: "content + site" },
  { label: "Hiring surge",   sub: "GTM roles open" },
];
const ORCH_CHANNELS = ["Email", "LinkedIn", "Phone", "Content", "Paid", "Events"];

const SIGNAL_SPARK_SAMPLE     = [4.2, 4.5, 4.6, 4.7, 4.7, 4.6, 4.7];
const SIGNAL_SPARK_ACCOUNTS   = [210, 218, 226, 234, 240, 244, 247];
const SIGNAL_SPARK_LAST       = [840, 855, 880, 870, 885, 890, 900];
const SIGNAL_SPARK_COHERENCE  = [0.79, 0.81, 0.82, 0.83, 0.84, 0.84, 0.84];

export default function RevenueOS() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const neiPlayedRef = useRef(false);

  // ── Comet animation in the protocol panel — perpetual, mount once.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const svg = wrap.querySelector<SVGSVGElement>(".protocol-panel .loop-svg");
    const track = svg && svg.querySelector<SVGPathElement>("#loopTrackPath");
    if (!svg || !track) return;
    const len = track.getTotalLength();
    const d = track.getAttribute("d");
    if (!d) return;
    const NS = "http://www.w3.org/2000/svg";

    const N = 18;
    const SPACING = 2.0;
    const DASH = 2.4;

    const grp = document.createElementNS(NS, "g");
    grp.setAttribute("class", "loop-comet");
    const segs: SVGPathElement[] = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      p.setAttribute("class", "comet-seg");
      p.style.strokeWidth = (2.0 - 1.4 * t).toFixed(2);
      p.style.opacity = (0.5 * Math.pow(1 - t, 1.4)).toFixed(3);
      p.style.strokeDasharray = DASH + " " + len;
      grp.appendChild(p);
      segs.push(p);
    }
    track.parentNode!.insertBefore(grp, track.nextSibling);

    const dots = Array.from(svg.querySelectorAll<SVGGElement>(".loop-dot"));
    const labels = Array.from(svg.querySelectorAll<SVGGElement>(".loop-label"));
    const n = dots.length;
    const SAMPLES = 1000;
    const sx: number[] = [];
    const sy: number[] = [];
    const sd: number[] = [];
    for (let s = 0; s <= SAMPLES; s++) {
      const dist = (s / SAMPLES) * len;
      const pt = track.getPointAtLength(dist);
      sd.push(dist);
      sx.push(pt.x);
      sy.push(pt.y);
    }
    const dotDist = dots.map((g) => {
      const r = g.querySelector<SVGRectElement>(".ring")!;
      const cx = parseFloat(r.getAttribute("x") || "0") + 6;
      const cy = parseFloat(r.getAttribute("y") || "0") + 6;
      let best = 0;
      let bd = Infinity;
      for (let s = 0; s <= SAMPLES; s++) {
        const dx = sx[s] - cx;
        const dy = sy[s] - cy;
        const dd = dx * dx + dy * dy;
        if (dd < bd) { bd = dd; best = sd[s]; }
      }
      return best;
    });
    const FADE_DOTS = 4;
    const thresh = dotDist.map((dd, i) =>
      (((dotDist[(i + FADE_DOTS) % n] - dd) % len) + len) % len
    );

    const proxy = { p: 0 };
    const tween = gsap.to(proxy, {
      p: len,
      duration: 7.5,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        for (let i = 0; i < N; i++) {
          segs[i].style.strokeDashoffset = (-(proxy.p - i * SPACING)).toFixed(2);
        }
        const head = proxy.p % len;
        for (let k = 0; k < n; k++) {
          const fwd = (((head - dotDist[k]) % len) + len) % len;
          const active = fwd < thresh[k];
          dots[k].classList.toggle("is-active", active);
          labels[k]?.classList.toggle("is-active", active);
        }
      },
    });
    return () => {
      tween.kill();
      grp.parentNode?.removeChild(grp);
    };
  }, []);

  // ── NEI animation — dot-matrix cells sweep in + radar fades in once
  // layer 1 is in view. The value row carries `dm-armed` in markup (cells
  // start hidden); adding `dm-live` triggers the per-cell staggered
  // reveal defined in SystemFurniture.css. Reduced-motion users get the
  // cells immediately via the CSS override.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.querySelectorAll<SVGPathElement>(".radar-area").forEach((el) => (el.style.opacity = "1"));
      wrap.querySelectorAll<SVGCircleElement>(".radar-point").forEach((el) => (el.style.opacity = "1"));
      return;
    }

    const valueRow = wrap.querySelector<HTMLElement>('[data-layer="1"] .nei-value-row');
    const area = wrap.querySelector<SVGPathElement>('[data-layer="1"] .radar-area');
    const points = wrap.querySelectorAll<SVGCircleElement>('[data-layer="1"] .radar-point');
    const axisValues = wrap.querySelectorAll<SVGTextElement>('[data-layer="1"] .radar-axis-value');

    if (area) area.style.opacity = "0";
    points.forEach((p) => (p.style.opacity = "0"));
    axisValues.forEach((l) => (l.style.opacity = "0"));

    const layer1 = wrap.querySelector<HTMLElement>('[data-layer="1"]');
    if (!layer1) return;

    const play = () => {
      if (neiPlayedRef.current) return;
      neiPlayedRef.current = true;

      valueRow?.classList.add("dm-live");
      if (area) gsap.to(area, { opacity: 1, duration: 0.7, delay: 0.25, ease: "power2.out" });
      points.forEach((p, i) =>
        gsap.to(p, { opacity: 1, duration: 0.4, delay: 0.4 + i * 0.1, ease: "power2.out" })
      );
      axisValues.forEach((l, i) =>
        gsap.to(l, { opacity: 1, duration: 0.4, delay: 0.55 + i * 0.1, ease: "power2.out" })
      );
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) play(); }),
      { threshold: 0.3 }
    );
    io.observe(layer1);
    return () => io.disconnect();
  }, []);

  // ── Cursor-following bronze glow inside each artifact panel.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const panels = wrap.querySelectorAll<HTMLElement>(".artifact-panel");
    const cleanups: Array<() => void> = [];
    panels.forEach((panel) => {
      const onMove = (e: MouseEvent) => {
        const rect = panel.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        panel.style.setProperty("--cursor-x", `${x}%`);
        panel.style.setProperty("--cursor-y", `${y}%`);
      };
      const onLeave = () => {
        panel.style.setProperty("--cursor-x", "-50%");
        panel.style.setProperty("--cursor-y", "-50%");
      };
      panel.addEventListener("mousemove", onMove);
      panel.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        panel.removeEventListener("mousemove", onMove);
        panel.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  // ── Layer state tracking — fade layers above the currently-active one,
  // and update the spine nodes' is-active / is-passed states. Tracked via
  // IO so the active layer follows scroll position instead of relying on
  // an interaction.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const stages = Array.from(wrap.querySelectorAll<HTMLElement>(".layer-stage"));
    const nodes = Array.from(wrap.querySelectorAll<HTMLElement>(".layer-spine-node"));
    if (!stages.length) return;

    let activeLayer = 0;
    const applyStates = () => {
      stages.forEach((stage, i) => {
        stage.classList.toggle("is-active", i === activeLayer);
        stage.classList.toggle("is-passed", i < activeLayer);
      });
      nodes.forEach((node, i) => {
        node.classList.toggle("is-active", i === activeLayer);
        node.classList.toggle("is-passed", i < activeLayer);
      });
    };

    const visible = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = stages.indexOf(e.target as HTMLElement);
          if (i < 0) return;
          if (e.isIntersecting) visible.add(i);
          else visible.delete(i);
        });
        if (visible.size > 0) {
          const next = Math.max(...visible);
          if (next !== activeLayer) {
            activeLayer = next;
            applyStates();
          }
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: 0 }
    );
    stages.forEach((s) => io.observe(s));
    applyStates();
    return () => io.disconnect();
  }, []);

  // ── Vertical spine — dotted bronze track with a solid fill scaled by
  // scroll progress through the 3 layers. Same vocabulary as Methodology.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const fill = wrap.querySelector<HTMLElement>(".layer-spine-fill");
      if (fill) fill.style.clipPath = "inset(0 0 0% 0)";
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const fill = wrap.querySelector<HTMLElement>(".layer-spine-fill");
    const zone = wrap.querySelector<HTMLElement>(".layers-zone");
    if (!fill || !zone) return;

    // clip-path reveal (not scaleY) — stays pixel-crisp at every progress.
    gsap.set(fill, { clipPath: "inset(0% 0% 100% 0%)" });
    const tween = gsap.to(fill, {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: "none",
      scrollTrigger: {
        trigger: zone,
        start: "top center",
        end: "bottom center",
        scrub: 0.4,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // ── Recalibration progress.
  const recalDaysElapsed = 43;
  const recalDaysTotal = 90;
  const recalRemaining = recalDaysTotal - recalDaysElapsed;
  const recalFill = (recalDaysElapsed / recalDaysTotal) * 100;

  return (
    <div className="revos-pin" id="revenue-os" ref={wrapRef}>
      <div className="revos-bg" />

      <div className="revos-stage">
        <div className="scaffold-row">
          <h2 className="scaffold-heading">
            <span className="line-1">Kelwin doesn&rsquo;t deliver work.</span>
            <span className="line-2">We install systems.</span>
          </h2>
          <p className="scaffold-body">
            The Revenue Operating System is the architecture we build into your
            company — three layers that produce pipeline as a compounding
            output, not a one-time deliverable.
            <span className="body-coda">Services end. Architecture compounds.</span>
          </p>
          <div className="scaffold-cta">
            <DiagnosticMethodCTA
              href="/audit"
              label="Initiate System Audit"
              variant="signal"
            />
          </div>
        </div>

        <div className="layers-zone">

        <div className="layer-spine" aria-hidden="true">
          <span className="layer-spine-track" />
          <span className="layer-spine-fill" />
          <span className="layer-spine-node" data-pos="1" />
          <span className="layer-spine-node" data-pos="2" />
          <span className="layer-spine-node" data-pos="3" />
        </div>

        {/* LAYER 01 — Narrative */}
        <div className="layer-stage" data-layer="1">
          <div className="layer-info">
            <div className="layer-eyebrow">Infrastructure Layer · 01 / 03</div>
            <h3 className="layer-name">Narrative<br />Infrastructure</h3>
            <div className="layer-divider"></div>
            <p className="layer-definition">The positioning and language architecture that decides whether buyers can explain you in their own words. If it&rsquo;s muddy, every channel inherits the blur.</p>
            <div className="layer-output">
              <div className="output-label">In Practice</div>
              <div className="output-text">We rewrite the words your homepage, your deck, and your reps use — until a buyer can repeat them without you in the room.</div>
            </div>
            <div className="layer-output">
              <div className="output-label">Structural Output</div>
              <div className="output-text">A narrative that stays coherent from your homepage to a buyer pitching internally — without degrading as it moves through channels, reps, or decision-makers.</div>
            </div>
          </div>

          <div className="artifact-panel nei-specimen">
            <span className="panel-glow" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-tl" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-tr" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-bl" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-br" aria-hidden="true"></span>
            <div className="nei-header">
              <div>
                <span className="nei-protocol-label">Protocol 01 Output</span>
                <span className="nei-slash">/</span>
                <span className="nei-title">Narrative Entropy Index</span>
              </div>
              <div className="nei-meta">
                <span className="nei-version">v2.4</span>
                <span className="nei-acronym">NEI</span>
              </div>
            </div>
            <div className="nei-body-grid">
              <div className="nei-index-display">
                <div className="nei-value-row dm-armed">
                  <DotMatrixReading
                    value="72.4"
                    cell={10}
                    label="Narrative Entropy Index: 72.4 percent"
                  />
                  <span className="nei-unit">%</span>
                </div>
                <div className="nei-status-row">
                  <span className="nei-status-dot"></span>
                  <span>Entropic — recalibration required</span>
                </div>
                <div className="nei-rule"></div>
                <div className="nei-caption">Composite reading across four signal dimensions. Lower values indicate greater coherence.</div>
              </div>

              <div className="nei-radar">
                <svg viewBox="0 0 320 320" preserveAspectRatio="xMidYMid meet">
                  {[0.25, 0.5, 0.75, 1].map((r) => (
                    <circle
                      key={r}
                      className={`radar-ring ${r === 1 ? "is-outer" : ""}`}
                      cx={RADAR_CENTER}
                      cy={RADAR_CENTER}
                      r={RADAR_RADIUS * r}
                    />
                  ))}
                  {RADAR_DIMENSIONS.map((_, i) => {
                    const angle = -Math.PI / 2 + (i * Math.PI) / 2;
                    const x2 = RADAR_CENTER + Math.cos(angle) * RADAR_RADIUS;
                    const y2 = RADAR_CENTER + Math.sin(angle) * RADAR_RADIUS;
                    return (
                      <line
                        key={i}
                        className="radar-axis"
                        x1={RADAR_CENTER}
                        y1={RADAR_CENTER}
                        x2={x2}
                        y2={y2}
                      />
                    );
                  })}
                  <path
                    className="radar-area"
                    d={
                      RADAR_DIMENSIONS.map((d, i) => {
                        const [x, y] = radarPoint(i, d.value);
                        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      }).join(" ") + " Z"
                    }
                  />
                  {RADAR_DIMENSIONS.map((d, i) => {
                    const [x, y] = radarPoint(i, d.value);
                    return <circle key={i} className="radar-point" cx={x} cy={y} r={3.2} />;
                  })}
                  {RADAR_DIMENSIONS.map((d, i) => {
                    const [lx, ly] = radarAxisLabelPoint(i);
                    const anchor = i === 1 ? "start" : i === 3 ? "end" : "middle";
                    return (
                      <g key={i}>
                        <text className="radar-axis-label" x={lx} y={ly - 6} textAnchor={anchor}>
                          {d.short}
                        </text>
                        <text className="radar-axis-value" x={lx} y={ly + 8} textAnchor={anchor}>
                          {d.value}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="nei-footer">
              <div>
                <span className="nei-meth-label">Specimen</span>
                <span>Illustrative readout. Your narrative layer ships with this index — first calibrated during the audit.</span>
              </div>
              <Link href="/audit" className="nei-spec-cta">
                See the audit spec
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                  <path d="M0 4h12M12 4L9 1M12 4L9 7" stroke="currentColor" strokeWidth="1" strokeLinecap="square" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* LAYER 02 — Omnichannel */}
        <div className="layer-stage" data-layer="2">
          <div className="layer-info">
            <div className="layer-eyebrow">Infrastructure Layer · 02 / 03</div>
            <h3 className="layer-name">Omnichannel<br />Infrastructure</h3>
            <div className="layer-divider"></div>
            <p className="layer-definition">One engine across email, LinkedIn, phone, content, paid, and events — routed by live buying signal, not a static sequence. The system decides the next-best touch.</p>
            <div className="layer-output">
              <div className="output-label">In Practice</div>
              <div className="output-text">We design the plays and triggers across your channels, install them in your stack, and run the first cycles with your team.</div>
            </div>
            <div className="layer-output">
              <div className="output-label">Structural Output</div>
              <div className="output-text">Pipeline that doesn&apos;t depend on any single channel. Effort routes to wherever the signal is — and the system holds when a channel cools or a rep leaves.</div>
            </div>
          </div>

          <div className="artifact-panel protocol-panel">
            <span className="panel-glow" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-tl" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-tr" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-bl" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-br" aria-hidden="true"></span>
            <div className="pmap-header">
              <span className="pmap-header-label">Signal Orchestration — Omnichannel Standard</span>
              <span className="pmap-header-spec">Specimen · v.ORCH/02.B</span>
            </div>
            {/* Signal → orchestrator → channel routing map. Live buying
                signals converge on the orchestrator, which routes the
                next-best touch to whichever channel the signal warrants —
                the full omnichannel picture, not an outbound cadence. */}
            <div className="pmap-loop">
              <svg className="orch-svg" viewBox="0 0 640 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                {/* signal → orchestrator wires + flows */}
                {ORCH_SIGNALS.map((s, i) => {
                  const y = 56 + i * 52;
                  const d = `M 168 ${y} C 214 ${y}, 216 160, 252 160`;
                  return (
                    <g key={s.label}>
                      <path className="orch-wire" d={d} />
                      <path className="orch-flow" d={d} style={{ animationDelay: `${i * 0.5}s` }} />
                    </g>
                  );
                })}
                {/* orchestrator → channel wires + flows */}
                {ORCH_CHANNELS.map((c, i) => {
                  const y = 40 + i * 48;
                  const d = `M 400 160 C 438 160, 440 ${y}, 478 ${y}`;
                  return (
                    <g key={c}>
                      <path className="orch-wire" d={d} />
                      <path className="orch-flow" d={d} style={{ animationDelay: `${0.25 + i * 0.45}s` }} />
                    </g>
                  );
                })}

                {/* signal labels (left) */}
                {ORCH_SIGNALS.map((s, i) => {
                  const y = 56 + i * 52;
                  return (
                    <g key={s.label}>
                      <rect className="orch-sig-dot" x="14" y={y - 4} width="8" height="8" />
                      <text className="orch-sig-text" x="30" y={y - 2}>{s.label}</text>
                      <text className="orch-sig-sub" x="30" y={y + 11}>{s.sub}</text>
                    </g>
                  );
                })}

                {/* orchestrator node (center) */}
                <rect className="orch-node" x="252" y="122" width="148" height="76" />
                <path className="orch-node-bracket" d="M 252 134 L 252 122 L 264 122" />
                <path className="orch-node-bracket" d="M 400 186 L 400 198 L 388 198" />
                <circle className="orch-node-live" cx="388" cy="134" r="3" />
                <text className="orch-node-title" x="326" y="156" textAnchor="middle">Orchestrator</text>
                <text className="orch-node-sub" x="326" y="174" textAnchor="middle">next-best touch</text>

                {/* channel chips (right) */}
                {ORCH_CHANNELS.map((c, i) => {
                  const y = 40 + i * 48;
                  return (
                    <g key={c}>
                      <rect className="orch-chip" x="478" y={y - 16} width="148" height="32" />
                      <text className="orch-chip-text" x="552" y={y + 4} textAnchor="middle">{c}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="pmap-stats">
              <div>
                <div className="pmap-stat-label">Trigger</div>
                <div className="pmap-stat-value">
                  Signal-based
                  <svg className="stat-spark" viewBox="0 0 60 14" preserveAspectRatio="none">
                    <path d={sparkPath(SPARK_CADENCE, 60, 14)} />
                  </svg>
                </div>
              </div>
              <div>
                <div className="pmap-stat-label">Channels</div>
                <div className="pmap-stat-value">
                  6 orchestrated
                  <svg className="stat-spark" viewBox="0 0 60 14" preserveAspectRatio="none">
                    <path d={sparkPath(SPARK_CHANNELS, 60, 14)} />
                  </svg>
                </div>
              </div>
              <div>
                <div className="pmap-stat-label">Avg Response</div>
                <div className="pmap-stat-value">
                  4.2 days
                  <svg className="stat-spark" viewBox="0 0 60 14" preserveAspectRatio="none">
                    <path d={sparkPath(SPARK_RESPONSE, 60, 14)} />
                  </svg>
                </div>
              </div>
              <div>
                <div className="pmap-stat-label">Conversion</div>
                <div className="pmap-stat-value">
                  12.4%
                  <svg className="stat-spark" viewBox="0 0 60 14" preserveAspectRatio="none">
                    <path d={sparkPath(SPARK_CONVERT, 60, 14)} />
                  </svg>
                </div>
              </div>
            </div>
            <div className="panel-anchor">
              Illustrative orchestration. Your channel mix is designed to
              your motion and routed by live signal — not a fixed cadence.
            </div>
          </div>
        </div>

        {/* LAYER 03 — Intelligence */}
        <div className="layer-stage" data-layer="3">
          <div className="layer-info">
            <div className="layer-eyebrow">Infrastructure Layer · 03 / 03</div>
            <h3 className="layer-name">GTM<br />Intelligence</h3>
            <div className="layer-divider"></div>
            <p className="layer-definition">The observation layer that watches every interaction and feeds what works back into narrative and channels — so the system learns instead of decaying.</p>
            <div className="layer-output">
              <div className="output-label">In Practice</div>
              <div className="output-text">We instrument every touch, then sit with you each quarter and retune the system against what the signal says.</div>
            </div>
            <div className="layer-output">
              <div className="output-label">Structural Output</div>
              <div className="output-text">A revenue system that gets sharper every quarter, rather than depreciating the moment its installers leave. Every interaction strengthens the next.</div>
            </div>
          </div>

          <div className="artifact-panel signal-panel">
            <span className="panel-glow" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-tl" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-tr" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-bl" aria-hidden="true"></span>
            <span className="panel-corner panel-corner-br" aria-hidden="true"></span>
            <div className="signal-header">
              <span className="signal-header-label"><span className="signal-live-dot"></span>Signal Acquisition — Specimen Feed</span>
              <span className="signal-header-meta">CYCLE Q4·24</span>
            </div>
            <div className="signal-canvas">
              <div className="signal-rows">
                <div className="signal-row">
                  <div className="signal-row-label"><span className="signal-row-icon"></span>Engagement Signal</div>
                  <div className="signal-waveform signal-waveform-1">
                    <svg viewBox="0 0 400 32" preserveAspectRatio="none" fill="none">
                      <path d="M0 16 Q 10 6, 20 16 T 40 16 T 60 10 T 80 20 T 100 16 T 120 8 T 140 22 T 160 14 T 180 16 T 200 16 Q 210 6, 220 16 T 240 16 T 260 10 T 280 20 T 300 16 T 320 8 T 340 22 T 360 14 T 380 16 T 400 16" stroke="#A65A45" strokeWidth="1" />
                    </svg>
                    <span className="signal-now-tick" aria-hidden="true"></span>
                  </div>
                </div>
                <div className="signal-row">
                  <div className="signal-row-label"><span className="signal-row-icon"></span>Pipeline Velocity</div>
                  <div className="signal-waveform signal-waveform-2">
                    <svg viewBox="0 0 400 32" preserveAspectRatio="none" fill="none">
                      <path d="M0 18 L 30 18 L 40 6 L 60 6 L 70 24 L 100 24 L 110 12 L 140 12 L 150 18 L 200 18 L 230 18 L 240 6 L 260 6 L 270 24 L 300 24 L 310 12 L 340 12 L 350 18 L 400 18" stroke="#A65A45" strokeWidth="1" />
                    </svg>
                    <span className="signal-now-tick" aria-hidden="true"></span>
                  </div>
                </div>
                <div className="signal-row">
                  <div className="signal-row-label"><span className="signal-row-icon"></span>Conversion Quality</div>
                  <div className="signal-waveform signal-waveform-3">
                    <svg viewBox="0 0 400 32" preserveAspectRatio="none" fill="none">
                      <path d="M0 16 C 20 16, 30 4, 50 16 S 80 16, 100 10 S 130 22, 150 16 S 180 4, 200 16 C 220 16, 230 4, 250 16 S 280 16, 300 10 S 330 22, 350 16 S 380 4, 400 16" stroke="#A65A45" strokeWidth="1" />
                    </svg>
                    <span className="signal-now-tick" aria-hidden="true"></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="signal-footer">
              <div className="signal-footer-grid">
                <div>
                  <div className="signal-stat-label">Sample Rate</div>
                  <div className="signal-stat-value">
                    4.7 Hz
                    <svg className="stat-spark" viewBox="0 0 60 14" preserveAspectRatio="none">
                      <path d={sparkPath(SIGNAL_SPARK_SAMPLE, 60, 14)} />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="signal-stat-label">Active Accounts</div>
                  <div className="signal-stat-value">
                    247
                    <svg className="stat-spark" viewBox="0 0 60 14" preserveAspectRatio="none">
                      <path d={sparkPath(SIGNAL_SPARK_ACCOUNTS, 60, 14)} />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="signal-stat-label">Last Acquisition</div>
                  <div className="signal-stat-value">
                    14:23:47 GMT
                    <svg className="stat-spark" viewBox="0 0 60 14" preserveAspectRatio="none">
                      <path d={sparkPath(SIGNAL_SPARK_LAST, 60, 14)} />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="signal-stat-label">Signal Coherence</div>
                  <div className="signal-stat-value">
                    84%
                    <svg className="stat-spark" viewBox="0 0 60 14" preserveAspectRatio="none">
                      <path d={sparkPath(SIGNAL_SPARK_COHERENCE, 60, 14)} />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="signal-recalibration">
                <div className="recal-header">
                  <span className="recal-label">Next Recalibration</span>
                  <span className="recal-eta">T-{recalRemaining}D</span>
                </div>
                <div className="recal-bar">
                  <span
                    className="recal-fill"
                    style={{ transform: `scaleX(${recalFill / 100})` }}
                  />
                </div>
                <div className="recal-meta">Q4·2024 Signal Review — cycle {Math.round(recalFill)}% complete</div>
              </div>
              <div className="panel-anchor">
                Illustrative feed. Once live, these readouts run on your
                accounts — not a dashboard we keep.
              </div>
            </div>
          </div>
        </div>

        </div>

      </div>
    </div>
  );
}
