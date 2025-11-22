import { createEffect, createSignal } from "solid-js";
import { clientEnv } from "~/env/client";
import { toast } from "~/ui/Toast";
import { setTicketStore, ticketStore } from "./ticket.store";
import type { PreparePaymentTicket } from "./payment.type";
import type { Ticket } from "./ticket.type";
import { useParams } from "@solidjs/router";
import { locales } from "~/utils/langs";
import type { LANGS } from "../lang-selector/lang-selector.const";
import { useNavigate } from "@solidjs/router";

export const paymentCtrl = () => {
  const navigate = useNavigate();
  const params = useParams();
  const lang = () => params.lang as keyof typeof LANGS;
  const [isLoading, setIsLoading] = createSignal(false);
  const [checkoutId, setCheckoutId] = createSignal<string | null>(null)
  const [checkoutReference, setCheckoutReference] = createSignal<string | null>(null)
  const [tickets, setTickets] = createSignal<Ticket[]>([])
  const [totalAmount, setTotalAmount] = createSignal(0);

  const preparePayment = async () => {
    setIsLoading(true);

    const body = {
      email: ticketStore.email,
      first_name: ticketStore.first_name,
      last_name: ticketStore.last_name,
      tickets: [] as PreparePaymentTicket[],
      currency: 'EUR',
      description: 'Tickets for the museum',
      language: locales[lang() as keyof typeof locales],
    }

    ticketStore.tickets.forEach((ticket, idx) => {
      body.tickets.push({
        reservation_date: ticketStore.reservation_date.split('T')[0],
        slot_start_time: ticketStore.slot_start_time,
        slot_end_time: ticketStore.slot_end_time,
        ticket_price: ticket.amount,
        donation_amount: idx === 0 ? ticketStore.donation_amount : 0,
        pricing_info: {
          ...ticket,
          price_amount: ticket.amount,
          price_name: ticket.translations[lang() as keyof typeof ticket.translations].name,
          price_description: ticket.translations[lang() as keyof typeof ticket.translations].description,
          applied_at: new Date().toISOString(),

        },
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
      const data: { checkout_id: string, checkout_reference: string, tickets: Ticket[], error: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // '0' is the default value for the checkout_id for free place
      if (data.tickets?.length && data.tickets[0].checkout_id === '0' && !data.checkout_id) {
        const langStr = String(lang());
        const params = new URLSearchParams();
        params.set('qr', data.tickets?.map((ticket) => ticket.qr_code).join(','));
        params.set('email', ticketStore.email);
        //vider le store
        setTicketStore('reservation_date', '');
        setTicketStore('slot_start_time', '');
        setTicketStore('slot_end_time', '');
        setTicketStore('tickets', []);
        setTicketStore('donation_amount', 3);
        navigate(`/${langStr}/ticket/thanks?${params.toString()}`);

      }
      setCheckoutId(data.checkout_id);
      setCheckoutReference(data.checkout_reference);
      setTickets(data.tickets);

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith('{')) {
          const data = JSON.parse(error.message);
          toast.error(data?.[lang() as keyof typeof data.error] || 'Une erreur est survenue lors de la préparation du paiement');
          return;
        }
        toast.error(error.message);
        return;
      }
      const err = {
        fr: 'Erreur lors de la préparation du paiement',
        en: 'Error preparing payment',
      }

      toast.error(err[lang() as keyof typeof err]);

    } finally {
      setIsLoading(false);
    }
  }

  createEffect(() => {
    // Reload SumUp widget if the total amount has changed
    void ticketStore.total_amount;
    const total = ticketStore.donation_amount + ticketStore.tickets.reduce((acc, ticket) => acc + ticket.amount, 0);
    if (total !== totalAmount() && !isLoading() && !!checkoutId() && !!checkoutReference()) {
      setTotalAmount(total);
      preparePayment();
    }
  });

  return {
    preparePayment,
    isLoading,
    checkoutId,
    checkoutReference,
    tickets,
  }
}