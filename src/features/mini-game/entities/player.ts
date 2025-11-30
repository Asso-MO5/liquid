import type Kaplay from 'kaplay';
export function createPlayer(gameInstance: ReturnType<typeof Kaplay>, { levelWidth, levelHeight, BASE_URL, startPosition }: { levelWidth: number, levelHeight: number, BASE_URL: string, startPosition: { x: number, y: number } }) {


  // ====== RESOURCES ========================================================
  gameInstance.loadAseprite("lulu", `${BASE_URL}/entities/lulu.png`, `${BASE_URL}/entities/lulu.json`);

  gameInstance.loadSound('jump', `${BASE_URL}/sounds/jump.mp3`).catch(() => {
    console.debug('Son jump non disponible');
  });

  // ====== VARIABLES ========================================================

  const ANIMS = {
    STAND: 'stand',
    WALK: 'walk',
    FALL: 'fall',
    JUMP: 'jump',
    GROUNDED: 'grounded',
  }

  let
    canJump = true,
    isJumping = false,
    moveLeft = false,
    moveRight = false,
    isPlayingGroundedAnim = false,
    wasGrounded = false;

  // ====== CONTROLS ========================================================

  // ====== ENTITIES ========================================================

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


  gameInstance!.onKeyDown(['left', 'a', 'q'], () => {
    moveLeft = true;
    player.flipX = true;
  });

  gameInstance!.onKeyDown(['right', 'd'], () => {
    moveRight = true;
    player.flipX = false;
  });
  gameInstance!.onKeyRelease(['left', 'a', 'q'], () => {
    moveLeft = false;
  });

  gameInstance!.onKeyRelease(['right', 'd'], () => {
    moveRight = false;
  });


  // JUMP
  gameInstance!.onKeyPress(['space', 'up', 'w', 'z', 'x'], () => {

    if (player.isGrounded() && canJump) {
      isJumping = true;
      canJump = false;
      if (isPlayingGroundedAnim) {
        isPlayingGroundedAnim = false;
      }
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
    const isGrounded = player.isGrounded();

    if (isGrounded && !wasGrounded && !isPlayingGroundedAnim) {
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

    if (isGrounded && !isJumping) {

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

    try {
      if (!isPlayingGroundedAnim) {
        const isActuallyMoving = Math.abs(player.vel.x) > 10;

        let targetAnim: string | null = null;

        if (!isGrounded && player.vel.y > 0) {
          // Tombe
          targetAnim = ANIMS.FALL;
        } else if (!isGrounded && player.vel.y < 0) {
          // Saute 
          //  targetAnim = ANIMS.JUMP;
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