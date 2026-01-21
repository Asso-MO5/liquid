import { Slots } from "~/features/slots/slots";
import { ticketStore } from "~/features/ticket/ticket.store";
import { Cal } from "~/ui/Cal/Cal";
import { A, useParams } from "@solidjs/router";
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
import { Address } from "~/features/address/address";
import { translate } from "~/utils/translate";
import { Meta, Title } from "@solidjs/meta";

const txt = {
  fr: {
    select_date: "Sélectionnez une date",
    select_slot: "Sélectionnez un créneau horaire",
    total_amount: "Montant total : ",
    select_price: "Sélectionnez vos tickets",
    total_places: "Nombre de billet : ",
    total_places_plural: "Nombre de billets : ",
    for_group: "Pour un groupe de plus de 20 personnes, veuillez nous contacter : ",
    contact: "Formulaire de contact",
    title: "Réserver un billet",
    description: "Réservez un billet pour visiter le musée du jeu vidéo",
    keywords: "billet, musée, jeu vidéo, jeux, jeux vidéo, console, consoles, consoles de jeu vidéo, consoles de jeu vidéo portables, arcade, bornes d'arcade, ordinateur, ordinateurs, informatique, exposition, histoire, histoire du jeu vidéo",
    donation: "Soutenir le musée",
    personal_infos: "Informations personnelles",
    terms_and_conditions: "J'accepte les conditions d'utilisation",
    terms_and_conditions_link: "Conditions générales de vente",
  },
  en: {
    select_date: "Select a date",
    select_slot: "Select a time slot",
    total_amount: "Total amount: ",
    select_price: "Select your tickets",
    total_places: "Total ticket: ",
    total_places_plural: "Total tickets: ",
    for_group: "For a group of more than 20 people, please contact us:",
    contact: "Contact form",
    title: "Book a ticket",
    description: "Book a ticket to visit the video game museum",
    keywords: "ticket, museum, video game, games, video games, console, consoles, video game consoles, portable video game consoles, arcade, arcade machines, computer, computers, information, history, video game history",
    donation: "Support the museum",
    personal_infos: "Personal informations",
    terms_and_conditions: "I accept the terms of use",
    terms_and_conditions_link: "Terms of service",
  }
}



export default function Ticket() {
  const { t } = translate(txt)
  const params = useParams()
  const lang = () => params.lang as keyof typeof LANGS
  const slotsCtrl = slotsCTRL();
  const paymentCtrl = paymentCTRL();

  return (
    <>
      <Title>{t().title}</Title>
      <Meta name="description" content={t().description} />
      <Meta name="keywords" content={t().keywords} />
      <main
        id="main"
        class="items-center justify-center relative overflow-y-auto flex flex-col gap-6 p-6 text-text"
      >
        <div id="step-1">
          <h3 class="text-center">{t().select_date}</h3>
          <Cal onDayClick={slotsCtrl.onDayClick} selectedDate={ticketStore.reservation_date} />
        </div>

        <div id="step-2">
          <h3 class="text-center" id="select-slot-title">{t().select_slot}</h3>
          <Slots
            isFetching={slotsCtrl.isFetching()}
            slots={slotsCtrl.slots()}
            onSlotClick={slotsCtrl.onSlotClick}
            currentSlot={ticketStore.slot_start_time}
            labelId="select-slot-title"
          />
        </div>
        <div id="step-3" class="mx-auto">
          <h3 class="text-center" id="select-price-title">{t().select_price}</h3>
          <p class="text-center text-sm text-text italic">
            {t().for_group}
            <A class="pl-2" href={`/${lang() as string}/contact`}>{t().contact}</A>
          </p>
          <Prices labelId="select-price-title" />
          <div class="mt-6">
            <h3 class="text-center" id="select-donation-title">{t().donation}</h3>
            <Donation labelId="select-donation-title" />
          </div>
        </div>
        <div id="step-4" class="max-w-sm mx-auto lg:self-start">
          <h3 class="text-center">
            {t().personal_infos}
          </h3>
          <PersonalInfos />
          <GiftCodes />
          <TicketResume />
          <div class="m-4 flex flex-col gap-4">
            <div class="grid grid-cols-[auto_1fr] items-center gap-2">
              <input type="checkbox"
                class="bg-white/10 checked:bg-primary"
                id="terms_and_conditions" checked={paymentCtrl.IHaveReadTheTermsAndConditions()} onChange={() => paymentCtrl.setIHaveReadTheTermsAndConditions(!paymentCtrl.IHaveReadTheTermsAndConditions())} />
              <label for="terms_and_conditions">{t().terms_and_conditions}</label>
            </div>

            <a href={`/${lang() as string}/cgv`} target="_blank" rel="noopener noreferrer" class="text-center text-sm text-primary hover:text-primary inline-flex items-center gap-1 justify-center">
              {t().terms_and_conditions_link}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
          <PaymentBtn disabled={paymentCtrl.paymentButtonDisabled()} isLoading={paymentCtrl.isLoading()} onPayment={paymentCtrl.preparePayment} />
          <Show when={paymentCtrl.paymentButtonDisabled() && paymentCtrl.paymentButtonErrorMessage()}>
            <p class="text-error text-sm mt-2 text-center">
              {paymentCtrl.paymentButtonErrorMessage()?.[lang() as 'fr' | 'en']}
            </p>
          </Show>
        </div>
        <Address />
      </main>
    </>
  )
}