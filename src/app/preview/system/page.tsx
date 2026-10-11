// DEV PREVIEW (removed before release): the system section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import System from "@/components/home/system";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="system" behavior="system">
        <System />
      </Slot>
    </main>
  );
}
