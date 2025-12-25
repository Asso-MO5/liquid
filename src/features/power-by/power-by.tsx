import { translate } from "~/utils/translate"
import { txt } from "./power-by.txt"

export const PowerBy = () => {
  const { t } = translate(txt)
  return (
    <p class="text-sm text-text/70 m-0 text-center">
      {t.powerBy}
      <a href="https://mo5.com/" target="_blank" rel="noopener noreferrer">
        <img src="/logo.webp"
          width={194}
          height={60}
          alt={t.logoAlt}
          class="w-[194px] h-auto" />
      </a>
    </p>
  )
}