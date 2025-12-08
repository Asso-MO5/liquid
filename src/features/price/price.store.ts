import { createSignal } from "solid-js";
import type { Price } from "./price.type";

export const [prices, setPrices] = createSignal<Price[]>([]);
export const [guidedTourPrice, setGuidedTourPrice] = createSignal<number | null>(null);