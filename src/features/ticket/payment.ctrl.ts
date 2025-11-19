import { createSignal } from "solid-js";
import { clientEnv } from "~/env/client";
import { toast } from "~/ui/Toast";
import { ticketStore } from "./ticket.store";
import type { PreparePaymentTicket } from "./payment.type";
import type { Ticket } from "./ticket.type";

export const paymentCtrl = () => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [checkoutId, setCheckoutId] = createSignal<string | null>(null)
  const [checkoutReference, setCheckoutReference] = createSignal<string | null>(null)
  const [tickets, setTickets] = createSignal<Ticket[]>([])
  const preparePayment = async () => {
    setIsLoading(true);

    const body = {
      email: ticketStore.email,
      first_name: ticketStore.first_name,
      last_name: ticketStore.last_name,
      tickets: [] as PreparePaymentTicket[],
      currency: 'EUR',
      description: 'Tickets for the museum',
    }

    ticketStore.tickets.forEach((ticket, idx) => {
      body.tickets.push({
        reservation_date: ticketStore.reservation_date.split('T')[0],
        slot_start_time: ticketStore.slot_start_time,
        slot_end_time: ticketStore.slot_end_time,
        ticket_price: ticket.amount,
        donation_amount: idx === 0 ? ticketStore.donation_amount : 0,
        notes: '',
      });
    });
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/museum/tickets/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data: { checkout_id: string, checkout_reference: string, tickets: Ticket[] } = await response.json();
      setCheckoutId(data.checkout_id);
      setCheckoutReference(data.checkout_reference);
      setTickets(data.tickets);


    } catch (error) {
      toast.error("Erreur lors de la préparation du paiement");
      console.error("Erreur lors de la préparation du paiement");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    preparePayment,
    isLoading,
    checkoutId,
    checkoutReference,
    tickets,
  }
}