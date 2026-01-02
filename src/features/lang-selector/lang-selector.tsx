import { useLocation, useParams } from '@solidjs/router'
import { LANGS, SELECT } from './lang-selector.const'
import { createSignal, For, onMount, Show } from 'solid-js'

export const LangSelector = () => {
  const { lang: langParams = 'fr' } = useParams()
  const path = useLocation()
  const [selectedLang, setSelectedLang] = createSignal('')

  const changeLang = (lang: 'fr' | 'en') => {
    document.documentElement.setAttribute('lang', lang)
    const newPath = path.pathname.replace(selectedLang() || '', lang) + window.location.search
    setSelectedLang(lang)
    window.history.pushState({}, '', newPath)
    window.location.reload()
  }
  onMount(() => {
    setSelectedLang(langParams)
  })

  return (
    <>
      <Show when={selectedLang()}>
        <select
          class="text-text"
          id="lang-selector"
          value={selectedLang() || 'fr'}
          onInput={(e) => changeLang(e.currentTarget?.value as 'fr' | 'en')}
          title={SELECT[selectedLang() as keyof typeof SELECT].selectLabel}
        >
          <For each={LANGS}>
            {(lang) => (
              <option value={lang.value} class="text-text">
                {lang.label[lang.value as 'fr' | 'en']}
              </option>
            )}
          </For>
        </select>
      </Show>
      <Show when={!selectedLang()}>
        <select
          class="text-text"
          id="lang-selector"
          value={selectedLang() || 'fr'}
          onInput={(e) => changeLang(e.currentTarget?.value as 'fr' | 'en')}
        >
          <option value="fr" class="text-text">FR</option>
        </select>
      </Show>
    </>
  )
}
