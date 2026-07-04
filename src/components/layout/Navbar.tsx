"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback, Fragment } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type MegaItem = { label: string; href: string };
type NavItem =
  | { label: string; href: string; megaMenu?: never }
  | { label: string; href?: never; megaMenu: MegaItem[] };

const navItems: NavItem[] = [
  { label: "METHODOLOGY", href: "#methodology" },
  { label: "INFRASTRUCTURE", href: "#infrastructure" },
  {
    label: "THE FIRM",
    megaMenu: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    label: "RESOURCES",
    megaMenu: [
      { label: "Insights", href: "#insights" },
      { label: "Reports", href: "#reports" },
    ],
  },
  { label: "THE LAB", href: "#the-lab" },
];

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

// Mega menu item — arrow prefix slides in + underline flicker only (no top line)
function MegaMenuLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 py-3.5 px-5 text-[12px] tracking-[0.16em] font-body font-medium transition-colors duration-150"
      style={{ color: hovered ? "#D4524E" : "var(--text-muted)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span className="text-bronze shrink-0 text-[20px]" aria-hidden="true">
        ↳
      </span>
      <span className="relative inline-block">
        {label.toUpperCase()}
        <AnimatePresence>
          {hovered && (
            <motion.span
              className="absolute -bottom-0.5 left-0 h-[2px] bg-signal-bright pointer-events-none"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={FLICKER_ANIMATE}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={FLICKER_TRANSITION}
              style={{ width: "calc(100% - 1px)", transformOrigin: "left" }}
            />
          )}
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
      href="#audit"
      className="relative ml-2 px-4 py-2 text-[11px] tracking-[0.18em] font-body font-medium transition-colors duration-150 select-none"
      style={{ color: hovered ? "#D4524E" : "var(--text-muted)" }}
      onMouseEnter={() => { setHovered(true); onMenuClose?.(); }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Four corner brackets — always visible */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: "rgba(209,142,83,0.55)" }} />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: "rgba(209,142,83,0.55)" }} />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: "rgba(209,142,83,0.55)" }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: "rgba(209,142,83,0.55)" }} />

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

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaBounds, setMegaBounds] = useState<{ left: number; width: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeMenu]);

  const activeMegaMenu = openMenu
    ? (navItems.find((i) => i.label === openMenu)?.megaMenu ?? null)
    : null;

  // Measure dropdown width from prev→next+1 buttons, then center it under the trigger
  useLayoutEffect(() => {
    if (!openMenu || !containerRef.current) { setMegaBounds(null); return; }
    const idx = navItems.findIndex((i) => i.label === openMenu);
    if (idx < 0) { setMegaBounds(null); return; }
    const prevEl = itemRefs.current[Math.max(0, idx - 1)];
    const nextEl = itemRefs.current[Math.min(navItems.length - 1, idx + 2)];
    const triggerEl = itemRefs.current[idx];
    if (!prevEl || !nextEl || !triggerEl) { setMegaBounds(null); return; }
    const cRect = containerRef.current.getBoundingClientRect();
    const width = nextEl.getBoundingClientRect().right - prevEl.getBoundingClientRect().left;
    const triggerRect = triggerEl.getBoundingClientRect();
    const triggerCenter = triggerRect.left + triggerRect.width / 2 - cRect.left;
    const left = Math.max(0, triggerCenter - width / 2);
    setMegaBounds({ left, width });
  }, [openMenu]);

  return (
    <header
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300 pt-[12px]",
        scrolled ? "bg-near-black" : "bg-transparent"
      )}
    >
      {/* Decorative horizontal line above — matches the hero content width */}
      <div className="max-w-[96rem] mx-auto px-6 md:px-14 lg:px-20">
        <div className="h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
      </div>

      <nav className="flex items-center justify-between max-w-[96rem] mx-auto px-6 md:px-14 lg:px-20 h-[56px]">
        {/* Logo */}
        <Link
          href="/"
          className="text-cream text-[15px] tracking-[0.3em] font-heading font-medium shrink-0"
        >
          KELWIN
        </Link>

        {/* Right cluster — full nav (xl+) or hamburger (<xl), with AUDIT REQUEST always present */}
        <div className="flex items-center gap-6">

          {/* Desktop nav links — h-[85px] so top-full mega menu aligns to navbar bottom */}
          <div
            ref={containerRef}
            className="hidden min-[1050px]:flex items-center gap-6 relative h-[56px]"
            onMouseLeave={scheduleClose}
            onMouseEnter={cancelClose}
          >
            {navItems.map((item, idx) =>
              item.megaMenu ? (
                <span key={item.label} ref={(el) => { itemRefs.current[idx] = el; }}>
                  <HoverButton
                    label={item.label}
                    isOpen={openMenu === item.label}
                    className="text-[12px] tracking-[0.16em] font-body font-medium"
                    onMouseEnter={() => { cancelClose(); setOpenMenu(item.label); }}
                    onMouseLeave={() => {}}
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  />
                </span>
              ) : (
                <span key={item.label} ref={(el) => { itemRefs.current[idx] = el; }}>
                  <HoverLink
                    href={item.href}
                    label={item.label}
                    className="text-[12px] tracking-[0.16em] font-body font-medium"
                    onMenuClose={closeMenu}
                  />
                </span>
              )
            )}

            {/* Mega menu — width spans exactly 3 buttons (prev + current + next) */}
            <AnimatePresence>
              {activeMegaMenu && megaBounds && (
                <motion.div
                  key={openMenu!}
                  className="absolute bg-near-black"
                  style={{
                    top: "calc(100% + 14px)",
                    left: megaBounds.left,
                    width: megaBounds.width,
                    border: "1px solid #D18E53",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0.05, 1, 0.38, 1] }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.28, times: [0, 0.10, 0.22, 0.42, 0.65, 1], ease: "linear" }}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  <div className="flex items-center justify-center">
                    {activeMegaMenu.map((sub, i) => (
                      <Fragment key={sub.label}>
                        {i > 0 && (
                          <span
                            className="w-px h-4 shrink-0 self-center"
                            style={{ backgroundColor: "var(--border-subtle)" }}
                          />
                        )}
                        <MegaMenuLink href={sub.href} label={sub.label} onClick={closeMenu} />
                      </Fragment>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AUDIT REQUEST — always visible across all breakpoints */}
          <AuditCTA onMenuClose={closeMenu} />

          {/* Hamburger — only below xl */}
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
                item.megaMenu ? (
                  <div key={item.label}>
                    <button
                      className="w-full text-left py-3 text-[12px] tracking-[0.16em] font-body font-medium"
                      style={{ color: "var(--text-muted)" }}
                      onClick={() =>
                        setOpenMenu(openMenu === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                    </button>
                    <AnimatePresence>
                      {openMenu === item.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="overflow-hidden pl-4 flex flex-col gap-0.5"
                        >
                          {item.megaMenu.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="py-2.5 text-[12px] tracking-[0.14em] font-body hover:text-signal-bright"
                              style={{ color: "var(--text-faint)" }}
                              onClick={() => {
                                setMobileOpen(false);
                                closeMenu();
                              }}
                            >
                              {sub.label.toUpperCase()}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="py-3 text-[12px] tracking-[0.16em] font-body font-medium hover:text-cream"
                    style={{ color: "var(--text-muted)" }}
                    onClick={() => setMobileOpen(false)}
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
