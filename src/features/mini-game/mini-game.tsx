import type { VoidComponent } from 'solid-js';
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';


import { initGame } from './game.init';


type MiniGameProps = {
  init: boolean
}
export const MiniGame: VoidComponent<MiniGameProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  const [initialized, setInitialized] = createSignal(false)

  createEffect(() => {
    if (props.init && !initialized()) {
      setInitialized(true)
    }
  })

  onMount(async () => {
    if (typeof window === 'undefined' || !initialized) {
      return;
    }
    const me = initGame()
    if (!me || !containerRef) return;
  });
  onCleanup(() => {
    if (typeof window === 'undefined') return;
  });

  return (
    <div
      id="mini-game-container"
      ref={containerRef}
      class="w-full h-full relative overflow-hidden"
    />
  );
};
