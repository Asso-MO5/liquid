import { For } from "solid-js"
import { CalCtrl } from "./Cal.ctrl"
import { CalDay } from "./CalDay"
import { CalControls } from "./CalControls"

interface CalProps {
  onDayClick?: (day: Date) => Promise<void>
  selectedDate?: string
}

export function Cal(props: CalProps) {
  const calendar = CalCtrl();

  return (
    <div class="flex flex-col items-center justify-baseline gap-4" id="calendar">
      <CalControls />
      <div
        class="grid gap-3 grid-cols-7"
      >
        <For each={calendar.weekDays()}>
          {(day) => (
            <div class="text-lg font-medium mb-1 flex items-center justify-center">
              {day}
            </div>
          )}
        </For>
        <For each={calendar.calendarDays()}>
          {(day) => (
            <CalDay
              day={day}
              selectedDate={props.selectedDate}
              view={calendar.view()}
              onDayClick={(day) => props.onDayClick?.(day)}
              formatDate={calendar.formatDate}
            />
          )}
        </For>
      </div>
    </div>
  )
}
