import { For } from 'solid-js'
import { donationCtrl } from './donation.ctrl'
import { ticketStore } from './ticket.store'
import { translate } from '../../utils/translate';

const txt = {
  fr: {
    donationInfoTax: "Les dons sont déductibles à hauteur de 66% du montant versé.",
  },
  en: {
    donationInfoTax: "Donations are deductible up to 66% of the amount paid.",
  }
}

export const Donation = () => {
  const { t } = translate(txt)
  const donations = donationCtrl()

  return (
    <div class="grid grid-cols-3 gap-2">
      <For each={donations.donations}>
        {(donation) => (
          <button
            data-selected={donation === ticketStore.donation_amount}
            class="
              border border-primary rounded-md p-2
              bg-transparent dark:text-text text-primary
              data-[selected=true]:bg-primary 
              dark:data-[selected=true]:text-black 
              data-[selected=true]:text-white
            "
            onClick={() => donations.setDonation(donation)}
          >
            {donation}
            <span
              data-selected={donation === ticketStore.donation_amount}
              class="
                dark:text-secondary  hover:text-white text-primary
                data-[selected=true]:text-white
                dark:data-[selected=true]:text-black
              "
            >
              {" "}€
            </span>
          </button>
        )}
      </For>
      <p class="text-sm text-secondary italic text-center col-span-3 mt-4">{t.donationInfoTax}</p>
    </div>
  )
}
