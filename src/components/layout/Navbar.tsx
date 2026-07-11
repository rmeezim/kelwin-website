"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import "./NavMega.css";

/* Every destination is a real page or section. The one red element per
   panel is the audit CTA card (`cta: true`). */
type MegaLink = {
  title: string;
  desc: string;
  href?: string;
  tag?: string;
  glyph?: GlyphName;
  cta?: boolean;
};
type MegaDef = {
  protocol: string;
  featureCols?: 2 | 3;
  features: MegaLink[];
  smalls?: MegaLink[];
  rail?: MegaLink[];
};
type NavItem =
  | { label: string; href: string; mega?: never }
  | { label: string; href?: never; mega: MegaDef };

const navItems: NavItem[] = [
  {
    label: "CAPABILITIES",
    mega: {
      protocol: "Capabilities · Systems",
      featureCols: 3,
      features: [
        {
          tag: "C·01",
          glyph: "narrative",
          title: "Narrative Systems",
          desc: "The message system, proof architecture, and category the market hears.",
          href: "/capabilities/narrative-systems",
        },
        {
          tag: "C·02",
          glyph: "channels",
          title: "GTM Infrastructure",
          desc: "Signal-based orchestration across email, social, phone, content, events.",
          href: "/capabilities/gtm-infrastructure",
        },
        {
          tag: "C·03",
          glyph: "intelligence",
          title: "GTM Intelligence",
          desc: "Instrumentation and quarterly calibration — the loop that compounds.",
          href: "/capabilities/gtm-intelligence",
        },
      ],
      rail: [
        {
          title: "The System Audit",
          desc: "Where every engagement begins — fixed scope, ten working days.",
          href: "/audit",
          cta: true,
        },
        {
          title: "The full stack, on one page",
          desc: "How the three layers wire into one operating system.",
          href: "/#revenue-os",
        },
      ],
    },
  },
  { label: "METHODOLOGY", href: "/#methodology" },
  {
    label: "THE FIRM",
    mega: {
      protocol: "The Firm · Dossier",
      featureCols: 3,
      features: [
        {
          tag: "F·01",
          glyph: "firm",
          title: "About Us",
          desc: "Why Kelwin exists — and the rebuild cycle we're here to end.",
          href: "/about",
        },
        {
          tag: "F·02",
          glyph: "fit",
          title: "Who We Work With",
          desc: "The profile and industries we take on — and where we say no.",
          href: "/who-we-work-with",
        },
        {
          tag: "F·03",
          glyph: "careers",
          title: "Careers",
          desc: "No open roles right now — we hire slowly, on purpose.",
          href: "/careers",
        },
      ],
    },
  },
  {
    label: "RESOURCES",
    mega: {
      protocol: "Resources · Index",
      features: [
        {
          tag: "R·01",
          glyph: "insights",
          title: "Insights",
          desc: "Field notes from the install base — signal patterns, channel mechanics, narrative ops.",
          href: "/insights",
        },
        {
          tag: "R·02",
          glyph: "reports",
          title: "Reports",
          desc: "Engagement readouts, published as clients clear them for release.",
          href: "/reports",
        },
      ],
      rail: [
        {
          title: "Get in touch",
          desc: "General queries, information requests, press — straight to the founders.",
          href: "/contact",
        },
      ],
    },
  },
];

/* ── Line glyphs — 1px geometric marks in the site's instrument idiom. ── */
type GlyphName =
  | "narrative"
  | "channels"
  | "intelligence"
  | "firm"
  | "fit"
  | "careers"
  | "insights"
  | "reports";

