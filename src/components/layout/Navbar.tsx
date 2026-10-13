"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HashLink from "@/components/ui/HashLink";
import "./Navbar.css";

/* ─── The v5 site bar (approved mockup: design/redesign/site/frag/hero/T — the header) ───
   Lockup left, the five items in tracked caps (no separators), the outlined AUDIT REQUEST ↗
   right, one margin-to-margin hairline with a + registration mark at each end.
   · Homepage at rest it is the mockup header exactly, in normal flow; its entrance plays with
     the hero (the bar fades, the hairline draws, the two marks register).
   · Scrolled, ≥1024px (round 7, C2): the bar condenses into a narrower, shorter floating bar on
     translucent graphite with a backdrop blur (Navbar.css). ≤1023px: the same bar, compact, on
     flat graphite with a bottom hairline. The header keeps its flow height, so nothing below it
     moves.
   · Capabilities / The Firm / Resources open flat graphite plates that hang from the hairline
     (hover, click or keyboard). Each plate ends on a foot band: a quiet row, then the System Audit
     door, paper with ink text (round 7, C3; round 8: no red inside the plate). The Lab sits in The
     Firm's plate (round 8, Q4).
   · ≤1023px: a menu button opens a full-screen graphite sheet with the same items; the three
     plates become expandable groups. Focus is trapped, Escape closes, the page cannot scroll.
   · Its first stop is a skip link to <main id="main">. Links that can point at the page you are
     on (the lockup, the plain items, the "full stack" rail) are HashLinks, so they always scroll. */

type GlyphName = "contour" | "trace" | "orbit" | "firm" | "fit" | "careers" | "lab" | "insights" | "reports" | "contact";

type MegaLink = {
  title: string;
  desc: string;
  /** a foot-band row without an href is a plain note */
  href: string;
  tag?: string;
  glyph?: GlyphName;
  /** Sub-service catalog — the capability plates list four services per strip. */
  services?: string[];
};
type MegaDef = {
  id: string;
  /** One strip per column (three columns on the 12-column stage). */
  strips: MegaLink[];
  /** The plate's foot band: an optional quiet row (a link, or a note when it has no href), then
      the System Audit door. */
  rail?: MegaLink;
  door?: MegaLink;
};
type NavItem =
  | { label: string; href: string; mega?: never }
  | { label: string; href?: never; mega: MegaDef };

