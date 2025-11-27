import kaplay from "kaplay";
import { CANVAS_ID, FONTS, LEVEL_NAMES } from './mini-game.const';
import { createStartScene } from "./scene/start.scene";

let gameInstance: ReturnType<typeof kaplay> | null = null;

export const getGameInstance = () => gameInstance;

export const cleanupGame = () => {
  if (gameInstance) {
    try {
      const containerRef = document.getElementById(CANVAS_ID) as HTMLDivElement | null;
      gameInstance.quit();
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

  const BASE_URL = `${window.location.protocol}//${window.location.host}/game`;

  if (gameInstance) return gameInstance;

  const containerRef = document.getElementById(CANVAS_ID) as HTMLDivElement | null;
  if (!containerRef) {
    console.error(`Container ${CANVAS_ID} non trouvé`);
    return null;
  }


  const containerWidth = containerRef.clientWidth || 800;
  const containerHeight = containerRef.clientHeight || 600;

  const pixelHeight = Math.round(containerHeight / (32 * 6));

  // ============================== GAME INSTANCE ==============================

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

  // ============================== CANVAS ==============================
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

  if (!gameInstance) return null;

  // ====== RESOURCES ========================================================
  gameInstance.loadAseprite("computer-space", `${BASE_URL}/entities/computer-space.png`, `${BASE_URL}/entities/computer-space.json`);
  gameInstance.loadAseprite('furniture', `${BASE_URL}/entities/furniture.png`, `${BASE_URL}/entities/furniture.json`);
  gameInstance.loadAseprite('games', `${BASE_URL}/entities/games.png`, `${BASE_URL}/entities/games.json`);


  // ====== FONTS ========================================================

  gameInstance.loadFont(FONTS.SILKSCREEN, `${BASE_URL}/fonts/Silkscreen/Silkscreen-Regular.ttf`);
  gameInstance.loadFont(FONTS.SILKSCREEN_BOLD, `${BASE_URL}/fonts/Silkscreen/Silkscreen-Bold.ttf`);

  gameInstance!.setGravity(1500);

  // ============================== SCENES ==============================
  gameInstance.scene(LEVEL_NAMES.START, () => createStartScene(gameInstance, { BASE_URL }));

  // ============================== GO ==============================
  gameInstance.go(LEVEL_NAMES.START);

  return gameInstance;
};
