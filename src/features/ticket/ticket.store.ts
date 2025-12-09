import { createStore } from "solid-js/store";
import type { TicketStore } from "./ticket.type";

export const [ticketStore, setTicketStore] = createStore<TicketStore>({
  first_name: '',
  last_name: '',
  email: '',
  reservation_date: '',
  slot_start_time: '',
  slot_end_time: '',
  is_half_price: false,
  checkout_id: null,
  checkout_reference: null,
  transaction_status: null,
  ticket_price: 0,
  donation_amount: 0,
  total_amount: 0,
  status: 'pending',
  guided_tour: false,
  tickets: [],
  gift_codes: [],
});
