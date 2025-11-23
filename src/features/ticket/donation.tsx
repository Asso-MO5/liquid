import { For } from "solid-js";
import { donationCtrl } from "./donation.ctrl";
import { ticketStore } from "./ticket.store";

export const Donation = () => {
  const donations = donationCtrl();

  return (
    <div class="grid grid-cols-3 gap-2">
      <For each={donations.donations}>
        {(donation) => (
          <button
            data-selected={donation === ticketStore.donation_amount}
            class="
              border border-primary rounded-md p-2
              bg-transparent text-primary
              data-[selected=true]:bg-primary data-[selected=true]:text-white
          "
            onClick={() => donations.setDonation(donation)}>{donation}<span class="text-white">€</span></button>
        )}
      </For>
    </div>
  )
}