import { A } from "@solidjs/router"
import { LangSelector } from "~/features/lang-selector/lang-selector"
import { MiniGame } from "~/features/mini-game/mini-game"
import { For, Show } from "solid-js"
import { Logo } from "../Logo"

const menuEntries = [
  { label: "Accueil", href: "/" },
  { label: "Billeterie", href: "/ticket" },
  { label: "Infos pratiques", href: "/about" },
  { label: "Évènements", href: "/about" },
]

type HeaderProps = {
  withGame?: boolean
  page?: string
}
export const Header = (props: HeaderProps) => {
  return (
    <header
      data-with-game={props.withGame}
      class="grid grid-rows-[auto_1fr] data-[with-game=true]:h-[100dvh] data-[with-game=false]:grid-rows-[auto]">
      <Show when={props.page !== 'game'}>
        <div class="flex justify-between items-center p-2">
          <div class="flex items-center gap-4">
            <A href="/">
              <Logo />
            </A>
            <nav class="sm:flex hidden items-center gap-4 text-text">
              <For each={menuEntries}>
                {(entry) => <A href={entry.href} class="hover:text-primary text-text">{entry.label}</A>}
              </For>
            </nav>
          </div>
          <LangSelector />
        </div>
      </Show>

      <div class="h-full w-full data-[with-game=false]:hidden" data-with-game={props.withGame}>
        <MiniGame init={!!props.withGame} />
      </div>


    </header >
  )
}