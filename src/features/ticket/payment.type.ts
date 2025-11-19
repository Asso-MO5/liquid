export interface PreparePaymentBody {
  ticket_id: string;
  amount: number;
  currency: string;
  description: string;
  email: string;
  first_name: string;
  last_name: string;
  tickets: PreparePaymentTicket[];
}

export interface PreparePaymentTicket {
  reservation_date: string;
  slot_start_time: string;
  slot_end_time: string;
  ticket_price: number;
  donation_amount: number;
  notes: string;
}