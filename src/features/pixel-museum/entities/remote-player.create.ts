import type kaplay from 'kaplay'

type RemotePlayerOptions = {
  playerId: string
  initialPosition: { x: number; y: number }
}

export const createRemotePlayer = (
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

  const remotePlayer = k.add([
    k.sprite(COMPOSED_NAME, {
      anim: 'stand',
    }),
    k.pos(Math.round(initialPosition.x), Math.round(initialPosition.y)),
    k.anchor('bot'),
    k.z(98),
    `remote-player-${playerId}`,
    'remote-player',
  ])

  return remotePlayer
}

