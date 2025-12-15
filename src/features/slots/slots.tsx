import { For } from "solid-js";
import type { Slot } from "~/features/slots/slot.type";

type SlotsProps = {
  isFetching: boolean,
  slots: Slot[],
  currentSlot?: string,
  onSlotClick: (slot: Slot) => void,
}

export const Slots = (props: SlotsProps) => (
  <div class="p-3 gap-4 md:flex grid grid-cols-2 flex-wrap justify-center mx-auto">
    <For each={props.slots.length > 0 ? props.slots : [{ start_time: '09:00', end_time: '10:00', available: 0 } as Slot]}>
      {(slot) => (
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
      )}
    </For>
  </div>
)
