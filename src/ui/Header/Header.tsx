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
  },
  en: {
    logoMO5Alt: 'MO5 association',
    logoMJVLabel: 'Video Game Museum - Home',
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