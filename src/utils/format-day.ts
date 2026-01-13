import { DAYS_TEXT } from "~/ui/Cal/Cal.const"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"

export const formatDay = (date: Date): string => {
  const lang = langCtrl()
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Adjust for Sunday being 0
  return DAYS_TEXT[lang()][dayIndex]
}
