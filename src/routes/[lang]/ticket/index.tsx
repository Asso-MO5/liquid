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

export default function Ticket() {
  const ticketCtrl = TicketCtrl();
  const params = useParams()
  const payment = paymentCtrl();
  const lang = () => params.lang as keyof typeof LANGS

  return (
    <main
      id="ticket"
      class="items-center justify-center relative overflow-y-auto flex flex-col lg:grid lg:grid-cols-2 gap-4 p-6 text-white"
    >
      <div id="step-1">
        <Cal onDayClick={ticketCtrl.onDayClick} selectedDate={ticketStore.reservation_date} />
      </div>
      <Show when={ticketStore.reservation_date && ticketCtrl.slots()}>
        <div id="step-2">
          <h3 class="text-center font-bold">{ticketTxt.available_slots[lang() as keyof typeof ticketTxt.available_slots]}</h3>
          <Slots
            isFetching={ticketCtrl.isFetching()}
            slots={ticketCtrl.slots()}
            onSlotClick={ticketCtrl.onSlotClick}
            currentSlot={ticketStore.slot_start_time}
          />
        </div>
        <div id="step-3" class="mx-auto">
          <h3 class="text-center font-bold">{ticketTxt.prices[lang() as keyof typeof ticketTxt.prices]}</h3>
          <Prices />
          <Show when={ticketStore.tickets.length > 0}>
            <div class="mt-4">
              <h3 class="text-center font-bold">{ticketTxt.donation[lang() as keyof typeof ticketTxt.donation]}</h3>
              <Donation />
            </div>
          </Show>
        </div>
        <div id="step-4" class="max-w-sm mx-auto lg:self-start">
          <Show when={ticketStore.slot_start_time}>
            <h3 class="font-bold">
              {ticketTxt.personal_infos[lang() as keyof typeof ticketTxt.personal_infos]}
            </h3>
            <PersonalInfos onPayment={payment.preparePayment} isLoading={payment.isLoading()} />
          </Show>
        </div>
        <div id="step-5" class="md:col-span-2">
          <Show when={payment.checkoutId()}>
            <SumUp checkoutId={payment.checkoutId()} checkoutReference={payment.checkoutReference()} language={lang() as string} />
          </Show>
        </div>
      </Show>

    </main >
  )
}