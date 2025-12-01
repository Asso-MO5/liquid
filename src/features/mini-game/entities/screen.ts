import type kaplay from "kaplay";

export function createScreen(gameInstance: ReturnType<typeof kaplay>, { position }: { position: { x: number, y: number } }) {
  if (!gameInstance) return;

  const GAMES = [{
    name: 'invaders',
    id: '3afed56d-b82e-4c10-992d-e2b5a9b7e844',
  }, {
    name: 'tetris',
    id: '499289a2-dc67-4e66-83dd-34b43ba442dc',
  }, {
    name: 'pacman',
    id: '8010c391-b057-4de9-ad0f-2e5d615cb592',
  }, {
    name: 'et',
    id: 'c263ce23-8f44-4047-8670-f9b88a526136',
  }, {
    name: 'rtype',
    id: '97fd2762-1763-4faa-bc5b-f68faf4338fe',
  }]

  const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];

  const game = gameInstance.add([
    gameInstance.sprite('games'),
    gameInstance.pos(position.x + 6, position.y + 8),
    gameInstance.area(),
    gameInstance.z(-99),
    'machine',
    `id-${randomGame.id}`,
  ]);
  game.play(randomGame.name);

  return game;
}