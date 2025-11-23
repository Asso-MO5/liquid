import { A } from "@solidjs/router";
import { For, type VoidComponent } from "solid-js";
import { langCtrl } from "~/features/lang-selector/lang.ctrl";


const infoTxt = {
  fr: {
    button: 'Réserver un billet',
    Title: 'Le Musée du jeu vidéo',
    address: ['10 Avenue Paul Doumer', ' 94110 Arcueil', 'France'],
  },
  en: {
    button: 'Book a ticket',
    Title: 'The Video Game Museum',
    address: ['10 Avenue Paul Doumer', ' 94110 Arcueil', 'France'],
  }
}

const Home: VoidComponent = () => {

  const lang = langCtrl()
  return (
    <main class="flex flex-col gap-4 p-4">
      <div class="grid grid-rows-2 md:grid-cols-2 flex-wrap gap-2 w-full md:justify-between justify-center items-center">
        <div class="flex flex-col h-full justify-center items-center rounded-sm p-4">
          <h2 class="text-xl font-bold text-center">{infoTxt[lang() as keyof typeof infoTxt].Title}</h2>
          <For each={infoTxt[lang() as keyof typeof infoTxt].address}>
            {(address) => <p class="text-center line-clamp-1 p-0 m-0">{address}</p>}
          </For>
        </div>

        <div class="flex md:justify-end justify-center items-center h-full">
          <A
            href={`/${lang()}/ticket`}
            class="relative border-2 text-secondary rounded-sm px-3 py-2 text-lg hover:text-white transition-all duration-300 overflow-hidden group animate-border-rotate"
          >
            <span class="relative z-10">{infoTxt[lang() as keyof typeof infoTxt].button}</span>
            <span class="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-secondary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-gradient-x" />
          </A>
        </div>
      </div>
    </main >
  );
};

export default Home;