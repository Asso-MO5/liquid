import { calCTRL } from "./Cal.ctrl"
import { Chevron } from "../Chevron/Chevron"
import { CONTROLS_TEXT } from "./Cal.const"
import { translate } from "~/utils/translate"

export const CalControls = () => {
  const calendar = calCTRL()
  const { t } = translate(CONTROLS_TEXT)

  return (
    <div class="flex items-center gap-2 text-text">
      <button
        onClick={calendar.goToPrevious}
        class="headless"
        title={t().previous_month}
        disabled={calendar.canGoToPrevious()}
      >
        <Chevron direction="left" size={40} />
      </button>

      <div class="first-letter:uppercase" id="selected-month" aria-live="polite" aria-atomic="true">
        {calendar.currentMonthName()} {calendar.currentYear()}
      </div>

      <button
        onClick={calendar.goToNext}
        class="headless"
        title={t().next_month}
        disabled={calendar.canGoToNext()}
      >
        <Chevron direction="right" size={40} />
      </button>
    </div>
  )
}