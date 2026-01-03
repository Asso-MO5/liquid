import { useParams } from "@solidjs/router"

export const langCtrl = () => {
  const params = useParams()
  const _lang = () => params?.lang as 'fr' | 'en'
  const lang = () => !['fr', 'en'].includes(_lang?.()) ? 'fr' : _lang()

  return lang
}