function MegaGlyph({ name }: { name: GlyphName }) {
  const art: Record<GlyphName, React.ReactNode> = {
    narrative: (
      <>
        <path d="M4 7h13M4 12h9M4 17h5" />
        <circle cx="18.5" cy="17" r="1.4" />
      </>
    ),
    channels: (
      <>
        <circle cx="5" cy="5.5" r="1.4" />
        <circle cx="5" cy="12" r="1.4" />
        <circle cx="5" cy="18.5" r="1.4" />
        <path d="M6.4 6.2 17 11.2M6.4 12h10M6.4 17.8 17 12.8" />
        <circle cx="18.8" cy="12" r="1.8" />
      </>
    ),
    intelligence: (
      <>
        <path d="M4.5 19a7.5 7.5 0 0 1 15 0M8 19a4 4 0 0 1 8 0" />
        <path d="M12 19 16.2 9.6" />
        <circle cx="16.6" cy="8.6" r="1.3" />
      </>
    ),
    firm: (
      <>
        <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
        <circle cx="12" cy="12" r="1.8" />
      </>
    ),
    fit: (
      <>
        <circle cx="6" cy="6" r="1.2" />
        <circle cx="12" cy="6" r="1.2" />
        <circle cx="18" cy="6" r="1.2" />
        <circle cx="6" cy="12" r="1.2" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <circle cx="18" cy="12" r="1.2" />
        <circle cx="6" cy="18" r="1.2" />
        <circle cx="12" cy="18" r="1.2" />
        <circle cx="18" cy="18" r="2" fill="currentColor" />
      </>
    ),
    careers: (
      <>
        <circle cx="12" cy="7.5" r="3" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    insights: (
      <>
        <path d="M3.5 13.5h3.5l2.5-6 3.5 9.5 2.5-6h5" />
      </>
    ),
    reports: (
      <>
        <path d="M6.5 3.5h7l4 4v13h-11z" />
        <path d="M13.5 3.5v4h4" />
        <path d="M9.5 12h5M9.5 15.5h5" />
      </>
    ),
  };
  return (
    <svg
      className="nmc-glyph"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {art[name]}
    </svg>
  );
}

const FLICKER_ANIMATE = {
  opacity: [0, 0.9, 0.05, 1, 0.38, 1],
  scaleX:  [0, 0.4, 0.4,  0.73, 0.9, 1],
};
const FLICKER_TRANSITION = {
  duration: 0.28,
  times: [0, 0.12, 0.26, 0.48, 0.72, 1],
  ease: "linear" as const,
};

// h-[2px] on both positions so top and bottom render at identical thickness
function FlickerLine({ position = "bottom" }: { position?: "top" | "bottom" }) {
  return (
    <motion.span
      className={cn(
        "absolute left-0 h-[2px] w-full bg-signal-bright pointer-events-none",
        position === "bottom" ? "-bottom-1" : "-top-[5px]"
      )}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={FLICKER_ANIMATE}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={FLICKER_TRANSITION}
      style={{ transformOrigin: position === "bottom" ? "left" : "right" }}
    />
  );
}

function HoverLink({
  href,
  label,
  className,
  onClick,
  onMenuClose,
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
  onMenuClose?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      className={cn("transition-colors duration-150", className)}
      style={{ color: hovered ? "#D4524E" : "var(--text-muted)" }}
      onMouseEnter={() => { setHovered(true); onMenuClose?.(); }}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span className="relative inline-block">
        {label}
        <AnimatePresence>
          {hovered && <FlickerLine key="top" position="top" />}
          {hovered && <FlickerLine key="bot" />}
        </AnimatePresence>
      </span>
    </Link>
  );
}

function HoverButton({
  label,
  isOpen,
  className,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  className?: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const active = hovered || isOpen;
  return (
    <button
      className={cn("transition-colors duration-150", className)}
      style={{ color: active ? "#D4524E" : "var(--text-muted)" }}
      onMouseEnter={() => { setHovered(true); onMouseEnter(); }}
      onMouseLeave={() => { setHovered(false); onMouseLeave(); }}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <span className="relative inline-block">
        {label}
        <AnimatePresence>
          {active && <FlickerLine key="top" position="top" />}
          {active && <FlickerLine key="bot" />}
        </AnimatePresence>
      </span>
    </button>
  );
}

// Corner brackets at rest; full border flickers in on hover
function AuditCTA({ onMenuClose }: { onMenuClose?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href="/audit"
      className="relative ml-2 px-4 py-2 text-[11px] tracking-[0.18em] font-body font-medium transition-colors duration-150 select-none"
      style={{ color: hovered ? "#D4524E" : "var(--text-muted)" }}
      onMouseEnter={() => { setHovered(true); onMenuClose?.(); }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Four corner brackets — always visible */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: "rgba(199, 180, 157,0.55)" }} />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: "rgba(199, 180, 157,0.55)" }} />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: "rgba(199, 180, 157,0.55)" }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: "rgba(199, 180, 157,0.55)" }} />

      {/* Full border flickers in on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute inset-0 border pointer-events-none"
            style={{ borderColor: "#D4524E" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.05, 1, 0.38, 1] }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.28, times: [0, 0.10, 0.22, 0.42, 0.65, 1], ease: "linear" }}
          />
        )}
      </AnimatePresence>

      AUDIT REQUEST
    </Link>
  );
}

/* One card, three postures. `feature` = large dossier card with glyph, mono
   tag, corner brackets, and a blueprint-grid ground; `small` = compact index
   row; `rail` = right-column row. `cta` carries the panel's one red edge. */
function MegaCard({
  item,
  variant,
  onNavigate,
}: {
  item: MegaLink;
  variant: "feature" | "small" | "rail";
  onNavigate: () => void;
}) {
  const cls = cn("nmc", `nmc-${variant}`, item.cta && "nmc-cta");
  const inner =
    variant === "feature" ? (
      <>
        <span className="nmc-tagrow">
          {item.glyph && <MegaGlyph name={item.glyph} />}
          <span className="nmc-tag">{item.tag}</span>
        </span>
        <span className="nmc-body">
          <span className="nmc-title">{item.title}</span>
          <span className="nmc-desc">{item.desc}</span>
        </span>
        <span className="nmc-sweep" aria-hidden="true" />
      </>
    ) : (
      <>
        <span className="nmc-body">
          <span className="nmc-title">{item.title}</span>
          <span className="nmc-desc">{item.desc}</span>
        </span>
        <span className="nmc-sweep" aria-hidden="true" />
      </>
    );

  if (!item.href) return <div className={cls}>{inner}</div>;
  if (item.href.startsWith("mailto:")) {
    return (
      <a href={item.href} className={cls} onClick={onNavigate}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={item.href} className={cls} onClick={onNavigate}>
      {inner}
    </Link>
  );
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hover-intent close: when the cursor leaves the trigger row, schedule a
  // close instead of closing immediately. This gives the cursor time to
  // traverse the gap into the mega menu, where `onMouseEnter` cancels the
  // pending close so the menu stays open.
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
      closeTimeoutRef.current = null;
    }, 200);
  }, []);

  const closeMenu = useCallback(() => {
    cancelClose();
    setOpenMenu(null);
  }, [cancelClose]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Close on outside click and on Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [closeMenu]);

  const activeMega = openMenu
    ? (navItems.find((i) => i.label === openMenu)?.mega ?? null)
    : null;

  const closeAll = useCallback(() => {
    closeMenu();
    setMobileOpen(false);
  }, [closeMenu]);

  return (
    <header
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-out",
        scrolled ? "pt-0" : "pt-[12px]"
      )}
      style={{
        // Apple-style glass once scrolling starts: translucent charcoal +
        // heavy backdrop blur. The rgba ground keeps legibility on browsers
        // without backdrop-filter support.
        backgroundColor: scrolled ? "rgba(11, 10, 8, 0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
      }}
    >
      {/* Decorative horizontal line above — fades out in the compact state */}
      <div className="max-w-[96rem] mx-auto px-6 md:px-14 lg:px-20">
        <div
          className={cn("h-px transition-opacity duration-300", scrolled && "opacity-0")}
          style={{ backgroundColor: "var(--border-subtle)" }}
        />
      </div>

      <nav
        className={cn(
          "flex items-center justify-between max-w-[96rem] mx-auto px-6 md:px-14 lg:px-20",
          "transition-all duration-300 ease-out",
          scrolled ? "h-[46px]" : "h-[56px]"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-cream text-[15px] tracking-[0.3em] font-heading font-medium shrink-0"
        >
          KELWIN
        </Link>

        {/* Right cluster — full nav (≥1050px) or hamburger (<1050px) */}
        <div className="flex items-center gap-6">
          <div
            className="hidden min-[1050px]:flex items-center gap-6 relative h-[56px]"
            onMouseLeave={scheduleClose}
            onMouseEnter={cancelClose}
          >
            {navItems.map((item) =>
              item.mega ? (
                <HoverButton
                  key={item.label}
                  label={item.label}
                  isOpen={openMenu === item.label}
                  className="text-[12px] tracking-[0.16em] font-body font-medium"
                  onMouseEnter={() => { cancelClose(); setOpenMenu(item.label); }}
                  onMouseLeave={() => {}}
                  onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                />
              ) : (
                <HoverLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  className="text-[12px] tracking-[0.16em] font-body font-medium"
                  onMenuClose={closeMenu}
                />
              )
            )}
          </div>

          {/* AUDIT REQUEST — always visible across all breakpoints */}
          <AuditCTA onMenuClose={closeMenu} />

          {/* Hamburger — only below 1050px */}
          <button
            className="min-[1050px]:hidden text-cream p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Decorative horizontal line — matches the hero content width on every viewport */}
      <div className="max-w-[96rem] mx-auto px-6 md:px-14 lg:px-20">
        <div className="h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
      </div>

      {/* Mega menu — full-width command drawer under the navbar, spanning the
          same container as the nav content. */}
      <AnimatePresence>
        {activeMega && (
          <motion.div
            key={openMenu!}
            className="nav-mega-wrap hidden min-[1050px]:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: [0, 0.9, 0.05, 1, 0.38, 1], y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.28, times: [0, 0.10, 0.22, 0.42, 0.65, 1], ease: "linear" }}
          >
            <div className="max-w-[96rem] mx-auto px-6 md:px-14 lg:px-20">
              <div className="nav-mega">
                <div className="nav-mega-head">
                  <span className="nav-mega-protocol">{activeMega.protocol}</span>
                  <span className="nav-mega-headline" aria-hidden="true" />
                  <span className="nav-mega-count">KELWIN/OS</span>
                </div>
                <div className={cn("nav-mega-grid", !activeMega.rail?.length && "no-rail")}>
                  <div className="nav-mega-main">
                    <div className={cn("nav-mega-features", activeMega.featureCols === 3 && "cols-3")}>
                      {activeMega.features.map((f) => (
                        <MegaCard key={f.title} item={f} variant="feature" onNavigate={closeAll} />
                      ))}
                    </div>
                    {activeMega.smalls && activeMega.smalls.length > 0 && (
                      <div className="nav-mega-smalls">
                        {activeMega.smalls.map((s) => (
                          <MegaCard key={s.title} item={s} variant="small" onNavigate={closeAll} />
                        ))}
                      </div>
                    )}
                  </div>
                  {activeMega.rail && activeMega.rail.length > 0 && (
                    <div className="nav-mega-rail">
                      {activeMega.rail.map((r) => (
                        <MegaCard key={r.title} item={r} variant="rail" onNavigate={closeAll} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer — overlays the hero (does not push it down) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="min-[1050px]:hidden overflow-hidden bg-near-black absolute left-0 right-0 top-full"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {navItems.map((item) =>
                item.mega ? (
                  <div key={item.label}>
                    <div
                      className="py-3 text-[10px] tracking-[0.2em] uppercase"
                      style={{ color: "var(--sand)", fontFamily: "var(--font-mono)" }}
                    >
                      {item.label}
                    </div>
                    <div className="pl-4 flex flex-col gap-0.5">
                      {[...item.mega.features, ...(item.mega.smalls ?? []), ...(item.mega.rail ?? [])]
                        .filter((l) => l.href)
                        .map((l) =>
                          l.href!.startsWith("mailto:") ? (
                            <a
                              key={l.title}
                              href={l.href}
                              className="py-2.5 text-[12px] tracking-[0.1em] font-body"
                              style={{ color: "var(--text-faint)" }}
                              onClick={closeAll}
                            >
                              {l.title}
                            </a>
                          ) : (
                            <Link
                              key={l.title}
                              href={l.href!}
                              className="py-2.5 text-[12px] tracking-[0.1em] font-body"
                              style={{ color: "var(--text-faint)" }}
                              onClick={closeAll}
                            >
                              {l.title}
                            </Link>
                          )
                        )}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="py-3 text-[12px] tracking-[0.16em] font-body font-medium hover:text-cream"
                    style={{ color: "var(--text-muted)" }}
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
