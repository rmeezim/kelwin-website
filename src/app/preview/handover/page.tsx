// DEV PREVIEW (removed before release): the handover section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Handover from "@/components/home/handover";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="handover" behavior="handover">
        <Handover />
      </Slot>
    </main>
  );
}
