import { createSignal, onMount } from "solid-js";
import { setGuidedTourPrice, setPrices } from "./price.store";
import { clientEnv } from "~/env/client";

export function priceCtrl() {
  const [isFetching, setIsFetching] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const getPrices = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/museum/prices`);
      const { guided_tour_price, prices } = await response.json();
      setPrices(prices);
      setGuidedTourPrice(guided_tour_price);
    } catch (error) {
      console.error("Erreur lors de la récupération des prix");
    } finally {
      setIsFetching(false);
      setIsLoading(false);
    }
  }

  onMount(() => {
    getPrices();
  })

  return {
    isFetching,
    isLoading,
  }
}