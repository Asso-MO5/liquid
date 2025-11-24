import type { VoidComponent } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import { initGame, cleanupGame } from './game.init';
import { CANVAS_ID } from './mini-game.const';

export const MiniGame: VoidComponent = () => {
  let containerRef: HTMLDivElement | undefined;

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
      class="w-full h-full relative overflow-hidden"
      style={{
        'image-rendering': 'pixelated',
        'touch-action': 'pan-y',
        'pointer-events': 'auto',
      }}
    />
  );
};
