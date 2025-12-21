import { setTicketStore } from "./ticket.store";

export function donationCtrl() {

  const setDonation = (donation: number) => {
    setTicketStore('donation_amount', donation);
  }

  return {
    setDonation,
    donations: [0, 1, 3, 5, 10, 20],
  }
}