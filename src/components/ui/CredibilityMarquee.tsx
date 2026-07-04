"use client";

import { useState } from "react";

const MARKS = ["EQT", "KKR", "BLACKSTONE", "A16Z", "DHL", "DYSON", "BMO", "BELL"];

// Duplicate for seamless loop — animate to -50% = one full set width
const TRACK = [...MARKS, ...MARKS];

export default function CredibilityMarquee({ className = "mt-12 md:mt-14" }: { className?: string }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={`${className} w-full`}>
      {/* Descriptor */}
      <p
        className="text-center text-[10px] tracking-[0.18em] font-body font-medium uppercase leading-relaxed mb-5"
        style={{ color: "var(--text-faint)" }}
      >
        Trusted by operators at leading institutions and backed companies.
      </p>

      {/* Marquee */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex items-center w-max py-1"
          style={{
            gap: "2.75rem",
            animation: "kelwin-marquee 30s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {TRACK.map((mark, i) => (
            <span
              key={i}
              className="shrink-0 inline-flex items-center gap-[2.75rem]"
            >
              <span
                className="text-[11px] tracking-[0.26em] font-body font-medium"
                style={{ color: "rgba(251, 250, 246,0.3)" }}
              >
                {mark}
              </span>
              {/* Subtle bronze separator dot */}
              <span
                className="text-[8px] shrink-0"
                style={{ color: "rgba(199, 180, 157,0.35)" }}
                aria-hidden="true"
              >
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
