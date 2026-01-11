import type kaplay from 'kaplay'

type RemotePlayerOptions = {
  playerId: string
  initialPosition: { x: number; y: number }
}

export const createRemotePlayer = async (
  k: ReturnType<typeof kaplay>,
  { playerId, initialPosition }: RemotePlayerOptions
) => {

  if (!k) {
    console.error('kaplay non trouvé')
    return
  }

  const COMPOSED_MAX = 50
  const COMPOSED_MIN = 1
  const COMPOSED_NUMBER = Math.floor(Math.random() * (COMPOSED_MAX - COMPOSED_MIN + 1)) + COMPOSED_MIN
  const COMPOSED_NAME = `sagwa_composed_${COMPOSED_NUMBER}`
  const BASE_URL = `${window.location.protocol}//${window.location.host}/pixel-museum`

  if (!k.getSprite(COMPOSED_NAME)) {
    await k.loadAseprite(COMPOSED_NAME, `${BASE_URL}/entities/composed/${COMPOSED_NAME}.png`, `${BASE_URL}/entities/sagwa.json`)
  }

  k.wait(300)
  const remotePlayer = k.add([
    k.sprite(COMPOSED_NAME, {
      anim: 'stand',
    }),
    k.pos(Math.round(initialPosition.x || 0), Math.round(initialPosition.y || 0)),
    k.anchor('bot'),
    k.z(98),
    `remote-player-${playerId}`,
    'remote-player',
  ])

  return remotePlayer
}

