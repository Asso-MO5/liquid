import { translate } from '~/utils/translate'
import { museumInfoTxt } from './museum-info.txt'

export const MuseumInfo = () => {
  const { t } = translate(museumInfoTxt)

  return (
    <div class="flex flex-col gap-2">
      <p class="m-0">{t().greeting}</p>
      <p class="m-0">{t().intro}</p>
      <p class="m-0">{t().transition}</p>
      <p class="m-0">{t().activitiesLabel}</p>
      <p class="m-0">{t().activities}</p>
      <p class="m-0">{t().thanks}</p>
      <p class="m-0">{t().team}</p>
    </div>
  )
}
