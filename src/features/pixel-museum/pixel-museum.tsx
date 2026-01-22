import { Show } from 'solid-js'
import { translate } from "~/utils/translate"
import { pixelMuseumCtrl } from './pixel-museum.ctrl'
import { PixelMuseumCanvas } from './pixel-museum-canva'
import { pixelMuseumTxt } from "./pixel-museum.texts"
import { GamePanelInfo } from './game-panel-info'
import { HUD } from './hud'

export const PixelMuseum = () => {
  const { t } = translate(pixelMuseumTxt)
  const { gameIsReady, webglIsSupported } = pixelMuseumCtrl()

  return (
    <div
      class="w-full h-full relative"
      role="group"
      aria-label={t().altCanvas}
    >
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
