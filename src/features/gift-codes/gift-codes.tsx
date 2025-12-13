import { For, Show } from "solid-js"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { ticketStore } from "~/features/ticket/ticket.store"
import { giftCodesCtrl } from "~/features/gift-codes/gift-codes.ctrl"

const giftCodesTxt = {
  fr: {
    label: 'Codes cadeaux',
    add: 'Ajouter un code cadeau',
    placeholder: 'Entrez un code cadeau',
  },
  en: {
    label: 'Gift codes',
    add: 'Add a gift code',
    placeholder: 'Enter a gift code',
  },
}

export const GiftCodes = () => {
  const lang = langCtrl()
  const giftCodesCtrlStore = giftCodesCtrl();

  return (
    <div class="flex flex-col gap-4 mt-4">
      <For each={ticketStore.gift_codes}>
        {(code, index) => (
          <div class="flex gap-2">
            <input
              type="text"
              class="bg-white/10 text-primary border border-primary rounded-md p-2 flex-1"
              placeholder={giftCodesTxt[lang() as keyof typeof giftCodesTxt].placeholder}
              value={code}
              onInput={(e) => {
                giftCodesCtrlStore.setGiftCodes(e.currentTarget.value, index())
              }}
            />
            {ticketStore.gift_codes.length > 0 && (
              <button
                class="btn"
                onClick={() => giftCodesCtrlStore.removeGiftCode(index())}
              >
                ×
              </button>
            )}
          </div>
        )}
      </For>
      <Show when={ticketStore.gift_codes.length < ticketStore.tickets.filter(ticket => ticket.amount > 0).length}>
        <button class="btn" onClick={() => giftCodesCtrlStore.addGiftCode()}>
          {giftCodesTxt[lang() as keyof typeof giftCodesTxt].add}
        </button>
      </Show>
    </div>
  )
}