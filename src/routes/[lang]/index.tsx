import { A } from "@solidjs/router";
import type { VoidComponent } from "solid-js";
import { Address } from "~/features/address/address";
import { Asso } from "~/features/asso/asso";
import { langCtrl } from "~/features/lang-selector/lang.ctrl";
import { Pictures } from "~/features/pictures/pictures";
import { Supports } from "~/features/supports/supports";
import { TakeATicket } from "~/features/ticket/take-a-ticket";
import { translate } from "~/utils/translate";

import { TalkAboutUs } from "~/features/talkAboutUs/TalkAboutUs";

const infoTxt = {
  fr: {
    button: 'Réservation',
    Title: 'Le Musée du jeu vidéo',
  },
  en: {
    button: 'Reservation',
    Title: 'The Video Game Museum',
  }
}



const Home: VoidComponent = () => {
  const { t } = translate(infoTxt)
  const lang = langCtrl()
  return (
    <main class="flex flex-col gap-12 p-4">
      <div class="grid grid-rows-1 md:grid-cols-2 flex-wrap gap-2 w-full md:justify-between justify-center items-center">
        <Address />

        <div class="flex justify-center items-center h-full">
          <A
            href={`/${lang()}/ticket`}
            class="relative border-2 border-secondary text-secondary dark:text-secondary rounded-sm px-3 py-2 text-lg hover:text-text dark:hover:text-text transition-all duration-300 overflow-hidden group animate-border-rotate group-hover:text-text dark:group-hover:text-text bg-transparent dark:bg-transparent"
          >
            <span class="relative z-10">{t.button}</span>
            <span class="absolute inset-0 opacity-0 group-hover:opacity-100 z-20 h-full w-full flex items-center justify-center text-text hover:text-white dark:text-text">{t.button}</span>
            <span class="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 
            animate-gradient-x" />
          </A>
        </div>
      </div>
      <Asso />
      <Supports />
      <Pictures />
      <TakeATicket />
      <TalkAboutUs />
    </main >
  );
};

export default Home;