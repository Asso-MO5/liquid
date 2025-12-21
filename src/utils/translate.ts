import { langCtrl } from "~/features/lang-selector/lang.ctrl"

export const translate = (translations: {
  fr: Record<string, string>,
  en: Record<string, string>,
}) => {
  const lang = langCtrl()
  return { t: translations?.[lang() as keyof typeof translations] || translations?.fr }
}