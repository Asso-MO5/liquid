import { ticketTxt } from "./ticket.txt"
import { setTicketStore, ticketStore } from "./ticket.store"
import { langCtrl } from "~/features/lang-selector/lang.ctrl";

export const PersonalInfos = () => {
  const lang = langCtrl()

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label>{ticketTxt.first_name[lang() as keyof typeof ticketTxt.first_name]}</label>
        <input type="text" class="bg-white/10 text-text" value={ticketStore.first_name} onInput={(e) => setTicketStore('first_name', e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-1">
        <label>{ticketTxt.last_name[lang() as keyof typeof ticketTxt.last_name]}</label>
        <input type="text" class="bg-white/10 text-text" value={ticketStore.last_name} onInput={(e) => setTicketStore('last_name', e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-1">
        <label>{ticketTxt.email[lang() as keyof typeof ticketTxt.email]}</label>
        <input type="email" class="bg-white/10 text-text" value={ticketStore.email} onInput={(e) => setTicketStore('email', e.currentTarget.value)} />
      </div>
    </div>
  )
}