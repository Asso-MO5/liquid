import { createMemo } from "solid-js";
import { ticketStore } from "~/features/ticket/ticket.store";
import { ticketCreate } from "~/features/ticket/ticket-create";

export const ticketResumeCTRL = () => {
  const ticketCreateCtrl = ticketCreate();

  const getTicketCount = (ticketId: string) => ticketStore.tickets.filter(t => t.id === ticketId).length;

  const getUniqueTickets = createMemo(() => {
    const seen = new Set<string>();
    return ticketStore.tickets
      .filter(ticket => {
        if (seen.has(ticket.id)) return false;
        seen.add(ticket.id);
        return true;
      })
      .map(ticket => ({
        ticket,
        quantity: getTicketCount(ticket.id)
      }));
  });

  const calculateTicketTotal = createMemo(() => {
    return ticketStore.tickets.reduce((acc, ticket) => {
      const price = ticketCreateCtrl.isHalfPrice() ? Math.floor(ticket.amount / 2) : ticket.amount;
      return acc + price;
    }, 0);
  });

  const calculateTotal = createMemo(() => {
    const total = calculateTicketTotal() + ticketStore.donation_amount;
    return Math.round(total * 100) / 100;
  });

  const formatDate = (dateString: string, locale: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      'fr': 'fr-FR',
      'en': 'en-US',
    };
    const dateLocale = localeMap[locale] || 'fr-FR';
    return date.toLocaleDateString(dateLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const getTicketPrice = (ticket: { amount: number }) => ticketCreateCtrl.isHalfPrice() ? Math.floor(ticket.amount / 2) : ticket.amount;

  return {
    getTicketCount,
    getUniqueTickets,
    calculateTicketTotal,
    calculateTotal,
    formatDate,
    formatTime,
    getTicketPrice,
  };
};

