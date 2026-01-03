import { useLocation, useNavigate, useParams } from '@solidjs/router'
import { LANGS, SELECT } from './lang-selector.const'
import { createSignal, For, onMount, Show } from 'solid-js'
import { langCtrl } from './lang.ctrl'

export const LangSelector = () => {
  const lang = langCtrl()
  const navigate = useNavigate()
  const path = useLocation()
  const [selectedLang, setSelectedLang] = createSignal('')

  const changeLang = (lang: 'fr' | 'en') => {
    document.documentElement.setAttribute('lang', lang)

    const splitPath = path.pathname.split('/')
    splitPath[1] = lang
    const newPath = splitPath.join('/')
    navigate(
      newPath + window.location.search
    )
    setSelectedLang(lang)
  }
  onMount(() => {
    setSelectedLang(lang())
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
