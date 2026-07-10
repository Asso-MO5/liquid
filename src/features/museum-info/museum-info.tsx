import { translate } from "~/utils/translate"
import { museumInfoTxt } from "./museum-info.txt"

export const MuseumInfo = () => {
  const { t } = translate(museumInfoTxt)

  return (
    <div class="flex flex-col gap-2 max-w-4xl mx-auto">
      <h2 class="text-4xl font-bold text-center">
        {t().title}
      </h2>
      <p class="m-0">{t().greeting}</p>
      <p class="m-0">
        {t().intro1}
        <br />
        {t().intro2}
      </p>
      <p class="m-0">
        {t().transition1}
        <br />
        {t().transition2}
      </p>
      <p class="m-0">{t().activitiesLabel}</p>
      <ul class="list-disc m-4 mt-0">
        <li>{t().activities1}</li>
        <li>{t().activities2}</li>
        <li>{t().activities3}</li>
      </ul>
      <p class="m-0">{t().thanks}</p>
      <p>{t().team}</p>
    </div>
  )
}
