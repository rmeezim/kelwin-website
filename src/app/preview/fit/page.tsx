// DEV PREVIEW (removed before release): the fit section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Fit from "@/components/home/fit";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="fit" behavior="fit">
        <Fit />
      </Slot>
    </main>
  );
}