const NAV: NavItem[] = [
  {
    label: "Capabilities",
    mega: {
      id: "capabilities",
      strips: [
        {
          tag: "C·01",
          glyph: "contour",
          title: "Narrative Systems",
          desc: "What the market hears, made deliberate.",
          href: "/capabilities/narrative-systems",
          services: [
            "Positioning & category design",
            "ICP message matrix",
            "Sales language & objection library",
            "Proof & evidence architecture",
          ],
        },
        {
          tag: "C·02",
          glyph: "trace",
          title: "GTM Infrastructure",
          desc: "The machine that carries it to buyers.",
          href: "/capabilities/gtm-infrastructure",
          services: [
            "Deliverability engineering",
            "Data pipeline & signal map",
            "Omnichannel orchestration",
            "CRM & data hygiene automation",
          ],
        },
        {
          tag: "C·03",
          glyph: "orbit",
          title: "GTM Intelligence",
          desc: "The loop that makes it compound.",
          href: "/capabilities/gtm-intelligence",
          services: [
            "Signal taxonomy & intent monitoring",
            "Win/loss & objection intelligence",
            "Narrative resonance telemetry",
            "Quarterly calibration program",
          ],
        },
      ],
      rail: {
        title: "The full stack, on one page",
        desc: "How the three layers wire into one operating system.",
        href: "/#s-system", // the homepage's system section (the old #revenue-os anchor is gone)
      },
      door: {
        title: "The System Audit",
        desc: "Where every engagement begins — fixed scope, ten working days.",
        href: "/audit",
      },
    },
  },
  { label: "Methodology", href: "/#methodology" },
  {
    label: "The Firm",
    mega: {
      id: "firm",
      strips: [
        {
          tag: "F·01",
          glyph: "firm",
          title: "About Us",
          desc: "The founder, and the rules every engagement runs by.",
          href: "/about",
        },
        {
          tag: "F·02",
          glyph: "fit",
          title: "Who We Work With",
          desc: "Three situations we're built for, and who we send away.",
          href: "/who-we-work-with",
        },
        {
          tag: "F·03",
          glyph: "careers",
          title: "Careers",
          desc: "No open seats today. The bench list is open.",
          href: "/careers",
        },
        {
          tag: "F·04",
          glyph: "lab",
          title: "The Lab",
          desc: "Our R&D, and the GTM intelligence platform it is building. By invitation.",
          href: "/the-lab",
        },
      ],
      rail: {
        title: "The founder's letter",
        desc: "Why Kelwin exists, in his words.",
        href: "/#s-letter",
      },
      door: {
        title: "The System Audit",
        desc: "Where every engagement begins — fixed scope, ten working days.",
        href: "/audit",
      },
    },
  },
  {
    label: "Resources",
    mega: {
      id: "resources",
      strips: [
        {
          tag: "R·01",
          glyph: "insights",
          title: "Insights",
          desc: "Field notes on how revenue systems break, one layer at a time.",
          href: "/insights",
        },
        {
          tag: "R·02",
          glyph: "reports",
          title: "Reports",
          desc: "What a readout looks like, and the ones clients clear.",
          href: "/reports",
        },
        {
          tag: "R·03",
          glyph: "contact",
          title: "Talk to the team",
          desc: "Questions, documents, press. A person answers.",
          href: "/contact",
        },
      ],
      rail: {
        title: "Every engagement opens with a fixed-scope audit.",
        desc: "",
        href: "",
      },
      door: {
        title: "The System Audit",
        desc: "Where every engagement begins — fixed scope, ten working days.",
        href: "/audit",
      },
    },
  },
];

/* Which item owns the current page — it sits lit on the hairline. */
function isCurrent(item: NavItem, pathname: string): boolean {
  const key = item.mega?.id ?? item.href;
  switch (key) {
    case "capabilities":
      return /^\/(capabilities|audit)(\/|$)/.test(pathname);
    case "firm":
      return /^\/(about|who-we-work-with|careers|the-lab)(\/|$)/.test(pathname);
    case "resources":
      return /^\/(insights|reports|contact)(\/|$)/.test(pathname);
    default:
      return false;
  }
}

/* ── Glyphs: 36×24, 1px, the hero's chapter marks (CONTOUR · TRACE · ORBIT) for the three
      capabilities, and quiet marks in the same idiom for the firm and resources. ── */
