import { createAsync } from "@solidjs/router";
import { For, Show } from "solid-js"
import { Loader } from "~/ui/loader";
import { translate } from "~/utils/translate"
import { getMachines } from "./game-alternative.ctrl"
import { gameAlternativeTxt } from "./game-alternative.texts"

export const GameAlternative = () => {
  const { t } = translate(gameAlternativeTxt)

  const machines = createAsync(() => getMachines())

  return (
    <Show when={machines()} fallback={<div class="flex items-center justify-center p-3"><Loader /></div>}>
      <h1>{t().title}</h1>
      <p>{t().intro}</p>
      <p>{t().intro2}</p>

      <ol role="list" class="pb-4 border-b-1">
        <For each={machines()}>
          {(machine) => (
            <li class="py-4">
              <h2 class="pt-4" id={machine.name}>{machine.name}</h2>
              <Show when={machine.description}>
                <div
                  // eslint-disable-next-line solid/no-innerhtml
                  innerHTML={machine.description}
                />
              </Show>
              <Show when={machine.audioUrl}>
                <audio
                  controls
                  class="w-full"
                  src={machine.audioUrl}
                  title={`${t().audioLabel} ${machine.name}`}
                  autoplay={false}
                  muted={false}
                  onError={(e) => {
                    console.error('Erreur lors du chargement de l\'audio:', machine.audioUrl)
                    e.currentTarget.style.display = 'none'
                  }}
                >
                  <source src={machine.audioUrl} />
                  {t().audioNotSupported}
                </audio>
              </Show>
              <Show when={machine.youTubeVideoUrl}>
                <iframe
                  id={`ytplayer-${machine.name}`}
                  width="340"
                  height="240"
                  allowfullscreen
                  class="w-full aspect-video"
                  src={machine.youTubeVideoUrl}
                  title={t().youTubeVideoUrl}
                />
              </Show>
            </li>
          )}
        </For>
      </ol>
      <p class="pt-4">{t().outro}</p>
    </Show>
  )
}