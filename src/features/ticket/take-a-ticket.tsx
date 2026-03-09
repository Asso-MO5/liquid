import { A } from "@solidjs/router";
import { langCtrl } from "../lang-selector/lang.ctrl";
import { translate } from "~/utils/translate";
import { txt } from "./take-a-ticket.txt";

export const TakeATicket = () => {
  const { t } = translate(txt)
  const lang = langCtrl();
  
    // DISABLED DURING PAUSE
  return null;
  // return (
  //   <div class="flex justify-center items-center p-4">
  //     <A
  //       class="btn p-6"
  //       href={`/${lang()}/ticket`}>{t().title}</A>
  //   </div>
  // );
};