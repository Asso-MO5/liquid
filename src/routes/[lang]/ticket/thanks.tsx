import { langCtrl } from "~/features/lang-selector/lang.ctrl"

const thanksTxt = {
  fr: {
    title: 'Merci pour votre réservation',
    description: 'Votre réservation a été effectuée avec succès. Vous recevrez un email de confirmation dans les prochaines minutes.',
    place: 'place',
    continueSupport: 'Continuer à soutenir le musée en adhérant à l\'association MO5',
    joinMo5: 'Adhérez à l\'association MO5',
  },
  en: {
    title: 'Thank you for your reservation',
    description: 'Your reservation has been successfully completed. You will receive a confirmation email in the next few minutes.',
    place: 'place',
    continueSupport: 'Continue supporting the museum by joining the MO5 association',
    joinMo5: 'Join the MO5 association',
  }
}

export default function Thanks() {
  const lang = langCtrl()

  return (
    <div class="flex flex-col gap-2 items-center justify-center max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-center">{thanksTxt[lang()].title}</h1>
      <p class="text-lg text-text text-center">{thanksTxt[lang()].description}</p>
      <div class="flex flex-col gap-2 items-center justify-center mt-8 border border-secondary rounded-md p-4">
        <p class="text-text text-center text-lg">{thanksTxt[lang()].continueSupport}</p>
        <a href={`https://don.mo5.com`} target="_blank"
          data-theme="secondary"
          class="btn text-white text-lg">{thanksTxt[lang()].joinMo5}
        </a>
      </div>
    </div>
  )
}