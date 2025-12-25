import { For } from "solid-js"
import { translate } from "~/utils/translate"

const images = [
  {
    src: '/img/musee.webp',
    alt: {
      fr: 'Une exposition interactive avec des machines de jeux vidéo',
      en: 'An interactive exhibition with video game machines'
    }
  },
  {
    src: '/img/musee2.webp',
    alt: {
      fr: 'Ateliers de médiation et conférences pour apprendre et découvrir',
      en: 'Mediation workshops and conferences to learn and discover'
    }
  },
  {
    src: '/img/musee3.webp',
    alt: {
      fr: 'Partagez votre passion pour le jeu vidéo entre générations',
      en: 'Share your passion for video games between generations'
    }
  },
  {
    src: '/img/musee4.webp',
    alt: {
      fr: 'Découvrez les consoles et jeux vidéo historiques',
      en: 'Discover historical video game consoles and games'
    }
  }
]

export const Pictures = () => {
  return (
    <div class="flex flex-col gap-12 max-w-5xl mx-auto p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <For each={images}>
          {(image) => {
            const { t } = translate({ fr: { alt: image.alt.fr }, en: { alt: image.alt.en } })
            return (
              <div class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 aspect-[4/3]">
                <img
                  src={image.src}
                  alt={t.alt}
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p class="text-white text-sm font-medium">{t.alt}</p>
                </div>
              </div>
            )
          }}
        </For>
      </div>
    </div>
  )
}