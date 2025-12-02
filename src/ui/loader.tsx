import { langCtrl } from "~/features/lang-selector/lang.ctrl"

const txt = {
  fr: {
    loading: 'Une fille en pixel art, vetu de vert, tape du pied d\'impatience.',
  },
  en: {
    loading: 'A pixel art girl, dressed in green, taps her foot in impatience.',
  },
}

export const Loader = () => {
  const lang = langCtrl()
  return (
    <img src="/lulu-wait.gif" alt={txt[lang() as keyof typeof txt].loading} class="w-[32px] h-[32px]" />
  )
}