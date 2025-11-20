import { type VoidComponent, Show } from "solid-js";
import { SumUpCtrl } from "./sumup.ctrl";

type SumUpProps = {
  checkoutId: string | null;
  checkoutReference: string | null;
  language?: string;
}

export const SumUp: VoidComponent<SumUpProps> = (props) => {
  const { setCardContainer } = SumUpCtrl(props);

  return (
    <div class="flex flex-col items-center gap-4 p-8">
      <Show when={props.checkoutId}>
        <div id="sumup-card" ref={setCardContainer} />
      </Show>
    </div>
  );
};
