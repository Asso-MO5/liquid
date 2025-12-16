import { LangSelector } from "~/features/lang-selector/lang-selector"
import { MiniGame } from "~/features/mini-game/mini-game"
import { Show } from "solid-js"
import { A } from "@solidjs/router"
import { Logo } from "../Logo"
import { MenuMobile } from "../Menu/menu-mobile"
import { MenuDesktop } from "../Menu/menu-desktop"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { DarkMode } from "~/features/dark-mode/dark-mode"

type HeaderProps = {
  withGame?: boolean
  page?: string
}

const txt = {
  fr: {
    logoAlt: 'Logo de l\'association MO5',
    logoLabel: 'Musée du Jeu Vidéo - Accueil',
  },
  en: {
    logoAlt: 'Logo of the MO5 association',
    logoLabel: 'Video Game Museum - Home',
  }
}

export const Header = (props: HeaderProps) => {

  const lang = langCtrl()

  return (
    <div
      data-with-game={props.withGame}
      class="grid grid-rows-[auto_1fr] data-[with-game=true]:h-[100dvh] data-[with-game=false]:grid-rows-[auto]">
      <Show when={props.page !== 'game'}>
        <div class="mt-20 borde w-full" />
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
          <div class="flex items-center gap-4">
            <A href={`/${lang()}`} aria-label={txt[lang() as keyof typeof txt].logoLabel}>
              <Logo />
            </A>
            <MenuDesktop />
          </div>
          <MenuMobile />
          <div class="flex items-center gap-4">
            <a href="https://mo5.com/" target="_blank" rel="noopener noreferrer">
              <img src="/logo.webp"
                width={194}
                height={60}
                alt={txt[lang() as keyof typeof txt].logoAlt}
                class="w-[120px] h-auto hidden md:block" />
            </a>
            <DarkMode />
            <LangSelector />
          </div>
        </header>
      </Show>

      <div class="h-full w-full " data-with-game={props.withGame}>
        {props.withGame && <MiniGame />}
      </div>
    </div >
  )
}