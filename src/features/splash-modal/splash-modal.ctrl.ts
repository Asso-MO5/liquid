import { createSignal, onCleanup, onMount } from 'solid-js'

export const splashModalCtrl = () => {
  const [show, setShow] = createSignal(false)

  const closeModal = (): void => {
    setShow(false)
  }

  const handleKeyUp = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }

  onMount(() => {
    if (typeof window === 'undefined') return
    setShow(true)
    document.addEventListener('keyup', handleKeyUp)
  })

  onCleanup(() => {
    if (typeof window === 'undefined') return
    document.removeEventListener('keyup', handleKeyUp)
  })

  return {
    closeModal,
    show,
  }
}
