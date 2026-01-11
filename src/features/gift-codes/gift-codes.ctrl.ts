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

    // when newCodes changes, focus is lost (I suppose it is the rerender) so we place it back to the next focusable element
    if (document) {
      document.getElementById(`gift-code-remove-${index}`)?.focus()
    }
  }

  const addGiftCode = () => {
    if (ticketStore.gift_codes.length < ticketStore.tickets.length) {
      setTicketStore('gift_codes', [...ticketStore.gift_codes, '']);
      
      // set focus to the newly created input
      if (document) {
        const giftCodesList = document.getElementById('gift-codes-list')
        const newestInput = giftCodesList?.lastElementChild?.querySelector('input')
        newestInput?.focus()
      }
    }
  }

  const removeGiftCode = (index: number) => {
    const newCodes = ticketStore.gift_codes.filter((_, i) => i !== index);
    setTicketStore('gift_codes', newCodes);
    
    // set focus to the last remove button (to ease removing all codes) if any, else back to the add button
    if (document) {
      const previousRemoveButton = document.getElementById(`gift-code-remove-${index - 1}`)
      const addButton = document.getElementById('gift-codes-add')
      previousRemoveButton ? previousRemoveButton.focus() : addButton?.focus()
    }
  }

  return {
    setGiftCodes,
    addGiftCode,
    removeGiftCode,
  }

}