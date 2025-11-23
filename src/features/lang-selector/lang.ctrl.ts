import { useParams } from "@solidjs/router"

export const langCtrl = () => {
  const params = useParams()
  const _lang = () => params?.lang as 'fr' | 'en'

  const lang = () => !_lang?.()?.match?.(/fr|en/) ? 'fr' : _lang()
  return lang
}