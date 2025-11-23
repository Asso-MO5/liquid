import type { VoidComponent } from 'solid-js';
import { onMount, onCleanup } from 'solid-js';
import { initGame, cleanupGame } from './game.init';

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
      id="mini-game-container"
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
