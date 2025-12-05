import type { VoidComponent } from 'solid-js';
import { onMount, onCleanup, createSignal } from 'solid-js';
import { initGame, cleanupGame, getGameInstance } from './game.init';
import { CANVAS_ID } from './mini-game.const';
import { langCtrl } from '~/features/lang-selector/lang.ctrl';
import { GamePanelInfo } from './game-panel-info';
import { HUD } from './hud';


const miniGameTxt = {
  alt: {
    fr: 'Contrôlez Lulu pour explorer le musée',
    en: 'Control Lulu to explore the museum',
  },
  reset: {
    fr: 'Réinitialiser le jeu',
    en: 'Reset game',
  },
}

export const MiniGame: VoidComponent = () => {
  let containerRef: HTMLDivElement | undefined;
  const lang = langCtrl();
  const [showResetButton, setShowResetButton] = createSignal(false);
  let checkInterval: number | undefined;
  let resizeTimeout: number | undefined;

  const checkGameHealth = () => {
    if (typeof window === 'undefined') return;

    const game = getGameInstance();
    const container = document.getElementById(CANVAS_ID);
    const canvas = container?.querySelector('canvas');

    const containerWidth = container?.clientWidth || 0;
    const containerHeight = container?.clientHeight || 0;
    const canvasWidth = canvas?.width || 0;
    const canvasHeight = canvas?.height || 0;

    const isCanvasValid = canvas &&
      canvasWidth > 0 &&
      canvasHeight > 0 &&
      containerWidth > 0 &&
      containerHeight > 0;

    let isGameResponsive = false;
    try {
      if (game) {
        isGameResponsive =
          typeof game.width === 'function' &&
          typeof game.height === 'function' &&
          typeof game.quit === 'function';

        if (isGameResponsive) {
          const gameWidth = game.width?.() || 0;
          const gameHeight = game.height?.() || 0;
          if (gameWidth === 0 || gameHeight === 0) {
            isGameResponsive = false;
          }
        }
      }
    } catch (e) {
      isGameResponsive = false;
    }

    const isContainerVisible = container &&
      window.getComputedStyle(container).display !== 'none' &&
      containerWidth > 100 &&
      containerHeight > 100;

    const shouldShow = Boolean(isContainerVisible && (!isCanvasValid || !isGameResponsive));
    setShowResetButton(shouldShow);
  };

  const handleReset = () => {
    setShowResetButton(false);
    cleanupGame();
    setTimeout(() => {
      if (containerRef && typeof window !== 'undefined') {
        const container = document.getElementById(CANVAS_ID);
        if (container) {
          container.innerHTML = '';
        }
        initGame().then(async () => {
          // Réappliquer le volume après réinitialisation
          const { getSoundCtrl } = await import('./sound.ctrl');
          const soundCtrl = getSoundCtrl();
          soundCtrl.applyMute(soundCtrl.isMuted());
          setTimeout(() => {
            checkGameHealth();
          }, 500);
        });
      }
    }, 200);
  };

  const handleResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = window.setTimeout(() => {
      checkGameHealth();
    }, 500);
  };

  onMount(() => {
    if (typeof window === 'undefined' || !containerRef) {
      return;
    }
    initGame();

    checkInterval = window.setInterval(checkGameHealth, 2000);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    setTimeout(checkGameHealth, 1000);
  });

  onCleanup(() => {
    cleanupGame();
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    }
  });

  return (
    <div class="w-full h-full relative">
      <div
        id={CANVAS_ID}
        ref={containerRef}
        aria-label={miniGameTxt.alt[lang() as keyof typeof miniGameTxt.alt]}
        class="w-full h-full relative overflow-hidden"
        style={{
          'image-rendering': 'pixelated',
          'touch-action': 'pan-y',
          'pointer-events': 'auto',
        }}
      />
      <GamePanelInfo />
      <HUD />

      <button
        onClick={handleReset}
        class={`absolute top-4 right-4 z-50 bg-black/80 hover:bg-black text-white rounded-full w-12 h-12 flex items-center justify-center border-2 border-white/50 backdrop-blur-sm transition-all active:scale-95 ${showResetButton()
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
        title={miniGameTxt.reset[lang() as keyof typeof miniGameTxt.reset]}
        aria-label={miniGameTxt.reset[lang() as keyof typeof miniGameTxt.reset]}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};
