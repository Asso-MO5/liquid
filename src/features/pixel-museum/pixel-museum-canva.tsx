import { CANVAS_ID } from "./pixel-museum.const"
import { pixelMuseumInitGame } from "./pixem-museum-init-game"

export const PixelMuseumCanvas = () => {
  pixelMuseumInitGame()
  return (
    <div
      id={CANVAS_ID}
      class="w-full h-full relative overflow-hidden"
      style={{
        'image-rendering': 'pixelated',
        'touch-action': 'pan-y',
        'pointer-events': 'auto',
      }}
    />
  )
}