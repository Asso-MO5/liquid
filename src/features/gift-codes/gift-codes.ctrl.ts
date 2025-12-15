import { setTicketStore, ticketStore } from "~/features/ticket/ticket.store";

export const giftCodesCtrl = () => {

  const setGiftCodes = (value: string, index: number) => {
    const newCodes = [...ticketStore.gift_codes];
    if (index >= 0 && index < newCodes.length) {
      newCodes[index] = value;
    } else {
      newCodes.push(value);
    }
    setTicketStore('gift_codes', newCodes);
  }

  const addGiftCode = () => {
    if (ticketStore.gift_codes.length < ticketStore.tickets.length) {
      setTicketStore('gift_codes', [...ticketStore.gift_codes, '']);
    }
  }

  const removeGiftCode = (index: number) => {
    const newCodes = ticketStore.gift_codes.filter((_, i) => i !== index);
    setTicketStore('gift_codes', newCodes);
  }

  return {
    setGiftCodes,
    addGiftCode,
    removeGiftCode,
  }

}