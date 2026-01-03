import { For, createSignal } from "solid-js"
import { menuEntries } from "./menu-entries"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { translate } from "~/utils/translate"

export const MenuMobile = () => {
  const lang = langCtrl()
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen());
  };

  return (
    <div class="lg:hidden">
      <div class="fixed top-0 left-[50%] -translate-x-1/2 h-18 flex items-center justify-center">
        <button
          onClick={toggleMenu}
          class="flex flex-col gap-1.5 p-2 z-50 relative bg-transparent border-none"
          aria-label="Toggle menu"
          aria-expanded={isOpen()}
        >
          <span
            data-open={isOpen()}
            class="
            block w-6 h-0.5 bg-text transition-all duration-300
            data-[open=true]:rotate-45
            data-[open=true]:translate-y-2
            data-[open=false]:opacity-100
          "
          />
          <span
            data-open={isOpen()}
            class="
            block w-6 h-0.5 bg-text transition-all duration-300
            data-[open=true]:opacity-0
            data-[open=false]:opacity-100
          "
          />
          <span
            data-open={isOpen()}
            class="
            block w-6 h-0.5 bg-text transition-all duration-300
            data-[open=true]:-rotate-45
            data-[open=true]:-translate-y-2 data-[open=false]:opacity-100
          "
          />
        </button>
      </div>

      {/* Menu qui s'ouvre de haut en bas */}
      <div
        data-open={isOpen()}
        class="
        fixed top-18 left-0 w-full bg-bg z-40 overflow-hidden transition-all duration-300 ease-in-out
        data-[open=true]:max-h-screen data-[open=true]:opacity-100
        data-[open=false]:max-h-0 data-[open=false]:opacity-0
        "
      >
        <div>
          <ul role="list" class="py-4 px-4 flex flex-col gap-2">
            <For each={menuEntries}>
              {(entry) => {
                const { t } = translate({ fr: { label: entry.label.fr }, en: { label: entry.label.en } })

                if (entry.external) {
                  return <li class="px-4 flex flex-col gap-2"><a href={entry.href} target="_blank" rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    class="
                  text-center secondary border-primary border px-2 py-2 
                  rounded-sm transition-all duration-300 hover:bg-primary/10 hover:text-primary
                ">
                    {t().label}
                  </a></li>;
                }
                return (
                  <li class="px-4 flex flex-col gap-2"><a
                    href={`/${lang()}${entry.href}`}
                    data-highlighted={entry.highlighted}
                    data-green={entry.green}
                    class="
                    data-[green=true]:text-emerald-500
                    data-[green=true]:hover:text-emerald-500
                    data-[green=true]:border-emerald-500
                  hover:text-primary text-text text-center
                  data-[highlighted=true]:text-secondary 
                  border border-transparent hover:bg-primary/10 
                  data-[highlighted=true]:hover:text-white rounded-sm px-2 py-2 transition-all duration-300 data-[highlighted=true]:border-secondary data-[highlighted=true]:hover:bg-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    {t().label}
                  </a></li>
                );
              }}
            </For>
          </ul>
        </div>
      </div>
    </div>
  )
}