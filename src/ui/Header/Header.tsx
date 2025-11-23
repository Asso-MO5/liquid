import { A, useParams } from "@solidjs/router"
import { LangSelector } from "~/features/lang-selector/lang-selector"
import { MiniGame } from "~/features/mini-game/mini-game"
import { For, Show } from "solid-js"
import { Logo } from "../Logo"
import type { DAYS_TEXT } from "../Cal/Cal.const"

const menuEntries: { label: { fr: string; en: string }; href: string }[] = [
  {
    label:
    {
      fr: "Accueil",
      en: "Home"
    },
    href: "/"
  },
  {
    label: {
      fr: "Billeterie",
      en: "Ticket"
    }, href: "/ticket"
  },
  /*
  {
    label: {
      fr: "Infos pratiques",
      en: "Practical information"
    }, href: "/about"
  },
  {
    label: {
      fr: "Évènements",
      en: "Events"
    }, href: "/about"
  },
  */
]

type HeaderProps = {
  withGame?: boolean
  page?: string
}
export const Header = (props: HeaderProps) => {

  const params = useParams();
  const lang = () => params.lang as keyof typeof DAYS_TEXT

  return (
    <div
      data-with-game={props.withGame}
      class="grid grid-rows-[auto_1fr] data-[with-game=true]:h-[100dvh] data-[with-game=false]:grid-rows-[auto]">
      <Show when={props.page !== 'game'}>
        <div class="h-18" />
        <header
          id="header"
          data-visible="true"
          class="
            transition-all duration-500
            data-[visible=false]:-translate-y-full
            data-[visible=true]:translate-y-0
            fixed 
            left-0 right-0
            flex justify-between items-center p-2
            ease-in-out top-0 z-50 bg-bg"
        >
          <div class="flex items-center gap-4">
            <A href="/">
              <Logo />
            </A>
            <nav class="sm:flex hidden items-center gap-4 text-text">
              <For each={menuEntries}>
                {(entry) => {
                  return <A href={`/${lang()}${entry.href}`} class="hover:text-primary text-text">{entry.label[lang() as "fr" | "en"]}</A>;
                }}
              </For>
            </nav>
          </div>
          <LangSelector />
        </header>
      </Show>

      <div class="h-full w-full data-[with-game=false]:hidden" data-with-game={props.withGame}>
        <MiniGame withGame={!!props.withGame} />
      </div>


    </div >
  )
}