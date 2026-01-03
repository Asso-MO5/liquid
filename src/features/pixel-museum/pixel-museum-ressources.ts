import type kaplay from 'kaplay'
import { ASEPRITES, FONTS, SOUNDS, SPRITES } from './pixel-museum.const'

export const pixelMuseumRessources = async (k: ReturnType<typeof kaplay>) => {
  const BASE_URL = `${window.location.protocol}//${window.location.host}/pixel-museum`

  for (const aseprite of Object.values(ASEPRITES)) {
    k.loadAseprite(aseprite, `${BASE_URL}/entities/${aseprite}.png`, `${BASE_URL}/entities/${aseprite}.json`)
  }

  for (const sprite of Object.values(SPRITES)) {
    k.loadSprite(sprite, `${BASE_URL}/tiles/${sprite}.png`)
  }

  for (const sound of Object.values(SOUNDS)) {
    k.loadSound(sound, `${BASE_URL}/sounds/${sound}.mp3`).catch(() => {
      console.debug(`Son ${sound} non disponible`)
    })
  }

  for (const font of Object.values(FONTS)) {
    const fontName = font.split('/')[1].split('.')[0]
    k.loadFont(fontName, `${BASE_URL}/fonts/${font}`)
  }
}
