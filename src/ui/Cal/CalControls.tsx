import { calCTRL } from "./Cal.ctrl"
import { Chevron } from "../Chevron/Chevron"

export const CalControls = () => {
  const calendar = calCTRL()

  return (
    <div class="flex items-center gap-2 text-text">
      <button
        onClick={calendar.goToPrevious}
        class="headless"
        title="Mois précédent"
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
        title="Mois suivant"
        disabled={calendar.canGoToNext()}
      >
        <Chevron direction="right" size={40} />
      </button>
    </div>
  )
}