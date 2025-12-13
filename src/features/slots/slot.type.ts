export interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  available: number;
  created_at: string;
  updated_at: string;
  occupancy_percentage: number;
  is_half_price: boolean;
}

export interface SlotsResponse {
  date: string;
  slots: Slot[];
  total_capacity: number;
  total_booked: number;
  total_available: number;
} 