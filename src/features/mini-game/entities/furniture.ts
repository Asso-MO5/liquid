import type kaplay from "kaplay";

export function createFurniture(gameInstance: ReturnType<typeof kaplay>, { position, BASE_URL }: { position: { x: number, y: number }, BASE_URL: string }) {
  if (!gameInstance) return;

  gameInstance.loadAseprite('furniture', `${BASE_URL}/entities/furniture.png`, `${BASE_URL}/entities/furniture.json`);

  gameInstance.loadAseprite('games', `${BASE_URL}/entities/games.png`, `${BASE_URL}/entities/games.json`);


  const GAMES = ['invaders', 'tetris', 'pacman', 'et', 'rtype']

  const furniture = gameInstance.add([
    gameInstance.sprite('furniture'),
    gameInstance.pos(position.x, position.y),
    gameInstance.area(),
    gameInstance.z(-100),
    'furniture',
    'game',
  ]);

  const game = gameInstance.add([
    gameInstance.sprite('games'),
    gameInstance.pos(position.x + 6, position.y + 8),
    gameInstance.area(),
    gameInstance.z(-99),
    'gamepad',
    'game',
  ]);

  const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
  game.play(randomGame);

  return furniture;
}