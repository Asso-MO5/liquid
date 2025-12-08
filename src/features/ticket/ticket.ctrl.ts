import { createSignal } from "solid-js";
import { setTicketStore, ticketStore } from "./ticket.store";
import { scrollTo } from "~/utils/scroll-to";
import type { Slot, SlotsResponse } from "./ticket.type";
import { clientEnv } from "~/env/client";

export const TicketCtrl = () => {
  const [isFetching, setIsFetching] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [slots, setSlots] = createSignal<Slot[]>([]);

  // Formate une date en YYYY-MM-DD sans problème de fuseau horaire
  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onDayClick = async (day: Date) => {
    const dateString = formatDateToISO(day);
    setTicketStore('reservation_date', `${dateString}T00:00:00.000Z`);
    await getSlots()
    scrollTo('ticket', 'step-2');
  }

  const onSlotClick = (slot: Slot) => {
    setTicketStore('slot_start_time', slot.start_time);
    setTicketStore('slot_end_time', slot.end_time);
    setTicketStore('is_half_price', slot.is_half_price);
    scrollTo('ticket', 'step-3');
  }

  const getSlots = async () => {
    const params = new URLSearchParams();
    params.set('date', ticketStore.reservation_date.split('T')[0]);
    setIsFetching(true);
    setIsLoading(true);
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/museum/slots?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data: SlotsResponse = await response.json();
      setSlots(data.slots);
    } catch (error) {
      console.error("Erreur lors de la récupération des slots");
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }

  return {
    onDayClick,
    isFetching,
    isLoading,
    slots,
    onSlotClick,
  }
}