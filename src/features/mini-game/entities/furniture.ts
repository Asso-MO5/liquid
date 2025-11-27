import type kaplay from "kaplay";

export function createFurniture(gameInstance: ReturnType<typeof kaplay>, { position, BASE_URL }: { position: { x: number, y: number }, BASE_URL: string }) {
  if (!gameInstance) return;

  gameInstance.loadAseprite('furniture', `${BASE_URL}/entities/furniture.png`, `${BASE_URL}/entities/furniture.json`);

  const ANIMS = {
    START: 'start',
  }

  const furniture = gameInstance.add([
    gameInstance.sprite('furniture'),
    gameInstance.pos(position.x, position.y),
    gameInstance.area(),
    gameInstance.z(-100),
    'furniture',
    'game',
  ]);



  const timeoutAnimValue = Math.random() * 1000 + Math.random() * 10;
  setTimeout(() => {
    if (!gameInstance || !furniture) return;
    furniture.play(ANIMS.START);
  }, timeoutAnimValue);

  return furniture;
}