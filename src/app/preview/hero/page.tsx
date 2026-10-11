// DEV PREVIEW (removed before release): the hero section on its own, for porting checks.
import Navbar from "@/components/layout/Navbar";
import Slot from "@/components/home/Slot";
import Hero from "@/components/home/hero";

export default function Preview() {
  return (
    <main className="km-page">
      <Navbar />
      <Slot id="hero" behavior="hero" eager>
        <Hero />
      </Slot>
    </main>
  );
}
