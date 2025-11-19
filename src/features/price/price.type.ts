export type Price = {
  id: string;
  amount: number;
  audience_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  requires_proof: boolean;
  created_at: string;
  updated_at: string;
  translations: Record<string, Record<string, string>>;
}
