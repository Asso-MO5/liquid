import { useParams } from "@solidjs/router";

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
  const params = useParams();
  const lang = () => params.lang as keyof typeof errorTxt;


  return (
    <div class="flex flex-col gap-2 items-center justify-center">
      <h1 class="text-2xl font-bold">{errorTxt[lang()].title}</h1>
      <p class="text-lg text-white">{errorTxt[lang()].description}</p>
    </div>
  )
}