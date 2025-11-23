import type { VoidComponent } from 'solid-js';
import type * as Me from 'melonjs';
import { createEffect, createSignal, onMount } from 'solid-js';

import { initGame } from './game.init';


type MiniGameProps = {
  withGame: boolean
}


const [me, setMe] = createSignal<typeof Me | undefined>(undefined);

export const MiniGame: VoidComponent<MiniGameProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  const [initialized, setInitialized] = createSignal(false)

  createEffect(() => {
    if (!initialized()) {
      setInitialized(true)
    }
  })

  createEffect(() => {

    const meInstance = me()

    if (!meInstance) return;

    if (!props.withGame) {
      meInstance.input.unbindKey(meInstance.input.KEY.LEFT)
      meInstance.input.unbindKey(meInstance.input.KEY.RIGHT)
      meInstance.input.unbindKey(meInstance.input.KEY.X)
      meInstance.input.unbindKey(meInstance.input.KEY.UP)
      meInstance.input.unbindKey(meInstance.input.KEY.SPACE)
      meInstance.input.unbindKey(meInstance.input.KEY.DOWN)
      meInstance.input.unbindKey(meInstance.input.KEY.CTRL)
      meInstance.input.unbindKey(meInstance.input.KEY.Q)
      meInstance.input.unbindKey(meInstance.input.KEY.D)
      meInstance.input.unbindKey(meInstance.input.KEY.Z)
      meInstance.input.unbindKey(meInstance.input.KEY.S)
    } else {
      meInstance.input.bindKey(meInstance.input.KEY.LEFT, 'left')
      meInstance.input.bindKey(meInstance.input.KEY.RIGHT, 'right')
      meInstance.input.bindKey(meInstance.input.KEY.X, 'jump', true)
      meInstance.input.bindKey(meInstance.input.KEY.UP, 'jump', true)
      meInstance.input.bindKey(meInstance.input.KEY.SPACE, 'jump', true)
      meInstance.input.bindKey(meInstance.input.KEY.DOWN, 'down')
      meInstance.input.bindKey(meInstance.input.KEY.CTRL, 'interact', true)
      meInstance.input.bindKey(meInstance.input.KEY.Q, 'left')
      meInstance.input.bindKey(meInstance.input.KEY.D, 'right')
      meInstance.input.bindKey(meInstance.input.KEY.Z, 'jump', true)
      meInstance.input.bindKey(meInstance.input.KEY.S, 'down')
    }

  })

  onMount(async () => {
    if (typeof window === 'undefined' || !initialized()) {
      return;
    }
    const meInstance = initGame()
    if (!meInstance) return;
    setMe(meInstance)
  });

  return (
    <div
      id="mini-game-container"
      ref={containerRef}
      data-with-game={props.withGame}
      class="w-full h-full relative overflow-hidden data-[with-game=true]:touch-none data-[with-game=false]:touch-auto data-[with-game=true]:pointer-events-auto data-[with-game=false]:pointer-events-none"
    />
  );
};
