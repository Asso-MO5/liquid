import { useLocation, useNavigate, useParams } from "@solidjs/router";
import { LANGS } from "./lang-selector.const";
import { createSignal, For, onMount, Show } from "solid-js";

export const LangSelector = () => {
  const { lang: langParams } = useParams();
  const navigate = useNavigate();
  const path = useLocation();
  const [selectedLang, setSelectedLang] = createSignal('');

  const changeLang = (lang: "fr" | "en") => {
    navigate(path.pathname.replace(selectedLang() || '', lang) + window.location.search);
    setSelectedLang(lang);
  }
  onMount(() => {
    setSelectedLang(langParams);
  });

  return <> <Show when={selectedLang()}>
    <select id="lang-selector" value={selectedLang() || "fr"} onInput={(e) => changeLang(e.currentTarget?.value as "fr" | "en")}>
      <For each={LANGS}>
        {(lang) => <option value={lang.value}>{lang.label[lang.value as "fr" | "en"]}</option>}
      </For>
    </select>
  </Show>
    <Show when={!selectedLang()}>
      <select id="lang-selector" value={selectedLang() || "fr"} onInput={(e) => changeLang(e.currentTarget?.value as "fr" | "en")}>
        <option value="fr">FR</option>
      </select>
    </Show>
  </>
}