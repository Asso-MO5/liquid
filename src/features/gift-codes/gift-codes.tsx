import { For, Show } from "solid-js"
import { ticketStore } from "~/features/ticket/ticket.store"
import { giftCodesCtrl } from "~/features/gift-codes/gift-codes.ctrl"
import { translate } from "~/utils/translate"
import { giftCodesTxt } from "./gift-codes.txt"

export const GiftCodes = () => {
  const { t } = translate(giftCodesTxt)
  const giftCodesCtrlStore = giftCodesCtrl()

  return (
    <div class="flex flex-col gap-4 mt-4">
      <div id="gift-codes-list" class="flex flex-col gap-4">
        <For each={ticketStore.gift_codes}>
          {(code, index) => (
            <div class="flex gap-2">
              <input
                id={`gift-code-input-${index()}`}
                type="text"
                class="bg-white/10 text-primary border border-primary rounded-md p-2 flex-1"
                placeholder={t().placeholder}
                title={t().placeholder}
                value={code}
                onChange={(e) => giftCodesCtrlStore.setGiftCodes(e.currentTarget.value, index())}
              />
              {ticketStore.gift_codes.length > 0 && (
                <button
                  id={`gift-code-remove-${index()}`}
                  class="btn"
                  onClick={() => giftCodesCtrlStore.removeGiftCode(index())}
                  aria-label={t().remove}
                >
                  ×
                </button>
              )}
            </div>
          )}
        </For>
      </div>
      
      <Show when={ticketStore.gift_codes.length < ticketStore.tickets.filter(ticket => ticket.amount > 0).length}>
        <button class="btn" onClick={() => giftCodesCtrlStore.addGiftCode()} id="gift-codes-add" aria-controls="gift-codes-list">
          {t().add}
        </button>
      </Show>
    </div>
  )
}