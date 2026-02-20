import { For } from "solid-js"
import { translate } from "~/utils/translate"

const images = [
  {
    src: '/img/musee.webp',
    alt: {
      fr: 'Plusieurs personnes jouent à Mario Kart, assises sur des canapés.',
      en: 'Several people are sitting on sofas playing Mario Kart.'
    },
    text: {
      fr: 'Une exposition interactive avec des machines de jeux vidéo',
      en: 'An interactive exhibition with video game machines'
    }
  },
  {
    src: '/img/musee2.webp',
    alt: {
      fr: 'Un conférencier debout devant un public assis en face d\'un grand écran.',
      en: 'A speaker stands by a large screen in front of a seated audience.'
    },
    text: {
      fr: 'Ateliers de médiation et conférences pour apprendre et découvrir',
      en: 'Mediation workshops and conferences to learn and discover'
    }
  },
  {
    src: '/img/musee3.webp',
    alt: {
      fr: 'Les visiteurs jouent aux machines et consultent les panneaux et publicités.',
      en: 'Visitors play on various consoles and consult panels and advertisements.'
    },
    text: {
      fr: 'Partagez votre passion pour le jeu vidéo entre générations',
      en: 'Share your passion for video games between generations'
    }
  },
  {
    src: '/img/musee4.webp',
    alt: {
      fr: 'Deux garçons jouent à la première console Xbox sur un kiosque dédié.',
      en: 'Two young boys are playing on the first Xbox console on a dedicated kiosk.'
    },
    text: {
      fr: 'Découvrez les consoles et jeux vidéo historiques',
      en: 'Discover historical video game consoles and games'
    }
  }
]

export const Pictures = () => {
  return (
    <div class="flex flex-col gap-12 max-w-5xl mx-auto p-6">
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <For each={images}>
          {(image) => {
            const { t } = translate({ fr: { text: image.text.fr, alt: image.alt.fr }, en: { text: image.text.en, alt: image.alt.en } })
            return (
              <li
                tabIndex={0} // Make the list item focusable so that the text seen on hover effect can be triggered with keyboard navigation
                class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 aspect-[4/3]"
              >
                <img
                  src={image.src}
                  alt={t().alt}
                  class="w-full h-full object-cover transition-transform duration-300 group-focus:scale-110 group-hover:scale-110"
                  loading="lazy"
                />
                <p class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:opacity-0 group-focus:opacity-100 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 text-white text-sm font-medium m-0">{t().text}</p>
              </li>
            )
          }}
        </For>
      </ul>
    </div>
  )
}