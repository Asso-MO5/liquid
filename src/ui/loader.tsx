import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { translate } from "~/utils/translate"

const txt = {
  fr: {
    loading: 'Une fille en pixel art, vetu de vert, tape du pied d\'impatience.',
  },
  en: {
    loading: 'A pixel art girl, dressed in green, taps her foot in impatience.',
  },
}

export const Loader = () => {
  const { t } = translate(txt)
  return (
    <img src="/lulu-wait.gif" alt={t().loading} class="w-[32px] h-[32px]" />
  )
}