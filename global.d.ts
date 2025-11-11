import type { SumUpCardConfig, SumUpCardInstance } from "~/features/sumup/sumup.types";

declare global {
  interface Window {
    SumUpCard?: {
      mount: (config: SumUpCardConfig) => SumUpCardInstance;
    };
  }
}