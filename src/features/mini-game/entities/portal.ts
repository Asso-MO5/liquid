import type kaplay from "kaplay";
import { LEVEL_NAMES } from "../mini-game.const";
import type { createPlayer } from "./player";

export function createPortal(gameInstance: ReturnType<typeof kaplay>, { position, player }: { position: { x: number, y: number, rotation: number, color: 'blue' | 'orange' }, player: ReturnType<typeof createPlayer> }) {
  if (!gameInstance) return;

  const portal = gameInstance.add([
    gameInstance.sprite('portal'),
    gameInstance.pos(position.x, position.y),
    gameInstance.rotate(position.rotation),
    gameInstance.area(),
    gameInstance.body({ isStatic: true }),
    gameInstance.offscreen({ hide: true }),
    gameInstance.color(position.color === 'blue' ? [105, 158, 252] : [200, 145, 62]),
    'portal',

  ])

  player.onCollide('portal', () => {
    gameInstance.go(LEVEL_NAMES.MOON_PATROL);
  });

  portal.play('start');

  return portal;


}