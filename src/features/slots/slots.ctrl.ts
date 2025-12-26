import { createSignal } from "solid-js";
import type { Slot, SlotsResponse } from "./slot.type";
import { setTicketStore, ticketStore } from "~/features/ticket/ticket.store";
import { clientEnv } from "~/env/client";
import { formatDateToISO } from "~/utils/format-date-to-iso";

export const slotsCTRL = () => {
  const [isFetching, setIsFetching] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [slots, setSlots] = createSignal<Slot[]>([]);

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


      const isToday = new Date(ticketStore.reservation_date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
      setSlots(data.slots.filter(slot => {
        if (isToday) {
          const now = new Date();
          const currentTime = now.toISOString().split('T')[1];
          const slotStartTime = slot.start_time;
          const [slotHours, slotMinutes] = slotStartTime.split(':').map(Number);
          const slotDate = new Date(now);
          slotDate.setHours(slotHours, slotMinutes, 0, 0);
          const limitTime = new Date(slotDate.getTime() + 30 * 60 * 1000); // +30 minutes
          const limitTimeString = limitTime.toISOString().split('T')[1];
          return currentTime <= limitTimeString;
        }
        return true;
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des slots");
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }

  const onSlotClick = (slot: Slot) => {
    setTicketStore('slot_start_time', slot.start_time);
    setTicketStore('slot_end_time', slot.end_time);
    setTicketStore('is_half_price', slot.is_half_price);
  }


  const onDayClick = async (day: Date) => {
    const dateString = formatDateToISO(day);
    setTicketStore('reservation_date', `${dateString}T00:00:00.000Z`);
    await getSlots()
  }

  return {
    isFetching,
    isLoading,
    slots,
    getSlots,
    onSlotClick,
    onDayClick
  }
}