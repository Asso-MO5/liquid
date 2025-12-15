import { langCtrl } from "~/features/lang-selector/lang.ctrl"

type PaymentBtnProps = {
  disabled: boolean
  isLoading: boolean
  onPayment: () => void
}

const txt = {
  fr: {
    proceed_to_payment: "Valider la réservation",
  },
  en: {
    proceed_to_payment: "Validate the reservation",
  }
}

export const PaymentBtn = (props: PaymentBtnProps) => {
  const lang = langCtrl()

  return (
    <button
      disabled={props.disabled || props.isLoading}
      data-loading={props.isLoading}
      type="button"
      aria-busy={props.isLoading}
      class="btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      onClick={() => props.onPayment()}>
      {txt[lang() as keyof typeof txt].proceed_to_payment}
    </button>
  )
}