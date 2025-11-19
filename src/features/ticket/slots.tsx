import { For } from "solid-js";
import type { Slot } from "./ticket.type";


type SlotsProps = {
  isFetching: boolean,
  slots: Slot[],
  currentSlot?: string,
  onSlotClick: (slot: Slot) => void,
}
export const Slots = (props: SlotsProps) => {


  return (
    <div class="p-3 gap-4 grid grid-cols-2  mx-auto">
      <For each={props.slots}>
        {(slot) => (
          <div
            data-available={slot.available > 0}
            data-current={slot.start_time === props.currentSlot}
            class="
              flex flex-col gap-2 border border-primary p-2 rounded-md
            data-[available=true]:border-green-bright 
              data-[available=false]:opacity-30
              data-[available=false]:cursor-not-allowed
              data-[available=true]:cursor-pointer      
              data-[available=true]:hover:bg-green-500/10
              data-[current=true]:bg-green-500/10
            "
            onClick={() => props.onSlotClick(slot)}
          >
            <div class="text-sm text-center">
              {slot.start_time.split(':').slice(0, 2).join(':')} - {slot.end_time.split(':').slice(0, 2).join(':')}
            </div>
            <div class="h-4 rounded-full border border-white relative">
              <div class="absolute inset-1 bg-white rounded-full"
                style={{ width: `${slot.occupancy_percentage}%` }}
              />
            </div>
          </div>
        )}
      </For>
    </div>
  )
}