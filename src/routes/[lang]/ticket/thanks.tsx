import { useParams } from "@solidjs/router"

const thanksTxt = {
  fr: {
    title: 'Merci pour votre réservation',
    description: 'Votre réservation a été effectuée avec succès. Vous recevrez un email de confirmation dans les prochaines minutes.',
  },
  en: {
    title: 'Thank you for your reservation',
    description: 'Your reservation has been successfully completed. You will receive a confirmation email in the next few minutes.',
  }
}

export default function Thanks() {
  const params = useParams()
  const lang = () => params.lang as keyof typeof thanksTxt

  return (
    <div class="flex flex-col gap-2 items-center justify-center">
      <h1 class="text-2xl font-bold">{thanksTxt[lang()].title}</h1>
      <p class="text-lg text-white">{thanksTxt[lang()].description}</p>
    </div>
  )
}