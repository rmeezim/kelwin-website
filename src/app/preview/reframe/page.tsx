// DEV PREVIEW (removed before release): the reframe section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Reframe from "@/components/home/reframe";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="reframe" behavior="reframe">
        <Reframe />
      </Slot>
    </main>
  );
}
