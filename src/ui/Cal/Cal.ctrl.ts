import { createSignal, createMemo, onMount, onCleanup, createEffect } from "solid-js"
import type { CalendarView, CalendarDay, CalendarEvent, CalendarCtrlReturn } from "./Cal.types"
import { langs } from "~/utils/langs"
import { DAYS_TEXT } from "./Cal.const"
import { schedules } from "~/features/schedules/schedules.store"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"

type Period = {
  id: string
  name: string
  start_date?: string | null
  end_date?: string | null
}
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
  const lang = langCtrl()


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

  // Vérifie si une date est dans une période (closure ou holiday)
  const isDateInPeriod = (date: Date, period: Period): boolean => {
    if (!period.start_date || !period.end_date) {
      return false
    }
    const startDate = new Date(period.start_date)
    const endDate = new Date(period.end_date)
    // Normaliser les dates pour comparer seulement les jours (sans heures)
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
    const check = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    return check >= start && check <= end
  }

  const generateMonthDays = (current: Date, today: Date): CalendarDay[] => {
    const year = current.getFullYear()
    const month = current.getMonth()

    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay() + 1)

    const days: CalendarDay[] = []

    const museumSchedule = schedules()
    const maxDate = new Date()


    // ===> Plus classique Désactivé pour le moment
    maxDate.setMonth(maxDate.getMonth() + 2)
    // ICI on force le mois de janvier
    maxDate.setMonth(0)
    maxDate.setDate(31)

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const isOpen = () => {
        // Vérifications de base
        if (new Date(date) < new Date()) {
          return false
        }
        if (date < selectedDate()) {
          return false
        }
        if (date.getTime() > maxDate.getTime()) {
          return false
        }

        // Vérifier d'abord les périodes de fermeture (closure_periods)
        // Les périodes de fermeture s'appliquent à tous les jours
        const isInClosurePeriod = museumSchedule.some(schedule => {
          const closurePeriods = ((schedule as unknown) as { closure_periods?: Period[] }).closure_periods || []
          return closurePeriods.some((period: Period) => isDateInPeriod(date, period))
        })


        if (isInClosurePeriod) {
          return false
        }

        // Vérifier les jours avec audience_type: "holiday"
        // Ils ne sont ouverts que si la date est dans une holiday_period ET que c'est le bon jour de la semaine
        const holidaySchedules = museumSchedule.filter(schedule => schedule.audience_type === 'holiday')
        if (holidaySchedules.length > 0) {
          // Vérifier si c'est un jour holiday (même jour de la semaine)
          const matchingHolidaySchedule = holidaySchedules.find(schedule =>
            !schedule.is_exception && schedule.day_of_week === date.getDay()
          )

          if (matchingHolidaySchedule) {
            // Si c'est un jour holiday, vérifier si la date est dans une holiday_period de ce schedule
            const holidayPeriods = ((matchingHolidaySchedule as unknown) as { holiday_periods?: Period[] }).holiday_periods || []
            const isInHolidayPeriod = holidayPeriods.some((period: Period) => isDateInPeriod(date, period))
            // Les jours holiday ne sont ouverts QUE dans leurs périodes
            return isInHolidayPeriod
          }
        }

        // Vérifier les règles normales d'ouverture (pour les jours non-holiday)
        // Vérifier si la date correspond à un start_date ou end_date
        let isOpen = museumSchedule.some(schedule => {
          // Ignorer les schedules holiday pour les règles normales
          if (schedule.audience_type === 'holiday') {
            return false
          }
          if (schedule.start_date && isSameDay(new Date(schedule.start_date), date)) {
            return true
          }
          if (schedule.end_date && isSameDay(new Date(schedule.end_date), date)) {
            return true
          }
          return false
        })

        if (isOpen) {
          return true
        }

        // Vérifier les jours de la semaine réguliers (non exception, non holiday)
        isOpen = museumSchedule.some(schedule =>
          !schedule.is_exception &&
          schedule.day_of_week === date.getDay() &&
          schedule.audience_type !== 'holiday'
        )

        return isOpen
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


  const canGoToNext = createMemo(() => {
    const today = new Date()
    today.setMonth(today.getMonth() + 2)
    const isMoreThan3Months = selectedDate().getTime() > today.getTime()
    return isMoreThan3Months
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
    canGoToNext,

    // Utilitaires
    formatDate
  }
}