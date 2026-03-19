import { LangSelector } from "~/features/lang-selector/lang-selector"
import { Show } from "solid-js"
import { Logo } from "../Logo"
import { MenuMobile } from "../Menu/menu-mobile"
import { MenuDesktop } from "../Menu/menu-desktop"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { DarkMode } from "~/features/dark-mode/dark-mode"
import { translate } from "~/utils/translate"
import { PixelMuseum } from "~/features/pixel-museum/pixel-museum"

type HeaderProps = {
  withGame?: boolean
  page?: string
}

const txt = {
  fr: {
    logoMO5Alt: 'Association MO5',
    logoMJVLabel: 'Musée du Jeu Vidéo - Accueil',
    pauseLabel: 'Le Musée du Jeu Vidéo est actuellement en pause',
    pauseRead: 'Plus de détails',
    pauseReadAria: 'Plus de détails sur la pause temporaire du musée',
    pause1: 'La première période d’ouverture du musée du jeu vidéo arrive à son terme.',
    pause2: 'Cette étape initiale a rencontré un accueil très encourageant, au-delà de nos espérances, et c’est en grande partie grâce à vous.',
    pause3: 'Comme indiqué dans nos précédentes communications, une période de transition s’ouvre et, à compter du 8 mars au soir, le musée marquera une interruption de son ouverture au public. Cette période doit permettre de faire un point administratif et technique sur le projet. Ce temps de pause sera également l’occasion de réfléchir à l’organisation des espaces et aux perspectives possibles pour la suite.',
    pause4: 'Nous ne manquerons pas de vous tenir informés des prochaines évolutions lorsque le calendrier sera précisé.',
    pause5: 'Merci à nos partenaires et bénévoles pour leur soutien dans cette aventure de préservation du patrimoine vidéoludique.',
    pause6: 'L’équipe MO5',
    close: 'Fermer',
  },
  en: {
    logoMO5Alt: 'MO5 association',
    logoMJVLabel: 'Video Game Museum - Home',
    pauseLabel: 'The museum is temporarily closed',
    pauseRead: 'Read more',
    pauseReadAria: 'Read more about the museum\'s temporary closure',
    pause1: 'The first phase of the video game museum\'s opening is coming to an end.',
    pause2: 'This initial phase has been met with a very encouraging reception, exceeding our expectations, and this is largely thanks to you.',
    pause3: 'As mentioned in our previous communications, a transition period is beginning, and starting the evening of March 8th, the museum will be temporarily closed to the public. This period will allow us to take stock of the project\'s administrative and technical aspects. This pause will also be an opportunity to consider the organization of the spaces and possible future directions.',
    pause4: 'We will keep you informed of further developments as soon as the schedule is finalized.',
    pause5: 'Thank you to our partners and volunteers for their support in this adventure of preserving video game heritage.',
    pause6: 'The MO5 team',
    close: 'Close',
  }
}

export const Header = (props: HeaderProps) => {
  const lang = langCtrl()
  const { t } = translate(txt)


  const homeLink = () => {
    window.history.pushState({}, '', `/${lang()}`)
    window.location.reload()
  }

  return (
    <div
      data-with-game={props.withGame}
      class="grid grid-rows-[auto_1fr] data-[with-game=true]:h-[100dvh] data-[with-game=false]:grid-rows-[auto]">
      <Show when={props.page !== 'game'}>
        <div class="mt-20 w-full" />
        <header
          id="header"
          data-visible="true"
          class="
            transition-all duration-500
            data-[visible=false]:-translate-y-full
            data-[visible=true]:translate-y-0
            fixed h-18
            left-0 right-0
            flex justify-between items-center p-2
            ease-in-out top-0 z-50 bg-bg"
        >
          <nav role="navigation" class="flex items-center gap-4">
            <div onClick={homeLink} class="cursor-pointer" role="link" tabindex="0" aria-label={t().logoMJVLabel}>
              <Logo />
            </div>
            <MenuDesktop />
            <MenuMobile />
          </nav>

          <div class="fixed w-full left-0 top-[70px] py-4 bg-bg sm:relative sm:w-auto sm:top-0 sm:mt-4 sm:p-0 text-center">
            <p class="m-0 px-4">{t().pauseLabel}</p>
            <button command="show-modal" commandfor="dialog-pause" aria-label={t().pauseReadAria}>{t().pauseRead}</button>
          </div>

          <dialog class="w-[98vw] md:w-[50vw] m-auto p-4 border border -border bg-bg text-text" id="dialog-pause" aria-labelledby="title-pause">
            <button command="close" commandfor="dialog-pause">{t().close}</button>
            <h1 id="title-pause" class="text-3xl font-bold">{t().pause1}</h1>
            <p>{t().pause2}</p>
            <p>{t().pause3}</p>
            <p>{t().pause4}</p>
            <p>{t().pause5}</p>
            <p>{t().pause6}</p>
          </dialog>
          <div class="flex items-center gap-4">
            <a href="https://mo5.com/" target="_blank" rel="noopener noreferrer" class="hidden md:block">
              <img src="/logo.webp"
                width={194}
                height={60}
                alt={t().logoMO5Alt}
                class="w-[120px] h-auto" />
            </a>
            <DarkMode />
            <LangSelector />
          </div>
        </header>
      </Show>

      <Show when={props.withGame}>
        {props.withGame && <PixelMuseum />}
      </Show>
    </div >
  )
}