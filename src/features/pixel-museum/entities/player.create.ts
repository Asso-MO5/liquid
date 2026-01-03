import type kaplay from "kaplay";
import { CONTROLS, SOUNDS } from "../pixel-museum.const";


type Options = {
  levelWidth: number,
  levelHeight: number,
  startPosition: { x: number, y: number }
}

export const createPlayer = (k: ReturnType<typeof kaplay>, { levelWidth, levelHeight, startPosition }: Options) => {
  if (!k) return console.error('kaplay non trouvé');
  const { Rect } = k;

  const IDLE_DELAY = 10;

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

  let
    canJump = true,
    isJumping = false,
    isInteracting = false,
    isInteractingAnim = false,
    moveLeft = false,
    moveRight = false,
    isPlayingGroundedAnim = false,
    wasGrounded = false,
    idleTimer = 0,
    isInIdleAnim = false,
    isPlayingWaitAnim = false;


  const player = k.add([
    k.sprite('lulu', {
      anim: ANIMS.STAND,
    }),
    k.pos(Math.round(startPosition.x), Math.round(startPosition.y)),
    k.body({
      jumpForce: 100,
    }),
    k.area({
      shape: new Rect(k.vec2(0), 15, 32),
    }),
    k.anchor('bot'),
    'player',
  ]);

  const resetIdleTimer = () => {
    idleTimer = 0;
    if (isInIdleAnim || isPlayingWaitAnim) {
      isInIdleAnim = false;
      isPlayingWaitAnim = false;
    }
  };

  k.onKeyDown(CONTROLS.MOVE_LEFT as unknown as string[], () => {
    moveLeft = true;
    player.flipX = true;
    resetIdleTimer();
  });

  k.onKeyDown(CONTROLS.MOVE_RIGHT as unknown as string[], () => {
    moveRight = true;
    player.flipX = false;
    resetIdleTimer();
  });

  k.onKeyRelease(CONTROLS.MOVE_LEFT as unknown as string[], () => {
    moveLeft = false;
  });

  k.onKeyRelease(CONTROLS.MOVE_RIGHT as unknown as string[], () => {
    moveRight = false;
  });


  k.onKeyPress(CONTROLS.INTERACT as unknown as string[], () => {
    if (isInteractingAnim) return;

    console.log('interact !');
    player.play(ANIMS.INTERACT, {
      loop: false,
      onEnd() {
        isInteractingAnim = false;
        isInteracting = false;
      },
    });
  });

  k.onKeyPress(CONTROLS.JUMP as unknown as string[], () => {

    if (player.isGrounded() && canJump && !isInteracting) {
      isJumping = true;
      canJump = false;
      if (isPlayingGroundedAnim) {
        isPlayingGroundedAnim = false;
      }
      resetIdleTimer();
      player.jump(400);
      k.play(SOUNDS.JUMP as unknown as string);
      player.play(ANIMS.JUMP, {
        loop: false
      });
    }
  });

  player.onUpdate(() => {
    const dt = k.dt();
    const isGrounded = player.isGrounded();

    if (isGrounded && !wasGrounded && !isPlayingGroundedAnim && !isInteractingAnim) {
      // Touche le sol
      canJump = true;
      try {
        player.play(ANIMS.GROUNDED, {
          loop: false,
          onEnd() {
            isJumping = false;
            isPlayingGroundedAnim = false;
          },
        });
        isPlayingGroundedAnim = true;
      } catch (e) {
        isPlayingGroundedAnim = false;
      }
    }

    wasGrounded = isGrounded;

    if (moveLeft) {
      if (isGrounded) {
        player.vel.x = -164;
      } else {
        player.vel.x = -164;
      }
    } else if (moveRight) {
      if (isGrounded) {
        player.vel.x = 164;
      } else {
        player.vel.x = 164;
      }
    } else {
      player.vel.x = 0;
    }

    const isActuallyMoving = Math.abs(player.vel.x) > 10;

    if (isActuallyMoving || !isGrounded || isJumping || isInteractingAnim || moveLeft || moveRight) {
      resetIdleTimer();
    } else if (isGrounded && !isActuallyMoving && !isJumping && !isInteractingAnim) {
      if (!isInIdleAnim && !isPlayingWaitAnim) {
        idleTimer += dt;

        if (idleTimer >= IDLE_DELAY) {
          isInIdleAnim = true;
          try {
            player.play(ANIMS.BEFORE_WAIT, {
              loop: false,
              onEnd() {
                isInIdleAnim = false;
                isPlayingWaitAnim = true;

                const playWaitLoop = () => {
                  try {
                    player.play(ANIMS.WAIT, {
                      loop: false,
                      onEnd() {
                        if (isPlayingWaitAnim) {
                          playWaitLoop();
                        }
                      },
                    });
                  } catch (e) {
                    isPlayingWaitAnim = false;
                  }
                };
                playWaitLoop();
              },
            });
          } catch (e) {
            isInIdleAnim = false;
          }
        }
      } else if (isPlayingWaitAnim) {
        try {
          if (player?.getCurAnim()?.name !== ANIMS.WAIT) {
            player.play(ANIMS.WAIT, {
              loop: true,
            });
          }
        } catch (e) {
          isPlayingWaitAnim = false;
        }
      }
    }

    try {
      if (!isPlayingGroundedAnim && !isInteractingAnim && !isInIdleAnim && !isPlayingWaitAnim) {
        let targetAnim: string | null = null;

        if (!isGrounded && player.vel.y > 0) {
          targetAnim = ANIMS.FALL;
        } else if (isGrounded && !isActuallyMoving && !isJumping) {
          targetAnim = ANIMS.STAND;
        } else if (isGrounded && isActuallyMoving && !isJumping) {
          targetAnim = ANIMS.WALK;
        }

        if (targetAnim && player?.getCurAnim()?.name !== targetAnim) {
          player.play(targetAnim);
        }
      }
    } catch (e) {
      // no break the loop
    }

    const gameWidth = k.width?.() || 0;
    const gameHeight = k.height?.() || 0;

    let camX = Math.round(player?.pos?.x || 0);
    let camY = Math.round(player?.pos?.y || 0 - gameHeight / 4);

    const minCamX = 0;
    const maxCamX = Math.max(0, levelWidth - 100);
    const minCamY = 100;
    const maxCamY = Math.max(100, levelHeight - gameHeight - 120);

    camX = Math.max(minCamX, Math.min(camX, maxCamX));
    camX += 30;

    // Ne pas sortir de la zone de jeu à gauche
    if (camX < 200) {
      //    camX = 200;
    }
    camY = Math.max(minCamY, Math.min(camY, maxCamY));

    k.setCamPos(camX, camY);
  });

  return player;

}
