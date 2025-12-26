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

  const getQuantity = (price: Price) => ticketStore.tickets.filter((p) => p.id === price.id).length;
  const isMaxQuantity = () => ticketStore.tickets.length >= 20;
  const isHalfPrice = () => ticketStore.is_half_price


  return {
    isHalfPrice,
    addToCart,
    removeFromCart,
    getQuantity,
    isMaxQuantity,
  }
}