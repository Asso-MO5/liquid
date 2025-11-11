import type { MiniGameState } from "./mini-game.types";

export const gameState: MiniGameState = {
  score: 0,
  lives: 3,
  level: 1,
  texture: undefined,
  spriteData: undefined,
  isGameOver: false,
  isGameWon: false,
  isGamePaused: false,
  isGameStarted: false,
  isGameEnded: false,
}
