import { A } from "@solidjs/router"
import { For } from "solid-js"
import { legalLinks, resourcesLinks, socialLinks } from "./footer.const"
import { langCtrl } from "~/features/lang-selector/lang.ctrl"
import { PowerBy } from "~/features/power-by/power-by"

export const Footer = () => {
  const lang = langCtrl()

  return (
    <footer class="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 mt-16 pt-4 border-t dark:border-white/10">
      {/* Liens légaux */}
      <div>
        <h2 class="text-xl mb-4 text-text/80">
          {lang() === 'fr' ? 'Informations légales' : 'Legal information'}
        </h2>
        <ul class="flex flex-col gap-2">
          <For each={legalLinks}>
            {(link) => (
              <li>
                <A
                  href={`/${lang()}${link.href}`}
                  class="text-sm text-text/70 hover:text-text transition-colors"
                >
                  {link.label[lang()]}
                </A>
              </li>
            )}
          </For>
        </ul>
      </div>

      {/* Ressources */}
      <div>
        <h2 class="text-xl mb-4 text-text/80">
          {lang() === 'fr' ? 'Ressources' : 'Resources'}
        </h2>
        <ul class="flex flex-col gap-2">
          <For each={resourcesLinks}>
            {(link) => (
              <li>
                <A
                  href={`/${lang()}${link.href}`}
                  class="text-sm text-text/70 hover:text-text transition-colors"
                >
                  {link.label[lang()]}
                </A>
              </li>
            )}
          </For>
        </ul>
      </div>

      {/* Réseaux sociaux */}
      <div>
        <h2 class="text-xl mb-4 text-text/80">
          {lang() === 'fr' ? 'Suivez-nous' : 'Follow us'}
        </h2>
        <ul class="flex flex-col gap-2">
          <For each={socialLinks}>
            {(link) => (
              <li>
                <A
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-text/70 hover:text-text transition-colors"
                >
                  {link.label[lang()]}
                </A>
              </li>
            )}
          </For>
        </ul>
      </div>
      <div class="sm:col-span-3 flex justify-center items-center">
        <PowerBy />
      </div>
    </footer>
  )
}
