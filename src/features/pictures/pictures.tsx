import { For } from "solid-js"
import { langCtrl } from "../lang-selector/lang.ctrl"

const images = [
  {
    src: '/img/gs.webp',
    alt: {
      fr: 'Une exposition interactive avec des machines de jeux vidéo',
      en: 'An interactive exhibition with video game machines'
    }
  },
  /*
  {
    src: '/img/gs2.webp',
    alt: {
      fr: 'Collection de consoles de jeux vidéo historiques',
      en: 'Collection of historical video game consoles'
    }
  },
  */
  {
    src: '/img/gs3.webp',
    alt: {
      fr: 'Une collection de consoles et d\'accessoires de jeux vidéo',
      en: 'A collection of video game consoles and accessories'
    }
  },
  {
    src: '/img/gs4.webp',
    alt: {
      fr: 'Partagez votre passion pour le jeu vidéo entre générations',
      en: 'Share your passion for video games between generations'
    }
  },
  {
    src: '/img/gs5.webp',
    alt: {
      fr: 'Découvrez les prémices du jeu vidéo',
      en: 'Discover the origins of video games'
    }
  }
]

export const Pictures = () => {
  const lang = langCtrl()

  return (
    <div class="flex flex-col gap-12 max-w-5xl mx-auto p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <For each={images}>
          {(image) => (
            <div class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 aspect-[4/3]">
              <img
                src={image.src}
                alt={image.alt[lang()]}
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p class="text-white text-sm font-medium">{image.alt[lang()]}</p>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  )
}