import type { VoidComponent } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import { initGame, cleanupGame } from './game.init';
import { CANVAS_ID } from './mini-game.const';
import { langCtrl } from '~/features/lang-selector/lang.ctrl';


const miniGameTxt = {
  alt: {
    fr: 'Controlez Lulu pour explorer le musée',
    en: 'Control Lulu to explore the museum',
  },
}

export const MiniGame: VoidComponent = () => {
  let containerRef: HTMLDivElement | undefined;
  const lang = langCtrl()

  onMount(() => {
    if (typeof window === 'undefined' || !containerRef) {
      return;
    }
    initGame();
  });

  onCleanup(() => {
    cleanupGame();
  });

  return (
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
  );
};
