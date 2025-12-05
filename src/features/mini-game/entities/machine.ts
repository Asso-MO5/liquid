import type kaplay from "kaplay";

export function createMachine(gameInstance: ReturnType<typeof kaplay>, { position, spriteName, idPanel }: { position: { x: number, y: number }, spriteName: string, idPanel: string }) {
  if (!gameInstance) return;

  gameInstance.add([
    gameInstance.sprite(spriteName),
    gameInstance.pos(position.x + 4, position.y),
    gameInstance.color(0, 0, 0),
    gameInstance.offscreen({ hide: true }),
    gameInstance.z(-100),
    gameInstance.opacity(0.2),
    'shadow'
  ],
  );

  const machine = gameInstance.add([
    gameInstance.sprite(spriteName),
    gameInstance.pos(position.x, position.y),
    gameInstance.area(),
    gameInstance.offscreen({ hide: true }),
    gameInstance.z(-100),
    spriteName,
    `id-${idPanel}`,
    'machine'
  ]);

  machine.play('start');

  return machine;
}