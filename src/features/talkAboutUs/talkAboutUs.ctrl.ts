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
      setTalkAboutUs(data);
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