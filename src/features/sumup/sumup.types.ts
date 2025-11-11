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
