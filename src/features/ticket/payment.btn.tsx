import { translate } from "~/utils/translate"
import { txt } from "./payment.btn.txt"

type PaymentBtnProps = {
  disabled: boolean
  isLoading: boolean
  onPayment: () => void
}

export const PaymentBtn = (props: PaymentBtnProps) => {
  const { t } = translate(txt)

  return (
    <button
      disabled={props.disabled || props.isLoading}
      data-loading={props.isLoading}
      type="button"
      aria-busy={props.isLoading}
      class="btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed w-full"
      onClick={() => props.onPayment()}>
      {t.proceed_to_payment}
    </button>
  )
}