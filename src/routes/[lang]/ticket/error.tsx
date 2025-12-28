import { setTicketStore } from "~/features/ticket/ticket.store";
import { onMount } from "solid-js";
import { translate } from "~/utils/translate";

const errorTxt = {
  fr: {
    title: 'Erreur',
    description: 'Une erreur est survenue lors de la réservation.',
  },
  en: {
    title: 'Error',
    description: 'An error occurred during the reservation.',
  }
}

export default function Error() {
  const { t } = translate(errorTxt);

  onMount(() => {
    // vider le store
    setTicketStore('reservation_date', '');
    setTicketStore('slot_start_time', '');
    setTicketStore('slot_end_time', '');
    setTicketStore('tickets', []);
    setTicketStore('donation_amount', 3);
  });

  return (
    <div class="flex flex-col gap-2 items-center justify-center">
      <h1 class="text-2xl font-bold">{t.title}</h1>
      <p class="text-lg text-white">{t.description}</p>
    </div>
  )
}