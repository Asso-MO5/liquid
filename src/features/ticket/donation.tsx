import { For, Show } from 'solid-js'
import { langCtrl } from "../lang-selector/lang.ctrl"
import { donationCtrl } from './donation.ctrl'
import { ticketStore } from './ticket.store'
import { formatPriceObj } from "~/features/price/prices.utils"
import { translate } from '~/utils/translate'

const txt = {
  fr: {
    donationInfoTax: "Les dons sont déductibles à hauteur de 66% du montant versé.",
  },
  en: {
    donationInfoTax: "Donations are deductible up to 66% of the amount paid.",
  }
}

export const Donation = (props: {labelId: string}) => {
  const { t } = translate(txt)
  const lang = langCtrl()
  const donations = donationCtrl()

  return (
    <>
      <ol
        role="list"
        class="grid grid-cols-3 gap-2"aria-labelledby={props.labelId}
      >
        <For each={donations.donations}>
          {(donation) => (
            <li>
              <button
                data-selected={donation === ticketStore.donation_amount}
                class="
                  w-full border border-primary rounded-md p-2
                  bg-transparent dark:text-text text-primary
                  data-[selected=true]:bg-primary
                  dark:data-[selected=true]:text-black
                  data-[selected=true]:text-white
                "
                onClick={() => donations.setDonation(donation)}
              >
                <Show when={lang() === 'fr'}>
                  {formatPriceObj(donation).value}
                </Show>
                <span
                  data-selected={donation === ticketStore.donation_amount}
                  class="
                    dark:text-secondary  hover:text-white text-primary
                    data-[selected=true]:text-white
                    dark:data-[selected=true]:text-black
                  "
                >
                  {formatPriceObj(donation).currency}
                </span>
                <Show when={lang() !== 'fr'}>
                  {formatPriceObj(donation).value}
                </Show>
              </button>
            </li>
          )}
        </For>
      </ol>
    
      <p class="text-sm text-secondary italic text-center col-span-3 mt-4">{t().donationInfoTax}</p>
    </>
  )
}
