// DEV PREVIEW (removed before release): the System Audit FAQ on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Faq from "@/components/audit/faq";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="faq" behavior="faq">
        <Faq />
      </Slot>
    </main>
  );
}
