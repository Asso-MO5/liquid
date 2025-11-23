import { createSignal, onMount } from "solid-js";
import { setPrices } from "./price.store";
import { clientEnv } from "~/env/client";

export function priceCtrl() {
  const [isFetching, setIsFetching] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const getPrices = async () => {
    setIsFetching(true);
    setIsLoading(true);
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/museum/prices`);
      const data = await response.json();
      setPrices(data);
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