import type kaplay from "kaplay";
import type { createPlayer } from "./player";
import { openGamePanelInfo } from "../game-panel-info.ctrl";
import { CONTROLS } from "../mini-game.const";

export const createBomberman = (gameInstance: ReturnType<typeof kaplay>, { position, player }: { position: { x: number, y: number }, player: ReturnType<typeof createPlayer> }) => {
  if (!gameInstance || !player) return;

  let onCollide = false,
    timeoutResetEntity: ReturnType<typeof setTimeout> | null = null;

  const params = [
    gameInstance.sprite('bomberman'),
    gameInstance.pos(position.x, position.y),
    gameInstance.area(),
    gameInstance.body({ isStatic: true }),
    gameInstance.platformEffector({ ignoreSides: [gameInstance!.LEFT, gameInstance!.RIGHT, gameInstance!.UP], }),
    'bomberman',
    `id-b4b2cb37-9ac7-4a0b-9416-d3b7cd6fc8ff`,
  ]
  let bomberman = gameInstance.add(params);

  bomberman.play('start');

  player.onCollide('bomberman', () => {
    if (onCollide) return;
    onCollide = true;
  });

  player.onCollideEnd('bomberman', () => {
    onCollide = false;
  });

  gameInstance.onKeyPress(CONTROLS.INTERACT as unknown as string[], () => {
    if (!onCollide) return;
    if (timeoutResetEntity) clearTimeout(timeoutResetEntity);

    gameInstance.play('explosion');
    bomberman.play('explode', {
      loop: false,
      onEnd() {
        bomberman.destroy();
        openGamePanelInfo("b4b2cb37-9ac7-4a0b-9416-d3b7cd6fc8ff");
        timeoutResetEntity = setTimeout(() => {
          onCollide = false;
          bomberman = gameInstance.add(params);
        }, 10000);
      }
    });

  });

}