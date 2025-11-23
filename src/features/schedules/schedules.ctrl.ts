import { createSignal, onMount } from "solid-js";
import { clientEnv } from "~/env/client";

import { setSchedules } from "./schedules.store";


export default function schedulesCtrl() {
  const [isLoading, setIsLoading] = createSignal(false);

  const getSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${clientEnv.VITE_API_URL}/museum/schedules/public?include_exceptions=true`);
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des horaires");
    } finally {
      setIsLoading(false);
    }
  }

  onMount(() => {
    getSchedules();
  })

  return {
    isLoading,
  }
}