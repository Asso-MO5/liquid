import { langCtrl } from "../lang-selector/lang.ctrl"

const txt = {
  fr: {
    powerBy: 'Créé par',
    logoAlt: 'Logo de l\'association MO5',
  },
  en: {
    powerBy: 'Created by',
    logoAlt: 'Logo of the MO5 association',
  },
}

export const PowerBy = () => {

  const lang = langCtrl()
  return (
    <div class="flex flex-col gap-2 justify-center items-center">
      <p class="text-sm text-text/70 m-0">{txt[lang() as keyof typeof txt].powerBy}</p>
      <a href="https://mo5.com/" target="_blank" rel="noopener noreferrer">
        <img src="/logo.webp"
          width={194}
          height={60}
          alt={txt[lang() as keyof typeof txt].logoAlt}
          class="w-[194px] h-auto" />
      </a>
    </div>
  )
}