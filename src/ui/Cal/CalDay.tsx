import { Show, createSignal, onMount } from 'solid-js'
import type { CalDayProps } from './CalDay.types'
import { formatDate } from '~/utils/format-date'

export const CalDay = (props: CalDayProps) => {
  const [isMobile, setIsMobile] = createSignal(false)

  const isSameDate = (date: Date) => {
    if (!props.selectedDate || typeof props.selectedDate !== 'string')
      return false
    const selectedDate = new Date(props.selectedDate)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    )
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
        /* DESKTOP */
        <>
          <Show when={props.day.isDayOpen}>
            <button
              type="button"
              class="
                p-2 border border-primary rounded-sm cursor-pointer data-[open=true]:hover:bg-primary
                data-[current-month=false]:opacity-30
                data-[today=true]:text-accent data-[today=true]:border-accent
                data-[today=true]:hover:bg-accent data-[today=true]:hover:text-white
                data-[today=true]:bg-transparent 
                data-[selected=true]:bg-primary data-[selected=true]:border-primary 
                data-[selected=true]:text-white
                data-[today=true]:data-[selected=true]:bg-accent 
                data-[today=true]:data-[selected=true]:text-white
                data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed
              "
              data-current-month={props.day.isCurrentMonth}
              data-selected={isSameDate(props.day.date)}
              data-today={props.day.isToday}
              onClick={() => props.onDayClick(props.day.date)}
            >
              <div class="text-lg font-medium mb-1 flex items-center justify-center">
                {formatDate(props.day.date)}
              </div>
            </button>
          </Show>
          <Show when={!props.day.isDayOpen}>
            <div
              class="
                p-2 border border-transparent
              data-[today=true]:text-accent data-[today=true]:border-accent
              data-[today=true]:hover:bg-accent data-[today=true]:hover:text-white
                data-[today=true]:bg-transparent pointer-events-none
                opacity-30
              "
              data-current-month={props.day.isCurrentMonth}
              data-today={props.day.isToday}
            >
              <div class="text-lg font-medium mb-1 flex items-center justify-center">
                {formatDate(props.day.date)}
              </div>
            </div>
          </Show>
        </>
      }
    >
      {/* MOBILE */}
      <>
        <Show when={props.day.isDayOpen}>
          <button
            type="button"
            tabIndex={props.day.isDayOpen ? 0 : -1}
            class="
              aspect-square rounded-full flex flex-col items-center justify-center cursor-pointer
              hover:bg-primary border border-transparent
            data-[current-month=false]:text-gray-400 data-[current-month=false]:bg-bg 
            data-[today=true]:border-secondary 
            data-[selected=true]:bg-primary data-[selected=true]:border-primary data-[selected=true]:text-white
            "
            data-current-month={props.day.isCurrentMonth}
            data-today={props.day.isToday}
            data-selected={isSameDate(props.day.date)}
            onClick={() => props.onDayClick(props.day.date)}
          >
            <div class="text-sm font-medium mb-1">
              {formatDate(props.day.date)}
            </div>
          </button>
        </Show>
        <Show when={!props.day.isDayOpen}>
          <div class="text-sm font-medium mb-1 opacity-30 pointer-events-none">
            {formatDate(props.day.date)}
          </div>
        </Show>
      </>
    </Show>
  )
}
