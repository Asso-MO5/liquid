import { onMount, createSignal } from "solid-js"

export const darkModeCtrl = () => {
  const [isDarkMode, setIsDarkMode] = createSignal<'light' | 'dark'>('light')

  const toggleDarkMode = () => {
    if (typeof window === 'undefined') return
    const newMode = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', newMode === 'dark')
    localStorage.setItem('darkMode', newMode)
    setIsDarkMode(newMode)
  }

  const initDarkMode = () => {
    if (typeof window === 'undefined') return 'light'

    const stored = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const mode = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light'

    document.documentElement.classList.toggle('dark', mode === 'dark')
    setIsDarkMode(mode)
    return mode
  }

  onMount(() => {
    initDarkMode()
  })

  return {
    toggleDarkMode,
    isDarkMode,
  }
}