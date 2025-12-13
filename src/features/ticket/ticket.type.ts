import type { Price } from "~/features/price/price.type";

export type TicketStatus = 'pending' | 'paid' | 'cancelled' | 'used' | 'expired';

export interface Ticket {
  id: string;
  qr_code: string; // Code QR unique (8 caractères alphanumériques majuscules)
  first_name: string | null;
  last_name: string | null;
  email: string;
  reservation_date: string; // Format YYYY-MM-DD
  slot_start_time: string; // Format HH:MM:SS
  slot_end_time: string; // Format HH:MM:SS
  checkout_id: string | null;
  checkout_reference: string | null;
  transaction_status: string | null;
  ticket_price: number;
  donation_amount: number;
  total_amount: number;
  status: TicketStatus;
  used_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}


export interface TicketStore {
  first_name: string;
  last_name: string;
  email: string;
  reservation_date: string;
  slot_start_time: string;
  slot_end_time: string;
  is_half_price: boolean;
  checkout_id: string | null;
  checkout_reference: string | null;
  transaction_status: string | null;
  ticket_price: number;
  donation_amount: number;
  total_amount: number;
  status: TicketStatus;
  tickets: Price[];
  gift_codes: string[];
  guided_tour: boolean;
}

