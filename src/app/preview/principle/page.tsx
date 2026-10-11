// DEV PREVIEW (removed before release): the principle section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Principle from "@/components/home/principle";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="principle" behavior="principle">
        <Principle />
      </Slot>
    </main>
  );
}
