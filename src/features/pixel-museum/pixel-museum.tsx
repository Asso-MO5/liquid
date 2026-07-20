import { Show } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'
import { translate } from '~/utils/translate'
import { GamePanelInfo } from './game-panel-info'
import { HUD } from './hud'
import { pixelMuseumCtrl } from './pixel-museum.ctrl'
import { pixelMuseumTxt } from './pixel-museum.texts'
import { PixelMuseumCanvas } from './pixel-museum-canva'

type PixelMuseumProps = {
  children?: JSX.Element
}

export const PixelMuseum = (props: PixelMuseumProps) => {
  const { t } = translate(pixelMuseumTxt)
  const { gameIsReady, webglIsSupported } = pixelMuseumCtrl()

  return (
    <div class="w-full h-full relative" role="application" aria-label={t().altCanvas}>
      <Show when={props.children}>
        <div class="absolute top-5 md:left-25 md:right-20 left-5 right-10 z-25 bg-bg p-4 max-h-72 md:max-h-full overflow-y-auto">
          {props.children}
        </div>
      </Show>
      <Show when={!gameIsReady()}>
        <img
          src="/img/musee3.webp"
          alt={t().altImage}
          class="w-full h-full object-cover absolute inset-0"
        />
      </Show>
      <Show when={gameIsReady() && webglIsSupported()}>
        <HUD />
        <PixelMuseumCanvas />
        <GamePanelInfo />
      </Show>
    </div>
  )
}
