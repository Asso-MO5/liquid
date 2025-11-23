import { createSignal, createMemo, onMount, onCleanup, createEffect } from "solid-js"
import { useParams } from "@solidjs/router"
import type { CalendarView, CalendarDay, CalendarEvent, CalendarCtrlReturn } from "./Cal.types"
import { langs } from "~/utils/langs"
import { DAYS_TEXT } from "./Cal.const"
import { schedules } from "~/features/schedules/schedules.store"
const [view, setView] = createSignal<CalendarView>('month')
const [selectedDate, setSelectedDate] = createSignal<Date>(new Date())
const [items, setItems] = createSignal<CalendarEvent[]>([])

// Fonctions pour gérer les query parameters
const getQueryParams = () => {
  if (typeof window === 'undefined') return {}
  const urlParams = new URLSearchParams(window.location.search)
  return {
    view: urlParams.get('view') as CalendarView | null,
    date: urlParams.get('date')
  }
}

const updateQueryParams = (newView: CalendarView, newDate: Date) => {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  url.searchParams.set('view', newView)
  url.searchParams.set('date', newDate.toISOString().split('T')[0])

  window.history.pushState({}, '', url.toString())
}

const initializeFromURL = () => {
  const params = getQueryParams()

  if (params.view && ['month', 'week', 'day', 'list'].includes(params.view)) {
    setView(params.view as CalendarView)
  } else {
    updateQueryParams(view(), selectedDate())
  }


  if (params.date) {
    const date = new Date(params.date)
    if (!isNaN(date.getTime())) {
      setSelectedDate(date)
    }
  } else {
    updateQueryParams(view(), selectedDate())
  }
}

export function CalCtrl(): CalendarCtrlReturn {
  const params = useParams()
  const lang = () => params.lang as keyof typeof DAYS_TEXT


  onMount(() => {
    initializeFromURL()

    const handlePopState = () => {
      initializeFromURL()
    }

    window.addEventListener('popstate', handlePopState)

    onCleanup(() => {
      window.removeEventListener('popstate', handlePopState)
    })
  })
  createEffect(() => {
    initializeFromURL()
  })

  const setViewWithURL = (newView: CalendarView) => {
    setView(newView)
    updateQueryParams(newView, selectedDate())
  }

  const setSelectedDateWithURL = (newDate: Date) => {


    newDate.setDate(1)
    setSelectedDate(newDate)

    updateQueryParams(view(), newDate)
  }

  const goToPrevious = () => {
    const current = selectedDate()
    const newDate = new Date(current)
    if (newDate.getMonth() < current.getMonth()) {
      return
    }
    newDate.setMonth(current.getMonth() - 1)
    setSelectedDateWithURL(newDate)
  }

  const goToNext = () => {
    const current = selectedDate()
    const newDate = new Date(current)
    newDate.setMonth(current.getMonth() + 1)
    setSelectedDateWithURL(newDate)
  }

  const goToToday = () => {
    setSelectedDateWithURL(new Date())
  }

  const generateMonthDays = (current: Date, today: Date): CalendarDay[] => {
    const year = current.getFullYear()
    const month = current.getMonth()

    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay() + 1)

    const days: CalendarDay[] = []

    const museumSchedule = schedules()
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const isOpen = () => {
        if (date < selectedDate()) {
          return false
        }
        let isOpen = false
        isOpen = museumSchedule.some(schedule => isSameDay(new Date(schedule.start_date), date))
        if (isOpen) {
          return true
        }
        isOpen = museumSchedule.some(schedule => isSameDay(new Date(schedule.end_date), date))
        if (isOpen) {
          return true
        }
        isOpen = museumSchedule.some(schedule => !schedule.is_exception && schedule.day_of_week === date.getDay())
        if (isOpen) {
          return true
        }
        return false
      }


      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: isSameDay(date, today),
        isDayOpen: isOpen(),
        items: []
      })
    }

    return days
  }

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
  }

  const formatDate = (date: Date): string => {
    return date.getDate().toString()
  }

  const canGoToPrevious = createMemo(() => {
    return selectedDate() < new Date()
  })


  const calendarDays = createMemo((): CalendarDay[] => {
    const current = selectedDate()
    const today = new Date()

    const days = generateMonthDays(current, today)
    return days.map(day => ({
      ...day,
      items: items() // Utiliser le signal items
    }))
  })

  const currentMonthName = createMemo(() => {
    const currentLang = lang()
    return selectedDate().toLocaleDateString(langs[currentLang] || langs.fr, {
      month: 'long'
    })
  })

  const currentYear = createMemo(() => {
    return selectedDate().getFullYear()
  })

  const weekDays = createMemo(() => {
    const currentLang = lang()
    return DAYS_TEXT[currentLang] || DAYS_TEXT.fr
  })


  return {
    // État
    view,
    selectedDate,


    // Actions
    setView: setViewWithURL,
    setSelectedDate: setSelectedDateWithURL,
    setItems,

    // Navigation
    goToPrevious,
    goToNext,
    goToToday,

    // Données calculées
    calendarDays,
    currentMonthName,
    currentYear,
    weekDays,
    canGoToPrevious,

    // Utilitaires
    formatDate
  }
}