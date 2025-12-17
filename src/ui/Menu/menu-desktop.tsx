import { For } from 'solid-js'
import { menuEntries } from './menu-entries'
import { A } from '@solidjs/router'
import { langCtrl } from '~/features/lang-selector/lang.ctrl'

export const MenuDesktop = () => {
  const lang = langCtrl()
  return (
    <nav>
      <ul class="lg:flex hidden items-center gap-4 text-text">
        <For each={menuEntries}>
          {(entry) => {
            if (entry.external) {
              return (
                <li>
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="
              secondary border-primary border px-2 py-2 rounded-sm transition-all duration-300 hover:bg-primary/10 hover:text-primary
              "
                  >
                    {entry.label[lang() as 'fr' | 'en']}
                  </a>
                </li>
              )
            }

            return (
              <li>
                <A
                  href={`/${lang()}${entry.href}`}
                  data-highlighted={entry.highlighted}
                  class="
            hover:text-primary text-text 
            data-[highlighted=true]:text-secondary 
            border border-transparent hover:bg-primary/10 
            data-[highlighted=true]:hover:text-white rounded-sm px-2 py-2 transition-all duration-300 data-[highlighted=true]:border-secondary data-[highlighted=true]:hover:bg-secondary"
                >
                  {entry.label[lang() as 'fr' | 'en']}
                </A>
              </li>
            )
          }}
        </For>
      </ul>
    </nav>
  )
}
