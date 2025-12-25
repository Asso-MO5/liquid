import { For, Show } from "solid-js"
import { prices } from "./price.store"

import { ticketCreate } from "../ticket/ticket-create"
import { langCtrl } from "../lang-selector/lang.ctrl"
import { translate } from "~/utils/translate"
import { txt } from "./prices.txt"

export const Prices = () => {
  const { t } = translate(txt)
  const lang = langCtrl()
  const ticketCreateCtrl = ticketCreate();

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mx-auto text-text">
      <For each={prices()}>
        {(price) => (
          <div class="flex flex-col gap-2 p-2 w-full dark:bg-white/5 bg-black/5 rounded-md">

            <div class="text-xl font-bold w-full flex justify-between gap-2">
              <p>{price.translations[lang() as keyof typeof price.translations].name}</p>
              <Show when={price.amount > 0}>
                <div class="text-lg font-bold ">{ticketCreateCtrl.isHalfPrice() ? Math.round(price.amount / 2) : price.amount}<span class="text-secondary"> €</span></div>
              </Show>
              <Show when={price.amount === 0}>
                <p>{t.free}</p>
              </Show>
            </div>

            <div class="flex items-center justify-between gap-2 p-2 rounded-md w-full">
              <div class="flex flex-col gap-4 items-center justify-center">
                <p class="text-sm italic p-0 m-0">
                  {price.translations[lang() as keyof typeof price.translations].description}
                </p>
              </div>

              <div class="flex flex-col gap-4">

                <div class="flex h-full text-xl items-center justify-center gap-2">
                  <button onClick={() => ticketCreateCtrl.removeFromCart(price)} type="button"
                    aria-label={t.remove_from_cart}
                    class="text-xl"
                  >
                    {"\u2212"}
                  </button>
                  <div class="text-xl">{ticketCreateCtrl.getQuantity(price)}</div>
                  <button

                    type="button"
                    aria-label={t.add_to_cart}
                    onClick={() => ticketCreateCtrl.addToCart(price)} disabled={ticketCreateCtrl.isMaxQuantity()}>
                    {"\u002B"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </For >
    </div >
  )
}