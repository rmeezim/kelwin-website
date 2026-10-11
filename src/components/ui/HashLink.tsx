"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type Props = ComponentProps<typeof Link> & { href: string };

const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

/**
 * next/link for links that may point at the page you are already on ("/", "/#methodology").
 * Next does nothing when the URL already matches, so on the same page this scrolls to the
 * fragment (or the top) itself — every time — and moves keyboard focus there. The sticky nav's
 * height is respected through html's scroll-padding-top. Other pages navigate as usual.
 */
export default function HashLink({ href, onClick, ...rest }: Props) {
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const [path, hash = ""] = href.split("#");
    if (trim(path || pathname) !== trim(pathname)) return; // another page: let Link navigate
    const target = hash ? document.getElementById(hash) : null;
    if (hash && !target) return;
    e.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    if (target) {
      target.scrollIntoView({ behavior, block: "start" });
      // a new history entry only when the fragment changes, so repeat clicks don't pile up Back steps
      const url = `${window.location.pathname}${window.location.search}#${hash}`;
      if (window.location.hash === `#${hash}`) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior });
      if (window.location.hash) window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
