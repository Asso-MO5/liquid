export interface SumUpResponseBody {
  message?: string;
  [key: string]: unknown;
}

export interface SumUpCardConfig {
  id: string;
  checkoutId: string;
  onResponse: (type: string, body: SumUpResponseBody) => void;
  [key: string]: unknown;
}

export interface SumUpCardInstance {
  submit: () => void;
  unmount: () => void;
  update: (config: Partial<SumUpCardConfig>) => void;
}


export interface PaymentApiWebhook {
  id: string;
  type: string;
  timestamp: string;
  checkout_id: string;
  checkout_reference: string;
  amount: number;
  currency: string;
  status: string;
  payment_type: string;
  transaction_code: string;
  merchant_code: string;
  language: string;
  event: {
    id: string;
    type: string;
    timestamp: string;
    checkout_id: string;
    checkout_reference: string;
    amount: number;
    currency: string;
    status: string;
    payment_type: string;
    transaction_code: string;
  }
}
