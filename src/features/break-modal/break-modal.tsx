import { translate } from "~/utils/translate"
import { breakModalTxt } from "./break-modal.const"
import { breakModalCtrl } from "./break-modal.ctrl"
import { Show } from "solid-js"


export const BreakModal = () => {
  const { t } = translate(breakModalTxt)
  const { closeModal, show } = breakModalCtrl()

  return (
    <Show when={show()}>
      <div class="fixed inset-0 flex items-center justify-center z-[9999] p-6">
        <dialog
          open
          aria-labelledby="title-pause"
          class="
            relative
            max-h-[90dvh] w-full max-w-2xl
            md:text-xl
            p-4 border border-primary bg-bg text-text
            overflow-y-auto overflow-x-hidden
          "
          id="dialog-pause"
        >
          {/*
          tabindex=0 to make sure the initial focus is at the top of the modal
          rather than on the button at the bottom on mobile devices.
          The title itself is not interactive so we use outline-0.
          */}
          <h2
            id="title-pause"
            class="sr-only outline-0"
            tabindex="0"
            autofocus
          >
            {t().videoAria}
          </h2>

          {/*
          aspect-video wrapper keeps a 16:9 ratio so the iframe scales nicely
          on every viewport and reacts smoothly to size changes.
          */}
          <div class="w-full aspect-video my-4">
            <iframe
              class="w-full h-full"
              src="https://www.youtube.com/embed/8GUKuIOJyl4?autoplay=1&controls=1"
              title={t().videoAria}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>

          <div class="text-center">
            <button
              id="dialog-pause-close"
              onClick={closeModal}
              commandfor="dialog-pause"
              command="close" title={t().closeAria}>
              {t().close}
            </button>
          </div>
        </dialog>
      </div>
    </Show>
  )
}
