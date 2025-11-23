import { For } from "solid-js"
import { prices } from "./price.store"
import type { LANGS } from "~/features/lang-selector/lang-selector.const"
import { useParams } from "@solidjs/router"
import { ticketCreate } from "../ticket/ticket-create"


export const Prices = () => {
  const params = useParams()
  const lang = () => params.lang as keyof typeof LANGS

  const ticketCreateCtrl = ticketCreate();

  return (
    <div class="flex flex-col gap-2 w-full">
      <For each={prices()}>
        {(price) => (
          <div class="flex items-center gap-2 border border-primary p-2 rounded-md w-full">
            <div class="flex flex-col gap-2">
              <div class="text-xl font-bold w-full flex justify-between gap-2">
                <p>{price.translations[lang() as keyof typeof price.translations].name}</p>

              </div>
              <p class="text-sm italic">{price.translations[lang() as keyof typeof price.translations].description}</p>
            </div>
            <div class="flex flex-col gap-4">
              <div class="text-xl font-bold text-center">{price.amount}<span class="text-secondary">€</span></div>

              <div class="flex h-full text-xl items-center justify-center gap-2">
                <button onClick={() => ticketCreateCtrl.removeFromCart(price)}>
                  -
                </button>
                <div class="text-xl">{ticketCreateCtrl.getQuantity(price)}</div>
                <button onClick={() => ticketCreateCtrl.addToCart(price)}>
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </For>
    </div >
  )
}