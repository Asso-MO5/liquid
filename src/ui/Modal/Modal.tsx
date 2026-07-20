import { type JSX, onCleanup, onMount, Show } from 'solid-js'
import { Close } from '../Close/Close'
import { ModalCtrl } from './Modal.ctrl'

export const Modal = () => {
  const modal = ModalCtrl()

  onMount(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', modal.handleKeyDown)
    }
  })

  onCleanup(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', modal.handleKeyDown)
    }
  })

  return (
    <Show when={modal.isOpen()}>
      <div
        class="fixed inset-0 z-50  flex items-center justify-center bg-black/20 backdrop-blur-sm "
        role="presentation"
        onClick={modal.handleBackdropClick}
      >
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: inner dialog also stops propagation to backdrop */}
        <div
          class="bg-white rounded-lg shadow-xl w-full max-h-[90vh] mx-4 p-4 flex flex-col gap-4
                     data-[size=sm]:max-w-sm data-[size=md]:max-w-md data-[size=lg]:max-w-lg
                     data-[size=xl]:max-w-xl data-[size=full]:max-w-full"
          data-size={modal.size()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={modal.title() ? 'modal-title' : undefined}
          onClick={modal.handleContentClick}
        >
          {/* Header */}
          <Show when={modal.title() || modal.closable()}>
            <div class="flex items-center justify-between  ">
              <Show when={modal.title()}>
                <h3 id="modal-title" class="text-lg font-semibold text-gray-900 m-0">
                  {modal.title()}
                </h3>
              </Show>

              <Show when={modal.closable()}>
                <button type="button" onClick={modal.close} title="Fermer">
                  <Close size={20} />
                </button>
              </Show>
            </div>
          </Show>

          {/* Content */}
          <div class="p-4 overflow-y-auto overflow-x-hidden">{modal.content() as JSX.Element}</div>
        </div>
      </div>
    </Show>
  )
}
