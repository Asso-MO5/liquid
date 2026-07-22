import { A } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { langCtrl } from '~/features/lang-selector/lang.ctrl'
import { translate } from '~/utils/translate'
import { menuEntries } from './menu-entries'

export const MenuDesktop = () => {
  const lang = langCtrl()
  return (
    <ul class="lg:flex hidden items-center gap-4 text-text">
      <For each={menuEntries}>
        {(entry) => {
          const { t } = translate({ fr: { label: entry.label.fr }, en: { label: entry.label.en } })

          return (
            <>
              <Show when={!entry.disabled && entry.external}>
                <li>
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-green={entry.green}
                    class="
                    secondary border-primary
                    border px-2 py-2 rounded-sm
                    transition-all duration-300
                    hover:bg-primary/10 hover:text-primary
                    data-[green=true]:text-emerald-500
                    data-[green=true]:hover:text-emerald-500
                    data-[green=true]:border-emerald-500
                    data-[green=true]:hover:bg-emerald-500/20
                  "
                  >
                    {t().label}
                  </a>
                </li>
              </Show>

              <Show when={!entry.disabled && !entry.external}>
                <li>
                  <A
                    href={`/${lang()}${entry.href}`}
                    data-highlighted={entry.highlighted}
                    data-green={entry.green}
                    class="
                    hover:text-primary text-text
                    data-[green=true]:text-emerald-500
                    data-[green=true]:hover:text-emerald-500
                    data-[green=true]:border-emerald-500
                    data-[green=true]:hover:bg-emerald-500/20
                    data-[highlighted=true]:text-secondary
                    border border-transparent hover:bg-primary/10
                    data-[highlighted=true]:hover:text-white rounded-sm px-2 py-2
                    transition-all duration-300 data-[highlighted=true]:border-secondary
                    data-[highlighted=true]:hover:bg-secondary
                  "
                  >
                    {t().label}
                  </A>
                </li>
              </Show>
            </>
          )
        }}
      </For>
    </ul>
  )
}
