import { ticketTxt } from "./ticket.txt"
import { setTicketStore, ticketStore } from "./ticket.store"
import { createMemo } from "solid-js";
import { langCtrl } from "../lang-selector/lang.ctrl";
import { GiftCodes } from "./gift-codes";

type PersonalInfosProps = {
  onPayment: () => void;
  isLoading: boolean;
}
export const PersonalInfos = (props: PersonalInfosProps) => {
  const lang = langCtrl()

  const disabled = createMemo(() => {
    const testEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticketStore.email);
    return ticketStore.first_name === '' || ticketStore.last_name === '' || !testEmail || ticketStore.tickets.length === 0 || ticketStore.reservation_date === '' || ticketStore.slot_start_time === '';
  });

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
      <GiftCodes />
      <button
        disabled={disabled() || props.isLoading}
        data-loading={props.isLoading}
        class="btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => props.onPayment()}>
        {ticketTxt[props.isLoading ? 'loading' : 'proceed_to_payment'][lang() as keyof typeof ticketTxt.proceed_to_payment]}
      </button>
    </div>
  )
}