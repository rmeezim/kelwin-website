// DEV PREVIEW (removed before release): the method section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Method from "@/components/home/method";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="method" behavior="method">
        <Method />
      </Slot>
    </main>
  );
}
