import type { CalendarEvent, CalendarView } from "./Cal.types"
import type { JSX } from "solid-js"

export interface CalDayProps {
  selectedDate?: string
  day: {
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
    isDayOpen: boolean
    items: CalendarEvent[]
  }
  view: CalendarView
  onDayClick: (day: Date) => void
  onItemClick?: (event: CalendarEvent) => void
  renderItem?: (event: CalendarEvent, day: Date) => JSX.Element
  formatDate: (date: Date) => string
  highlightedEventId?: string | null
}

export interface CalDayHourProps {
  hour: number
  events: CalendarEvent[]
  onHourClick: (date: Date, hour: number) => void
  onItemClick?: (event: CalendarEvent) => void
  renderItem?: (event: CalendarEvent, day: Date) => JSX.Element
}
