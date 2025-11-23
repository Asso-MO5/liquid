import type { Price } from "../price/price.type";
import { setTicketStore, ticketStore } from "./ticket.store";

export function ticketCreate() {

  const addToCart = (price: Price) => {
    setTicketStore('tickets', [...ticketStore.tickets, price])
  }

  const removeFromCart = (price: Price) => {
    const index = ticketStore.tickets.findIndex((p: Price) => p.id === price.id);
    if (index !== -1) {
      setTicketStore('tickets', [...ticketStore.tickets.slice(0, index), ...ticketStore.tickets.slice(index + 1)])
    }
  }

  const getQuantity = (price: Price) => {
    return ticketStore.tickets.filter((p) => p.id === price.id).length;
  }

  return {
    addToCart,
    removeFromCart,
    getQuantity,
  }
}