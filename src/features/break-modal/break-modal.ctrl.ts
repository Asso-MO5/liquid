import { createSignal, onCleanup, onMount } from "solid-js"

export const breakModalCtrl = () => {
  const [show, setShow] = createSignal(false)

  const closeModal = (): void => {
    setShow(false)
  }

  onMount(() => {
    if (typeof window === "undefined") return
    setShow(true)
    document.addEventListener("keyup", (event) => (event.key === "Escape" ? closeModal() : null))

  })

  onCleanup(() => {
    if (typeof window === "undefined") return
    document.removeEventListener("keyup", (event) => (event.key === "Escape" ? closeModal() : null))
  })


  return {
    closeModal,
    show
  }
}