const GLYPHS: Record<GlyphName, ReactNode> = {
  contour: (
    <>
      <path pathLength={1} d="M0 4.5C5 3.5 8 8 13 7.2S20 10.5 24 12H36" />
      <path pathLength={1} d="M0 9.5C4 11.5 8 7.5 12.5 9.5S20 12 24 12" />
      <path pathLength={1} d="M0 14.5C4 12.8 8 17 12.5 14.6S20 12 24 12" />
      <path pathLength={1} d="M0 19.5C5 21 8 15.8 13 16.8S20 13.5 24 12" />
    </>
  ),
  trace: (
    <>
      <path pathLength={1} d="M0 18.5H9.5V5.5H25.5V18.5H36" />
      <rect className="kn-glyph__nd" x="8" y="4" width="3" height="3" />
      <rect className="kn-glyph__nd" x="24" y="4" width="3" height="3" />
      <rect className="kn-glyph__nd" x="24" y="17" width="3" height="3" />
    </>
  ),
  orbit: (
    <>
      <path pathLength={1} d="M0 12.5H15" />
      <path pathLength={1} d="M31.8 7.5A9 9 0 1 1 27.1 3.5" />
      <rect className="kn-glyph__nd" x="28.3" y="3.6" width="3" height="3" />
    </>
  ),
  firm: (
    <>
      <path pathLength={1} d="M10.5 6.5V2.5H14.5" />
      <path pathLength={1} d="M21.5 2.5H25.5V6.5" />
      <path pathLength={1} d="M25.5 17.5V21.5H21.5" />
      <path pathLength={1} d="M14.5 21.5H10.5V17.5" />
      <rect className="kn-glyph__nd" x="16.5" y="10.5" width="3" height="3" />
    </>
  ),
  fit: (
    <>
      <rect className="kn-glyph__box" x="10.5" y="4.5" width="2" height="2" />
      <rect className="kn-glyph__box" x="16.5" y="4.5" width="2" height="2" />
      <rect className="kn-glyph__box" x="22.5" y="4.5" width="2" height="2" />
      <rect className="kn-glyph__box" x="10.5" y="10.5" width="2" height="2" />
      <rect className="kn-glyph__nd" x="16" y="10" width="3" height="3" />
      <rect className="kn-glyph__box" x="22.5" y="10.5" width="2" height="2" />
      <rect className="kn-glyph__box" x="10.5" y="16.5" width="2" height="2" />
      <rect className="kn-glyph__box" x="16.5" y="16.5" width="2" height="2" />
      <rect className="kn-glyph__nd" x="22" y="16" width="3" height="3" />
    </>
  ),
  careers: (
    <>
      <path pathLength={1} d="M0 12.5H13" />
      <path pathLength={1} d="M23 12.5H36" />
      <rect className="kn-glyph__box" x="14.5" y="8.5" width="7" height="7" />
    </>
  ),
  /* three instruments at their stages: bars of unequal length on one baseline */
  lab: (
    <>
      <path pathLength={1} d="M0 6.5H22" />
      <path pathLength={1} d="M0 12.5H12" />
      <path pathLength={1} d="M0 18.5H30" />
      <rect className="kn-glyph__nd" x="30" y="17" width="3" height="3" />
    </>
  ),
  insights: <path pathLength={1} d="M0 14.5H8L11 6.5L15 18.5L18 10.5L20 14.5H36" />,
  reports: (
    <>
      <path pathLength={1} d="M11.5 1.5H21.5L25.5 5.5V22.5H11.5Z" />
      <path pathLength={1} d="M21.5 1.5V5.5H25.5" />
      <path pathLength={1} d="M14.5 11.5H22.5" />
      <path pathLength={1} d="M14.5 15.5H22.5" />
    </>
  ),
  contact: (
    <>
      <path pathLength={1} d="M0 12.5H25" />
      <rect className="kn-glyph__box" x="25.5" y="8.5" width="8" height="8" />
      <rect className="kn-glyph__nd" x="28" y="11" width="3" height="3" />
    </>
  ),
};

const GLYPH_BOX = { "--w": "36px", "--h": "24px" } as CSSProperties;

function Glyph({ name }: { name: GlyphName }) {
  return (
    <svg className="ac-glyph kn-glyph" style={GLYPH_BOX} viewBox="0 0 36 24" aria-hidden="true">
      {GLYPHS[name]}
    </svg>
  );
}

/* Drawn arrows — the brand fonts carry no arrow glyphs. */
function ArrowGo({ className = "kn-arrow" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 12" aria-hidden="true">
      <path d="M1 6h12M8 1.5 12.5 6 8 10.5" />
    </svg>
  );
}

/* The service rows' index: C·02 → 02.1 … 02.4 */
const serviceIdx = (tag: string | undefined, i: number) =>
  `${(tag ?? "").replace(/\D/g, "").padStart(2, "0")}.${i + 1}`;

/* One strip of a plate: glyph + mono index → title → descriptor → services. The whole strip is
   the link. */
function Strip({ item, onNavigate }: { item: MegaLink; onNavigate: () => void }) {
  return (
    <li className="kn-strip">
      <Link href={item.href} className="kn-strip__a" onClick={onNavigate}>
        <span className="kn-strip__top">
          {item.glyph ? <Glyph name={item.glyph} /> : <span />}
          {item.tag && <span className="ac-idx">{item.tag}</span>}
        </span>
        <span className="kn-strip__t">
          {item.title}
          <ArrowGo />
        </span>
        <span className="kn-strip__d">{item.desc}</span>
        {item.services && (
          <span className="kn-strip__svc">
            {item.services.map((s, i) => (
              <span className="kn-strip__row" key={s}>
                <span className="ac-idx">{serviceIdx(item.tag, i)}</span>
                <span>{s}</span>
              </span>
            ))}
          </span>
        )}
      </Link>
    </li>
  );
}

