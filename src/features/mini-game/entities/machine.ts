import type kaplay from "kaplay";

export function createMachine(gameInstance: ReturnType<typeof kaplay>, { position, spriteName, idPanel }: { position: { x: number, y: number }, spriteName: string, idPanel: string }) {
  if (!gameInstance) return;

  // ====== VARIABLES ========================================================

  const ANIMS = {
    START: 'start',
  }

  // ====== ENTITIES ========================================================

  gameInstance.add([
    gameInstance.sprite(spriteName),
    gameInstance.pos(position.x + 4, position.y),
    gameInstance.color(0, 0, 0),
    gameInstance.offscreen({ hide: true }),
    gameInstance.z(-100),
    gameInstance.opacity(0.1),
    'shadow'
  ],
  );


  const computerSpace = gameInstance.add([
    gameInstance.sprite(spriteName),
    gameInstance.pos(position.x, position.y),
    gameInstance.area(),
    gameInstance.offscreen({ hide: true }),
    gameInstance.z(-100),
    spriteName,
    `id-${idPanel}`,
    'machine'
  ]);

  computerSpace.play(ANIMS.START);

  return computerSpace;
}