"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import "./SystemArchitecture.css";

interface Node {
  id: string;
  kind: "io" | "layer" | "output";
  label: string;
  title: string;
  sub: string;
  live?: boolean;
}

const NODES: Node[] = [
  { id: "in",  kind: "io",     label: "Ingest",   title: "Market Signal",        sub: "ICP · intent · demand" },
  { id: "l1",  kind: "layer",  label: "Layer 01", title: "Narrative",            sub: "Positioning & language" },
  { id: "l2",  kind: "layer",  label: "Layer 02", title: "Channels",             sub: "Omnichannel orchestration" },
  { id: "l3",  kind: "layer",  label: "Layer 03", title: "Intelligence",         sub: "Observe & learn" },
  { id: "out", kind: "output", label: "Output",   title: "Compounding Pipeline", sub: "Institutional revenue", live: true },
];

// Forward chain + one feedback edge (Intelligence → Narrative = the loop
// that makes the system compound instead of resetting each quarter).
const FORWARD: [string, string, string][] = [
  ["in", "l1", "define"],
  ["l1", "l2", "activate"],
  ["l2", "l3", "measure"],
  ["l3", "out", "compound"],
];
const FEEDBACK: [string, string, string] = ["l3", "l1", "learn & retune"];

export default function SystemArchitecture() {
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Entrance reveal.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll<HTMLElement>(".sa-reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.15 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Draw + maintain the SVG connectors from the real node positions, so the
  // wires always meet the modules regardless of layout (row on desktop,
  // column on mobile) or viewport size.
  useLayoutEffect(() => {
    const diagram = diagramRef.current;
    const svg = svgRef.current;
    if (!diagram || !svg) return;
    const SVGNS = "http://www.w3.org/2000/svg";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rectOf = (id: string) => {
      const el = diagram.querySelector<HTMLElement>(`[data-node="${id}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const d = diagram.getBoundingClientRect();
      return { l: r.left - d.left, t: r.top - d.top, w: r.width, h: r.height,
               cx: r.left - d.left + r.width / 2, cy: r.top - d.top + r.height / 2 };
    };

    // Exit/enter points chosen by dominant axis between the two modules.
    const link = (a: string, b: string) => {
      const A = rectOf(a), B = rectOf(b);
      if (!A || !B) return null;
      const dx = B.cx - A.cx, dy = B.cy - A.cy;
      let p1, p2;
      if (Math.abs(dx) >= Math.abs(dy)) {
        // horizontal: right of A → left of B (or reverse)
        const dir = dx >= 0 ? 1 : -1;
        p1 = { x: A.cx + dir * A.w / 2, y: A.cy };
        p2 = { x: B.cx - dir * B.w / 2, y: B.cy };
      } else {
        const dir = dy >= 0 ? 1 : -1;
        p1 = { x: A.cx, y: A.cy + dir * A.h / 2 };
        p2 = { x: B.cx, y: B.cy - dir * B.h / 2 };
      }
      return { p1, p2 };
    };

    const straightPath = (a: string, b: string) => {
      const e = link(a, b);
      if (!e) return "";
      const { p1, p2 } = e;
      const mx = (p1.x + p2.x) / 2;
      // gentle S so near-aligned nodes still read as a wire, not a seam
      return `M ${p1.x} ${p1.y} C ${mx} ${p1.y}, ${mx} ${p2.y}, ${p2.x} ${p2.y}`;
    };

    // Feedback: bow away from the forward line (up on desktop row, aside on
    // a mobile column) so it reads as a distinct return path.
    const feedbackPath = (a: string, b: string) => {
      const A = rectOf(a), B = rectOf(b);
      if (!A || !B) return "";
      const horizontal = Math.abs(B.cx - A.cx) >= Math.abs(B.cy - A.cy);
      if (horizontal) {
        const p1 = { x: A.cx, y: A.t };            // top of Intelligence
        const p2 = { x: B.cx, y: B.t };            // top of Narrative
        const bow = Math.min(96, 46 + Math.abs(p1.x - p2.x) * 0.12);
        const cy = Math.min(p1.y, p2.y) - bow;
        return `M ${p1.x} ${p1.y} C ${p1.x} ${cy}, ${p2.x} ${cy}, ${p2.x} ${p2.y}`;
      }
      const p1 = { x: A.l, y: A.cy };              // left of Intelligence
      const p2 = { x: B.l, y: B.cy };              // left of Narrative
      const bow = 40;
      const cx = Math.min(p1.x, p2.x) - bow;
      return `M ${p1.x} ${p1.y} C ${cx} ${p1.y}, ${cx} ${p2.y}, ${p2.x} ${p2.y}`;
    };

    let anims: Animation[] = [];

    const build = () => {
      const w = diagram.clientWidth;
      const h = diagram.clientHeight;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("width", `${w}`);
      svg.setAttribute("height", `${h}`);
      anims.forEach((a) => a.cancel());
      anims = [];
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const addEdge = (d: string, label: string, feedback = false, i = 0) => {
        if (!d) return;
        const base = document.createElementNS(SVGNS, "path");
        base.setAttribute("d", d);
        base.setAttribute("class", feedback ? "sa-edge-base is-feedback" : "sa-edge-base");
        svg.appendChild(base);
        const flow = document.createElementNS(SVGNS, "path");
        flow.setAttribute("d", d);
        flow.setAttribute("class", feedback ? "sa-edge-flow is-feedback" : "sa-edge-flow");
        svg.appendChild(flow);

        const len = (flow as SVGPathElement).getTotalLength();
        // Edge caption at the wire midpoint (or apex for the feedback bow).
        if (label) {
          const mid = (flow as SVGPathElement).getPointAtLength(len / 2);
          const text = document.createElementNS(SVGNS, "text");
          text.setAttribute("x", `${mid.x}`);
          text.setAttribute("y", `${mid.y - 9}`);
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("class", feedback ? "sa-edge-text is-feedback" : "sa-edge-text");
          text.textContent = label;
          svg.appendChild(text);
        }

        if (reduce) return;
        // A bright comet traverses the wire toward its target — long enough
        // to read as directional flow, not a flickering dot.
        const packet = feedback ? 16 : 24;
        flow.style.strokeDasharray = `${packet} ${len}`;
        const dur = Math.max(1100, len * (feedback ? 9 : 7));
        const anim = flow.animate(
          [{ strokeDashoffset: 0 }, { strokeDashoffset: -(len + packet) }],
          { duration: dur, iterations: Infinity, easing: "linear", delay: i * 260 }
        );
        anims.push(anim);
      };

      FORWARD.forEach(([a, b, label], i) => addEdge(straightPath(a, b), label, false, i));
      addEdge(feedbackPath(FEEDBACK[0], FEEDBACK[1]), "continuous learning loop", true, 0);
    };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(diagram);
    // fonts settling can shift node sizes; rebuild once more shortly after mount
    const t = window.setTimeout(build, 350);
    return () => { ro.disconnect(); window.clearTimeout(t); anims.forEach((a) => a.cancel()); };
  }, []);

  const nodeById = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <section id="architecture" className="sysarch" ref={sectionRef}>
      <div className="sysarch-stage">
        <header className="sysarch-head sa-reveal">
          <div className="sysarch-head-top">
            <span className="sysarch-eyebrow">
              <span className="sysarch-eyebrow-dash" aria-hidden="true" />
              System Architecture
            </span>
            <span className="sysarch-meta">Revenue OS · Topology</span>
          </div>
          <h2 className="sysarch-heading">
            <span className="line-1">Three layers.</span>{" "}
            <span className="line-2">One closed loop.</span>
          </h2>
          <p className="sysarch-sub">
            Narrative shapes what the market hears. Channels put it in motion.
            Intelligence feeds back what works — and that returning signal is
            why the system compounds instead of resetting.
          </p>
        </header>

        <div className="sysarch-diagram sa-reveal" ref={diagramRef}>
          <svg className="sysarch-edges" ref={svgRef} aria-hidden="true" />

          <div className="sysarch-nodes">
            {NODES.map((n) => (
              <div className="sa-slot" key={n.id}>
                <div className={`sa-node sa-node-${n.kind}`} data-node={n.id}>
                  <span className="sa-node-bracket sa-bracket-tl" aria-hidden="true" />
                  <span className="sa-node-bracket sa-bracket-br" aria-hidden="true" />
                  <span className="sa-node-label">{n.label}</span>
                  <span className="sa-node-title">
                    {n.title}
                    {n.live && <span className="sa-node-live" aria-hidden="true" />}
                  </span>
                  <span className="sa-node-sub">{n.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sysarch-legend sa-reveal" aria-hidden="true">
          <span className="sa-legend-item"><span className="sa-legend-flow" /> Signal flow</span>
          <span className="sa-legend-item"><span className="sa-legend-loop" /> Learning loop</span>
          <span className="sa-legend-note">
            The asset is yours — {nodeById("l1").title.toLowerCase()}, {nodeById("l2").title.toLowerCase()},{" "}
            and {nodeById("l3").title.toLowerCase()} stay with your team.
          </span>
        </div>
      </div>
    </section>
  );
}
