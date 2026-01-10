import { Show } from 'solid-js'
import { pixelMuseumCtrl } from './pixel-museum.ctrl'
import { PixelMuseumCanvas } from './pixel-museum-canva'
import { GamePanelInfo } from './game-panel-info'
import { HUD } from './hud'

export const PixelMuseum = () => {
  const { gameIsReady, webglIsSupported } = pixelMuseumCtrl()

  return (
    <div class="w-full h-full relative overflow-hidden">
      <Show when={!gameIsReady()}>
        <img
          src="/img/musee3.webp"
          alt="Pixel Museum"
          class="w-full h-full object-cover absolute inset-0"
        />
      </Show>
      <HUD />
      <Show when={gameIsReady() && webglIsSupported()}>
        <PixelMuseumCanvas />
      </Show>
      <GamePanelInfo />
    </div>
  )
}
