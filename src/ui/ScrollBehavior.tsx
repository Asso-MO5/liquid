import { onMount, onCleanup } from 'solid-js'

export default function ScrollBehavior() {
  let lastScrollY = 0
  let header: HTMLElement | null = null
  let timeoutId: number | undefined
  let scrollElement: HTMLElement | Window | null = null
  let scrollHandler: (() => void) | null = null

  const handleScroll = () => {
    if (!header) return

    // Récupérer la position actuelle du scroll
    let currentScrollY = 0
    if (scrollElement === window) {
      currentScrollY = window.scrollY || document.documentElement.scrollTop
    } else {
      currentScrollY = (scrollElement as HTMLElement).scrollTop
    }

    if (timeoutId) window.clearTimeout(timeoutId)

    if (currentScrollY > lastScrollY) {
      // Scroll vers le bas
      timeoutId = window.setTimeout(() => {
        if (header) header.dataset.visible = 'false'
      }, 100)
    } else {
      // Scroll vers le haut
      if (header) header.dataset.visible = 'true'
    }

    lastScrollY = currentScrollY
  }

  onMount(() => {
    if (typeof window === 'undefined') return

    header = document.getElementById('header')

    // Trouver l'élément qui scroll (window ou un élément avec overflow)
    const ticketElement = document.getElementById('ticket')
    if (ticketElement && getComputedStyle(ticketElement).overflowY !== 'visible') {
      scrollElement = ticketElement
    } else {
      scrollElement = window
    }

    scrollHandler = handleScroll

    // Ajouter l'event listener
    if (scrollElement === window) {
      window.addEventListener('scroll', scrollHandler, { passive: true })
    } else {
      (scrollElement as HTMLElement).addEventListener('scroll', scrollHandler, { passive: true })
    }

    // Appel initial
    handleScroll()
  })

  onCleanup(() => {
    if (typeof window === 'undefined') return

    if (timeoutId) window.clearTimeout(timeoutId)

    if (scrollHandler && scrollElement) {
      if (scrollElement === window) {
        window.removeEventListener('scroll', scrollHandler)
      } else {
        (scrollElement as HTMLElement).removeEventListener('scroll', scrollHandler)
      }
    }
  })

  return null
}