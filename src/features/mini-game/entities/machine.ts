import type kaplay from "kaplay";
import { CONTROLS } from "../mini-game.const";
import { openGamePanelInfo } from "../game-panel-info.ctrl";


export function createMachine(gameInstance: ReturnType<typeof kaplay>, { position, spriteName, idPanel }: { position: { x: number, y: number }, spriteName: string, idPanel: string }) {
  if (!gameInstance) return;

  // ====== VARIABLES ========================================================

  let isPlayerNearby = false;

  const ANIMS = {
    START: 'start',
  }

  // ====== ENTITIES ========================================================

  gameInstance.add([
    gameInstance.sprite(spriteName),
    gameInstance.pos(position.x + 4, position.y),
    gameInstance.color(0, 0, 0),
    gameInstance.z(-100),
    gameInstance.opacity(0.1),
    'shadow'
  ],
  );

  const computerSpace = gameInstance.add([
    gameInstance.sprite(spriteName),
    gameInstance.pos(position.x, position.y),
    gameInstance.area(),
    gameInstance.z(-100),
    'computer-space',
    'game'
  ]);

  computerSpace.play(ANIMS.START);

  computerSpace.onCollide('player', () => {
    isPlayerNearby = true;
  });

  computerSpace.onCollideEnd('player', () => {
    isPlayerNearby = false;
  });

  gameInstance.onKeyPress(CONTROLS.INTERACT as unknown as string[], () => {
    if (isPlayerNearby) {
      openGamePanelInfo(idPanel)
    }
  });

  return computerSpace;
}