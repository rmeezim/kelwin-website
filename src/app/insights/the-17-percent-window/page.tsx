import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleDoc from "@/components/sections/ArticleDoc";

export const metadata: Metadata = {
  title: "The 17% window — Kelwin",
  description:
    "B2B buyers spend roughly 17% of the journey with any supplier's sales team. What your narrative has to do in the other 83%.",
};

export default function SeventeenPercentNote() {
  return (
    <>
      <Navbar />
      <ArticleDoc
        meta={{
          n: "FN·02",
          topics: ["Narrative"],
          date: "June 2026",
          readTime: "5 min read",
        }}
        title="The 17% window"
        standfirst="Gartner's buying research puts the time B2B committees spend meeting with potential suppliers at around 17% of the journey — split across every vendor in the deal. The uncomfortable arithmetic: your reps might get 5%. The deal is argued in the other 95%, by people you'll never meet, using whatever words you left them."
      >
        <p>
          Most GTM operations are built as if selling happens in meetings. The
          research — and every win/loss interview we&rsquo;ve run — says
          otherwise. The buying committee does its real work internally:
          comparing notes, arguing risk, building the business case, retelling
          your pitch to people who weren&rsquo;t in the room. Your deal is
          decided in conversations your team doesn&rsquo;t attend.
        </p>
        <p>
          That reframes what messaging is <em>for</em>. The job of your
          narrative isn&rsquo;t to persuade the person in the demo. It&rsquo;s
          to survive being repeated by that person — imperfectly, from memory,
          under challenge — to a CFO who has never heard of you.
        </p>

        <h2>What survives retelling</h2>
        <p>Language that survives the internal argument has a shape:</p>
        <ul>
          <li>
            <strong>One nameable problem.</strong> Not a category of pain — a
            specific condition the champion can point to in their own
            operation and name in one phrase.
          </li>
          <li>
            <strong>A mechanism, not a promise.</strong> &ldquo;They install
            X, which produces Y&rdquo; retells cleanly. &ldquo;They help us
            grow faster&rdquo; dissolves on contact with a skeptic.
          </li>
          <li>
            <strong>An answer to the risk question.</strong> The committee's
            real question is rarely &ldquo;is this good?&rdquo; It's
            &ldquo;what happens if this fails, and will it be my fault?&rdquo;
            Narratives that pre-answer it travel further.
          </li>
        </ul>
        <blockquote>
          <p>
            Your narrative isn&rsquo;t written for the person in the demo.
            It&rsquo;s written for the person they have to convince.
          </p>
        </blockquote>

        <h2>Instrumenting the 83%</h2>
        <p>
          You can&rsquo;t attend the internal argument, but you can equip and
          instrument it. Equip: give the champion artifacts built for
          forwarding — one-page arguments, not decks; numbers with sources,
          not adjectives. Instrument: watch for the traces the internal
          argument leaves — who else from the account starts visiting, which
          pages the CFO&rsquo;s office reads, what objection shows up in the
          second call that nobody raised in the first.
        </p>
        <div className="artd-field">
          <span className="artd-field-label">Field reading</span>
          <p>
            In committee-decided deals we&rsquo;ve instrumented, the strongest
            single predictor of close wasn&rsquo;t meeting count or demo
            score. It was whether the champion could state the mechanism
            unaided in their own words by the second call. When they could,
            the internal argument tended to go well. When they couldn&rsquo;t,
            no amount of follow-up rescued it.
          </p>
        </div>
        <p>
          The 17% window is where you earn the right to be argued for. The
          83% is where you win. Build for the 83%.
        </p>
      </ArticleDoc>
      <Footer />
    </>
  );
}
