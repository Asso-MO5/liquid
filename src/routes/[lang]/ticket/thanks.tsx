import { translate } from "~/utils/translate"
import { thanksTxt } from "./thanks.txt"

export default function Thanks() {
  const { t } = translate(thanksTxt)

  return (
    <div class="flex flex-col gap-2 items-center justify-center max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-center">{t.title}</h1>
      <p class="text-lg text-text text-center">{t.description}</p>
      <div class="flex flex-col gap-2 items-center justify-center mt-8 border border-secondary rounded-md p-4">
        <p class="text-text text-center text-lg">{t.continueSupport}</p>
        <a href={`https://don.mo5.com`} target="_blank"
          data-theme="secondary"
          class="btn text-white text-lg">{t.joinMo5}
        </a>
      </div>
    </div>
  )
}