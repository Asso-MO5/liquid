import { setTicketStore, ticketStore } from "~/features/ticket/ticket.store";


export const giftCodesCtrl = () => {

  const setGiftCodes = (value: string, index: number) => {
    setTicketStore("gift_codes", index, { index, code: value });
  };

  const addGiftCode = () => {
    if (ticketStore.gift_codes.length < ticketStore.tickets.filter(ticket => ticket.amount > 0).length) {
      setTicketStore('gift_codes', (codes) => [...codes, { index: codes.length, code: '' }]);
    }
    const input = document.querySelector(`#gift-code-${ticketStore.gift_codes.length - 1}`);
    if (input) {
      (input as HTMLInputElement).focus();
    }
  }

  const removeGiftCode = (index: number) => {
    setTicketStore('gift_codes', (codes) => codes.filter((_, i) => i !== index).map((code, i) => ({ index: i, code: code.code })));
    const input = document.querySelector(`#gift-code-${ticketStore.gift_codes.length - 1}`);
    if (input) {
      (input as HTMLInputElement).focus();
    }
  }

  return {
    setGiftCodes,
    addGiftCode,
    removeGiftCode,
  }

}