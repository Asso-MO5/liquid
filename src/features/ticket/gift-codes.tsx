import { For } from "solid-js"
import { createMutable } from "solid-js/store"
import { langCtrl } from "../lang-selector/lang.ctrl"
import { TicketCtrl } from "./ticket.ctrl"

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

type CodeItem = {
  value: string
}

export const GiftCodes = () => {
  const lang = langCtrl()
  const codes = createMutable<CodeItem[]>([])
  const ticketCtrl = TicketCtrl()
  const addGiftCode = () => {
    codes.push({ value: '' })
  }

  return (
    <div class="flex flex-col gap-4 mt-4">
      <For each={codes}>
        {(codeItem: CodeItem) => (
          <div>
            <input
              type="text"
              class="bg-white/10 text-primary border border-primary rounded-md p-2"
              placeholder={giftCodesTxt[lang() as keyof typeof giftCodesTxt].placeholder}
              value={codeItem.value}
              onInput={(e) => {
                codeItem.value = e.currentTarget.value
                ticketCtrl.setGiftCodes(codeItem.value, codes.indexOf(codeItem))
              }}
            />
          </div>
        )}
      </For>
      <button class="btn" onClick={addGiftCode}>{giftCodesTxt[lang() as keyof typeof giftCodesTxt].add}</button>
    </div>
  )
}