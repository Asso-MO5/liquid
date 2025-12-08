import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { guidedTourPrice } from "~/features/price/price.store"
import { setTicketStore, ticketStore } from "./ticket.store"

const txt = {
  fr: {
    title: "Visite guidée ? ",
    alt: "Visite guidée",
  },
  en: {
    title: "Guided tour ? ",
    alt: "Guided tour",
  }
}

export const GuidedTourPrice = () => {
  const lang = langCtrl()
  const guidedTourPriceAmount = guidedTourPrice() ?? 0

  return (
    <div class="grid grid-cols-[auto_1fr] items-center  justify-start gap-2 w-full max-w-sm my-4">
      <input type="checkbox" id="guided-tour" class="w-4 h-4" aria-label={txt[lang() as keyof typeof txt].alt} checked={ticketStore.guided_tour} onChange={() => setTicketStore('guided_tour', !ticketStore.guided_tour)} />
      <label for="guided-tour" class="whitespace-nowrap">{txt[lang() as keyof typeof txt].title} <span class="text-secondary">{`(+${guidedTourPriceAmount}€)`}</span></label>
    </div>
  )
}