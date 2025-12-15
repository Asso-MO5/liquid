import { ticketTxt } from "./ticket.txt"
import { setTicketStore, ticketStore } from "./ticket.store"
import { langCtrl } from "~/features/lang-selector/lang.ctrl";

export const PersonalInfos = () => {
  const lang = langCtrl()

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label for="first_name" class="text-primary">{ticketTxt.first_name[lang() as keyof typeof ticketTxt.first_name]}</label>
        <input
          aria-label={ticketTxt.first_name[lang() as keyof typeof ticketTxt.first_name]}
          aria-required="true"
          required
          auto-complete="given-name"
          id="first_name" type="text" class="bg-white/10 text-text" value={ticketStore.first_name} onInput={(e) => setTicketStore('first_name', e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-1">
        <label for="last_name" class="text-primary">{ticketTxt.last_name[lang() as keyof typeof ticketTxt.last_name]}</label>
        <input
          aria-label={ticketTxt.last_name[lang() as keyof typeof ticketTxt.last_name]}
          aria-required="true"
          required
          auto-complete="family-name"
          id="last_name" type="text" class="bg-white/10 text-text" value={ticketStore.last_name} onInput={(e) => setTicketStore('last_name', e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-1">
        <label for="email" class="text-primary">{ticketTxt.email[lang() as keyof typeof ticketTxt.email]}</label>
        <input
          aria-label={ticketTxt.email[lang() as keyof typeof ticketTxt.email]}
          aria-required="true"
          required
          auto-complete="email"
          id="email" type="email" class="bg-white/10 text-text" value={ticketStore.email} onInput={(e) => setTicketStore('email', e.currentTarget.value)} />
      </div>
    </div>
  )
}