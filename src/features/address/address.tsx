import { For } from "solid-js"
import { translate } from "~/utils/translate"
import { addressTxt } from "./address.txt"

export const Address = () => {
  const { t } = translate(addressTxt)
  return (
    <div class="flex flex-col h-full justify-center items-center rounded-sm p-4">
      <h2 class="text-4xl font-bold text-center">{t().title}</h2>
      <For each={[t().street, t().city, t().country]}>
        {(address) => <p class="text-center line-clamp-1 p-0 m-0">{address}</p>}
      </For>
    </div>
  )
}