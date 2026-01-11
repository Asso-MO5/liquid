import type kaplay from 'kaplay'
import {
  ASEPRITES,
  FONTS,
  IMAGES,
  OBJECTS,
  SOUNDS,
  SPRITES,
} from './pixel-museum.const'

export const pixelMuseumRessources = async (k: ReturnType<typeof kaplay>, baseUrl: string) => {

  for (const aseprite of Object.values(ASEPRITES)) {
    await k.loadAseprite(
      aseprite,
      `${baseUrl}/entities/${aseprite}.png`,
      `${baseUrl}/entities/${aseprite}.json`
    )
  }

  for (const sprite of Object.values(SPRITES)) {
    await k.loadSprite(sprite, `${baseUrl}/tiles/${sprite}.png`)
  }

  for (const object of Object.values(OBJECTS)) {
    await k.loadSprite(object, `${baseUrl}/objs/${object}.png`)
  }

  for (const image of Object.values(IMAGES)) {
    await k.loadSprite(image, `${baseUrl}/images/${image}.webp`)
  }

  for (const sound of Object.values(SOUNDS)) {
    await k.loadSound(sound, `${baseUrl}/sounds/${sound}.ogg`).catch(() => {
      console.debug(`Son ${sound} non disponible`)
    })
  }

  for (const font of Object.values(FONTS)) {
    const fontName = font.split('/')[1].split('.')[0]
    await k.loadFont(fontName, `${baseUrl}/fonts/${font}`)
  }
}
