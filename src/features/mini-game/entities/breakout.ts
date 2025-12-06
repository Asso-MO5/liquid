import type kaplay from "kaplay";
import type { createPlayer } from "./player";
import { openGamePanelInfo } from "../game-panel-info.ctrl";

export function createBreakout(gameInstance: ReturnType<typeof kaplay>, { position, player }: { position: { x: number, y: number }, player: ReturnType<typeof createPlayer> }) {
  if (!gameInstance) return;

  const bricks = [
    [166, 167, 37],
    [166, 167, 37],
    [26, 107, 5],
    [26, 107, 5],
    [11, 63, 0],
    [11, 63, 0],
    [130, 46, 36]
  ]

  let bricksCount = 0,
    timeoutResetBricks: ReturnType<typeof setTimeout> | null = null;

  const createBricks = () => {

    for (const [index, brick] of bricks.entries()) {
      const [r, g, b] = brick
      Array.from({ length: 5 }).forEach((_, i) => {
        gameInstance.add([
          gameInstance.rect(16, 4),
          gameInstance.pos(position.x + i * (16 + 3), position.y - index * (4 + 3)),
          gameInstance.area(),
          gameInstance.color(r, g, b),
          gameInstance.body({ isStatic: true }),
          gameInstance.offscreen({ hide: true }),
          'breakout',
        ])

        bricksCount++;
      })
    }
  }

  createBricks();

  player.onCollide('breakout', (brick, entity) => {
    if (timeoutResetBricks) clearTimeout(timeoutResetBricks);
    if (!brick?.destroy) return;
    if (entity?.normal?.y !== 1) return;
    brick.destroy()
    bricksCount--;
    gameInstance.play('hurt');
    if (bricksCount <= 0) {
      openGamePanelInfo('43e35f69-a93d-4c82-9fc2-fe588cefc31e');
      timeoutResetBricks = setTimeout(() => {
        createBricks();
      }, 10000);
    }
  })
}