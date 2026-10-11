// DEV PREVIEW (removed before release): the evidence section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Evidence from "@/components/home/evidence";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="evidence" behavior="evidence">
        <Evidence />
      </Slot>
    </main>
  );
}
