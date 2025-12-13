import { For, Show } from "solid-js"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { ticketStore } from "~/features/ticket/ticket.store"
import { ticketResumeCTRL } from "~/features/ticket/ticket-resume.ctrl"

const txt = {
  fr: {
    resume: "Résumé de la réservation",
    date: "Date",
    slot: "Créneau",
    tickets: "Billets",
    donation: "Don",
    total: "Total",
    free: "Gratuit",
  },
  en: {
    resume: "Reservation summary",
    date: "Date",
    slot: "Time slot",
    tickets: "Tickets",
    donation: "Donation",
    total: "Total",
    free: "Free",
  }
}

export const TicketResume = () => {
  const lang = langCtrl()
  const ctrl = ticketResumeCTRL()

  return (
    <div class="flex flex-col gap-4 my-6 p-4 b">
      <h3 class="text-center text-xl">{txt[lang() as keyof typeof txt].resume}</h3>

      <Show when={ticketStore.reservation_date}>
        <div class="flex flex-col gap-1">
          <span class="font-bold text-primary">{txt[lang() as keyof typeof txt].date}:</span>
          <span>{ctrl.formatDate(ticketStore.reservation_date, lang() as string)}</span>
        </div>
      </Show>

      <Show when={ticketStore.slot_start_time && ticketStore.slot_end_time}>
        <div class="flex flex-col gap-1">
          <span class="font-bold text-primary">{txt[lang() as keyof typeof txt].slot}:</span>
          <span>{ctrl.formatTime(ticketStore.slot_start_time)} - {ctrl.formatTime(ticketStore.slot_end_time)}</span>
        </div>
      </Show>

      <Show when={ticketStore.tickets.length > 0}>
        <div class="flex flex-col gap-2">
          <span class="font-bold text-primary">{txt[lang() as keyof typeof txt].tickets}:</span>
          <div class="flex flex-col gap-1 pl-2">
            <For each={ctrl.getUniqueTickets()}>
              {(ticket) => {
                const quantity = ctrl.getTicketCount(ticket.id);
                const price = ctrl.getTicketPrice(ticket);
                const totalPrice = price * quantity;
                return (
                  <div class="flex justify-between items-center">
                    <span>
                      {ticket.translations[lang() as keyof typeof ticket.translations]?.name || ''}
                      {quantity > 1 && ` x${quantity}`}
                    </span>
                    <span class="font-semibold">
                      {price === 0 ? txt[lang() as keyof typeof txt].free : `${totalPrice}€`}
                    </span>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </Show>

      <Show when={ticketStore.donation_amount > 0}>
        <div class="flex justify-between items-center">
          <span class="font-bold text-primary">{txt[lang() as keyof typeof txt].donation}:</span>
          <span class="font-semibold">{ticketStore.donation_amount}€</span>
        </div>
      </Show>

      <div class="flex justify-between items-center pt-2 border-t border-primary">
        <span class="font-bold text-lg">{txt[lang() as keyof typeof txt].total}:</span>
        <span class="font-bold text-lg text-secondary">{ctrl.calculateTotal()}€</span>
      </div>
    </div>
  )
}