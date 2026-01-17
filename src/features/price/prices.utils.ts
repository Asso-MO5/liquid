import { langCtrl } from "~/features/lang-selector/lang.ctrl"

export const formatPriceObj = (value: number | string, currency = '€'): {
  value: string,
  currency: string
} => {
  const lang = langCtrl()

  const formattedValue = value.toString()

  if (lang() === 'fr') {
    return {value: formattedValue.replace('.', ','), currency: ` ${currency}`}
  }
  
  return {value: formattedValue, currency: currency}
}

export const formatPrice = (value: number | string, currency = '€'): string => {
  const lang = langCtrl()

  const formattedValue = value.toString()

  if (lang() === 'fr') {
    return `${formattedValue.replace('.', ',')} ${currency}`
  }
  
  return `${currency}${formattedValue}`
}