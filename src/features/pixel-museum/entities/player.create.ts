import type kaplay from 'kaplay'
import { CONTROLS, SOUNDS, TAGS } from '../pixel-museum.const'
import { playSound } from '../pixel-museum-sound.ctrl'
import { openGamePanelInfo } from '../game-panel-info.ctrl'

type Options = {
  levelWidth: number
  levelHeight: number
  startPosition: { x: number; y: number }
}

export const createPlayer = async (
  k: ReturnType<typeof kaplay>,
  { levelWidth, levelHeight, startPosition }: Options
) => {
  if (!k) return console.error('kaplay non trouvé')
  const { Rect } = k

  const IDLE_DELAY = 10

  const ANIMS = {
    STAND: 'stand',
    WALK: 'walk',
    FALL: 'fall',
    JUMP: 'jump',
    GROUNDED: 'grounded',
    INTERACT: 'interact',
    BEFORE_WAIT: 'before-wait',
    WAIT: 'wait',
  }

  let canJump = true,
    isInteracting = false,
    isInteractingAnim = false,
    moveLeft = false,
    moveRight = false,
    isPlayingGroundedAnim = false,
    wasGrounded = false,
    idleTimer = 0,
    isInIdleAnim = false,
    isPlayingWaitAnim = false

  const COMPOSED_MAX = 50
  const COMPOSED_MIN = 1
  const COMPOSED_NUMBER =
    Math.floor(Math.random() * (COMPOSED_MAX - COMPOSED_MIN + 1)) + COMPOSED_MIN
  const COMPOSED_NAME = `sagwa_composed_${COMPOSED_NUMBER}`

  const BASE_URL = `${window.location.protocol}//${window.location.host}/pixel-museum`

  if (!k.getSprite(COMPOSED_NAME)) {
    await k.loadAseprite(COMPOSED_NAME, `${BASE_URL}/entities/composed/${COMPOSED_NAME}.png`, `${BASE_URL}/entities/sagwa.json`)
  }

  k.wait(300)

  const player = k.add([
    k.sprite(COMPOSED_NAME, {
      anim: ANIMS.STAND,
    }),
    k.pos(Math.round(startPosition.x || 0), Math.round(startPosition.y || 0)),
    k.body({
      jumpForce: 100,
    }),
    k.area({
      shape: new Rect(k.vec2(0), 15, 32),
    }),
    k.anchor('bot'),
    k.z(98),
    'player',
  ])

  const resetIdleTimer = () => {
    idleTimer = 0
    if (isInIdleAnim || isPlayingWaitAnim) {
      isInIdleAnim = false
      isPlayingWaitAnim = false
    }
  }

  k.onKeyDown(CONTROLS.MOVE_LEFT as unknown as string[], () => {
    moveLeft = true
    player.flipX = true
    resetIdleTimer()
  })

  k.onKeyDown(CONTROLS.MOVE_RIGHT as unknown as string[], () => {
    moveRight = true
    player.flipX = false
    resetIdleTimer()
  })

  k.onKeyRelease(CONTROLS.MOVE_LEFT as unknown as string[], () => {
    moveLeft = false
  })

  k.onKeyRelease(CONTROLS.MOVE_RIGHT as unknown as string[], () => {
    moveRight = false
  })


  k.onKeyPress(CONTROLS.JUMP as unknown as string[], () => {

    if (player.isGrounded() && canJump) {
      canJump = false
      isInteracting = false
      isInteractingAnim = false
      if (isPlayingGroundedAnim) {
        isPlayingGroundedAnim = false
      }
      resetIdleTimer()
      player.jump(400)
      playSound(k, SOUNDS.JUMP)
      player.play(ANIMS.JUMP, {
        loop: false,
      })
    }
  })

  k.onKeyPress(CONTROLS.INTERACT as unknown as string[], async () => {

    const collisionsDoc = player.getCollisions().find(collision => collision.target.tags.includes(TAGS.DOC))
    const collisionsMachine = player.getCollisions().find(collision => collision.target.tags.includes(TAGS.MACHINE))

    if (collisionsDoc) {
      const id = collisionsDoc.target.tags.find(tag => tag.startsWith('id-'))?.replace('id-', '')
      if (!id) return
      openGamePanelInfo(id)
    } else if (collisionsMachine) {
      if (collisionsMachine.target.getCurAnim()?.name == 'ignition') return

      if (collisionsMachine.target.getCurAnim()?.name == 'on') {
        collisionsMachine.target.play('off', {
          loop: false
        })
      } else {

        collisionsMachine.target.play('ignition', {
          loop: false,
          onEnd() {
            k.wait(0, () => {
              collisionsMachine.target.play('on', {
                loop: true,
              })
            })
          }
        })
        playSound(k, SOUNDS.IGNITION)
      }
    } else {
      //no animation if no collision with machine or doc
      return
    }

    if (isInteractingAnim) return
    isInteractingAnim = true
    isInteracting = true
    isPlayingGroundedAnim = false

    isInIdleAnim = false
    isPlayingWaitAnim = false
    resetIdleTimer()



    try {
      player.play(ANIMS.INTERACT, {
        loop: false,
        onEnd() {
          isInteractingAnim = false
          isInteracting = false
        },
      })
    } catch (e) {
      isInteractingAnim = false
      isInteracting = false
    }
  })


  player.onUpdate(() => {
    if (!k || !player) return
    const dt = k.dt()
    const isGrounded = player.isGrounded()

    canJump = isGrounded


    if (
      isGrounded &&
      !wasGrounded &&
      !isPlayingGroundedAnim &&
      !isInteracting
    ) {

      try {
        player.play(ANIMS.GROUNDED, {
          loop: false,
          onEnd() {
            isPlayingGroundedAnim = false
          },
        })
        isPlayingGroundedAnim = true
      } catch (e) {
        isPlayingGroundedAnim = false
      }
    }

    wasGrounded = isGrounded

    if (isInteractingAnim) {
      player.vel.x = 0
    } else if (moveLeft) {
      player.vel.x = -180
    } else if (moveRight) {
      player.vel.x = 180
    } else {
      player.vel.x = 0
    }

    const isActuallyMoving = Math.abs(player.vel.x) > 10

    if (
      isActuallyMoving ||
      !isGrounded ||
      player.isJumping() ||
      isInteractingAnim ||
      moveLeft ||
      moveRight
    ) {
      resetIdleTimer()
    } else if (
      isGrounded &&
      !isActuallyMoving &&
      !player.isJumping() &&
      !isInteractingAnim
    ) {
      if (!isInIdleAnim && !isPlayingWaitAnim) {
        idleTimer += dt

        if (idleTimer >= IDLE_DELAY) {
          isInIdleAnim = true
          try {
            player.play(ANIMS.BEFORE_WAIT, {
              loop: false,
              onEnd() {
                isInIdleAnim = false
                isPlayingWaitAnim = true

                const playWaitLoop = () => {
                  try {
                    player.play(ANIMS.WAIT, {
                      loop: false,
                      onEnd() {
                        if (isPlayingWaitAnim) {
                          playWaitLoop()
                        }
                      },
                    })
                  } catch (e) {
                    isPlayingWaitAnim = false
                  }
                }
                playWaitLoop()
              },
            })
          } catch (e) {
            isInIdleAnim = false
          }
        }
      } else if (isPlayingWaitAnim) {
        try {
          if (player?.getCurAnim()?.name !== ANIMS.WAIT) {
            player.play(ANIMS.WAIT, {
              loop: true,
            })
          }
        } catch (e) {
          isPlayingWaitAnim = false
        }
      }
    }

    try {
      if (
        !isPlayingGroundedAnim &&
        !isInteractingAnim &&
        !isInIdleAnim &&
        !isPlayingWaitAnim
      ) {
        let targetAnim: string | null = null

        if (!isGrounded && player.vel.y > 0) {
          targetAnim = ANIMS.FALL
        } else if (isGrounded && !isActuallyMoving && !player.isJumping()) {
          targetAnim = ANIMS.STAND
        } else if (isGrounded && isActuallyMoving && !player.isJumping()) {
          targetAnim = ANIMS.WALK
        }

        if (targetAnim && player?.getCurAnim()?.name !== targetAnim) {
          player.play(targetAnim)
        }
      }
    } catch (e) { }

    const gameHeight = k.height?.() || 0
    let camX = Math.round(player?.pos?.x || 0)
    let camY = Math.round(player?.pos?.y || 0 - gameHeight / 4)

    const minCamX = 0
    const maxCamX = Math.max(0, levelWidth - 100)
    const minCamY = 100
    const maxCamY = Math.max(100, levelHeight - gameHeight - 120)

    camX = Math.max(minCamX, Math.min(camX, maxCamX))
    camX += 30
    camY = Math.max(minCamY, Math.min(camY, maxCamY))
    k.setCamPos(camX, camY)
  })

  return player
}
