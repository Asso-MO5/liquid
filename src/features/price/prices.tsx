import { For } from "solid-js"
import { prices } from "./price.store"

import { ticketCreate } from "../ticket/ticket-create"
import { langCtrl } from "../lang-selector/lang.ctrl"


export const Prices = () => {
  const lang = langCtrl()
  const ticketCreateCtrl = ticketCreate();

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-text">
      <For each={prices()}>
        {(price) => (
          <div class="flex flex-col gap-2 border border-primary p-2 rounded-md w-full">

            <div class="text-xl font-bold w-full flex justify-between gap-2">
              <p>{price.translations[lang() as keyof typeof price.translations].name}</p>
              <div class="text-lg font-bold ">{price.amount}<span class="text-secondary">€</span></div>
            </div>

            <div class="flex items-center justify-between gap-2 p-2 rounded-md w-full">

              <div class="flex flex-col gap-4 items-center justify-center">
                <p class="text-sm italic p-0 m-0">
                  {price.translations[lang() as keyof typeof price.translations].description}
                </p>
              </div>

              <div class="flex flex-col gap-4">

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
          </div>
        )}
      </For>
    </div >
  )
}