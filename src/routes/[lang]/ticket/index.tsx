import { Show } from "solid-js";
import { Slots } from "~/features/ticket/slots";
import { TicketCtrl } from "~/features/ticket/ticket.ctrl";
import { ticketStore } from "~/features/ticket/ticket.store";
import { Cal } from "~/ui/Cal";
import { useParams } from "@solidjs/router";
import { ticketTxt } from "~/features/ticket/ticket.txt";
import { PersonalInfos } from "~/features/ticket/personal-infos";
import { Prices } from "~/features/price/prices";
import { Donation } from "~/features/ticket/donation";
import { paymentCtrl } from "~/features/ticket/payment.ctrl";
import { SumUp } from "~/features/sumup/sumup";
import type { LANGS } from "~/features/lang-selector/lang-selector.const";
import { GuidedTourPrice } from "~/features/ticket/guided-tour-price";

const txt = {
  fr: {
    total_amount: "Montant total: ",
    total_places: "Nombre de billet: ",
    total_places_plural: "Nombre de billets: ",
  },
  en: {
    total_amount: "Total amount: ",
    total_places: "Total ticket: ",
    total_places_plural: "Total tickets: ",
  }
}

export default function Ticket() {
  const ticketCtrl = TicketCtrl();
  const params = useParams()
  const payment = paymentCtrl();
  const lang = () => params.lang as keyof typeof LANGS

  return (
    <main
      id="ticket"
      class="items-center justify-center relative overflow-y-auto flex flex-col gap-4 p-6 text-text"
    >
      <div id="step-1">
        <Cal onDayClick={ticketCtrl.onDayClick} selectedDate={ticketStore.reservation_date} />
      </div>
      <Show when={ticketStore.reservation_date && ticketCtrl.slots()?.length > 0}>
        <div id="step-2">
          <h3 class="text-center">{ticketTxt.available_slots[lang() as keyof typeof ticketTxt.available_slots]}</h3>
          <Slots
            isFetching={ticketCtrl.isFetching()}
            slots={ticketCtrl.slots()}
            onSlotClick={ticketCtrl.onSlotClick}
            currentSlot={ticketStore.slot_start_time}
          />
        </div>
        <div id="step-3" class="mx-auto">
          <h3 class="text-center">{ticketTxt.prices[lang() as keyof typeof ticketTxt.prices]}</h3>
          <Prices />
          <GuidedTourPrice />
          <Show when={ticketStore.tickets.length > 0}>
            <div class="mt-4">
              <h3 class="text-center">{ticketTxt.donation[lang() as keyof typeof ticketTxt.donation]}</h3>
              <Donation />
            </div>
          </Show>
        </div>
        <div id="step-4" class="max-w-sm mx-auto lg:self-start">
          <Show when={ticketStore.slot_start_time}>
            <h3 class="text-center">
              {ticketTxt.personal_infos[lang() as keyof typeof ticketTxt.personal_infos]}
            </h3>
            <PersonalInfos onPayment={payment.preparePayment} isLoading={payment.isLoading()} />
          </Show>
        </div>
        <div id="step-5" class="md:col-span-2">
          <Show when={payment.checkoutId()}>
            <div class="flex flex-col gap-2 items-center justify-center mt-2">
              {ticketStore.tickets.length > 1 ? txt[lang() as keyof typeof txt].total_places_plural : txt[lang() as keyof typeof txt].total_places} {ticketStore.tickets.length}
            </div>
            <SumUp checkoutId={payment.checkoutId()} checkoutReference={payment.checkoutReference()} language={lang() as string} />
          </Show>
        </div>
      </Show>

    </main >
  )
}