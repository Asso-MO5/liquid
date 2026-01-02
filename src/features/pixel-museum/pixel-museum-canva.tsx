import { CANVAS_ID } from "./pixel-museum.const"
import { translate } from "~/utils/translate"
import { pixelMuseumTxt } from "./pixel-museum.texts"
import { pixelMuseumInitGame } from "./pixem-museum-init-game"

export const PixelMuseumCanvas = () => {
  const { t } = translate(pixelMuseumTxt)
  pixelMuseumInitGame()
  return (
    <div
      id={CANVAS_ID}
      aria-label={t().altCanvas}
      class="w-full h-full relative overflow-hidden"
      style={{
        'image-rendering': 'pixelated',
        'touch-action': 'pan-y',
        'pointer-events': 'auto',
      }}
    />
  )
}