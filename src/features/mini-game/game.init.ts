import kaplay from "kaplay";
import { gameState } from './game-state';
import { BASE_URL } from "./mini-game.const";

let gameInstance: ReturnType<typeof kaplay> | null = null;

export const cleanupGame = () => {
  if (gameInstance) {
    try {
      const containerRef = document.getElementById('mini-game-container') as HTMLDivElement | null;
      if (containerRef) {
        containerRef.innerHTML = '';
      }
      gameInstance = null;
    } catch (error) {
      console.error('Erreur lors du nettoyage de kaplay:', error);
    }
  }
};

export const initGame = () => {
  if (gameInstance) {
    return gameInstance;
  }

  const containerRef = document.getElementById('mini-game-container') as HTMLDivElement | null;
  if (!containerRef) {
    console.error('Container mini-game-container non trouvé');
    return null;
  }

  const containerWidth = containerRef.clientWidth || 800;
  const containerHeight = containerRef.clientHeight || 600;

  const pixelHeight = Math.round(containerHeight / (32 * 6));
  gameInstance = kaplay({
    width: Math.floor(containerWidth / pixelHeight),
    height: Math.floor(containerHeight / pixelHeight),
    root: containerRef,
    scale: pixelHeight,
    background: [109, 135, 183],
    touchToMouse: true,
    crisp: true,
    pixelDensity: 1,
  });

  // Pixel perfect ?
  const canvas = containerRef.querySelector('canvas');
  if (canvas) {
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';
    // Permettre le scroll sur le canvas (mobile)
    canvas.style.touchAction = 'pan-y';
    canvas.style.pointerEvents = 'auto';

    // Gestion du scroll desktop (wheel)
    canvas.addEventListener('wheel', (e) => {
      //FOR WINDOW SCROLL
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        window.scrollBy({
          top: e.deltaY,
        });
        return;
      }
    }, { passive: true });


    let touchStartY = 0;
    let touchStartX = 0;
    let isScrolling = false;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isScrolling = false;
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && !isScrolling) {
        const touchY = e.touches[0].clientY;
        const touchX = e.touches[0].clientX;
        const deltaY = touchStartY - touchY;
        const deltaX = touchStartX - touchX;

        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
          isScrolling = true;
          // Permettre le scroll de la fenêtre
          window.scrollBy({
            top: deltaY * 10,
            behavior: 'smooth'
          });
        }
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      isScrolling = false;
      touchStartY = 0;
      touchStartX = 0;
    }, { passive: true });
  }

  gameInstance.loadAseprite("lulu", `${BASE_URL}/entities/lulu.png`, `${BASE_URL}/entities/lulu.json`);


  gameInstance.loadSprite('tileset', `${BASE_URL}/tiles/start.png`, {
    sliceX: 8,  // Largeur de chaque tile
    sliceY: 8,  // Hauteur de chaque tile
  });

  gameInstance.loadSprite('background', `${BASE_URL}/tiles/test.png`);

  gameInstance.loadSound('jump', `${BASE_URL}/sounds/jump.mp3`).catch(() => {
    console.debug('Son jump non disponible');
  });
  gameInstance.loadSound('spike', `${BASE_URL}/sounds/spike.mp3`).catch(() => {
    console.debug('Son spike non disponible');
  });

  // Créer la scène de démarrage
  //TODO faire une scène MOBILE ? 
  gameInstance.scene('start', () => {
    gameState.level = 1;
    gameState.isGameStarted = true;

    const levelWidth = 3376;
    const levelHeight = 480;

    gameInstance!.add([
      gameInstance!.sprite('background'),
      gameInstance!.pos(0, -100),
      gameInstance!.anchor('topleft'),
      gameInstance!.z(-100),
    ]);


    // MUR GAUCHE
    gameInstance!.add([
      gameInstance!.rect(2, 300),
      gameInstance!.pos(0, 0),
      gameInstance!.area(),
      gameInstance!.body({ isStatic: true }),
      gameInstance!.color(255, 0, 0),
      gameInstance!.opacity(0),
      'platform',
      'ground',
    ]);

    // MUR DROIT
    gameInstance!.add([
      gameInstance!.rect(2, 300),
      gameInstance!.pos(levelWidth - 500, 0),
      gameInstance!.area(),
      gameInstance!.body({ isStatic: true }),
      gameInstance!.color(255, 0, 0),
      gameInstance!.opacity(0),
      'platform',
      'ground',
    ]);

    // Sol statique
    gameInstance!.add([
      gameInstance!.rect(levelWidth, 1),
      gameInstance!.pos(0, 156),
      gameInstance!.area(),
      gameInstance!.body({ isStatic: true }),
      gameInstance!.color(255, 0, 0),
      gameInstance!.opacity(0),
      'platform',
      'ground',
    ]);




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


    let canJump = true;
    let moveLeft = false;
    let moveRight = false;
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

    gameInstance!.setGravity(2400);

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
  });

  gameInstance.go('start');

  return gameInstance;
};
