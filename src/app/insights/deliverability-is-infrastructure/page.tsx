import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleDoc from "@/components/sections/ArticleDoc";

export const metadata: Metadata = {
  title: "Deliverability is infrastructure — Kelwin",
  description:
    "Domains, authentication, warmup, and list discipline — the unglamorous mechanics that decide whether your message exists at all.",
};

export default function DeliverabilityNote() {
  return (
    <>
      <Navbar />
      <ArticleDoc
        meta={{
          n: "FN·03",
          topics: ["Channels", "Outbound"],
          date: "May 2026",
          readTime: "5 min read",
        }}
        title="Deliverability is infrastructure"
        standfirst="Before your message can be judged, it has to exist. For a growing share of B2B outbound, it doesn't — it dies in a filter, unseen, while the dashboard reports it as 'delivered.' Deliverability isn't a growth hack. It's the load-bearing floor under every channel decision you make."
      >
        <p>
          The 2024 inbox-provider changes made explicit what was already true
          in practice: bulk senders live or die on authentication, complaint
          rates, and list quality. Google and Yahoo now enforce hard
          thresholds — authenticated domains, sub-0.3% spam-complaint rates,
          one-click unsubscribe. Below the thresholds you&rsquo;re a sender;
          above them you&rsquo;re noise, and the filter doesn&rsquo;t send a
          rejection letter.
        </p>
        <p>
          What makes this dangerous is the silence. A message that bounces
          shows up in your data. A message that lands in a folder nobody opens
          does not. Teams conclude &ldquo;our messaging isn&rsquo;t
          working&rdquo; and hire a copywriter, when the truthful diagnosis is
          &ldquo;our messaging isn&rsquo;t <em>arriving</em>.&rdquo;
        </p>
        <blockquote>
          <p>
            You cannot A/B test a message the buyer never saw.
          </p>
        </blockquote>

        <h2>The floor, specified</h2>
        <p>
          The components are unglamorous and non-optional. Treated as a spec
          rather than a checklist, they look like this:
        </p>
        <ul>
          <li>
            <strong>Domain architecture.</strong> Sending domains separated
            from the corporate domain, aged before use, each carrying volume
            it can defend. Your primary domain&rsquo;s reputation is not a
            resource to spend on cold volume.
          </li>
          <li>
            <strong>Authentication.</strong> SPF, DKIM, and DMARC actually
            aligned — not merely present. A surprising fraction of the
            domains we audit fail alignment while believing they pass.
          </li>
          <li>
            <strong>Warmup and volume discipline.</strong> Reputation is
            earned at low volume and destroyed at high volume. Ramp schedules
            are boring precisely because they work.
          </li>
          <li>
            <strong>List hygiene.</strong> Verification before send, removal
            on soft signals, and honest suppression. Every send to a dead
            address is a small withdrawal from an account you can&rsquo;t
            easily refill.
          </li>
        </ul>

        <h2>Why this is a systems problem</h2>
        <p>
          None of these components hold individually. Warmup without list
          hygiene burns clean domains on dirty data. Authentication without
          volume discipline authenticates your way into a throttle. This is
          why we treat deliverability as infrastructure — designed once,
          instrumented continuously, owned by the system rather than by
          whoever sent the last campaign.
        </p>
        <div className="artd-field">
          <span className="artd-field-label">Field reading</span>
          <p>
            The pattern we see most: reply rates &ldquo;mysteriously&rdquo;
            decaying over 6–10 weeks while open rates hold. It reads like
            message fatigue. It is almost always reputation decay — the sends
            are landing progressively deeper in the folder structure. The fix
            is infrastructural, and no rewrite touches it.
          </p>
        </div>
        <p>
          The strategic point: channel decisions sit on top of this floor.
          Omnichannel orchestration assumes each channel actually transmits.
          Build the floor first; then the interesting decisions become
          possible.
        </p>
      </ArticleDoc>
      <Footer />
    </>
  );
}
