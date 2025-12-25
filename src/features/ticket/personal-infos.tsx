import { ticketTxt } from "./ticket.txt"
import { setTicketStore, ticketStore } from "./ticket.store"
import { translate } from "~/utils/translate";

export const PersonalInfos = () => {
  const { t } = translate(ticketTxt)

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label for="first_name" class="text-primary">{t.first_name}</label>
        <input
          aria-label={t.first_name}
          aria-required="true"
          required
          auto-complete="given-name"
          id="first_name" type="text" class="bg-white/10 text-text" value={ticketStore.first_name} onInput={(e) => setTicketStore('first_name', e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-1">
        <label for="last_name" class="text-primary">{t.last_name}</label>
        <input
          aria-label={t.last_name}
          aria-required="true"
          required
          auto-complete="family-name"
          id="last_name" type="text" class="bg-white/10 text-text" value={ticketStore.last_name} onInput={(e) => setTicketStore('last_name', e.currentTarget.value)} />
      </div>
      <div class="flex flex-col gap-1">
        <label for="email" class="text-primary">{t.email}</label>
        <input
          aria-label={t.email}
          aria-required="true"
          required
          auto-complete="email"
          id="email" type="email" class="bg-white/10 text-text" value={ticketStore.email} onInput={(e) => setTicketStore('email', e.currentTarget.value)} />
      </div>
    </div>
  )
}