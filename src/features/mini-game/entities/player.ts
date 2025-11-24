import type Kaplay from 'kaplay';
export function createPlayer(gameInstance: ReturnType<typeof Kaplay>, { levelWidth, levelHeight, BASE_URL }: { levelWidth: number, levelHeight: number, BASE_URL: string }) {


  // ====== RESOURCES ========================================================
  gameInstance.loadAseprite("lulu", `${BASE_URL}/entities/lulu.png`, `${BASE_URL}/entities/lulu.json`);

  gameInstance.loadSound('jump', `${BASE_URL}/sounds/jump.mp3`).catch(() => {
    console.debug('Son jump non disponible');
  });

  // ====== VARIABLES ========================================================

  let
    canJump = true,
    moveLeft = false,
    moveRight = false;

  // ====== CONTROLS ========================================================

  // ====== ENTITIES ========================================================

  const player = gameInstance!.add([
    gameInstance!.sprite('lulu', {
      anim: 'stand',
    }),
    gameInstance!.pos(Math.round(30), Math.round(140)),
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

  gameInstance!.onKeyPress(['space', 'up', 'w', 'z', 'x'], () => {
    if (player.isGrounded() && canJump) {
      canJump = false;
      player.jump(400);
      try {
        gameInstance!.play('jump');
      } catch (e) {

      }
      try {
        player.play('grounded');
      } catch (e) {
      }
    }
  });


  player.onUpdate(() => {
    if (player.isGrounded()) {
      canJump = true;
    }

    if (moveLeft) {
      if (player.isGrounded()) {
        player.vel.x = -150;
      } else {
        player.vel.x = -100;
      }
    } else if (moveRight) {
      if (player.isGrounded()) {
        player.vel.x = 150;
      } else {
        player.vel.x = 100;
      }
    } else {
      player.vel.x = 0;
    }

    try {
      const isActuallyMoving = Math.abs(player.vel.x) > 10;

      let targetAnim: string | null = null;

      if (!player.isGrounded() && player.vel.y !== 0) {
        targetAnim = 'grounded';
      } else if (player.isGrounded() && !isActuallyMoving) {
        targetAnim = 'stand';
      } else if (player.isGrounded() && isActuallyMoving) {
        targetAnim = 'walk';
      }

      if (targetAnim && player.curAnim() !== targetAnim) {
        player.play(targetAnim);
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