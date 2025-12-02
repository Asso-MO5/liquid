import { Show, createSignal, onMount } from "solid-js"
import type { CalDayProps } from "./CalDay.types"

export const CalDay = (props: CalDayProps) => {
  const [isMobile, setIsMobile] = createSignal(false)

  const isSameDate = (date: Date) => {
    if (!props.selectedDate || typeof props.selectedDate !== 'string') return false

    // format YYYY-MM-DD
    const selectedDate = new Date(props.selectedDate)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    return selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year
  }
  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  })


  return (
    <Show
      when={isMobile()}
      fallback={
        /* Vue desktop */
        <div
          class="
            p-2 border border-primary rounded-sm cursor-pointer data-[open=true]:hover:bg-primary
            data-[current-month=false]:opacity-30
            data-[today=true]:text-accent data-[today=true]:border-accent data-[today=true]:bg-transparent 
            data-[selected=true]:bg-primary data-[selected=true]:border-primary data-[selected=true]:text-white
            data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed
             data-[open=false]:border-transparent data-[open=false]:cursor-not-allowed
             data-[open=false]:opacity-30
            "
          data-current-month={props.day.isCurrentMonth}
          data-selected={isSameDate(props.day.date)}
          data-open={props.day.isDayOpen}
          data-today={props.day.isToday}
          onClick={() => props.onDayClick(props.day.date)}
        >
          <div class="text-lg font-medium mb-1 flex items-center justify-center">
            {props.formatDate(props.day.date)}
          </div>
        </div>
      }
    >
      {/* Vue mobile avec ronds */}
      <div
        class="
          aspect-square rounded-full flex flex-col items-center justify-center cursor-pointer data-[open=true]:cursor-pointer data-[open=true]:hover:bg-primary 
          border border-transparent
        data-[current-month=false]:text-gray-400 data-[current-month=false]:bg-bg 
        data-[today=true]:border-secondary
        data-[selected=true]:bg-primary data-[selected=true]:border-primary data-[selected=true]:text-white
          data-[open=false]:cursor-not-allowed data-[open=false]:opacity-30 data-[open=false]:text-gray-400
        "
        data-current-month={props.day.isCurrentMonth}
        data-today={props.day.isToday}
        data-open={props.day.isDayOpen}
        data-selected={isSameDate(props.day.date)}
        onClick={() => props.onDayClick(props.day.date)}
      >
        {/* Numéro du jour */}
        <div class="text-sm font-medium mb-1">
          {props.formatDate(props.day.date)}
        </div>
      </div>
    </Show>

  )
}