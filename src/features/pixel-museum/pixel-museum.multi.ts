import type kaplay from 'kaplay'
import { createRemotePlayer } from './entities/remote-player.create'
import { gameRoom } from './pixem-museum-init-game'
import type { createPlayer } from './entities/player.create'
import type { Room } from 'colyseus.js'

type MultiplayerOptions = {
  k: ReturnType<typeof kaplay>
  player: NonNullable<Awaited<ReturnType<typeof createPlayer>>>
  startPosition: { x: number; y: number }
}

export const initMultiplayer = async ({
  k,
  player,
  startPosition,
}: MultiplayerOptions) => {
  const room = gameRoom
  if (!room || !room.state || !player) return

  const remotePlayers = new Map<
    string,
    NonNullable<Awaited<ReturnType<typeof createRemotePlayer>>>
  >()

  let lastSentPosition = { x: startPosition.x, y: startPosition.y }
  const SYNC_INTERVAL = 0.1
  let syncTimer = 0
  let isInitializing = false

  player.onUpdate(() => {
    if (!k || !player) return
    const dt = k.dt()
    syncTimer += dt

    const dx = Math.abs(player.pos.x - lastSentPosition.x)
    const dy = Math.abs(player.pos.y - lastSentPosition.y)

    if (dx > 2 || dy > 2 || syncTimer >= SYNC_INTERVAL) {
      try {
        if (room && room.send) {
          const connection = (room as Room).connection
          if (connection && connection.isOpen === false) {
            return
          }

          room.send('playerMove', {
            x: player.pos.x,
            y: player.pos.y,
            flipX: player.flipX || false,
            anim: player.getCurAnim()?.name || 'stand',
          })
          lastSentPosition = { x: player.pos.x, y: player.pos.y }
          syncTimer = 0
        }
      } catch (error) {
        if (
          error instanceof Error &&
          !error.message.includes('CLOSING') &&
          !error.message.includes('CLOSED')
        ) {
          console.debug("Erreur lors de l'envoi de la position:", error)
        }
      }
    }
  })

  const initRemotePlayers = async () => {
    if (isInitializing) {
      console.debug('initRemotePlayers déjà en cours')
      return
    }

    if (!room.state.players) {
      console.debug("room.state.players n'est pas encore initialisé")
      return
    }

    const players = room.state.players
    if (!players) return

    isInitializing = true

    const creatingPlayers = new Set<string>() // Pour éviter les créations simultanées

    const createOrUpdateRemotePlayer = async (
      sessionId: string,
      playerState: Room['state']['players']
    ) => {
      if (sessionId === room.sessionId) return

      let remotePlayer = remotePlayers.get(sessionId)

      if ((!remotePlayer || !remotePlayer.exists()) && !creatingPlayers.has(sessionId)) {
        creatingPlayers.add(sessionId)
        try {
          const newRemotePlayer = await createRemotePlayer(k, {
            playerId: sessionId,
            initialPosition: {
              x: playerState.x || startPosition.x + 50,
              y: playerState.y || startPosition.y,
            },
          })
          if (newRemotePlayer) {
            const existing = remotePlayers.get(sessionId)
            if (existing && existing.exists()) {
              newRemotePlayer.destroy()
            } else {
              remotePlayer = newRemotePlayer
              remotePlayers.set(sessionId, remotePlayer)
            }
          }
        } finally {
          creatingPlayers.delete(sessionId)
        }

        if (!remotePlayer) return
      }

      if (!remotePlayer || !remotePlayer.exists()) return
      if (playerState.x !== undefined) remotePlayer.pos.x = playerState.x
      if (playerState.y !== undefined) remotePlayer.pos.y = playerState.y
      if (playerState.flipX !== undefined)
        remotePlayer.flipX = playerState.flipX
      if (
        playerState.anim &&
        remotePlayer.getCurAnim()?.name !== playerState.anim
      ) {
        try {
          remotePlayer.play(playerState.anim)
        } catch (e) { }
      }
    }

    const removeRemotePlayer = (sessionId: string) => {
      const remotePlayer = remotePlayers.get(sessionId)
      if (remotePlayer && remotePlayer.exists()) {
        remotePlayer.destroy()
      }
      remotePlayers.delete(sessionId)
    }

    if (
      typeof players.onAdd === 'function' &&
      typeof players.onRemove === 'function'
    ) {
      players.onAdd(
        (playerState: Room['state']['players'], sessionId: string) => {
          createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
            console.debug('Erreur lors de la création du joueur distant:', error)
          })

          if (playerState.onChange) {
            playerState.onChange(() => {
              createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
                console.debug('Erreur lors de la mise à jour du joueur distant:', error)
              })
            })
          }
        }
      )

      players.onRemove(
        (_playerState: Room['state']['players'], sessionId: string) => {
          removeRemotePlayer(sessionId)
        }
      )

      // Ne pas appeler players.forEach si onAdd existe, car onAdd gère déjà les nouveaux joueurs
      // On initialise seulement les joueurs existants une fois
      players.forEach(
        (playerState: Room['state']['players'], sessionId: string) => {
          // Vérifier qu'on n'a pas déjà créé ce joueur via onAdd
          if (!remotePlayers.has(sessionId)) {
            createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
              console.debug('Erreur lors de la création du joueur distant:', error)
            })

            if (playerState.onChange) {
              playerState.onChange(() => {
                createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
                  console.debug('Erreur lors de la mise à jour du joueur distant:', error)
                })
              })
            }
          }
        }
      )
    } else {
      let lastPlayersSize = 0
      const knownPlayerIds = new Set<string>()

      k.onUpdate(() => {
        if (!room.state.players) return

        const currentSize = players.size || 0

        players.forEach(
          (playerState: Room['state']['players'], sessionId: string) => {
            if (!knownPlayerIds.has(sessionId)) {
              knownPlayerIds.add(sessionId)
              createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
                console.debug('Erreur lors de la création du joueur distant:', error)
              })

              if (playerState.onChange) {
                playerState.onChange(() => {
                  createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
                    console.debug('Erreur lors de la mise à jour du joueur distant:', error)
                  })
                })
              }
            } else {
              createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
                console.debug('Erreur lors de la mise à jour du joueur distant:', error)
              })
            }
          }
        )

        if (currentSize < lastPlayersSize) {
          const currentPlayerIds = new Set<string>()
          players.forEach(
            (_playerState: Room['state']['players'], sessionId: string) => {
              currentPlayerIds.add(sessionId)
            }
          )

          knownPlayerIds.forEach((sessionId) => {
            if (!currentPlayerIds.has(sessionId)) {
              knownPlayerIds.delete(sessionId)
              removeRemotePlayer(sessionId)
            }
          })
        }

        lastPlayersSize = currentSize
      })
    }

    players.forEach(
      (playerState: Room['state']['players'], sessionId: string) => {
        createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
          console.debug('Erreur lors de la création du joueur distant:', error)
        })

        if (playerState.onChange) {
          playerState.onChange(() => {
            createOrUpdateRemotePlayer(sessionId, playerState).catch((error) => {
              console.debug('Erreur lors de la mise à jour du joueur distant:', error)
            })
          })
        }
      }
    )

    isInitializing = false
  }

  initRemotePlayers()

  if (room.onStateChange) {
    room.onStateChange(() => {
      if (room.state && room.state.players && remotePlayers.size === 0 && !isInitializing) {
        initRemotePlayers()
      }
    })
  }
}
