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
          class="
          relative
          max-h-[90dvh] w-full max-w-2xl
          md:text-xl
          p-4 border border-primary bg-bg text-text
          overflow-y-auto overflow-x-hidden"
          id="dialog-pause"
        >
          {/*
          tabindex=0 to make sure the initial focus is at the top of the modal rather than on the button at the bottom on mobile devices
          outline-0 used here since the title itself is not interactive
      */}
          <p id="title-pause" class="outline-0" tabindex="0" autofocus>
            {t().pause1}
          </p>
          <p>
            {t().pause2}
            <br />
            {t().pause3}
          </p>
          <p>
            {t().pause4}
            <br />
            {t().pause5}
          </p>
          <p class="mb-0">{t().pause6}</p>
          <ul class="list-disc m-4 mt-0">
            <li>{t().pause7}</li>
            <li>{t().pause8}</li>
            <li>{t().pause9}</li>
          </ul>
          <p>{t().pause10}</p>
          <p>{t().pause11}</p>
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