/* The System Audit door — button C's cut corner, sized as the plate's corner cell; paper with ink
   text, so an open plate adds no red to the view (round 7, C3; round 8). */
function Door({ item, onNavigate, className }: { item: MegaLink; onNavigate: () => void; className?: string }) {
  return (
    <Link href={item.href} className={`kn-door${className ? ` ${className}` : ""}`} onClick={onNavigate}>
      <span className="kn-door__t">{item.title}</span>
      <span className="kn-door__d">{item.desc}</span>
    </Link>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const pathname = usePathname() ?? "";
  const headerRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  const openedBy = useRef<"hover" | "click" | null>(null);
  const closeTimer = useRef(0);
  const focusFirst = useRef(false);
  const restoreFocus = useRef(false);

  /* scrolled: the condensed bar (compact on tablet/phone). When the page jumps rather than scrolls — it opens already
     scrolled (reload), back/forward restores a mid-page position after the page has mounted, a
     navigation lands at the top from a scrolled page — the bar takes its new state at once and
     without the transition, so it never shows the resting bar over mid-page content or visibly
     collapses. A jump is a single scroll step of more than half a viewport; wheel, trackpad and
     keyboard scrolling arrive in small steps and keep the transition. The opening state is read on
     the first frame, once the router has placed the page (a navigation scrolls to the top in the
     same commit). On a jump the class is set on the element straight away — React's render, which
     sets the same class, can land a few frames later. data-instant is not owned by React, so a
     re-render never drops it early.
     The homepage bar's entrance belongs to the top of the page: if the bar compacts before the
     hero has played (the page opened scrolled — Back to a scrolled homepage, a /#section link, a
     mid-page reload — or the reader left the hero first), it skips the entrance and stands at
     once (data-settled; data-play releases the held marks). Sticky for the mount, so returning
     to the top never replays it. */
  useLayoutEffect(() => {
    const header = headerRef.current;
    const home = document.getElementById("s-hero") !== null;
    let raf = 0;
    const set = (next: boolean, instant: boolean) => {
      if (next === scrolledRef.current) return;
      scrolledRef.current = next;
      if (next && home && header && header.dataset.play === undefined) {
        header.dataset.settled = "";
        header.dataset.play = "";
      }
      if (instant && header) {
        header.dataset.instant = "";
        header.classList.toggle("is-scrolled", next);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(() => {
            raf = 0;
            delete header.dataset.instant;
          });
        });
      }
      setScrolled(next);
    };
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const jump = Math.abs(y - lastY) > window.innerHeight / 2;
      lastY = y;
      set(y > 8, jump);
    };
    const open = requestAnimationFrame(() => {
      lastY = window.scrollY;
      set(lastY > 8, true);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(open);
      if (raf) cancelAnimationFrame(raf);
      if (header) delete header.dataset.instant;
    };
  }, []);

  /* homepage: the bar's entrance plays with the hero (its slot gains .is-play). The flag is a
     data attribute React does not own, so a re-render never drops it. */
  useEffect(() => {
    const header = headerRef.current;
    const hero = document.getElementById("s-hero");
    if (!header || !hero) return;
    const sync = () => {
      if (!hero.classList.contains("is-play")) return false;
      header.dataset.play = "";
      return true;
    };
    if (sync()) return;
    const mo = new MutationObserver(() => {
      if (sync()) mo.disconnect();
    });
    mo.observe(hero, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  /* Tabbing into the header never scrolls the page. html's scroll-padding-top (globals.css) marks
     the top 80px of the viewport as covered, so the browser reads a control in the sticky bar as
     hidden behind itself and scrolls the page about half a viewport up on every Tab to "reveal"
     it, though the bar is always in view. The scroll position is taken as the Tab goes down;
     when that Tab lands focus in the header the page is put back at once (Chromium scrolls before
     focusin) and again on the frame's scroll event (for an engine that scrolls after it), before
     anything paints. The script focus below (Escape, ArrowDown, the menu button) passes
     preventScroll. */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let from: { x: number; y: number } | null = null;
    let landed = false;
    let raf = 0;
    const putBack = () => {
      if (from && (window.scrollX !== from.x || window.scrollY !== from.y)) {
        window.scrollTo({ left: from.x, top: from.y, behavior: "instant" });
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) return;
      from = { x: window.scrollX, y: window.scrollY };
      landed = false;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        from = null;
        landed = false;
      });
    };
    const onFocusIn = () => {
      if (!from) return;
      landed = true;
      putBack();
    };
    const onScroll = () => {
      if (landed) putBack();
    };
    document.addEventListener("keydown", onKey, true);
    header.addEventListener("focusin", onFocusIn);
    // on the document, so it runs ahead of the bar's own scroll handler (on window)
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey, true);
      header.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* ── plates ── */
  const cancelClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = 0;
  }, []);
  const closePlate = useCallback(() => {
    cancelClose();
    openedBy.current = null;
    setOpen(null);
  }, [cancelClose]);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = 0;
      openedBy.current = null;
      setOpen(null);
    }, 200);
  }, [cancelClose]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // hovering an item opens its plate (data-mega) or closes any open plate (plain links)
  const onItemEnter = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const id = e.currentTarget.dataset.mega ?? null;
    window.clearTimeout(closeTimer.current);
    if (id) {
      if (open !== id) openedBy.current = "hover";
      setOpen(id);
    } else {
      setOpen(null);
    }
  };
  const onItemLeave = (e: ReactPointerEvent) => {
    if (e.pointerType === "touch") return;
    if (open) scheduleClose();
  };
  const onTrigger = (id: string) => {
    cancelClose();
    if (open === id) {
      // a click right after a hover-open keeps the plate; a second click closes it
      if (openedBy.current === "hover") {
        openedBy.current = "click";
        return;
      }
      closePlate();
      return;
    }
    openedBy.current = "click";
    setOpen(id);
  };
  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.mega;
    if (id && e.key === "ArrowDown") {
      e.preventDefault();
      focusFirst.current = true;
      openedBy.current = "click";
      cancelClose();
      if (open === id) {
        document.getElementById(`kn-mega-${id}`)?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
        focusFirst.current = false;
      } else {
        setOpen(id);
      }
    }
  };
  useEffect(() => {
    if (!open || !focusFirst.current) return;
    focusFirst.current = false;
    document.getElementById(`kn-mega-${open}`)?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
  }, [open]);

  // focus leaving an open item (Tab past its plate) closes the plate
  const onItemBlur = (e: FocusEvent<HTMLLIElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && !e.currentTarget.contains(next)) closePlate();
  };

  // outside pointer + Escape close the plate
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closePlate();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // return focus to the trigger only when it was in the bar (keyboard, or a click that left
      // focus on the page); a plate opened by hover never pulls focus out of, say, a form field
      const active = document.activeElement;
      const inBar = !!active && !!headerRef.current?.contains(active);
      const refocus = inBar || ((!active || active === document.body) && openedBy.current === "click");
      const id = open;
      closePlate();
      if (refocus) document.getElementById(`kn-trigger-${id}`)?.focus({ preventScroll: true });
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closePlate]);

  /* ── the sheet (≤1023px) ── */
  const closeSheet = useCallback((refocus: boolean) => {
    restoreFocus.current = refocus;
    setSheetOpen(false);
  }, []);
  const closeAll = useCallback(() => {
    closePlate();
    closeSheet(false);
  }, [closePlate, closeSheet]);

  useEffect(() => {
    if (!sheetOpen) {
      if (restoreFocus.current) burgerRef.current?.focus({ preventScroll: true });
      restoreFocus.current = false;
      return;
    }
    const sheet = sheetRef.current;
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter, body: document.body.style.overflow };
    html.style.overflow = "hidden";
    html.style.scrollbarGutter = "stable";
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSheet(true);
        return;
      }
      if (e.key !== "Tab" || !sheet) return;
      const els = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.closest("[inert]") && el.getClientRects().length > 0,
      );
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !sheet.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !sheet.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => {
      if (mq.matches) closeSheet(false);
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      html.style.overflow = prev.overflow;
      html.style.scrollbarGutter = prev.gutter;
      document.body.style.overflow = prev.body;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [sheetOpen, closeSheet]);

  const openSheet = () => {
    closePlate();
    setGroup(null);
    setSheetOpen(true);
  };

  const cls = ["km", "kn"];
  if (scrolled) cls.push("is-scrolled");
  if (open) cls.push("has-plate");
  if (sheetOpen) cls.push("has-sheet");

  return (
    <header ref={headerRef} className={cls.join(" ")} data-surface="dark">
      {/* a plain fragment link: <main id="main" tabIndex={-1}> on every page takes the focus */}
      <a className="kn-skip" href="#main">
        Skip to content
      </a>
      <div className="kn__bar" inert={sheetOpen}>
        <div className="kn__row">
          <HashLink className="kn__brand" href="/" onClick={closeAll}>
            <span className="km-logo" role="img" aria-label="Kelwin" />
          </HashLink>

          <nav className="kn__menu" aria-label="Primary">
            <ul className="kn__list">
              {NAV.map((item) => {
                const current = isCurrent(item, pathname);
                if (!item.mega) {
                  return (
                    <li key={item.label} className="kn__li" onPointerEnter={onItemEnter}>
                      <HashLink
                        href={item.href}
                        className={`kn__item${current ? " is-current" : ""}`}
                        aria-current={current ? "page" : undefined}
                        onClick={closeAll}
                      >
                        {item.label}
                      </HashLink>
                    </li>
                  );
                }
                const { id } = item.mega;
                const isOpen = open === id;
                return (
                  <li
                    key={item.label}
                    className="kn__li"
                    data-mega={id}
                    onPointerEnter={onItemEnter}
                    onPointerLeave={onItemLeave}
                    onBlur={onItemBlur}
                  >
                    <button
                      type="button"
                      id={`kn-trigger-${id}`}
                      data-mega={id}
                      className={`kn__item${current ? " is-current" : ""}${isOpen ? " is-open" : ""}`}
                      aria-expanded={isOpen}
                      aria-controls={`kn-mega-${id}`}
                      onClick={() => onTrigger(id)}
                      onKeyDown={onTriggerKey}
                    >
                      {item.label}
                    </button>
                    <Plate def={item.mega} label={item.label} open={isOpen} onNavigate={closeAll} />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="kn__acts">
            <Link className="ac-btn-o kn__cta" href="/audit" onClick={closeAll} onPointerEnter={onItemEnter}>
              Audit request
            </Link>
            <button
              ref={burgerRef}
              type="button"
              className="kn__burger"
              aria-expanded={sheetOpen}
              aria-controls="kn-sheet"
              aria-label="Open menu"
              onClick={openSheet}
            >
              <span className="kn__lines" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* the hero frame's two registration marks, where the hairline meets the margins */}
      <span className="ac-reg kn__reg kn__reg--l" style={{ "--d": "300ms" } as CSSProperties} aria-hidden="true" />
      <span className="ac-reg kn__reg kn__reg--r" style={{ "--d": "380ms" } as CSSProperties} aria-hidden="true" />

      {/* ≤1023px: the full-screen sheet */}
      <div
        ref={sheetRef}
        id="kn-sheet"
        className={`kn-sheet${sheetOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!sheetOpen}
      >
        <div className="kn-sheet__bar">
          <HashLink className="kn__brand" href="/" onClick={closeAll}>
            <span className="km-logo" role="img" aria-label="Kelwin" />
          </HashLink>
          <button
            ref={closeRef}
            type="button"
            className="kn__burger is-close"
            aria-label="Close menu"
            onClick={() => closeSheet(true)}
          >
            <span className="kn__lines" aria-hidden="true" />
          </button>
        </div>

        <nav className="kn-sheet__nav" aria-label="Primary">
          <ul className="kn-sheet__list">
            {NAV.map((item, n) => {
              const current = isCurrent(item, pathname);
              const style = { "--i": n } as CSSProperties;
              if (!item.mega) {
                return (
                  <li key={item.label} className="kn-sheet__li" style={style}>
                    <HashLink
                      href={item.href}
                      className={`kn-sheet__item${current ? " is-current" : ""}`}
                      aria-current={current ? "page" : undefined}
                      onClick={closeAll}
                    >
                      <span>{item.label}</span>
                      <ArrowGo className="kn-sheet__go" />
                    </HashLink>
                  </li>
                );
              }
              const { id, strips, rail, door } = item.mega;
              const isOpen = group === id;
              return (
                <li key={item.label} className={`kn-sheet__li${isOpen ? " is-open" : ""}`} style={style}>
                  <button
                    type="button"
                    className={`kn-sheet__item${current ? " is-current" : ""}`}
                    aria-expanded={isOpen}
                    aria-controls={`kn-group-${id}`}
                    onClick={() => setGroup(isOpen ? null : id)}
                  >
                    <span>{item.label}</span>
                    <span className="ac-toggle" aria-hidden="true" />
                  </button>
                  <div className="kn-sheet__more" id={`kn-group-${id}`} inert={!isOpen}>
                    <div>
                      <ul className="kn-sheet__sub" aria-label={item.label}>
                        {strips.map((s) => (
                          <li key={s.title}>
                            <Link href={s.href} className="kn-sheet__link" onClick={closeAll}>
                              <span className="ac-idx">{s.tag ?? ""}</span>
                              <span className="kn-sheet__lt">{s.title}</span>
                              <span className="kn-sheet__ld">{s.desc}</span>
                              {s.services && (
                                <span className="kn-sheet__svc">
                                  {s.services.map((v, i) => (
                                    <span className="kn-sheet__row" key={v}>
                                      <span className="ac-idx">{serviceIdx(s.tag, i)}</span>
                                      <span>{v}</span>
                                    </span>
                                  ))}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                        {rail?.href && (
                          <li>
                            <HashLink href={rail.href} className="kn-sheet__link" onClick={closeAll}>
                              <span className="ac-idx" />
                              <span className="kn-sheet__lt">{rail.title}</span>
                              <span className="kn-sheet__ld">{rail.desc}</span>
                            </HashLink>
                          </li>
                        )}
                      </ul>
                      {door && <Door item={door} onNavigate={closeAll} className="kn-door--sheet" />}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="kn-sheet__foot">
          <Link className="ac-btn-o kn-sheet__cta" href="/audit" onClick={closeAll}>
            Audit request
          </Link>
        </div>
      </div>
    </header>
  );
}

/* A plate: flat graphite, hung from the hairline between the margins. */
function Plate({
  def,
  label,
  open,
  onNavigate,
}: {
  def: MegaDef;
  label: string;
  open: boolean;
  onNavigate: () => void;
}) {
  return (
    <div
      id={`kn-mega-${def.id}`}
      className={`kn-mega${open ? " is-open" : ""}`}
      style={{ "--kn-cols": def.strips.length } as CSSProperties}
      role="region"
      aria-label={label}
    >
      <ul className="kn-mega__strips">
        {def.strips.map((s) => (
          <Strip key={s.title} item={s} onNavigate={onNavigate} />
        ))}
      </ul>
      {(def.rail || def.door) && (
        <div className="kn-mega__band">
          {def.rail &&
            (def.rail.href ? (
              <HashLink href={def.rail.href} className="kn-mega__rail" onClick={onNavigate}>
                <span className="kn-mega__rt">{def.rail.title}</span>
                <span className="kn-mega__rd">{def.rail.desc}</span>
                <ArrowGo />
              </HashLink>
            ) : (
              <p className="kn-mega__rail kn-mega__rail--note">
                <span className="kn-mega__rt">{def.rail.title}</span>
              </p>
            ))}
          {def.door && <Door item={def.door} onNavigate={onNavigate} />}
        </div>
      )}
    </div>
  );
}
