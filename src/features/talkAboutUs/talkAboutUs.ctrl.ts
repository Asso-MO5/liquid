import { createSignal, onMount } from "solid-js";
import { clientEnv } from "~/env/client";
import type { Media } from "./talkAboutUs.type";

export const [fetching, setFetching] = createSignal(false);
export const [talkAboutUs, setTalkAboutUs] = createSignal<Media[]>([]);


export const talkAboutUsCtrl = () => {
  const getTalkAboutUs = async () => {
    setFetching(true);
    try {
      const response = await fetch(`${clientEnv.VITE_BLOG_URL}/media?search=PRESSE`);
      const data = await response.json();
      const shuffledData = [...data];
      for (let i = shuffledData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
      }
      setTalkAboutUs(shuffledData);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }

  onMount(() => {
    getTalkAboutUs();
  })

  return {
    fetching,
    talkAboutUs,
    getTalkAboutUs
  }
}