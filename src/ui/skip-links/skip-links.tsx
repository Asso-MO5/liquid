import { txt } from './skip-links.txt'
import { translate } from "~/utils/translate"

export const SkipLinks = () => {
  const { t } = translate(txt)

  // Without this, the view scrolls to the target element but it doesn't receive focus, so you still have to tab through the menu links before reaching the main content.
  // Shouldn't be necessary, maybe linked to how solidjs operates.
  const targetFocus = (event: MouseEvent) => {
    const targetId = event.target instanceof HTMLElement && event.target.getAttribute('href')

    if (targetId) {
      const targetElement = document.querySelector(targetId) as HTMLElement | null
      if (targetElement) {
        targetElement.setAttribute('tabindex', '-1') // make it focusable
        targetElement.focus()
      }
    }
  }

  return (
    <nav role="navigation" aria-label={t().nav}>
      <a href="#main" onClick={(e) => targetFocus(e)} class="border-2 border-primary bg-bg text-text text-xl m-2 p-4 fixed z-60 -translate-y-30 focus:translate-y-0 focus:underline">{t().main}</a>
    </nav>
  )
}
