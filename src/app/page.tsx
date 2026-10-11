import type { ComponentType } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Slot from "@/components/home/Slot";
import type { BehaviorName } from "@/components/home/behaviors";
import Hero from "@/components/home/hero";
import Reframe from "@/components/home/reframe";
import Evidence from "@/components/home/evidence";
import Letter from "@/components/home/letter";
import System from "@/components/home/system";
import Principle from "@/components/home/principle";
import Handover from "@/components/home/handover";
import Method from "@/components/home/method";
import Fit from "@/components/home/fit";
import Cta from "@/components/home/cta";

/* The homepage, in the order the founder approved (design/redesign/story-order.json).
   Each section sits in a Slot: it plays its entrance once when it scrolls into view
   (the hero on load) and wires its behaviour, by name, from the registry. */
const SECTIONS: { id: BehaviorName; Section: ComponentType; eager?: boolean }[] = [
  { id: "hero", Section: Hero, eager: true },
  { id: "reframe", Section: Reframe },
  { id: "evidence", Section: Evidence },
  { id: "letter", Section: Letter },
  { id: "system", Section: System },
  { id: "principle", Section: Principle },
  { id: "handover", Section: Handover },
  { id: "method", Section: Method },
  { id: "fit", Section: Fit },
  { id: "cta", Section: Cta },
];

export default function Home() {
  return (
    <main className="km-page km-home">
      <Navbar />
      {SECTIONS.map(({ id, Section, eager }) => (
        <Slot key={id} id={id} behavior={id} eager={eager}>
          <Section />
        </Slot>
      ))}
      <Footer />
    </main>
  );
}
