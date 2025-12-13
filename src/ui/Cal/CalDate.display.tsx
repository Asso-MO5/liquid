import { calCTRL } from "./Cal.ctrl"

export const CalDateDisplay = () => {
  const calendar = calCTRL()

  return (
    <div class="text-xl font-semibold">
      {calendar.currentMonthName()} {calendar.currentYear()}
    </div>
  )
}