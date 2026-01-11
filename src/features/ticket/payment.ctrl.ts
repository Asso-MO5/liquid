import { createMemo, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { clientEnv } from "~/env/client";
import { toast } from "~/ui/Toast";
import { setTicketStore, ticketStore } from "~/features/ticket/ticket.store";
import type { Ticket } from "~/features/ticket/ticket.type";
import type { PreparePaymentTicket } from "~/features/ticket/payment.type";
import { locales } from "~/utils/langs";
import { langCtrl } from "~/features/lang-selector/lang.ctrl";
import { guidedTourPrice } from "~/features/price/price.store";

export const paymentCTRL = () => {
  const navigate = useNavigate();
  const lang = langCtrl();
  const langStr = String(lang());
  const [isLoading, setIsLoading] = createSignal(false);
  const [IHaveReadTheTermsAndConditions, setIHaveReadTheTermsAndConditions] = createSignal(false);

  const preparePayment = async () => {
    setIsLoading(true);
    const origin = window.location.origin;
    const successUrl = `${origin}/${langStr}/ticket/thanks`;
    const cancelUrl = `${origin}/${langStr}/ticket/error`;

    const body = {
      email: ticketStore.email,
      first_name: ticketStore.first_name,
      last_name: ticketStore.last_name,
      tickets: [] as PreparePaymentTicket[],
      currency: 'EUR',
      description: 'Tickets for the museum',
      language: locales[lang() as keyof typeof locales],
      gift_codes: ticketStore.gift_codes.filter(code => code !== ''),
      guided_tour: ticketStore.guided_tour,
      guided_tour_price: guidedTourPrice(),
      success_url: successUrl,
      cancel_url: cancelUrl,
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

      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`)
        }
        throw new Error(JSON.stringify(errorData))
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Réponse invalide: ${contentType}`)
      }

      let data: { checkout_id: string, checkout_url: string, checkout_reference: string, tickets: Ticket[], error: string }
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('Erreur lors du décodage JSON:', jsonError)
        throw new Error('Erreur lors du décodage de la réponse du serveur')
      }

      if (!response.ok) {
        throw new Error(data.error);
      }

      setTicketStore('checkout_id', data.checkout_id);
      setTicketStore('checkout_reference', data.checkout_reference);
      setTicketStore('gift_codes', []);
      setTicketStore('guided_tour', false);
      setTicketStore('total_amount', 0);
      setTicketStore('reservation_date', '');
      setTicketStore('slot_start_time', '');
      setTicketStore('slot_end_time', '');
      setTicketStore('tickets', []);
      setTicketStore('donation_amount', 3);
      if (data.checkout_url) {
        // Only Free places haven't  a checkout_url
        window.location.href = data.checkout_url;
      } else {
        navigate(`/${langStr}/ticket/thanks`);
      }

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

  const paymentButtonDisabled = createMemo(() => {
    const testEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticketStore.email);
    return ticketStore.first_name === '' || ticketStore.last_name === '' || !testEmail || ticketStore.tickets.length === 0 || ticketStore.reservation_date === '' || ticketStore.slot_start_time === '' || !IHaveReadTheTermsAndConditions();
  });

  const paymentButtonErrorMessage = createMemo(() => {
    if (ticketStore.reservation_date === '') {
      return {
        fr: 'Veuillez sélectionner une date de visite',
        en: 'Please select a visit date'
      };
    }
    if (ticketStore.slot_start_time === '') {
      return {
        fr: 'Veuillez sélectionner un créneau horaire',
        en: 'Please select a time slot'
      };
    }
    if (ticketStore.tickets.length === 0) {
      return {
        fr: 'Veuillez sélectionner au moins un billet',
        en: 'Please select at least one ticket'
      };
    }
    if (ticketStore.first_name === '') {
      return {
        fr: 'Veuillez renseigner votre prénom',
        en: 'Please enter your first name'
      };
    }
    if (ticketStore.last_name === '') {
      return {
        fr: 'Veuillez renseigner votre nom',
        en: 'Please enter your last name'
      };
    }
    const testEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticketStore.email);
    if (!testEmail) {
      return {
        fr: 'Veuillez renseigner une adresse email valide',
        en: 'Please enter a valid email address'
      };
    }
    if (!IHaveReadTheTermsAndConditions()) {
      return {
        fr: 'Veuillez accepter les conditions d\'utilisation',
        en: 'Please accept the terms of use'
      };
    }
    return null;
  });

  return {
    isLoading,
    preparePayment,
    paymentButtonDisabled,
    paymentButtonErrorMessage,
    IHaveReadTheTermsAndConditions,
    setIHaveReadTheTermsAndConditions,
  }
}