import { Show } from 'solid-js'
import { DarkMode } from '~/features/dark-mode/dark-mode'
import { featureFlag } from '~/features/feature-flag/feature-flag.const'
import { langCtrl } from '~/features/lang-selector/lang.ctrl'
import { LangSelector } from '~/features/lang-selector/lang-selector'
import { MuseumInfo } from '~/features/museum-info/museum-info'
import { PixelMuseum } from '~/features/pixel-museum/pixel-museum'
import { translate } from '~/utils/translate'
import { Logo } from '../Logo'
import { MenuDesktop } from '../Menu/menu-desktop'
import { MenuMobile } from '../Menu/menu-mobile'

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
  },
}

export const Header = (props: HeaderProps) => {
  const lang = langCtrl()
  const { t } = translate(txt)

  const handleHomeAction = () => {
    window.history.pushState({}, '', `/${lang()}`)
    window.location.reload()
  }

  const handleHomeLinkKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.key === 'Enter') {
      handleHomeAction()
    }
  }

  const handleHomeClick = (e: MouseEvent) => {
    e.preventDefault()
    handleHomeAction()
  }

  return (
    <div
      data-with-game={props.withGame}
      class="grid grid-rows-[auto_1fr] data-[with-game=true]:h-[100dvh] data-[with-game=false]:grid-rows-[auto]"
    >
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
          <nav class="flex items-center gap-4">
            <a
              href="/"
              onClick={handleHomeClick}
              onKeyDown={handleHomeLinkKeyDown}
              class="cursor-pointer"
              tabindex="0"
              aria-label={t().logoMJVLabel}
            >
              <Logo />
            </a>
            <MenuDesktop />
            <MenuMobile />
          </nav>

          <div class="flex items-center gap-4">
            <a
              href="https://mo5.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="hidden md:block"
            >
              <img
                src="/logo.webp"
                width={194}
                height={60}
                alt={t().logoMO5Alt}
                class="w-[120px] h-auto"
              />
            </a>
            <DarkMode />
            <LangSelector />
          </div>
        </header>
      </Show>

      <Show when={props.withGame}>
        <PixelMuseum>
          <Show when={featureFlag.breakMessage}>
            <MuseumInfo />
          </Show>
        </PixelMuseum>
      </Show>
    </div>
  )
}
