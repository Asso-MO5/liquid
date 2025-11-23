import { onMount, onCleanup } from 'solid-js'

export default function ScrollBehavior() {
  let lastScrollY = 0
  let header: HTMLElement | null = null
  let timeoutId: number | undefined

  const handleScroll = () => {

    if (!header) return

    const currentScrollY = window.scrollY

    if (timeoutId) window.clearTimeout(timeoutId)

    if (currentScrollY > lastScrollY) {
      timeoutId = window.setTimeout(() => {
        if (header) header.dataset.visible = 'false'
      }, 100)
    } else {

      header.dataset.visible = 'true'
    }

    lastScrollY = currentScrollY
  }

  onMount(() => {
    if (typeof window === 'undefined') return
    header = document.getElementById('header')
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onCleanup(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', handleScroll)
    if (timeoutId) window.clearTimeout(timeoutId)
  })

  return null
}