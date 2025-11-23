import { useParams, useSearchParams } from "@solidjs/router"
import { For, onMount } from "solid-js"
import { clientEnv } from "~/env/client"
import { setTicketStore } from "~/features/ticket/ticket.store"

const thanksTxt = {
  fr: {
    ticket: 'Vos billets',
    title: 'Merci pour votre réservation',
    description: 'Votre réservation a été effectuée avec succès. Vous recevrez un email de confirmation dans les prochaines minutes.',
    place: 'place',
  },
  en: {
    ticket: 'Your tickets',
    title: 'Thank you for your reservation',
    description: 'Your reservation has been successfully completed. You will receive a confirmation email in the next few minutes.',
    place: 'place',
  }
}

export default function Thanks() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const qr = searchParams.qr as string
  const lang = () => params.lang as keyof typeof thanksTxt


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
      <p class="text-lg text-white text-center">{thanksTxt[lang()].description}</p>
      <h2 class="text-xl font-bold">{thanksTxt[lang()].ticket}</h2>
      <div class="text-white flex flex-col gap-2">
        <For each={qr.split(',')}>
          {(qr, index) => <a
            class="text-white hover:text-primary border hover:border-primary border-white rounded-md p-2"
            href={`${clientEnv.VITE_API_URL}/tickets/${qr}`} target="_blank">{searchParams.email || thanksTxt[lang()].place} {index() + 1}</a>}
        </For>
      </div>
    </div>
  )
}