import { Slots } from "~/features/slots/slots";
import { ticketStore } from "~/features/ticket/ticket.store";
import { Cal } from "~/ui/Cal/Cal";
import { A, useParams } from "@solidjs/router";
import { ticketTxt } from "~/features/ticket/ticket.txt";
import { PersonalInfos } from "~/features/ticket/personal-infos";
import { Prices } from "~/features/price/prices";
import { Donation } from "~/features/ticket/donation";
import { paymentCTRL } from "~/features/ticket/payment.ctrl";
import type { LANGS } from "~/features/lang-selector/lang-selector.const";
import { slotsCTRL } from "~/features/slots/slots.ctrl";
import { PaymentBtn } from "~/features/ticket/payment.btn";
import { GiftCodes } from "~/features/gift-codes/gift-codes";
import { TicketResume } from "~/features/ticket/ticket-resume";
import { Show } from "solid-js";

const txt = {
  fr: {
    select_date: "Sélectionnez une date",
    select_slot: "Sélectionnez un créneau horaire",
    total_amount: "Montant total: ",
    select_price: "Sélectionnez vos tickets",
    total_places: "Nombre de billet: ",
    total_places_plural: "Nombre de billets: ",
    for_group: "Pour un groupe de plus de 10 personnes, veuillez nous contacter: ",
    contact: "Formulaire de contact",
  },
  en: {
    select_date: "Select a date",
    select_slot: "Select a time slot",
    total_amount: "Total amount: ",
    select_price: "Select your tickets",
    total_places: "Total ticket: ",
    total_places_plural: "Total tickets: ",
    for_group: "For a group of more than 10 people, please contact us:",
    contact: "Contact form",
  }
}

export default function Ticket() {
  const lang = () => params.lang as keyof typeof LANGS
  const slotsCtrl = slotsCTRL();
  const params = useParams()
  const paymentCtrl = paymentCTRL();

  return (
    <main
      id="ticket"
      class="items-center justify-center relative overflow-y-auto flex flex-col gap-6 p-6 text-text"
    >
      <div id="step-1">
        <h3 class="text-center">{txt[lang() as keyof typeof txt].select_date}</h3>
        <Cal onDayClick={slotsCtrl.onDayClick} selectedDate={ticketStore.reservation_date} />
      </div>

      <div id="step-2">
        <h3 class="text-center">{txt[lang() as keyof typeof txt].select_slot}</h3>
        <Slots
          isFetching={slotsCtrl.isFetching()}
          slots={slotsCtrl.slots()}
          onSlotClick={slotsCtrl.onSlotClick}
          currentSlot={ticketStore.slot_start_time}
        />
      </div>
      <div id="step-3" class="mx-auto">
        <h3 class="text-center">{txt[lang() as keyof typeof txt].select_price}</h3>
        <p class="text-center text-sm text-text italic">
          {txt[lang() as keyof typeof txt].for_group}
          <A class="pl-2" href={`/${lang() as string}/contact`}>{txt[lang() as keyof typeof txt].contact}</A>
        </p>
        <Prices />
        <div class="mt-6">
          <h3 class="text-center">{ticketTxt.donation[lang() as keyof typeof ticketTxt.donation]}</h3>
          <Donation />
        </div>
      </div>
      <div id="step-4" class="max-w-sm mx-auto lg:self-start">
        <h3 class="text-center">
          {ticketTxt.personal_infos[lang() as keyof typeof ticketTxt.personal_infos]}
        </h3>
        <PersonalInfos />
        <GiftCodes />
        <TicketResume />
        <PaymentBtn disabled={paymentCtrl.paymentButtonDisabled()} isLoading={paymentCtrl.isLoading()} onPayment={paymentCtrl.preparePayment} />
        <Show when={paymentCtrl.paymentButtonDisabled() && paymentCtrl.paymentButtonErrorMessage()}>
          <p class="text-error text-sm mt-2 text-center">
            {paymentCtrl.paymentButtonErrorMessage()?.[lang() as 'fr' | 'en']}
          </p>
        </Show>
      </div>
    </main >
  )
}