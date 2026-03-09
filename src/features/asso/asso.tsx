import { translate } from "~/utils/translate"
import { txt } from "./asso.txt"

export const Asso = () => {
  const { t } = translate(txt)
  return (
    <div class="flex flex-col gap-5 max-w-2xl mx-auto">
      <div class="flex flex-col md:flex-row gap-5 h-full justify-center items-center ">
        <img src="/logo_blue.webp" alt=""
          loading="lazy"
          width={100}
          height={87}
          class="w-[87px] md:w-[100px] h-auto" />
        {/* <p class="text-text h-full justify-center items-center flex m-0">{t().speech}</p> */}
        <div class="text-text h-full m-0">
          <p>{t().pause1}</p>
          <p>{t().pause2}</p>
          <p>{t().pause3}</p>
          <p>{t().pause4}</p>
          <p>{t().pause5}</p>
          <p>{t().pause6}</p>
        </div>

      </div>
      <div class="flex justify-center items-center">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://mo5.com/"
          class="btn ">{t().discoverAssociation}</a>
      </div>
    </div>
  )
}