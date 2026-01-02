import type kaplay from 'kaplay'
import {
  ASEPRITES,
  FONTS,
  IMAGES,
  OBJECTS,
  SOUNDS,
  SPRITES,
} from './pixel-museum.const'

export const pixelMuseumRessources = async (k: ReturnType<typeof kaplay>) => {
  const BASE_URL = `${window.location.protocol}//${window.location.host}/pixel-museum`

  for (const aseprite of Object.values(ASEPRITES)) {
    k.loadAseprite(
      aseprite,
      `${BASE_URL}/entities/${aseprite}.png`,
      `${BASE_URL}/entities/${aseprite}.json`
    )
  }

  // SAGWA - Changement de sprite composé aléatoire
  for (let i = 1; i <= 50; i++) {
    k.loadAseprite(
      `sagwa_composed_${i}`,
      `${BASE_URL}/entities/composed/sagwa_composed_${i}.png`,
      `${BASE_URL}/entities/sagwa.json`
    )
  }

  for (const sprite of Object.values(SPRITES)) {
    k.loadSprite(sprite, `${BASE_URL}/tiles/${sprite}.png`)
  }

  for (const object of Object.values(OBJECTS)) {
    k.loadSprite(object, `${BASE_URL}/objs/${object}.png`)
  }

  for (const image of Object.values(IMAGES)) {
    k.loadSprite(image, `${BASE_URL}/images/${image}.webp`)
  }

  for (const sound of Object.values(SOUNDS)) {
    k.loadSound(sound, `${BASE_URL}/sounds/${sound}.ogg`).catch(() => {
      console.debug(`Son ${sound} non disponible`)
    })
  }

  for (const font of Object.values(FONTS)) {
    const fontName = font.split('/')[1].split('.')[0]
    k.loadFont(fontName, `${BASE_URL}/fonts/${font}`)
  }
}
