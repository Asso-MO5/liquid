import { useSearchParams } from "@solidjs/router"
import { For, onMount } from "solid-js"
import { clientEnv } from "~/env/client"
import { setTicketStore } from "~/features/ticket/ticket.store"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"

const thanksTxt = {
  fr: {
    ticket: 'Vos billets',
    title: 'Merci pour votre réservation',
    description: 'Votre réservation a été effectuée avec succès. Vous recevrez un email de confirmation dans les prochaines minutes.',
    place: 'place',
    continueSupport: 'Continuer à soutenir le musée en adhérant à l\'association MO5',
    joinMo5: 'Adhérez à l\'association MO5',
  },
  en: {
    ticket: 'Your tickets',
    title: 'Thank you for your reservation',
    description: 'Your reservation has been successfully completed. You will receive a confirmation email in the next few minutes.',
    place: 'place',
    continueSupport: 'Continue supporting the museum by joining the MO5 association',
    joinMo5: 'Join the MO5 association',
  }
}

export default function Thanks() {
  const [searchParams] = useSearchParams()
  const qr = searchParams.qr as string
  const lang = langCtrl()


  onMount(() => {
    // vider le store
    setTicketStore('reservation_date', '');
    setTicketStore('slot_start_time', '');
    setTicketStore('slot_end_time', '');
    setTicketStore('tickets', []);
    setTicketStore('donation_amount', 3);
  });
  return (
    <div class="flex flex-col gap-2 items-center justify-center max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-center">{thanksTxt[lang()].title}</h1>
      <p class="text-lg text-text text-center">{thanksTxt[lang()].description}</p>
      <h2 class="text-xl font-bold">{thanksTxt[lang()].ticket}</h2>
      <div class="text-text flex flex-col gap-2">
        <For each={qr.split(',')}>
          {(qr, index) => <a
            class="text-text hover:text-primary border hover:border-primary border-text rounded-md p-2"
            href={`${clientEnv.VITE_API_URL}/tickets/${qr}`} target="_blank">{searchParams.email || thanksTxt[lang()].place} {index() + 1}</a>}
        </For>
      </div>
      <div class="flex flex-col gap-2 items-center justify-center mt-8 border border-secondary rounded-md p-4">
        <p class="text-text text-center text-lg">{thanksTxt[lang()].continueSupport}</p>

        <a href={`https://don.mo5.com`} target="_blank"
          data-theme="secondary"
          class="btn text-white text-lg">{thanksTxt[lang()].joinMo5}</a>
      </div>
    </div>
  )
}