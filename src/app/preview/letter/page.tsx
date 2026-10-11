// DEV PREVIEW (removed before release): the letter section on its own, for porting checks.
import Slot from "@/components/home/Slot";
import Letter from "@/components/home/letter";

export default function Preview() {
  return (
    <main className="km-page">
      <Slot id="letter" behavior="letter">
        <Letter />
      </Slot>
    </main>
  );
}
