import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Slot from "@/components/home/Slot";

export const metadata: Metadata = {
  title: "Page not found — Kelwin",
  description: "There is no page at this address on the Kelwin site.",
};

/* 404 — every unknown URL under the site (GitHub Pages serves out/404.html for them).
   One v5 section in the kit's head grammar: label → two-voice statement → rule → lede → doors.
   Both doors, as everywhere: the red one to the System Audit, the quiet one home. The slot plays
   the head's entrance on load, like the hero. */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="km-page">
        <Slot id="not-found" eager>
          <section className="km ac-sec" data-surface="dark" aria-labelledby="km-404-h">
            <div className="ac-head ac-wrap">
              <div className="ac-labelrow">
                <p className="ac-label">Not found</p>
                <p className="ac-meta">Error 404</p>
              </div>
              <h1 className="ac-statement" id="km-404-h">
                <span className="ac-line">
                  <span>Nothing is built</span>
                </span>{" "}
                <span className="ac-line ac-accent">
                  <span>at this address.</span>
                </span>
              </h1>
              <span className="ac-rule" aria-hidden="true" />
              <p className="ac-lede">
                The link is out of date, or the address was mistyped. Start again from the homepage, or go
                straight to where every engagement begins.
              </p>
              <div className="ac-doors">
                <Link className="ac-btn" href="/audit">
                  Request a System Audit
                </Link>
                <Link className="ac-link" href="/">
                  Back to the homepage
                </Link>
              </div>
            </div>
          </section>
        </Slot>
      </main>
      <Footer />
    </>
  );
}
