import { type VoidComponent } from "solid-js";
import { SumUpCtrl } from "./sumup.ctrl";

export const SumUp: VoidComponent = () => {

  const { setCardContainer, paymentStatus } = SumUpCtrl();

  return (
    <div class="flex flex-col items-center gap-4 p-8">
      <div id="sumup-card" ref={setCardContainer} />
      {paymentStatus() && (
        <div class="text-sm text-gray-600">{paymentStatus()}</div>
      )}
    </div>
  );
};
