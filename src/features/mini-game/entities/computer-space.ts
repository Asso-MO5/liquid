import type kaplay from "kaplay";
import { CONTROLS } from "../mini-game.const";
import { openGamePanelInfo } from "../game-panel-info.ctrl";


export function createComputerSpace(gameInstance: ReturnType<typeof kaplay>, { position, BASE_URL }: { position: { x: number, y: number }, BASE_URL: string }) {
  if (!gameInstance) return;

  // ====== RESOURCES ========================================================
  gameInstance.loadAseprite("computer-space", `${BASE_URL}/entities/computer-space.png`, `${BASE_URL}/entities/computer-space.json`);


  // ====== VARIABLES ========================================================

  let isPlayerNearby = false;

  const ANIMS = {
    START: 'start',
  }

  // ====== ENTITIES ========================================================

  gameInstance.add([
    gameInstance.sprite("computer-space"),

    gameInstance.pos(position.x + 4, position.y),
    gameInstance.color(0, 0, 0),
    gameInstance.z(-100),
    gameInstance.opacity(0.1),
    'shadow'
  ],

  );

  const computerSpace = gameInstance.add([
    gameInstance.sprite("computer-space"),
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

      openGamePanelInfo('11517969-f1f4-49ab-bf5f-8862b1f4db76')
      console.log('Interaction avec computer-space !');
    }
  });

  return computerSpace;
}