import { langCtrl } from "../lang-selector/lang.ctrl"

const txt = {
  fr: {
    powerBy: 'Créé par',
    logoAlt: 'Association MO5',
  },
  en: {
    powerBy: 'Created by',
    logoAlt: 'MO5 association',
  },
}

export const PowerBy = () => {

  const lang = langCtrl()
  return (
    <p class="text-sm text-text/70 m-0 text-center">
      {txt[lang() as keyof typeof txt].powerBy}
      <a href="https://mo5.com/" target="_blank" rel="noopener noreferrer">
        <img src="/logo.webp"
          width={194}
          height={60}
          alt={txt[lang() as keyof typeof txt].logoAlt}
          class="w-[194px] h-auto" />
      </a>
    </p>
  )
}