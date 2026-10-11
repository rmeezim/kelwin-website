// DEV PREVIEW (removed before release): the cta section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Cta from "@/components/home/cta";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="cta" behavior="cta">
        <Cta />
      </Slot>
    </main>
  );
}
