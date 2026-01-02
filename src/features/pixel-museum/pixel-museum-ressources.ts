import type kaplay from 'kaplay'

export const pixelMuseumRessources = async (k: ReturnType<typeof kaplay>) => {
  const BASE_URL = `${window.location.protocol}//${window.location.host}/pixel-museum`

  const sounds = ['jump', 'explosion', 'hurt', 'bythepond']

  const fonts = [
    'Silkscreen/Silkscreen-Regular.ttf',
    'Silkscreen/Silkscreen-Bold.ttf',
  ]

  const aseprites = [
    'lulu',
    'furniture',
    'whole',
    'games',
    'bomberman',
    'computer-space',
    'vectrex',
    'wonderswan',
    'virtualboy',
    '3do',
    'nes',
    'portal'
  ]

  for (const aseprite of aseprites) {
    k.loadAseprite(aseprite, `${BASE_URL}/entities/${aseprite}.png`, `${BASE_URL}/entities/${aseprite}.json`)
  }

  for (const sound of sounds) {
    k.loadSound(sound, `${BASE_URL}/sounds/${sound}.mp3`).catch(() => {
      console.debug(`Son ${sound} non disponible`)
    })
  }

  for (const font of fonts) {
    const fontName = font.split('/')[1].split('.')[0]
    k.loadFont(fontName, `${BASE_URL}/fonts/${font}`)
  }
}
