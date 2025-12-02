import { langCtrl } from "../lang-selector/lang.ctrl"

const txt = {
  fr: {
    alt: 'Logo de l\'association MO5',
    speach: 'Après plus de vingt ans de préservation, de restauration et de transmission du patrimoine vidéoludique, l’association MO5 franchit une étape historique : la première phase de l’ouverture du Musée du Jeu Vidéo. Ce lieu, unique en France, sera entièrement consacré à l’histoire, à la culture et à la mémoire du jeu vidéo, de ses créateurs et de son influence sur la société contemporaine.',
    discoverAssociation: 'Découvrez l\'association MO5',
  },
  en: {
    alt: 'Logo of the MO5 association',
    speach: 'After more than twenty years of preservation, restoration and transmission of the video game heritage, the MO5 association takes a historic step: the first phase of the opening of the Video Game Museum. This place, unique in France, will be entirely dedicated to the history, culture and memory of video games, its creators and its influence on contemporary society.',
    discoverAssociation: 'Discover the MO5 association',
  }
}
export const Asso = () => {
  const lang = langCtrl();
  return (
    <div class="flex flex-col gap-5 max-w-2xl mx-auto">
      <div class="flex flex-col md:flex-row gap-5 h-full justify-center items-center ">
        <img src="/logo_blue.webp" alt={txt[lang() as keyof typeof txt].alt}
          loading="lazy"
          width={100}
          height={87}
          class="w-[87px] md:w-[100px] h-auto" />
        <p class="text-text h-full justify-center items-center flex m-0">{txt[lang() as keyof typeof txt].speach}</p>

      </div>
      <div class="flex justify-center items-center">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://mo5.com/"
          class="btn ">{txt[lang() as keyof typeof txt].discoverAssociation}</a>
      </div>
    </div>
  )
}