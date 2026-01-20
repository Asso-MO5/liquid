import { For, Show } from "solid-js";
import type { Slot } from "~/features/slots/slot.type";
import { translate } from "~/utils/translate";
import { slotsText } from "./slots.text";

type SlotsProps = {
  isFetching: boolean,
  slots: Slot[],
  currentSlot?: string,
  onSlotClick: (slot: Slot) => void,
  labelId: string,
}

export const Slots = (props: SlotsProps) => {
  const { t } = translate(slotsText)
  return (
    <>
      <Show when={props.isFetching}>
        <div class="text-center text-sm text-accent" aria-busy="true">
          {t().loading}
        </div>
      </Show>
      <Show when={props.slots.length === 0 && !props.isFetching}>
        <div class="text-center text-sm text-accent">
          {t().no_slots}
        </div>
      </Show>
      
      <ol
        role="list"
        class="p-3 gap-4 md:flex grid grid-cols-2 flex-wrap justify-center mx-auto"
        aria-labelledby={props.labelId}
      >
        <For each={props.slots.length > 0 ? props.slots : []}>
          {(slot) => (
            <li>
              <button
                type="button"
                tabIndex={slot.available > 0 ? 0 : -1}
                aria-label={slot.start_time.split(':').slice(0, 2).join(':') + ' - ' + slot.end_time.split(':').slice(0, 2).join(':')}
                aria-pressed={slot.start_time === props.currentSlot}
                disabled={slot.available === 0}
                data-available={slot.available > 0}
                data-current={slot.start_time === props.currentSlot}
                class="
                  flex flex-col gap-2 border border-primary p-2 rounded-md
                  data-[available=true]:border-green-bright 
                  data-[available=false]:opacity-30
                  data-[available=false]:cursor-not-allowed
                  data-[available=true]:cursor-pointer
                  data-[available=true]:hover:bg-green-500/10
                  data-[available=true]:hover:text-primary
                  data-[current=true]:bg-green-500/30
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
                onClick={() => props.onSlotClick(slot)}
              >
                <div class="text-center flex items-center justify-center gap-1 whitespace-nowrap">
                  <span>{slot.start_time.split(':').slice(0, 2).join(':')}</span>
                  <span class="text-text text-sm"> - </span>
                  <span>{slot.end_time.split(':').slice(0, 2).join(':')}</span>
                </div>
              </button>
            </li>
          )}
        </For>
      </ol>
    </>
  )
}
