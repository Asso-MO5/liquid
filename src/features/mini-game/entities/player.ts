import type Kaplay from 'kaplay';
import { CONTROLS } from '../mini-game.const';
import { openGamePanelInfo } from '../game-panel-info.ctrl';

type MachineEntity = {
  pos: { x: number; y: number };
  tags: string[];
};

export function createPlayer(gameInstance: ReturnType<typeof Kaplay>, { levelWidth, levelHeight, BASE_URL, startPosition }: { levelWidth: number, levelHeight: number, BASE_URL: string, startPosition: { x: number, y: number } }) {

  gameInstance.loadAseprite("lulu", `${BASE_URL}/entities/lulu.png`, `${BASE_URL}/entities/lulu.json`);
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
    currentMachine: MachineEntity | null = null,
    idleTimer = 0,
    isInIdleAnim = false,
    isPlayingWaitAnim = false;

  const machinesInCollision = new Set<MachineEntity>();

  const player = gameInstance!.add([
    gameInstance!.sprite('lulu', {
      anim: ANIMS.STAND,
    }),
    gameInstance!.pos(Math.round(startPosition.x), Math.round(startPosition.y)),
    gameInstance!.body({
      jumpForce: 100,
    }),
    gameInstance!.area(),
    gameInstance!.anchor('bot'),
    'player',
  ]);

  const resetIdleTimer = () => {
    idleTimer = 0;
    if (isInIdleAnim || isPlayingWaitAnim) {
      isInIdleAnim = false;
      isPlayingWaitAnim = false;
    }
  };

  gameInstance!.onKeyDown(['left', 'a', 'q'], () => {
    moveLeft = true;
    player.flipX = true;
    resetIdleTimer();
  });

  gameInstance!.onKeyDown(['right', 'd'], () => {
    moveRight = true;
    player.flipX = false;
    resetIdleTimer();
  });
  gameInstance!.onKeyRelease(['left', 'a', 'q'], () => {
    moveLeft = false;
  });

  gameInstance!.onKeyRelease(['right', 'd'], () => {
    moveRight = false;
  });

  // Gestion des collisions avec les machines
  player.onCollide('machine', (machine) => {
    const machineEntity = machine as unknown as MachineEntity;
    machinesInCollision.add(machineEntity);
  });

  player.onCollideEnd('machine', (machine) => {
    const machineEntity = machine as unknown as MachineEntity;
    machinesInCollision.delete(machineEntity);

    if (currentMachine === machineEntity) {
      currentMachine = null;
      if (isInteracting) {
        isInteracting = false;
        isInteractingAnim = false;
      }
    }
  });

  gameInstance!.onKeyPress(CONTROLS.INTERACT as unknown as string[], () => {
    if (isInteractingAnim || !currentMachine) return;

    const distanceX = Math.abs(currentMachine.pos.x - player.pos.x);
    const maxDistance = (currentMachine as unknown as { width: number }).width || 8;

    if (distanceX > maxDistance) return;

    isInteracting = true;
    isInteractingAnim = true;

    const idPanel = currentMachine.tags.find((tag: string) => tag.startsWith('id-'))?.replace('id-', '');



    if (idPanel) {
      openGamePanelInfo(idPanel);
    }

    player.play(ANIMS.INTERACT, {
      loop: false,
      onEnd() {
        isInteractingAnim = false;
        isInteracting = false;
      },
    });
  });

  // JUMP
  gameInstance!.onKeyPress(['space', 'up', 'w', 'z', 'x'], () => {

    if (player.isGrounded() && canJump && !isInteracting) {
      isJumping = true;
      canJump = false;
      if (isPlayingGroundedAnim) {
        isPlayingGroundedAnim = false;
      }
      resetIdleTimer();
      player.jump(400);
      player.play(ANIMS.JUMP, {
        loop: false,
        onEnd() {
          try {
            gameInstance!.play('jump');
          } catch (e) {
          }
        },
      });
    }
  });

  player.onUpdate(() => {
    const dt = gameInstance!.dt();

    if (machinesInCollision.size > 0) {
      let closestMachine: MachineEntity | null = null;
      let closestDistance = Infinity;

      machinesInCollision.forEach((machine) => {
        const distance = Math.abs(machine.pos.x - player.pos.x);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestMachine = machine;
        }
      });

      currentMachine = closestMachine;
    } else {
      currentMachine = null;
    }

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
        // Incrémenter le timer d'inactivité
        idleTimer += dt;

        // Après 10 secondes, lancer l'animation before-wait
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
        // S'assurer que l'animation wait continue à jouer
        try {
          if (player.curAnim() !== ANIMS.WAIT) {
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

        if (targetAnim && player.curAnim() !== targetAnim) {
          player.play(targetAnim);
        }
      }
    } catch (e) {
      // no break the loop
    }

    const gameWidth = gameInstance!.width?.() || 0;
    const gameHeight = gameInstance!.height?.() || 0;

    let camX = Math.round(player.pos.x);
    let camY = Math.round(player.pos.y - gameHeight / 4);

    const minCamX = 0;
    const maxCamX = Math.max(0, levelWidth - gameWidth);
    const minCamY = -100;
    const maxCamY = Math.max(-100, levelHeight - gameHeight - 120);

    camX = Math.max(minCamX, Math.min(camX, maxCamX));
    camX += 30;

    // Ne pas sortir de la zone de jeu à gauche
    if (camX < 200) {
      camX = 200;
    }

    camY = Math.max(minCamY, Math.min(camY, maxCamY));

    gameInstance!.setCamPos(camX, camY);
  });

  return player;
}