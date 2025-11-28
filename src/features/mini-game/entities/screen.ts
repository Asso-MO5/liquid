import type kaplay from "kaplay";

export function createScreen(gameInstance: ReturnType<typeof kaplay>, { position }: { position: { x: number, y: number } }) {
  if (!gameInstance) return;

  const GAMES = ['invaders', 'tetris', 'pacman', 'et', 'rtype']

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

  return game;
}