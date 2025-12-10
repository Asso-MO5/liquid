import { For } from "solid-js"
import { langCtrl } from "../lang-selector/lang.ctrl"
import { TicketCtrl } from "./ticket.ctrl"
import { ticketStore } from "./ticket.store"

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
  const ticketCtrl = TicketCtrl()

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
                ticketCtrl.setGiftCodes(e.currentTarget.value, index())
              }}
            />
            {ticketStore.gift_codes.length > 1 && (
              <button
                class="btn"
                onClick={() => ticketCtrl.removeGiftCode(index())}
              >
                ×
              </button>
            )}
          </div>
        )}
      </For>
      <button class="btn" onClick={() => ticketCtrl.addGiftCode()}>
        {giftCodesTxt[lang() as keyof typeof giftCodesTxt].add}
      </button>
    </div>
  )
}