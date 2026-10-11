// DEV PREVIEW (removed before release): the hero section on its own, for porting checks.
// Same chrome order as every page: the site bar, then <main> (its rules key on that order).
import Navbar from "@/components/layout/Navbar";
import Slot from "@/components/home/Slot";
import Hero from "@/components/home/hero";

export default function Preview() {
  return (
    <>
      <Navbar />
      <main id="main" tabIndex={-1} className="km-page">
        <Slot id="hero" behavior="hero" eager>
          <Hero />
        </Slot>
      </main>
    </>
  );
}
